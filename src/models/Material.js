import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fileUrl: String,
    fileType: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    visibility: { type: String, default: 'class' }
  },
  { timestamps: true }
);

export default mongoose.model('Material', materialSchema);
