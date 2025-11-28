import { Router } from 'express';
import ROLE_GUARDS from '../middleware/auth.js';
import { authenticate } from '../middleware/auth.js';
import { getStudentDashboard, getAssignments, getAttendance, getStudentTimetable } from '../controllers/student.controller.js';

const router = Router();

router.use(authenticate, ROLE_GUARDS.studentOnly);
router.get('/dashboard', getStudentDashboard);
router.get('/assignments', getAssignments);
router.get('/attendance', getAttendance);
router.get('/timetable', getStudentTimetable);

export default router;
