import { Link } from 'react-router';
import { Star, MapPin, Heart } from 'lucide-react';
import { useListings } from '../../../features/listings/hooks';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { useWishlist } from '../../context/WishlistContext';

export function UserWishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { data: allListings = [], isLoading } = useListings();

  // Filter listings to only show those in wishlist
  const wishlistProperties = allListings.filter(p => wishlist.includes(p.id));

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(wishlistProperties, { defaultPerPage: 6 });

  if (isLoading) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="mb-8">
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>My Wishlist</h1>
          <p className="text-[#717171] text-sm">Properties you've saved for later.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] animate-pulse">
              <div className="bg-[#F0F0F0]" style={{ aspectRatio: '4/3' }} />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
                <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
                <div className="h-4 bg-[#F0F0F0] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>My Wishlist</h1>
        <p className="text-[#717171] text-sm">Properties you've saved for later.</p>
      </div>

      {wishlistProperties.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-[#DDDDDD] mx-auto mb-4" />
          <h3 className="text-[#222222] font-semibold text-lg mb-2">No saved properties yet</h3>
          <p className="text-[#717171] text-sm mb-6">Start exploring and save properties you love for easy access later.</p>
          <Link
            to="/listings"
            className="bg-[#FF5A5F] hover:bg-[#E74C55] text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedItems.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] hover:shadow-lg transition-shadow group">
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFromWishlist(p.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FF5A5F] transition-colors group"
                >
                  <Heart className="w-4 h-4 fill-[#FF5A5F] text-[#FF5A5F] group-hover:text-white group-hover:fill-white" />
                </button>
              </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[#222222] font-semibold text-sm line-clamp-2 flex-1 pr-2">{p.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                  <span className="text-sm font-semibold text-[#222222]">{p.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                <span className="text-[#717171] text-xs">{p.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#222222] font-bold">${p.price}<span className="text-[#717171] font-normal text-sm"> /night</span></span>
                <Link to={`/property/${p.id}`} className="bg-[#FF5A5F] hover:bg-[#E74C55] text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onPerPageChange}
        perPageOptions={[6, 8, 12]}
        itemLabel="saved properties"
        className="border-t border-[#EBEBEB] pt-6"
      />
    </div>
  );
}
