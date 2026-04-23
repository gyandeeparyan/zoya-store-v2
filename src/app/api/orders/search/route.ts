import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';

export const dynamic = 'force-dynamic';

function normalizeOrder(order: any) {
  return {
    ...order,
    _id: order?._id?.toString?.() ?? order?._id,
    deliveryStatus: order?.deliveryStatus ?? 'pending',
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const whatsapp = searchParams.get('whatsapp');

    if (!whatsapp) {
      return NextResponse.json(
        { error: 'WhatsApp number is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const orders = await CouponsPurchase.find({
      'user.whatsapp': whatsapp
    })
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
    console.error('Order search failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
