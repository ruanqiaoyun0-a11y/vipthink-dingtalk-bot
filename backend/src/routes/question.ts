import express from 'express';
import { getQuestionsByDayAndType, createQuestion } from '../controllers/question';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/:day/:type', authenticate, getQuestionsByDayAndType);
router.post('/', authenticate, requireAdmin, createQuestion);

export default router;