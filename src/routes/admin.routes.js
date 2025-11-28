import { Router } from 'express';
import ROLE_GUARDS from '../middleware/auth.js';
import { authenticate } from '../middleware/auth.js';
import {
  listStudents,
  createStudent,
  updateStudent,
  changeStudentStatus,
  deleteStudent,
  promoteStudents,
  listTeachers,
  createTeacher,
  updateTeacher,
  changeTeacherStatus,
  deleteTeacher,
  listAnnouncements,
  createAnnouncement,
  listTimetables,
  createTimetable,
  listPayments,
  manageAnnouncements,
  listAccounts,
  createAccount,
  updateAccount,
  changeAccountStatus,
  deleteAccount,
  listClasses,
  createClass,
  updateClass,
  deleteClass,
  assignClassTeacher,
  listClassLevels,
  createClassLevel,
  updateClassLevel,
  deleteClassLevel,
  listClassArms,
  createClassArm,
  updateClassArm,
  deleteClassArm,
  listSchoolSessions,
  createSchoolSession,
  updateSchoolSession,
  deleteSchoolSession,
  listSchoolTerms,
  createSchoolTerm,
  updateSchoolTerm,
  deleteSchoolTerm,
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  assignSubjectTeachers,
  getGradingProfile,
  updateGradingProfile
} from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, ROLE_GUARDS.adminOnly);

router.get('/students', listStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id/status', changeStudentStatus);
router.delete('/students/:id', deleteStudent);
router.post('/students/promote', promoteStudents);

router.get('/teachers', listTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.patch('/teachers/:id/status', changeTeacherStatus);
router.delete('/teachers/:id', deleteTeacher);

router.get('/accounts', listAccounts);
router.post('/accounts', createAccount);
router.put('/accounts/:id', updateAccount);
router.patch('/accounts/:id/status', changeAccountStatus);
router.delete('/accounts/:id', deleteAccount);

router.get('/classes', listClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.post('/classes/:id/assign-teacher', assignClassTeacher);

router.get('/structures/levels', listClassLevels);
router.post('/structures/levels', createClassLevel);
router.put('/structures/levels/:id', updateClassLevel);
router.delete('/structures/levels/:id', deleteClassLevel);

router.get('/structures/arms', listClassArms);
router.post('/structures/arms', createClassArm);
router.put('/structures/arms/:id', updateClassArm);
router.delete('/structures/arms/:id', deleteClassArm);

router.get('/structures/sessions', listSchoolSessions);
router.post('/structures/sessions', createSchoolSession);
router.put('/structures/sessions/:id', updateSchoolSession);
router.delete('/structures/sessions/:id', deleteSchoolSession);

router.get('/structures/terms', listSchoolTerms);
router.post('/structures/terms', createSchoolTerm);
router.put('/structures/terms/:id', updateSchoolTerm);
router.delete('/structures/terms/:id', deleteSchoolTerm);

router.get('/subjects', listSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);
router.post('/subjects/:id/teachers', assignSubjectTeachers);

router.get('/assessments/grading', getGradingProfile);
router.put('/assessments/grading', updateGradingProfile);

router.get('/announcements', listAnnouncements);
router.post('/announcements', createAnnouncement);
router.patch('/announcements/:id', manageAnnouncements);

router.get('/timetables', listTimetables);
router.post('/timetables', createTimetable);

router.get('/payments', listPayments);

export default router;
