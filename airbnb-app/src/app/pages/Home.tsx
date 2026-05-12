import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search, MapPin, Star, ArrowRight,
  Heart, CalendarDays,
  Home as HomeIcon, Waves, TreePine, Building2,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSearch } from '../components/shared/HeroSearch';
import { testimonials } from '../../data/mockData';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../../features/listings/hooks';


const HERO_MAIN  = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80";
const TOKYO_IMG  = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1080&q=80";
const BARCELONA_IMG = "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1080&q=80";
const CAPETOWN_IMG  = "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1080&q=80";
const ZANZIBAR_IMG  = "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1080&q=80";
const HOST_IMG   = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1080&q=80";

// ── Type filter tabs ──────────────────────────────────────────────────────────
const FILTERS = ['All', 'Villas', 'Apartments', 'Cabins', 'Beachfront', 'City Stays'];

// ── Place collections ─────────────────────────────────────────────────────────
const PLACES = [
  { city: 'Tokyo',     country: 'Japan',          img: TOKYO_IMG,     count: '2,100+ places' },
  { city: 'Barcelona', country: 'Spain',           img: BARCELONA_IMG, count: '1,650+ places' },
  { city: 'Cape Town', country: 'South Africa',    img: CAPETOWN_IMG,  count: '780+ places'   },
  { city: 'Zanzibar',  country: 'Tanzania',        img: ZANZIBAR_IMG,  count: '540+ places'   },
];


export function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { data: listings = [], isLoading } = useListings();

  const filtered = activeFilter === 'All'
    ? listings.slice(0, 8)
    : listings.filter(p =>
        p.type?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        p.category?.toLowerCase().includes(activeFilter.toLowerCase())
      ).slice(0, 8);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif", color: '#1C1C1E' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center" style={{ minHeight: '600px', zIndex: 1 }}>
        {/* Background image + dark overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={HERO_MAIN} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.65) 100%)' }} />
        </div>

        {/* Centered content */}
        <div className="relative z-10 w-full max-w-[1760px] mx-auto px-6 lg:px-16 py-20 pb-32 text-center">
          <h1
            className="text-white mb-5"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            We're Here To Help You<br />
            <span style={{ color: '#FF5A5F', fontStyle: 'italic', textDecoration: 'underline', textDecorationColor: '#FF5A5F', textUnderlineOffset: '6px' }}>
              Navigate
            </span>{' '}
            While Traveling
          </h1>
          <p className="text-white/75 mb-10 mx-auto" style={{ fontSize: '1.1rem', maxWidth: 560 }}>
            You'll get comprehensive results based on the provided location.
          </p>

          {/* Wide search bar */}
          <div className="max-w-4xl mx-auto">
            <HeroSearch wide />
          </div>
        </div>
      </section>

      {/* ── CATEGORY INTRO ───────────────────────────────────────────────────── */}
      <section className="pt-14 pb-2 px-6 lg:px-16 text-center">
        <div className="max-w-[1760px] mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#FF5A5F', marginBottom: '0.25rem' }}>
            Places
          </p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1C1C1E', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Discover Your Favourite Place
          </h2>
          <p style={{ color: '#6C6C70', fontSize: '1rem' }}>
            Discover exciting categories.{' '}
            <span style={{ color: '#FF5A5F', fontWeight: 600 }}>Find what you're looking for.</span>
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ──────────────────────────────────────────────────────── */}
      <section className="border-b mt-4" style={{ borderColor: '#EBEBEB' }}>
        <div className="max-w-[1760px] mx-auto px-6 lg:px-16">
          <div className="flex items-center gap-2 overflow-x-auto py-4" style={{ scrollbarWidth: 'none' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-150"
                style={
                  activeFilter === f
                    ? { background: '#1C1C1E', color: '#FFFFFF' }
                    : { background: 'transparent', color: '#6C6C70', border: '1.5px solid #E5E5E5' }
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTY GRID ────────────────────────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-16">
        <div className="max-w-[1760px] mx-auto">
          <div className="mb-8">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.6rem', color: '#1C1C1E' }}>
              {activeFilter === 'All' ? 'Featured Properties' : activeFilter}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#F0F0F0] rounded-2xl mb-3" style={{ aspectRatio: '4/3' }} />
                  <div className="h-4 bg-[#F0F0F0] rounded mb-2 w-3/4" />
                  <div className="h-3 bg-[#F0F0F0] rounded mb-2 w-1/2" />
                  <div className="h-3 bg-[#F0F0F0] rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16" style={{ color: '#8E8E93' }}>No listings found for this filter.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(p => {
                const CategoryIcon =
                  p.category === 'Cabin' ? TreePine :
                  p.category === 'Beachfront' ? Waves :
                  p.category === 'Villa' ? HomeIcon :
                  Building2;
                return (
                <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Image area */}
                  <Link to={`/property/${p.id}`} className="block relative" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    {/* Discount badge top-left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md text-white" style={{ background: '#FF5A5F' }}>
                        10% OFF
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-white" style={{ background: '#FF5A5F' }}>
                        ${Math.round(p.price * 0.1)} off · STAY10
                      </span>
                    </div>

                    {/* Action buttons top-right */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isAuthenticated) { navigate('/signin'); return; }
                          if (isInWishlist(p.id)) { removeFromWishlist(p.id); } else { addToWishlist(p.id); }
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all shadow"
                        style={{ background: isInWishlist(p.id) ? '#FF5A5F' : 'rgba(255,255,255,0.92)' }}
                      >
                        <Heart className="w-4 h-4" style={{ fill: isInWishlist(p.id) ? 'white' : 'none', color: isInWishlist(p.id) ? 'white' : '#1C1C1E', strokeWidth: 1.8 }} />
                      </button>
                      <Link
                        to={`/property/${p.id}`}
                        onClick={e => e.stopPropagation()}
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow"
                        style={{ background: 'rgba(255,255,255,0.92)' }}
                      >
                        <Search className="w-4 h-4" style={{ color: '#1C1C1E' }} />
                      </Link>
                    </div>

                    {/* Category icon circle — bottom-right */}
                    <div
                      className="absolute -bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
                      style={{ background: '#FF5A5F' }}
                    >
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                  </Link>

                  {/* Card body */}
                  <div className="px-4 pt-7 pb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-4 h-4" style={{ fill: '#FF5A5F', color: '#FF5A5F' }} />
                      <span className="text-sm font-bold" style={{ color: '#FF5A5F' }}>({p.rating})</span>
                      <span className="text-sm" style={{ color: '#8E8E93' }}>{p.reviews.toLocaleString()} reviews</span>
                    </div>
                    <p className="font-semibold text-base line-clamp-1 mb-0.5" style={{ color: '#1C1C1E', fontFamily: "'Poppins', sans-serif" }}>
                      {p.title}
                    </p>
                    <p className="text-xs" style={{ color: '#8E8E93' }}>
                      <span className="font-bold" style={{ color: '#1C1C1E' }}>${p.price}</span> / night
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:bg-[#1C1C1E] hover:text-white hover:border-[#1C1C1E]"
              style={{ borderColor: '#1C1C1E', color: '#1C1C1E' }}
            >
              View all properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16" style={{ background: '#F8F7F4' }}>
        <div className="max-w-[1760px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#FF5A5F', marginBottom: '0.25rem' }}>
              Best Way
            </p>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: '#1C1C1E',
                lineHeight: 1.15,
                marginBottom: '0.75rem',
              }}
            >
              Find Your Dream Place The Best Way
            </h2>
            <p style={{ color: '#6C6C70', fontSize: '1rem' }}>
              Discover exciting categories.{' '}
              <span style={{ color: '#FF5A5F', fontWeight: 600 }}>Find what you're looking for.</span>
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5]">
            {[
              {
                num: '01/',
                Icon: MapPin,
                desc: 'Input your location to start looking for landmarks.',
              },
              {
                num: '02/',
                Icon: CalendarDays,
                desc: 'Make an appointment at the place you want to visit.',
              },
              {
                num: '03/',
                Icon: HomeIcon,
                desc: 'Visit the place and enjoy the experience.',
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-5 px-8 py-8 md:py-0 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-4">
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#1C1C1E',
                    }}
                  >
                    {step.num}
                  </span>
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: '#FF5A5F' }}
                  >
                    <step.Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                  </div>
                </div>
                <p
                  className="font-semibold leading-snug"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1.05rem' }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-[1760px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: '#FF5A5F' }}>Explore the globe</p>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.8rem', color: '#1C1C1E' }}>
                Trending destinations
              </h2>
            </div>
            <Link to="/listings" className="hidden md:flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#FF5A5F' }}>
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {PLACES.map((pl, i) => (
              <Link
                key={i}
                to="/listings"
                className="group relative block rounded-2xl overflow-hidden"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={pl.img}
                  alt={pl.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 55%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-bold" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>{pl.city}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{pl.country}</p>
                  <p className="text-xs mt-2 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{pl.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIST YOUR SPACE ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-16" style={{ background: '#F8F7F4' }}>
        <div className="max-w-[1760px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={HOST_IMG} alt="Hosting" className="w-full h-full object-cover" />
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: '#FF5A5F' }}>Earn with your space</p>
              <h2
                className="mb-5"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  lineHeight: 1.15,
                  color: '#1C1C1E',
                }}
              >
                Your property,<br />your income stream.
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: '#6C6C70', fontSize: '1rem', maxWidth: 420 }}>
                List for free and connect with thousands of vetted travellers. You control the pricing, schedule, and house rules — we handle everything else.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { val: '$1,900', lab: 'Avg. monthly income' },
                  { val: '48 hrs', lab: 'Time to first booking' },
                  { val: '0%',    lab: 'Listing fee' },
                  { val: '96%',   lab: 'Host satisfaction' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ background: '#FFFFFF', border: '1.5px solid #E5E5E5' }}
                  >
                    <p
                      className="font-extrabold mb-0.5"
                      style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', color: '#1C1C1E' }}
                    >
                      {s.val}
                    </p>
                    <p className="text-xs" style={{ color: '#8E8E93' }}>{s.lab}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/host/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: '#1C1C1E' }}
              >
                Start listing your space <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-16" style={{ background: '#F8F7F4' }}>
        <div className="max-w-[1760px] mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: '#FF5A5F' }}>What guests say</p>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.8rem', color: '#1C1C1E' }}>
              Stories from people who stayed.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-7"
                style={{ border: '1.5px solid #EBEBEB' }}
              >
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ fill: '#F5A623', color: '#F5A623' }} />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: '#3C3C3E', fontStyle: 'italic', lineHeight: 1.75 }}
                >
                  "{t.comment}"
                </p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid #F2F2F2' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: '#1C1C1E' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#8E8E93' }}>{t.location} · {t.property}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="pt-14 pb-8 px-6 lg:px-16 bg-white border-t border-[#EBEBEB]" id="contact">
        <div className="max-w-[1760px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#FF5A5F' }}
                >
                  <span className="text-white font-extrabold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
                </div>
                <span className="font-extrabold text-lg" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>
                  Stay<span style={{ color: '#FF5A5F' }}>Ease</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#8E8E93' }}>
                Curated properties across 120+ cities. Built for people who believe where you stay shapes how you travel.
              </p>
              <div className="flex gap-2.5">
                {['📷', '🐦', '📘', '💼'].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#EBEBEB] text-[#8E8E93] hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-colors text-lg"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#1C1C1E' }}>Explore</p>
              <ul className="space-y-3">
                {['All Listings', 'Beachfront Stays', 'Mountain Lodges', 'Urban Apartments', 'Private Villas'].map((item, i) => (
                  <li key={i}>
                    <Link to="/listings" className="text-sm text-[#6C6C70] hover:text-[#FF5A5F] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#1C1C1E' }}>Company</p>
              <ul className="space-y-3">
                {['About Us', 'Work With Us', 'Newsroom', 'Travel Journal', 'Affiliates'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-[#6C6C70] hover:text-[#FF5A5F] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#1C1C1E' }}>Contact</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-sm text-[#6C6C70]">
                  <span className="w-4 h-4 shrink-0 text-[#FF5A5F] text-center">✉</span>
                  support@stayease.com
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#6C6C70]">
                  <span className="w-4 h-4 shrink-0 text-[#FF5A5F] text-center">📞</span>
                  +250 788 456 789
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#6C6C70]">
                  <MapPin className="w-4 h-4 shrink-0 text-[#FF5A5F]" />
                  Kigali Innovation City, Rwanda
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg px-3 py-2.5 text-sm outline-none text-[#1C1C1E] bg-[#F7F7F7] border border-[#E5E5E5] focus:border-[#FF5A5F] transition-colors"
                />
                <button
                  className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: '#FF5A5F' }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#EBEBEB]">
            <p className="text-xs text-[#8E8E93]">© 2026 StayEase Inc. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs text-[#8E8E93]">
              <a href="#" className="hover:text-[#1C1C1E] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1C1C1E] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#1C1C1E] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}