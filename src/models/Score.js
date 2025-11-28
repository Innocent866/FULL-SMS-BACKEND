import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    term: String,
    session: String,
    CA1: Number,
    CA2: Number,
    assignment: Number,
    project: Number,
    exam: Number,
    total: Number,
    position: Number,
    teacherComment: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  },
  { timestamps: true }
);

export default mongoose.model('Score', scoreSchema);
