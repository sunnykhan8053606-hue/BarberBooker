import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { toast } from "sonner";

// Hardcoded admin credentials
const ADMIN_EMAIL = "muhammadawais8051606@gmail.com";
const ADMIN_PASSWORD = "Awais@909";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Verify credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error("Invalid email or password");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email, password, "admin");
      toast.success("Welcome Admin! Signed in successfully");
      navigate("/admin");
      setIsLoading(false);
    }, 500);
  };

  const handleFillCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md border-l-4 border-l-accent">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif">Admin Portal</CardTitle>
            <CardDescription>Exclusive access for platform administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full h-10 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Mode</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline"
                className="w-full rounded-full h-10 font-medium"
                onClick={handleFillCredentials}
                disabled={isLoading}
              >
                Fill Demo Credentials
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-900">
                  <span className="font-bold">Demo Credentials:</span><br/>
                  Email: muhammadawais8051606@gmail.com<br/>
                  Password: Awais@909
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
