import express from 'express';
import { getKnowledgePointsByDay, createKnowledgePoint } from '../controllers/learning';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/day/:day', authenticate, getKnowledgePointsByDay);
router.post('/', authenticate, requireAdmin, createKnowledgePoint);

export default router;