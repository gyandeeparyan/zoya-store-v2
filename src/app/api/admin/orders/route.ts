import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';

export async function GET() {
  try {
    await dbConnect();
    const orders = await CouponsPurchase.find({})
      .sort({ purchaseDate: -1 })
      .lean();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[Admin] Orders fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
