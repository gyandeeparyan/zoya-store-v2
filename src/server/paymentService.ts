/**
 * Server-side payment service
 * Handles all payment-related operations securely
 */
'use server';

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/database/dbConnect';
import { CouponsPurchase } from '@/models/couponsPurchase.model';
import crypto from 'crypto';

// Initialize Razorpay with secure credentials
const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

interface CreateOrderInput {
  totalAmount: number;
  customerInfo: {
    customerName: string;
    email: string;
    whatsapp: string;
    userId: string;
    serverId: string;
    username?: string;
  };
  items: Array<{
    id: number;
    diamondQuantity: number;
    pricePerUnit: string;
    quantity: number;
  }>;
}

interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

/**
 * Create order on server side with database persistence
 */
export async function createOrderServer(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
        process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
      console.error('[Payment Service] Razorpay credentials not configured');
      return {
        success: false,
        error: 'Payment gateway is not configured'
      };
    }

    // Validate input
    if (!input.totalAmount || input.totalAmount <= 0) {
      return {
        success: false,
        error: 'Invalid amount'
      };
    }

    if (!input.customerInfo || !input.items?.length) {
      return {
        success: false,
        error: 'Missing required information'
      };
    }

    await dbConnect();

    // Create order in database first
    const dbOrderId = `ORD${Date.now()}`;
    const dbOrder = await CouponsPurchase.create({
      orderId: dbOrderId,
      purchaseDate: new Date(),
      totalAmount: input.totalAmount,
      status: 'pending',
      user: input.customerInfo,
      items: input.items
    });

    if (!dbOrder) {
      return {
        success: false,
        error: 'Failed to create order'
      };
    }

    // Create Razorpay order (amount in paise)
    const amountInPaise = Math.round(input.totalAmount * 100);
    const razorpayOrder = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: dbOrderId,
      notes: {
        customerId: input.customerInfo.userId,
        serverId: input.customerInfo.serverId
      }
    });

    // Store Razorpay order ID in database
    await CouponsPurchase.findByIdAndUpdate(
      dbOrder._id,
      { razorpayOrderId: razorpayOrder.id }
    );

    return {
      success: true,
      orderId: razorpayOrder.id,
      amount: input.totalAmount,
      currency: 'INR'
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Order creation failed';
    console.error('[Payment Service] Error creating order:', errorMsg);

    return {
      success: false,
      error: 'Failed to create order. Please try again.'
    };
  }
}

interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface VerifyPaymentResult {
  success: boolean;
  error?: string;
}

/**
 * Verify payment signature on server side
 */
export async function verifyPaymentServer(
  input: VerifyPaymentInput
): Promise<VerifyPaymentResult> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;

    // Validate signature
    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(signatureBody)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.warn('[Payment Service] Invalid payment signature');
      return {
        success: false,
        error: 'Invalid payment signature'
      };
    }

    await dbConnect();

    // Update order status in database
    const updatedOrder = await CouponsPurchase.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Verification failed';
    console.error('[Payment Service] Error verifying payment:', errorMsg);

    return {
      success: false,
      error: 'Payment verification failed'
    };
  }
}
