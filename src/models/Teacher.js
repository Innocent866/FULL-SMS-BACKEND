import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    staffNo: { type: String, unique: true },
    specialization: [String],
    qualifications: String,
    employmentDate: Date,
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
  },
  { timestamps: true }
);

export default mongoose.model('Teacher', teacherSchema);
