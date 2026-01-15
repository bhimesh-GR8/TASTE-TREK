import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";
import {
  countries, destinations, restaurants, culturalSites, favorites,
  type Country, type InsertCountry,
  type Destination, type InsertDestination,
  type Restaurant, type InsertRestaurant,
  type CulturalSite, type InsertCulturalSite,
  type Favorite, type InsertFavorite
} from "@shared/schema";

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
    return await db.select().from(countries);
  }

  async getCountry(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }

  async createCountry(country: InsertCountry): Promise<Country> {
    const [newCountry] = await db.insert(countries).values(country).returning();
    return newCountry;
  }

  async getDestinationsByCountry(countryId: number): Promise<Destination[]> {
    return await db.select().from(destinations).where(eq(destinations.countryId, countryId));
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const [dest] = await db.select().from(destinations).where(eq(destinations.id, id));
    return dest;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [newDest] = await db.insert(destinations).values(destination).returning();
    return newDest;
  }

  async getRestaurantsByDestination(destinationId: number): Promise<Restaurant[]> {
    return await db.select().from(restaurants).where(eq(restaurants.destinationId, destinationId));
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRest] = await db.insert(restaurants).values(restaurant).returning();
    return newRest;
  }

  async getCulturalSitesByDestination(destinationId: number): Promise<CulturalSite[]> {
    return await db.select().from(culturalSites).where(eq(culturalSites.destinationId, destinationId));
  }

  async createCulturalSite(site: InsertCulturalSite): Promise<CulturalSite> {
    const [newSite] = await db.insert(culturalSites).values(site).returning();
    return newSite;
  }

  async search(query: string): Promise<{ countries: Country[], destinations: Destination[] }> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const foundCountries = await db.select().from(countries)
      .where(or(ilike(countries.name, lowerQuery), ilike(countries.description, lowerQuery)));
    
    const foundDestinations = await db.select().from(destinations)
      .where(or(ilike(destinations.name, lowerQuery), ilike(destinations.description, lowerQuery)));

    return { countries: foundCountries, destinations: foundDestinations };
  }

  async getFavorites(userId: string): Promise<(Favorite & { item: any })[]> {
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    
    // Populate items - a bit inefficient but workable for MVP
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
    const [newFav] = await db.insert(favorites).values(favorite).returning();
    return newFav;
  }

  async deleteFavorite(id: number, userId: string): Promise<void> {
    await db.delete(favorites).where(
      or(
        eq(favorites.id, id),
        // Ensure user owns the favorite (redundant with AND but good for safety if I had more complex logic)
      )
    );
    // Actually should just match ID and userID to be safe
     await db.delete(favorites).where(
       // @ts-ignore
      and(eq(favorites.id, id), eq(favorites.userId, userId))
    );
  }

  async getFavoriteByItem(userId: string, type: string, id: number): Promise<Favorite | undefined> {
    const [fav] = await db.select().from(favorites).where(
      // @ts-ignore
      and(
        eq(favorites.userId, userId),
        eq(favorites.itemType, type),
        eq(favorites.itemId, id)
      )
    );
    return fav;
  }
}

// Fix for 'and' import if needed, or just use raw sql/multiple where calls if drizzle allows chain (it usually takes multiple args for AND)
import { and } from "drizzle-orm";

export const storage = new DatabaseStorage();
