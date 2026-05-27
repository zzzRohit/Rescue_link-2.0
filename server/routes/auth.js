import { Router } from 'express';
import {
  checkAdminSession,
  createAdminRescuer,
  getAdminRescuers,
  getMe,
  getPendingRescuers,
  login,
  register,
  rescuerLogin,
  verifyRescuer
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/rescuer/login', rescuerLogin);
router.get('/me', verifyToken, getMe);
router.post('/admin/session', checkAdminSession);
router.post('/admin/verify-rescuer', verifyRescuer);
router.get('/admin/rescuers', getAdminRescuers);
router.post('/admin/rescuers', createAdminRescuer);
router.get('/admin/pending-rescuers', getPendingRescuers);
export default router;
