/**
 * Payment summary component
 * Displays order details before payment
 */
'use client';

import { IndianRupee, Gamepad2, Globe, User } from 'lucide-react';
import type { UserValidationDetails } from '@/actions/validation';

interface PaymentItem {
  id: number;
  diamondQuantity: number;
  pricePerUnit: string;
  quantity: number;
}

interface PaymentSummaryProps {
  items: PaymentItem[];
  totalAmount: number;
  userDetails: UserValidationDetails;
  customerName: string;
}

export function PaymentSummary({
  items,
  totalAmount,
  userDetails,
  customerName,
}: PaymentSummaryProps) {
  return (
    <div className="space-y-4 bg-white/5 border border-white/10 rounded-lg p-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
      </div>

      {/* Game Account Section */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-emerald-400 uppercase">Game Account</h4>
        </div>

        {/* Player Name - Highlighted */}
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Player Name</p>
          <p className="text-xl font-bold text-emerald-300">{userDetails.username}</p>
        </div>

        {/* Game Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          {userDetails.game && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Game</p>
              <p className="text-sm font-medium text-white">{userDetails.game}</p>
            </div>
          )}

          {userDetails.country && (
            <div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Country</p>
              <p className="text-sm font-medium text-white">{userDetails.country}</p>
            </div>
          )}

          {userDetails.id && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">ID</p>
              <p className="text-sm font-mono text-emerald-400">{userDetails.id}</p>
            </div>
          )}

          {userDetails.server && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Server</p>
              <p className="text-sm font-mono text-blue-400">{userDetails.server}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recipient Section */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-blue-400 uppercase">Recipient</h4>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Name</span>
          <span className="text-white font-medium">{customerName}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 pb-4 border-b border-white/10">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-400">
              {item.diamondQuantity} Diamonds × {item.quantity}
            </span>
            <span className="text-white font-medium flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              {(parseFloat(item.pricePerUnit) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-lg font-semibold text-white">Total Amount:</span>
        <span className="text-2xl font-bold text-violet-400 flex items-center gap-2">
          <IndianRupee className="h-6 w-6" />
          {totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
