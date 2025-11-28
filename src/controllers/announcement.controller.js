import { listAnnouncementsService, createAnnouncementService } from '../services/announcement.service.js';
import { success } from '../utils/response.js';

export const listAnnouncements = async (req, res, next) => {
  try {
    
    const data = await listAnnouncementsService(req.query, req.user);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const data = await createAnnouncementService({ ...req.body, publishedBy: req.user.id });
    return success(res, data, 201);
  } catch (error) {
    return next(error);
  }
};
