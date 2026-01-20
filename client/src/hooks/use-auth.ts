import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { User } from "@shared/models/auth";

// Simple local auth for development
const LOCAL_USER_KEY = "taste-trek-user";

async function fetchUser(): Promise<User | null> {
  // Try to get from localStorage first
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }

  // Try API endpoint (for OIDC authentication if available)
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch {
    return null;
  }
}

async function logout(): Promise<void> {
  localStorage.removeItem(LOCAL_USER_KEY);
  // Try API logout if available
  try {
    window.location.href = "/api/logout";
  } catch {
    window.location.reload();
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
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
