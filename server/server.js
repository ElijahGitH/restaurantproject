const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./User");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.post("/users", async(req, res) => {
    try{
      const user = await User.create({
        username: req.body.username,
        passwordHash: req.body.password,
        role: req.body.role,
      })
    }catch(e){
      console.log(e.code);
      throw Error();
    }
});

app.get("/users", async (req, res) => {
    try{
        const user = await User.find({});
        res.send(user);
    }catch(e){
        console.log(e.code);
    }
});