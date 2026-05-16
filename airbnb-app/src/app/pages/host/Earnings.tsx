import { DashboardCard } from '../../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBookings } from '../../../features/bookings/hooks';
import { useListingStats } from '../../../features/statistics/hooks';

export function Earnings() {
  const { data: bookings = [], isLoading } = useBookings();
  const { data: listingStats } = useListingStats();
  const totalEarnings = bookings
    .filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'completed')
    .reduce((sum, b) => sum + b.total, 0);
  const avgEarnings = bookings.length > 0 ? Math.round(totalEarnings / bookings.length) : 0;

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