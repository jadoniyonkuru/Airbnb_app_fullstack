export const ENDPOINTS = {
  // Auth
  LOGIN:           '/auth/login',
  REGISTER:        '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  (token: string) => `/auth/reset-password/${token}`,
  CHANGE_PASSWORD: '/auth/change-password',

  // Users
  USERS:           '/users',
  USER:            (id: string) => `/users/${id}`,
  USER_BOOKINGS:   (id: string) => `/users/${id}/bookings`,
  USER_STATS:      '/users/stats',
  USER_AVATAR:     (id: string) => `/users/${id}/avatar`,
  USER_PROFILE:    (id: string) => `/users/${id}/profile`,
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
  LISTING_REVIEWS: (listingId: string) => `/listings/${listingId}/reviews`,
  REVIEW:          (id: string) => `/reviews/${id}`,

  // Admin
  ADMIN_STATS:            '/admin/stats',
  ADMIN_USERS:            '/admin/users',
  ADMIN_USER_STATUS:      (id: string) => `/admin/users/${id}/status`,
  ADMIN_USER_DELETE:      (id: string) => `/admin/users/${id}`,
  ADMIN_LISTINGS:         '/admin/listings',
  ADMIN_LISTING_STATUS:   (id: string) => `/admin/listings/${id}/status`,
  ADMIN_BOOKINGS:         '/admin/bookings',
  ADMIN_BOOKING_STATUS:   (id: string) => `/admin/bookings/${id}/status`,
  ADMIN_REVIEWS:          '/admin/reviews',
  ADMIN_REVIEW_STATUS:    (id: string) => `/admin/reviews/${id}/status`,
  ADMIN_REVIEW_DELETE:    (id: string) => `/admin/reviews/${id}`,
  ADMIN_PAYMENTS:         '/admin/payments',

  // AI
  AI_SEARCH:           '/ai/search',
  AI_CHAT:             '/ai/chat',
  AI_REVIEW_SUMMARY:   (listingId: string) => `/ai/listings/${listingId}/review-summary`,
  AI_GENERATE_DESC:    (listingId: string) => `/ai/listings/${listingId}/generate-description`,
  AI_RECOMMENDATIONS:  '/ai/recommend',

  // Statistics & Analytics
  STATS_LISTINGS:  '/listings/stats',
  STATS_USERS:     '/users/stats',
  ANALYTICS:       '/listings/analytics',

  // Messaging
  MESSAGES:              '/messages',
  MESSAGE_CONVERSATION:  (id: string) => `/messages/${id}`,
};
