import mongoose from 'mongoose';

const schoolTermSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolSession', required: true },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming'
    }
  },
  { timestamps: true }
);

schoolTermSchema.index({ name: 1, sessionId: 1 }, { unique: true });

export default mongoose.model('SchoolTerm', schoolTermSchema);

