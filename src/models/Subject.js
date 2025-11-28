import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    name: String,
    classLevel: String,
    description: String,
    creditUnits: Number,
    teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);
