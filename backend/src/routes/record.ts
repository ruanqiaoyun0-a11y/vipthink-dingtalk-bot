import express from 'express';
import { getRecords, getAllRecords, getDailyStats } from '../controllers/record';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getRecords);
router.get('/all', authenticate, requireAdmin, getAllRecords);
router.get('/stats/daily', authenticate, requireAdmin, getDailyStats);

export default router;