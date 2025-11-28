import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    period: { type: String, required: true },
    subject: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacherName: {type: String, required: true} || "Null",
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room: String
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    session: String,
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolSession' },
    term: { type: String, required: true },
    termId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolTerm' },
    entries: [entrySchema],
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('Timetable', timetableSchema);


