import { Router } from 'express';
import ROLE_GUARDS from '../middleware/auth.js';
import { authenticate } from '../middleware/auth.js';
import {
  getTeacherDashboard,
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherPassword,
  listTeacherClasses,
  listTeacherSubjects,
  listTeacherAnnouncements,
  getClassStudents,
  uploadScores,
  downloadResults,
  listStudentPerformance,
  recordAttendance,
  updateAttendance,
  getAttendanceHistory,
  uploadLessonNote,
  listLessonNotes,
  uploadMaterial,
  listMaterials,
  getTeachingTimetable,
  getExamTimetable,
  listScheduleUpdates,
  notifyClass
} from '../controllers/teacher.controller.js';

const router = Router();

router.use(authenticate, ROLE_GUARDS.teacherOnly);

router.get('/dashboard', getTeacherDashboard);

router.get('/profile', getTeacherProfile);
router.patch('/profile', updateTeacherProfile);
router.patch('/profile/password', updateTeacherPassword);

router.get('/classes', listTeacherClasses);
router.get('/subjects', listTeacherSubjects);
router.get('/announcements', listTeacherAnnouncements);
router.get('/schedule/updates', listScheduleUpdates);

router.get('/classes/:classId/students', getClassStudents);
router.post('/classes/notify', notifyClass);

router.post('/scores', uploadScores);
router.get('/scores/export', downloadResults);
router.get('/performance', listStudentPerformance);

router.post('/attendance', recordAttendance);
router.patch('/attendance/:id', updateAttendance);
router.get('/attendance/history', getAttendanceHistory);

router.post('/lesson-notes', uploadLessonNote);
router.get('/lesson-notes', listLessonNotes);

router.post('/materials', uploadMaterial);
router.get('/materials', listMaterials);

router.get('/timetable', getTeachingTimetable);
router.get('/timetable/exams', getExamTimetable);

export default router;
