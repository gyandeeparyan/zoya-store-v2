import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';

export const dynamic = 'force-dynamic';

type OrderDocument = Record<string, unknown> & {
  _id?: unknown;
  deliveryStatus?: unknown;
};

function toIdString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'toString' in value) {
    const maybeToString = (value as { toString?: () => string }).toString;
    if (typeof maybeToString === 'function') return maybeToString.call(value);
  }
  return undefined;
}

function normalizeOrder(order: OrderDocument) {
  const normalizedId = toIdString(order?._id) ?? order?._id;
  const normalizedDeliveryStatus =
    order?.deliveryStatus === 'delivered' ? 'delivered' : 'pending';

  return {
    ...order,
    _id: normalizedId,
    deliveryStatus: normalizedDeliveryStatus,
  };
}

export async function GET() {
  try {
    await dbConnect();
    const orders = await CouponsPurchase.find({})
      .sort({ purchaseDate: -1 })
      .lean();

    return NextResponse.json(
      { orders: orders.map(normalizeOrder) },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[Admin] Orders fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
