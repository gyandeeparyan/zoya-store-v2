/**
 * Payment-related server actions
 * Bridge between client components and server-side payment service
 */
'use server';

import { createOrderServer, verifyPaymentServer } from '../server/paymentService';

export interface CreateOrderPayload {
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

export interface PaymentActionResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  message: string;
}

/**
 * Server action for creating payment orders
 * Called from client - Razorpay credentials stay secure
 */
export async function createPaymentOrderAction(
  payload: CreateOrderPayload
): Promise<PaymentActionResult> {
  try {
    console.log('[createPaymentOrderAction] Starting order creation with amount:', payload.totalAmount);

    // Validate payload
    if (!payload.totalAmount || payload.totalAmount <= 0) {
      console.error('[createPaymentOrderAction] Invalid amount:', payload.totalAmount);
      return {
        success: false,
        message: 'Invalid amount'
      };
    }

    if (!payload.customerInfo || !payload.items?.length) {
      console.error('[createPaymentOrderAction] Missing required fields');
      return {
        success: false,
        message: 'Missing required information'
      };
    }

    const result = await createOrderServer(payload);
    console.log('[createPaymentOrderAction] Order creation result:', { success: result.success, orderId: result.orderId });

    if (!result.success) {
      console.error('[createPaymentOrderAction] Server error:', result.error);
      return {
        success: false,
        message: result.error || 'Failed to create order'
      };
    }

    return {
      success: true,
      orderId: result.orderId,
      amount: result.amount,
      currency: result.currency,
      message: 'Order created successfully'
    };
  } catch (error) {
    console.error('[Payment Actions] Error:', error);
    return {
      success: false,
      message: 'Failed to process order'
    };
  }
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentActionResult {
  success: boolean;
  message: string;
}

/**
 * Server action for verifying payment
 * Signature verification happens securely on server
 */
export async function verifyPaymentAction(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentActionResult> {
  try {
    const result = await verifyPaymentServer(payload);

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Payment verification failed'
      };
    }

    return {
      success: true,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error('[Payment Verification] Error:', error);
    return {
      success: false,
      message: 'Failed to verify payment'
    };
  }
}
