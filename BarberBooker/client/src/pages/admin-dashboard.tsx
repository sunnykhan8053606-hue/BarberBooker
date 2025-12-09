import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Check, X, ShieldAlert, MapPin, Phone, Mail, DollarSign, Briefcase, Calendar, TrendingUp, LogOut } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/lib/user-context";
import { 
  getPendingBarberShops, 
  getApprovedBarberShops, 
  approveBarberShop, 
  rejectBarberShop, 
  getAllBookings,
  type BarberProfile,
  type CustomerBooking
} from "@/lib/services";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout } = useUser();
  const [, navigate] = useLocation();
  const [pendingShops, setPendingShops] = useState<BarberProfile[]>([]);
  const [approvedShops, setApprovedShops] = useState<BarberProfile[]>([]);
  const [allBookings, setAllBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<BarberProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/signin");
      return;
    }

    const pending = getPendingBarberShops();
    const approved = getApprovedBarberShops();
    const bookings = getAllBookings();

    setPendingShops(pending);
    setApprovedShops(approved);
    setAllBookings(bookings);
    setLoading(false);
  }, [user, navigate]);

  const handleApprove = (shop: BarberProfile) => {
    approveBarberShop(shop.id);
    setPendingShops(pendingShops.filter(s => s.id !== shop.id));
    setApprovedShops([...approvedShops, { ...shop, approved: true }]);
    toast("✅ Shop approved successfully!");
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    if (!selectedShop) return;
    rejectBarberShop(selectedShop.id);
    setPendingShops(pendingShops.filter(s => s.id !== selectedShop.id));
    toast("❌ Shop rejected and removed.");
    setRejectReason("");
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
  };

  const confirmedBookings = allBookings.filter(b => b.status === "confirmed");
  const totalRevenuePotential = confirmedBookings.reduce((sum, b) => sum + b.servicePrice, 0);

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-md bg-accent text-background flex items-center justify-center">
               <ShieldAlert className="h-6 w-6" />
             </div>
             <div>
               <h1 className="text-3xl font-serif font-bold">Admin Control Panel</h1>
               <p className="text-muted-foreground">Platform moderation and approvals • Welcome, {user.name}</p>
             </div>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-full">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Approvals</p>
                <h3 className="text-2xl font-bold">{pendingShops.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Shops</p>
                <h3 className="text-2xl font-bold">{approvedShops.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Bookings</p>
                <h3 className="text-2xl font-bold">{allBookings.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Revenue Potential</p>
                <h3 className="text-2xl font-bold">PKR {totalRevenuePotential.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending Approvals
              {pendingShops.length > 0 && <Badge variant="destructive" className="ml-2 h-5 px-1.5 rounded-full">{pendingShops.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="approved">Active Shops ({approvedShops.length})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({allBookings.length})</TabsTrigger>
          </TabsList>
          
          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-6">
            {pendingShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingShops.map(shop => (
                  <Card key={shop.id} className="overflow-hidden border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                    <div className="h-48 w-full overflow-hidden">
                      <img src={shop.image} alt={shop.shopName} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{shop.shopName}</CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {shop.address}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Review Needed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-3">{shop.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs border p-3 rounded bg-muted/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{shop.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">{shop.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>PKR {shop.startingPrice} - {shop.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Services: {shop.services.length}</span>
                        </div>
                      </div>
                      {shop.specialties && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Specialties:</p>
                          <p className="text-xs text-muted-foreground">{shop.specialties}</p>
                        </div>
                      )}
                      {shop.uniquePoints && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Unique Points:</p>
                          <p className="text-xs text-muted-foreground">{shop.uniquePoints}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-3 bg-muted/10">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                        onClick={() => handleApprove(shop)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 rounded-full"
                        onClick={() => {
                          setSelectedShop(shop);
                          setShowRejectDialog(true);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">No pending approvals 🎉</p>
                  <p className="text-sm text-muted-foreground mt-2">All barber shops have been reviewed.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Approved Shops Tab */}
          <TabsContent value="approved" className="space-y-6">
            {approvedShops.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <div className="p-4 border-b bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm sticky top-0">
                  <div className="col-span-4">Shop Name</div>
                  <div className="col-span-3">Location</div>
                  <div className="col-span-2">Price Range</div>
                  <div className="col-span-3 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {approvedShops.map(shop => (
                    <div key={shop.id} className="p-4 grid grid-cols-12 gap-4 items-center text-sm hover:bg-muted/30 transition-colors">
                      <div className="col-span-4 font-medium flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                          <img src={shop.image} alt={shop.shopName} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold">{shop.shopName}</p>
                          <p className="text-xs text-muted-foreground">{shop.address}</p>
                        </div>
                      </div>
                      <div className="col-span-3 text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {shop.address}
                      </div>
                      <div className="col-span-2 text-sm font-medium">
                        PKR {shop.startingPrice.toLocaleString()} - {shop.priceRange.toLocaleString()}
                      </div>
                      <div className="col-span-3 text-right flex justify-end gap-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedShop(shop);
                            setShowDetailsDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">No approved shops yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Review pending applications to activate shops.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {allBookings.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <div className="p-4 border-b bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm sticky top-0">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Shop</div>
                  <div className="col-span-2">Service</div>
                  <div className="col-span-2">Date & Time</div>
                  <div className="col-span-2">Status & Price</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {allBookings.map(booking => (
                    <div key={booking.id} className="p-4 grid grid-cols-12 gap-4 items-center text-sm hover:bg-muted/30 transition-colors">
                      <div className="col-span-3">
                        <p className="font-medium">{booking.userName}</p>
                        <p className="text-xs text-muted-foreground">{booking.userId}</p>
                      </div>
                      <div className="col-span-2 text-sm">
                        <p className="font-medium">{booking.shopName}</p>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {booking.serviceName}
                      </div>
                      <div className="col-span-2 text-sm">
                        <p>{booking.date}</p>
                        <p className="text-xs text-muted-foreground">{booking.time}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Badge 
                          className={booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {booking.status}
                        </Badge>
                        <span className="font-medium">PKR {booking.servicePrice}</span>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="sm" disabled>
                          —
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">No bookings yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Bookings will appear here as customers make reservations.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Shop Application?</DialogTitle>
            <DialogDescription>
              {selectedShop?.shopName} will be removed from pending approvals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Reason (optional)</label>
              <textarea
                placeholder="Why are you rejecting this application?"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full mt-1.5 p-2 border rounded text-sm min-h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shop Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedShop?.shopName}</DialogTitle>
            <DialogDescription>{selectedShop?.address}</DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedShop.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedShop.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Price Range (PKR)</p>
                  <p className="font-medium">{selectedShop.startingPrice} - {selectedShop.priceRange}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Services</p>
                  <p className="font-medium">{selectedShop.services.length} services</p>
                </div>
              </div>
              {selectedShop.description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedShop.description}</p>
                </div>
              )}
              {selectedShop.specialties && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Specialties</p>
                  <p className="text-sm">{selectedShop.specialties}</p>
                </div>
              )}
              {selectedShop.uniquePoints && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Unique Points</p>
                  <p className="text-sm">{selectedShop.uniquePoints}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
