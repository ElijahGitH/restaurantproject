import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },

  // 👇 THIS is where tableId goes
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table"
  }

}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);
