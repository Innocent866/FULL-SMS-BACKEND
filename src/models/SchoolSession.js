import mongoose from 'mongoose';

const schoolSessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
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

export default mongoose.model('SchoolSession', schoolSessionSchema);

