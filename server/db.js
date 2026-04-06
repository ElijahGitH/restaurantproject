// This lets our server connect to MongoDB
const mongoose = require("mongoose");

// This function connects to the database
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

// Export the function so server.js can use it
module.exports = connectDatabase;