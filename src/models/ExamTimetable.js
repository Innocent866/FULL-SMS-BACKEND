import mongoose from 'mongoose';

const examEntrySchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectName: String,
    date: Date,
    startTime: String,
    endTime: String,
    venue: String,
    invigilators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
  },
  { _id: false }
);

const examTimetableSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Exam Timetable' },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolSession' },
    termId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolTerm' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    notes: String,
    entries: [examEntrySchema]
  },
  { timestamps: true }
);

export default mongoose.model('ExamTimetable', examTimetableSchema);


