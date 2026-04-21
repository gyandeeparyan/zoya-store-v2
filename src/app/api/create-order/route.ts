/**
 * API Route: Create Payment Order
 * POST /api/create-order
 *
 * This route is deprecated. Use server actions instead:
 * @see src/actions/payment.ts
 *
 * Kept for backwards compatibility only.
 */
import { NextResponse } from 'next/server';
import { createOrderServer } from '@/server/paymentService';

export async function POST(req: Request) {
  try {
    const { purchaseDetails } = await req.json();

    if (!purchaseDetails?.customerInfo || !purchaseDetails?.items?.length || !purchaseDetails?.totalAmount) {
      return NextResponse.json(
        { error: 'Invalid purchase details' },
        { status: 400 }
      );
    }

    const result = await createOrderServer({
      totalAmount: purchaseDetails.totalAmount,
      customerInfo: purchaseDetails.customerInfo,
      items: purchaseDetails.items,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create order' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
    });
  } catch (error) {
    console.error('[API] Order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
