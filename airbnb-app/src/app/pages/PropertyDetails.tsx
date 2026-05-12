import { useParams, Link, useNavigate } from 'react-router';
import { Navbar } from '../components/layout/Navbar';
import { Star, Users, Bed, Bath, Wifi, Car, Wind, Utensils, MapPin, Share, Heart, ChevronLeft, Check, ArrowRight } from 'lucide-react';
import { useListing } from '../../features/listings/hooks';

export function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading, isError } = useListing(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[#F0F0F0] rounded w-1/3" />
            <div className="h-[460px] bg-[#F0F0F0] rounded-2xl" />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-6 bg-[#F0F0F0] rounded w-1/2" />
                <div className="h-4 bg-[#F0F0F0] rounded w-full" />
                <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
              </div>
              <div className="h-64 bg-[#F0F0F0] rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-[1760px] mx-auto px-6 lg:px-20 py-12">
          <h1 className="text-[#222222]">Property not found</h1>
          <Link to="/listings" className="text-[#FF385C] hover:underline mt-4 inline-block">← Back to listings</Link>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi, 'Kitchen': Utensils, 'Free parking': Car, 'Air conditioning': Wind,
    'Pool': Star, 'Beach access': Star, 'Ocean view': Star, 'City view': Star,
    'Garden': Star, 'Fireplace': Star, 'Mountain view': Star, 'Hot tub': Star,
    'Gym': Star, 'BBQ grill': Star,
  };

  const nights = 5;
  const subtotal = property.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">
        {/* Back + Title */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#717171] hover:text-[#222222] transition-colors text-sm mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to listings
        </button>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[#222222] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                <span className="font-semibold text-[#222222]">{property.rating}</span>
                <span className="text-[#717171]">({property.reviews} reviews)</span>
              </div>
              <span className="text-[#DDDDDD]">·</span>
              <div className="flex items-center gap-1 text-[#717171]">
                <MapPin className="w-4 h-4" />
                {property.location}
              </div>
              <span className="text-[#DDDDDD]">·</span>
              <span className="text-[#222222] font-medium">{property.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDDDDD] hover:bg-[#F7F7F7] transition-colors text-sm font-medium text-[#222222]">
              <Share className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DDDDDD] hover:bg-[#F7F7F7] transition-colors text-sm font-medium text-[#222222]">
              <Heart className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden h-[460px]">
          <div className="col-span-2 row-span-2">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" />
              {i === 3 && (
                <button className="absolute bottom-3 right-3 bg-white/90 text-[#222222] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white transition-colors">
                  Show all photos
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            {/* Host + Quick Info */}
            <div className="border-b border-[#EBEBEB] pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[#222222] font-semibold text-xl mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Hosted by {property.host}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-[#717171] text-sm">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{property.guests} guests</span>
                    <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" />{property.bedrooms} bedrooms</span>
                    <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" />{property.beds} beds</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" />{property.baths} baths</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {property.host.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="border-b border-[#EBEBEB] pb-6 mb-6">
              <div className="space-y-4">
                {[
                  { icon: Star, title: 'Superhost', desc: 'Experienced, highly-rated host committed to great stays.' },
                  { icon: Check, title: 'Self check-in', desc: 'Check yourself in with a lockbox.' },
                  { icon: MapPin, title: `${property.location}`, desc: 'Great location, loved by previous guests.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-[#222222] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#222222] font-semibold text-sm">{item.title}</p>
                      <p className="text-[#717171] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="border-b border-[#EBEBEB] pb-6 mb-6">
              <h3 className="text-[#222222] font-semibold text-lg mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>About this place</h3>
              <p className="text-[#717171] leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="border-b border-[#EBEBEB] pb-6 mb-6">
              <h3 className="text-[#222222] font-semibold text-lg mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F7] transition-colors">
                      <Icon className="w-5 h-5 text-[#222222] shrink-0" />
                      <span className="text-[#222222] text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Summary */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Star className="w-5 h-5 fill-[#FF385C] text-[#FF385C]" />
                <h3 className="text-[#222222] font-semibold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {property.rating} · {property.reviews} reviews
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Cleanliness', score: 4.9 },
                  { label: 'Communication', score: 5.0 },
                  { label: 'Check-in', score: 4.8 },
                  { label: 'Accuracy', score: 4.9 },
                  { label: 'Location', score: 4.7 },
                  { label: 'Value', score: 4.6 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[#717171] text-sm w-28 shrink-0">{item.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#EBEBEB]">
                      <div className="h-1.5 rounded-full bg-[#222222]" style={{ width: `${(item.score / 5) * 100}%` }} />
                    </div>
                    <span className="text-[#222222] font-semibold text-sm w-8 text-right shrink-0">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="border border-[#EBEBEB] rounded-2xl p-6 sticky top-24 shadow-lg">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-[#222222] font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>${property.price}</span>
                <span className="text-[#717171] text-sm">/ night</span>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                  <span className="text-sm font-semibold text-[#222222]">{property.rating}</span>
                </div>
              </div>

              <div className="border border-[#DDDDDD] rounded-xl mb-4 overflow-hidden">
                <div className="grid grid-cols-2 border-b border-[#DDDDDD]">
                  <div className="p-3 border-r border-[#DDDDDD]">
                    <p className="text-[#222222] text-xs font-semibold uppercase tracking-wide mb-1">CHECK-IN</p>
                    <input type="date" className="w-full text-[#717171] bg-transparent border-none outline-none text-sm" defaultValue="2026-05-15" />
                  </div>
                  <div className="p-3">
                    <p className="text-[#222222] text-xs font-semibold uppercase tracking-wide mb-1">CHECK-OUT</p>
                    <input type="date" className="w-full text-[#717171] bg-transparent border-none outline-none text-sm" defaultValue="2026-05-20" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[#222222] text-xs font-semibold uppercase tracking-wide mb-1">GUESTS</p>
                  <select className="w-full text-[#717171] bg-transparent border-none outline-none text-sm">
                    {[1, 2, 3, 4].map(n => <option key={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <Link to={`/checkout/${property.id}`} className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mb-3">
                Reserve Now <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[#717171] text-xs mb-4">You won't be charged yet</p>

              <div className="border-t border-[#EBEBEB] pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-[#717171]">
                  <span>${property.price} × {nights} nights</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#717171]">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-[#222222] pt-2 border-t border-[#EBEBEB]">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}