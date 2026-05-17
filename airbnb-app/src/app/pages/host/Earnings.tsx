import { useState } from 'react';
import { DashboardCard } from '../../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBookings } from '../../../features/bookings/hooks';
import { useListingStats } from '../../../features/statistics/hooks';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

type PayoutMethod = {
  id: string;
  type: 'bank' | 'paypal' | 'card';
  label: string;
  detail: string;
  primary: boolean;
};

const TYPE_LABELS = { bank: 'Bank Transfer', paypal: 'PayPal', card: 'Debit Card' };

export function Earnings() {
  const { data: bookings = [], isLoading } = useBookings();
  const { data: listingStats } = useListingStats();
  const totalEarnings = bookings
    .filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'completed')
    .reduce((sum, b) => sum + b.total, 0);
  const avgEarnings = bookings.length > 0 ? Math.round(totalEarnings / bookings.length) : 0;

  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<'bank' | 'paypal' | 'card'>('bank');
  const [newLabel, setNewLabel] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const handleAddMethod = () => {
    if (!newLabel.trim() || !newDetail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const method: PayoutMethod = {
      id: Date.now().toString(),
      type: newType,
      label: newLabel.trim(),
      detail: newDetail.trim(),
      primary: payoutMethods.length === 0,
    };
    setPayoutMethods(prev => [...prev, method]);
    setNewLabel('');
    setNewDetail('');
    setShowAddForm(false);
    toast.success('Payout method added');
  };

  const handleSetPrimary = (id: string) => {
    setPayoutMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));
    toast.success('Primary payout method updated');
  };

  const handleRemove = (id: string) => {
    setPayoutMethods(prev => {
      const remaining = prev.filter(m => m.id !== id);
      if (remaining.length > 0 && prev.find(m => m.id === id)?.primary) {
        remaining[0].primary = true;
      }
      return remaining;
    });
    toast.success('Payout method removed');
  };

  return (
    <div>
      <h1 className="text-[#222222] mb-8">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Earnings"
          value={isLoading ? '...' : `$${totalEarnings.toLocaleString()}`}
          trend="+12% from last month"
          trendUp
        />
        <DashboardCard
          title="This Month"
          value={isLoading ? '...' : `$${Math.round(totalEarnings * 0.3).toLocaleString()}`}
          trend="+8% from last month"
          trendUp
        />
        <DashboardCard
          title="Average/Booking"
          value={isLoading ? '...' : `$${avgEarnings}`}
        />
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-xl p-6 mb-8">
        <h3 className="text-[#222222] mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={listingStats?.monthlyRevenue ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
            <XAxis dataKey="month" stroke="#717171" />
            <YAxis stroke="#717171" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#00A699" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payout Methods */}
      <div className="bg-white border border-[#DDDDDD] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[#222222] font-semibold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>Payout Methods</h3>
            <p className="text-[#717171] text-sm mt-0.5">Manage where your earnings are sent.</p>
          </div>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Payout Method
          </button>
        </div>

        {showAddForm && (
          <div className="border border-[#EBEBEB] rounded-xl p-5 mb-5 bg-[#FAFAFA]">
            <h4 className="text-[#222222] font-semibold text-sm mb-4">New Payout Method</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm text-[#222222] bg-white focus:outline-none focus:border-[#FF385C]"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="card">Debit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">Account Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder={newType === 'paypal' ? 'email@example.com' : newType === 'bank' ? 'My Bank Account' : 'My Debit Card'}
                  className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF385C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">
                  {newType === 'bank' ? 'Account Number (last 4)' : newType === 'paypal' ? 'PayPal Email' : 'Card Number (last 4)'}
                </label>
                <input
                  type="text"
                  value={newDetail}
                  onChange={e => setNewDetail(e.target.value)}
                  placeholder={newType === 'paypal' ? 'email@paypal.com' : '••••'}
                  className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF385C]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddMethod}
                className="bg-[#222222] hover:bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Save Method
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-[#717171] hover:text-[#222222] text-sm font-semibold px-5 py-2 rounded-lg border border-[#DDDDDD] hover:border-[#222222] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {payoutMethods.length === 0 ? (
          <div className="text-center py-10 text-[#717171]">
            <CreditCard className="w-10 h-10 mx-auto mb-3 text-[#DDDDDD]" />
            <p className="text-sm">No payout methods added yet.</p>
            <p className="text-xs text-[#AAAAAA] mt-1">Add a bank account, PayPal, or debit card to receive payments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payoutMethods.map(method => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${method.primary ? 'border-[#FF385C] bg-[#FFF5F6]' : 'border-[#EBEBEB] bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method.primary ? 'bg-[#FF385C]' : 'bg-[#F0F0F0]'}`}>
                    <CreditCard className={`w-5 h-5 ${method.primary ? 'text-white' : 'text-[#717171]'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[#222222] font-semibold text-sm">{method.label}</p>
                      {method.primary && (
                        <span className="text-xs font-bold text-[#FF385C] bg-[#FFE4E8] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#FF385C]" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[#717171] text-xs">{TYPE_LABELS[method.type]} · {method.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.primary && (
                    <button
                      onClick={() => handleSetPrimary(method.id)}
                      className="text-xs font-semibold text-[#2563eb] hover:underline px-2 py-1"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(method.id)}
                    className="p-1.5 rounded-lg text-[#717171] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-xl p-6">
        <h3 className="text-[#222222] mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {bookings
            .filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'completed')
            .slice(0, 6)
            .map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 border-b border-[#DDDDDD] last:border-b-0">
                <div>
                  <h4 className="text-[#222222]">{b.id}</h4>
                  <p className="text-[#717171]">{new Date(b.createdAt).toLocaleDateString()} • Booking</p>
                </div>
                <div className="text-right">
                  <div className="text-[#222222]">${b.total}</div>
                  <span className={`text-sm ${b.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{b.status}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}