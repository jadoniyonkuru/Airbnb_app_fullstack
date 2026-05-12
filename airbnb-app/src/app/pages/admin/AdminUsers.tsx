import { useState } from 'react';
import { Search, UserPlus, CheckCircle, XCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { users } from '../../../data/mockData';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionModal, setActionModal] = useState<{ user: any; action: 'suspend' | 'activate' } | null>(null);

  const filtered = users.filter(u =>
    (filter === 'all' || u.role === filter || u.status === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 5 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Users Management</h1>
          <p className="text-[#717171] text-sm">Manage all registered users and their permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'host', 'guest', 'active', 'suspended'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                style={{
                  background: filter === f ? '#FF385C' : '#F7F7F7',
                  color: filter === f ? 'white' : '#717171'
                }}
              >
                {f === 'all' ? 'All Users' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: '1,247', color: '#FF385C', bg: '#FFF1F3' },
          { label: 'Active Hosts', value: '389', color: '#00A699', bg: '#E6F7F6' },
          { label: 'Active Guests', value: '858', color: '#FC642D', bg: '#FFF0EB' },
          { label: 'Suspended', value: '12', color: '#dc2626', bg: '#fee2e2' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['User', 'Email', 'Role', 'Bookings', 'Revenue', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {paginatedItems.map(user => (
                <tr key={user.id} className="hover:bg-[#FAFAFA] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{user.avatar}</div>
                      <p className="text-[#222222] font-semibold text-sm">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#717171] text-sm">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{
                      background: user.role === 'host' ? '#E6F7F6' : '#F0F0F0',
                      color: user.role === 'host' ? '#00A699' : '#717171'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#222222] font-semibold text-sm">{user.bookings}</td>
                  <td className="px-5 py-4 text-[#222222] font-semibold text-sm">
                    {user.revenue > 0 ? `$${user.revenue.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{
                      background: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'active' ? '#16a34a' : '#dc2626'
                    }}>
                      {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#717171] text-sm whitespace-nowrap">{user.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-1 text-[#FF385C] text-xs font-medium hover:underline">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setActionModal({ user, action: user.status === 'active' ? 'suspend' : 'activate' })}
                        className="text-[#717171] text-xs hover:text-red-500 transition-colors"
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
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
            itemLabel="users"
            showProgress={true}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => {
          const action = actionModal?.action === 'suspend' ? 'suspended' : 'activated';
          toast.success(`${actionModal?.user.name} has been ${action}`);
          setActionModal(null);
        }}
        title={actionModal?.action === 'suspend' ? 'Suspend User' : 'Activate User'}
        message={
          actionModal?.action === 'suspend'
            ? `Are you sure you want to suspend ${actionModal?.user.name}? They will lose access to their account immediately.`
            : `Are you sure you want to activate ${actionModal?.user.name}? They will regain full access to their account.`
        }
        confirmText={actionModal?.action === 'suspend' ? 'Suspend' : 'Activate'}
        cancelText="Cancel"
        type={actionModal?.action === 'suspend' ? 'danger' : 'info'}
      />
    </div>
  );
}
