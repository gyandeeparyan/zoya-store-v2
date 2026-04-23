'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderHistoryTable } from '@/components/OrderHistoryTable';
import { Search, RefreshCw, Clock } from 'lucide-react';

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

const AUTO_REFRESH_MS = 30_000;

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const fetchOrders = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, AUTO_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

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

  // Stats for filter chips
  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    failed:    orders.filter(o => o.status === 'failed').length,
  }), [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060f] via-[#060a18] to-[#04040b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-cyan-100/70">All orders · latest first</p>
            <p className="mt-1 text-xs text-white/45">
              Auto refresh every 30s
              {lastUpdatedAt ? ` · Last updated ${lastUpdatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchOrders()}
            disabled={loading}
            className="gap-2 border-cyan-300/25 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-300/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.12),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search by order ID, name, email, WhatsApp, player ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
                className="h-11 border-white/15 bg-black/20 pl-9 text-white placeholder:text-white/40"
            />
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {(['all', 'pending', 'completed', 'failed'] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 text-[11px] py-2 font-extralight uppercase transition-colors ${
                    statusFilter === s
                      ? s === 'all'
                        ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-100'
                        : s === 'pending'
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                          : s === 'completed'
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                            : 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                      : 'border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {s === 'all'
                    ? `All (${stats.total})`
                    : s === 'pending'
                      ? `Pending (${stats.pending})`
                      : s === 'completed'
                        ? `Completed (${stats.completed})`
                        : `Failed (${stats.failed})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/55">
            <RefreshCw className="mr-3 h-6 w-6 animate-spin" /> Loading orders...
          </div>
        ) : error ? (
          <div className="py-24 text-center text-rose-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-white/45">
            {search || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45">
              {filtered.length} order{filtered.length !== 1 ? 's' : ''} found
            </p>
            <OrderHistoryTable orders={filtered} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
