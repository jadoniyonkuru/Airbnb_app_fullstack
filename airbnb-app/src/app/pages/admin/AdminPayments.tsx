import { useState } from 'react';
import { Search, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { payments, stats } from '../../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

export function AdminPayments() {
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p =>
    p.guest.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 5 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Payments</h1>
        <p className="text-[#717171] text-sm">Track all financial transactions on the platform.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '$487,920', icon: DollarSign, color: '#16a34a', bg: '#dcfce7' },
          { label: 'This Month', value: '$68,000', icon: TrendingUp, color: '#FF385C', bg: '#FFF1F3' },
          { label: 'Avg. Transaction', value: '$702', icon: CreditCard, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Pending', value: '$2,990', icon: DollarSign, color: '#d97706', bg: '#fef3c7' },
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

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.monthlyRevenue.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#FF385C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors" />
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['ID', 'Guest', 'Property', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-[#717171] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {paginatedItems.map(payment => (
                <tr key={payment.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 text-[#FF385C] font-semibold text-sm">{payment.id}</td>
                  <td className="px-5 py-4 text-[#222222] font-semibold text-sm">{payment.guest}</td>
                  <td className="px-5 py-4 text-[#717171] text-sm">{payment.property}</td>
                  <td className="px-5 py-4 text-[#222222] font-bold text-sm">${payment.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[#717171] text-sm">{payment.method}</td>
                  <td className="px-5 py-4 text-[#717171] text-sm">{payment.date}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                      background: payment.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      color: payment.status === 'completed' ? '#16a34a' : '#d97706'
                    }}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination inside table card ── */}
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
