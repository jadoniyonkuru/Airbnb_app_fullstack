import { useState } from 'react';
import { Search, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useAdminUsers, useUpdateUserStatus, useDeleteAdminUser } from '../../../features/admin/hooks';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

export function AdminUsers() {
  const { data: users = [], isLoading } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteAdminUser();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionModal, setActionModal] = useState<{ user: any; action: 'suspend' | 'activate' } | null>(null);

  const filtered = (users as any[]).filter(u =>
    (filter === 'all' ||
     u.role?.toLowerCase() === filter ||
     (filter === 'active' && u.status === 'ACTIVE') ||
     (filter === 'suspended' && u.status === 'SUSPENDED')) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 8 });

  const totalHosts = (users as any[]).filter((u: any) => u.role === 'HOST').length;
  const totalGuests = (users as any[]).filter((u: any) => u.role === 'GUEST').length;
  const totalSuspended = (users as any[]).filter((u: any) => u.status === 'SUSPENDED').length;

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
                style={{ background: filter === f ? '#FF385C' : '#F7F7F7', color: filter === f ? 'white' : '#717171' }}
              >
                {f === 'all' ? 'All Users' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users',    value: (users as any[]).length, color: '#FF385C', bg: '#FFF1F3' },
          { label: 'Active Hosts',   value: totalHosts,              color: '#00A699', bg: '#E6F7F6' },
          { label: 'Active Guests',  value: totalGuests,             color: '#FC642D', bg: '#FFF0EB' },
          { label: 'Suspended',      value: totalSuspended,          color: '#dc2626', bg: '#fee2e2' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F7F7F7' }}>
                {['User', 'Email', 'Role', 'Bookings', 'Listings', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-[#717171] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading ? (
                [1,2,3,4,5,6,7,8].map(i => (
                  <tr key={i} className="animate-pulse">
                    {[120, 160, 80, 40, 40, 100, 120, 80].map((w, j) => (
                      <td key={j} className="px-5 py-4"><div className={`h-4 bg-[#F0F0F0] rounded w-${w}`} /></td>
                    ))}
                  </tr>
                ))
              ) : paginatedItems.map((user: any) => {
                const isSuspended = user.status === 'SUSPENDED';
                return (
                  <tr key={user.id} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          : <div className="w-9 h-9 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{user.name?.charAt(0) || 'U'}</div>
                        }
                        <p className="text-[#222222] font-semibold text-sm">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#717171] text-sm">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{
                        background: user.role === 'HOST' ? '#E6F7F6' : user.role === 'ADMIN' ? '#EEF2FF' : '#F0F0F0',
                        color: user.role === 'HOST' ? '#00A699' : user.role === 'ADMIN' ? '#4F46E5' : '#717171'
                      }}>
                        {user.role?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#222222] font-semibold text-sm">{user._count?.bookings ?? 0}</td>
                    <td className="px-5 py-4 text-[#222222] font-semibold text-sm">{user._count?.listings ?? 0}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{
                        background: isSuspended ? '#fee2e2' : '#dcfce7',
                        color:      isSuspended ? '#dc2626' : '#16a34a'
                      }}>
                        {isSuspended ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {isSuspended ? 'suspended' : 'active'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#717171] text-sm whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setActionModal({ user, action: isSuspended ? 'activate' : 'suspend' })}
                          className="text-xs font-medium transition-colors"
                          style={{ color: isSuspended ? '#16a34a' : '#dc2626' }}
                        >
                          {isSuspended ? 'Activate' : 'Suspend'}
                        </button>
                      </div>
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
            itemLabel="users"
            showProgress={true}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => {
          if (!actionModal) return;
          updateStatus.mutate({
            id: actionModal.user.id,
            status: actionModal.action === 'suspend' ? 'SUSPENDED' : 'ACTIVE',
          });
          setActionModal(null);
        }}
        title={actionModal?.action === 'suspend' ? 'Suspend User' : 'Activate User'}
        message={
          actionModal?.action === 'suspend'
            ? `Are you sure you want to suspend ${actionModal?.user.name}? They will lose access to their account.`
            : `Are you sure you want to activate ${actionModal?.user.name}? They will regain full access.`
        }
        confirmText={actionModal?.action === 'suspend' ? 'Suspend' : 'Activate'}
        cancelText="Cancel"
        type={actionModal?.action === 'suspend' ? 'danger' : 'info'}
      />
    </div>
  );
}
