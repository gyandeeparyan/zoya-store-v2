/**
 * API Route: Verify Payment
 * POST /api/verify-payment
 *
 * ⚠️ DEPRECATED: Use server actions instead
 * @see src/actions/payment.ts
 *
 * This route is kept for backwards compatibility only.
 */
import { NextResponse } from 'next/server';
import { verifyPaymentServer } from '@/server/paymentService';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    // Use server-side payment service
    const result = await verifyPaymentServer({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

