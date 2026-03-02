import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

// Local user storage key
const LOCAL_USER_KEY = "taste-trek-user";
const SESSION_KEY = "taste-trek-session";

async function fetchUser(): Promise<User | null> {
  // Check if session is still valid
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    localStorage.removeItem(LOCAL_USER_KEY);
    return null;
  }

  try {
    const sessionData = JSON.parse(session);
    // Session expires after 30 days
    const signedInTime = new Date(sessionData.signedInAt).getTime();
    const now = new Date().getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (now - signedInTime > thirtyDays) {
      localStorage.removeItem(LOCAL_USER_KEY);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }

  // Get user from localStorage
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }

  return null;
}

async function logout(): Promise<void> {
  try {
    // Call the logout API endpoint to clear session on server
    await fetch("/api/logout", { method: "GET" });
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  // Clear only session and current user, NOT the users registry
  // This allows users to sign back in with their registered accounts
  localStorage.removeItem(LOCAL_USER_KEY);
  localStorage.removeItem(SESSION_KEY);
  
  // Redirect to home
  window.location.href = "/";
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0, // Always refetch on invalidation
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

