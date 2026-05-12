import { useState } from 'react';
import {
  X, Minus, Plus, Wifi, Tv, Utensils, Droplets,
  CalendarX, Waves, Car, Dumbbell, Flame, Wind,
} from 'lucide-react';
import * as SliderPrimitive from '@radix-ui/react-slider';

export interface FilterState {
  typeOfPlace: 'any' | 'room' | 'entire';
  priceRange: [number, number];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  quickFilters: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  typeOfPlace: 'any',
  priceRange: [50, 500],
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
  quickFilters: [],
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

/* Histogram bars – bell-curve price distribution */
const HIST = [2, 3, 5, 8, 12, 18, 24, 30, 36, 40, 42, 40, 36, 30, 26, 21, 17, 13, 10, 8, 6, 4, 3, 2];
const HIST_MAX = Math.max(...HIST);

const QUICK = [
  { id: 'free_cancellation', label: 'Free cancellation', icon: CalendarX },
  { id: 'kitchen',           label: 'Kitchen',           icon: Utensils   },
  { id: 'pool',              label: 'Pool',               icon: Waves      },
  { id: 'tv',                label: 'TV',                 icon: Tv         },
];

const AMENITIES = [
  { id: 'WiFi',              label: 'WiFi',               icon: Wifi       },
  { id: 'Air conditioning',  label: 'Air conditioning',   icon: Wind       },
  { id: 'Kitchen',           label: 'Kitchen',            icon: Utensils   },
  { id: 'Pool',              label: 'Pool',               icon: Waves      },
  { id: 'Free parking',      label: 'Free parking',       icon: Car        },
  { id: 'Gym',               label: 'Gym',                icon: Dumbbell   },
  { id: 'Fireplace',         label: 'Fireplace',          icon: Flame      },
  { id: 'TV',                label: 'TV',                 icon: Tv         },
];

function Counter({
  label, value, onChange, min = 0,
}: { label: string; value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #F2F2F2' }}>
      <span className="text-sm font-medium" style={{ color: '#1C1C1E' }}>{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
          style={{
            borderColor: value <= min ? '#DDDDDD' : '#1C1C1E',
            color:       value <= min ? '#DDDDDD' : '#1C1C1E',
          }}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold" style={{ color: '#1C1C1E' }}>
          {value === 0 ? 'Any' : `${value}+`}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-[#1C1C1E] flex items-center justify-center transition-colors hover:bg-[#F7F7F7]"
          style={{ color: '#1C1C1E' }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function FilterModal({ isOpen, onClose, filters, onChange, resultCount }: FilterModalProps) {
  if (!isOpen) return null;

  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const toggleAmenity = (id: string) => {
    const list = filters.amenities.includes(id)
      ? filters.amenities.filter(a => a !== id)
      : [...filters.amenities, id];
    update({ amenities: list });
  };

  const toggleQuick = (id: string) => {
    const list = filters.quickFilters.includes(id)
      ? filters.quickFilters.filter(q => q !== id)
      : [...filters.quickFilters, id];
    update({ quickFilters: list });
  };

  const clearAll = () => onChange({ ...DEFAULT_FILTERS });

  const activeCount =
    (filters.typeOfPlace !== 'any' ? 1 : 0) +
    (filters.priceRange[0] > 50 || filters.priceRange[1] < 500 ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.beds > 0 ? 1 : 0) +
    (filters.bathrooms > 0 ? 1 : 0) +
    filters.amenities.length +
    filters.quickFilters.length;

  /* Price histogram – which bars are within the selected range */
  const totalBars = HIST.length;
  const priceMin = 50;
  const priceMax = 500;
  const barWidth = (priceMax - priceMin) / totalBars;
  const isBarActive = (i: number) => {
    const barStart = priceMin + i * barWidth;
    const barEnd   = barStart + barWidth;
    return barEnd > filters.priceRange[0] && barStart < filters.priceRange[1];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2000]"
        style={{ background: 'rgba(0,0,0,0.40)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl w-full overflow-hidden flex flex-col"
          style={{ maxWidth: 680, maxHeight: '90vh', fontFamily: "'Inter', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F2F2F2' }}>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" style={{ color: '#1C1C1E' }} />
            </button>
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1rem' }}>
              Filters {activeCount > 0 && <span className="ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FF5A5F', color: 'white' }}>{activeCount}</span>}
            </h2>
            <div style={{ width: 32 }} />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

            {/* Active quick filters as chips */}
            {filters.quickFilters.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: '#1C1C1E' }}>Selected</p>
                <div className="flex flex-wrap gap-2">
                  {filters.quickFilters.map(id => {
                    const q = QUICK.find(x => x.id === id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleQuick(id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
                        style={{ borderColor: '#1C1C1E', color: '#1C1C1E' }}
                      >
                        {q?.label}
                        <Plus className="w-3 h-3 rotate-45" />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 h-px" style={{ background: '#F2F2F2' }} />
              </div>
            )}

            {/* Recommended quick filters */}
            <div>
              <p className="text-sm font-semibold mb-4" style={{ color: '#1C1C1E' }}>Recommended for you</p>
              <div className="grid grid-cols-4 gap-3">
                {QUICK.map(q => {
                  const active = filters.quickFilters.includes(q.id);
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => toggleQuick(q.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
                      style={{
                        borderColor:     active ? '#1C1C1E' : '#EBEBEB',
                        background:      active ? '#F8F7F4' : 'white',
                        boxShadow:       active ? '0 0 0 1.5px #1C1C1E' : 'none',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: active ? '#1C1C1E' : '#717171' }} />
                      <span className="text-xs font-medium text-center leading-tight" style={{ color: '#1C1C1E' }}>{q.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px" style={{ background: '#F2F2F2' }} />

            {/* Type of place */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#1C1C1E' }}>Type of place</p>
              <div className="grid grid-cols-3 gap-0 rounded-full border overflow-hidden" style={{ borderColor: '#DDDDDD' }}>
                {(['any', 'room', 'entire'] as const).map((type, i) => {
                  const labels = { any: 'Any type', room: 'Room', entire: 'Entire home' };
                  const active = filters.typeOfPlace === type;
                  return (
                    <button
                      key={type}
                      onClick={() => update({ typeOfPlace: type })}
                      className="py-3 text-sm font-medium transition-colors"
                      style={{
                        background:  active ? 'white' : 'transparent',
                        color:       active ? '#1C1C1E' : '#717171',
                        boxShadow:   active ? '0 1px 4px rgba(0,0,0,0.18)' : 'none',
                        borderLeft:  i > 0 ? '1px solid #DDDDDD' : 'none',
                        zIndex:      active ? 1 : 0,
                        borderRadius: type === 'any' ? '999px 0 0 999px' : type === 'entire' ? '0 999px 999px 0' : '0',
                      }}
                    >
                      {labels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px" style={{ background: '#F2F2F2' }} />

            {/* Price range */}
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#1C1C1E' }}>Price range</p>
              <p className="text-xs mb-5" style={{ color: '#8E8E93' }}>Nightly price, before fees</p>

              {/* Histogram */}
              <div className="flex items-end gap-0.5 h-14 mb-3">
                {HIST.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-colors"
                    style={{
                      height:     `${(h / HIST_MAX) * 100}%`,
                      background: isBarActive(i) ? '#FF5A5F' : '#EBEBEB',
                    }}
                  />
                ))}
              </div>

              {/* Dual range slider */}
              <SliderPrimitive.Root
                min={50}
                max={500}
                step={10}
                value={filters.priceRange}
                onValueChange={v => update({ priceRange: v as [number, number] })}
                className="relative flex items-center w-full select-none touch-none"
                style={{ height: 20 }}
              >
                <SliderPrimitive.Track
                  className="relative w-full grow overflow-hidden rounded-full"
                  style={{ height: 3, background: '#EBEBEB' }}
                >
                  <SliderPrimitive.Range className="absolute h-full rounded-full" style={{ background: '#1C1C1E' }} />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb
                  className="block rounded-full bg-white focus:outline-none"
                  style={{ width: 24, height: 24, border: '1px solid #DDDDDD', boxShadow: '0 1px 6px rgba(0,0,0,0.22)', cursor: 'grab' }}
                />
                <SliderPrimitive.Thumb
                  className="block rounded-full bg-white focus:outline-none"
                  style={{ width: 24, height: 24, border: '1px solid #DDDDDD', boxShadow: '0 1px 6px rgba(0,0,0,0.22)', cursor: 'grab' }}
                />
              </SliderPrimitive.Root>

              <div className="flex items-center justify-between mt-4 gap-4">
                <div className="flex-1 rounded-xl border px-3 py-2.5" style={{ borderColor: '#DDDDDD' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#8E8E93' }}>Minimum</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>${filters.priceRange[0]}</p>
                </div>
                <div className="w-4 h-px" style={{ background: '#DDDDDD' }} />
                <div className="flex-1 rounded-xl border px-3 py-2.5" style={{ borderColor: '#DDDDDD' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#8E8E93' }}>Maximum</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>
                    {filters.priceRange[1] >= 500 ? '$500+' : `$${filters.priceRange[1]}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px" style={{ background: '#F2F2F2' }} />

            {/* Rooms and beds */}
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1C1C1E' }}>Rooms and beds</p>
              <Counter label="Bedrooms"  value={filters.bedrooms}  onChange={v => update({ bedrooms: v })} />
              <Counter label="Beds"      value={filters.beds}      onChange={v => update({ beds: v })} />
              <Counter label="Bathrooms" value={filters.bathrooms} onChange={v => update({ bathrooms: v })} />
            </div>

            <div className="h-px" style={{ background: '#F2F2F2' }} />

            {/* Amenities */}
            <div>
              <p className="text-sm font-semibold mb-4" style={{ color: '#1C1C1E' }}>Amenities</p>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map(a => {
                  const active = filters.amenities.includes(a.id);
                  const Icon = a.icon;
                  return (
                    <label
                      key={a.id}
                      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                      style={{
                        borderColor: active ? '#1C1C1E' : '#EBEBEB',
                        background:  active ? '#F8F7F4' : 'white',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleAmenity(a.id)}
                        className="sr-only"
                      />
                      <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18, color: active ? '#1C1C1E' : '#717171' }} />
                      <span className="text-sm font-medium" style={{ color: '#1C1C1E' }}>{a.label}</span>
                      {active && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                          <div className="w-1.5 h-1 border-b-2 border-l-2 border-white rotate-[-45deg] translate-y-[-1px]" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: '1px solid #F2F2F2' }}
          >
            <button
              onClick={clearAll}
              className="text-sm font-semibold underline transition-colors"
              style={{ color: activeCount > 0 ? '#1C1C1E' : '#AAAAAA' }}
              disabled={activeCount === 0}
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#1C1C1E' }}
            >
              Show {resultCount.toLocaleString()}+ place{resultCount !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}