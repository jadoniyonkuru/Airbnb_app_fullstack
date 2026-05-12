import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useAISearch } from '../../../features/ai/hooks';

const CHIPS = [
  'Beachfront villa for 4',
  'Cozy mountain cabin',
  'City apartment under $150',
  'Tropical retreat with pool',
  'Ski chalet for a week',
];

export function AISearch() {
  const navigate = useNavigate();
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const aiSearch = useAISearch();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const runSearch = (q: string) => {
    if (!q.trim()) return;
    aiSearch.mutate(q);
  };

  // Extract location from AI response — handle various backend shapes
  const result = aiSearch.data;
  const resultLocation: string =
    result?.data?.location ||
    result?.data?.listings?.[0]?.location ||
    result?.location ||
    null;

  return (
    <div ref={wrapRef} style={{ marginTop: 12 }}>
      {/* Divider with label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 1, background: '#EBEBEB' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={12} style={{ color: '#FF5A5F' }} strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#FF5A5F', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            AI Search
          </span>
        </div>
        <div style={{ flex: 1, height: 1, background: '#EBEBEB' }} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'white',
        border: `1.5px solid ${focused ? '#FF5A5F' : '#DDDDDD'}`,
        borderRadius: 14,
        padding: '10px 10px 10px 14px',
        boxShadow: focused ? '0 0 0 3px rgba(255,90,95,0.1)' : '0 1px 6px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <Sparkles size={15} style={{ color: '#FF5A5F', flexShrink: 0 }} strokeWidth={2} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          onFocus={() => setFocused(true)}
          onKeyDown={e => e.key === 'Enter' && runSearch(query)}
          placeholder="Describe your perfect stay…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 14, color: '#1C1C1E', background: 'transparent',
            fontFamily: "'Inter', sans-serif",
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); aiSearch.reset(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAAAAA', display: 'flex', padding: 2 }}>
            <X size={14} />
          </button>
        )}
        <button
          onClick={() => runSearch(query)}
          disabled={!query.trim() || aiSearch.isPending}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 16px', borderRadius: 10, border: 'none',
            background: query.trim() && !aiSearch.isPending ? '#FF5A5F' : '#F2F2F2',
            color: query.trim() && !aiSearch.isPending ? 'white' : '#AAAAAA',
            fontWeight: 700, fontSize: 13,
            cursor: query.trim() && !aiSearch.isPending ? 'pointer' : 'not-allowed',
            fontFamily: "'Poppins', sans-serif",
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {aiSearch.isPending
            ? <span style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', display: 'inline-block', animation: 'ai-spin 0.7s linear infinite' }} />
            : 'Ask AI'
          }
        </button>
      </div>

      {/* Chips */}
      {!aiSearch.data && !aiSearch.isPending && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => { setQuery(chip); runSearch(chip); }}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: '1.5px solid #E5E5E5', background: 'white', color: '#6C6C70',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5A5F'; e.currentTarget.style.color = '#FF5A5F'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#6C6C70'; }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {aiSearch.data && !aiSearch.isPending && (
        <div style={{
          marginTop: 10, borderRadius: 12,
          border: '1.5px solid #FFD6D7',
          background: '#FFF8F8',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#FF5A5F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
              Best match
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1E', fontFamily: "'Poppins', sans-serif" }}>
              {resultLocation || 'Matching properties found'}
            </p>
            <p style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>"{query}"</p>
          </div>
          <button
            onClick={() => navigate(`/listings${resultLocation ? `?location=${encodeURIComponent(resultLocation)}` : ''}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: '#FF5A5F', color: 'white',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            View listings <ArrowRight size={13} />
          </button>
        </div>
      )}

      <style>{`@keyframes ai-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
