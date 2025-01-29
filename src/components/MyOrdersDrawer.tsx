"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { OrderHistoryTable } from "./OrderHistoryTable"

interface OrderDetails {
  orderId: string;
  purchaseDate: string;
  totalAmount: number;
  status: string;
  items: Array<{
    diamondQuantity: number;
    quantity: number;
    totalPrice: number;
  }>;
}

export function MyOrdersDrawer() {
  const [whatsapp, setWhatsapp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [orders, setOrders] = React.useState<OrderDetails[]>([])
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!whatsapp) {
      toast({
        title: "Error",
        description: "Please enter your WhatsApp number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/search?whatsapp=${whatsapp}`)
      const data = await response.json()
      
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
        return
      }

      setOrders(data.orders)
      if (data.orders.length === 0) {
        toast({
          title: "No Orders Found",
          description: "No orders found for this WhatsApp number",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="">Orders</button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full text-white z-50 max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Order History</DrawerTitle>
            <DrawerDescription>
              Enter your WhatsApp number to view your orders.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="Enter WhatsApp number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/5 animate-pulse h-16 rounded-lg" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <OrderHistoryTable orders={orders} />
            ) : (
              <p className="text-center text-gray-400 py-8">
                Search your orders using your WhatsApp number
              </p>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="bg-violet-100 text-black">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
