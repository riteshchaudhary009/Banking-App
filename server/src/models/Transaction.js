import mongoose from 'mongoose';

// type: 1 = deposit (cash in), 2 = withdraw, 3 = transfer
const transactionSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: Number, required: true, enum: [1, 2, 3] },
  amount: { type: Number, required: true },
  remarks: { type: String, default: '' },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: false } });

export default mongoose.model('Transaction', transactionSchema);
