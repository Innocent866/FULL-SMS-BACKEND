import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    audience: { type: String, default: 'all' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    role: String,
    category: { type: String, default: 'general' },
    attachments: [{ url: String, name: String }],
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishAt: Date,
    expiryAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
