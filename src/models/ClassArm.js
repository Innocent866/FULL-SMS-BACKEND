import mongoose from 'mongoose';

const classArmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassLevel' },
    capacity: { type: Number, default: 30 }
  },
  { timestamps: true }
);

classArmSchema.index({ name: 1, levelId: 1 }, { unique: true });

export default mongoose.model('ClassArm', classArmSchema);

