import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect('admin'), listUsers);
router.post('/', protect('admin'), upload.single('avatar'), createUser);
router.put('/:id', protect('admin'), upload.single('avatar'), updateUser);
router.delete('/:id', protect('admin'), deleteUser);

export default router;
