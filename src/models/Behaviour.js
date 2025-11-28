import mongoose from 'mongoose';

const behaviourSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    incidentDate: Date,
    type: { type: String, enum: ['commendation', 'warning', 'infraction'] },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    description: String,
    actionTaken: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  },
  { timestamps: true }
);

export default mongoose.model('Behaviour', behaviourSchema);
