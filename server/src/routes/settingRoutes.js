import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { getSettings, updateSettings } from '../controllers/settingController.js';

const router = express.Router();

router.get('/', getSettings); // public - needed for login page branding
router.put('/', protect('admin'), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), updateSettings);

export default router;
