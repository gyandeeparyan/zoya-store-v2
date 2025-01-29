import mongoose from 'mongoose';

const couponsPurchaseSchema = new mongoose.Schema({
  orderId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  purchaseDate: Date,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  user: {
    userId: String,
    serverId: String,
    username: String,
    customerName: String,
    whatsapp: String,
    email: String
  },
  items: [{
    diamondQuantity: Number,
    pricePerUnit: Number,
    quantity: Number,
    totalPrice: Number
  }]
});

export const CouponsPurchase = mongoose.models.CouponsPurchase || mongoose.model('CouponsPurchase', couponsPurchaseSchema);
