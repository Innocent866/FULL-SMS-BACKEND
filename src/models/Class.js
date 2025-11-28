import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    level: String,
    levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassLevel' },
    session: String,
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolSession' },
    term: String,
    termId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolTerm' },
    arm: String,
    armId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassArm' },
    capacity: { type: Number, default: 30 },
    homeroomTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
  },
  { timestamps: true }
);

classSchema.index({ name: 1, sessionId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Class', classSchema);
