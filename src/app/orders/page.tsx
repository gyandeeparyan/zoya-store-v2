"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { OrderHistoryTable } from "@/components/OrderHistoryTable"

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

export default function OrdersPage() {
  const [whatsapp, setWhatsapp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<OrderDetails[]>([])
  const [hasSearched, setHasSearched] = useState(false)
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
        setOrders([])
        return
      }

      setOrders(data.orders)
      setHasSearched(true)
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
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#05060f] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button className="text-black bg-white hover:bg-gray-300 rounded-full h-10 w-10 p-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Order History</h1>
            <p className="text-sm text-gray-400">
              Enter your WhatsApp number to view your orders.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <fieldset className="border border-white/20 rounded-lg p-4">
            <legend className="px-2 text-sm text-white/60">WhatsApp Number</legend>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="Enter WhatsApp number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/10 border-none text-white h-12 text-lg flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white/5 animate-pulse h-32 rounded-lg" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <OrderHistoryTable orders={orders} isAdmin={false} />
        ) : hasSearched ? (
          <p className="text-center text-gray-400 py-12">
            No orders found for this WhatsApp number
          </p>
        ) : (
          <p className="text-center text-gray-400 py-12">
            Search your orders using your WhatsApp number
          </p>
        )}
      </div>
    </div>
  )
}
