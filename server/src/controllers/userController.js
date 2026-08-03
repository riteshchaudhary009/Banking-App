import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function listUsers(req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
}

export async function createUser(req, res) {
  const { firstname, lastname,address,phone, username, password, type } = req.body;
  if (!firstname || !lastname || !address || !phone || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const dup = await User.findOne({ username });
  if (dup) return res.status(409).json({ message: 'Username already taken' });

  const hashed = await bcrypt.hash(password, 10);
  const avatar = req.file ? `uploads/${req.file.filename}` : '';
  const user = await User.create({ firstname, lastname,  username, password: hashed, type: type || 1, avatar });
  res.status(201).json({ message: 'User Details successfully saved.', user: { ...user.toObject(), password: undefined } });
}

export async function updateUser(req, res) {
  const { firstname, lastname, username, password, type } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;

  if (username) user.username = username;
  if (type) user.type = type;
  if (password) user.password = await bcrypt.hash(password, 10);
  if (req.file) user.avatar = `uploads/${req.file.filename}`;

  await user.save();
  res.json({ message: 'User Details successfully updated.' });
}

export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User Details successfully deleted.' });
}
