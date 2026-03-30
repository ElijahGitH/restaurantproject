import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  capacity: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false }
});

export default mongoose.model("Table", tableSchema);
