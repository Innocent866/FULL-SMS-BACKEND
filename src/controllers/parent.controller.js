import {
  getParentDashboardService,
  getChildrenService,
  getPaymentHistoryService,
  getParentFeesService,
  linkChildToParentService,
  getChildProfileService,
  getParentAttendanceService
} from '../services/parent.service.js';
import { success } from '../utils/response.js';

export const getParentDashboard = async (req, res, next) => {
  try {
    const data = await getParentDashboardService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getChildren = async (req, res, next) => {
  try {
    const data = await getChildrenService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const data = await getPaymentHistoryService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getParentFees = async (req, res, next) => {
  try {
    const data = await getParentFeesService(req.user.id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const linkChildToParent = async (req, res, next) => {
  try {
    const data = await linkChildToParentService(req.user.id, req.body);
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const getChildProfile = async (req, res, next) => {
  try {
    const data = await getChildProfileService(req.user.id, req.params.childId);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const getParentAttendance = async (req, res, next) => {
  try {
    const data = await getParentAttendanceService(req.user.id, req.query);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};
