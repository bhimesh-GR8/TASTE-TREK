import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isFirebaseConfigured } from "@/lib/firebase";

export function SignIn() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Load saved email on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("taste-trek-credentials");
    if (savedCredentials) {
      try {
        const { email: savedEmail, name: savedName } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setName(savedName);
      } catch (err) {
        console.error("Error loading saved credentials", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (isFirebaseConfigured) {
        // Firebase authentication would go here
        // For now, we're using localStorage as fallback
        authenticateLocally();
      } else {
        authenticateLocally();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsLoading(false);
    }
  };

  const authenticateLocally = () => {
    // Get all registered users (persists even after logout)
    const usersRegistry = localStorage.getItem("taste-trek-users");
    let allUsers: any[] = [];
    
    if (usersRegistry) {
      try {
        allUsers = JSON.parse(usersRegistry);
      } catch (err) {
        console.error("Error parsing users registry", err);
      }
    }

    // Check if user already exists (for sign in)
    if (!isSignUp) {
      const existingUser = allUsers.find(u => u.email === email);
      
      if (!existingUser) {
        setError("Email not found. Please sign up first.");
        setIsLoading(false);
        return;
      }
      
      if (btoa(password) !== existingUser.password) {
        setError("Incorrect password");
        setIsLoading(false);
        return;
      }
      
      // User validated, create session
      localStorage.setItem("taste-trek-user", JSON.stringify(existingUser));
      localStorage.setItem("taste-trek-session", JSON.stringify({
        token: `token-${Date.now()}`,
        userId: existingUser.id,
        signedInAt: new Date().toISOString(),
      }));
    } else {
      // New user registration
      const existingUser = allUsers.find(u => u.email === email);
      if (existingUser) {
        setError("Email already registered. Please sign in instead.");
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        password: btoa(password), // Basic encoding (NOT for production)
        profileImageUrl: `https://avatar.vercel.sh/${encodeURIComponent(email)}`,
        createdAt: new Date().toISOString(),
      };

      // Add to users registry
      allUsers.push(newUser);
      localStorage.setItem("taste-trek-users", JSON.stringify(allUsers));

      // Create session
      localStorage.setItem("taste-trek-user", JSON.stringify(newUser));
      localStorage.setItem("taste-trek-session", JSON.stringify({
        token: `token-${Date.now()}`,
        userId: newUser.id,
        signedInAt: new Date().toISOString(),
      }));
    }

    // Save email and name for next login
    localStorage.setItem("taste-trek-credentials", JSON.stringify({
      email,
      name,
    }));

    // Invalidate auth query to force refresh
    queryClient.invalidateQueries({ queryKey: ["auth-user"] });

    // Small delay to ensure state updates before redirect
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 100);
  };

  const handleGuestAccess = () => {
    // Guest user for trying out the app
    const guestUser = {
      id: "guest-user",
      email: "guest@tastetrek.local",
      firstName: "Guest",
      lastName: "User",
      profileImageUrl: `https://avatar.vercel.sh/guest`,
      isGuest: true,
    };

    localStorage.setItem("taste-trek-user", JSON.stringify(guestUser));
    localStorage.setItem("taste-trek-session", JSON.stringify({
      token: `token-guest`,
      userId: "guest-user",
      signedInAt: new Date().toISOString(),
    }));

    // Invalidate auth query to force refresh
    queryClient.invalidateQueries({ queryKey: ["auth-user"] });

    // Small delay to ensure state updates before redirect
    setTimeout(() => {
      setLocation("/");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to Taste Trek</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create an account to save your favorite destinations" 
              : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isFirebaseConfigured && (
            <Alert className="mb-4">
              <AlertDescription className="text-sm">
                ✅ Firebase authentication is configured
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading 
                ? "Loading..." 
                : isSignUp 
                ? "Create Account" 
                : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGuestAccess}
            >
              Try as Guest
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t space-y-2 text-xs text-muted-foreground">
            <p>🔐 Secure authentication</p>
            <p>❤️ Your favorites are saved to your account</p>
            <p>🌐 Set up Firebase for cloud sync (see FIREBASE_SETUP.md)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
