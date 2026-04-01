// Import mongoose
const mongoose = require("mongoose");

// Make the order schema
const orderSchema = new mongoose.Schema({
  // Which user made the order
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Items inside the order
  items: [
    {
      // Which menu item was ordered
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true
      },

      // How many of that item
      quantity: {
        type: Number,
        required: true
      }
    }
  ],

  // Current order status
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Completed", "Cancelled"],
    default: "Pending"
  }
});

// Export the order model
module.exports = mongoose.model("Order", orderSchema);