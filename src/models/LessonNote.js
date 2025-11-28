import mongoose from 'mongoose';

const lessonNoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    week: String,
    objectives: String,
    content: String,
    fileUrl: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminRemarks: String
  },
  { timestamps: true }
);

export default mongoose.model('LessonNote', lessonNoteSchema);


