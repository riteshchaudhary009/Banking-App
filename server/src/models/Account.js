import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true, trim: true },
  pin: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  middlename: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: '' },
  generatedPassword: { type: String, default: '' },
  balance: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated' } });

export default mongoose.model('Account', accountSchema);
