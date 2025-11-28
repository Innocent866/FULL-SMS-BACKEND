import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789', 12);

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const verifyPassword = async (hash, password) => bcrypt.compare(password, hash);
export const generateRandomPassword = () => nanoid();
