// models/Query.js
import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: { type: String, enum: ['pending', 'complete'], default: 'pending' },
  autoReplied: Boolean
});

export default mongoose.models.Query || mongoose.model('Query', QuerySchema);