import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    parentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }],
    admissionNumber: { type: String, unique: true },
    gender: String,
    dateOfBirth: Date,
    address: String,
    medicalNotes: String,
    sessionHistory: [{ session: String, classLevel: String }]
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
