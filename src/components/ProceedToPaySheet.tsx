import { Button } from "@/components/ui/button";

import {
  Sheet,

  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const cartItems = [
  { id: 1, name: "Product 1", price: "$10.00", quantity: 1 },
  { id: 2, name: "Product 2", price: "$20.00", quantity: 2 },
  { id: 3, name: "Product 3", price: "$30.00", quantity: 1 },
];

export function ProceedToPaySheet() {
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price.slice(1)) * item.quantity,
    0
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='w-full bg-gradient-to-r from-black to-violet-700 text-white py-2 rounded-lg hover:from-black hover:to-violet-600 transition-colors'>
          Order Now
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto z-50 max-w-md mx-auto'>
        <SheetHeader>
          <SheetTitle>Enter your details</SheetTitle>
          <SheetDescription>
            Review your details and proceed to payment.
          </SheetDescription>
        </SheetHeader>
        <div className='container mx-auto px-4 py-8 bg-transparent text-gray-200'>
          {/* Cart Items Section */}
         

          {/* Summary Section */}
          <div className='bg-gradient-to-br from-white to-violet-500 p-6 text-gray-800 rounded-lg shadow-md'>
            <h2 className='text-3xl font-semibold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent'>
              Summary
            </h2>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg text-gray-600'>Total Price:</span>
              <span className='text-2xl font-bold text-gray-900'>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button className='w-full bg-gradient-to-r from-black to-violet-700 text-white py-2 rounded-lg hover:from-black hover:to-violet-600 transition-colors'>
                Proceed to Pay
            </Button>
          </div>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
