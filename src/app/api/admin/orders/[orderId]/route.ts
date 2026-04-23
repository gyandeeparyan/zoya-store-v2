import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';
import mongoose from 'mongoose';

function normalizeOrder(order: any) {
  return {
    ...order,
    _id: order?._id?.toString?.() ?? order?._id,
    deliveryStatus: order?.deliveryStatus ?? 'pending',
  };
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await dbConnect();
    const { orderId: routeOrderId } = await params;
    const body = await req.json();
    const {
      deliveryStatus,
      mongoId,
      orderId,
      razorpayOrderId,
    }: {
      deliveryStatus?: string;
      mongoId?: string;
      orderId?: string;
      razorpayOrderId?: string;
    } = body ?? {};

    if (!deliveryStatus || !['pending', 'delivered'].includes(deliveryStatus)) {
      return NextResponse.json(
        { error: 'Invalid delivery status' },
        { status: 400 }
      );
    }

    const rawIds = [routeOrderId, mongoId, orderId, razorpayOrderId]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());

    const uniqueIds = Array.from(new Set(rawIds));

    const filters: Array<Record<string, unknown>> = [];

    uniqueIds.forEach((id) => {
      filters.push({ orderId: id });
      filters.push({ razorpayOrderId: id });
      if (mongoose.Types.ObjectId.isValid(id)) {
        filters.push({ _id: id });
      }
    });

    if (filters.length === 0) {
      return NextResponse.json(
        { error: 'Order identifier is required' },
        { status: 400 }
      );
    }

    console.log('[Admin] Attempting update with filters:', JSON.stringify(filters));
    console.log('[Admin] Update payload:', { deliveryStatus });

    const updatePayload: Record<string, any> = { deliveryStatus };
    if (deliveryStatus === 'delivered') {
      updatePayload.deliveryDate = new Date();
    }

    const order = await CouponsPurchase.findOneAndUpdate(
      { $or: filters },
      { $set: updatePayload },
      { new: true, runValidators: false }
    );

    if (!order) {
      console.warn('[Admin] Delivery status update no-match', {
        routeOrderId,
        mongoId,
        orderId,
        razorpayOrderId,
      });
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const plainOrder = order.toObject ? order.toObject() : order;
    console.log('[Admin] Update succeeded, deliveryStatus now:', plainOrder.deliveryStatus);

    return NextResponse.json({
      order: normalizeOrder(plainOrder),
      matchedBy: uniqueIds,
    });
  } catch (error) {
    console.error('[Admin] Delivery status update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery status' },
      { status: 500 }
    );
  }
}
