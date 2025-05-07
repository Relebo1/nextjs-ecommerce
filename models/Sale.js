// models/Sale.js
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  date: Date,
});

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);