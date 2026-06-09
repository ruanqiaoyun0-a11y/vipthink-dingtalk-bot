import express from 'express';
import { submitPractice } from '../controllers/practice';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, submitPractice);

export default router;