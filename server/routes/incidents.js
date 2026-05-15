import { Router } from 'express';
import { createIncident, createQuickIncident, getIncidentById, getIncidents, getStats, updateStatus } from '../controllers/incidentController.js';
import { optionalAuth, requireVerifiedRescuer, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/stats', getStats);
router.post('/quick', optionalAuth, createQuickIncident);
router.post('/', optionalAuth, createIncident);
router.get('/', optionalAuth, getIncidents);
router.get('/:id', optionalAuth, getIncidentById);
router.patch('/:id/status', verifyToken, requireVerifiedRescuer, updateStatus);
export default router;
