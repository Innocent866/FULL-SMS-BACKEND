import mongoose from 'mongoose';

const gradeBandSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    remark: String
  },
  { _id: false }
);

const gradingProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isDefault: { type: Boolean, default: false },
    weights: {
      CA1: { type: Number, default: 15 },
      CA2: { type: Number, default: 15 },
      project: { type: Number, default: 10 },
      exam: { type: Number, default: 60 }
    },
    grades: { type: [gradeBandSchema], default: [] }
  },
  { timestamps: true }
);

gradingProfileSchema.pre('save', function validateWeights(next) {
  const total =
    (this.weights?.CA1 ?? 0) + (this.weights?.CA2 ?? 0) + (this.weights?.project ?? 0) + (this.weights?.exam ?? 0);
  if (total !== 100) {
    return next(new Error('Assessment weights must total 100%'));
  }
  return next();
});

gradingProfileSchema.pre('findOneAndUpdate', function validateWeights(next) {
  const weights = this.getUpdate()?.weights;
  if (weights) {
    const total = (weights.CA1 ?? 0) + (weights.CA2 ?? 0) + (weights.project ?? 0) + (weights.exam ?? 0);
    if (total !== 100) {
      return next(new Error('Assessment weights must total 100%'));
    }
  }
  return next();
});

export default mongoose.model('GradingProfile', gradingProfileSchema);

