import { verifyAccessToken } from '../config/jwt.js';
import { ROLES } from '../utils/roles.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  return next();
};

const ROLE_GUARDS = {
  adminOnly: authorize(ROLES.ADMIN),
  teacherOnly: authorize(ROLES.TEACHER),
  parentOnly: authorize(ROLES.PARENT),
  studentOnly: authorize(ROLES.STUDENT)
}

export default ROLE_GUARDS;