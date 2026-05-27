import { Router } from 'express';
import { uploadImages } from '../controllers/uploadController.js';

const router = Router();

router.post('/images', uploadImages);

export default router;
