import { DashboardCard } from '../../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { stats, payments } from '../../../data/mockData';

export function Earnings() {
  return (
    <div>
      <h1 className="text-[#222222] mb-8">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Earnings"
          value="$8,420"
          trend="+12% from last month"
          trendUp
        />
        <DashboardCard
          title="This Month"
          value="$2,340"
          trend="+8% from last month"
          trendUp
        />
        <DashboardCard
          title="Average/Booking"
          value="$702"
        />
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-xl p-6 mb-8">
        <h3 className="text-[#222222] mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
            <XAxis dataKey="month" stroke="#717171" />
            <YAxis stroke="#717171" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#FF385C" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-[#DDDDDD] rounded-xl p-6">
        <h3 className="text-[#222222] mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-3 border-b border-[#DDDDDD] last:border-b-0">
              <div>
                <h4 className="text-[#222222]">{payment.id}</h4>
                <p className="text-[#717171]">{payment.date} • {payment.method}</p>
              </div>
              <div className="text-right">
                <div className="text-[#222222]">${payment.amount}</div>
                <span
                  className={`text-sm ${
                    payment.status === 'completed'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}