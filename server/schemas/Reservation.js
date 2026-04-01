// Import mongoose
const mongoose = require("mongoose");

// Make the reservation schema
const reservationSchema = new mongoose.Schema({
  // Which user created this reservation
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Name of the customer
  customerName: {
    type: String,
    required: true
  },

  // The table number they reserved
  tableNumber: {
    type: Number,
    required: true
  },

  // Reservation date and time
  reservationTime: {
    type: String,
    required: true
  },

  // Admin approval status
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Denied"],
    default: "Pending"
  }
});

// Export the reservation model
module.exports = mongoose.model("Reservation", reservationSchema);