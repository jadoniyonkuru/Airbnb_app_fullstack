export const ENDPOINTS = {
  
  LOGIN:           '/auth/login',
  REGISTER:        '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  (token: string) => `/auth/reset-password/${token}`,
  CHANGE_PASSWORD: '/auth/change-password',

  
  USERS:           '/users',
  USER:            (id: string) => `/users/${id}`,
  USER_BOOKINGS:   (id: string) => `/users/${id}/bookings`,
  USER_STATS:      '/users/statistics',
  USER_AVATAR:     (id: string) => `/users/${id}/avatar`,
  USER_PHOTOS:     (id: string) => `/users/${id}/listing-photos`,

  // Listings
  LISTINGS:        '/listings',
  LISTINGS_SEARCH: '/listings/search',
  LISTING:         (id: string) => `/listings/${id}`,

  // Bookings
  BOOKINGS:        '/bookings',
  BOOKING:         (id: string) => `/bookings/${id}`,
  USER_BOOKING:    (id: string) => `/bookings/user/${id}`,

  // Reviews
  LISTING_REVIEWS: (listingId: string) => `/reviews/listings/${listingId}`,
  REVIEW:          (id: string) => `/reviews/${id}`,

  // Admin
  HOST_REQUESTS:   '/admin/host-requests',
  APPROVE_HOST:    (id: string) => `/admin/approve-host/${id}`,
  REJECT_HOST:     (id: string) => `/admin/reject-host/${id}`,

  // AI
  AI_SEARCH:       '/ai/search',
  AI_CHAT:         '/ai/chat',
  AI_REVIEW_SUMMARY: (listingId: string) => `/ai/reviews/${listingId}/summary`,
  AI_GENERATE_DESC: '/ai/generate-description',
  AI_RECOMMENDATIONS: '/ai/recommendations',

  // Statistics
  STATS_LISTINGS:  '/statistics/listings',
  STATS_USERS:     '/statistics/users',
};
