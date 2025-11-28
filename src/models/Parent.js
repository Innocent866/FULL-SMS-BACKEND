import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    occupation: String,
    address: String,
    emergencyContacts: [{ name: String, phone: String, relation: String }],
    preferredContactMethod: { type: String, default: 'email' },
    verificationStatus: { type: String, default: 'pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Parent', parentSchema);
