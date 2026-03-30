// Import mongoose
const mongoose = require("mongoose");

// Make the user schema
const userSchema = new mongoose.Schema({
  // Username for login
  username: {
    type: String,
    required: true,
    unique: true
  },

  // Password for login
  password: {
    type: String,
    required: true
  },

  // Role for routing
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true
  }
});

// Export the user model
module.exports = mongoose.model("User", userSchema);