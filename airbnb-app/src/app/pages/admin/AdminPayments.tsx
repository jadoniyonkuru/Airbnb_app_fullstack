import { useState } from 'react';
import { Search, DollarSign, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { useAdminPayments } from '../../../features/admin/hooks';
import { useAnalytics } from '../../../features/statistics/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

export function AdminPayments() {
  const { data: payments = [], isLoading } = useAdminPayments();
  const { data: analytics }                = useAnalytics();
  const [search, setSearch] = useState('');

  const allPayments = payments as any[];

  // Real calculations from actual data
  const confirmed   = allPayments.filter((b: any) => b.status === 'CONFIRMED');
  const pending     = allPayments.filter((b: any) => b.status === 'PENDING');
  const cancelled   = allPayments.filter((b: any) => b.status === 'CANCELLED');

  const totalRevenue  = confirmed.reduce((sum: number, b: any) => sum + (b.totalPrice ?? 0), 0);
  const pendingTotal  = pending.reduce((sum: number, b: any) => sum + (b.totalPrice ?? 0), 0);
  const avgTransaction = confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length) : 0;

  // This month revenue from analytics
  const currentMonthAbbr = new Date().toLocaleDateString('en-US', { month: 'short' });
  const thisMonthEntry = analytics?.monthlyRevenue?.find(m => m.month === currentMonthAbbr);
  const thisMonthRevenue = thisMonthEntry?.revenue ?? 0;

  // Chart: last 6 months of revenue from analytics
  const chartData = (analytics?.monthlyRevenue ?? []).slice(-6);

  const filtered = allPayments.filter((p: any) =>
    p.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.listing?.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 8 });

  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return { bg: '#dcfce7', color: '#16a34a' };
    if (s === 'CANCELLED') return { bg: '#fee2e2', color: '#dc2626' };
    return { bg: '#fef3c7', color: '#d97706' };
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Payments</h1>
        <p className="text-[#717171] text-sm">Track all financial transactions on the platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue',    value: isLoading ? '...' : `$${totalRevenue.toLocaleString()}`,      icon: DollarSign, color: '#16a34a', bg: '#dcfce7' },
          { label: 'This Month',       value: isLoading ? '...' : `$${thisMonthRevenue.toLocaleString()}`,  icon: TrendingUp, color: '#FF385C', bg: '#FFF1F3' },
          { label: 'Avg. Transaction', value: isLoading ? '...' : `$${avgTransaction.toLocaleString()}`,    icon: CreditCard, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Pending Amount',   value: isLoading ? '...' : `$${pendingTotal.toLocaleString()}`,      icon: Clock,      color: '#d97706', bg: '#fef3c7' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-xl font-bold mb-1" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Summary badges */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { label: 'Confirmed', count: confirmed.length,  color: '#16a34a', bg: '#dcfce7' },
          { label: 'Pending',   count: pending.length,    color: '#d97706', bg: '#fef3c7' },
          { label: 'Cancelled', count: cancelled.length,  color: '#dc2626', bg: '#fee2e2' },
          { label: 'Total',     count: allPayments.length, color: '#717171', bg: '#F7F7F7' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#EBEBEB] bg-white">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.count}</span>
            <span className="text-sm text-[#484848]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Monthly Revenue (Last 6 Months)</h2>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-sm" style={{ color: '#AAAAAA' }}>No revenue data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#FF385C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by guest, property or ID..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors"
        />
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['ID', 'Guest', 'Property', 'Amount', 'Check-in', 'Check-out', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    {[64, 128, 160, 64, 80, 80, 96, 80].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-[#F0F0F0] rounded" style={{ width: w }} /></td>
                    ))}
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: '#AAAAAA' }}>
                    {search ? 'No transactions match your search.' : 'No transactions yet.'}
                  </td>
                </tr>
              ) : paginatedItems.map((payment: any) => {
                const sc = statusColor(payment.status);
                return (
                  <tr key={payment.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4 text-[#FF385C] font-semibold text-xs font-mono">{payment.id.slice(0, 8)}…</td>
                    <td className="px-5 py-4">
                      <p className="text-[#222222] font-semibold text-sm">{payment.guest?.name ?? '—'}</p>
                      <p className="text-[#AAAAAA] text-xs">{payment.guest?.email ?? ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[#484848] text-sm">{payment.listing?.title ?? '—'}</p>
                      <p className="text-[#AAAAAA] text-xs">{payment.listing?.location ?? ''}</p>
                    </td>
                    <td className="px-5 py-4 text-[#222222] font-bold text-sm">${(payment.totalPrice ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-[#717171] text-sm whitespace-nowrap">
                      {payment.checkIn ? new Date(payment.checkIn).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-[#717171] text-sm whitespace-nowrap">
                      {payment.checkOut ? new Date(payment.checkOut).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-[#717171] text-sm whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>
                        {payment.status?.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-5 border-t border-[#EBEBEB]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={perPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onPerPageChange}
            perPageOptions={[5, 8, 12]}
            itemLabel="transactions"
            showProgress={true}
          />
        </div>
      </div>
    </div>
  );
}
