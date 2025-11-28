import express from 'express';
import ROLE_GUARDS from '../middleware/auth.js';
import {authenticate} from '../middleware/auth.js'
import {
  getParentDashboard,
  getChildren,
  getPaymentHistory,
  getParentFees,
  linkChildToParent,
  getChildProfile,
  getParentAttendance
} from '../controllers/parent.controller.js';

const router = express.Router();

router.use(authenticate, ROLE_GUARDS.parentOnly);
router.get('/dashboard', getParentDashboard);
router.get('/children', getChildren);
router.get('/children/:childId', getChildProfile);
router.post('/children/link', linkChildToParent);
router.get('/fees', getParentFees);
router.get('/attendance', getParentAttendance);
router.get('/payments/history', getPaymentHistory);

export default router;
