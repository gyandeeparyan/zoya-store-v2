import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from '@/context/userContext';
import { useToast } from "@/hooks/use-toast";

import {
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

export function ProceedToPaySheet() {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [username, setUsername] = useState("");

  const { setUserDetails } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, getValues } = useForm<FormValues>();

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
    // Proceed with payment logic here
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
            className="w-[100%] h-12 text-lg"
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

              <Button 
                onClick={handleSubmit(handleProceedToPay)} 
                className="w-[100%] h-12 text-lg"
              >
                Proceed to Pay
              </Button>
            </>
          )}
          
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
