import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

/** Reusable KPI card — white background, single accent color #FF385C. */
export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  subtitle,
}: StatCardProps) {
  return (
    <div
      className="bg-white border border-[#EBEBEB] rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-[#717171] font-medium">{title}</p>
          <p
            className="text-[#222222] mt-2"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.85rem', fontWeight: 700, lineHeight: 1 }}
          >
            {value}
          </p>
          {trend && (
            <div className="mt-2">
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: trendUp ? '#F0FDF4' : '#FFF1F2',
                  color: trendUp ? '#15803d' : '#dc2626',
                }}
              >
                {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </span>
            </div>
          )}
          {subtitle && <p className="text-xs text-[#AAAAAA] mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-[#FFF1F3] flex items-center justify-center ml-4 shrink-0">
            <Icon className="w-6 h-6 text-[#FF385C]" />
          </div>
        )}
      </div>
    </div>
  );
}
