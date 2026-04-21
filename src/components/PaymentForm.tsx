/**
 * Payment Form Component - Refactored & Modular
 * Orchestrates user validation, payment processing, and order management
 * API URLs are kept on server-side for security
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cartContext';
import { useCouponPurchase } from '@/context/couponPurchaseContext';
import { useUser } from '@/context/userContext';
import { usePayment } from '@/hooks/usePayment';
import { motion } from 'framer-motion';
import type { UserValidationDetails } from '@/actions/validation';

// Import modular components
import { UserValidationForm } from './UserValidationForm';
import { CustomerInfoForm } from './CustomerInfoForm';
import { PaymentSummary } from './PaymentSummary';

type PaymentStep = 'validation' | 'customer-info' | 'summary' | 'payment';

interface CustomerData {
  customerName: string;
  whatsapp: string;
  email: string;
}

export function PaymentForm() {
  const router = useRouter();
  const { getCartTotal, clearCart } = useCart();
  const { purchaseDetails, clearPurchaseDetails } = useCouponPurchase();
  const { setUserDetails } = useUser();

  const [step, setStep] = useState<PaymentStep>('validation');
  const [userValidationDetails, setUserValidationDetails] = useState<UserValidationDetails | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  const { isProcessing, isVerifying, error: paymentError, processPayment } = usePayment(() => {
    handlePaymentSuccess();
  });

  const totalAmount = getCartTotal();

  // Show empty cart message
  if (totalAmount <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-[80vh] flex flex-col items-center justify-center gap-6 px-4"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <ShoppingCart className="w-16 h-16 text-violet-400/50" />
        </motion.div>

        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-gray-400 italic">
            The best way to predict the future is to create it.
          </p>
        </div>

        <Button
          onClick={() => router.push('/')}
          className="mt-4 gap-2"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Button>
      </motion.div>
    );
  }

  const handleValidationSuccess = (userDetails: UserValidationDetails) => {
    setUserValidationDetails(userDetails);
    setStep('customer-info');
  };

  const handleCustomerInfoSubmit = (data: CustomerData) => {
    setCustomerData(data);
    setStep('summary');
  };

  const handlePaymentSuccess = () => {
    clearCart();
    clearPurchaseDetails();
    router.push('/');
  };

  const handleProceedToPayment = async () => {
    if (!purchaseDetails || !customerData || !userValidationDetails) {
      console.error('[PaymentForm] Missing purchase details or customer data or validation details');
      return;
    }

    // Update user details for context
    setUserDetails({
      userId: purchaseDetails.customerInfo.userId,
      serverId: purchaseDetails.customerInfo.serverId,
      username: userValidationDetails.username,
      customerName: customerData.customerName,
      whatsapp: customerData.whatsapp,
      email: customerData.email,
    });

    setStep('payment');

    // Initiate payment processing - await for proper error handling
    try {
      await processPayment({
        totalAmount: purchaseDetails.totalAmount,
        customerInfo: {
          ...purchaseDetails.customerInfo,
          customerName: customerData.customerName,
          whatsapp: customerData.whatsapp,
          email: customerData.email,
        },
        items: purchaseDetails.items,
      });
    } catch (err) {
      console.error('[PaymentForm] Payment processing error:', err);
      // Go back to summary on error so user can retry
      if (paymentError) {
        setTimeout(() => setStep('summary'), 2000);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent backdrop-blur-sm rounded-lg p-4 md:p-8">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          {step === 'validation' && 'Validate Your Account'}
          {step === 'customer-info' && 'Enter Your Details'}
          {step === 'summary' && 'Review Your Order'}
          {step === 'payment' && 'Processing Payment'}
        </h1>
        <p className="text-gray-400 text-center">
          {step === 'validation' && 'Verify your game account'}
          {step === 'customer-info' && 'Provide your contact information'}
          {step === 'summary' && 'Review and confirm your order'}
          {step === 'payment' && 'Completing your purchase...'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: User Validation */}
        {step === 'validation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UserValidationForm onValidationSuccess={handleValidationSuccess} />
          </motion.div>
        )}

        {/* Step 2: Customer Info */}
        {step === 'customer-info' && userValidationDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Game Account Verification Summary */}
            <div className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/30 rounded-lg p-4 space-y-3">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">✓ Game Account Verified</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Player Name</p>
                  <p className="font-bold text-emerald-300">{userValidationDetails.username}</p>
                </div>
                {userValidationDetails.game && (
                  <div>
                    <p className="text-gray-400 text-xs">Game</p>
                    <p className="font-semibold text-white truncate">{userValidationDetails.game}</p>
                  </div>
                )}

              </div>
              <Button>Procced to Pay</Button>
            </div>
            <CustomerInfoForm
              onSubmit={handleCustomerInfoSubmit}
              disabled={isProcessing || isVerifying}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('validation')}
              disabled={isProcessing}
            >
              Back
            </Button>
          </motion.div>
        )}

        {/* Step 3: Order Summary */}
        {step === 'summary' && purchaseDetails && customerData && userValidationDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <PaymentSummary
              items={purchaseDetails.items}
              totalAmount={purchaseDetails.totalAmount}
              userDetails={userValidationDetails}
              customerName={customerData.customerName}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('customer-info')}
                disabled={isProcessing || isVerifying}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleProceedToPayment}
                disabled={isProcessing || isVerifying}
              >
                {isProcessing || isVerifying ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Payment Processing */}
        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12"
          >
            {paymentError ? (
              <>
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">Payment Failed</p>
                <p className="text-red-400 text-sm mt-2">{paymentError}</p>
                <Button
                  className="mt-6"
                  onClick={() => setStep('summary')}
                >
                  Back to Review
                </Button>
              </>
            ) : (
              <>
                <div className="animate-spin mb-4">
                  <ShoppingCart className="w-12 h-12 text-violet-400" />
                </div>
                <p className="text-white text-lg font-medium">Processing your payment...</p>
                <p className="text-gray-400 text-sm mt-2">Please complete the payment in the popup window</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
