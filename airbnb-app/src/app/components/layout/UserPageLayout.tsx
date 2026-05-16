import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface UserPageLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb: string;
  showBrand?: boolean;
}

export function UserPageLayout({ children, title, breadcrumb, showBrand = true }: UserPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-[#717171] hover:text-[#222222] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[#AAAAAA]">
            <Link to="/" className="hover:text-[#222222] transition-colors font-medium">StayEase</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: '#FF385C', fontWeight: 600 }}>{breadcrumb}</span>
          </div>

          {/** Optional brand on the right — hidden for pages like My Bookings */}
          {showBrand ? (
            <Link
              to="/"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-[#FF385C] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
              </div>
              <span className="font-bold text-sm text-[#222222] hidden sm:inline" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Stay<span style={{ color: '#FF385C' }}>Bnb</span>
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1
          className="text-[#222222] mb-6"
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}
        >
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
