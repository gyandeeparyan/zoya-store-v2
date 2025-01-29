import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';

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
    }).sort({ purchaseDate: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Order search failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
