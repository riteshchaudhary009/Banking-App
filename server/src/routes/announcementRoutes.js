import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

router.get('/', protect('admin', 'client'), listAnnouncements);
router.get('/:id', protect('admin', 'client'), getAnnouncement);
router.post('/', protect('admin'), createAnnouncement);
router.put('/:id', protect('admin'), updateAnnouncement);
router.delete('/:id', protect('admin'), deleteAnnouncement);

export default router;
