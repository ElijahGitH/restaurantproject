const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  customerName: {
    type: String,
    required: true
  },
  tableNumber: {
    type: String,
    required: true
  },
  partySize: {
    type: Number,
    required: true
  },
  reservationTime: {
    type: String,
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Denied"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);