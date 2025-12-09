import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, User, Settings, TrendingUp, CheckCircle2, XCircle, Link as LinkIcon } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/lib/user-context";
import { getBarberShopFromLocalStorage, getBookingsForBarberShop, updateBookingStatus, type CustomerBooking } from "@/lib/services";
import { toast } from "sonner";

export default function BarberDashboard() {
  const { user, logout } = useUser();
  const [, navigate] = useLocation();
  const [shop, setShop] = useState<any>(null);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "barber") {
      navigate("/signin");
      return;
    }

    const barberShop = getBarberShopFromLocalStorage(user.id);
    if (!barberShop) {
      navigate("/barber-onboarding");
      return;
    }

    setShop(barberShop);
    const shopBookings = getBookingsForBarberShop(barberShop.id);
    setBookings(shopBookings);
    setLoading(false);
  }, [user, navigate]);

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, "confirmed");
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: "confirmed" } : b
    ));
    toast("Booking accepted!");
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, "cancelled");
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    ));
    toast("Booking cancelled!");
  };

  if (loading) return null;

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Setting up your shop...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === "confirmed");
  const totalRevenue = upcomingBookings.reduce((sum, b) => sum + b.servicePrice, 0);
  const pendingBookings = bookings.filter(b => b.status === "pending");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Business Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{shop.shopName}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => navigate("/barber-services")} className="rounded-full">
              <Settings className="h-4 w-4 mr-2" />
              Manage Services
            </Button>
            <Button 
              variant="outline"
              onClick={logout}
              className="rounded-full"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card>
             <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                   <Calendar className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-sm text-muted-foreground font-medium">Upcoming Bookings</p>
                   <h3 className="text-2xl font-bold">{upcomingBookings.length}</h3>
                </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                   <DollarSign className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-sm text-muted-foreground font-medium">Potential Revenue</p>
                   <h3 className="text-2xl font-bold">${totalRevenue}</h3>
                </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                   <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-sm text-muted-foreground font-medium">Pending Requests</p>
                   <h3 className="text-2xl font-bold">{pendingBookings.length}</h3>
                </div>
             </CardContent>
           </Card>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Confirmed Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="settings">Shop Info</TabsTrigger>
          </TabsList>
          
          {/* Confirmed Bookings */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Appointments</CardTitle>
                <CardDescription>Your upcoming bookings from customers.</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                         <div className="flex items-start gap-4 flex-grow">
                            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                               <User className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                               <h4 className="font-bold">{booking.userName}</h4>
                               <div className="space-y-1 mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {booking.date}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {booking.time}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{booking.serviceName}</p>
                                    <span className="text-accent font-bold">${booking.servicePrice}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                            <Button variant="ghost" size="sm">Details</Button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No confirmed bookings yet.</p>
                    <p className="text-sm text-muted-foreground">Accept pending requests to see them here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Booking Requests</CardTitle>
                <CardDescription>Review and accept or decline new booking requests.</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-start justify-between p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
                         <div className="flex items-start gap-4 flex-grow">
                            <div className="h-12 w-12 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0">
                               <User className="h-5 w-5 text-yellow-700" />
                            </div>
                            <div>
                               <h4 className="font-bold">{booking.userName}</h4>
                               <div className="space-y-1 mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {booking.date}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {booking.time}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-foreground">{booking.serviceName}</p>
                                    <span className="text-accent font-bold">${booking.servicePrice}</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-2 flex-shrink-0">
                            <Button 
                              size="sm" 
                              className="rounded-full"
                              onClick={() => handleAcceptBooking(booking.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-full text-red-600 hover:text-red-700"
                              onClick={() => handleRejectBooking(booking.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No pending requests at this time.</p>
                    <p className="text-sm text-muted-foreground">We'll notify you when customers book your services.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                   <CardTitle>Services & Pricing</CardTitle>
                   <CardDescription>Manage your service offerings.</CardDescription>
                </div>
                <Button size="sm" onClick={() => navigate("/barber-services")} className="rounded-full">
                  Add/Edit Services
                </Button>
              </CardHeader>
              <CardContent>
                {shop.services.length > 0 ? (
                  <div className="space-y-3">
                     {shop.services.map((service: any) => (
                        <div key={service.id} className="p-4 border rounded-lg flex items-start justify-between">
                           <div className="flex-grow">
                              <h4 className="font-bold">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                              )}
                              <div className="flex gap-3 mt-2">
                                <Badge variant="outline">⏱️ {service.duration} min</Badge>
                                <Badge className="bg-accent/10 text-accent">💰 ${service.price}</Badge>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No services added yet.</p>
                    <Button onClick={() => navigate("/barber-services")} className="rounded-full">
                      Add Your First Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Your shop details (approval status: {shop.approved ? '✓ Approved' : '⏳ Pending'})</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Shop Name</p>
                     <p className="font-bold text-lg">{shop.shopName}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Address</p>
                     <p className="font-bold text-lg">{shop.address}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Phone</p>
                     <p className="font-bold text-lg">{shop.phone}</p>
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Email</p>
                     <p className="font-bold text-lg">{shop.email}</p>
                   </div>
                </div>
                {shop.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{shop.description}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-4">
                    Once approved by our team, your shop will be visible to all customers searching for barber services.
                  </p>
                  <Button variant="outline" className="rounded-full" disabled>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    View Public Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
