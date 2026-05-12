import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { PropertyDetails } from './pages/PropertyDetails';
import { NotFound } from './pages/NotFound';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';
import { Experiences } from './pages/Experiences';

import { ProtectedHostLayout, ProtectedRoute } from './components/auth/ProtectedLayouts';

// Host Dashboard Pages
import { Dashboard } from './pages/Dashboard';
import { MyListings } from './pages/host/MyListings';
import { AddListing } from './pages/host/AddListing';
import { HostBookings } from './pages/host/HostBookings';
import { Earnings } from './pages/host/Earnings';
import { HostReviews } from './pages/host/HostReviews';
import { HostMessages } from './pages/host/HostMessages';
import { HostProfile } from './pages/host/HostProfile';
import { HostSettings } from './pages/host/HostSettings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminHosts } from './pages/admin/AdminHosts';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

// User Pages (for navbar dropdown - guests don't have dashboard)
import { UserBookings } from './pages/user/UserBookings';
import { UserWishlist } from './pages/user/UserWishlist';
import { UserProfile } from './pages/user/UserProfile';
import { UserMessages } from './pages/user/UserMessages';
import { UserSettings } from './pages/user/UserSettings';

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/listings',
        Component: Listings,
      },
      {
        path: '/property/:id',
        Component: PropertyDetails,
      },
      {
        path: '/signin',
        Component: SignIn,
      },
      {
        path: '/register',
        Component: Register,
      },
      {
        path: '/checkout/:id',
        Component: Checkout,
      },
      {
        path: '/experiences',
        Component: Experiences,
      },
      { path: '/user/bookings', Component: UserBookings },
      { path: '/user/wishlist', Component: UserWishlist },
      { path: '/user/messages', Component: UserMessages },
      { path: '/user/profile', Component: UserProfile },
      { path: '/user/settings', Component: UserSettings },
      {
        path: '/dashboard',
        Component: ProtectedHostLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'listings', Component: MyListings },
          { path: 'add-listing', Component: AddListing },
          { path: 'bookings', Component: HostBookings },
          { path: 'earnings', Component: Earnings },
          { path: 'reviews', Component: HostReviews },
          { path: 'messages', Component: HostMessages },
          { path: 'profile', Component: HostProfile },
          { path: 'settings', Component: HostSettings },
          { path: 'users', Component: AdminUsers },
          { path: 'hosts', Component: AdminHosts },
          { path: 'payments', Component: AdminPayments },
          { path: 'reports', Component: AdminReports },
          { path: 'analytics', Component: AdminAnalytics },
        ],
      },

      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);