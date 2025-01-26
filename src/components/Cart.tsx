

import {
  Sheet,

  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { ProceedToPaySheet } from "./ProceedToPaySheet";

const cartItems = [
  { id: 1, name: "Product 1", price: "$10.00", quantity: 1 },
  { id: 2, name: "Product 2", price: "$20.00", quantity: 2 },
  { id: 3, name: "Product 3", price: "$30.00", quantity: 1 },
];

export function Cart() {
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price.slice(1)) * item.quantity,
    0
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='relative bg-transparent border-none'>
          <ShoppingCart />
          <div className='absolute bottom-4 left-5 w-5 h-5 bg-violet-50 text-black font-bold text-xs rounded-full flex items-center justify-center'>
            2
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto z-50 max-w-md mx-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout.
          </SheetDescription>
        </SheetHeader>
        <div className='container mx-auto px-4 py-8 bg-transparent text-gray-200'>
          {/* Cart Items Section */}
         

          {/* Summary Section */}
          <div className="bg-gradient-to-br from-white to-violet-500 p-6 text-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Summary
            </h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-gray-600">Total Price:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
       <ProceedToPaySheet/>
          </div>
        </div>
        <SheetFooter>
        
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
