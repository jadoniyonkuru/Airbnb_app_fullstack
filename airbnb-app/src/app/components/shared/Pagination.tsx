import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Page-number algorithm
   Always shows: first, last, current ±1, with '…' in between
───────────────────────────────────────────────────────────── */
type PageToken = number | 'start-ellipsis' | 'end-ellipsis';

function buildPages(current: number, total: number): PageToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', total];
  }
  if (current >= total - 3) {
    return [1, 'start-ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, 'start-ellipsis', current - 1, current, current + 1, 'end-ellipsis', total];
}

/* ─────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────── */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  /** Singular/plural label, e.g. "properties" or "bookings" */
  itemLabel?: string;
  className?: string;
  /** Show the reading-progress bar at the top (default true) */
  showProgress?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  perPageOptions = [6, 12, 24],
  itemLabel = 'items',
  className = '',
  showProgress = true,
}: PaginationProps) {
  const [jumpType, setJumpType] = useState<'start' | 'end' | null>(null);
  const [jumpVal, setJumpVal] = useState('');
  const jumpRef = useRef<HTMLInputElement>(null);

  const firstItem = totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const lastItem  = Math.min(currentPage * itemsPerPage, totalItems);
  const progress  = totalPages > 1 ? (currentPage / totalPages) * 100 : 100;

  const pages = buildPages(currentPage, totalPages);

  useEffect(() => {
    if (jumpType && jumpRef.current) jumpRef.current.focus();
  }, [jumpType]);

  const commitJump = () => {
    const n = parseInt(jumpVal, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) onPageChange(n);
    setJumpType(null);
    setJumpVal('');
  };

  const handleJumpKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitJump();
    if (e.key === 'Escape') { setJumpType(null); setJumpVal(''); }
  };

  // Don't render if everything fits on one page and no per-page selector
  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  return (
    <div className={`select-none ${className}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Progress bar ─────────────────────────────────────── */}
      {showProgress && totalPages > 1 && (
        <div className="h-[3px] rounded-full overflow-hidden mb-4" style={{ background: '#F0F0F0' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF385C 0%, #FF5A5F 60%, #FC642D 100%)',
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
      )}

      {/* ── Main row ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left: info + per-page */}
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm" style={{ color: '#717171' }}>
            Showing{' '}
            <span style={{ color: '#222222', fontWeight: 600 }}>{firstItem}–{lastItem}</span>
            {' '}of{' '}
            <span style={{ color: '#222222', fontWeight: 600 }}>{totalItems}</span>
            {' '}{itemLabel}
          </p>

          {onItemsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#AAAAAA' }}>Per page</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={e => onItemsPerPageChange(Number(e.target.value))}
                  className="appearance-none text-sm font-medium pr-7 pl-3 py-1.5 rounded-xl outline-none cursor-pointer transition-colors"
                  style={{
                    background: '#F7F7F7',
                    border: '1px solid #EBEBEB',
                    color: '#222222',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#EFEFEF')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F7F7F7')}
                >
                  {perPageOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {/* Chevron icon */}
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                >
                  <path d="M1.5 3.5L5 7L8.5 3.5" stroke="#717171" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right: prev + page pills + next */}
        <div className="flex items-center gap-2">

          {/* ← Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 text-sm font-medium rounded-xl transition-all"
            style={{
              padding: '8px 14px',
              border: '1px solid #DDDDDD',
              color: currentPage === 1 ? '#CCCCCC' : '#222222',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (currentPage !== 1) (e.currentTarget as HTMLElement).style.background = '#F7F7F7';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'white';
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* ── Pill track ─────────────────────────────────── */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-2xl"
            style={{ background: '#F4F4F4' }}
          >
            {pages.map((token, idx) => {
              /* ── Ellipsis → jump input ── */
              if (token === 'start-ellipsis' || token === 'end-ellipsis') {
                const type = token === 'start-ellipsis' ? 'start' : 'end';

                if (jumpType === type) {
                  return (
                    <div key={token} className="relative">
                      <input
                        ref={jumpRef}
                        type="number"
                        value={jumpVal}
                        min={1}
                        max={totalPages}
                        onChange={e => setJumpVal(e.target.value)}
                        onKeyDown={handleJumpKey}
                        onBlur={commitJump}
                        placeholder="go"
                        className="text-center text-sm font-medium rounded-xl outline-none"
                        style={{
                          width: '44px', height: '36px',
                          border: '2px solid #FF385C',
                          color: '#222222',
                          background: 'white',
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <button
                    key={token}
                    title="Jump to page…"
                    onClick={() => { setJumpType(type); setJumpVal(''); }}
                    className="flex items-center justify-center rounded-xl transition-all group"
                    style={{ width: '36px', height: '36px', color: '#AAAAAA' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'white';
                      (e.currentTarget as HTMLElement).style.color = '#FF385C';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#AAAAAA';
                    }}
                  >
                    {/* default: 3 dots; hover: jump icon */}
                    <span className="block group-hover:hidden text-xs tracking-widest leading-none">···</span>
                    <CornerDownRight className="hidden group-hover:block w-3.5 h-3.5" />
                  </button>
                );
              }

              /* ── Regular page number ── */
              const isActive = token === currentPage;
              return (
                <button
                  key={`${token}-${idx}`}
                  onClick={() => onPageChange(token)}
                  className="flex items-center justify-center rounded-xl text-sm transition-all"
                  style={{
                    width: '36px', height: '36px',
                    background: isActive ? '#FF385C' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#717171',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 2px 10px rgba(255,56,92,0.38)' : 'none',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.18s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'white';
                      (e.currentTarget as HTMLElement).style.color = '#222222';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.09)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#717171';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }
                  }}
                >
                  {token}
                </button>
              );
            })}
          </div>

          {/* Next → */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 text-sm font-medium rounded-xl transition-all"
            style={{
              padding: '8px 14px',
              border: '1px solid #DDDDDD',
              color: currentPage === totalPages ? '#CCCCCC' : '#222222',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (currentPage !== totalPages) (e.currentTarget as HTMLElement).style.background = '#F7F7F7';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'white';
            }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
