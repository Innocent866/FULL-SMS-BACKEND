import { listAssignmentsService, createAssignmentService, submitAssignmentService } from '../services/assignment.service.js';
import { success } from '../utils/response.js';

export const listAssignments = async (req, res, next) => {
  try {
    const data = await listAssignmentsService(req.user);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const data = await createAssignmentService({ ...req.body, postedBy: req.user.id });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const data = await submitAssignmentService({ assignmentId: req.params.id, userId: req.user.id, payload: req.body });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};
