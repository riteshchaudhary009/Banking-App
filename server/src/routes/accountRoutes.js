import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  listAccounts, getAccount, lookupAccount, checkAccountNumber,
  createAccount, updateAccount, updateOwnAccount, deleteAccount,
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/', protect('admin'), listAccounts);
router.post('/check', protect('admin', 'client'), checkAccountNumber);
router.get('/lookup/:accountNumber', protect('admin', 'client'), lookupAccount);
router.put('/me', protect('client'), updateOwnAccount);
router.get('/:id', protect('admin'), getAccount);
router.post('/', protect('admin'), createAccount);
router.put('/:id', protect('admin'), updateAccount);
router.delete('/:id', protect('admin'), deleteAccount);

export default router;
