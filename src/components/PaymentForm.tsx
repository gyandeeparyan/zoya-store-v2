'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2, IndianRupee, ShoppingCart, ArrowLeft } from "lucide-react";
import { useUser } from '@/context/userContext';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/context/cartContext';
import { useCouponPurchase } from '@/context/couponPurchaseContext';
import { loadRazorpay } from '@/lib/razorpay';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

interface FormValues {
  userId: string;
  serverId: string;
  customerName: string;
  whatsapp: string;
  email: string;
}

interface ValidationResponse {
  success: boolean;
  game: string;
  id: number;
  server: number;
  name: string;
}

interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  error?: string;
}

interface VerifyResponse {
  success: boolean;
  error?: string;
}

export function PaymentForm() {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const { setUserDetails } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>();
  const { clearCart, getCartTotal } = useCart();
  const { purchaseDetails, clearPurchaseDetails } = useCouponPurchase();
  const totalAmount = getCartTotal();

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
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
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

  const validateUser = async (data: FormValues) => {
    setIsValidating(true);
    try {
      const response = await fetch(
        `https://api.isan.eu.org/nickname/ml?id=${data.userId}&zone=${data.serverId}`
      );
      
      const result: ValidationResponse = await response.json();
      
      if (result.success && result.name) {
        setIsValidated(true);
        setUsername(result.name);
        toast({
          title: "Success",
          description: "User validated successfully!",
          variant: "default",
        });
      } else {
        toast({
          title: "Validation Failed",
          description: "Invalid User ID or Server ID. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate user. Please try again.",
        variant: "destructive",
      });
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseDetails })
      });

      const data: OrderResponse = await response.json();
      if (data.error) throw new Error(data.error);

      const razorpay = await loadRazorpay();
      
      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Zoya Store',
        description: 'Diamond Purchase',
        handler: async function(response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData: VerifyResponse = await verifyResponse.json();
            
            if (verifyData.success) {
              toast({
                title: "Payment Successful",
                description: "Your order has been placed successfully!",
                variant: "default",
              });
              handleSuccess();
            }
          } catch (error) {
            toast({
              title: "Payment Failed",
              description: "There was an error processing your payment.",
              variant: "destructive",
            });
          }
        },
        prefill: purchaseDetails?.customerInfo ? {
          name: purchaseDetails.customerInfo.customerName,
          email: purchaseDetails.customerInfo.email,
          contact: purchaseDetails.customerInfo.whatsapp
        } : undefined,
       
      };

      const paymentObject = new razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    clearCart();
    clearPurchaseDetails();
    router.push('/');
  };

  const onSubmit = (data: FormValues) => {
    setUserDetails({
      userId: data.userId,
      serverId: data.serverId,
      username: username,
      customerName: data.customerName,
      whatsapp: data.whatsapp,
      email: data.email
    });
    handlePayment();
  };

  return (
    <div className="max-w-[150%] w-full md:w-[90%] mx-auto bg-transparent backdrop-blur-sm rounded-lg border-white/20 p-4">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 ">
          <h1 className="text-2xl font-bold text-center text-white mb-2">Enter your details</h1>
          <p className="text-gray-400">Review your details and proceed to payment.</p>
        </div>

        <div className="mb-8">
          <p className="text-lg text-white flex items-center">
            Total Amount: 
            <span className="font-bold flex items-center gap-1 ml-2">
              <IndianRupee className="h-5 w-5"/>
              {getCartTotal().toFixed(2)}
            </span>
          </p>
        </div>
      </div>
     

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-[100%] items-center justify-center flex-col md:flex-row gap-8">
        {/* Left Section - Validation */}
        <div className={`flex flex-col gap-6 w-full ${isValidated ? 'md:w-[40%]' : 'md:w-[40%]'} 
          ${isValidated && 'md:border-r md:pr-8 md:border-white/20'}`}>
          <div className={isValidated ? 'md:block hidden w-full' : 'block w-full'}>
            <fieldset className="border border-white/20 rounded-lg p-4 w-full">
              <legend className="px-2 text-sm text-white/60">User ID</legend>
              <Input
                {...register("userId", { required: "User ID is required" })}
                placeholder="Enter User ID"
                className="bg-white/10 border-none text-white h-12 text-lg w-full"
              />
              {errors.userId && (
                <p className="text-red-400 text-sm mt-1">{errors.userId.message}</p>
              )}
            </fieldset>

            <fieldset className="border border-white/20 rounded-lg p-4 mt-6 w-full">
              <legend className="px-2 text-sm text-white/60">Server ID</legend>
              <Input
                {...register("serverId", { required: "Server ID is required" })}
                placeholder="Enter Server ID"
                className="bg-white/10 border-none text-white h-12 text-lg w-full"
              />
              {errors.serverId && (
                <p className="text-red-400 text-sm mt-1">{errors.serverId.message}</p>
              )}
            </fieldset>

            <Button 
              type="button"
              onClick={handleSubmit(validateUser)}
              disabled={isValidating || isValidated}
              className="w-full h-12 text-lg mt-6"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating
                </>
              ) : isValidated ? (
                "Validated ✓"
              ) : (
                "Validate"
              )}
            </Button>
          </div>

          {isValidated && username && (
            <div className="md:mt-auto p-4 bg-white/5 rounded-lg border border-white/10 w-full">
              <p className="text-green-400 text-center text-lg font-medium">
                Welcome, {username}!
              </p>
              <div className="mt-4 text-white/60 text-sm space-y-2">
                <p className="flex justify-between">
                  <span>User ID:</span> 
                  <span className="text-white">{getValues("userId")}</span>
                </p>
                <p className="flex justify-between">
                  <span>Server ID:</span> 
                  <span className="text-white">{getValues("serverId")}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - User Details */}
        {isValidated && username && (
          <div className={`flex flex-col gap-6 w-full md:w-[40%] md:pl-8 ${isValidated ? 'block' : 'hidden md:block'}`}>
            <fieldset className="border border-white/20 rounded-lg p-4">
              <legend className="px-2 text-sm text-white/60">Full Name</legend>
              <Input
                {...register("customerName", { required: "Full name is required" })}
                placeholder="Enter your full name"
                className="bg-white/10 border-none text-white h-12 text-lg w-full"
              />
              {errors.customerName && (
                <p className="text-red-400 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </fieldset>

            <fieldset className="border border-white/20 rounded-lg p-4">
              <legend className="px-2 text-sm text-white/60">WhatsApp Number</legend>
              <Input
                {...register("whatsapp", { required: "WhatsApp number is required" })}
                placeholder="Enter WhatsApp number"
                type="tel"
                className="bg-white/10 border-none text-white h-12 text-lg w-full"
              />
              {errors.whatsapp && (
                <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>
              )}
            </fieldset>

            <fieldset className="border border-white/20 rounded-lg p-4">
              <legend className="px-2 text-sm text-white/60">Email Address</legend>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter email address"
                type="email"
                className="bg-white/10 border-none text-white h-12 text-lg w-full"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </fieldset>

            <Button 
              type="submit"
              className="w-full h-12 text-lg mt-auto"
            >
              Proceed to Pay
            </Button>
          </div>
        )}
      </form>

    </div>
  );
}
