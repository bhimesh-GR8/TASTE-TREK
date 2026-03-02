import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  type InsertFavorite, 
  type Favorite
} from "@shared/schema";
import {
  mockCountriesData,
  mockDestinationsData,
  mockRestaurantsData,
  mockCulturalSitesData,
} from "@/lib/mockData";

// --- Countries ---
export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockCountriesData;
    },
  });
}

export function useCountry(id: number) {
  return useQuery({
    queryKey: ["country", id],
    enabled: !!id,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockCountriesData.find(c => c.id === id) || null;
    },
  });
}

export function useCountryDestinations(id: number) {
  return useQuery({
    queryKey: ["destinations-by-country", id],
    enabled: !!id,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockDestinationsData.filter(d => d.countryId === id);
    },
  });
}

// --- Destinations ---
export function useDestination(id: number) {
  return useQuery({
    queryKey: ["destination", id],
    enabled: !!id,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockDestinationsData.find(d => d.id === id) || null;
    },
  });
}

export function useRestaurants(destinationId: number) {
  return useQuery({
    queryKey: ["restaurants", destinationId],
    enabled: !!destinationId,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockRestaurantsData.filter(r => r.destinationId === destinationId);
    },
  });
}

export function useCulturalSites(destinationId: number) {
  return useQuery({
    queryKey: ["cultural-sites", destinationId],
    enabled: !!destinationId,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockCulturalSitesData.filter(s => s.destinationId === destinationId);
    },
  });
}

// --- Search ---
export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    enabled: query.length > 0,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const lowerQuery = query.toLowerCase();
      const countries = mockCountriesData.filter(
        c => c.name.toLowerCase().includes(lowerQuery) ||
             c.description.toLowerCase().includes(lowerQuery)
      );
      
      const destinations = mockDestinationsData.filter(
        d => d.name.toLowerCase().includes(lowerQuery) ||
             d.description.toLowerCase().includes(lowerQuery)
      );
      
      return { countries, destinations };
    },
  });
}

// --- Favorites (localStorage only) ---
const FAVORITES_KEY = "taste-trek-favorites";

function getLocalFavorites(): Favorite[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalFavorites(favorites: Favorite[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      return getLocalFavorites();
    },
  });
}

export function useCheckFavorite(type: 'country' | 'destination', id: number) {
  return useQuery({
    queryKey: ['check-favorite', type, id],
    enabled: !!id,
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const favorites = getLocalFavorites();
      const isFavorite = favorites.some(fav => fav.itemType === type && fav.itemId === id);
      const favorite = favorites.find(fav => fav.itemType === type && fav.itemId === id);
      
      return { isFavorite, favoriteId: favorite?.id };
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  // Add favorite
  const add = useMutation({
    mutationFn: async (data: InsertFavorite) => {
      const favorites = getLocalFavorites();
      const newFavorite: Favorite = {
        id: Math.max(...favorites.map(f => f.id || 0), 0) + 1,
        ...data,
        userId: "local-user",
        createdAt: new Date(),
      } as Favorite;
      
      favorites.push(newFavorite);
      setLocalFavorites(favorites);
      
      return newFavorite;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ['check-favorite', variables.itemType, variables.itemId] });
    },
  });

  // Remove favorite
  const remove = useMutation({
    mutationFn: async (id: number) => {
      const favorites = getLocalFavorites();
      const favorite = favorites.find(f => f.id === id);
      const filtered = favorites.filter(f => f.id !== id);
      setLocalFavorites(filtered);
      return favorite;
    },
    onSuccess: (favorite) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      if (favorite) {
        queryClient.invalidateQueries({ queryKey: ['check-favorite', favorite.itemType, favorite.itemId] });
      }
    },
  });

  return { add, remove };
}

