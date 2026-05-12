export const queryKeys = {
  // Auth
  me: ['me'] as const,

  // Users
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userBookings: (id: string) => ['users', id, 'bookings'] as const,
  userStats: ['users', 'statistics'] as const,

  // Listings
  listings: (params?: Record<string, unknown>) => ['listings', params ?? {}] as const,
  listing: (id: string) => ['listings', id] as const,
  listingsSearch: (params: Record<string, unknown>) => ['listings', 'search', params] as const,

  // Bookings
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  userBookingsList: (userId: string) => ['bookings', 'user', userId] as const,

  // Reviews
  listingReviews: (listingId: string) => ['reviews', listingId] as const,

  // Admin
  hostRequests: ['admin', 'host-requests'] as const,

  // AI
  aiReviewSummary: (listingId: string) => ['ai', 'reviews', listingId] as const,
  aiRecommendations: ['ai', 'recommendations'] as const,

  // Statistics
  statsListings: ['statistics', 'listings'] as const,
  statsUsers: ['statistics', 'users'] as const,
};
