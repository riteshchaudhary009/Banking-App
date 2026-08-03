import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  myTransactions, accountTransactions, allTransactions, deposit, withdraw, transfer,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/me', protect('client'), myTransactions);
router.get('/', protect('admin'), allTransactions);
router.get('/account/:accountId', protect('admin'), accountTransactions);
router.post('/deposit', protect('admin'), deposit);
router.post('/withdraw', protect('admin'), withdraw);
router.post('/transfer', protect('admin', 'client'), transfer);

export default router;
