import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Account from '../models/Account.js';

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

// POST /api/auth/admin/login  { username, password }
export async function adminLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Incorrect username or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect username or password' });

  user.lastLogin = new Date();
  await user.save();

  const token = signToken({ id: user._id, role: 'admin', username: user.username });
  res.json({
    token,
    user: {
      id: user._id, firstname: user.firstname, lastname: user.lastname,
      username: user.username, avatar: user.avatar, type: user.type,
    },
  });
}

// POST /api/auth/client/login  { email, password }
export async function clientLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const account = await Account.findOne({ email: email.toLowerCase() });
  if (!account) return res.status(401).json({ message: 'Incorrect email or password' });

  let match = false;
  if (account.password) match = await bcrypt.compare(password, account.password);
  if (!match && account.generatedPassword && account.generatedPassword === password) match = true;
  if (!match) return res.status(401).json({ message: 'Incorrect email or password' });

  const token = signToken({ id: account._id, role: 'client' });
  res.json({
    token,
    account: {
      id: account._id, accountNumber: account.accountNumber, firstname: account.firstname,
      lastname: account.lastname, middlename: account.middlename, email: account.email,
      balance: account.balance,
    },
  });
}

// GET /api/auth/me
export async function me(req, res) {
  if (req.user.role === 'admin') {
    const user = await User.findById(req.user.id).select('-password');
    return res.json({ role: 'admin', user });
  }
  const account = await Account.findById(req.user.id).select('-password -generatedPassword -pin');
  res.json({ role: 'client', account });
}
