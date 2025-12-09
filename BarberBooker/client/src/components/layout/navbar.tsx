import { Link, useLocation } from "wouter";
import { Scissors, User, Shield, Menu, X, LogOut, Calendar, Settings, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const navLinks = [
    { href: "/", label: "Discover", icon: Scissors },
  ];

  // Add Admin tab only for admin users
  if (user?.role === "admin") {
    navLinks.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-sm bg-foreground text-background flex items-center justify-center">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">Trim & Proper</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`text-sm font-medium transition-colors hover:text-foreground/80 cursor-pointer flex items-center gap-2 ${
                  location === link.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </span>
            </Link>
          ))}
          <div className="ml-4 pl-4 border-l border-border h-6 flex items-center gap-3">
            {user?.role === "barber" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                    <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full" />
                    <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-semibold">{user.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-xs text-muted-foreground py-1">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/barber">
                    <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      Today's Bookings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/barber">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Profile / Setup
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/barber">
                    <DropdownMenuItem className="cursor-pointer">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Performance / Reports
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/barber">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full px-3">
                    <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="text-xs font-medium capitalize">
                    {user.role}
                  </DropdownMenuItem>
                  {user.role === "customer" && (
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm" className="font-medium rounded-full px-4">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="font-medium rounded-full px-6">
                    Join as a Barber
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md px-2 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </div>
            </Link>
          ))}

          {user?.role === "barber" && (
            <div className="border-t border-border pt-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-2">{user.name}</div>
              <Link href="/barber">
                <div
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md px-2 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4" />
                  Today's Bookings
                </div>
              </Link>
              <Link href="/barber">
                <div
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md px-2 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Profile / Setup
                </div>
              </Link>
              <Link href="/barber">
                <div
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md px-2 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-4 w-4" />
                  Performance / Reports
                </div>
              </Link>
              <Link href="/barber">
                <div
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md px-2 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </Link>
            </div>
          )}

          <div className="pt-2 space-y-2 border-t border-border">
            {user ? (
              <Button className="w-full rounded-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="outline">
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/signin">
                  <Button className="w-full rounded-full" variant="outline" onClick={() => setIsMobileMenuOpen(false)}>Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Join as a Barber</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
