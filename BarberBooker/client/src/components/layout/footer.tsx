import { Link } from "wouter";
import { Scissors, Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer mb-4">
                <div className="h-8 w-8 rounded-sm bg-white text-zinc-900 flex items-center justify-center">
                  <Scissors className="h-5 w-5" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white">Trim & Proper</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
              The premier destination for the modern gentleman to discover and book world-class grooming experiences.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Find a Shop</span></Link></li>
              <li><Link href="/barber"><span className="hover:text-white transition-colors cursor-pointer">For Barbers</span></Link></li>
              <li><Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Style Guide</span></Link></li>
              <li><Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Gift Cards</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-serif font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><Link href="/admin"><span className="hover:text-white transition-colors cursor-pointer">Admin Portal</span></Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-serif font-bold mb-4">Stay Sharp</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Subscribe to our newsletter for grooming tips and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Email address" 
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
              />
              <Button variant="secondary" className="shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Trim & Proper. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
