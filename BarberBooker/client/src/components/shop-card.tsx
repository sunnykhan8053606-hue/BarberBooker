import { Link } from "wouter";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Shop } from "@/lib/mock-data";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shop/${shop.id}`}>
      <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col bg-card">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-xs font-bold text-foreground">{shop.rating}</span>
            <span className="text-xs text-muted-foreground">({shop.reviewCount})</span>
          </div>
        </div>
        <CardContent className="p-5 flex-grow">
          <h3 className="font-serif text-xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
            {shop.name}
          </h3>
          <div className="flex items-start gap-2 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{shop.address}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shop.description}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 mt-auto">
          <Button variant="outline" className="w-full group-hover:bg-foreground group-hover:text-background transition-colors rounded-full">
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
