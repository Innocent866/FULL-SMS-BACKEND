import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listAnnouncements, createAnnouncement } from '../controllers/announcement.controller.js';

const router = Router();

router.get('/', authenticate, listAnnouncements);
router.post('/', authenticate, createAnnouncement);

export default router;
