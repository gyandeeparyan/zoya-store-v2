import { Button } from "@/components/ui/button";
import { Sparkles, CircleX } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
 
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { ProceedToPaySheet } from "./ProceedToPaySheet";

const cartItems = [
  { 
    id: 1, 
    name: "Diamond Eternity Ring", 
    price: 1299.99, 
    quantity: 1,
    description: "18K White Gold"
  },
  { 
    id: 2, 
    name: "Sapphire Pendant", 
    price: 899.99, 
    quantity: 2,
    description: "Royal Blue"
  },
  { 
    id: 3, 
    name: "Pearl Necklace", 
    price: 2499.99, 
    quantity: 1,
    description: "South Sea Pearls"
  },
];

export function Cart() {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='relative bg-transparent border-none'>
          <ShoppingCart className="text-white" />
          <div className='absolute bottom-4 left-5 w-5 h-5 bg-violet-500 text-white font-bold text-xs rounded-full flex items-center justify-center'>
            {cartItems.length}
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto z-50 max-w-md mx-auto ">
        <SheetHeader className="mb-4 md:mb-8">
          <SheetTitle className="text-white">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className='flex flex-col gap-4 px-4'>
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="relative  rounded-lg p-4 border border-white/20 backdrop-blur-sm"
            >
              <div className="absolute top-3 right-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                    <span className="text-sm text-violet-400">×</span>
                    <span className="text-sm text-gray-400">${item.price}</span>
                  </div>
                  <span className="text-lg font-semibold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="mt-2 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-0 flex items-center gap-2"
                >
                  <CircleX className="w-4 h-4" />
                  REMOVE
                </Button>
              </div>
            </div>
          ))}
          
          {cartItems.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className=" rounded-lg p-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-xl font-bold text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <ProceedToPaySheet />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
