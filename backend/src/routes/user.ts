import express from 'express';
import { login, getMe, getUsers, createUser, updateUser, deleteUser } from '../controllers/user';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/', authenticate, requireAdmin, getUsers);
router.post('/', authenticate, requireAdmin, createUser);
router.put('/:id', authenticate, requireAdmin, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

export default router;