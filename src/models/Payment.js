import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    amount: Number,
    currency: { type: String, default: 'NGN' },
    reference: String,
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    channel: String,
    paidAt: Date,
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
