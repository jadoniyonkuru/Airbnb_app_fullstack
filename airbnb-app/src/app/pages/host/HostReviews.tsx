import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, Search, ChevronDown } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

const reviews = [
  {
    id: 'R001',
    property: 'Skyline Penthouse in Kigali Heights',
    propertyImg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=60&fit=crop',
    guest: 'Kevin Malone',
    guestAvatar: 'JS',
    rating: 5,
    date: 'April 25, 2026',
    comment: 'Amazing place! Very clean and comfortable. Jean Pierre was incredibly helpful and responsive throughout the entire stay. The apartment is exactly as described and the location is perfect.',
    replied: false,
    helpful: 12,
    stayDates: 'Apr 20 – Apr 25, 2026',
  },
  {
    id: 'R002',
    property: 'Hilltop Cottage with Garden Views',
    propertyImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=60&fit=crop',
    guest: 'Isabelle Renard',
    guestAvatar: 'MD',
    rating: 4,
    date: 'April 18, 2026',
    comment: 'Beautiful cottage, very cozy and peaceful. Jean Pierre was great at communicating. The garden is stunning. Only minor issue was parking, but overall a wonderful experience.',
    replied: true,
    replyText: "Thank you so much, Marie! It was a pleasure hosting you. Glad you enjoyed the garden! We're working on the parking situation.",
    helpful: 8,
    stayDates: 'Apr 14 – Apr 18, 2026',
  },
  {
    id: 'R003',
    property: 'Skyline Penthouse in Kigali Heights',
    propertyImg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=60&fit=crop',
    guest: 'Rafael Vargas',
    guestAvatar: 'LM',
    rating: 5,
    date: 'April 10, 2026',
    comment: 'Absolutely fantastic stay. The apartment is modern, spotlessly clean, and well-equipped. Jean Pierre goes above and beyond to make guests feel welcome. Will definitely book again!',
    replied: true,
    replyText: "Thank you Lucas! So happy you had a great time. You're welcome back anytime!",
    helpful: 15,
    stayDates: 'Apr 5 – Apr 10, 2026',
  },
  {
    id: 'R004',
    property: 'Executive Studio — Kimihurura',
    propertyImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=60&fit=crop',
    guest: 'Thabo Nkosi',
    guestAvatar: 'PP',
    rating: 5,
    date: 'March 30, 2026',
    comment: 'The executive suite exceeded all expectations. Perfect for a business trip with fast WiFi and a dedicated workspace. Highly recommended for professionals visiting Kigali.',
    replied: false,
    helpful: 9,
    stayDates: 'Mar 26 – Mar 30, 2026',
  },
  {
    id: 'R005',
    property: 'Hilltop Cottage with Garden Views',
    propertyImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=60&fit=crop',
    guest: 'Kwame Asante',
    guestAvatar: 'OB',
    rating: 3,
    date: 'March 20, 2026',
    comment: 'The cottage is nice but had a few maintenance issues — the hot water was inconsistent. Jean Pierre was quick to address it but took a day to fix. Good location though.',
    replied: true,
    replyText: "Hi Oliver, I sincerely apologize for the hot water issue. We've since replaced the water heater. Thank you for bringing it to my attention!",
    helpful: 4,
    stayDates: 'Mar 17 – Mar 20, 2026',
  },
];

const ratingBreakdown = [
  { stars: 5, count: 89, percent: 72 },
  { stars: 4, count: 24, percent: 19 },
  { stars: 3, count: 8, percent: 6 },
  { stars: 2, count: 2, percent: 2 },
  { stars: 1, count: 1, percent: 1 },
];

const categories = [
  { label: 'Cleanliness', score: 4.9 },
  { label: 'Communication', score: 5.0 },
  { label: 'Check-in', score: 4.8 },
  { label: 'Accuracy', score: 4.9 },
  { label: 'Location', score: 4.7 },
  { label: 'Value', score: 4.8 },
];

export function HostReviews() {
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [search, setSearch] = useState('');
  const [filterProp, setFilterProp] = useState('all');

  const filtered = reviews.filter(r => {
    if (filterRating !== 'all' && r.rating !== parseInt(filterRating)) return false;
    if (filterProp !== 'all' && !r.property.includes(filterProp)) return false;
    if (search && !r.guest.toLowerCase().includes(search.toLowerCase()) && !r.comment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 3 });

  const avgRating = (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(2);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Guest Reviews</h1>
        <p className="text-[#717171] text-sm">Monitor and respond to reviews left by your guests.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 flex flex-col items-center justify-center text-center">
          <p className="text-6xl font-bold text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{avgRating}</p>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-5 h-5" style={{ fill: i <= Math.round(parseFloat(avgRating)) ? '#FF385C' : '#EBEBEB', color: i <= Math.round(parseFloat(avgRating)) ? '#FF385C' : '#EBEBEB' }} />
            ))}
          </div>
          <p className="text-[#717171] text-sm">{reviews.length} total reviews</p>
          <span className="mt-3 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full">⭐ Superhost Eligible</span>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <p className="text-[#222222] font-semibold text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Rating Breakdown</p>
          <div className="space-y-2.5">
            {ratingBreakdown.map(r => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="text-xs text-[#717171] w-3 shrink-0">{r.stars}</span>
                <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C] shrink-0" />
                <div className="flex-1 bg-[#F7F7F7] rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-[#FF385C] transition-all" style={{ width: `${r.percent}%` }} />
                </div>
                <span className="text-xs text-[#717171] w-5 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <p className="text-[#222222] font-semibold text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Category Ratings</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(c => (
              <div key={c.label} className="text-center rounded-xl p-3" style={{ background: '#F7F7F7' }}>
                <p className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>{c.score}</p>
                <p className="text-[#717171] text-xs mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[#DDDDDD] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-[#717171]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="flex-1 text-sm text-[#222222] outline-none bg-transparent placeholder:text-[#AAAAAA]" />
        </div>
        <div className="flex items-center gap-2 border border-[#DDDDDD] rounded-xl px-3 py-2.5 cursor-pointer">
          <Filter className="w-4 h-4 text-[#717171]" />
          <select value={filterRating} onChange={e => setFilterRating(e.target.value)} className="text-sm text-[#222222] outline-none bg-transparent cursor-pointer">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#717171]" />
        </div>
        <div className="flex items-center gap-2 border border-[#DDDDDD] rounded-xl px-3 py-2.5 cursor-pointer">
          <select value={filterProp} onChange={e => setFilterProp(e.target.value)} className="text-sm text-[#222222] outline-none bg-transparent cursor-pointer">
            <option value="all">All Properties</option>
            <option value="Modern Apartment">Modern Apartment</option>
            <option value="Hilltop Cottage">Hilltop Cottage</option>
            <option value="Executive Suite">Executive Suite</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#717171]" />
        </div>
        <span className="text-sm text-[#717171] ml-auto">{filtered.length} reviews</span>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {paginatedItems.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="flex items-start gap-4">
              {/* Property */}
              <img src={review.propertyImg} alt={review.property} className="w-16 h-12 rounded-xl object-cover shrink-0 hidden sm:block" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[#222222] font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{review.property}</p>
                    <p className="text-[#717171] text-xs mt-0.5">{review.stayDates}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4" style={{ fill: i <= review.rating ? '#FF385C' : '#EBEBEB', color: i <= review.rating ? '#FF385C' : '#EBEBEB' }} />
                    ))}
                  </div>
                </div>

                {/* Guest info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#484848] rounded-full flex items-center justify-center text-white text-xs font-bold">{review.guestAvatar}</div>
                  <div>
                    <p className="text-[#222222] text-sm font-semibold">{review.guest}</p>
                    <p className="text-[#717171] text-xs">{review.date}</p>
                  </div>
                </div>

                <p className="text-[#484848] text-sm leading-relaxed mb-4">{review.comment}</p>

                {/* Host Reply */}
                {review.replied && review.replyText && (
                  <div className="ml-4 pl-4 border-l-2 border-[#FF385C] mb-4 rounded-r-xl py-3 pr-4" style={{ background: '#FFF8F9' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">SJ</div>
                      <p className="text-[#222222] text-xs font-semibold">Your response</p>
                    </div>
                    <p className="text-[#484848] text-sm leading-relaxed">{review.replyText}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {!review.replied && (
                    <button
                      onClick={() => setReplyOpen(replyOpen === review.id ? null : review.id)}
                      className="flex items-center gap-2 text-sm font-semibold text-white bg-[#FF385C] hover:bg-[#E31C5F] px-4 py-2 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-[#717171]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {review.helpful} found helpful
                  </div>
                  {review.replied && (
                    <span className="text-xs bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-full">✓ Replied</span>
                  )}
                </div>

                {/* Reply Input */}
                {replyOpen === review.id && (
                  <div className="mt-4 border border-[#EBEBEB] rounded-xl p-4" style={{ background: '#F7F7F7' }}>
                    <p className="text-[#222222] text-sm font-semibold mb-2">Write your response</p>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Thank your guest and address any concerns..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none bg-white"
                    />
                    <div className="flex gap-2 mt-3">
                      <button className="bg-[#FF385C] hover:bg-[#E31C5F] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">Submit Response</button>
                      <button onClick={() => setReplyOpen(null)} className="border border-[#DDDDDD] text-[#222222] text-sm font-medium px-5 py-2 rounded-xl hover:bg-white transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onPerPageChange}
        perPageOptions={[3, 4, 5]}
        itemLabel="reviews"
        className="border-t border-[#EBEBEB] pt-6 mt-8"
      />
    </div>
  );
}