import express from 'express';
import { adminLogin, clientLogin, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/admin/login', adminLogin);
router.post('/client/login', clientLogin);
router.get('/me', protect(), me);

export default router;
