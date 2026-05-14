import { useState } from 'react';
import { Search, Filter, ChevronDown, Star, Home, Shield, MoreVertical, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { useUsers } from '../../../features/users/hooks';

type HostStatus = 'top' | 'active' | 'pending' | 'suspended';

const statusConfig = {
  top:       { label: 'Top Host', color: '#d97706', bg: '#fffbeb', Icon: Star },
  active:    { label: 'Active',    color: '#16a34a', bg: '#f0fdf4', Icon: CheckCircle },
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fffbeb', Icon: AlertCircle },
  suspended: { label: 'Suspended', color: '#dc2626', bg: '#fef2f2', Icon: XCircle },
};

type HostItem = {
  id: string; name: string; email: string; avatar?: string; location?: string;
  listings?: number; bookings?: number; revenue?: number; rating?: number; reviews?: number;
  status?: HostStatus; joined?: string; verified?: boolean; responseRate?: string; responseTime?: string;
};

export function AdminHosts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<HostStatus | 'all'>('all');
  const [selectedHost, setSelectedHost] = useState<HostItem | null>(null);
  const [actionModal, setActionModal] = useState<{ host: HostItem; action: 'approve' | 'suspend' | 'reinstate' } | null>(null);
  const { data: users = [], isLoading } = useUsers();

  // derive hosts from users with role === 'HOST'
  const hosts: HostItem[] = (users || []).filter((u: any) => u.role === 'HOST').map((u: any) => ({
    id: u.id,
    name: u.name ?? u.fullName ?? u.email,
    email: u.email,
    avatar: (u.name || u.email || 'H').slice(0,2).toUpperCase(),
    location: u.location ?? u.profile?.location ?? 'Unknown',
    listings: u.listingsCount ?? 0,
    bookings: u.bookingsCount ?? 0,
    revenue: u.revenue ?? 0,
    rating: u.rating ?? 0,
    reviews: u.reviewsCount ?? 0,
    status: u.status === 'SUSPENDED' ? 'suspended' : u.verified ? 'active' : 'pending',
    joined: new Date(u.createdAt || Date.now()).toLocaleDateString(),
    verified: !!u.verified,
    responseRate: u.responseRate ?? 'N/A',
    responseTime: u.responseTime ?? 'N/A',
  }));

  const filtered = hosts.filter(h => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
        !h.email.toLowerCase().includes(search.toLowerCase()) &&
        !h.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 5 });

  const summaryStats = [
    { label: 'Total Hosts',    value: hosts.length,                                    color: '#FF385C', change: '+12%' },
    { label: 'Top Hosts',      value: hosts.filter(h => h.status === 'top').length,     color: '#d97706', change: '+5%' },
    { label: 'Pending Review', value: hosts.filter(h => h.status === 'pending').length,   color: '#d97706', change: 'New' },
    { label: 'Suspended',      value: hosts.filter(h => h.status === 'suspended').length, color: '#dc2626', change: '-2%' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Host Management</h1>
          <p className="text-[#717171] text-sm">Manage and verify all hosts on the platform.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Shield className="w-4 h-4" /> Verify Host
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
            <p className="text-[#717171] text-sm">{s.label}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: s.color }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[#DDDDDD] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-[#717171]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hosts..." className="flex-1 text-sm text-[#222222] outline-none bg-transparent placeholder:text-[#AAAAAA]" />
        </div>
        <div className="flex items-center gap-2 border border-[#DDDDDD] rounded-xl px-3 py-2.5">
          <Filter className="w-4 h-4 text-[#717171]" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as (HostStatus | 'all'))} className="text-sm text-[#222222] outline-none bg-transparent cursor-pointer">
            <option value="all">All Status</option>
            <option value="top">Top Host</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#717171]" />
        </div>
        <span className="text-sm text-[#717171] ml-auto">{filtered.length} hosts</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #EBEBEB', background: '#F7F7F7' }}>
                {['Host', 'Location', 'Listings', 'Bookings', 'Revenue', 'Rating', 'Response', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {paginatedItems.map(host => {
                const sc = statusConfig[host.status];
                const StatusIcon = sc.Icon;
                return (
                  <tr key={host.id} className="hover:bg-[#F7F7F7] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{host.avatar}</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[#222222] text-sm font-semibold">{host.name}</p>
                            {host.verified && <CheckCircle className="w-3.5 h-3.5 text-[#00A699]" />}
                          </div>
                          <p className="text-[#717171] text-xs">{host.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#484848] text-sm whitespace-nowrap">{host.location}</p>
                      <p className="text-[#AAAAAA] text-xs">Since {host.joined}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#484848]">
                        <Home className="w-3.5 h-3.5 text-[#717171]" />
                        {host.listings}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#484848]">{host.bookings}</td>
                    <td className="px-4 py-4">
                      <p className="text-[#222222] font-semibold text-sm">${host.revenue.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                        <span className="text-[#222222] text-sm font-semibold">{host.rating}</span>
                        <span className="text-[#717171] text-xs">({host.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#484848] text-sm">{host.responseRate}</p>
                      <p className="text-[#AAAAAA] text-xs">{host.responseTime}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit whitespace-nowrap" style={{ background: sc.bg, color: sc.color }}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedHost(host)} className="w-8 h-8 rounded-lg hover:bg-[#EBEBEB] flex items-center justify-center transition-colors">
                          <Eye className="w-4 h-4 text-[#717171]" />
                        </button>
                        <button className="w-8 h-8 rounded-lg hover:bg-[#EBEBEB] flex items-center justify-center transition-colors">
                          <MoreVertical className="w-4 h-4 text-[#717171]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            perPageOptions={[5, 8, 10]}
            itemLabel="hosts"
            showProgress={true}
          />
        </div>
      </div>

      {/* Host Detail Modal */}
      {selectedHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedHost(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#FF385C] rounded-2xl flex items-center justify-center text-white font-bold text-lg">{selectedHost.avatar}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedHost.name}</h2>
                  {selectedHost.verified && <CheckCircle className="w-5 h-5 text-[#00A699]" />}
                </div>
                <p className="text-[#717171] text-sm">{selectedHost.email}</p>
                <p className="text-[#717171] text-xs">{selectedHost.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Listings', value: selectedHost.listings },
                { label: 'Bookings', value: selectedHost.bookings },
                { label: 'Rating',   value: selectedHost.rating },
              ].map((s, i) => (
                <div key={i} className="text-center rounded-xl p-3" style={{ background: '#F7F7F7' }}>
                  <p className="text-[#222222] font-bold">{s.value}</p>
                  <p className="text-[#717171] text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-5">
              {[
                { label: 'Total Revenue',  value: `$${selectedHost.revenue.toLocaleString()}` },
                { label: 'Reviews',        value: selectedHost.reviews },
                { label: 'Response Rate',  value: selectedHost.responseRate },
                { label: 'Response Time',  value: selectedHost.responseTime },
                { label: 'Member Since',   value: selectedHost.joined },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#EBEBEB] last:border-0">
                  <span className="text-[#717171] text-sm">{item.label}</span>
                  <span className="text-[#222222] text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {selectedHost.status === 'pending' && (
                <button
                  onClick={() => { setActionModal({ host: selectedHost, action: 'approve' }); setSelectedHost(null); }}
                  className="flex-1 bg-[#FF385C] hover:bg-[#E31C5F] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Approve Host
                </button>
              )}
              {selectedHost.status === 'suspended' && (
                <button
                  onClick={() => { setActionModal({ host: selectedHost, action: 'reinstate' }); setSelectedHost(null); }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Reinstate Host
                </button>
              )}
              {(selectedHost.status === 'active' || selectedHost.status === 'top') && (
                <button
                  onClick={() => { setActionModal({ host: selectedHost, action: 'suspend' }); setSelectedHost(null); }}
                  className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Suspend Host
                </button>
              )}
              <button onClick={() => setSelectedHost(null)} className="flex-1 border border-[#DDDDDD] text-[#222222] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#F7F7F7] transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => {
          const action = actionModal?.action === 'approve' ? 'approved' : actionModal?.action === 'suspend' ? 'suspended' : 'reinstated';
          toast.success(`${actionModal?.host.name} has been ${action}`);
          setActionModal(null);
        }}
        title={
          actionModal?.action === 'approve' ? 'Approve Host' :
          actionModal?.action === 'suspend' ? 'Suspend Host' : 'Reinstate Host'
        }
        message={
          actionModal?.action === 'approve'
            ? `Approve ${actionModal?.host.name} as a host? They will be able to list properties and accept bookings.`
            : actionModal?.action === 'suspend'
            ? `Suspend ${actionModal?.host.name}? All their listings will be hidden and they won't be able to accept new bookings.`
            : `Reinstate ${actionModal?.host.name}? Their account will be reactivated and listings will be visible again.`
        }
        confirmText={actionModal?.action === 'approve' ? 'Approve' : actionModal?.action === 'suspend' ? 'Suspend' : 'Reinstate'}
        cancelText="Cancel"
        type={actionModal?.action === 'suspend' ? 'danger' : 'info'}
      />
    </div>
  );
}
