import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: String,
  serverId: String,
  username: String,
  customerName: String,
  whatsapp: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
