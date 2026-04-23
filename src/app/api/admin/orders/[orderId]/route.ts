import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';
import mongoose from 'mongoose';

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
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

    const updatePayload: Record<string, string | Date> = { deliveryStatus };
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
