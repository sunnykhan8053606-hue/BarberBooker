import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { ShopCard } from "@/components/shop-card";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Footer } from "@/components/layout/footer";
import heroImage from "@assets/generated_images/modern_barber_shop_interior.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  
  const approvedShops = MOCK_SHOPS.filter(s => s.approved);
  const filteredShops = approvedShops
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(s => s.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Barber Shop Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
            Elevate Your <br/>
            <span className="text-accent italic">Grooming Routine</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto font-light">
            Discover top-rated barber shops, book appointments instantly, and experience the art of grooming.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full max-w-xl mx-auto flex items-center shadow-2xl">
             <div className="pl-4 text-white/60">
               <MapPin className="h-5 w-5" />
             </div>
             <Input 
               className="border-none bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0 h-12 text-lg"
               placeholder="Find a shop near you..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-semibold">
               Search
             </Button>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="container mx-auto px-4 py-20 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
             <h2 className="text-3xl font-serif font-bold text-foreground">Featured Shops</h2>
             <p className="text-muted-foreground mt-2">{filteredShops.length} shops available</p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full flex items-center gap-2">
                  Sort: {sortBy === "rating" ? "Top Rated" : "Name"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  {sortBy === "rating" && "✓"} Top Rated
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  {sortBy === "name" && "✓"} Name (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[0, 4, 4.5].map((rating) => (
                  <DropdownMenuCheckboxItem
                    key={rating}
                    checked={minRating === rating}
                    onCheckedChange={() => setMinRating(rating)}
                  >
                    {rating === 0 ? "All Ratings" : `${rating}+ stars`}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No shops found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 rounded-full"
              onClick={() => {
                setSearchQuery("");
                setMinRating(0);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
      
      {/* CTA Section */}
      <section className="bg-foreground py-20 text-background">
         <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Are you a Barber?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Join our exclusive network of professionals. Manage your bookings, build your reputation, and grow your business.
            </p>
            <Link href="/barber">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full px-8">
                Partner With Us
              </Button>
            </Link>
         </div>
      </section>
      
      <Footer />
    </div>
  );
}
