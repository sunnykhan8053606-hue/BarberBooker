import { useState, createContext, useContext } from "react";

export type BookingState = {
  selectedShopId: string | null;
  selectedServiceId: string | null;
  selectedBarberId: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
};

type BookingContextType = {
  booking: BookingState;
  setBooking: (booking: BookingState) => void;
  resetBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBooking: BookingState = {
  selectedShopId: null,
  selectedServiceId: null,
  selectedBarberId: null,
  selectedDate: null,
  selectedTime: null,
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialBooking);

  const resetBooking = () => {
    setBooking(initialBooking);
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
