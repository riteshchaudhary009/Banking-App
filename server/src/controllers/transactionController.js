import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

// GET /api/transactions/me (client) - own transaction history
export async function myTransactions(req, res) {
  const tx = await Transaction.find({ account: req.user.id }).sort({ dateCreated: -1 });
  res.json(tx);
}

// GET /api/transactions/account/:accountId (admin) - a given account's history
export async function accountTransactions(req, res) {
  const account = await Account.findById(req.params.accountId).select('-password -generatedPassword -pin');
  if (!account) return res.status(404).json({ message: 'Account not found' });
  const tx = await Transaction.find({ account: account._id }).sort({ dateCreated: -1 });
  res.json({ account, transactions: tx });
}

// GET /api/transactions (admin) - all transactions across all accounts
export async function allTransactions(req, res) {
  const tx = await Transaction.find().populate('account', 'accountNumber firstname lastname middlename').sort({ dateCreated: -1 }).limit(500);
  res.json(tx);
}

// POST /api/transactions/deposit (admin only)  { accountId, amount }
export async function deposit(req, res) {
  const { accountId, amount } = req.body;
  const amt = parseFloat(amount);
  if (!accountId || !amt || amt <= 0) return res.status(400).json({ message: 'Invalid deposit request' });

  const account = await Account.findById(accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  account.balance += amt;
  await account.save();
  await Transaction.create({ account: account._id, type: 1, amount: amt, remarks: 'Deposits' });

  res.json({ message: `${account.firstname}'s deposit successfully saved.`, balance: account.balance });
}

// POST /api/transactions/withdraw (admin only)  { accountId, amount }
export async function withdraw(req, res) {
  const { accountId, amount } = req.body;
  const amt = parseFloat(amount);
  if (!accountId || !amt || amt <= 0) return res.status(400).json({ message: 'Invalid withdrawal request' });

  const account = await Account.findById(accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });
  if (account.balance < amt) return res.status(400).json({ message: "Amount is greater than the client's balance" });

  account.balance -= amt;
  await account.save();
  await Transaction.create({ account: account._id, type: 2, amount: amt, remarks: 'Withdraw' });

  res.json({ message: `${account.firstname}'s withdrawal successfully saved.`, balance: account.balance });
}

// POST /api/transactions/transfer
// Admin: { fromAccountId, toAccountId, amount }
// Client: { toAccountId, amount }  (from = req.user.id)
export async function transfer(req, res) {
  const isAdmin = req.user.role === 'admin';
  const fromAccountId = isAdmin ? req.body.fromAccountId : req.user.id;
  const { toAccountId, amount } = req.body;
  const amt = parseFloat(amount);

  if (!fromAccountId || !toAccountId || !amt || amt <= 0) {
    return res.status(400).json({ message: 'Invalid transfer request' });
  }
  if (String(fromAccountId) === String(toAccountId)) {
    return res.status(400).json({ message: 'Cannot transfer to the same account' });
  }

  const fromAccount = await Account.findById(fromAccountId);
  const toAccount = await Account.findById(toAccountId);
  if (!fromAccount || !toAccount) return res.status(404).json({ message: 'Account not found' });
  if (fromAccount.balance < amt) return res.status(400).json({ message: "Amount is greater than the client's balance" });

  fromAccount.balance -= amt;
  toAccount.balance += amt;
  await fromAccount.save();
  await toAccount.save();

  await Transaction.create({ account: fromAccount._id, type: 3, amount: amt, remarks: `Transferred to ${toAccount.accountNumber}` });
  await Transaction.create({ account: toAccount._id, type: 3, amount: amt, remarks: `Transferred from ${fromAccount.accountNumber}` });

  res.json({ message: 'Transfer successfully processed.', balance: fromAccount.balance });
}
