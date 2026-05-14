import { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserBookings } from '../../../features/bookings/hooks';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

const paymentMethods = [
  { id: 'card1', type: 'Visa', detail: '•••• •••• •••• 4242', expires: 'Expires 08/28', icon: '💳', primary: true },
  { id: 'card2', type: 'Mastercard', detail: '•••• •••• •••• 8891', expires: 'Expires 02/27', icon: '💳', primary: false },
  { id: 'card3', type: 'PayPal', detail: 'user@email.com', expires: '', icon: '📧', primary: false },
];

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  completed: { color: '#16a34a', bg: '#dcfce7', label: 'Completed', icon: CheckCircle },
  pending: { color: '#d97706', bg: '#fef3c7', label: 'Pending', icon: Clock },
};

export function UserPayments() {
  const { user } = useAuth();
  const { data: bookings = [] } = useUserBookings(user?.id ?? '');
  const paymentsData = bookings
    .filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'completed')
    .map(b => ({ id: b.id, property: b.listing?.title ?? 'Booking', date: b.createdAt, method: 'Booking', amount: b.total, status: b.status }));

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(paymentsData, { defaultPerPage: 6 });
  const [savedCards, setSavedCards] = useState(paymentMethods);

  const removeCard = (id: string) => {
    setSavedCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>
          Payments
        </h1>
        <p className="text-[#717171] text-sm">Manage your payment methods and view transaction history.</p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-8">
        <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Saved Payment Methods</h2>
        <div className="space-y-3 mb-4">
          {savedCards.map(card => (
            <div key={card.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB]">
              <span className="text-2xl">{card.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[#222222] text-sm font-semibold">{card.type} {card.detail}</p>
                  {card.primary && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">Default</span>}
                </div>
                {card.expires && <p className="text-[#717171] text-xs mt-0.5">{card.expires}</p>}
              </div>
              <button onClick={() => removeCard(card.id)} className="text-xs text-[#AAAAAA] hover:text-red-500 transition-colors">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-[#FF385C] border border-[#FF385C] px-4 py-2.5 rounded-xl hover:bg-[#FFF1F3] transition-colors">
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-8">
        <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Billing Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input defaultValue="" placeholder="First Name" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
          <input defaultValue="" placeholder="Last Name" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
          <input defaultValue="123 Main Street" placeholder="Address" className="sm:col-span-2 px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
          <input defaultValue="Kigali" placeholder="City" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
          <input defaultValue="Rwanda" placeholder="Country" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
        </div>
        <button className="mt-4 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
          Save Billing Info
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="p-6 border-b border-[#EBEBEB]">
          <h2 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment History</h2>
        </div>
        <div className="divide-y divide-[#EBEBEB]">
          {paginatedItems.map(payment => {
            const status = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={payment.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${status.color}18` }}>
                    <CreditCard className="w-5 h-5" style={{ color: status.color }} />
                  </div>
                  <div>
                    <p className="text-[#222222] font-semibold text-sm">{payment.property}</p>
                    <p className="text-[#717171] text-xs">{payment.date} • {payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#222222] font-bold text-sm">${payment.amount}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: status.color, background: status.bg }}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onPerPageChange}
        perPageOptions={[6, 10, 15]}
        itemLabel="transactions"
        className="border-t border-[#EBEBEB] pt-6"
      />
    </div>
  );
}