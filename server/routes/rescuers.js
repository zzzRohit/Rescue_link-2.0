import { Router } from 'express';
import { getCities, getRescuers, updateAvailability } from '../controllers/rescuerController.js';
import { requireVerifiedRescuer, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/cities', getCities);
router.get('/nearby', getRescuers);
router.get('/', getRescuers);
router.patch('/availability', verifyToken, requireVerifiedRescuer, updateAvailability);
export default router;
