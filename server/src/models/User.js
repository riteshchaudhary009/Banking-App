import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  type: { type: Number, default: 1 }, // 1 = admin/staff
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
