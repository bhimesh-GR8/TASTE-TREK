// Lightweight type definitions for frontend use. Backend schema and ORM
// logic have been removed because the app no longer builds with a server.

// Country data shape
export interface Country {
  id: number;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  continent?: string;
}

export type InsertCountry = Omit<Country, "id">;

// Destination data shape
export interface Destination {
  id: number;
  countryId: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
}

export type InsertDestination = Omit<Destination, "id">;

// Restaurant data shape
export interface Restaurant {
  id: number;
  destinationId: number;
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
}

export type InsertRestaurant = Omit<Restaurant, "id">;

// Cultural site data shape
export interface CulturalSite {
  id: number;
  destinationId: number;
  name: string;
  description: string;
  ticketPrice?: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
}

export type InsertCulturalSite = Omit<CulturalSite, "id">;

// Favorite type used by client code
export interface Favorite {
  id: number;
  userId: string;
  itemId: number;
  itemType: "country" | "destination";
  createdAt: string | Date;
}

export type InsertFavorite = Omit<Favorite, "id" | "createdAt">;

// Export auth types as well
export * from "./models/auth";

// Note: server-side code (if any) that used ORM helpers will need to be
// updated separately or removed. These plain types satisfy the client
// type imports without dragging in drizzle dependencies.

