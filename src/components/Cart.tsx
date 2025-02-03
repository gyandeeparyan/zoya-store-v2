import { VibratingButton as Button } from "@/components/ui/vibrating-button";
import { Sparkles, CircleX, ShoppingCart, IndianRupee } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from '@/context/cartContext';
import Link from "next/link";
import Image from "next/image";

export function Cart() {
  const { items, removeItem, clearCart, getCartTotal } = useCart();

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
      <SheetContent className="overflow-y-auto z-50 max-w-md ">
        <SheetHeader className="mb-4 md:mb-8">
          <div className="flex flex-col gap-2 justify-between items-center w-full">
            <SheetTitle className="text-white">Your Cart</SheetTitle>
            {items.length > 0 && (
              <Link href="/payment" className="w-full">
                <SheetClose className="w-full">
                  <Button
                    type="submit" 
                    className="w-[100%] h-12 mt-4  md:block text-lg"
                  >
                    Order Now
                  </Button>
                </SheetClose>
              </Link>
            )}
          </div>
        </SheetHeader>
        
        <div className='flex flex-col gap-4 px-0'>
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
                  className="relative rounded-lg p-4 border border-white/20 hover:border-violet-500/20 transition-colors duration-300"
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 group"
                  >
                    <CircleX className="w-4 h-4 text-white transition-transform group-hover:rotate-90 duration-200" />
                  </button>
                  
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                      <Image
                        src={item.imgUrl}
                        alt={`${item.newQuantity} Diamonds`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-grow py-1">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                          <span>{item.newQuantity} DIAMONDS</span>
                          <span className="flex items-center gap-1 text-violet-100">
                            <IndianRupee className="h-4 w-4"/>
                            {(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-violet-400/50">•</span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3"/>
                            {item.price} each
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full bg-red-500/10 h-12 text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-4 border border-red-500/20"
                >
                  <CircleX className="w-4 h-4 mr-2" />
                  CLEAR CART
                </Button>
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
