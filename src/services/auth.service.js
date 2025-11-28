import User from '../models/User.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import { ROLES } from '../utils/roles.js';
import { generateRandomPassword, hashPassword, verifyPassword } from '../utils/password.js';
import { sendTemplateEmail } from '../config/email.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt.js';

export const parentSignupService = async (payload) => {
  const rawPassword = payload.password?.trim() || generateRandomPassword();
  const passwordHash = await hashPassword(rawPassword);

  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    role: ROLES.PARENT,
    email: payload.email.toLowerCase(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    passwordHash
  });

  const parentProfile = await Parent.create({
    userId: user._id,
    occupation: payload.occupation,
    address: payload.address,
    emergencyContacts: payload.emergencyContacts,
    preferredContactMethod: payload.preferredContactMethod,
    verificationStatus: 'pending',
    children: []
  });

  if (payload.children?.length) {
    const children = await Student.find({ admissionNumber: { $in: payload.children.map((c) => c.admissionNumber) } });
    await Parent.findByIdAndUpdate(parentProfile._id, { $set: { children: children.map((c) => c._id) } });
  }

  if (!payload.password) {
    await sendTemplateEmail({
      toEmail: payload.email,
      templateParams: {
        parent_name: `${payload.firstName}`,
        login_email: payload.email,
        temporary_password: rawPassword
      }
    });
  }

  console.log({ userId: user._id, parentId: parentProfile._id })
  return { userId: user._id, parentId: parentProfile._id };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  };
};

export const refreshTokenService = async ({ token }) => {
  const payload = verifyRefreshToken(token);
  const accessToken = signAccessToken({ id: payload.id, role: payload.role });
  const refreshToken = signRefreshToken({ id: payload.id, role: payload.role });
  return { accessToken, refreshToken };
};
