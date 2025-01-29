import { VibratingButton as Button } from "@/components/ui/vibrating-button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from '@/context/userContext';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/context/cartContext';
import { useCouponPurchase } from '@/context/couponPurchaseContext';
import { loadRazorpay } from '@/lib/razorpay';

import {
  SheetClose,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export function ProceedToPaySheet() {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [username, setUsername] = useState("");

  const { setUserDetails } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, getValues } = useForm<FormValues>();
  const { clearCart } = useCart();
  const { purchaseDetails, clearPurchaseDetails } = useCouponPurchase();

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
              clearCart();
              clearPurchaseDetails();
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
        } : undefined
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

  const handleProceedToPay = () => {
    const formValues = getValues();
    setUserDetails({
      userId: formValues.userId,
      serverId: formValues.serverId,
      username: username,
      customerName: formValues.customerName,
      whatsapp: formValues.whatsapp,
      email: formValues.email
    });
    handlePayment();
  };

  return (
    <Sheet>
      
      <SheetTrigger asChild>
     
        <Button className="w-[91%] h-12 text-lg">
          Order Now
        </Button>
       
      </SheetTrigger>
      <SheetContent className='overflow-y-auto z-50 max-w-md mx-auto'>
        
        <SheetHeader className="mb-4 md:mb-8">
          <SheetTitle>Enter your details</SheetTitle>
          <SheetDescription>
            Review your details and proceed to payment.
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col overflow-y-scroll items-center justify-center flex-grow h-[calc(100vh-200px)] md:h-auto md:py-12 gap-6 p-4'>
          <fieldset className="border border-white/20 rounded-lg p-4 w-[100%]">
            <legend className="px-2 text-sm text-white/60">User ID</legend>
            <Input
              placeholder="Enter User ID"
              {...register("userId")}
              className="bg-white/10 border-none text-white h-12 text-lg w-full"
            />
          </fieldset>

          <fieldset className="border border-white/20 rounded-lg p-4 w-[100%]">
            <legend className="px-2 text-sm text-white/60">Server ID</legend>
            <Input
              placeholder="Enter Server ID"
              {...register("serverId")}
              className="bg-white/10 border-none text-white h-12 text-lg w-full"
            />
          </fieldset>

          <Button 
            onClick={handleSubmit(validateUser)}
            disabled={isValidating || isValidated}
            className="w-full h-12 text-lg"
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
          
          {isValidated && username && (
            <>
              <p className="text-green-400 text-center w-full">
                Welcome, {username}!
              </p>

              <fieldset className="border border-white/20 rounded-lg p-4 w-[100%]">
                <legend className="px-2 text-sm text-white/60">Full Name</legend>
                <Input
                  placeholder="Enter your full name"
                  {...register("customerName", { required: true })}
                  className="bg-white/10 border-none text-white h-12 text-lg w-full"
                />
              </fieldset>

              <fieldset className="border border-white/20 rounded-lg p-4 w-[100%]">
                <legend className="px-2 text-sm text-white/60">WhatsApp Number</legend>
                <Input
                  placeholder="Enter WhatsApp number"
                  type="tel"
                  {...register("whatsapp", { required: true })}
                  className="bg-white/10 border-none text-white h-12 text-lg w-full"
                />
              </fieldset>

              <fieldset className="border border-white/20 rounded-lg p-4 w-[100%]">
                <legend className="px-2 text-sm text-white/60">Email Address</legend>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  {...register("email", { required: true })}
                  className="bg-white/10 border-none text-white h-12 text-lg w-full"
                />
              </fieldset>
             <SheetClose asChild>
              <Button 
               
                onClick={handleSubmit(handleProceedToPay)} 
                className="w-full h-12 text-lg"
              >
                Proceed to Pay
              </Button>
              </SheetClose>
            </>
          )}
          
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
