// Bring in the packages we need
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Bring in the database connection function
const connectDatabase = require("./db");

// Import the models
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const Reservation = require("./models/Reservation");
const Table = require("./models/Table");

// Load the .env file
dotenv.config();

// Connect to MongoDB
connectDatabase();

// Create the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Let the app use JSON and frontend requests
app.use(cors());
app.use(express.json());

/* ------------------------------ */
/* Basic test routes */
/* ------------------------------ */

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Another test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

/* ------------------------------ */
/* Admin dashboard stats route */
/* ------------------------------ */

app.get("/api/admin/stats", async (req, res) => {
  try {
    const adminStats = {
      totalUsers: await User.countDocuments(),
      totalMenuItems: await MenuItem.countDocuments(),
      totalOrders: await Order.countDocuments(),
      totalReservations: await Reservation.countDocuments(),
      totalTables: await Table.countDocuments()
    };

    res.json(adminStats);
  } catch (error) {
    console.log("Admin stats error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------ */
/* Menu item routes */
/* ------------------------------ */

// Get all menu items
app.get("/api/menuitems", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error getting menu items" });
  }
});

// Add a new menu item
app.post("/api/menuitems", async (req, res) => {
  try {
    const { itemName, category, price } = req.body;

    const newMenuItem = new MenuItem({
      itemName: itemName,
      category: category,
      price: price
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item" });
  }
});

// Update a menu item
app.put("/api/menuitems/:id", async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const { itemName, category, price } = req.body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      {
        itemName: itemName,
        category: category,
        price: price
      },
      { new: true }
    );

    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item" });
  }
});

// Delete a menu item
app.delete("/api/menuitems/:id", async (req, res) => {
  try {
    const menuItemId = req.params.id;

    await MenuItem.findByIdAndDelete(menuItemId);

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

/* ------------------------------ */
/* Admin reservation routes */
/* ------------------------------ */

// Get all reservations for admin
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("userId", "username");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error getting reservations" });
  }
});

// Add a reservation from admin side
app.post("/api/reservations", async (req, res) => {
  try {
    const { userId, customerName, tableNumber, reservationTime, approvalStatus } = req.body;

    const newReservation = new Reservation({
      userId: userId,
      customerName: customerName,
      tableNumber: tableNumber,
      reservationTime: reservationTime,
      approvalStatus: approvalStatus || "Pending"
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Error adding reservation" });
  }
});

// Update a reservation from admin side
app.put("/api/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { customerName, tableNumber, reservationTime, approvalStatus } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        customerName: customerName,
        tableNumber: tableNumber,
        reservationTime: reservationTime,
        approvalStatus: approvalStatus
      },
      { new: true }
    );

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation" });
  }
});

// Delete a reservation from admin side
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    await Reservation.findByIdAndDelete(reservationId);

    res.json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

// Approve or deny a reservation from admin side
app.put("/api/reservations/:id/approval", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { approvalStatus } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { approvalStatus: approvalStatus },
      { new: true }
    );

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating approval" });
  }
});

/* ------------------------------ */
/* Standard user reservation routes */
/* ------------------------------ */

// Get only this user's reservations
app.get("/api/my/reservations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const myReservations = await Reservation.find({ userId: userId });
    res.json(myReservations);
  } catch (error) {
    res.status(500).json({ message: "Error getting your reservations" });
  }
});

// Add a reservation for this user
app.post("/api/my/reservations", async (req, res) => {
  try {
    const { userId, customerName, tableNumber, reservationTime } = req.body;

    const newReservation = new Reservation({
      userId: userId,
      customerName: customerName,
      tableNumber: tableNumber,
      reservationTime: reservationTime,
      approvalStatus: "Pending"
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Error adding your reservation" });
  }
});

// Update only this user's reservation
app.put("/api/my/reservations/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { userId, customerName, tableNumber, reservationTime } = req.body;

    const updatedReservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, userId: userId },
      {
        customerName: customerName,
        tableNumber: tableNumber,
        reservationTime: reservationTime,
        approvalStatus: "Pending"
      },
      { new: true }
    );

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error updating your reservation" });
  }
});

// Delete only this user's reservation
app.delete("/api/my/reservations/:id/:userId", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.params.userId;

    await Reservation.findOneAndDelete({ _id: reservationId, userId: userId });

    res.json({ message: "Your reservation was deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting your reservation" });
  }
});

/* ------------------------------ */
/* Admin order routes */
/* ------------------------------ */

// Get all orders for admin
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username")
      .populate("items.menuItemId", "itemName price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
});

// Update order status from admin side
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// Delete an order from admin side
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    await Order.findByIdAndDelete(orderId);

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

/* ------------------------------ */
/* Standard user order routes */
/* ------------------------------ */

// Get only this user's orders
app.get("/api/my/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const myOrders = await Order.find({ userId: userId })
      .populate("items.menuItemId", "itemName price");

    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Error getting your orders" });
  }
});

// Add a new order for this user
app.post("/api/my/orders", async (req, res) => {
  try {
    const { userId, items } = req.body;

    const newOrder = new Order({
      userId: userId,
      items: items,
      status: "Pending"
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error adding your order" });
  }
});

// Delete only this user's order
app.delete("/api/my/orders/:id/:userId", async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.params.userId;

    await Order.findOneAndDelete({ _id: orderId, userId: userId });

    res.json({ message: "Your order was deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting your order" });
  }
});
/* ------------------------------ */
/* Login and register routes */
/* ------------------------------ */

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    // Get the form values
    const { username, password, role } = req.body;

    // Basic check
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if the username already exists
    const foundUser = await User.findOne({ username: username });

    if (foundUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Make a new user
    const newUser = new User({
      username: username,
      password: password,
      role: role
    });

    // Save the user
    await newUser.save();

    // Send back the new user info
    res.status(201).json({
      message: "Account created successfully",
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating account" });
  }
});

// Login a user
app.post("/api/auth/login", async (req, res) => {
  try {
    // Get the login values
    const { username, password } = req.body;

    // Find the user
    const foundUser = await User.findOne({ username: username });

    // If the user does not exist
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check the password
    if (foundUser.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Send back the user info
    res.json({
      message: "Login successful",
      userId: foundUser._id,
      username: foundUser.username,
      role: foundUser.role
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});