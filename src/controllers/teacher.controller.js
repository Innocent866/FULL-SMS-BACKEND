import {
  getTeacherDashboardService,
  getTeacherProfileService,
  updateTeacherProfileService,
  updateTeacherPasswordService,
  listTeacherClassesService,
  listTeacherSubjectsService,
  listTeacherAnnouncementsService,
  recordAttendanceService,
  updateAttendanceService,
  getAttendanceHistoryService,
  getClassStudentsService,
  uploadScoresService,
  downloadClassResultsService,
  listStudentPerformanceService,
  uploadLessonNoteService,
  listLessonNotesService,
  uploadMaterialService,
  listTeacherMaterialsService,
  getTeachingTimetableService,
  getExamTimetableService,
  listScheduleUpdatesService,
  notifyClassService
} from '../services/teacher.service.js';
import { success } from '../utils/response.js';

export const getTeacherDashboard = async (req, res, next) => {
  try {
    const data = await getTeacherDashboardService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getTeacherProfile = async (req, res, next) => {
  try {
    const data = await getTeacherProfileService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const updateTeacherProfile = async (req, res, next) => {
  try {
    const data = await updateTeacherProfileService(req.user.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const updateTeacherPassword = async (req, res, next) => {
  try {
    const data = await updateTeacherPasswordService(req.user.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listTeacherClasses = async (req, res, next) => {
  try {
    const data = await listTeacherClassesService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listTeacherSubjects = async (req, res, next) => {
  try {
    const data = await listTeacherSubjectsService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listTeacherAnnouncements = async (req, res, next) => {
  try {
    const data = await listTeacherAnnouncementsService(req.user.id, req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getClassStudents = async (req, res, next) => {
  try {
    const data = await getClassStudentsService({ teacherId: req.user.id, classId: req.params.classId });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const uploadScores = async (req, res, next) => {
  try {
    const data = await uploadScoresService({ teacherId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const recordAttendance = async (req, res, next) => {
  try {
    const data = await recordAttendanceService({ teacherId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const data = await updateAttendanceService({ teacherId: req.user.id, attendanceId: req.params.id, updates: req.body });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getAttendanceHistory = async (req, res, next) => {
  try {
    const data = await getAttendanceHistoryService({
      teacherId: req.user.id,
      classId: req.query.classId,
      studentId: req.query.studentId,
      from: req.query.from,
      to: req.query.to
    });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const downloadResults = async (req, res, next) => {
  try {
    const payload = await downloadClassResultsService({
      teacherId: req.user.id,
      classId: req.query.classId,
      subjectId: req.query.subjectId,
      term: req.query.term,
      session: req.query.session
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${payload.filename}"`);
    return res.status(200).send(payload.content);
  } catch (error) {
    return next(error);
  }
};

export const listStudentPerformance = async (req, res, next) => {
  try {
    const data = await listStudentPerformanceService({
      teacherId: req.user.id,
      classId: req.query.classId,
      term: req.query.term,
      session: req.query.session
    });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const uploadLessonNote = async (req, res, next) => {
  try {
    const data = await uploadLessonNoteService({ teacherId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listLessonNotes = async (req, res, next) => {
  try {
    const data = await listLessonNotesService({ teacherId: req.user.id, status: req.query.status });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const uploadMaterial = async (req, res, next) => {
  try {
    const data = await uploadMaterialService({ teacherId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listMaterials = async (req, res, next) => {
  try {
    const data = await listTeacherMaterialsService({ teacherId: req.user.id, classId: req.query.classId });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getTeachingTimetable = async (req, res, next) => {
  try {
    const data = await getTeachingTimetableService({ teacherId: req.user.id });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getExamTimetable = async (req, res, next) => {
  try {
    const data = await getExamTimetableService({ teacherId: req.user.id });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listScheduleUpdates = async (req, res, next) => {
  try {
    const data = await listScheduleUpdatesService({ teacherId: req.user.id });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const notifyClass = async (req, res, next) => {
  try {
    const data = await notifyClassService({ teacherId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};
