import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

export default function SignIn() {
  const [, navigate] = useLocation();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "barber" | "admin">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email, password, role);
      toast.success(`Welcome back! Signed in as ${role}`);
      
      // Redirect based on role
      if (role === "barber") {
        navigate("/barber");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Trim & Proper account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(["customer", "barber"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                      role === r
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full h-10" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-foreground hover:underline cursor-pointer font-medium">
                    Sign up
                  </span>
                </Link>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t text-xs text-muted-foreground space-y-1">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Email: <span className="font-mono bg-muted px-1 rounded">demo@example.com</span></p>
              <p>Pass: <span className="font-mono bg-muted px-1 rounded">demo</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
