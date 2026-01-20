import { connection } from "./db";
import { eq, ilike, or, and } from "drizzle-orm";
import {
  countries, destinations, restaurants, culturalSites, favorites,
  type Country, type InsertCountry,
  type Destination, type InsertDestination,
  type Restaurant, type InsertRestaurant,
  type CulturalSite, type InsertCulturalSite,
  type Favorite, type InsertFavorite
} from "@shared/schema";

// Helper to get db instance with proper typing
function getDb(): any {
  if (!connection.db) {
    throw new Error("Database not connected");
  }
  return connection.db as any;
}

type AnyFavorite = any;

export interface IStorage {
  // Countries
  getCountries(): Promise<Country[]>;
  getCountry(id: number): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  
  // Destinations
  getDestinationsByCountry(countryId: number): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Restaurants
  getRestaurantsByDestination(destinationId: number): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Cultural Sites
  getCulturalSitesByDestination(destinationId: number): Promise<CulturalSite[]>;
  createCulturalSite(site: InsertCulturalSite): Promise<CulturalSite>;

  // Search
  search(query: string): Promise<{ countries: Country[], destinations: Destination[] }>;

  // Favorites
  getFavorites(userId: string): Promise<(Favorite & { item: any })[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number, userId: string): Promise<void>;
  getFavoriteByItem(userId: string, type: string, id: number): Promise<Favorite | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCountries(): Promise<Country[]> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    return await db.select().from(countries);
  }

  async getCountry(id: number): Promise<Country | undefined> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }

  async createCountry(country: InsertCountry): Promise<Country> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [newCountry] = await db.insert(countries).values(country).returning();
    return newCountry;
  }

  async getDestinationsByCountry(countryId: number): Promise<Destination[]> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    return await db.select().from(destinations).where(eq(destinations.countryId, countryId));
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [dest] = await db.select().from(destinations).where(eq(destinations.id, id));
    return dest;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [newDest] = await db.insert(destinations).values(destination).returning();
    return newDest;
  }

  async getRestaurantsByDestination(destinationId: number): Promise<Restaurant[]> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    return await db.select().from(restaurants).where(eq(restaurants.destinationId, destinationId));
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [newRest] = await db.insert(restaurants).values(restaurant).returning();
    return newRest;
  }

  async getCulturalSitesByDestination(destinationId: number): Promise<CulturalSite[]> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    return await db.select().from(culturalSites).where(eq(culturalSites.destinationId, destinationId));
  }

  async createCulturalSite(site: InsertCulturalSite): Promise<CulturalSite> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [newSite] = await db.insert(culturalSites).values(site).returning();
    return newSite;
  }

  async search(query: string): Promise<{ countries: Country[], destinations: Destination[] }> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const lowerQuery = `%${query.toLowerCase()}%`;
    const foundCountries = await db.select().from(countries)
      .where(or(ilike(countries.name, lowerQuery), ilike(countries.description, lowerQuery)));
    
    const foundDestinations = await db.select().from(destinations)
      .where(or(ilike(destinations.name, lowerQuery), ilike(destinations.description, lowerQuery)));

    return { countries: foundCountries, destinations: foundDestinations };
  }

  async getFavorites(userId: string): Promise<(Favorite & { item: any })[]> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    
    // Populate items - a bit inefficient but workable for MVP
    const populatedFavorites = await Promise.all(userFavorites.map(async (fav: AnyFavorite) => {
      let item = null;
      if (fav.itemType === 'country') {
        item = await this.getCountry(fav.itemId);
      } else if (fav.itemType === 'destination') {
        item = await this.getDestination(fav.itemId);
      }
      return { ...fav, item };
    }));

    return populatedFavorites.filter(f => f.item !== undefined);
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [newFav] = await db.insert(favorites).values(favorite).returning();
    return newFav;
  }

  async deleteFavorite(id: number, userId: string): Promise<void> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    await db.delete(favorites).where(
      and(eq(favorites.id, id), eq(favorites.userId, userId))
    );
  }

  async getFavoriteByItem(userId: string, type: string, id: number): Promise<Favorite | undefined> {
    const db = getDb();
    if (!db) throw new Error("Database not connected");
    const [fav] = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.itemType, type),
        eq(favorites.itemId, id)
      )
    );
    return fav;
  }
}

// In-memory storage for development/fallback
class InMemoryStorage implements IStorage {
  private countriesData: (Country & { id: number })[] = [];
  private destinationsData: (Destination & { id: number })[] = [];
  private restaurantsData: (Restaurant & { id: number })[] = [];
  private culturalSitesData: (CulturalSite & { id: number })[] = [];
  private favoritesData: (Favorite & { id: number })[] = [];
  private nextCountryId = 1;
  private nextDestinationId = 1;
  private nextRestaurantId = 1;
  private nextSiteId = 1;
  private nextFavoriteId = 1;

  async getCountries(): Promise<Country[]> {
    return this.countriesData;
  }

  async getCountry(id: number): Promise<Country | undefined> {
    return this.countriesData.find(c => c.id === id);
  }

  async createCountry(country: InsertCountry): Promise<Country> {
    const newCountry = { ...country, id: this.nextCountryId++ } as Country & { id: number };
    this.countriesData.push(newCountry);
    return newCountry;
  }

  async getDestinationsByCountry(countryId: number): Promise<Destination[]> {
    return this.destinationsData.filter(d => d.countryId === countryId);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinationsData.find(d => d.id === id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const newDest = { ...destination, id: this.nextDestinationId++ } as Destination & { id: number };
    this.destinationsData.push(newDest);
    return newDest;
  }

  async getRestaurantsByDestination(destinationId: number): Promise<Restaurant[]> {
    return this.restaurantsData.filter(r => r.destinationId === destinationId);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const newRest = { ...restaurant, id: this.nextRestaurantId++ } as Restaurant & { id: number };
    this.restaurantsData.push(newRest);
    return newRest;
  }

  async getCulturalSitesByDestination(destinationId: number): Promise<CulturalSite[]> {
    return this.culturalSitesData.filter(s => s.destinationId === destinationId);
  }

  async createCulturalSite(site: InsertCulturalSite): Promise<CulturalSite> {
    const newSite = { ...site, id: this.nextSiteId++ } as CulturalSite & { id: number };
    this.culturalSitesData.push(newSite);
    return newSite;
  }

  async search(query: string): Promise<{ countries: Country[], destinations: Destination[] }> {
    const lowerQuery = query.toLowerCase();
    const foundCountries = this.countriesData.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery)
    );
    const foundDestinations = this.destinationsData.filter(d =>
      d.name.toLowerCase().includes(lowerQuery) || d.description.toLowerCase().includes(lowerQuery)
    );
    return { countries: foundCountries, destinations: foundDestinations };
  }

  async getFavorites(userId: string): Promise<(Favorite & { item: any })[]> {
    const userFavorites = this.favoritesData.filter(f => f.userId === userId);
    const populatedFavorites = await Promise.all(userFavorites.map(async (fav) => {
      let item = null;
      if (fav.itemType === 'country') {
        item = await this.getCountry(fav.itemId);
      } else if (fav.itemType === 'destination') {
        item = await this.getDestination(fav.itemId);
      }
      return { ...fav, item };
    }));
    return populatedFavorites.filter(f => f.item !== undefined);
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const newFav = { ...favorite, id: this.nextFavoriteId++ } as Favorite & { id: number };
    this.favoritesData.push(newFav);
    return newFav;
  }

  async deleteFavorite(id: number, userId: string): Promise<void> {
    this.favoritesData = this.favoritesData.filter(f => !(f.id === id && f.userId === userId));
  }

  async getFavoriteByItem(userId: string, type: string, itemId: number): Promise<Favorite | undefined> {
    return this.favoritesData.find(f => f.userId === userId && f.itemType === type && f.itemId === itemId);
  }
}

// Create storage instance - use memory storage (in-memory works while DB connects asynchronously)
export const storage = new InMemoryStorage();
export const isDbConnected = false;
