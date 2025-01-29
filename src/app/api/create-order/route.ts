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

    // Validate purchase details
    if (!purchaseDetails || typeof purchaseDetails.totalAmount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid purchase details: Amount is required' },
        { status: 400 }
      );
    }

    if (purchaseDetails.totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate customer info
    if (!purchaseDetails.customerInfo || !purchaseDetails.items?.length) {
      return NextResponse.json(
        { error: 'Invalid purchase details: Customer info and items are required' },
        { status: 400 }
      );
    }

    const amount = Math.round(purchaseDetails.totalAmount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    // Save order details to database
    const purchase = await CouponsPurchase.create({
      orderId: `ORD${Date.now()}`,
      razorpayOrderId: razorpayOrder.id,
      purchaseDate: new Date(),
      totalAmount: purchaseDetails.totalAmount,
      user: purchaseDetails.customerInfo,
      items: purchaseDetails.items.map((item: { diamondQuantity: number; pricePerUnit: string; quantity: number; }) => ({
        diamondQuantity: item.diamondQuantity,
        pricePerUnit: parseFloat(item.pricePerUnit),
        quantity: item.quantity,
        totalPrice: parseFloat(item.pricePerUnit) * item.quantity
      })),
      status: 'pending'
    });

    if (!purchase) {
      throw new Error('Failed to save order details');
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
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
