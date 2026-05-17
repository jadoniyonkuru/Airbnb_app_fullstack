import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronLeft, ChevronRight, Minus, Plus, X, CalendarDays, Users } from 'lucide-react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const SUGGESTIONS = [
  { label: 'Kigali, Rwanda', sub: '40+ stays' },
  { label: 'Nairobi, Kenya', sub: '30+ stays' },
  { label: 'Paris, France', sub: '200+ stays' },
  { label: 'New York, USA', sub: '180+ stays' },
  { label: 'Mombasa, Kenya', sub: 'Beautiful beaches' },
  { label: 'Cape Town, South Africa', sub: 'Stunning scenery' },
  { label: 'Swiss Alps, Switzerland', sub: 'Mountain retreat' },
];

const FLEX_OPTIONS = [
  { key: 'exact', label: 'Exact dates' },
  { key: '1', label: '± 1 day' },
  { key: '2', label: '± 2 days' },
  { key: '3', label: '± 3 days' },
  { key: '7', label: '± 7 days' },
  { key: '14', label: '± 14 days' },
];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOf(d: Date) {
  const c = new Date(d); c.setHours(0,0,0,0); return c;
}
function fmtShort(d: Date | null) {
  if (!d) return '';
  return `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}`;
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function advanceMonth(y: number, m: number, delta: number) {
  let nm = m + delta, ny = y;
  while (nm > 11) { nm -= 12; ny++; }
  while (nm < 0) { nm += 12; ny--; }
  return { year: ny, month: nm };
}

function Counter({ label, sub, val, set, min = 0 }: { label: string; sub: string; val: number; set: (n: number) => void; min?: number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F2F2F2]">
      <div>
        <p className="text-sm font-semibold text-[#1C1C1E]">{label}</p>
        <p className="text-xs text-[#8E8E93] mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => set(Math.max(min, val - 1))}
          disabled={val <= min}
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: val <= min ? '#DDDDDD' : '#1C1C1E', color: val <= min ? '#DDDDDD' : '#1C1C1E' }}
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center font-semibold text-sm text-[#1C1C1E]">{val}</span>
        <button
          onClick={() => set(val + 1)}
          className="w-8 h-8 rounded-full border-2 border-[#1C1C1E] text-[#1C1C1E] flex items-center justify-center"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function MonthGrid({ year, month, today, checkin, checkout, hover, onDayClick, onDayHover }: {
  year: number; month: number; today: Date;
  checkin: Date | null; checkout: Date | null; hover: Date | null;
  onDayClick: (d: Date) => void; onDayHover: (d: Date | null) => void;
}) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMo = new Date(year, month + 1, 0).getDate();
  const rangeEnd = checkout ?? hover;
  const cells: (Date | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMo }, (_, i) => new Date(year, month, i + 1))];

  return (
    <div className="min-w-[240px] sm:min-w-[280px]">
      <p className="text-center font-semibold text-sm sm:text-base text-[#1C1C1E] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-[#8E8E93] pb-1.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e${idx}`} />;
          const isPast = date < today;
          const isStart = checkin && sameDay(date, checkin);
          const isEnd = checkout && sameDay(date, checkout);
          const inRange = checkin && rangeEnd && date > checkin && date < rangeEnd;
          const isHovered = !checkout && hover && sameDay(date, hover) && checkin && date > checkin;

          let bg = 'transparent', color = isPast ? '#CCCCCC' : '#1C1C1E', radius = '50%';
          if (isStart || isEnd) { bg = '#FF5A5F'; color = 'white'; }
          else if (inRange) { bg = '#FFF0F0'; color = '#1C1C1E'; radius = '0'; }
          else if (isHovered) bg = '#F5F5F5';

          const isRangeStart = isStart && rangeEnd && !sameDay(checkin!, rangeEnd);
          const isRangeEnd = isEnd && checkin;

          return (
            <button
              key={idx}
              disabled={isPast}
              onClick={() => !isPast && onDayClick(date)}
              onMouseEnter={() => !isPast && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              className="h-8 sm:h-9 w-full text-xs sm:text-sm transition-all"
              style={{
                background: bg, color,
                cursor: isPast ? 'not-allowed' : 'pointer',
                fontWeight: (isStart || isEnd) ? 700 : 400,
                borderRadius: inRange ? (isRangeStart ? '50% 0 0 50%' : isRangeEnd ? '0 50% 50% 0' : '0') : '50%',
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroSearch({ wide = false }: { wide?: boolean }) {
  const navigate = useNavigate();
  const today = startOf(new Date());
  const [location, setLocation] = useState('');
  const [wideQuery, setWideQuery] = useState('');
  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [panel, setPanel] = useState<'where' | 'when' | 'who' | 'loc' | null>(null);
  const [calTab, setCalTab] = useState<'dates' | 'flexible'>('dates');
  const [flexOpt, setFlexOpt] = useState('exact');
  const [calBase, setCalBase] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [hoverDay, setHoverDay] = useState<Date | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const totalGuests = adults + children;
  const cal2 = advanceMonth(calBase.year, calBase.month, 1);
  const whenDisplay = !checkin ? 'Add dates' : !checkout ? `${fmtShort(checkin)} –` : `${fmtShort(checkin)} – ${fmtShort(checkout)}`;
  const whoDisplay = totalGuests === 0 ? 'Add guests' : `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}${infants ? `, ${infants} infant${infants !== 1 ? 's' : ''}` : ''}`;
  const filteredSuggestions = SUGGESTIONS.filter(s => !location || s.label.toLowerCase().includes(location.toLowerCase()));

  const handleDayClick = (d: Date) => {
    if (!checkin || (checkin && checkout)) {
      setCheckin(d); setCheckout(null);
    } else {
      if (sameDay(d, checkin)) { setCheckin(null); return; }
      if (d < checkin) { setCheckout(checkin); setCheckin(d); }
      else { setCheckout(d); }
      setTimeout(() => setPanel('who'), 250);
    }
  };

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (wide) {
      if (wideQuery) p.set('q', wideQuery);
      if (location) p.set('location', location);
    } else {
      if (location) p.set('location', location);
      if (checkin) p.set('checkin', toISO(checkin));
      if (checkout) p.set('checkout', toISO(checkout));
      if (totalGuests > 0) p.set('guests', String(totalGuests));
    }
    navigate(`/listings?${p.toString()}`);
    setPanel(null);
  };

  return (
    <div ref={wrapRef} className="relative" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── WIDE HERO PILL (matches design image) ─────────────────────────── */}
      {wide && (
        <div
          className="hidden md:flex bg-white items-center overflow-hidden"
          style={{ borderRadius: 50, boxShadow: '0 8px 40px rgba(0,0,0,0.22)' }}
        >
          {/* What are you looking for */}
          <div className="flex items-center gap-3 flex-1 px-8 py-5 min-w-0">
            <Search size={22} className="shrink-0" style={{ color: '#8E8E93' }} />
            <div className="flex-1 min-w-0 border-b border-[#E0E0E0] pb-0.5">
              <input
                value={wideQuery}
                onChange={e => setWideQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="What are you looking for?"
                className="border-0 outline-none bg-transparent w-full text-base"
                style={{ color: wideQuery ? '#1C1C1E' : '#9E9E9E', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 44, background: '#E0E0E0', flexShrink: 0 }} />

          {/* Location dropdown */}
          <div
            className="flex items-center gap-3 px-8 py-5 cursor-pointer"
            style={{ minWidth: 230 }}
            onClick={() => setPanel(panel === 'loc' ? null : 'loc')}
          >
            <MapPin size={20} className="shrink-0" style={{ color: '#8E8E93' }} />
            <div className="flex-1 border-b border-[#E0E0E0] pb-0.5">
              <p style={{ color: location ? '#1C1C1E' : '#9E9E9E', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                {location || 'Location'}
              </p>
            </div>
            <ChevronLeft size={16} style={{ color: '#9E9E9E', transform: 'rotate(270deg)', flexShrink: 0 }} />
          </div>

          {/* Search places button */}
          <div className="flex items-center py-2 pr-2 pl-1">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 text-white font-semibold whitespace-nowrap transition-all"
              style={{
                background: 'linear-gradient(135deg, #FF5A5F 0%, #E31C5F 100%)',
                borderRadius: 50,
                padding: '16px 36px',
                fontSize: '1rem',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #E31C5F 0%, #C0134F 100%)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #FF5A5F 0%, #E31C5F 100%)'; }}
            >
              Search places
            </button>
          </div>
        </div>
      )}

      {/* Location suggestions panel (wide mode) */}
      {wide && panel === 'loc' && (
        <div className="hidden md:block absolute top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden" style={{ left: '40%', minWidth: 280 }}>
          <p className="px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">
            Popular destinations
          </p>
          <div className="max-h-64 overflow-y-auto">
            {SUGGESTIONS.map(s => (
              <button
                key={s.label}
                onClick={() => { setLocation(s.label); setPanel(null); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#F8F7F4] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#FF5A5F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1E]">{s.label}</p>
                  <p className="text-xs text-[#8E8E93]">{s.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── COMPACT PILL (non-wide desktop) ───────────────────────────────── */}
      {!wide && (
      <div
        className="hidden md:grid bg-white shadow-xl overflow-hidden"
        style={{
          borderRadius: 50,
          gridTemplateColumns: '1fr 1.3fr 1fr auto',
          border: '2px solid #DDDDDD',
        }}
      >
        {/* WHERE */}
        <div
          className="flex items-center gap-3 cursor-pointer transition-colors"
          style={{ padding: '14px 20px', background: panel === 'where' ? '#FFF5F5' : 'transparent' }}
          onClick={() => setPanel('where')}
        >
          <Search size={16} className="shrink-0" style={{ color: '#FF5A5F' }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-0.5">Where</p>
            <input
              value={location}
              onChange={e => { setLocation(e.target.value); setPanel('where'); }}
              onFocus={() => setPanel('where')}
              placeholder="Search destinations"
              className="border-0 outline-none bg-transparent w-full"
              style={{ color: location ? '#1C1C1E' : '#9E9E9E', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* WHEN */}
        <div
          className="flex items-center gap-3 cursor-pointer transition-colors"
          style={{ padding: '14px 20px', background: panel === 'when' ? '#FFF5F5' : 'transparent', borderLeft: '2px solid #DDDDDD', borderRight: '2px solid #DDDDDD' }}
          onClick={() => setPanel(panel === 'when' ? null : 'when')}
        >
          <CalendarDays size={16} className="shrink-0" style={{ color: '#FF5A5F' }} />
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-0.5">When</p>
            <p style={{ color: checkin ? '#1C1C1E' : '#9E9E9E', fontSize: '0.875rem' }}>
              {checkin ? whenDisplay : 'Add dates'}
            </p>
          </div>
        </div>

        {/* WHO */}
        <div
          className="flex items-center gap-3 cursor-pointer transition-colors"
          style={{ padding: '14px 20px', background: panel === 'who' ? '#FFF5F5' : 'transparent' }}
          onClick={() => setPanel(panel === 'who' ? null : 'who')}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-0.5">Who</p>
            <p style={{ color: totalGuests > 0 ? '#1C1C1E' : '#9E9E9E', fontSize: '0.875rem' }}>{whoDisplay}</p>
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex items-center" style={{ padding: '8px' }}>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2.5 text-white font-bold transition-all shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #FF5A5F 0%, #E31C5F 100%)',
              borderRadius: 50,
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #E31C5F 0%, #C0134F 100%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, #FF5A5F 0%, #E31C5F 100%)'; }}
          >
            <Search size={16} strokeWidth={2.5} />
            Search
          </button>
        </div>
      </div>
      )}

      {/* Mobile: Vertical Stack */}
      <div className="md:hidden bg-white rounded-2xl border-2 border-[#DDDDDD] shadow-lg overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b-2 border-[#DDDDDD] cursor-pointer transition-colors"
          style={{ background: panel === 'where' ? '#FFF5F5' : 'transparent' }}
          onClick={() => setPanel(panel === 'where' ? null : 'where')}
        >
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-1">Where</p>
            <p className="text-sm" style={{ color: location ? '#1C1C1E' : '#9E9E9E' }}>{location || 'Search destinations'}</p>
          </div>
          <MapPin size={18} className="text-[#FF5A5F]" />
        </div>

        <div
          className="flex items-center justify-between px-4 py-3 border-b-2 border-[#DDDDDD] cursor-pointer transition-colors"
          style={{ background: panel === 'when' ? '#FFF5F5' : 'transparent' }}
          onClick={() => setPanel(panel === 'when' ? null : 'when')}
        >
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-1">When</p>
            <p className="text-sm" style={{ color: checkin ? '#1C1C1E' : '#9E9E9E' }}>{whenDisplay}</p>
          </div>
        </div>

        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
          style={{ background: panel === 'who' ? '#FFF5F5' : 'transparent' }}
          onClick={() => setPanel(panel === 'who' ? null : 'who')}
        >
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#1C1C1E] mb-1">Who</p>
            <p className="text-sm" style={{ color: totalGuests > 0 ? '#1C1C1E' : '#9E9E9E' }}>{whoDisplay}</p>
          </div>
        </div>

        <div className="px-4 py-3 border-t-2 border-[#DDDDDD]">
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 bg-[#FF5A5F] hover:bg-[#E31C5F] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Search size={16} strokeWidth={2.5} />
            Search
          </button>
        </div>
      </div>

      {/* WHERE Dropdown */}
      {panel === 'where' && (
        <div className="absolute top-full mt-2 left-0 right-0 md:right-auto md:w-80 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB] md:hidden">
            <p className="font-semibold text-sm text-[#1C1C1E]" style={{ fontFamily: "'Poppins', sans-serif" }}>Where to?</p>
            <button onClick={() => setPanel(null)} className="w-7 h-7 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center">
              <X size={16} className="text-[#717171]" />
            </button>
          </div>
          <div className="md:hidden px-4 py-3 border-b border-[#EBEBEB]">
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Search destinations"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF5A5F]"
              autoFocus
            />
          </div>
          <p className="px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-[#8E8E93]">
            {location ? 'Matching destinations' : 'Popular destinations'}
          </p>
          <div className="max-h-64 overflow-y-auto">
            {filteredSuggestions.length === 0 && (
              <p className="px-4 py-3 text-sm text-[#8E8E93]">No matching destinations</p>
            )}
            {filteredSuggestions.map(s => (
              <button
                key={s.label}
                onClick={() => { setLocation(s.label); setPanel('when'); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#F8F7F4] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#FF5A5F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1C1E]">{s.label}</p>
                  <p className="text-xs text-[#8E8E93]">{s.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHEN Dropdown */}
      {panel === 'when' && (
        <div className="absolute top-full mt-2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB] md:hidden">
            <p className="font-semibold text-sm text-[#1C1C1E]" style={{ fontFamily: "'Poppins', sans-serif" }}>When's your trip?</p>
            <button onClick={() => setPanel(null)} className="w-7 h-7 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center">
              <X size={16} className="text-[#717171]" />
            </button>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex justify-center mb-4">
              <div className="flex bg-[#F2F2F2] rounded-full p-1">
                {(['dates','flexible'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setCalTab(t)}
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all capitalize"
                    style={{
                      background: calTab === t ? 'white' : 'transparent',
                      color: '#1C1C1E',
                      fontWeight: calTab === t ? 600 : 400,
                      boxShadow: calTab === t ? '0 1px 6px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {calTab === 'dates' ? (
              <>
                {/* Mobile: Single Month */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCalBase(b => advanceMonth(b.year, b.month, -1))}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7]"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCalBase(b => advanceMonth(b.year, b.month, 1))}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <MonthGrid
                    year={calBase.year} month={calBase.month} today={today}
                    checkin={checkin} checkout={checkout} hover={hoverDay}
                    onDayClick={handleDayClick} onDayHover={setHoverDay}
                  />
                </div>

                {/* Desktop: Two Months */}
                <div className="hidden md:flex items-start gap-8">
                  <button
                    onClick={() => setCalBase(b => advanceMonth(b.year, b.month, -1))}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] mt-1"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <MonthGrid
                    year={calBase.year} month={calBase.month} today={today}
                    checkin={checkin} checkout={checkout} hover={hoverDay}
                    onDayClick={handleDayClick} onDayHover={setHoverDay}
                  />
                  <div className="w-px bg-[#F2F2F2] self-stretch" />
                  <MonthGrid
                    year={cal2.year} month={cal2.month} today={today}
                    checkin={checkin} checkout={checkout} hover={hoverDay}
                    onDayClick={handleDayClick} onDayHover={setHoverDay}
                  />
                  <button
                    onClick={() => setCalBase(b => advanceMonth(b.year, b.month, 1))}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] mt-1"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {FLEX_OPTIONS.map(o => (
                    <button
                      key={o.key}
                      onClick={() => setFlexOpt(o.key)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        border: `1.5px solid ${flexOpt === o.key ? '#1C1C1E' : '#DDDDDD'}`,
                        background: flexOpt === o.key ? '#1C1C1E' : 'white',
                        color: flexOpt === o.key ? 'white' : '#1C1C1E',
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                {(checkin || checkout) && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F2F2F2]">
                    <button
                      onClick={() => { setCheckin(null); setCheckout(null); }}
                      className="text-xs font-semibold text-[#1C1C1E] underline"
                    >
                      Clear dates
                    </button>
                    <button
                      onClick={() => setPanel('who')}
                      className="px-6 py-2.5 rounded-xl bg-[#1C1C1E] text-white text-sm font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-[#1C1C1E] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  How long do you want to stay?
                </p>
                <p className="text-sm text-[#8E8E93] mb-6">Pick a flexible duration and we'll find the best matches.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Weekend', '1 week', '2 weeks', '1 month', 'Flexible'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setPanel('who')}
                      className="px-5 py-2.5 rounded-full border-2 border-[#DDDDDD] text-sm font-medium hover:border-[#1C1C1E] hover:font-semibold transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WHO Dropdown */}
      {panel === 'who' && (
        <div className="absolute top-full mt-2 right-0 left-0 md:left-auto md:w-80 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB] md:hidden">
            <p className="font-semibold text-sm text-[#1C1C1E]" style={{ fontFamily: "'Poppins', sans-serif" }}>Who's coming?</p>
            <button onClick={() => setPanel(null)} className="w-7 h-7 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center">
              <X size={16} className="text-[#717171]" />
            </button>
          </div>
          <div className="p-4">
            <Counter label="Adults" sub="Age 13 or above" val={adults} set={setAdults} min={1} />
            <Counter label="Children" sub="Ages 2–12" val={children} set={setChildren} />
            <Counter label="Infants" sub="Under 2" val={infants} set={setInfants} />
            <div className="flex items-center justify-between mt-4">
              {totalGuests > 0 && (
                <button
                  onClick={() => { setAdults(1); setChildren(0); setInfants(0); }}
                  className="text-xs font-semibold text-[#8E8E93] underline"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleSearch}
                className="ml-auto px-6 py-2.5 rounded-xl bg-[#FF5A5F] text-white text-sm font-bold shadow-md"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
