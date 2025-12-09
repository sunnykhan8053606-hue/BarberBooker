import { addDays, format } from "date-fns";

export type Service = {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Barber = {
  id: string;
  name: string;
  avatar: string;
};

export type Shop = {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  services: Service[];
  reviews: Review[];
  barbers: Barber[];
  approved: boolean;
};

export type Appointment = {
  id: string;
  shopId: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  customerName: string;
};

export const MOCK_SHOPS: Shop[] = [
  {
    id: "1",
    name: "The Dapper Gentleman",
    address: "123 Main St, Downtown",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    rating: 4.8,
    reviewCount: 124,
    description: "A classic barbershop experience with a modern twist. We specialize in hot towel shaves and precision cuts.",
    approved: true,
    services: [
      { id: "s1", name: "Classic Haircut", duration: 30, price: 35 },
      { id: "s2", name: "Hot Towel Shave", duration: 45, price: 45 },
      { id: "s3", name: "Beard Trim", duration: 20, price: 25 },
      { id: "s4", name: "Haircut + Shave Combo", duration: 60, price: 70 },
    ],
    barbers: [
      { id: "b1", name: "James", avatar: "https://i.pravatar.cc/150?u=b1" },
      { id: "b2", name: "Marcus", avatar: "https://i.pravatar.cc/150?u=b2" },
      { id: "b3", name: "David", avatar: "https://i.pravatar.cc/150?u=b3" },
    ],
    reviews: [
      { id: "r1", author: "Alex D.", rating: 5, comment: "Best fade in the city. James really knows his stuff!", date: "2023-10-15" },
      { id: "r2", author: "Sam K.", rating: 4, comment: "Great vibe, slightly pricey but worth it.", date: "2023-10-10" },
      { id: "r3", author: "Chris P.", rating: 5, comment: "Professional and clean. Highly recommended.", date: "2023-10-05" },
    ],
  },
  {
    id: "2",
    name: "Urban Cuts",
    address: "456 Market Ave, Westside",
    image: "https://images.unsplash.com/photo-1503951914875-befbb64918d3?w=800&q=80",
    rating: 4.5,
    reviewCount: 89,
    description: "Street style cuts and designs. The place to be for modern trends and creative fades.",
    approved: true,
    services: [
      { id: "s5", name: "Fade & Line Up", duration: 40, price: 40 },
      { id: "s6", name: "Hair Design", duration: 60, price: 60 },
      { id: "s7", name: "Buzz Cut", duration: 20, price: 20 },
      { id: "s8", name: "Color Treatment", duration: 45, price: 50 },
    ],
    barbers: [
      { id: "b4", name: "Tariq", avatar: "https://i.pravatar.cc/150?u=b4" },
      { id: "b5", name: "DeShawn", avatar: "https://i.pravatar.cc/150?u=b5" },
    ],
    reviews: [
      { id: "r4", author: "Jordan M.", rating: 5, comment: "Tariq is an artist with clippers!", date: "2023-11-01" },
      { id: "r5", author: "Mike T.", rating: 4, comment: "Good energy, great cuts.", date: "2023-10-28" },
    ],
  },
  {
    id: "3",
    name: "Blade & Bourbon",
    address: "789 Oak Ln, Uptown",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    rating: 4.9,
    reviewCount: 210,
    description: "Enjoy a complimentary bourbon with every service. Premium grooming experience in an upscale setting.",
    approved: true,
    services: [
      { id: "s9", name: "Full Grooming Service", duration: 90, price: 100 },
      { id: "s10", name: "Executive Cut", duration: 45, price: 55 },
      { id: "s11", name: "Beard Sculpting", duration: 30, price: 40 },
      { id: "s12", name: "Scalp Treatment", duration: 25, price: 35 },
    ],
    barbers: [
      { id: "b6", name: "Arthur", avatar: "https://i.pravatar.cc/150?u=b6" },
      { id: "b7", name: "William", avatar: "https://i.pravatar.cc/150?u=b7" },
      { id: "b8", name: "Robert", avatar: "https://i.pravatar.cc/150?u=b8" },
    ],
    reviews: [
      { id: "r6", author: "Brian H.", rating: 5, comment: "Worth every penny. Premium experience.", date: "2023-11-08" },
      { id: "r7", author: "David L.", rating: 5, comment: "The bourbon is a nice touch!", date: "2023-11-05" },
      { id: "r8", author: "Paul G.", rating: 4, comment: "Excellent service, book ahead.", date: "2023-10-30" },
    ],
  },
  {
    id: "5",
    name: "Clipper Kings",
    address: "321 Pine St, Midtown",
    image: "https://images.unsplash.com/photo-1599351431-5a0c5d1d4ff0?w=800&q=80",
    rating: 4.6,
    reviewCount: 156,
    description: "Fast, friendly service with expert precision. Perfect for on-the-go professionals.",
    approved: true,
    services: [
      { id: "s13", name: "Express Cut", duration: 20, price: 25 },
      { id: "s14", name: "Standard Haircut", duration: 35, price: 35 },
      { id: "s15", name: "Beard Maintenance", duration: 25, price: 20 },
      { id: "s16", name: "Kids Haircut", duration: 25, price: 20 },
    ],
    barbers: [
      { id: "b9", name: "Kevin", avatar: "https://i.pravatar.cc/150?u=b9" },
      { id: "b10", name: "Eric", avatar: "https://i.pravatar.cc/150?u=b10" },
      { id: "b11", name: "Tom", avatar: "https://i.pravatar.cc/150?u=b11" },
      { id: "b12", name: "Jose", avatar: "https://i.pravatar.cc/150?u=b12" },
    ],
    reviews: [
      { id: "r9", author: "Ryan B.", rating: 5, comment: "Quick and efficient. Love it!", date: "2023-11-10" },
      { id: "r10", author: "Matt W.", rating: 4, comment: "Consistent quality every time.", date: "2023-11-07" },
      { id: "r11", author: "Tony S.", rating: 5, comment: "No wait time and perfect cuts.", date: "2023-11-03" },
    ],
  },
  {
    id: "6",
    name: "Heritage Barbershop",
    address: "555 Elm Ave, Historic District",
    image: "https://images.unsplash.com/photo-1599351431-7db7aecc58a0?w=800&q=80",
    rating: 4.7,
    reviewCount: 178,
    description: "Old-school charm meets modern technique. A timeless barbershop experience since 1985.",
    approved: true,
    services: [
      { id: "s17", name: "Traditional Haircut", duration: 35, price: 30 },
      { id: "s18", name: "Straight Razor Shave", duration: 50, price: 40 },
      { id: "s19", name: "Full Service Shave", duration: 75, price: 65 },
      { id: "s20", name: "Mustache Trim", duration: 15, price: 15 },
    ],
    barbers: [
      { id: "b13", name: "Frank", avatar: "https://i.pravatar.cc/150?u=b13" },
      { id: "b14", name: "Tony", avatar: "https://i.pravatar.cc/150?u=b14" },
    ],
    reviews: [
      { id: "r12", author: "Vincent C.", rating: 5, comment: "Authentic experience. Love the old-school vibe.", date: "2023-11-09" },
      { id: "r13", author: "Ralph K.", rating: 5, comment: "Frank is a true craftsman.", date: "2023-11-06" },
      { id: "r14", author: "Danny F.", rating: 4, comment: "Feels like stepping back in time.", date: "2023-11-01" },
    ],
  },
  {
    id: "7",
    name: "Modern Edge",
    address: "789 Tech Blvd, Silicon Valley",
    image: "https://images.unsplash.com/photo-1599351431-5d87fb4cac7f?w=800&q=80",
    rating: 4.4,
    reviewCount: 92,
    description: "Contemporary barbershop with trendy cuts and fresh styles. Young, vibrant atmosphere.",
    approved: true,
    services: [
      { id: "s21", name: "Trendy Fade", duration: 35, price: 38 },
      { id: "s22", name: "Textured Crop", duration: 40, price: 42 },
      { id: "s23", name: "Line Design", duration: 30, price: 35 },
      { id: "s24", name: "Beard Shape-up", duration: 20, price: 22 },
    ],
    barbers: [
      { id: "b15", name: "Kyle", avatar: "https://i.pravatar.cc/150?u=b15" },
      { id: "b16", name: "Brandon", avatar: "https://i.pravatar.cc/150?u=b16" },
    ],
    reviews: [
      { id: "r15", author: "Tyler M.", rating: 4, comment: "Great modern cuts. Always on trend.", date: "2023-11-08" },
      { id: "r16", author: "Jason L.", rating: 4, comment: "Friendly staff, good vibes.", date: "2023-10-31" },
    ],
  },
  {
    id: "8",
    name: "Premium Grooming Studio",
    address: "200 Luxury Lane, Riverside",
    image: "https://images.unsplash.com/photo-1599351431-5d6a9d4ee0f0?w=800&q=80",
    rating: 4.8,
    reviewCount: 198,
    description: "High-end barbering with premium products. Personalized attention and luxury amenities.",
    approved: true,
    services: [
      { id: "s25", name: "Premium Haircut", duration: 45, price: 60 },
      { id: "s26", name: "Hot Oil Massage", duration: 30, price: 45 },
      { id: "s27", name: "Complete Grooming", duration: 90, price: 120 },
      { id: "s28", name: "Facial Treatment", duration: 35, price: 55 },
    ],
    barbers: [
      { id: "b17", name: "Sebastian", avatar: "https://i.pravatar.cc/150?u=b17" },
      { id: "b18", name: "Ricardo", avatar: "https://i.pravatar.cc/150?u=b18" },
      { id: "b19", name: "Marco", avatar: "https://i.pravatar.cc/150?u=b19" },
    ],
    reviews: [
      { id: "r17", author: "Lucas T.", rating: 5, comment: "Absolutely fantastic. Best experience ever.", date: "2023-11-10" },
      { id: "r18", author: "Adrian M.", rating: 5, comment: "Worth the premium price.", date: "2023-11-07" },
      { id: "r19", author: "Sergio P.", rating: 5, comment: "Exceptional service and results.", date: "2023-11-02" },
    ],
  },
  {
    id: "9",
    name: "New Shop Application",
    address: "101 Pending St",
    image: "https://images.unsplash.com/photo-1599351431-202e0f0b3d7a?w=800&q=80",
    rating: 0,
    reviewCount: 0,
    description: "Awaiting approval.",
    approved: false,
    services: [],
    barbers: [],
    reviews: [],
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    shopId: "1",
    serviceId: "s1",
    barberId: "b1",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00 AM",
    status: "confirmed",
    customerName: "John Doe",
  },
  {
    id: "a2",
    shopId: "1",
    serviceId: "s2",
    barberId: "b2",
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    time: "2:00 PM",
    status: "pending",
    customerName: "Jane Smith",
  },
];
