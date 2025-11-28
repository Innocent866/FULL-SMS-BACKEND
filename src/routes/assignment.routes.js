import { Router } from 'express';
import ROLE_GUARDS from '../middleware/auth.js';
import {authenticate} from '../middleware/auth.js'
import { listAssignments, createAssignment, submitAssignment } from '../controllers/assignment.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', listAssignments);
router.post('/', ROLE_GUARDS.teacherOnly, createAssignment);
router.post('/:id/submit', ROLE_GUARDS.studentOnly, submitAssignment);

export default router;
