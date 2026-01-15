import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { 
  type InsertFavorite, 
  type Favorite
} from "@shared/schema";

// --- Countries ---
export function useCountries() {
  return useQuery({
    queryKey: [api.countries.list.path],
    queryFn: async () => {
      const res = await fetch(api.countries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return api.countries.list.responses[200].parse(await res.json());
    },
  });
}

export function useCountry(id: number) {
  return useQuery({
    queryKey: [api.countries.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.countries.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch country");
      return api.countries.get.responses[200].parse(await res.json());
    },
  });
}

export function useCountryDestinations(id: number) {
  return useQuery({
    queryKey: [api.countries.destinations.path, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.countries.destinations.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch destinations");
      return api.countries.destinations.responses[200].parse(await res.json());
    },
  });
}

// --- Destinations ---
export function useDestination(id: number) {
  return useQuery({
    queryKey: [api.destinations.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.destinations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch destination");
      return api.destinations.get.responses[200].parse(await res.json());
    },
  });
}

export function useRestaurants(destinationId: number) {
  return useQuery({
    queryKey: [api.destinations.restaurants.path, destinationId],
    enabled: !!destinationId,
    queryFn: async () => {
      const url = buildUrl(api.destinations.restaurants.path, { id: destinationId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      return api.destinations.restaurants.responses[200].parse(await res.json());
    },
  });
}

export function useCulturalSites(destinationId: number) {
  return useQuery({
    queryKey: [api.destinations.culturalSites.path, destinationId],
    enabled: !!destinationId,
    queryFn: async () => {
      const url = buildUrl(api.destinations.culturalSites.path, { id: destinationId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cultural sites");
      return api.destinations.culturalSites.responses[200].parse(await res.json());
    },
  });
}

// --- Search ---
export function useSearch(query: string) {
  return useQuery({
    queryKey: [api.search.path, query],
    enabled: query.length > 0,
    queryFn: async () => {
      const url = `${api.search.path}?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      return api.search.responses[200].parse(await res.json());
    },
  });
}

// --- Favorites ---
export function useFavorites() {
  return useQuery({
    queryKey: [api.favorites.list.path],
    queryFn: async () => {
      const res = await fetch(api.favorites.list.path, { credentials: "include" });
      if (res.status === 401) return []; // Return empty if not authorized
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return api.favorites.list.responses[200].parse(await res.json());
    },
  });
}

export function useCheckFavorite(type: 'country' | 'destination', id: number) {
  return useQuery({
    queryKey: ['check-favorite', type, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.favorites.check.path, { type, id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 401) return { isFavorite: false };
      if (!res.ok) throw new Error("Failed to check favorite");
      return api.favorites.check.responses[200].parse(await res.json());
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  // Add favorite
  const add = useMutation({
    mutationFn: async (data: InsertFavorite) => {
      const res = await fetch(api.favorites.create.path, {
        method: api.favorites.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to add favorite');
      return api.favorites.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.favorites.list.path] });
      queryClient.invalidateQueries({ queryKey: ['check-favorite', variables.itemType, variables.itemId] });
    },
  });

  // Remove favorite
  const remove = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.favorites.delete.path, { id });
      const res = await fetch(url, {
        method: api.favorites.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error('Failed to remove favorite');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.favorites.list.path] });
      queryClient.invalidateQueries({ queryKey: ['check-favorite'] }); // Broad invalidation for simplicity
    },
  });

  return { add, remove };
}
