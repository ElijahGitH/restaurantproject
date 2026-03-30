// Bring in mongoose
const mongoose = require("mongoose");

// Make the schema for menu items
const menuItemSchema = new mongoose.Schema({
  // Name of the food or drink item
  itemName: {
    type: String,
    required: true
  },

  // Type of item like appetizer, entree, drink, dessert
  category: {
    type: String,
    required: true
  },

  // Price of the item
  price: {
    type: Number,
    required: true
  }
});

// Export the actual model
module.exports = mongoose.model("MenuItem", menuItemSchema);