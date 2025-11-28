import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    startAt: Date,
    endAt: Date,
    audience: { type: String, default: 'all' },
    location: String,
    reminders: [{ channel: String, minutesBefore: Number }],
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
