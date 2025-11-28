// import mongoose from 'mongoose';

// const feeSchema = new mongoose.Schema(
//   {
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
//     classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
//     term: String,
//     session: String,
//     items: [{ label: String, amount: Number }],
//     totalDue: Number,
//     dueDate: Date,
//     status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' }
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Fee', feeSchema);

import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  term: {
    type: String,
    enum: ["1st Term", "2nd Term", "3rd Term"],
    required: true
  },
  session: {
    type: String,
    required: true
  },
  email: {
    type: String,
    // required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "abandoned"],
    default: "pending"
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Fee", feeSchema);

