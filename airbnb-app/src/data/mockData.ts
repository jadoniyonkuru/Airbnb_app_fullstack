// Mock data for the StayEase platform

export const properties = [
  {
    id: "1",
    title: "Skyline Penthouse in Kigali Heights",
    location: "Kigali, Rwanda",
    price: 110,
    rating: 4.9,
    reviews: 143,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    host: "Claudine Uwera",
    guests: 4, bedrooms: 2, beds: 2, baths: 2,
    amenities: ["WiFi", "Kitchen", "Rooftop terrace", "Air conditioning", "City view"],
    description: "Elegant penthouse perched above the Kigali skyline. Floor-to-ceiling windows flood the space with natural light. Ideal for professionals and couples seeking a premium city escape.",
    type: "Apartment", category: "Apartment",
    lat: -1.9441, lng: 30.0619,
  },
  {
    id: "2",
    title: "Tropical Villa with Infinity Pool",
    location: "Dar es Salaam, Tanzania",
    price: 275,
    rating: 5.0,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    host: "Boniface Mwamba",
    guests: 8, bedrooms: 4, beds: 5, baths: 3,
    amenities: ["Infinity pool", "WiFi", "Fully equipped kitchen", "Free parking", "Tropical garden", "Outdoor BBQ"],
    description: "Breathtaking villa nestled in lush greenery with a stunning infinity pool overlooking the Indian Ocean. Perfect for families, retreats, and milestone celebrations.",
    type: "Villa", category: "Villa",
    lat: -6.7924, lng: 39.2083,
  },
  {
    id: "3",
    title: "Bohemian Loft in Le Marais",
    location: "Paris, France",
    price: 145,
    rating: 4.8,
    reviews: 188,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    host: "Isabelle Renard",
    guests: 2, bedrooms: 1, beds: 1, baths: 1,
    amenities: ["WiFi", "Kitchen", "Exposed brick walls", "Workspace", "Nearby metro"],
    description: "Artsy open-plan loft tucked into one of Paris's most vibrant neighbourhoods. Vintage furnishings meet modern comforts, steps from galleries and bistros.",
    type: "Loft", category: "Apartment",
    lat: 48.8566, lng: 2.3522,
  },
  {
    id: "4",
    title: "Brooklyn Heights Brownstone",
    location: "New York, USA",
    price: 320,
    rating: 4.95,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop",
    host: "Marcus Thompson",
    guests: 6, bedrooms: 3, beds: 3, baths: 2,
    amenities: ["WiFi", "Kitchen", "Private garden", "Washer & dryer", "Manhattan views"],
    description: "Stunning 19th-century brownstone fully restored to a modern standard. Private garden, sun-drenched rooms, and a 20-minute walk to Manhattan.",
    type: "Townhouse", category: "Apartment",
    lat: 40.6962, lng: -73.9936,
  },
  {
    id: "5",
    title: "Coral Beach House",
    location: "Zanzibar, Tanzania",
    price: 195,
    rating: 4.85,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&h=600&fit=crop",
    host: "Fatuma Ally",
    guests: 5, bedrooms: 2, beds: 3, baths: 2,
    amenities: ["Direct beach access", "WiFi", "Kitchen", "Snorkelling gear", "Ocean view", "Hammock"],
    description: "Wake up to turquoise water and powdery sand. This beachside retreat is the ultimate Zanzibar escape — secluded, serene, and utterly beautiful.",
    type: "Bungalow", category: "Beachfront",
    lat: -6.1659, lng: 39.2026,
  },
  {
    id: "6",
    title: "Hilltop Cottage with Garden Views",
    location: "Kigali, Rwanda",
    price: 78,
    rating: 4.7,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800&h=600&fit=crop",
    host: "Pacifique Habimana",
    guests: 4, bedrooms: 2, beds: 2, baths: 1,
    amenities: ["WiFi", "Kitchen", "Free parking", "Lush garden", "Terrace"],
    description: "Quiet hillside cottage surrounded by flowering gardens and sweeping valley views. A peaceful retreat just 15 minutes from the city centre.",
    type: "Cottage", category: "Apartment",
    lat: -1.9706, lng: 30.1044,
  },
  {
    id: "7",
    title: "Chamonix Mountain Lodge",
    location: "Chamonix, France",
    price: 345,
    rating: 4.93,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
    host: "Éric Bouchard",
    guests: 6, bedrooms: 3, beds: 4, baths: 2,
    amenities: ["WiFi", "Log fireplace", "Mont Blanc views", "Ski-in/ski-out", "Heated jacuzzi"],
    description: "Traditional Alpine lodge reimagined with contemporary warmth. Ski straight from your door and return to crackling fires and mountain panoramas.",
    type: "Cabin", category: "Cabin",
    lat: 45.9237, lng: 6.8694,
  },
  {
    id: "8",
    title: "Cliffside Suite in Sea Point",
    location: "Cape Town, South Africa",
    price: 210,
    rating: 4.88,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    host: "Thabo Nkosi",
    guests: 4, bedrooms: 2, beds: 2, baths: 2,
    amenities: ["Atlantic Ocean view", "WiFi", "Rooftop pool", "Kitchen", "Private balcony"],
    description: "Perched on the Atlantic Seaboard cliffs with jaw-dropping ocean vistas. Contemporary interiors and a rooftop plunge pool make this a bucket-list stay.",
    type: "Suite", category: "Beachfront",
    lat: -33.9249, lng: 18.4241,
  }
];

export const users = [
  { id: "1", name: "Claudine Uwera", email: "claudine.u@email.com", role: "host", status: "active", joined: "2024-01-15", avatar: "CU", bookings: 24, revenue: 5280 },
  { id: "2", name: "Boniface Mwamba", email: "b.mwamba@email.com", role: "host", status: "active", joined: "2024-02-20", avatar: "BM", bookings: 18, revenue: 6840 },
  { id: "3", name: "Isabelle Renard", email: "isabelle.r@email.com", role: "host", status: "active", joined: "2023-11-10", avatar: "IR", bookings: 31, revenue: 4495 },
  { id: "4", name: "Marcus Thompson", email: "m.thompson@email.com", role: "host", status: "active", joined: "2023-09-05", avatar: "MT", bookings: 42, revenue: 13440 },
  { id: "5", name: "Fatuma Ally", email: "fatuma.a@email.com", role: "host", status: "active", joined: "2024-03-12", avatar: "FA", bookings: 15, revenue: 2925 },
  { id: "6", name: "Kevin Malone", email: "kevin.m@email.com", role: "guest", status: "active", joined: "2024-04-01", avatar: "KM", bookings: 7, revenue: 0 },
  { id: "7", name: "Aisha Diallo", email: "aisha.d@email.com", role: "guest", status: "active", joined: "2024-01-22", avatar: "AD", bookings: 3, revenue: 0 },
  { id: "8", name: "Rafael Vargas", email: "r.vargas@email.com", role: "guest", status: "active", joined: "2024-05-10", avatar: "RV", bookings: 12, revenue: 0 },
  { id: "9", name: "Thabo Nkosi", email: "t.nkosi@email.com", role: "host", status: "active", joined: "2024-02-01", avatar: "TN", bookings: 22, revenue: 4620 },
  { id: "10", name: "Lena Fischer", email: "l.fischer@email.com", role: "guest", status: "active", joined: "2024-06-15", avatar: "LF", bookings: 5, revenue: 0 }
];

export const bookings = [
  {
    id: "B001",
    propertyId: "1",
    propertyTitle: "Skyline Penthouse in Kigali Heights",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
    guest: "Kevin Malone",
    guestAvatar: "KM",
    checkIn: "2026-05-15",
    checkOut: "2026-05-20",
    status: "confirmed",
    total: 550,
    nights: 5,
    location: "Kigali, Rwanda"
  },
  {
    id: "B002",
    propertyId: "2",
    propertyTitle: "Tropical Villa with Infinity Pool",
    propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop",
    guest: "Aisha Diallo",
    guestAvatar: "AD",
    checkIn: "2026-05-22",
    checkOut: "2026-05-25",
    status: "pending",
    total: 825,
    nights: 3,
    location: "Dar es Salaam, Tanzania"
  },
  {
    id: "B003",
    propertyId: "3",
    propertyTitle: "Bohemian Loft in Le Marais",
    propertyImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop",
    guest: "Rafael Vargas",
    guestAvatar: "RV",
    checkIn: "2026-05-10",
    checkOut: "2026-05-17",
    status: "confirmed",
    total: 1015,
    nights: 7,
    location: "Paris, France"
  },
  {
    id: "B004",
    propertyId: "4",
    propertyTitle: "Brooklyn Heights Brownstone",
    propertyImage: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=300&h=200&fit=crop",
    guest: "Lena Fischer",
    guestAvatar: "LF",
    checkIn: "2026-05-08",
    checkOut: "2026-05-12",
    status: "completed",
    total: 1280,
    nights: 4,
    location: "New York, USA"
  },
  {
    id: "B005",
    propertyId: "5",
    propertyTitle: "Coral Beach House",
    propertyImage: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&h=200&fit=crop",
    guest: "Rafael Vargas",
    guestAvatar: "RV",
    checkIn: "2026-05-18",
    checkOut: "2026-05-25",
    status: "confirmed",
    total: 1365,
    nights: 7,
    location: "Zanzibar, Tanzania"
  },
  {
    id: "B006",
    propertyId: "7",
    propertyTitle: "Chamonix Mountain Lodge",
    propertyImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=300&h=200&fit=crop",
    guest: "Lena Fischer",
    guestAvatar: "LF",
    checkIn: "2026-06-01",
    checkOut: "2026-06-08",
    status: "pending",
    total: 2415,
    nights: 7,
    location: "Chamonix, France"
  }
];

export const payments = [
  { id: "PAY001", bookingId: "B001", guest: "Kevin Malone", amount: 550, date: "2026-04-20", method: "Credit Card", status: "completed", property: "Kigali Penthouse" },
  { id: "PAY002", bookingId: "B002", guest: "Aisha Diallo", amount: 825, date: "2026-04-25", method: "PayPal", status: "pending", property: "Dar es Salaam Villa" },
  { id: "PAY003", bookingId: "B003", guest: "Rafael Vargas", amount: 1015, date: "2026-04-15", method: "Credit Card", status: "completed", property: "Paris Loft" },
  { id: "PAY004", bookingId: "B004", guest: "Lena Fischer", amount: 1280, date: "2026-04-10", method: "Bank Transfer", status: "completed", property: "Brooklyn Brownstone" },
  { id: "PAY005", bookingId: "B005", guest: "Rafael Vargas", amount: 1365, date: "2026-04-28", method: "Credit Card", status: "completed", property: "Zanzibar Beach House" },
  { id: "PAY006", bookingId: "B006", guest: "Lena Fischer", amount: 2415, date: "2026-05-01", method: "Credit Card", status: "pending", property: "Chamonix Lodge" }
];

export const reviews = [
  { id: "R001", propertyId: "1", property: "Skyline Penthouse in Kigali Heights", guest: "Kevin Malone", guestAvatar: "KM", rating: 5, comment: "Exceptional views and a spotless interior. Claudine was attentive throughout — truly a five-star host.", date: "2026-04-25", status: "approved" },
  { id: "R002", propertyId: "3", property: "Bohemian Loft in Le Marais", guest: "Rafael Vargas", guestAvatar: "RV", rating: 5, comment: "Everything about this loft was perfect. The neighbourhood, the design, and Isabelle's warm welcome. Can't wait to return.", date: "2026-04-20", status: "approved" },
  { id: "R003", propertyId: "4", property: "Brooklyn Heights Brownstone", guest: "Lena Fischer", guestAvatar: "LF", rating: 4, comment: "Beautifully renovated and very comfortable. The garden was a lovely bonus. Slightly tricky parking on weekends.", date: "2026-04-15", status: "pending" },
  { id: "R004", propertyId: "2", property: "Tropical Villa with Infinity Pool", guest: "Aisha Diallo", guestAvatar: "AD", rating: 5, comment: "Honestly one of the most beautiful places I've ever stayed. The infinity pool at sunset is a memory I'll carry forever.", date: "2026-04-10", status: "approved" },
  { id: "R005", propertyId: "5", property: "Coral Beach House", guest: "Rafael Vargas", guestAvatar: "RV", rating: 5, comment: "Woke up to the sound of waves every single morning. Fatuma stocked the fridge on arrival — such a thoughtful touch.", date: "2026-04-05", status: "pending" }
];

export const stats = {
  totalUsers: 1384,
  totalHosts: 412,
  totalListings: 598,
  totalBookings: 2493,
  totalRevenue: 531640,
  activeListings: 551,
  monthlyRevenue: [
    { month: "Jul", revenue: 41000, bookings: 158 },
    { month: "Aug", revenue: 46500, bookings: 178 },
    { month: "Sep", revenue: 43200, bookings: 166 },
    { month: "Oct", revenue: 49000, bookings: 188 },
    { month: "Nov", revenue: 47500, bookings: 182 },
    { month: "Dec", revenue: 63000, bookings: 241 },
    { month: "Jan", revenue: 56000, bookings: 215 },
    { month: "Feb", revenue: 51500, bookings: 198 },
    { month: "Mar", revenue: 59000, bookings: 227 },
    { month: "Apr", revenue: 67500, bookings: 259 },
    { month: "May", revenue: 74000, bookings: 284 },
    { month: "Jun", revenue: 78000, bookings: 299 }
  ],
  weeklyBookings: [
    { day: "Mon", bookings: 35 },
    { day: "Tue", bookings: 31 },
    { day: "Wed", bookings: 44 },
    { day: "Thu", bookings: 42 },
    { day: "Fri", bookings: 71 },
    { day: "Sat", bookings: 94 },
    { day: "Sun", bookings: 79 }
  ],
  categoryRevenue: [
    { name: "Apartments", value: 33, color: "#FF385C" },
    { name: "Villas", value: 30, color: "#00A699" },
    { name: "Cabins", value: 17, color: "#FC642D" },
    { name: "Beachfront", value: 13, color: "#484848" },
    { name: "Other", value: 7, color: "#767676" }
  ],
  userGrowth: [
    { month: "Jan", users: 1090 },
    { month: "Feb", users: 1145 },
    { month: "Mar", users: 1210 },
    { month: "Apr", users: 1270 },
    { month: "May", users: 1330 },
    { month: "Jun", users: 1384 }
  ]
};

export const hostListings = [
  {
    id: "HL1",
    title: "Skyline Penthouse in Kigali Heights",
    location: "Kigali, Rwanda",
    price: 110,
    rating: 4.9,
    reviews: 143,
    bookings: 24,
    earnings: 2640,
    status: "active",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    occupancyRate: 89,
    nextBooking: "May 15, 2026"
  },
  {
    id: "HL2",
    title: "Hilltop Cottage with Garden Views",
    location: "Kigali, Rwanda",
    price: 78,
    rating: 4.7,
    reviews: 62,
    bookings: 18,
    earnings: 1404,
    status: "active",
    image: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=400&h=300&fit=crop",
    occupancyRate: 74,
    nextBooking: "May 22, 2026"
  },
  {
    id: "HL3",
    title: "Executive Studio — Kimihurura",
    location: "Kigali, Rwanda",
    price: 95,
    rating: 4.6,
    reviews: 38,
    bookings: 9,
    earnings: 855,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    occupancyRate: 42,
    nextBooking: "—"
  }
];

export const hostEarnings = [
  { month: "Jan", earnings: 1380 },
  { month: "Feb", earnings: 1710 },
  { month: "Mar", earnings: 1550 },
  { month: "Apr", earnings: 2050 },
  { month: "May", earnings: 2480 },
  { month: "Jun", earnings: 2260 },
  { month: "Jul", earnings: 2100 },
  { month: "Aug", earnings: 2610 },
  { month: "Sep", earnings: 2350 },
  { month: "Oct", earnings: 2820 },
  { month: "Nov", earnings: 3040 },
  { month: "Dec", earnings: 3380 }
];

export const activities = [
  { id: 1, user: "Claudine Uwera", action: "added a new listing", detail: "Skyline Penthouse Kigali", time: "2 hours ago", type: "listing", avatar: "CU" },
  { id: 2, user: "Kevin Malone", action: "completed a booking", detail: "Skyline Penthouse in Kigali • $550", time: "4 hours ago", type: "booking", avatar: "KM" },
  { id: 3, user: "Aisha Diallo", action: "left a 5-star review", detail: "Tropical Villa, Dar es Salaam", time: "6 hours ago", type: "review", avatar: "AD" },
  { id: 4, user: "Boniface Mwamba", action: "updated their listing", detail: "Tropical Villa with Infinity Pool", time: "8 hours ago", type: "listing", avatar: "BM" },
  { id: 5, user: "Isabelle Renard", action: "received a booking request", detail: "Bohemian Loft Le Marais • $1,015", time: "10 hours ago", type: "booking", avatar: "IR" },
  { id: 6, user: "Rafael Vargas", action: "made a payment", detail: "$1,365 via Credit Card", time: "12 hours ago", type: "payment", avatar: "RV" },
  { id: 7, user: "Thabo Nkosi", action: "registered as a new host", detail: "", time: "1 day ago", type: "user", avatar: "TN" },
  { id: 8, user: "Lena Fischer", action: "submitted a support request", detail: "Booking B004", time: "1 day ago", type: "alert", avatar: "LF" }
];

export const testimonials = [
  {
    id: 1,
    name: "Kwame Asante",
    location: "Accra, Ghana",
    avatar: "KA",
    rating: 5,
    comment: "I found a breathtaking beachfront villa in Zanzibar in under ten minutes. The photos were accurate, the host was warm, and check-in was effortless. StayEase has completely changed how I plan trips.",
    property: "Coral Beach House, Zanzibar"
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    location: "Osaka, Japan",
    avatar: "YT",
    rating: 5,
    comment: "I listed my apartment six months ago and haven't looked back. The host dashboard is clean and intuitive, my calendar fills almost on its own, and the payouts arrive exactly on time.",
    property: "Host since 2025"
  },
  {
    id: 3,
    name: "Valentina Cruz",
    location: "Buenos Aires, Argentina",
    avatar: "VC",
    rating: 5,
    comment: "Two weeks in a gorgeous Paris loft and every single day felt like a film set. The neighbourhood was perfect, the host replied within minutes, and the whole experience was absolutely faultless.",
    property: "Bohemian Loft, Paris"
  }
];
