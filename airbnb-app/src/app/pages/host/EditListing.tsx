import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Check, Loader2, Save, Upload, Trash2 } from 'lucide-react';
import { useListing, useUpdateListing } from '../../../features/listings/hooks';
import { apiClient } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import type { ListingPhoto } from '../../../features/listings/types';

const AMENITIES_LIST = [
  'WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Pool',
  'Gym', 'Washer', 'Dryer', 'TV', 'Fireplace', 'BBQ grill',
  'Ocean view', 'Mountain view', 'Hot tub',
];

export function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: listing, isLoading } = useListing(id!);
  const updateMutation = useUpdateListing();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    guests: '2',
    amenities: [] as string[],
  });

  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        pricePerNight: String(listing.price),
        guests: String(listing.guests),
        amenities: listing.amenities ?? [],
      });
      setPhotos(listing.photos ?? []);
    }
  }, [listing]);

  const toggleAmenity = (a: string) =>
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim() || !form.pricePerNight.trim()) {
      toast.error('Title, location and price are required.');
      return;
    }
    updateMutation.mutate(
      {
        id: id!,
        data: {
          title: form.title,
          description: form.description,
          location: form.location,
          pricePerNight: Number(form.pricePerNight),
          guests: Number(form.guests),
          amenities: form.amenities,
        },
      },
      {
        onSuccess: () => {
          toast.success('Changes saved!', { duration: 1000 });
          navigate('/dashboard/listings');
        },
      },
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;

    if (photos.length + files.length > 5) {
      toast.error(`Max 5 photos. You have ${photos.length}, trying to add ${files.length}.`);
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));
      const { data } = await apiClient.post(`/listings/${id}/photos`, formData);
      setPhotos(prev => [...prev, ...data.photos]);
      qc.invalidateQueries({ queryKey: queryKeys.listing(id) });
      toast.success(`${data.photos.length} photo(s) added!`, { duration: 1500 });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Photo upload failed.';
      toast.error(msg);
    } finally {
      setUploadingPhotos(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handlePhotoDelete = async (photoId: string) => {
    if (!id) return;
    setDeletingPhotoId(photoId);
    try {
      await apiClient.delete(`/listings/${id}/photos/${photoId}`);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      qc.invalidateQueries({ queryKey: queryKeys.listing(id) });
      toast.success('Photo removed.', { duration: 1000 });
    } catch {
      toast.error('Failed to remove photo.');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF385C]" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/listings')}
          className="w-9 h-9 rounded-xl border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#717171]" />
        </button>
        <div>
          <h1
            className="text-[#222222]"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}
          >
            Edit Listing
          </h1>
          <p className="text-[#717171] text-sm">Update your property details below.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Photos Section */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold text-[#222222]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Photos
            </h2>
            <span className="text-xs text-[#717171]">{photos.length} / 5</span>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-video rounded-xl overflow-hidden bg-[#F7F7F7]">
                  <img src={photo.url} alt="Listing" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handlePhotoDelete(photo.id)}
                    disabled={deletingPhotoId === photo.id}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    {deletingPhotoId === photo.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF385C]" />
                      : <Trash2 className="w-3.5 h-3.5 text-[#FF385C]" />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length === 0 && (
            <p className="text-sm text-[#AAAAAA] text-center py-4 mb-2">No photos yet. Add some to attract guests.</p>
          )}

          {photos.length < 5 && (
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhotos}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#DDDDDD] hover:border-[#FF385C] hover:bg-[#FFF1F3] text-sm text-[#717171] hover:text-[#FF385C] transition-all w-full justify-center disabled:opacity-50"
            >
              {uploadingPhotos
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                : <><Upload className="w-4 h-4" /> Add Photos ({5 - photos.length} remaining)</>
              }
            </button>
          )}

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-5">
          <h2
            className="font-semibold text-[#222222]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Basic Info
          </h2>
          <div>
            <label className="block text-sm font-semibold text-[#222222] mb-2">Property Title</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors"
              placeholder="e.g. Modern Apartment in City Centre"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#222222] mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none"
              placeholder="Describe what makes your place special..."
            />
          </div>
        </div>

        {/* Location & Pricing */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 space-y-5">
          <h2
            className="font-semibold text-[#222222]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Location &amp; Pricing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">City / Location</label>
              <input
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors"
                placeholder="e.g. Kigali, Rwanda"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">Price per Night ($)</label>
              <input
                type="number"
                value={form.pricePerNight}
                onChange={e => setForm(p => ({ ...p, pricePerNight: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors"
                placeholder="85"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#222222] mb-2">Max Guests</label>
            <div className="flex items-center border border-[#DDDDDD] rounded-xl overflow-hidden w-32">
              <button
                onClick={() => setForm(p => ({ ...p, guests: String(Math.max(1, Number(p.guests) - 1)) }))}
                className="px-4 py-3 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-bold transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-[#222222]">{form.guests}</span>
              <button
                onClick={() => setForm(p => ({ ...p, guests: String(Number(p.guests) + 1) }))}
                className="px-4 py-3 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2
            className="font-semibold text-[#222222] mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES_LIST.map(a => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all text-left"
                style={{
                  borderColor: form.amenities.includes(a) ? '#FF385C' : '#DDDDDD',
                  background: form.amenities.includes(a) ? '#FFF1F3' : 'white',
                  color: form.amenities.includes(a) ? '#FF385C' : '#717171',
                }}
              >
                {form.amenities.includes(a)
                  ? <Check className="w-4 h-4 shrink-0" />
                  : <span className="w-4 h-4 rounded-full border-2 border-[#DDDDDD] shrink-0" />}
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={() => navigate('/dashboard/listings')}
            className="px-6 py-3 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#717171] hover:bg-[#F7F7F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ background: '#FF385C' }}
          >
            {updateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
