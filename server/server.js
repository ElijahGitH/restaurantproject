const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// MongoDB connection
async function connectDB() {
  const uri = "mongodb://localhost:27017/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db("Restaurant");
    console.log("Connected to MongoDB!");
  } catch(error) {
    console.log(error);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
