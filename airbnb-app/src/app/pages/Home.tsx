import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, ArrowRight, ArrowLeft,
  Heart, CalendarDays,
  Home as HomeIcon, Waves, TreePine, Building2,
  ChevronDown, Phone, Mail, Instagram, Twitter, Facebook,
  Globe, MessageCircle, Bookmark,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSearch } from '../components/shared/HeroSearch';
import { useAllReviews } from '../../features/reviews/hooks';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useListings } from '../../features/listings/hooks';

const HERO_MAIN      = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1080&q=80';
const TESTIMONIAL_BG = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80';

const FILTERS = ['All', 'Villas', 'Apartments', 'Cabins', 'Beachfront', 'City Stays'];

const FAQ_ITEMS = [
  {
    q: 'What Types Of Houses Are Available For Rent?',
    a: 'We offer a wide range of properties including apartments, villas, cabins, townhouses, and beachfront homes across 120+ cities worldwide.',
  },
  {
    q: 'What Is The Rental Application Process?',
    a: 'Simply search for your desired location and dates, browse available properties, select your preferred listing, and complete the booking form in minutes.',
  },
  {
    q: 'What Are Your Rental Rates?',
    a: 'Rental rates vary by property, location, and season. Prices start from $50/night for apartments and go higher for premium villas and beachfront properties.',
  },
  {
    q: 'What Are The Lease Terms?',
    a: 'We offer flexible bookings from a single night to extended stays. Long-term rentals of 30+ days are available at discounted rates.',
  },
  {
    q: 'How Can I Contact Customer Support?',
    a: 'Our support team is available 24/7 via email at support@stayease.com, by phone, or through the live chat feature on our website.',
  },
];

const STATIC_TESTIMONIALS = [
  {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using StayEase is that it has a more-or-less normal distribution of properties, making it look like the ideal travel partner.',
    author: 'Sarah Johnson',
    role: 'Frequent Traveler',
  },
  {
    text: 'StayEase made our vacation so much easier. The properties are stunning and the booking process was completely seamless. We will definitely be using it again for our next trip around the world.',
    author: 'Michael Chen',
    role: 'Business Traveler',
  },
  {
    text: "I've tried many rental platforms but none compare to StayEase. The quality of properties and the level of customer service is truly unmatched. Highly recommend to anyone looking for a great stay.",
    author: 'Emily Williams',
    role: 'Travel Blogger',
  },
];

const ARTICLES = [
  {
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&h=600&fit=crop',
  },
  {
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&h=600&fit=crop',
    time: '9 hours ago',
    category: 'Events',
    title: 'Etiam in lorem malesuada, gravida felis in, pretium lacus.',
    author: {
      name: 'Alexander Kaminski',
      role: 'Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    },
  },
];

export function Home() {
  const [activeFilter, setActiveFilter]     = useState('All');
  const [openFaq, setOpenFaq]               = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [footerEmail, setFooterEmail]       = useState('');

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const navigate = useNavigate();

  const { data: listings = [], isLoading } = useListings();
  const { data: reviews = [] }             = useAllReviews();

  const filtered =
    activeFilter === 'All'
      ? listings.slice(0, 8)
      : listings
          .filter(
            p =>
              p.type?.toLowerCase().includes(activeFilter.toLowerCase()) ||
              p.category?.toLowerCase().includes(activeFilter.toLowerCase()),
          )
          .slice(0, 8);

  const testimonials =
    (reviews as any[]).length >= 1
      ? (reviews as any[]).slice(0, 3).map((t: any) => ({
          text:   t.comment || t.body || 'Great stay!',
          author: t.user?.name ?? t.user?.email ?? 'Guest',
          role:   'Verified Guest',
        }))
      : STATIC_TESTIMONIALS;

  const prevTestimonial = () =>
    setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const nextTestimonial = () =>
    setTestimonialIdx(i => (i + 1) % testimonials.length);
  const current = testimonials[testimonialIdx];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif", color: '#1C1C1E' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center" style={{ minHeight: '600px', zIndex: 1 }}>
        <div className="absolute inset-0 overflow-hidden">
          <img src={HERO_MAIN} alt="Hero" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.65) 100%)' }}
          />
        </div>
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
                    <Link to={`/property/${p.id}`} className="block relative" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md text-white" style={{ background: '#FF5A5F' }}>
                          10% OFF
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-white" style={{ background: '#FF5A5F' }}>
                          ${Math.round(p.price * 0.1)} off · STAY10
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) { openLoginModal(); return; }
                            if (isInWishlist(p.id)) removeFromWishlist(p.id);
                            else addToWishlist(p.id);
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
                      <div
                        className="absolute -bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
                        style={{ background: '#FF5A5F' }}
                      >
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                    </Link>
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
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16" style={{ background: '#F8F7F4' }}>
        <div className="max-w-[1760px] mx-auto">
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#FF5A5F', marginBottom: '0.25rem' }}>
              Best Way
            </p>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1C1C1E', lineHeight: 1.15, marginBottom: '0.75rem' }}>
              Find Your Dream Place The Best Way
            </h2>
            <p style={{ color: '#6C6C70', fontSize: '1rem' }}>
              Discover exciting categories.{' '}
              <span style={{ color: '#FF5A5F', fontWeight: 600 }}>Find what you're looking for.</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5]">
            {[
              { num: '01/', Icon: MapPin,       desc: 'Input your location to start looking for landmarks.' },
              { num: '02/', Icon: CalendarDays, desc: 'Make an appointment at the place you want to visit.' },
              { num: '03/', Icon: HomeIcon,     desc: 'Visit the place and enjoy the experience.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-5 px-8 py-8 md:py-0 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-4">
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#1C1C1E' }}>
                    {step.num}
                  </span>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#FF5A5F' }}>
                    <step.Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                  </div>
                </div>
                <p className="font-semibold leading-snug" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1.05rem' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16" style={{ background: '#F2F1ED' }}>
        <div className="max-w-[1760px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <div>
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2.2rem', color: '#FF5A5F', marginBottom: '0.75rem' }}>
                FAQ
              </p>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#1C1C1E', lineHeight: 1.12, marginBottom: '1.75rem' }}>
                Frequently<br />Asked<br />Questions
              </h2>
              <p style={{ color: '#6C6C70', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: 380 }}>
                Our platform provides quality and useful tips and advice for travelers on how to evaluate properties and choose the best one for their needs, taking into account factors such as price, features and support.
              </p>
            </div>

            {/* Right: Accordion */}
            <div>
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    style={
                      isOpen
                        ? { border: '1.5px solid #8A9BD4', borderRadius: '4px', marginBottom: '2px', background: 'white' }
                        : { borderBottom: '1px solid #DDDDDD' }
                    }
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between py-5 px-4 text-left"
                    >
                      <span
                        className="font-semibold pr-4 text-sm"
                        style={{ color: '#1C1C1E', fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.q}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200"
                        style={{ background: '#FF5A5F', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5">
                        <p style={{ color: '#6C6C70', fontSize: '0.88rem', lineHeight: 1.75 }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 560 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={TESTIMONIAL_BG} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6 lg:px-16 text-center">
          <h2
            className="text-white mb-3"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.15, maxWidth: 700 }}
          >
            See What Our Clients Say<br />About Us
          </h2>
          <p className="mb-10 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Discover exciting categories.{' '}
            <span style={{ color: '#FF5A5F', fontWeight: 600 }}>Find what you're looking for.</span>
          </p>

          {/* Quote */}
          <div style={{ fontSize: '4rem', lineHeight: 0.8, color: 'white', fontFamily: 'Georgia, serif', opacity: 0.85, marginBottom: '1rem' }}>"</div>
          <p
            className="text-white mb-8"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.85, maxWidth: 820, fontWeight: 300 }}
          >
            {current.text}
          </p>
          <p className="text-white font-semibold text-base">{current.author}</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{current.role}</p>

          {/* Navigation */}
          <div className="flex items-center gap-5 mt-10">
            <button
              onClick={prevTestimonial}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIdx(idx)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: idx === testimonialIdx ? '24px' : '8px',
                    height: '8px',
                    background: idx === testimonialIdx ? '#FF5A5F' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ── LATEST ARTICLES ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16" style={{ background: '#F8F7F4' }}>
        <div className="max-w-[1760px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#FF5A5F', marginBottom: '0.35rem' }}>
              Our Latest Articles
            </p>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1C1C1E', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              Discover Our Latest News<br />And Articles
            </h2>
            <p style={{ color: '#6C6C70', fontSize: '1rem' }}>
              Discover exciting categories.{' '}
              <span style={{ color: '#FF5A5F', fontWeight: 600 }}>Find what you're looking for.</span>
            </p>
          </div>

          {/* 3-column grid: image | image | text */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden rounded-2xl shadow-md">
            {/* Image 1 */}
            <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
              <img src={ARTICLES[0].img} alt="Article" className="w-full h-full object-cover" style={{ minHeight: 340 }} />
              <button
                className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF1F3] transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark className="w-4 h-4" style={{ color: '#1C1C1E' }} />
              </button>
            </div>

            {/* Image 2 */}
            <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
              <img src={ARTICLES[1].img} alt="Article" className="w-full h-full object-cover" style={{ minHeight: 340 }} />
              <button
                className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF1F3] transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark className="w-4 h-4" style={{ color: '#1C1C1E' }} />
              </button>
            </div>

            {/* Text card */}
            <div className="bg-white flex flex-col justify-center px-8 py-10">
              <div className="flex items-center gap-3 mb-5">
                <span style={{ color: '#8E8E93', fontSize: '0.82rem' }}>{ARTICLES[1].time}</span>
                <span className="w-px h-4 bg-[#E5E5E5]" />
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded"
                  style={{ border: '1.5px solid #FF5A5F', color: '#FF5A5F' }}
                >
                  {ARTICLES[1].category}
                </span>
              </div>
              <h3
                className="mb-8 leading-snug"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#1C1C1E' }}
              >
                {ARTICLES[1].title}
              </h3>
              <div className="flex items-center gap-3 pt-5 border-t border-[#F2F2F2]">
                <img src={ARTICLES[1].author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-[#8E8E93]">
                    <span style={{ fontStyle: 'italic' }}>By</span>{' '}
                    <span className="font-semibold text-[#1C1C1E]">{ARTICLES[1].author.name}</span>
                  </p>
                  <p className="text-xs text-[#8E8E93] mt-0.5">{ARTICLES[1].author.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer id="contact" className="py-16 px-6 lg:px-16" style={{ background: '#141423' }}>
        <div className="max-w-[1760px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Col 1 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Get In Touch</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Join our newsletter and receive the best property listings of the week, right in your inbox.
              </p>
              <div
                className="rounded-xl p-4 mb-6"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Join our Whatsapp:</p>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <a href="https://wa.me/250788959375" target="_blank" rel="noreferrer" className="text-white font-semibold text-sm underline">
                    +250 788 959 375
                  </a>
                </div>
              </div>
              <p className="font-semibold text-sm text-white mb-1">
                Want to join StayEase?<br />Write us !
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>support@stayease.com</p>
            </div>

            {/* Col 2 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Stay Connect</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Kigali Innovation City, Kigali, Rwanda KN 5 Rd
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <a href="tel:+250788959375" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    +250 788 959 375
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <a href="mailto:support@stayease.com" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    support@stayease.com
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Get In Touch</h3>
              <div className="flex gap-2 mb-8">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={e => setFooterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 rounded-full px-5 py-3 text-sm outline-none placeholder:text-white/30"
                  style={{ background: 'rgba(255,255,255,0.09)', color: 'white', border: '1px solid rgba(255,255,255,0.14)' }}
                />
                <button
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: '#FF5A5F' }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="font-semibold text-sm text-white mb-4">Follow the location</p>
              <div className="flex gap-3">
                {[Instagram, Twitter, Globe, Facebook, MessageCircle].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:border-[#FF5A5F]"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FF5A5F' }}>
                <span className="text-white font-extrabold text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
              </div>
              <span className="font-extrabold text-base text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Stay<span style={{ color: '#FF5A5F' }}>Ease</span>
              </span>
            </Link>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>© 2026 StayEase Inc. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
