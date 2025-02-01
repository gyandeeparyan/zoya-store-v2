import { VibratingButton as Button } from "@/components/ui/vibrating-button";
import { Sparkles, CircleX, ShoppingCart ,IndianRupee} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export function Cart() {
  const { items, removeItem, clearCart, getCartTotal } = useCart();
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className='relative bg-transparent border-none'>
          <ShoppingCart className="text-white" />
          <div className='absolute bottom-4 left-5 w-5 h-5 bg-violet-500/20 text-violet-400 font-bold text-xs rounded-full flex items-center justify-center'>
            {items.length}
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto z-50 max-w-md mx-auto">
        <SheetHeader className="mb-4 md:mb-8">
          <div className="flex flex-col gap-2 justify-between items-center w-full">
            <SheetTitle className="text-white">Your Cart</SheetTitle>
            {items.length > 0 && (
              <Link href="/payment" className="w-full">
                <SheetClose className="w-full">
                  <Button
                    type="submit" 
                    className="w-[92%] h-12 mt-4  md:block text-lg"
                  >
                    Order Now
                  </Button>
                </SheetClose>
              </Link>
            )}
          </div>
        </SheetHeader>
        
        <div className='flex flex-col gap-4 px-4'>
          {items.length > 0 ? (
            <>
            <div className="rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="text-xl font-bold flex gap-1 items-center text-white">
                      <IndianRupee className="h-4 w-4"/> {getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="relative  rounded-lg p-4 border border-white/20 backdrop-blur-sm"
                >
                  <div className="absolute top-3 right-3 animate-pulse">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {item.newQuantity} DIAMONDS
                    </h3>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Cart Qty: {item.quantity}</span>
                        <span className="text-sm text-violet-400">×</span>
                        <span className="text-sm flex gap-1 items-center text-gray-400"> <IndianRupee className="h-4 w-4"/>{item.price}</span>
                      </div>
                      <span className="text-lg flex gap-1 font-semibold items-center text-white">
                        <IndianRupee className="h-4 w-4"/>{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => removeItem(item.id)}
                      className="mt-2 h-8 w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 p-0 flex items-center gap-2"
                    >
                      <CircleX className="w-4 h-4" />
                      REMOVE
                    </Button>
                  </div>
                </div>
              ))}
              
              {items.length > 0 && (
                <div className="mt-4 space-y-4">
                  
                  
                  {items.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="w-full text-red-400 hover:text-red-300"
                  >
                    <CircleX className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                )}
                 
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center px-4">
              <ShoppingCart className="w-16 h-16 text-violet-400/50 animate-bounce" />
              <h3 className="text-xl font-semibold text-white">
                Your Cart is Empty! 
              </h3>
              <p className="text-gray-400 max-w-[250px]">
                Time to shine!  Add some sparkling diamonds to your cart and make your gaming experience extraordinary! 
              </p>
            
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
