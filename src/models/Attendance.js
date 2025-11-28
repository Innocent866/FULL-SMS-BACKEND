import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'present' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    remarks: String
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
