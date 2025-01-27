import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
}


export function ProceedToPaySheet() {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [username, setUsername] = useState("");

  const { register, handleSubmit } = useForm<FormValues>();

  const mockValidateUser = async (data: FormValues) => {
    setIsValidating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock validation - you can replace this with your actual validation logic
    if (data.userId === "123" && data.serverId === "456") {
      setIsValidated(true);
      setUsername("John Doe");
    }
    setIsValidating(false);
  };

 
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-[100%] h-12 text-lg">
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
        <div className='flex flex-col items-center justify-center flex-grow h-[calc(100vh-200px)] md:h-auto md:py-12 gap-6 p-4'>
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
            onClick={handleSubmit(mockValidateUser)}
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
            <p className="text-green-400 text-center w-full">
              Welcome, {username}!
            </p>
          )}
          
          
          {isValidated && username && (
           <Button className="w-[100%] h-12 text-lg">
           Proceed to Pay
         </Button>
          )}
          
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
