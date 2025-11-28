import {
  createStudentService,
  createTeacherService,
  createAnnouncementService,
  createTimetableService,
  listStudentsService,
  listTeachersService,
  listAnnouncementsService,
  listTimetablesService,
  listPaymentsService,
  manageAnnouncementsService,
  updateStudentService,
  changeStudentStatusService,
  deleteStudentService,
  promoteStudentsService,
  updateTeacherService,
  changeTeacherStatusService,
  deleteTeacherService,
  listAccountsService,
  createAccountService,
  updateAccountService,
  changeAccountStatusService,
  deleteAccountService,
  listClassesService,
  createClassService,
  updateClassService,
  deleteClassService,
  assignClassTeacherService,
  listClassLevelsService,
  createClassLevelService,
  updateClassLevelService,
  deleteClassLevelService,
  listClassArmsService,
  createClassArmService,
  updateClassArmService,
  deleteClassArmService,
  listSchoolSessionsService,
  createSchoolSessionService,
  updateSchoolSessionService,
  deleteSchoolSessionService,
  listSchoolTermsService,
  createSchoolTermService,
  updateSchoolTermService,
  deleteSchoolTermService,
  listSubjectsService,
  createSubjectService,
  updateSubjectService,
  deleteSubjectService,
  assignSubjectTeachersService,
  getGradingProfileService,
  upsertGradingProfileService
} from '../services/admin.service.js';
import { success } from '../utils/response.js';

export const listStudents = async (req, res, next) => {
  try {
    const data = await listStudentsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const data = await createStudentService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listTeachers = async (req, res, next) => {
  try {
    const data = await listTeachersService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const data = await createTeacherService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listAnnouncements = async (req, res, next) => {
  try {
    const data = await listAnnouncementsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const data = await createAnnouncementService(req.body, req.user?.id);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listTimetables = async (req, res, next) => {
  try {
    const data = await listTimetablesService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createTimetable = async (req, res, next) => {
  try {
    const data = await createTimetableService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const listPayments = async (req, res, next) => {
  try {
    const data = await listPaymentsService(req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const manageAnnouncements = async (req, res, next) => {
  try {
    const data = await manageAnnouncementsService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const data = await updateStudentService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const changeStudentStatus = async (req, res, next) => {
  try {
    const data = await changeStudentStatusService(req.params.id, req.body.status);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const data = await deleteStudentService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const promoteStudents = async (req, res, next) => {
  try {
    const data = await promoteStudentsService(req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const data = await updateTeacherService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const changeTeacherStatus = async (req, res, next) => {
  try {
    const data = await changeTeacherStatusService(req.params.id, req.body.status);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const data = await deleteTeacherService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listAccounts = async (req, res, next) => {
  try {
    const data = await listAccountsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createAccount = async (req, res, next) => {
  try {
    const data = await createAccountService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateAccount = async (req, res, next) => {
  try {
    const data = await updateAccountService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const changeAccountStatus = async (req, res, next) => {
  try {
    const data = await changeAccountStatusService(req.params.id, req.body.status);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const data = await deleteAccountService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listClasses = async (req, res, next) => {
  try {
    const data = await listClassesService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const data = await createClassService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const data = await updateClassService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const data = await deleteClassService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const assignClassTeacher = async (req, res, next) => {
  try {
    const data = await assignClassTeacherService(req.params.id, req.body.teacherId);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listClassLevels = async (req, res, next) => {
  try {
    const data = await listClassLevelsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createClassLevel = async (req, res, next) => {
  try {
    const data = await createClassLevelService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateClassLevel = async (req, res, next) => {
  try {
    const data = await updateClassLevelService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteClassLevel = async (req, res, next) => {
  try {
    const data = await deleteClassLevelService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listClassArms = async (req, res, next) => {
  try {
    const data = await listClassArmsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createClassArm = async (req, res, next) => {
  try {
    const data = await createClassArmService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateClassArm = async (req, res, next) => {
  try {
    const data = await updateClassArmService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteClassArm = async (req, res, next) => {
  try {
    const data = await deleteClassArmService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listSchoolSessions = async (req, res, next) => {
  try {
    const data = await listSchoolSessionsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createSchoolSession = async (req, res, next) => {
  try {
    const data = await createSchoolSessionService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateSchoolSession = async (req, res, next) => {
  try {
    const data = await updateSchoolSessionService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteSchoolSession = async (req, res, next) => {
  try {
    const data = await deleteSchoolSessionService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listSchoolTerms = async (req, res, next) => {
  try {
    const data = await listSchoolTermsService(req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createSchoolTerm = async (req, res, next) => {
  try {
    const data = await createSchoolTermService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateSchoolTerm = async (req, res, next) => {
  try {
    const data = await updateSchoolTermService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteSchoolTerm = async (req, res, next) => {
  try {
    const data = await deleteSchoolTermService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const listSubjects = async (req, res, next) => {
  try {
    const data = await listSubjectsService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const data = await createSubjectService(req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const data = await updateSubjectService(req.params.id, req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const data = await deleteSubjectService(req.params.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const assignSubjectTeachers = async (req, res, next) => {
  try {
    const data = await assignSubjectTeachersService(req.params.id, req.body.teacherIds);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getGradingProfile = async (req, res, next) => {
  try {
    const data = await getGradingProfileService();
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const updateGradingProfile = async (req, res, next) => {
  try {
    const data = await upsertGradingProfileService(req.body);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};
