import { useRoute, Link } from "wouter";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, MapPin, Clock, Phone, Globe, Scissors, Calendar as CalendarIcon, CheckCircle2, Send 
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getAvailableSlots, addReviewToLocalStorage, getReviewsFromLocalStorage, saveBookingToLocalStorage } from "@/lib/services";
import { useUser } from "@/lib/user-context";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Footer } from "@/components/layout/footer";

export default function ShopDetails() {
  const [match, params] = useRoute("/shop/:id");
  const { user } = useUser();
  const [, navigate] = useLocation();
  const id = params?.id;
  const shop = MOCK_SHOPS.find((s) => s.id === id);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [allReviews, setAllReviews] = useState(getReviewsFromLocalStorage(id || ""));
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && shop) {
      const slots = getAvailableSlots(date, shop.id);
      setAvailableSlots(slots);
      setSelectedTime(null);
    }
  };

  const handleBooking = () => {
    if (!selectedTime) {
      toast("Please select a time");
      return;
    }
    
    if (!user) {
      toast("Please sign in to book");
      setIsBookingOpen(false);
      return;
    }

    if (!selectedDate || !selectedService) {
      toast("Please fill in all fields");
      return;
    }

    const service = shop?.services.find(s => s.id === selectedService);
    const barber = selectedBarber ? shop?.barbers.find(b => b.id === selectedBarber) : null;

    const booking = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      shopId: shop?.id || "",
      shopName: shop?.name || "",
      serviceId: selectedService,
      serviceName: service?.name || "",
      servicePrice: service?.price || 0,
      barberId: selectedBarber || undefined,
      barberName: barber?.name || undefined,
      date: format(selectedDate, "MMM dd, yyyy"),
      time: selectedTime,
      status: "confirmed" as const,
      bookedAt: format(new Date(), "yyyy-MM-dd HH:mm"),
    };

    saveBookingToLocalStorage(booking);
    setIsBookingOpen(false);
    setIsSuccessOpen(true);
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast("Please sign in to leave a review");
      setIsReviewOpen(false);
      return;
    }
    
    if (!reviewComment.trim()) {
      toast("Please enter a comment");
      return;
    }

    const review = {
      id: Math.random().toString(),
      shopId: shop?.id || "",
      authorId: user.id,
      authorName: user.name,
      rating: reviewRating,
      comment: reviewComment,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    addReviewToLocalStorage(review);
    setAllReviews([...allReviews, review]);
    setReviewComment("");
    setReviewRating(5);
    setIsReviewOpen(false);
    toast("Review posted successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Shop Header Images */}
      <div className="h-[40vh] md:h-[50vh] w-full relative overflow-hidden">
         <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 container mx-auto">
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-wider">Open Now</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-2">{shop.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
               <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {shop.address}
               </div>
               <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" /> {shop.rating} ({shop.reviewCount} reviews)
               </div>
            </div>
         </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Services */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{shop.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                 <div className="p-4 rounded-xl bg-muted/30 border flex flex-col items-center text-center gap-2">
                    <Clock className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium">Mon-Sat<br/>9am - 8pm</span>
                 </div>
                 <div className="p-4 rounded-xl bg-muted/30 border flex flex-col items-center text-center gap-2">
                    <Phone className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium">(555) 123-4567</span>
                 </div>
                 <div className="p-4 rounded-xl bg-muted/30 border flex flex-col items-center text-center gap-2">
                    <Globe className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium">Website</span>
                 </div>
              </div>
            </section>

            {/* Services */}
            <section>
               <h2 className="text-2xl font-serif font-bold mb-6">Services</h2>
               <div className="space-y-4">
                 {shop.services.map((service) => (
                   <div 
                     key={service.id} 
                     className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between hover:border-foreground/50 ${selectedService === service.id ? 'border-foreground bg-muted/20 ring-1 ring-foreground/10' : 'bg-card'}`}
                     onClick={() => setSelectedService(service.id)}
                   >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedService === service.id ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                          <Scissors className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.duration} min</p>
                        </div>
                      </div>
                      <div className="font-bold text-lg">${service.price}</div>
                   </div>
                 ))}
               </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">Reviews</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsReviewOpen(true)}
                  className="rounded-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Leave Review
                </Button>
              </div>
              {[...shop.reviews, ...allReviews].length > 0 ? (
                <div className="grid gap-6">
                  {[...shop.reviews, ...allReviews].map((review: any) => (
                    <div key={review.id} className="pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{review.author || review.authorName}</span>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No reviews yet.</p>
              )}
            </section>
          </div>

          {/* Right Column: Booking Sticky Card */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-serif font-bold mb-6">Book Appointment</h3>
                
                <Tabs defaultValue="barber" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="barber">Select Barber</TabsTrigger>
                    <TabsTrigger value="date">Select Date</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="barber" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                       {shop.barbers.map((barber) => (
                         <div 
                            key={barber.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${selectedBarber === barber.id ? 'border-foreground ring-1 ring-foreground' : ''}`}
                            onClick={() => setSelectedBarber(barber.id)}
                         >
                            <img src={barber.avatar} alt={barber.name} className="h-10 w-10 rounded-full object-cover" />
                            <span className="font-medium">{barber.name}</span>
                         </div>
                       ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="date" className="space-y-4">
                     <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        className="rounded-md border w-full"
                        disabled={(date) => date < new Date()}
                      />
                     {availableSlots.length > 0 && (
                       <div>
                         <Label className="text-xs uppercase text-muted-foreground mb-3 block">Select Time</Label>
                         <div className="grid grid-cols-2 gap-2">
                           {availableSlots.map((slot) => (
                             <button
                               key={slot}
                               onClick={() => setSelectedTime(slot)}
                               className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                                 selectedTime === slot
                                   ? 'bg-foreground text-background border-foreground'
                                   : 'bg-muted/30 hover:border-foreground/50'
                               }`}
                             >
                               {slot}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t space-y-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{selectedService ? shop.services.find(s => s.id === selectedService)?.name : "Select a service"}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Barber</span>
                      <span className="font-medium">{selectedBarber ? shop.barbers.find(b => b.id === selectedBarber)?.name : "Any Professional"}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime || "Select time"}</span>
                   </div>
                   <div className="flex justify-between text-lg font-bold pt-2">
                      <span>Total</span>
                      <span>${selectedService ? shop.services.find(s => s.id === selectedService)?.price : 0}</span>
                   </div>

                   <Button 
                    className="w-full h-12 text-lg rounded-full" 
                    disabled={!selectedService || !selectedDate || !selectedTime}
                    onClick={() => setIsBookingOpen(true)}
                   >
                     Continue to Book
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Review your appointment details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                   <CalendarIcon className="h-4 w-4" />
                   {selectedDate ? format(selectedDate, "PPP") : "No date"} at 10:00 AM
                </div>
                <div className="flex items-center gap-2 text-sm">
                   <MapPin className="h-4 w-4" />
                   {shop.name}
                </div>
             </div>
             <p className="text-sm text-muted-foreground">
               Cancellation policy: Free cancellation up to 24 hours before your appointment.
             </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
            <Button onClick={handleBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[425px] text-center">
           <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
           </div>
           <DialogTitle className="text-2xl font-serif mb-2">Booking Confirmed!</DialogTitle>
           <DialogDescription className="mb-6">
             Your appointment has been successfully scheduled. We've sent a confirmation email to you.
           </DialogDescription>
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => setIsSuccessOpen(false)} className="flex-1 rounded-full">
               Continue Browsing
             </Button>
             <Button onClick={() => navigate("/profile")} className="flex-1 rounded-full">
               View My Bookings
             </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience at {shop?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-3 block text-sm font-medium">Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewRating
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review" className="text-sm font-medium">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-1.5 min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Post Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
