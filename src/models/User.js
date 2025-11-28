import mongoose from 'mongoose';
import { ROLES } from '../utils/roles.js';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    firstName: String,
    lastName: String,
    phone: String,
    avatarUrl: String,
    status: {
      type: String,
      enum: ['active', 'invited', 'suspended'],
      default: 'active'
    },
    refreshTokens: [String]
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
