import { useState } from "react";
import { format, addDays, getHours } from "date-fns";

// Generate available time slots for a given date
export const AVAILABLE_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

export function getAvailableSlots(date: Date, shopId: string): string[] {
  // Simulate some slots being booked
  const bookedSlots = ["09:00 AM", "02:00 PM", "05:00 PM"];
  return AVAILABLE_TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
}

export type UserReview = {
  id: string;
  shopId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
};

// Local storage helper for reviews
export function addReviewToLocalStorage(review: UserReview) {
  try {
    const reviews = localStorage.getItem("barber_reviews");
    const existing = reviews ? JSON.parse(reviews) : [];
    localStorage.setItem("barber_reviews", JSON.stringify([...existing, review]));
  } catch (e) {
    console.error("Failed to save review", e);
  }
}

export function getReviewsFromLocalStorage(shopId: string): UserReview[] {
  try {
    const reviews = localStorage.getItem("barber_reviews");
    if (!reviews) return [];
    return JSON.parse(reviews).filter((r: UserReview) => r.shopId === shopId);
  } catch (e) {
    console.error("Failed to get reviews", e);
    return [];
  }
}

export type CustomerBooking = {
  id: string;
  userId: string;
  userName: string;
  shopId: string;
  shopName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  barberId?: string;
  barberName?: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  bookedAt: string;
};

// Local storage helper for bookings
export function saveBookingToLocalStorage(booking: CustomerBooking) {
  try {
    const bookings = localStorage.getItem("barber_bookings");
    const existing = bookings ? JSON.parse(bookings) : [];
    localStorage.setItem("barber_bookings", JSON.stringify([...existing, booking]));
  } catch (e) {
    console.error("Failed to save booking", e);
  }
}

export function getBookingsFromLocalStorage(userId: string): CustomerBooking[] {
  try {
    const bookings = localStorage.getItem("barber_bookings");
    if (!bookings) return [];
    return JSON.parse(bookings).filter((b: CustomerBooking) => b.userId === userId);
  } catch (e) {
    console.error("Failed to get bookings", e);
    return [];
  }
}

export type BarberService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export type BarberProfile = {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  specialties?: string;
  uniquePoints?: string;
  startingPrice: number;
  priceRange: number;
  image: string;
  address: string;
  phone: string;
  email: string;
  services: BarberService[];
  approved: boolean;
  createdAt: string;
};

// Barber shop management
export function saveBarberShopToLocalStorage(profile: BarberProfile) {
  try {
    const shops = localStorage.getItem("barber_shops");
    const existing = shops ? JSON.parse(shops) : [];
    const filtered = existing.filter((s: BarberProfile) => s.userId !== profile.userId);
    localStorage.setItem("barber_shops", JSON.stringify([...filtered, profile]));
  } catch (e) {
    console.error("Failed to save barber shop", e);
  }
}

export function getBarberShopFromLocalStorage(userId: string): BarberProfile | null {
  try {
    const shops = localStorage.getItem("barber_shops");
    if (!shops) return null;
    const shop = JSON.parse(shops).find((s: BarberProfile) => s.userId === userId);
    return shop || null;
  } catch (e) {
    console.error("Failed to get barber shop", e);
    return null;
  }
}

// Get all bookings for a barber's shop
export function getBookingsForBarberShop(shopId: string): CustomerBooking[] {
  try {
    const bookings = localStorage.getItem("barber_bookings");
    if (!bookings) return [];
    return JSON.parse(bookings).filter((b: CustomerBooking) => b.shopId === shopId);
  } catch (e) {
    console.error("Failed to get barber bookings", e);
    return [];
  }
}

// Update booking status
export function updateBookingStatus(bookingId: string, status: "confirmed" | "pending" | "cancelled") {
  try {
    const bookings = localStorage.getItem("barber_bookings");
    if (!bookings) return;
    const parsed = JSON.parse(bookings);
    const updated = parsed.map((b: CustomerBooking) =>
      b.id === bookingId ? { ...b, status } : b
    );
    localStorage.setItem("barber_bookings", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to update booking", e);
  }
}

// Admin functions
export function getAllBarberShops(): BarberProfile[] {
  try {
    const shops = localStorage.getItem("barber_shops");
    if (!shops) return [];
    return JSON.parse(shops);
  } catch (e) {
    console.error("Failed to get all barber shops", e);
    return [];
  }
}

export function getPendingBarberShops(): BarberProfile[] {
  return getAllBarberShops().filter(shop => !shop.approved);
}

export function getApprovedBarberShops(): BarberProfile[] {
  return getAllBarberShops().filter(shop => shop.approved);
}

export function approveBarberShop(shopId: string) {
  try {
    const shops = localStorage.getItem("barber_shops");
    if (!shops) return;
    const parsed = JSON.parse(shops);
    const updated = parsed.map((s: BarberProfile) =>
      s.id === shopId ? { ...s, approved: true } : s
    );
    localStorage.setItem("barber_shops", JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to approve shop", e);
  }
}

export function rejectBarberShop(shopId: string) {
  try {
    const shops = localStorage.getItem("barber_shops");
    if (!shops) return;
    const parsed = JSON.parse(shops);
    const filtered = parsed.filter((s: BarberProfile) => s.id !== shopId);
    localStorage.setItem("barber_shops", JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to reject shop", e);
  }
}

export function getAllBookings(): CustomerBooking[] {
  try {
    const bookings = localStorage.getItem("barber_bookings");
    if (!bookings) return [];
    return JSON.parse(bookings);
  } catch (e) {
    console.error("Failed to get all bookings", e);
    return [];
  }
}
