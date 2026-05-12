import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, Shield, Check, MapPin, Star, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { properties } from '../../data/mockData';
import { Navbar } from '../components/layout/Navbar';
import { ConfirmModal } from '../components/shared/ConfirmModal';

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icons: ['VISA', 'MC', 'AMEX'] },
  { id: 'paypal', label: 'PayPal', icons: ['PP'] },
  { id: 'bank', label: 'Bank Transfer', icons: ['BANK'] },
];

export function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id) || properties[0];
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const nights = 5;
  const subtotal = property.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee + taxes;

  const formatCard = (val: string) => {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    toast.success('Payment successful! Booking confirmed.');
    setTimeout(() => navigate('/user/dashboard'), 3000);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" strokeWidth={2.5} />
          </div>
          <h1 className="text-[#222222] mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Booking Confirmed! </h1>
          <p className="text-[#717171] mb-2">Your reservation at <strong className="text-[#222222]">{property.title}</strong> has been confirmed.</p>
          <p className="text-[#717171] text-sm mb-8">A confirmation email has been sent to your email address. Redirecting to your dashboard...</p>
          <Link to="/user/dashboard" className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-8 py-4 rounded-xl font-semibold">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#717171] hover:text-[#222222] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-[#DDDDDD]">|</span>
          <h1 className="text-[#222222]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}>
            Complete your booking
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Payment Form */}
          <div className="space-y-6">
            {/* Trip Details */}
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Your Trip Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#717171] text-xs font-semibold uppercase tracking-wide mb-2">Check-in</label>
                  <input type="date" defaultValue="2026-05-15" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                </div>
                <div>
                  <label className="block text-[#717171] text-xs font-semibold uppercase tracking-wide mb-2">Check-out</label>
                  <input type="date" defaultValue="2026-05-20" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                </div>
                <div>
                  <label className="block text-[#717171] text-xs font-semibold uppercase tracking-wide mb-2">Guests</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#717171] text-xs font-semibold uppercase tracking-wide mb-2">Duration</label>
                  <div className="px-4 py-3 rounded-xl border border-[#DDDDDD] bg-[#F7F7F7] text-[#222222] text-sm">
                    {nights} nights
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Method</h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className="flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: paymentMethod === method.id ? '#FF385C' : '#EBEBEB',
                      background: paymentMethod === method.id ? '#FFF1F3' : 'white'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'border-[#FF385C]' : 'border-[#DDDDDD]'}`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#FF385C] rounded-full" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#717171]" />
                        <span className="text-[#222222] font-medium text-sm">{method.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {method.icons.map((icon, i) => (
                        <span key={i} className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#484848]">{icon}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        value={cardNum}
                        onChange={e => setCardNum(formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Cardholder Name</label>
                    <input
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="Name as on card"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors placeholder:text-[#AAAAAA]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Expiry Date</label>
                      <input
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors placeholder:text-[#AAAAAA]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">CVV</label>
                      <input
                        value={cvv}
                        onChange={e => setCvv(e.target.value.slice(0, 4))}
                        placeholder="•••"
                        type="password"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors placeholder:text-[#AAAAAA]"
                      />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'paypal' && (
                <div className="text-center p-6 bg-[#F7F7F7] rounded-xl">
                  <p className="text-[#717171] text-sm mb-3">You'll be redirected to PayPal to complete payment securely.</p>
                  <div className="text-2xl font-bold" style={{ color: '#003087' }}>PayPal</div>
                </div>
              )}
              {paymentMethod === 'bank' && (
                <div className="p-5 bg-[#F7F7F7] rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#717171]">Bank Name</span><span className="text-[#222222] font-semibold">StayEase Bank</span></div>
                  <div className="flex justify-between"><span className="text-[#717171]">Account Name</span><span className="text-[#222222] font-semibold">StayEase Ltd.</span></div>
                  <div className="flex justify-between"><span className="text-[#717171]">Account Number</span><span className="text-[#222222] font-semibold">0012-3456-7890</span></div>
                  <div className="flex justify-between"><span className="text-[#717171]">Reference</span><span className="text-[#FF385C] font-semibold">BK-{id?.toUpperCase()}-{Date.now().toString().slice(-6)}</span></div>
                </div>
              )}
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200" style={{ background: '#f0fdf4' }}>
              <Shield className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-700 text-sm">
                <span className="font-semibold">Secure checkout.</span> Your payment is protected with 256-bit SSL encryption.
              </p>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden sticky top-24">
              {/* Property Card */}
              <div className="relative">
                <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{property.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-white/80 text-sm">{property.location}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-sm font-semibold">{property.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Booking Summary</h2>

                <div className="space-y-3 mb-5">
                  {[
                    { label: `$${property.price} × ${nights} nights`, value: `$${subtotal}` },
                    { label: 'Service fee (12%)', value: `$${serviceFee}` },
                    { label: 'Taxes & fees (8%)', value: `$${taxes}` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#717171]">{item.label}</span>
                      <span className="text-[#222222] font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#EBEBEB] pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#222222] font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Total</span>
                    <span className="text-[#222222] font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>${total}</span>
                  </div>
                </div>

                {/* What's included */}
                <div className="space-y-2 mb-6">
                  {[
                    'Free cancellation up to 48hrs before check-in',
                    'Instant booking confirmation',
                    'Host contact information included',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#717171]">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Lock className="w-4 h-4" />
                  Confirm & Pay ${total}
                </button>

                <p className="text-center text-[#717171] text-xs mt-3">
                  By confirming, you agree to our{' '}
                  <a href="#" className="text-[#FF385C] hover:underline">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirm}
        title="Confirm Payment"
        message={`You're about to pay $${total} for ${nights} nights at ${property.title}. This payment will be processed immediately.`}
        confirmText={`Pay $${total}`}
        cancelText="Review details"
        type="info"
      />
    </div>
  );
}