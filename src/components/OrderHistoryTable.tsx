"use client"

import { useEffect, useMemo, useState } from 'react';
import { Accordion } from "@/components/ui/accordion"
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Gem, IndianRupee, Package2, ReceiptText, UserRound, XCircle, Truck } from 'lucide-react';

const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(125, 211, 252, 0.4) transparent;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(125, 211, 252, 0.5), rgba(59, 130, 246, 0.4));
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(125, 211, 252, 0.7), rgba(59, 130, 246, 0.6));
    background-clip: content-box;
  }
  @keyframes spin-clock {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-clock {
    animation: spin-clock 3s linear infinite;
  }
`;

interface OrderHistoryTableProps {
  orders: Array<{
    _id?: string;
    orderId: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    purchaseDate: string;
    totalAmount: number;
    status: string;
    deliveryStatus?: 'pending' | 'delivered';
    deliveryDate?: string | null;
    user?: {
      userId?: string;
      serverId?: string;
      username?: string;
      customerName?: string;
      whatsapp?: string;
      email?: string;
    };
    items: Array<{
      diamondQuantity: number;
      pricePerUnit?: number;
      quantity: number;
      totalPrice: number;
    }>;
  }>;
  onUpdateDeliveryStatus?: (
    identifiers: { mongoId?: string; orderId?: string; razorpayOrderId?: string },
    status: 'pending' | 'delivered'
  ) => Promise<void>;
}

const statusConfig = {
  completed: {
    label: 'Payment Completed',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Payment Pending',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Clock,
  },
  failed: {
    label: 'Payment Failed',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: XCircle,
  },
} as const;

const ORDERS_PER_PAGE = 5;

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderHistoryTable({ orders, onUpdateDeliveryStatus }: OrderHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalDiamonds = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.diamondQuantity * item.quantity, 0),
    0
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [currentPage, orders]);

  const startOrder = orders.length === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
  const endOrder = Math.min(currentPage * ORDERS_PER_PAGE, orders.length);

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/12 to-sky-500/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Orders</p>
            <p className="mt-2 text-2xl font-semibold text-white">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 to-lime-500/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">Spent</p>
            <p className="mt-2 flex items-center gap-1 text-2xl font-semibold text-white">
              <IndianRupee className="h-5 w-5 text-emerald-300" />
              {totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/12 to-fuchsia-500/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-violet-200/70">Diamonds</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white">
              <Gem className="h-5 w-5 text-violet-300" />
              {totalDiamonds}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/12 to-orange-500/5 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">Latest</p>
            <p className="mt-2 text-sm font-medium text-white">
              {orders[0] ? formatDate(orders[0].purchaseDate) : 'No orders'}
            </p>
          </div>
        </div>

        <div className="max-h-[calc(100vh-400px)] w-full space-y-4 overflow-y-auto custom-scrollbar pb-2">
          {paginatedOrders.map((order, index) => {
          const displayIndex = (currentPage - 1) * ORDERS_PER_PAGE + index;
          const totalDiamondsForOrder = order.items.reduce(
            (sum, item) => sum + item.diamondQuantity * item.quantity,
            0
          );
          const status = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <Accordion
              key={order.orderId}
              defaultOpen={index === 0}
              className="w-full rounded-2xl border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.12),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
              title={
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                          Order #{displayIndex + 1}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${status.badge}`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${order.status === 'pending' ? 'animate-spin-clock' : ''}`} />
                          {status.label}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-cyan-100 break-all">{order.orderId}</p>
                      <p className="text-xs text-white/55">Placed on {formatDate(order.purchaseDate)}</p>
                      {order.deliveryStatus === 'delivered' ? (
                        <p className='text-xs text-white/55'> Delivered Successfully on {formatDate(order.deliveryDate || order.purchaseDate)}</p>
                      ) : (
                        <p className='text-xs text-white/55'> Yet to be delivered</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-left md:min-w-[320px]">
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">Amount</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-emerald-300">
                          <IndianRupee className="h-4 w-4" />
                          {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">Diamonds</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-violet-200">
                          <Gem className="h-4 w-4 text-violet-300" />
                          {totalDiamondsForOrder}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">Items</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
                          <Package2 className="h-4 w-4 text-cyan-300" />
                          {order.items.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.user?.customerName && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/65">
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5 text-cyan-300" />
                        {order.user.customerName}
                      </span>
                      {order.user.username && <span className="text-cyan-100">@{order.user.username}</span>}
                      {order.user.userId && <span>Player ID: {order.user.userId}</span>}
                      {order.user.serverId && <span>Server: {order.user.serverId}</span>}
                    </div>
                  )}
                </div>
              }
            >
              <div className="space-y-5 text-sm text-white/80">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                      <ReceiptText className="h-4 w-4" />
                      Payment Details
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Order ID</p>
                        <p className="font-mono text-cyan-100 break-all">{order.orderId}</p>
                      </div>
                      {order.razorpayOrderId && (
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Razorpay Order ID</p>
                          <p className="font-mono text-white/75 break-all">{order.razorpayOrderId}</p>
                        </div>
                      )}
                      {order.razorpayPaymentId && (
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Razorpay Payment ID</p>
                          <p className="font-mono text-white/75 break-all">{order.razorpayPaymentId}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Purchase Date</p>
                          <p>{formatDate(order.purchaseDate)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Status</p>
                          <p>{status.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                      <UserRound className="h-4 w-4" />
                      User Details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Customer</p>
                        <p>{order.user?.customerName ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Username</p>
                        <p className="text-white/70">{order.user?.username ? `@${order.user.username}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Player ID</p>
                        <p className="font-mono text-cyan-100">{order.user?.userId ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Server ID</p>
                        <p className="font-mono text-cyan-100">{order.user?.serverId ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">WhatsApp</p>
                        <p>{order.user?.whatsapp ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Email</p>
                        <p className="break-all">{order.user?.email ?? 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                    <Package2 className="h-4 w-4" />
                    Item Breakdown
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={`${order.orderId}-${itemIndex}`}
                        className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Package</p>
                          <p className="flex items-center gap-2 font-medium text-white">
                            <Gem className="h-4 w-4 text-violet-300" />
                            {item.diamondQuantity} diamonds x {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Per Unit</p>
                          <p className="flex items-center gap-1 text-emerald-300">
                            <IndianRupee className="h-4 w-4" />
                            {(item.pricePerUnit ?? 0)?.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Total Diamonds</p>
                          <p>{item.diamondQuantity * item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Line Total</p>
                          <p className="flex items-center gap-1 font-semibold text-emerald-300">
                            <IndianRupee className="h-4 w-4" />
                            {((item.totalPrice && item.totalPrice > 0) ? item.totalPrice : (parseFloat(String(item.pricePerUnit)) || 0) * (item.quantity ?? 1))?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'completed' && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                      <Truck className="h-4 w-4" />
                      Delivery Status
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Status</p>
                          <div className="mt-1">
                            {order.deliveryStatus === 'delivered' ? (
                              <div className="space-y-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                  Delivered ✓
                                </span>
                                <p className="text-sm text-emerald-200">
                                  Delivered Successfully on {formatDate(order.deliveryDate || order.purchaseDate)}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-300">
                                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                                  Pending
                                </span>
                                <p className="text-sm text-amber-200">
                                  Yet to be delivered
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        {order.deliveryStatus !== 'delivered' && onUpdateDeliveryStatus && (order._id || order.orderId) && (
                          <button
                            onClick={async () => {
                              const targetId = order._id ?? order.orderId;
                              setUpdatingOrderId(targetId);
                              try {
                                await onUpdateDeliveryStatus(
                                  {
                                    mongoId: order._id,
                                    orderId: order.orderId,
                                    razorpayOrderId: order.razorpayOrderId,
                                  },
                                  'delivered'
                                );
                              } finally {
                                setUpdatingOrderId(null);
                              }
                            }}
                            disabled={updatingOrderId === (order._id ?? order.orderId)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingOrderId === (order._id ?? order.orderId) ? 'Marking...' : 'Mark as Delivered'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Accordion>
            );
          })}
        </div>

        {orders.length > ORDERS_PER_PAGE && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-white/70">
              Showing {startOrder}-{endOrder} of {orders.length} orders
            </div>

            <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, pageIndex) => {
                const page = pageIndex + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-medium transition ${
                      currentPage === page
                        ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-100 shadow-lg shadow-cyan-500/20'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
