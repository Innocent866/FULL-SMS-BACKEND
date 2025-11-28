import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    threadId: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subject: String,
    body: String,
    attachments: [{ url: String, name: String }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
