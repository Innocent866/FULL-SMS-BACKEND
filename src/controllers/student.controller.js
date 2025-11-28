import {
  getStudentDashboardService,
  getAssignmentsService,
  getAttendanceService,
  getStudentTimetableService
} from '../services/student.service.js';
import { success } from '../utils/response.js';

export const getStudentDashboard = async (req, res, next) => {
  try {
    const data = await getStudentDashboardService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getAssignments = async (req, res, next) => {
  try {
    const data = await getAssignmentsService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const data = await getAttendanceService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getStudentTimetable = async (req, res, next) => {
  try {
    const data = await getStudentTimetableService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};
