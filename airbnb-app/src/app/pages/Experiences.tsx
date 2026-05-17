import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

const experiences = [
  {
    id: '1',
    title: 'Kigali City Cycling Tour',
    host: 'Jean-Pierre Habimana',
    hostAvatar: 'JH',
    location: 'Kigali, Rwanda',
    category: 'Sports',
    duration: '3 hours',
    groupSize: '2–10',
    price: 35,
    rating: 4.97,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    tags: ['Cycling', 'Local Culture', 'City Tour'],
    description: 'Discover Kigali on two wheels with a local guide. Visit markets, memorials, and hidden gems.',
  },
  {
    id: '2',
    title: 'Nairobi Street Food Safari',
    host: 'Amina Njoroge',
    hostAvatar: 'AN',
    location: 'Nairobi, Kenya',
    category: 'Food & Drink',
    duration: '4 hours',
    groupSize: '2–8',
    price: 55,
    rating: 4.92,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    tags: ['Food', 'Street Food', 'Local Guide'],
    description: "Taste your way through Nairobi's most vibrant street food scene with an insider guide.",
  },
  {
    id: '3',
    title: 'Paris Photography Walk',
    host: 'Camille Renard',
    hostAvatar: 'CR',
    location: 'Paris, France',
    category: 'Arts',
    duration: '2.5 hours',
    groupSize: '2–6',
    price: 75,
    rating: 4.95,
    reviews: 217,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    tags: ['Photography', 'Art', 'Landmarks'],
    description: 'Capture Paris like a pro. A professional photographer guides you through iconic spots.',
  },
  {
    id: '4',
    title: 'NYC Rooftop Jazz Night',
    host: 'Marcus Thompson',
    hostAvatar: 'MT',
    location: 'New York, USA',
    category: 'Music',
    duration: '3 hours',
    groupSize: '4–20',
    price: 95,
    rating: 4.88,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    tags: ['Jazz', 'Music', 'Rooftop'],
    description: 'Enjoy live jazz performances on a stunning Manhattan rooftop. Drinks included.',
  },
  {
    id: '5',
    title: 'Mombasa Snorkeling Adventure',
    host: 'Fatuma Ally',
    hostAvatar: 'GM',
    location: 'Mombasa, Kenya',
    category: 'Nature',
    duration: '5 hours',
    groupSize: '2–12',
    price: 65,
    rating: 4.96,
    reviews: 183,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    tags: ['Snorkeling', 'Ocean', 'Wildlife'],
    description: 'Explore vibrant coral reefs and tropical fish in crystal-clear Indian Ocean waters.',
  },
  {
    id: '6',
    title: 'Swiss Alps Sunrise Hike',
    host: 'Hans Weber',
    hostAvatar: 'HW',
    location: 'Swiss Alps, Switzerland',
    category: 'Nature',
    duration: '6 hours',
    groupSize: '2–8',
    price: 120,
    rating: 4.99,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    tags: ['Hiking', 'Mountains', 'Sunrise'],
    description: 'Summit a breathtaking Alpine peak at dawn. Equipment and breakfast included.',
  },
  {
    id: '7',
    title: 'Kigali Coffee Plantation Tour',
    host: 'Claire Mukamana',
    hostAvatar: 'CM',
    location: 'Kigali, Rwanda',
    category: 'Food & Drink',
    duration: '4 hours',
    groupSize: '2–10',
    price: 45,
    rating: 4.91,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
    tags: ['Coffee', 'Farm', 'Culture'],
    description: "Visit Rwanda's world-famous coffee farms, learn the processing journey, and enjoy a cupping session.",
  },
  {
    id: '8',
    title: 'Cape Town Wine & Vineyard Tour',
    host: 'Amara Osei',
    hostAvatar: 'AO',
    location: 'Cape Town, South Africa',
    category: 'Food & Drink',
    duration: '5 hours',
    groupSize: '2–15',
    price: 88,
    rating: 4.93,
    reviews: 154,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    tags: ['Wine', 'Vineyard', 'Tasting'],
    description: 'Tour the stunning Winelands with tastings at three premier estates and a gourmet lunch.',
  },
];

const categories = ['All', 'Food & Drink', 'Nature', 'Arts', 'Sports', 'Music', 'Culture'];

export function Experiences() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('top-rated');

  const filtered = experiences
    .filter(e => {
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.location.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'top-rated') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.reviews - a.reviews;
    });

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#222222] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[#FF385C] text-sm font-semibold uppercase tracking-widest mb-3">Curated Local Experiences</p>
          <h1 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700 }}>
            Live Like a Local
          </h1>
          <p className="text-white/70 mb-8 max-w-xl mx-auto text-base">
            Book unique activities led by local experts. From food tours to mountain hikes — unforgettable memories await.
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-2xl p-2 max-w-xl mx-auto shadow-xl">
            <Search className="w-5 h-5 text-[#717171] ml-2 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search experiences by city or activity..."
              className="flex-1 text-[#222222] text-sm outline-none placeholder:text-[#AAAAAA]"
            />
            <button className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-[#EBEBEB]" style={{ background: '#F7F7F7' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-center gap-8 flex-wrap">
          {[
            { num: '500+', label: 'Unique experiences' },
            { num: '120+', label: 'Cities covered' },
            { num: '98%', label: 'Guest satisfaction' },
            { num: '4.9★', label: 'Average rating' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.num}</p>
              <p className="text-[#717171] text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border"
                style={{
                  background: activeCategory === cat ? '#FF385C' : 'white',
                  color: activeCategory === cat ? 'white' : '#484848',
                  borderColor: activeCategory === cat ? '#FF385C' : '#DDDDDD',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-[#DDDDDD] rounded-xl px-3 py-2 bg-white shrink-0">
            <Filter className="w-4 h-4 text-[#717171]" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm text-[#222222] outline-none bg-transparent cursor-pointer">
              <option value="top-rated">Top Rated</option>
              <option value="most-reviewed">Most Reviewed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <p className="text-sm text-[#717171] shrink-0">{filtered.length} experiences</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(exp => (
            <div key={exp.id} className="group bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.95)', color: '#484848' }}>
                    {exp.category}
                  </span>
                </div>
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#FF385C] text-base leading-none">♡</span>
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">{exp.hostAvatar}</div>
                  <span className="text-[#717171] text-xs">Hosted by {exp.host}</span>
                </div>

                <h3 className="text-[#222222] font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{exp.title}</h3>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 text-xs text-[#717171]">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exp.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{exp.groupSize} guests</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#222222] font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>${exp.price}</span>
                    <span className="text-[#717171] text-xs"> / person</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                    <span className="text-[#222222] font-semibold text-sm">{exp.rating}</span>
                    <span className="text-[#717171] text-xs">({exp.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl p-12 text-center" style={{ background: '#FF385C' }}>
          <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Host Your Own Experience</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">Share your passion, culture, or expertise with travelers from around the world. Earn extra income doing what you love.</p>
          <Link to="/host/dashboard" className="inline-flex items-center gap-2 bg-white text-[#FF385C] font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors">
            Become an Experience Host <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer link back */}
      <footer className="py-8 border-t border-[#EBEBEB] text-center">
        <p className="text-[#717171] text-sm">
          Looking for places to stay?{' '}
          <Link to="/listings" className="text-[#FF385C] font-semibold hover:underline">
            Browse Properties →
          </Link>
        </p>
      </footer>
    </div>
  );
}