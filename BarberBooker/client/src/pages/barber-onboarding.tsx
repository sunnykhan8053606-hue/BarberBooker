import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";
import { saveBarberShopToLocalStorage } from "@/lib/services";
import { Scissors } from "lucide-react";

export default function BarberOnboarding() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  // Shop details
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [description, setDescription] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [uniquePoints, setUniquePoints] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!user || user.role !== "barber") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please sign in as a barber to continue</p>
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCreateShop = () => {
    if (!shopName.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      toast("Please fill in all required fields");
      return;
    }

    if (imageUrl.trim() && !validateUrl(imageUrl)) {
      setImageError("Please enter a valid URL");
      return;
    }

    if (!startingPrice.trim() || !priceRange.trim()) {
      toast("Please set your price range");
      return;
    }

    setImageError("");

    const profile = {
      id: `shop_${Math.random().toString()}`,
      userId: user.id,
      shopName,
      description,
      specialties,
      uniquePoints,
      startingPrice: parseFloat(startingPrice),
      priceRange: parseFloat(priceRange),
      image: imageUrl.trim() || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      address,
      phone,
      email,
      services: [],
      approved: false,
      createdAt: new Date().toISOString(),
    };

    saveBarberShopToLocalStorage(profile);
    toast("Shop profile created! Waiting for admin approval.");
    navigate("/barber");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="h-16 w-16 bg-accent text-background rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">Welcome to GentleGroom</h1>
            <p className="text-muted-foreground text-lg">
              Set up your barber shop and start receiving bookings
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  s <= step ? "bg-accent" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Shop Details */}
          {step === 1 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Shop Details</CardTitle>
                <CardDescription>Tell us about your barbershop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="shopName" className="text-base font-medium">
                    Shop Name *
                  </Label>
                  <Input
                    id="shopName"
                    placeholder="e.g., The Dapper Gentleman"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-base font-medium">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main St, Downtown"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1.5 h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="(123) 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shop@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-base font-medium">
                    Shop Image URL
                    <span className="text-xs text-muted-foreground font-normal ml-2">(Optional)</span>
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/shop-image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (imageError) setImageError("");
                    }}
                    className="mt-1.5 h-10"
                  />
                  {imageError && (
                    <p className="text-xs text-red-600 mt-1.5">{imageError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Direct URL to your shop's main image or storefront photo
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers about your shop, specialties, and what makes you unique..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1.5 min-h-24"
                  />
                </div>

                <div className="pt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-12 text-lg rounded-full"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Specialties & Unique Selling Points */}
          {step === 2 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">About Your Services</CardTitle>
                <CardDescription>Tell customers what you specialize in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="specialties" className="text-base font-medium">
                    Shop Specialties & Services *
                  </Label>
                  <Textarea
                    id="specialties"
                    placeholder="List your main services (e.g., Haircuts, Shaves, Beard Trims, Facials, etc.)"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="mt-1.5 min-h-24"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    List all the services you offer to help customers know what to expect
                  </p>
                </div>

                <div>
                  <Label htmlFor="uniquePoints" className="text-base font-medium">
                    What Makes You Unique? *
                  </Label>
                  <Textarea
                    id="uniquePoints"
                    placeholder="Highlight your unique selling points (e.g., Traditional Techniques, Modern Styles, Relaxing Atmosphere, Custom Consultations)"
                    value={uniquePoints}
                    onChange={(e) => setUniquePoints(e.target.value)}
                    className="mt-1.5 min-h-24"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Tell customers what sets your shop apart from others
                  </p>
                </div>

                <div className="pt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 text-lg rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 h-12 text-lg rounded-full"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Set Your Price Range</CardTitle>
                <CardDescription>Indicate your pricing in Pakistani Rupees (PKR)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-foreground">
                    💡 <span className="font-medium">Pro Tip:</span> Competitive pricing helps you attract more bookings. You can always adjust prices later.
                  </p>
                </div>

                <div>
                  <Label htmlFor="startingPrice" className="text-base font-medium">
                    Starting Price (Basic Haircut) - PKR *
                  </Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    placeholder="e.g., 500"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="mt-1.5 h-10"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    The starting price for your most basic service (e.g., simple haircut)
                  </p>
                </div>

                <div>
                  <Label htmlFor="priceRange" className="text-base font-medium">
                    Standard Service Price - PKR *
                  </Label>
                  <Input
                    id="priceRange"
                    type="number"
                    placeholder="e.g., 1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="mt-1.5 h-10"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Your general price range for standard services (e.g., premium haircut with beard trim)
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">Your Price Range:</span><br/>
                    Starting from <span className="font-bold">PKR {startingPrice || "—"}</span> to <span className="font-bold">PKR {priceRange || "—"}</span>
                  </p>
                </div>

                <div className="pt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-12 text-lg rounded-full"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateShop}
                    className="flex-1 h-12 text-lg rounded-full"
                  >
                    Create Shop Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
