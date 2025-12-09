import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Calendar, Clock, MapPin, Edit2, Bell, Settings, LogOut } from "lucide-react";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { getBookingsFromLocalStorage, type CustomerBooking } from "@/lib/services";

export default function CustomerProfile() {
  const { user, logout } = useUser();
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);

  useEffect(() => {
    if (user) {
      const userBookings = getBookingsFromLocalStorage(user.id);
      setBookings(userBookings);
    }
  }, [user]);

  if (!user || user.role !== "customer") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                <Badge className="mt-3 capitalize">{user.role}</Badge>
                
                <div className="grid grid-cols-3 gap-2 mt-6 w-full text-center border-t pt-4">
                  <div>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                    <p className="text-xs text-muted-foreground">Appointments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.6</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
                
                <div className="w-full mt-6 space-y-2">
                  <Button variant="outline" className="w-full rounded-full" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full rounded-full" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full text-red-600 hover:text-red-700"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">{bookings.filter(b => b.status === "confirmed").length}</h3>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">47h</h3>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">6</h3>
                  <p className="text-sm text-muted-foreground">Shops Visited</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Settings className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-bold text-2xl">2</h3>
                  <p className="text-sm text-muted-foreground">Saved</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
            <TabsTrigger value="saved">Saved Shops</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {bookings.filter(b => b.status === "confirmed").length > 0 ? (
              bookings.filter(b => b.status === "confirmed").map(booking => {
                const shop = MOCK_SHOPS.find(s => s.id === booking.shopId);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{booking.shopName}</h3>
                          <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {booking.date} at {booking.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {shop?.address}
                            </div>
                            <div className="text-foreground font-medium">
                              {booking.serviceName} - ${booking.servicePrice}
                            </div>
                            {booking.barberName && (
                              <div className="text-xs text-muted-foreground">
                                Barber: {booking.barberName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
                          <Button variant="outline" size="sm" className="rounded-full text-red-600">Cancel</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>No upcoming appointments. <a href="/" className="text-accent hover:underline">Browse shops</a> to make your first booking!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No past appointments yet.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_SHOPS.filter(s => s.approved).slice(0, 2).map(shop => (
                <Card key={shop.id}>
                  <div className="h-32 overflow-hidden">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.address}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 rounded-full">View</Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-full text-red-600">Remove</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
