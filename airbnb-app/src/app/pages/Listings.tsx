import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import {
  Search, SlidersHorizontal, Star, MapPin, Heart, X,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navbar } from '../components/layout/Navbar';
import { properties } from '../../data/mockData';
import { FilterModal, FilterState, DEFAULT_FILTERS } from '../components/shared/FilterModal';
import { Pagination } from '../components/shared/Pagination';
import { usePagination } from '../components/shared/usePagination';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useListings, useSearchListings } from '../../features/listings/hooks';

type Property = typeof properties[0] & { lat?: number; lng?: number };

/* ─── Map helpers ───────────────────────────────────────────────── */
const CITY_CENTRES: Record<string, [number, number]> = {
  kigali:        [-1.9706,  30.1044],
  nairobi:       [-1.2921,  36.8219],
  paris:         [48.8566,   2.3522],
  'new york':    [40.7128, -74.0060],
  mombasa:       [-4.0435,  39.6682],
  'cape town':   [-33.9249, 18.4241],
  swiss:         [46.5197,   7.5857],
};
function getCenter(loc: string): [number, number] {
  const l = loc.toLowerCase();
  for (const [k, v] of Object.entries(CITY_CENTRES)) if (l.includes(k)) return v;
  return [20, 10];
}
function getZoom(loc: string) { return loc.trim() ? 11 : 3; }

function priceIcon(price: number, active: boolean): L.DivIcon {
  const bg     = active ? '#FF5A5F' : '#1C1C1E';
  const shadow = active ? '0 4px 14px rgba(255,90,95,0.45)' : '0 2px 8px rgba(0,0,0,0.28)';
  return L.divIcon({
    className: '',
    html: `<div style="background:${bg};color:white;padding:5px 10px;border-radius:20px;
      font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;
      white-space:nowrap;border:2.5px solid white;box-shadow:${shadow};
      transform:scale(${active ? 1.12 : 1});transition:all .15s;cursor:pointer">$${price}</div>`,
    iconSize:   [64, 32],
    iconAnchor: [32, 16],
  });
}

/* ─── Vanilla Leaflet Map Panel ─────────────────────────────────── */
interface MapPanelProps {
  items: Property[];
  allItems: Property[];           // all filtered props (for pins even outside bounds)
  hoveredId: string | null;
  onPinHover: (id: string | null) => void;
  onPinClick: (id: string) => void;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  center: [number, number];
  zoom: number;
}

function MapPanel({ items, allItems, hoveredId, onPinHover, onPinClick, onBoundsChange, center, zoom }: MapPanelProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<L.Map | null>(null);
  const markerData    = useRef<Record<string, { marker: L.Marker; price: number }>>({});
  const [ready, setReady] = useState(false);

  const hoverCb   = useRef(onPinHover);
  const clickCb   = useRef(onPinClick);
  const boundsCb  = useRef(onBoundsChange);
  useEffect(() => { hoverCb.current  = onPinHover;  },  [onPinHover]);
  useEffect(() => { clickCb.current  = onPinClick;  },  [onPinClick]);
  useEffect(() => { boundsCb.current = onBoundsChange; }, [onBoundsChange]);

  /* inject popup CSS */
  useEffect(() => {
    const id = 'sb-popup-style';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `
        .sb-popup .leaflet-popup-content-wrapper{padding:0!important;border-radius:16px!important;overflow:hidden!important;box-shadow:0 8px 32px rgba(0,0,0,0.16)!important;}
        .sb-popup .leaflet-popup-content{margin:0!important;width:220px!important;}
        .sb-popup .leaflet-popup-tip-container{display:none!important;}
      `;
      document.head.appendChild(s);
    }
  }, []);

  /* init once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center, zoom, zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    /* fire bounds on every move/zoom */
    const emitBounds = () => boundsCb.current(map.getBounds());
    map.on('moveend', emitBounds);
    map.on('zoomend', emitBounds);

    mapRef.current = map;
    setReady(true);

    /* fire initial bounds after tiles settle */
    setTimeout(emitBounds, 300);

    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* re-centre */
  useEffect(() => {
    mapRef.current?.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom]);

  /* rebuild markers when allItems change */
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;

    Object.values(markerData.current).forEach(({ marker }) => marker.remove());
    markerData.current = {};

    allItems.forEach(p => {
      const lat = (p as any).lat as number | undefined;
      const lng = (p as any).lng as number | undefined;
      if (!lat || !lng) return;

      const marker = L.marker([lat, lng], { icon: priceIcon(p.price, false) });
      marker.on('mouseover', () => hoverCb.current(p.id));
      marker.on('mouseout',  () => hoverCb.current(null));
      marker.on('click',     () => { clickCb.current(p.id); marker.openPopup(); });
      marker.bindPopup(
        `<div style="width:220px;font-family:'Inter',sans-serif">
          <img src="${p.image}" style="width:100%;height:118px;object-fit:cover"/>
          <div style="padding:10px 12px 12px">
            <p style="font-weight:700;font-size:13px;color:#1C1C1E;margin:0 0 2px;
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</p>
            <p style="font-size:12px;color:#8E8E93;margin:0 0 6px">${p.location}</p>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:700;font-size:13px;color:#1C1C1E">$${p.price}<span style="font-weight:400;color:#8E8E93;font-size:12px">/night</span></span>
              <span style="font-size:12px;color:#8E8E93">★ ${p.rating}</span>
            </div>
          </div>
        </div>`,
        { closeButton: false, className: 'sb-popup', maxWidth: 220 }
      );
      marker.addTo(map);
      markerData.current[p.id] = { marker, price: p.price };
    });

    if (hoveredId && markerData.current[hoveredId]) {
      markerData.current[hoveredId].marker.setIcon(priceIcon(markerData.current[hoveredId].price, true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, ready]);

  /* update hover icon only */
  useEffect(() => {
    Object.entries(markerData.current).forEach(([id, { marker, price }]) => {
      marker.setIcon(priceIcon(price, hoveredId === id));
    });
  }, [hoveredId]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}

/* ─── Property card (map-view style) ───────────────────────────── */
function MapCard({
  p, isHovered, cardRef, onHover,
}: {
  p: Property; isHovered: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
  onHover: (id: string | null) => void;
}) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const badge = p.rating >= 4.9 ? 'Superhost' : p.reviews > 150 ? 'Guest favourite' : null;

  return (
    <div ref={cardRef} onMouseEnter={() => onHover(p.id)} onMouseLeave={() => onHover(null)}>
      <Link to={`/property/${p.id}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden mb-3"
          style={{
            aspectRatio: '4/3',
            boxShadow: isHovered ? '0 8px 28px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.07)',
            transition: 'box-shadow .2s ease',
          }}
        >
          <img src={p.image} alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />

          {badge && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.94)', color: '#1C1C1E' }}>
              {badge}
            </span>
          )}

          <button
            onClick={e => {
              e.preventDefault();
              if (!isAuthenticated) {
                navigate('/signin');
                return;
              }
              if (isInWishlist(p.id)) {
                removeFromWishlist(p.id);
              } else {
                addToWishlist(p.id);
              }
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: isInWishlist(p.id) ? '#FF5A5F' : 'rgba(255,255,255,0.9)' }}>
            <Heart className="w-4 h-4" style={{ fill: isInWishlist(p.id) ? 'white' : 'none', color: isInWishlist(p.id) ? 'white' : '#1C1C1E', strokeWidth: 1.8 }} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p className="text-sm font-semibold line-clamp-1 flex-1" style={{ color: '#1C1C1E', fontFamily: "'Poppins', sans-serif" }}>
            {p.title}
          </p>
          <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
            <Star className="w-3 h-3" style={{ fill: '#F5A623', color: '#F5A623' }} />
            <span className="text-xs font-semibold" style={{ color: '#1C1C1E' }}>{p.rating}</span>
          </div>
        </div>
        <p className="text-xs mb-0.5" style={{ color: '#8E8E93' }}>{p.location}</p>
        <p className="text-xs mb-1.5" style={{ color: '#AAAAAA' }}>
          {p.bedrooms} bed{p.bedrooms !== 1 ? 's' : ''} · {p.baths} bath{p.baths !== 1 ? 's' : ''}
        </p>
        <p className="text-sm">
          <span className="font-bold" style={{ color: '#1C1C1E' }}>${p.price}</span>
          <span style={{ color: '#8E8E93' }}> / night</span>
        </p>
      </Link>
    </div>
  );
}

/* ─── Skeleton card (shown while loading map area results) ──────── */
function SkeletonCard() {
  return (
    <div>
      <div
        className="rounded-2xl bg-[#F0F0F0]"
        style={{ aspectRatio: '4/3', marginBottom: 12, animation: 'sbPulse 1.5s ease-in-out infinite' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="rounded-full bg-[#F0F0F0]" style={{ height: 14, width: '72%', animation: 'sbPulse 1.5s ease-in-out infinite 0.1s' }} />
        <div className="rounded-full bg-[#F0F0F0]" style={{ height: 11, width: '50%', animation: 'sbPulse 1.5s ease-in-out infinite 0.2s' }} />
        <div className="rounded-full bg-[#F0F0F0]" style={{ height: 11, width: '60%', animation: 'sbPulse 1.5s ease-in-out infinite 0.3s' }} />
        <div className="rounded-full bg-[#F0F0F0]" style={{ height: 14, width: '35%', marginTop: 2, animation: 'sbPulse 1.5s ease-in-out infinite 0.15s' }} />
      </div>
    </div>
  );
}

/* inject skeleton keyframe once */
if (typeof document !== 'undefined' && !document.getElementById('sb-pulse-kf')) {
  const s = document.createElement('style');
  s.id = 'sb-pulse-kf';
  s.textContent = `
    @keyframes sbPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════════════════════
   MAP + LIST VIEW  (shown when search params present)
═══════════════════════════════════════════════════════════════════ */
function ListingsMapView({
  locationParam, checkinParam, checkoutParam, guestsParam,
}: {
  locationParam: string; checkinParam: string; checkoutParam: string; guestsParam: string;
}) {
  const [search,       setSearch]      = useState(locationParam);
  const [showFilters,  setShowFilters]  = useState(false);
  const [filters,      setFilters]      = useState<FilterState>(DEFAULT_FILTERS);
  const [hoveredId,    setHoveredId]    = useState<string | null>(null);
  const [mapBounds,    setMapBounds]    = useState<L.LatLngBounds | null>(null);

  /* skeleton + "Search this area" state */
  const [isPending,      setIsPending]      = useState(false);
  const [showSearchBtn,  setShowSearchBtn]  = useState(false);
  const pendingBoundsRef = useRef<L.LatLngBounds | null>(null);
  const isFirstBounds    = useRef(true);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* base filter */
  const filtered = useMemo((): Property[] => {
    return (properties as Property[]).filter(p => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      }
      if (filters.typeOfPlace === 'room'   && p.type !== 'Studio') return false;
      if (filters.typeOfPlace === 'entire' && p.type === 'Studio') return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (filters.bedrooms  > 0 && (p.bedrooms || 0) < filters.bedrooms)  return false;
      if (filters.beds      > 0 && (p.beds     || 0) < filters.beds)      return false;
      if (filters.bathrooms > 0 && (p.baths    || 0) < filters.bathrooms) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false;
      if (filters.quickFilters.includes('kitchen') && !p.amenities.includes('Kitchen')) return false;
      if (filters.quickFilters.includes('pool')    && !p.amenities.includes('Pool'))    return false;
      return true;
    });
  }, [search, filters]);

  /* map-area filter — what the list shows */
  const inBounds = useMemo((): Property[] => {
    if (!mapBounds) return filtered;
    return filtered.filter(p => {
      const lat = (p as any).lat as number | undefined;
      const lng = (p as any).lng as number | undefined;
      if (!lat || !lng) return false;
      return mapBounds.contains(L.latLng(lat, lng));
    });
  }, [filtered, mapBounds]);

  const scrollToCard = useCallback((id: string) => {
    cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setHoveredId(id);
    setTimeout(() => setHoveredId(null), 1800);
  }, []);

  const stableHover = useCallback((id: string | null) => setHoveredId(id), []);

  /* bounds handler:
     – first call (initial map load) → apply instantly, no skeleton
     – subsequent calls (user panned/zoomed) → show "Search this area" btn */
  const handleBounds = useCallback((b: L.LatLngBounds) => {
    if (isFirstBounds.current) {
      setMapBounds(b);
      isFirstBounds.current = false;
    } else {
      pendingBoundsRef.current = b;
      setShowSearchBtn(true);
    }
  }, []);

  /* user clicks "Search this area" */
  const handleSearchArea = useCallback(() => {
    const bounds = pendingBoundsRef.current;
    if (!bounds) return;
    setShowSearchBtn(false);
    setIsPending(true);
    setTimeout(() => {
      setMapBounds(bounds);
      setIsPending(false);
    }, 650);
  }, []);

  const mapCenter = useMemo(() => getCenter(locationParam || search), [locationParam, search]);
  const mapZoom   = useMemo(() => getZoom(locationParam   || search), [locationParam, search]);

  const locationLabel = locationParam.split(',')[0] || 'this area';
  const dateTag       = [checkinParam, checkoutParam].filter(Boolean).join(' – ');
  const guestTag      = guestsParam ? `· ${guestsParam} guest${Number(guestsParam) > 1 ? 's' : ''}` : '';

  const activeFC =
    (filters.typeOfPlace !== 'any' ? 1 : 0) +
    (filters.priceRange[0] > 50 || filters.priceRange[1] < 500 ? 1 : 0) +
    filters.amenities.length + filters.quickFilters.length +
    [filters.bedrooms, filters.beds, filters.bathrooms].filter(n => n > 0).length;

  /* header copy */
  const headerTitle = isPending
    ? 'Searching…'
    : inBounds.length > 0
      ? `${inBounds.length} home${inBounds.length !== 1 ? 's' : ''} in map area`
      : '0 homes – try zooming out';

  return (
    <div className="flex flex-col" style={{ height: '100vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: property list (no scrollbar) ── */}
        <div
          className="flex flex-col no-scrollbar"
          style={{ width: '54%', minWidth: 0, borderRight: '1px solid #EBEBEB', overflowY: 'auto' }}
        >
          {/* Sticky header */}
          <div className="sticky top-0 bg-white z-10 px-5 pt-4 pb-3 shrink-0"
            style={{ borderBottom: '1px solid #EBEBEB' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {isPending ? (
                  /* skeleton title while loading */
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      className="rounded-full bg-[#F0F0F0]"
                      style={{ height: 18, width: 180, animation: 'sbPulse 1.2s ease-in-out infinite' }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-[#FF5A5F] border-t-transparent"
                      style={{ animation: 'spin 0.7s linear infinite' }}
                    />
                  </div>
                ) : (
                  <h1
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#1C1C1E' }}
                    className="truncate"
                  >
                    {headerTitle}
                  </h1>
                )}
                {(dateTag || guestTag) && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#8E8E93' }}>
                    {locationLabel} {[dateTag, guestTag].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: '#AAAAAA' }} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Refine search…"
                    className="pl-8 pr-3 py-2 rounded-xl border text-xs outline-none"
                    style={{ borderColor: '#DDDDDD', width: 150, color: '#1C1C1E' }}
                    onFocus={e => (e.target.style.borderColor = '#FF5A5F')}
                    onBlur={e  => (e.target.style.borderColor = '#DDDDDD')}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(true)}
                  className="relative flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    borderColor: activeFC > 0 ? '#1C1C1E' : '#DDDDDD',
                    color: '#1C1C1E',
                    background: activeFC > 0 ? '#F8F7F4' : 'white',
                  }}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFC > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: '#FF5A5F' }}>{activeFC}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cards / Skeletons */}
          <div className="px-5 py-4 flex-1">
            {isPending ? (
              /* ── skeleton grid ── */
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : inBounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-[#F8F7F4] flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6" style={{ color: '#AAAAAA' }} />
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#1C1C1E' }}>Nothing here yet</p>
                <p className="text-xs text-center" style={{ color: '#8E8E93' }}>
                  Pan the map or click "Search this area" to find homes
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {inBounds.map(p => (
                  <MapCard
                    key={p.id}
                    p={p}
                    isHovered={hoveredId === p.id}
                    cardRef={el => { cardRefs.current[p.id] = el; }}
                    onHover={stableHover}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: map ── */}
        <div className="flex-1 relative" style={{ minWidth: 0 }}>
          <MapPanel
            items={inBounds}
            allItems={filtered}
            hoveredId={hoveredId}
            onPinHover={stableHover}
            onPinClick={scrollToCard}
            onBoundsChange={handleBounds}
            center={mapCenter}
            zoom={mapZoom}
          />

          {/* "Search this area" button — appears after map moves */}
          {showSearchBtn && !isPending && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[999]"
              style={{ pointerEvents: 'none' }}
            >
              <button
                onClick={handleSearchArea}
                style={{
                  pointerEvents: 'auto',
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'white',
                  border: '1.5px solid #DDDDDD',
                  borderRadius: 30,
                  padding: '10px 20px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600, fontSize: 13,
                  color: '#1C1C1E',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
                  transition: 'box-shadow .2s, transform .15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.2)';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.14)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Search className="w-3.5 h-3.5" style={{ color: '#FF5A5F' }} />
                Search this area
              </button>
            </div>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={inBounds.length}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GRID VIEW  (shown when NO search params — original listings)
═══════════════════════════════════════════════════════════════════ */
const CATEGORIES = ['All', 'Apartment', 'Villa', 'Beachfront', 'Cabin', 'Studio'];

function ListingsGrid() {
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState('All');
  const [maxPrice,    setMaxPrice]    = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  
  const { data: apiListings = [], isLoading } = useListings();

  const filtered = useMemo(() => {
    return apiListings.filter(p => {
      const q = search.toLowerCase();
      if (search && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      if (selected !== 'All' && p.category !== selected && p.type !== selected) return false;
      if (p.price > maxPrice) return false;
      if (filterState.bedrooms  > 0 && (p.bedrooms || 0) < filterState.bedrooms)  return false;
      if (filterState.bathrooms > 0 && (p.baths    || 0) < filterState.bathrooms) return false;
      if (filterState.amenities.length > 0 && !filterState.amenities.every(a => p.amenities.includes(a))) return false;
      return true;
    });
  }, [search, selected, maxPrice, filterState, apiListings]);

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 6 });

  const activeFC =
    (filterState.priceRange[0] > 50 || filterState.priceRange[1] < 500 ? 1 : 0) +
    filterState.amenities.length + filterState.quickFilters.length +
    [filterState.bedrooms, filterState.beds, filterState.bathrooms].filter(n => n > 0).length;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="max-w-[1760px] mx-auto px-6 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#222222' }}>
              Explore All Listings
            </h1>
            <p className="text-sm mt-1" style={{ color: '#717171' }}>{filtered.length} properties found</p>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#AAAAAA' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search properties…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#DDDDDD', color: '#222222' }}
                onFocus={e => (e.target.style.borderColor = '#FF5A5F')}
                onBlur={e  => (e.target.style.borderColor = '#DDDDDD')}
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="relative flex items-center gap-2 border px-4 py-3 rounded-xl hover:bg-[#F7F7F7] transition-colors text-sm font-medium"
              style={{
                borderColor: activeFC > 0 ? '#1C1C1E' : '#DDDDDD',
                color: '#222222',
                background: activeFC > 0 ? '#F8F7F4' : 'white',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFC > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#FF5A5F' }}>{activeFC}</span>
              )}
            </button>
          </div>
        </div>

        {/* Quick price filter - inline */}
        {showFilters && (
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>
                Quick Filter
              </h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" style={{ color: '#717171' }} />
              </button>
            </div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#222222' }}>
              Max price: <span style={{ color: '#FF5A5F' }}>${maxPrice}/night</span>
            </label>
            <input type="range" min={50} max={500} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full" style={{ accentColor: '#FF5A5F' }} />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#717171' }}>
              <span>$50</span><span>$500</span>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0"
              style={{
                background: selected === cat ? '#FF5A5F' : '#F7F7F7',
                color:      selected === cat ? 'white' : '#717171',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                <div className="bg-[#F0F0F0]" style={{ aspectRatio: '4/3' }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
                  <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
                  <div className="h-3 bg-[#F0F0F0] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#717171' }}>No properties found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {paginatedItems.map(p => (
                <GridCard key={p.id} p={p as Property} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={perPage}
              onPageChange={onPageChange}
              onItemsPerPageChange={onPerPageChange}
              perPageOptions={[6, 8, 12]}
              itemLabel="properties"
              className="border-t border-[#EBEBEB] pt-6"
            />
          </>
        )}
      </div>

      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filterState}
        onChange={f => { setFilterState(f); setMaxPrice(f.priceRange[1]); }}
        resultCount={filtered.length}
      />
    </div>
  );
}

function GridCard({ p }: { p: Property }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <Link to={`/property/${p.id}`}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#EBEBEB] block">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img src={p.image} alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ color: '#222222' }}>{p.type}</span>
        <button
          onClick={e => {
            e.preventDefault();
            if (!isAuthenticated) {
              navigate('/signin');
              return;
            }
            if (isInWishlist(p.id)) {
              removeFromWishlist(p.id);
            } else {
              addToWishlist(p.id);
            }
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: isInWishlist(p.id) ? '#FF5A5F' : 'rgba(255,255,255,0.9)' }}>
          <Heart className="w-4 h-4" style={{ fill: isInWishlist(p.id) ? 'white' : 'none', color: isInWishlist(p.id) ? 'white' : '#1C1C1E', strokeWidth: 1.8 }} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-sm leading-snug flex-1 pr-2 line-clamp-2"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>{p.title}</h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3.5 h-3.5" style={{ fill: '#FF5A5F', color: '#FF5A5F' }} />
            <span className="text-sm font-semibold" style={{ color: '#222222' }}>{p.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5" style={{ color: '#717171' }} />
          <p className="text-xs" style={{ color: '#717171' }}>{p.location}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>${p.price}</span>
            <span className="text-sm" style={{ color: '#717171' }}> / night</span>
          </div>
          <span className="text-xs" style={{ color: '#717171' }}>{p.reviews} reviews</span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROUTER ENTRY — decides which view to render
═══════════════════════════════════════════════════════════════════ */
export function Listings() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const locationParam = searchParams.get('location') || '';
  const checkinParam  = searchParams.get('checkin')  || '';
  const checkoutParam = searchParams.get('checkout') || '';
  const guestsParam   = searchParams.get('guests')   || '';

  const hasSearch = !!(locationParam || checkinParam || guestsParam);

  if (!hasSearch) return <ListingsGrid />;

  return (
    <ListingsMapView
      locationParam={locationParam}
      checkinParam={checkinParam}
      checkoutParam={checkoutParam}
      guestsParam={guestsParam}
    />
  );
}