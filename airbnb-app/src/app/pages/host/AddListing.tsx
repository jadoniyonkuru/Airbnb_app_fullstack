import { useState, useCallback, memo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Upload, MapPin, DollarSign, Users, Bed, Bath, Check, ArrowRight, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useCreateListing } from '../../../features/listings/hooks';

const STEPS = ['Basic Info', 'Location', 'Details', 'Amenities', 'Photos', 'Pricing'];

const InputField = memo(function InputField({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-[#222222] text-sm font-semibold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors placeholder:text-[#AAAAAA]"
      />
    </div>
  );
});

export function AddListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'Apartment', location: '', address: '',
    guests: '2', bedrooms: '1', beds: '1', baths: '1',
    price: '', amenities: [] as string[], description: '',
  });

  const allAmenities = ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool', 'Gym', 'Washer', 'Dryer', 'TV', 'Fireplace', 'BBQ grill', 'Ocean view', 'Mountain view', 'Hot tub'];

  const toggleAmenity = useCallback((a: string) => setForm(prev => ({
    ...prev,
    amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
  })), []);

  const handleNext = () => {
    if (step === 0) {
      if (!form.title.trim()) {
        toast.error('Please enter a property title');
        return;
      }
      if (!form.description.trim()) {
        toast.error('Please enter a description');
        return;
      }
    } else if (step === 1) {
      if (!form.location.trim()) {
        toast.error('Please enter a city/location');
        return;
      }
      if (!form.address.trim()) {
        toast.error('Please enter a full address');
        return;
      }
    } else if (step === 3) {
      if (form.amenities.length === 0) {
        toast.error('Please select at least one amenity');
        return;
      }
    } else if (step === 5) {
      if (!form.price.trim()) {
        toast.error('Please enter a price per night');
        return;
      }
    }
    setStep(step + 1);
  };

  const { user } = useAuth();
  const createListingMutation = useCreateListing();
  const qc = useQueryClient();
  const [aiDescLoading, setAiDescLoading] = useState(false);

  const generateAIDescription = useCallback(async () => {
    if (!form.title.trim()) { toast.error('Enter a title first'); return; }
    setAiDescLoading(true);
    try {
      const res = await apiClient.post('/ai/describe', {
        title: form.title,
        type: form.type,
        location: form.location,
        amenities: form.amenities,
        tone: 'professional',
      });
      const desc = res.data?.description ?? '';
      if (desc) {
        setForm(p => ({ ...p, description: desc }));
        toast.success('Description generated!');
      }
    } catch {
      // Fallback: generate from title+type locally if endpoint not ready
      const fallback = `Experience the perfect ${form.type.toLowerCase()} in ${form.location || 'a prime location'}. ${form.title} offers a comfortable and memorable stay for up to ${form.guests} guests, complete with thoughtfully curated amenities for your ultimate comfort.`;
      setForm(p => ({ ...p, description: fallback }));
      toast.success('Description generated!');
    } finally {
      setAiDescLoading(false);
    }
  }, [form]);

  const [fileObjects, setFileObjects] = useState<File[]>([]);

  const handleSubmit = useCallback(() => {
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.address.trim() || !form.price.trim() || form.amenities.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const mapTypeToEnum = (t: string) => {
      const s = (t || '').toLowerCase();
      if (s.includes('villa')) return 'VILLA';
      if (s.includes('cabin')) return 'CABIN';
      if (s.includes('house') || s.includes('town') || s.includes('bungalow')) return 'HOUSE';
      return 'APARTMENT';
    };

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      pricePerNight: Number(form.price),
      guests: Number(form.guests),
      type: mapTypeToEnum(form.type || 'Apartment'),
      amenities: form.amenities,
    };

    createListingMutation.mutate(payload as any, {
      onSuccess: async (res: any) => {
        try {
          const listingId = res?.data?.id ?? res?.data?.data?.id ?? res?.id;
          if (listingId && fileObjects.length > 0) {
            const idStr = String(listingId);
            const formData = new FormData();
            fileObjects.slice(0, 5).forEach(f => formData.append('images', f));
            // No Content-Type override — Axios sets multipart/form-data + boundary automatically from FormData
            const resp = await apiClient.post(ENDPOINTS.LISTING(idStr) + '/photos', formData, { timeout: 60000 });
            // bust all listing queries so photos are visible immediately
            await qc.invalidateQueries({ queryKey: ['listings'] });
            // If some files failed, inform the user with details
            const failures = resp?.data?.failures ?? [];
            if (failures.length > 0) {
              const names = failures.map((f: any) => f.filename).join(', ');
              toast.warning(`Some photos failed to upload: ${names}. You can try again.`);
            }
          }
        } catch (err) {
          toast.warning('Listing created but photo upload failed. You can add photos later.');
        }
        toast.success('Listing launched successfully!', { duration: 1000 });
        navigate('/dashboard/listings');
      },
      onError: (err: any) => {
        const message = err?.message ?? 'Failed to publish listing';
        toast.error(message);
      }
    });
  }, [form, createListingMutation, navigate]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, location: e.target.value }));
  }, []);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, address: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);


  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    setFileObjects(prev => [...prev, ...files]);
    // clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Add Listings</h1>
        <p className="text-[#717171] text-sm">Fill in the details to list your property on StayEase.</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{
                  background: i < step ? '#FF385C' : i === step ? '#FF385C' : '#F7F7F7',
                  color: i <= step ? 'white' : '#AAAAAA'
                }}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium" style={{ color: i === step ? '#FF385C' : i < step ? '#222222' : '#AAAAAA' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#DDDDDD] ml-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 mb-6 max-w-2xl">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Basic Information</h2>
            <InputField label="Property Title" value={form.title} onChange={handleTitleChange} placeholder="e.g., Modern Apartment in City Center" />
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Property Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Apartment', 'Villa', 'Studio', 'Cabin', 'Townhouse', 'House', 'Bungalow', 'Loft', 'Penthouse', 'Cottage'].map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} className="py-2.5 rounded-xl border-2 text-sm font-medium transition-all" style={{
                    borderColor: form.type === t ? '#FF385C' : '#DDDDDD',
                    background: form.type === t ? '#FFF1F3' : 'white',
                    color: form.type === t ? '#FF385C' : '#717171'
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#222222] text-sm font-semibold">Description</label>
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={aiDescLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#FF385C] hover:underline disabled:opacity-50"
                >
                  {aiDescLoading
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Sparkles className="w-3.5 h-3.5" />}
                  AI Generate
                </button>
              </div>
              <textarea value={form.description} onChange={handleDescriptionChange} placeholder="Describe what makes your place special..." className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none h-32 placeholder:text-[#AAAAAA]" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Location</h2>
            <InputField label="City" value={form.location} onChange={handleLocationChange} placeholder="e.g., Kigali, Rwanda" />
            <InputField label="Full Address" value={form.address} onChange={handleAddressChange} placeholder="Street address" />
            <div className="h-48 rounded-xl flex items-center justify-center" style={{ background: '#F7F7F7', border: '2px dashed #DDDDDD' }}>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#AAAAAA] mx-auto mb-2" />
                <p className="text-[#717171] text-sm">Map integration available</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Property Details</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Max Guests', key: 'guests', icon: Users },
                { label: 'Bedrooms', key: 'bedrooms', icon: Bed },
                { label: 'Beds', key: 'beds', icon: Bed },
                { label: 'Bathrooms', key: 'baths', icon: Bath },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-[#222222] text-sm font-semibold mb-2 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#FF385C]" /> {label}
                  </label>
                  <div className="flex items-center border border-[#DDDDDD] rounded-xl overflow-hidden">
                    <button onClick={() => setForm(p => ({ ...p, [key]: String(Math.max(1, Number((p as any)[key]) - 1)) }))} className="px-4 py-3 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-bold transition-colors">-</button>
                    <span className="flex-1 text-center text-[#222222] font-semibold">{(form as any)[key]}</span>
                    <button onClick={() => setForm(p => ({ ...p, [key]: String(Number((p as any)[key]) + 1) }))} className="px-4 py-3 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-bold transition-colors">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allAmenities.map(a => (
                <button key={a} onClick={() => toggleAmenity(a)} className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all text-left" style={{
                  borderColor: form.amenities.includes(a) ? '#FF385C' : '#DDDDDD',
                  background: form.amenities.includes(a) ? '#FFF1F3' : 'white',
                  color: form.amenities.includes(a) ? '#FF385C' : '#717171'
                }}>
                  {form.amenities.includes(a) && <Check className="w-4 h-4 shrink-0" />}
                  {!form.amenities.includes(a) && <span className="w-4 h-4 rounded-full border-2 border-[#DDDDDD] shrink-0" />}
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Property Photos</h2>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
              className="border-2 border-dashed border-[#DDDDDD] rounded-2xl p-6 text-center hover:border-[#FF385C] hover:bg-[#FFF8F9] transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-[#FFF1F3] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FFE4E8] transition-colors">
                <Upload className="w-8 h-8 text-[#FF385C]" />
              </div>
              <p className="text-[#222222] font-semibold mb-1">Drop photos here or click to upload</p>
              <p className="text-[#717171] text-sm">JPG, PNG up to 20MB. Add at least 5 photos.</p>
              <input ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" type="file" className="hidden" />

              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previews.map((p, i) => (
                    <img key={i} src={p} alt={`preview-${i}`} className="w-full h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Set Your Price</h2>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Price per Night (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="85" className="w-full pl-10 pr-4 py-4 rounded-xl border border-[#DDDDDD] text-[#222222] text-lg font-bold outline-none focus:border-[#FF385C] transition-colors placeholder:text-[#AAAAAA]" />
              </div>
              <p className="text-[#717171] text-xs mt-1.5">Similar properties in your area charge $65–$150/night</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: '#F7F7F7' }}>
              <p className="text-[#222222] font-semibold text-sm mb-3">Estimated monthly earnings</p>
              <p className="text-[#FF385C] font-bold text-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${form.price ? (Number(form.price) * 20).toLocaleString() : '—'}
              </p>
              <p className="text-[#717171] text-xs mt-1">Based on 20 nights/month average occupancy</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-2xl">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-2 border border-[#DDDDDD] px-6 py-3 rounded-xl text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={handleNext} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            <Check className="w-4 h-4" />
            Launch Listing
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handleSubmit}
        title="Ready to go live?"
        message="Your listing will be visible to guests straight away. You can edit the details anytime."
        confirmText="Launch now"
        cancelText="Not yet"
        type="info"
      />
    </div>
  );
}
