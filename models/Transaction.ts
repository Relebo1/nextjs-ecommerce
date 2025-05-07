import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  userId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string; // e.g., 'pending', 'completed', 'failed'
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
