import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { purchaseDetails } = await req.json();

    // Initial validation
    if (!purchaseDetails?.customerInfo || !purchaseDetails?.items?.length || !purchaseDetails?.totalAmount) {
      return NextResponse.json(
        { error: 'Invalid purchase details: Missing required fields' },
        { status: 400 }
      );
    }

    // Use totalAmount directly from purchaseDetails
    const totalAmount = purchaseDetails.totalAmount;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // First save order in database
    const dbOrder = await CouponsPurchase.create({
      orderId: `ORD${Date.now()}`,
      purchaseDate: new Date(),
      totalAmount,
      status: 'pending',
      user: purchaseDetails.customerInfo,
      items: purchaseDetails.items
    });

    if (!dbOrder) {
      throw new Error('Failed to save order in database');
    }

    // Create Razorpay order with amount in smallest currency unit (paise)
    const amount = Math.round(totalAmount * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: dbOrder.orderId,
    });

    // Update order with Razorpay order ID
    await CouponsPurchase.findByIdAndUpdate(dbOrder._id, {
      razorpayOrderId: razorpayOrder.id
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      dbOrderId: dbOrder.orderId
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Order creation failed' 
      }, 
      { status: 500 }
    );
  }
}
