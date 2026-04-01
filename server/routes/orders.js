const express = require("express");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const MenuItem = require("../models/MenuItem");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error getting orders", error: err.message });
  }
});

router.put("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await OrderItem.deleteMany({ orderId: req.params.id });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error getting your orders", error: err.message });
  }
});

router.get("/my/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const items = await OrderItem.find({ orderId: order._id }).populate("menuItemId");
    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ message: "Error getting your order", error: err.message });
  }
});

router.post("/my", verifyToken, async (req, res) => {
  try {
    const { items, notes } = req.body;
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) return res.status(404).json({ message: "Menu item not found" });
      totalPrice += menuItem.price * item.quantity;
      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrder: menuItem.price,
      });
    }

    const order = new Order({
      userId: req.user.id,
      totalPrice,
      notes: notes || "",
      status: "pending",
    });
    await order.save();

    const orderItems = orderItemsData.map((item) => ({ ...item, orderId: order._id }));
    await OrderItem.insertMany(orderItems);

    res.status(201).json({ order, items: orderItems });
  } catch (err) {
    res.status(500).json({ message: "Error placing your order", error: err.message });
  }
});

router.delete("/my/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Order.findByIdAndDelete(req.params.id);
    await OrderItem.deleteMany({ orderId: req.params.id });
    res.json({ message: "Your order was cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling your order", error: err.message });
  }
});

module.exports = router;