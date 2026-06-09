import express from 'express';
import { submitExam } from '../controllers/exam';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, submitExam);

export default router;