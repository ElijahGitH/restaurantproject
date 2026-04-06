require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const Reservation = require("./models/Reservation");
const Table = require("./models/Table");

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "CasaDelSol123";

app.use(cors());
app.use(express.json());

async function seedTables() {
  const existingTables = await Table.countDocuments();

  if (existingTables > 0) {
    return;
  }

  const tablesToInsert = [];

  for (let i = 1; i <= 20; i++) {
    tablesToInsert.push({
      tableNumber: String(i),
      seats: i % 5 === 0 ? 6 : 4,
      tableType: i % 5 === 0 ? "booth" : "table",
      isAvailable: true
    });
  }

  for (let i = 21; i <= 37; i++) {
    tablesToInsert.push({
      tableNumber: `bar-${i}`,
      seats: 1,
      tableType: "bar",
      isAvailable: true
    });
  }

  await Table.insertMany(tablesToInsert);
  console.log("Tables seeded");
}

async function syncTableAvailability(tableNumber) {
  if (!tableNumber) {
    return;
  }

  const activeReservations = await Reservation.countDocuments({
    tableNumber: String(tableNumber),
    approvalStatus: { $ne: "Denied" }
  });

  await Table.findOneAndUpdate(
    { tableNumber: String(tableNumber) },
    { isAvailable: activeReservations === 0 }
  );
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedTables();
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ------------------------------ */
/* Auth routes */
/* ------------------------------ */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
      return res.status(400).json({ message: "That username is reserved" });
    }

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      username: username,
      password: password,
      role: "user"
    });

    await newUser.save();

    res.status(201).json({
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({
        userId: "admin-local",
        username: ADMIN_USERNAME,
        role: "admin"
      });
    }

    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (foundUser.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      userId: foundUser._id,
      username: foundUser.username,
      role: foundUser.role
    });
  } catch (error) {
    res.status(500).json({ message: "Could not log in" });
  }
});

/* ------------------------------ */
/* Admin stats route */
/* ------------------------------ */

app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalTables = await Table.countDocuments();

    res.json({
      totalUsers: totalUsers,
      totalMenuItems: totalMenuItems,
      totalOrders: totalOrders,
      totalReservations: totalReservations,
      totalTables: totalTables
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load admin stats" });
  }
});

/* ------------------------------ */
/* Seasonal menu item routes */
/* ------------------------------ */

app.get("/api/menuitems", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Could not load menu items" });
  }
});

app.post("/api/menuitems", async (req, res) => {
  try {
    const { itemName, category, price } = req.body;

    const newMenuItem = new MenuItem({
      itemName: itemName,
      category: category,
      price: Number(price)
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Could not add menu item" });
  }
});

app.delete("/api/menuitems/:id", async (req, res) => {
  try {
    const menuItemId = req.params.id;

    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete menu item" });
  }
});

/* ------------------------------ */
/* Table routes */
/* ------------------------------ */

app.get("/api/tables", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Could not load tables" });
  }
});

/* ------------------------------ */
/* Admin reservation routes */
/* ------------------------------ */

app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "username")
      .sort({ reservationTime: 1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Could not load reservations" });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const {
      userId,
      customerName,
      tableNumber,
      partySize,
      reservationTime,
      approvalStatus
    } = req.body;

    if (!customerName || !tableNumber || !partySize || !reservationTime) {
      return res.status(400).json({ message: "Please fill in all reservation fields" });
    }

    const newReservationData = {
      customerName: customerName.trim(),
      tableNumber: String(tableNumber),
      partySize: Number(partySize),
      reservationTime: reservationTime,
      approvalStatus: approvalStatus || "Pending"
    };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      newReservationData.userId = userId;
    }

    const newReservation = new Reservation(newReservationData);

    await newReservation.save();
    await syncTableAvailability(tableNumber);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Error adding reservation" });
  }
});

app.put("/api/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const {
      customerName,
      tableNumber,
      partySize,
      reservationTime,
      approvalStatus
    } = req.body;

    if (!customerName || !tableNumber || !partySize || !reservationTime) {
      return res.status(400).json({ message: "Please fill in all reservation fields" });
    }

    const oldReservation = await Reservation.findById(reservationId);

    if (!oldReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        customerName: customerName.trim(),
        tableNumber: String(tableNumber),
        partySize: Number(partySize),
        reservationTime: reservationTime,
        approvalStatus: approvalStatus
      },
      { new: true }
    );

    await syncTableAvailability(oldReservation.tableNumber);
    await syncTableAvailability(tableNumber);

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation" });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await syncTableAvailability(deletedReservation.tableNumber);

    res.json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

app.put("/api/reservations/:id/approval", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { approvalStatus } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { approvalStatus: approvalStatus },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await syncTableAvailability(updatedReservation.tableNumber);

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating approval" });
  }
});

/* ------------------------------ */
/* User reservation routes */
/* ------------------------------ */

app.get("/api/my/reservations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const reservations = await Reservation.find({ userId: userId }).sort({
      reservationTime: 1
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Could not load your reservations" });
  }
});

app.post("/api/my/reservations", async (req, res) => {
  try {
    const {
      userId,
      customerName,
      tableNumber,
      reservationTime,
      partySize
    } = req.body;

    if (!customerName || !tableNumber || !partySize || !reservationTime) {
      return res.status(400).json({ message: "Please fill in all reservation fields" });
    }

    const newReservation = new Reservation({
      userId: userId,
      customerName: customerName.trim(),
      tableNumber: String(tableNumber),
      reservationTime: reservationTime,
      partySize: Number(partySize),
      approvalStatus: "Pending"
    });

    await newReservation.save();
    await syncTableAvailability(tableNumber);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Could not add your reservation" });
  }
});

app.put("/api/my/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const {
      userId,
      customerName,
      tableNumber,
      reservationTime,
      partySize
    } = req.body;

    if (!customerName || !tableNumber || !partySize || !reservationTime) {
      return res.status(400).json({ message: "Please fill in all reservation fields" });
    }

    const oldReservation = await Reservation.findOne({
      _id: reservationId,
      userId: userId
    });

    if (!oldReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, userId: userId },
      {
        customerName: customerName.trim(),
        tableNumber: String(tableNumber),
        reservationTime: reservationTime,
        partySize: Number(partySize)
      },
      { new: true }
    );

    await syncTableAvailability(oldReservation.tableNumber);
    await syncTableAvailability(tableNumber);

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Could not update your reservation" });
  }
});

app.delete("/api/my/reservations/:id/:userId", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.params.userId;

    const deletedReservation = await Reservation.findOneAndDelete({
      _id: reservationId,
      userId: userId
    });

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await syncTableAvailability(deletedReservation.tableNumber);

    res.json({ message: "Your reservation was deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete your reservation" });
  }
});

/* ------------------------------ */
/* Admin order routes */
/* ------------------------------ */

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username")
      .populate("items.menuItemId", "itemName price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load orders" });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    )
      .populate("userId", "username")
      .populate("items.menuItemId", "itemName price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Could not update order status" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete order" });
  }
});

/* ------------------------------ */
/* User order routes */
/* ------------------------------ */

app.get("/api/my/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId: userId })
      .populate("items.menuItemId", "itemName price")
      .sort({ _id: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load your orders" });
  }
});

app.post("/api/my/orders", async (req, res) => {
  try {
    const { userId, items } = req.body;

    const cleanedItems = (items || [])
      .map((oneItem) => {
        if (oneItem.menuItemId) {
          return {
            menuItemId: oneItem.menuItemId,
            itemName: oneItem.itemName ? oneItem.itemName.trim() : undefined,
            itemSource: "seasonal",
            itemPrice:
              oneItem.itemPrice !== undefined && oneItem.itemPrice !== null
                ? Number(oneItem.itemPrice)
                : undefined,
            quantity: Number(oneItem.quantity)
          };
        }

        if (oneItem.itemName) {
          return {
            itemName: oneItem.itemName.trim(),
            itemSource: "static",
            itemPrice:
              oneItem.itemPrice !== undefined && oneItem.itemPrice !== null
                ? Number(oneItem.itemPrice)
                : undefined,
            quantity: Number(oneItem.quantity)
          };
        }

        return null;
      })
      .filter(Boolean);

    if (cleanedItems.length === 0) {
      return res.status(400).json({ message: "No valid order items were sent" });
    }

    const newOrder = new Order({
      userId: userId,
      items: cleanedItems,
      status: "Pending"
    });

    await newOrder.save();

    const savedOrder = await Order.findById(newOrder._id).populate(
      "items.menuItemId",
      "itemName price"
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Could not submit your order" });
  }
});

app.delete("/api/my/orders/:id/:userId", async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.params.userId;

    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      userId: userId
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Your order was deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete your order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});