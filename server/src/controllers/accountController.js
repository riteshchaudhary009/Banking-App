import bcrypt from 'bcryptjs';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

// GET /api/accounts  (admin) - list all client accounts
export async function listAccounts(req, res) {
  const accounts = await Account.find().select('-password -generatedPassword -pin').sort({ dateCreated: -1 });
  res.json(accounts);
}

// GET /api/accounts/:id
export async function getAccount(req, res) {
  const account = await Account.findById(req.params.id).select('-password -generatedPassword -pin');
  if (!account) return res.status(404).json({ message: 'Account not found' });
  res.json(account);
}

// GET /api/accounts/lookup/:accountNumber - used for transfer/deposit account lookups
export async function lookupAccount(req, res) {
  const account = await Account.findOne({ accountNumber: req.params.accountNumber });
  if (!account) return res.status(404).json({ status: 'not_exist' });
  res.json({
    status: 'success',
    data: {
      id: account._id,
      balance: account.balance,
      name: `${account.lastname}, ${account.firstname} ${account.middlename || ''}`.trim(),
      accountNumber: account.accountNumber,
    },
  });
}

// POST /api/accounts/check  { accountNumber, id? } - availability check
export async function checkAccountNumber(req, res) {
  const { accountNumber, id } = req.body;
  const query = { accountNumber };
  if (id) query._id = { $ne: id };
  const exists = await Account.findOne(query);
  res.json({ status: exists ? 'taken' : 'available' });
}

// POST /api/accounts  (admin) - create new client account
export async function createAccount(req, res) {
  const { accountNumber, pin, firstname, lastname, middlename, email, password, balance } = req.body;
  if (!accountNumber || !pin || !firstname || !lastname || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const dup = await Account.findOne({ $or: [{ accountNumber }, { email: email.toLowerCase() }] });
  if (dup) return res.status(409).json({ message: 'Account number or email already in use' });

  const generatedPassword = password ? '' : Math.random().toString(36).slice(-8);
  const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

  const account = await Account.create({
    accountNumber, pin, firstname, lastname, middlename,
    email: email.toLowerCase(), password: hashedPassword,
    generatedPassword, balance: Number(balance) || 0,
  });

  if (Number(balance) > 0) {
    await Transaction.create({ account: account._id, type: 1, amount: Number(balance), remarks: 'Beginning balance' });
  }

  res.status(201).json({ message: 'Account successfully saved.', account: { ...account.toObject(), password: undefined, pin: undefined } });
}

// PUT /api/accounts/:id (admin) - update account
export async function updateAccount(req, res) {
  const { firstname, lastname, middlename, email, accountNumber, pin, password } = req.body;
  const account = await Account.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (accountNumber) account.accountNumber = accountNumber;
  if (firstname) account.firstname = firstname;
  if (lastname) account.lastname = lastname;
  if (middlename !== undefined) account.middlename = middlename;
  if (email) account.email = email.toLowerCase();
  if (pin) account.pin = pin;
  if (password) {
    account.password = await bcrypt.hash(password, 10);
    account.generatedPassword = '';
  }
  await account.save();
  res.json({ message: 'Account successfully saved.' });
}

// PUT /api/accounts/me (client) - client self-updates profile
export async function updateOwnAccount(req, res) {
  const { firstname, lastname, middlename, email, password } = req.body;
  const account = await Account.findById(req.user.id);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (firstname) account.firstname = firstname;
  if (lastname) account.lastname = lastname;
  if (middlename !== undefined) account.middlename = middlename;
  if (email) account.email = email.toLowerCase();
  if (password) {
    account.password = await bcrypt.hash(password, 10);
    account.generatedPassword = '';
  }
  await account.save();
  res.json({ message: 'Profile successfully updated.' });
}

// DELETE /api/accounts/:id (admin)
export async function deleteAccount(req, res) {
  const account = await Account.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Account not found' });
  await Transaction.deleteMany({ account: account._id });
  await account.deleteOne();
  res.json({ message: 'Account successfully deleted.' });
}
