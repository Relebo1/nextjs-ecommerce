// models/Income.js
import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  month: String,
  totalIncome: Number
});

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);