'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, IndianRupee, ShoppingBag, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Gem } from 'lucide-react';

interface OrderItem {
  diamondQuantity: number;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  purchaseDate: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  user: {
    userId: string;
    serverId: string;
    username?: string;
    customerName: string;
    whatsapp: string;
    email: string;
  };
  items: OrderItem[];
}

type StatusFilter = 'all' | 'pending' | 'completed' | 'failed';

const statusConfig = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-500/15', text: 'text-yellow-400',  border: 'border-yellow-500/30',  icon: Clock },
  completed: { label: 'Completed', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  failed:    { label: 'Failed',    bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     icon: XCircle },
};

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = cfg.icon;
  const totalDiamonds = order.items.reduce((s, i) => s + i.diamondQuantity * i.quantity, 0);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${cfg.border} bg-white/3 hover:bg-white/5`}>
      {/* Main row */}
      <div
        className="grid grid-cols-[1fr_auto] gap-2 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
          {/* Order + date */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Order ID</p>
            <p className="font-mono text-sm text-violet-300 truncate">{order.orderId}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.purchaseDate).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            </p>
          </div>

          {/* Customer */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Customer</p>
            <p className="text-sm font-semibold text-white truncate">{order.user.customerName}</p>
            <p className="text-xs text-gray-400 truncate">{order.user.email}</p>
            <p className="text-xs text-gray-400">{order.user.whatsapp}</p>
          </div>

          {/* Amount + diamonds */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Amount</p>
            <p className="text-lg font-bold text-emerald-300 flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" />{order.totalAmount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Gem className="w-3 h-3 text-blue-400" />{totalDiamonds} diamonds
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
            {order.razorpayPaymentId && (
              <p className="text-xs text-gray-500 font-mono mt-1 truncate">{order.razorpayPaymentId}</p>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <div className="flex items-center text-gray-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/10 bg-white/2 px-4 py-4 space-y-4">
          {/* Game account */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-0.5">Player ID</p>
              <p className="text-sm font-mono text-emerald-300">{order.user.userId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-0.5">Server ID</p>
              <p className="text-sm font-mono text-blue-300">{order.user.serverId}</p>
            </div>
            {order.user.username && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Username</p>
                <p className="text-sm text-white">{order.user.username}</p>
              </div>
            )}
            {order.razorpayOrderId && (
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Razorpay Order</p>
                <p className="text-xs font-mono text-gray-300 break-all">{order.razorpayOrderId}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Items ({order.items.length})</p>
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Gem className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{item.diamondQuantity} diamonds</span>
                    <span className="text-gray-400">× {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-xs">₹{item.pricePerUnit}/unit · </span>
                    <span className="text-emerald-300 font-semibold">₹{(item.totalPrice ?? item.pricePerUnit * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        o.orderId?.toLowerCase().includes(q) ||
        o.razorpayOrderId?.toLowerCase().includes(q) ||
        o.razorpayPaymentId?.toLowerCase().includes(q) ||
        o.user?.customerName?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.user?.whatsapp?.includes(q) ||
        o.user?.userId?.includes(q) ||
        o.user?.username?.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total:     orders.length,
    revenue:   orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.totalAmount, 0),
    pending:   orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    failed:    orders.filter(o => o.status === 'failed').length,
  }), [orders]);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">All orders · latest first</p>
          </div>
          <Button variant="outline" onClick={fetchOrders} disabled={loading} className="gap-2 border-white/20">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders',   value: stats.total,                  icon: ShoppingBag,   color: 'text-violet-400',  bg: 'border-violet-500/30'  },
            { label: 'Revenue',        value: `₹${stats.revenue.toFixed(0)}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'border-emerald-500/30' },
            { label: 'Pending',        value: stats.pending,                icon: Clock,          color: 'text-yellow-400',  bg: 'border-yellow-500/30'  },
            { label: 'Completed',      value: stats.completed,              icon: CheckCircle2,   color: 'text-emerald-400', bg: 'border-emerald-500/30' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-xl border ${bg} bg-white/3 p-4 space-y-2`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, name, email, WhatsApp, player ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'completed', 'failed'] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                  statusFilter === s
                    ? s === 'all'       ? 'bg-violet-600/40 border-violet-500/60 text-violet-200'
                    : s === 'pending'   ? 'bg-yellow-500/25 border-yellow-500/60 text-yellow-200'
                    : s === 'completed' ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200'
                    :                    'bg-red-500/25 border-red-500/60 text-red-200'
                    : 'bg-white/5 border-white/15 text-gray-400 hover:border-white/30'
                }`}
              >
                {s === 'all' ? `All (${orders.length})` : s === 'pending' ? `Pending (${stats.pending})` : s === 'completed' ? `Completed (${stats.completed})` : `Failed (${stats.failed})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-3" /> Loading orders…
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            {search || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</p>
            {filtered.map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
