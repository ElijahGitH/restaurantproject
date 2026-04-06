const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true
  },
  seats: {
    type: Number,
    required: true
  },
  tableType: {
    type: String,
    enum: ["table", "booth", "bar"],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Table", tableSchema);