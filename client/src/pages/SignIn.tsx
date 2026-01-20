import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Create a simple user object and store it
      const user = {
        id: `user-${Date.now()}`,
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        profileImageUrl: `https://avatar.vercel.sh/${email}`,
      };

      // Store in localStorage
      localStorage.setItem("taste-trek-user", JSON.stringify(user));

      // Invalidate and refetch auth
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to Taste Trek</CardTitle>
          <CardDescription>
            Sign in to save your favorite destinations and restaurants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t space-y-2 text-sm text-muted-foreground">
            <p>📝 Demo mode: Sign in with any email</p>
            <p>❤️ Your favorites will be saved locally</p>
            <p>🔒 No password required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
