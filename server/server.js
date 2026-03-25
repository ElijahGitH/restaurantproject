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

app.post("/customer", (req, res) => {
    try{
        let collection = db.collection("Customers");
        let result = collection.insertOne(req.body);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});

app.post("/admin", (req, res) => {
    try{
        let collection = db.collection("Admins");
        let result = collection.insertOne(req.body);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});

app.get("/customer", async (req, res) => {
    try{
        let body = req.body;
        let filter = {};
        if(body)
        {
            filter = {"_id": ObjectId(body._id)};
        }
        let collection = db.collection("Customers");
        let result = await collection.find(filter).toArray();
        res.json(result);
    }
    catch(e){
        console.log(e);
    }
});

app.get("/admin", async (req, res) => {
    try{
        let body = req.body;
        let filter = {};
        if(body)
        {
            filter = {"_id": ObjectId(body._id)};
        }
        let collection = db.collection("Admins");
        let result = await collection.find(filter).toArray();
        res.json(result);
    }
    catch(e){
        console.log(e);
    }
});