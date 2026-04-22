/**
 * Custom hook for payment processing
 * Manages payment state and Razorpay integration
 */
'use client';

import { useState, useCallback } from 'react';
import { createPaymentOrderAction, verifyPaymentAction } from '@/actions/payment';
import type { CreateOrderPayload } from '@/actions/payment';
import { loadRazorpay } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface UsePaymentReturn {
  isProcessing: boolean;
  isVerifying: boolean;
  error: string | null;
  processPayment: (payload: CreateOrderPayload) => Promise<void>;
  reset: () => void;
}

export function usePayment(onSuccess: () => void, onDismiss?: () => void): UsePaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processPayment = useCallback(
    async (payload: CreateOrderPayload) => {
      setIsProcessing(true);
      setError(null);

      try {
        // Validate Razorpay key is configured
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
          throw new Error('Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local');
        }

        console.log('[usePayment] Starting payment process...');

        // Create order on server
        const orderResult = await createPaymentOrderAction(payload);

        if (!orderResult.success) {
          console.error('[usePayment] Order creation failed:', orderResult.message);
          throw new Error(orderResult.message);
        }

        console.log('[usePayment] Order created:', orderResult.orderId);

        // Load Razorpay
        const razorpay = await loadRazorpay();
        console.log('[usePayment] Razorpay loaded');

        // Prepare Razorpay options
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: orderResult.amount || 0,
          currency: orderResult.currency || 'INR',
          order_id: orderResult.orderId || '',
          name: 'Zoya Store',
          description: 'Diamond Purchase',
          prefill: payload.customerInfo ? {
            name: payload.customerInfo.customerName,
            email: payload.customerInfo.email,
            contact: payload.customerInfo.whatsapp,
          } : undefined,
          handler: async (response: RazorpayResponse) => {
            setIsVerifying(true);
            try {
              const verifyResult = await verifyPaymentAction({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResult.success) {
                toast({
                  title: 'Success',
                  description: 'Payment processed successfully!',
                  variant: 'default',
                });
                onSuccess();
              } else {
                throw new Error(verifyResult.message);
              }
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
            } finally {
              setIsVerifying(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              onDismiss?.();
            },
          },
        };

        console.log('[usePayment] Opening Razorpay with options:', {
          orderId: options.order_id,
          amount: options.amount,
          key: options.key?.substring(0, 10) + '...'
        });

        const paymentObject = new razorpay(options);
        paymentObject.open();
        console.log('[usePayment] Razorpay payment window opened');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
        console.error('[usePayment] Payment error:', errorMessage);
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [toast, onSuccess, onDismiss]
  );

  const reset = useCallback(() => {
    setIsProcessing(false);
    setIsVerifying(false);
    setError(null);
  }, []);

  return {
    isProcessing,
    isVerifying,
    error,
    processPayment,
    reset,
  };
}
