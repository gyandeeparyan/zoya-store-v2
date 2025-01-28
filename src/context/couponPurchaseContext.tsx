'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from './cartContext';
import { useUser } from './userContext';

interface CouponItem {
  id: number;
  diamondQuantity: number;
  pricePerUnit: string;
  quantity: number;
  totalPrice: number;
}

interface PurchaseDetails {
  orderId: string;
  purchaseDate: string;
  items: CouponItem[];
  totalAmount: number;
  customerInfo: {
    userId: string;
    serverId: string;
    username: string;
    customerName: string;
    whatsapp: string;
    email: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentId?: string;
}

interface CouponPurchaseContextType {
  purchaseDetails: PurchaseDetails | null;
  setPurchaseDetails: (details: PurchaseDetails) => void;
  clearPurchaseDetails: () => void;
  initializePurchase: () => void;
  updatePaymentStatus: (status: PurchaseDetails['status'], paymentId?: string) => void;
}

const CouponPurchaseContext = createContext<CouponPurchaseContextType | undefined>(undefined);

export function CouponPurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const { items, getCartTotal } = useCart();
  const { userDetails } = useUser();

  const clearPurchaseDetails = () => {
    setPurchaseDetails(null);
  };

  const initializePurchase = () => {
    if (!userDetails || items.length === 0) return;

    const couponItems: CouponItem[] = items.map(item => ({
      id: item.id,
      diamondQuantity: item.newQuantity,
      pricePerUnit: item.price,
      quantity: item.quantity,
      totalPrice: parseFloat(item.price) * item.quantity
    }));

    const newPurchaseDetails: PurchaseDetails = {
      orderId: `ORD${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      items: couponItems,
      totalAmount: getCartTotal(),
      customerInfo: {
        userId: userDetails.userId,
        serverId: userDetails.serverId,
        username: userDetails.username,
        customerName: userDetails.customerName,
        whatsapp: userDetails.whatsapp,
        email: userDetails.email
      },
      status: 'pending'
    };

    setPurchaseDetails(newPurchaseDetails);
  };

  const updatePaymentStatus = (status: PurchaseDetails['status'], paymentId?: string) => {
    if (!purchaseDetails) return;

    setPurchaseDetails({
      ...purchaseDetails,
      status,
      paymentId
    });
  };

  // Initialize purchase details when user details or cart items change
  useEffect(() => {
    if (userDetails && items.length > 0) {
      initializePurchase();
    }
  }, [userDetails, items]);

  return (
    <CouponPurchaseContext.Provider 
      value={{ 
        purchaseDetails, 
        setPurchaseDetails, 
        clearPurchaseDetails,
        initializePurchase,
        updatePaymentStatus
      }}
    >
      {children}
    </CouponPurchaseContext.Provider>
  );
}

export function useCouponPurchase() {
  const context = useContext(CouponPurchaseContext);
  if (context === undefined) {
    throw new Error('useCouponPurchase must be used within a CouponPurchaseProvider');
  }
  return context;
}
