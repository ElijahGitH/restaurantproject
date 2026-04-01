// Import mongoose
const mongoose = require("mongoose");

// Make the table schema
const tableSchema = new mongoose.Schema({
  // Table number like 1, 2, 3, 4
  tableNumber: {
    type: Number,
    required: true
  },

  // How many seats the table has
  seats: {
    type: Number,
    required: true
  },

  // If the table is open right now
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// Export the table model
module.exports = mongoose.model("Table", tableSchema);