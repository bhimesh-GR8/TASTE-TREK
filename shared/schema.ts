import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import Auth Models
export * from "./models/auth";
import { users } from "./models/auth";

// --- Countries ---
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  heroImage: text("hero_image").notNull(),
  continent: text("continent"),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  destinations: many(destinations),
}));

export const insertCountrySchema = createInsertSchema(countries).omit({ id: true });
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;


// --- Destinations ---
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").notNull().references(() => countries.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
});

export const destinationsRelations = relations(destinations, ({ one, many }) => ({
  country: one(countries, {
    fields: [destinations.countryId],
    references: [countries.id],
  }),
  restaurants: many(restaurants),
  culturalSites: many(culturalSites),
}));

export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true });
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;


// --- Restaurants ---
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").notNull().references(() => destinations.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: text("price_range").notNull(), // $, $$, $$$, $$$$
  imageUrl: text("image_url").notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
});

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  destination: one(destinations, {
    fields: [restaurants.destinationId],
    references: [destinations.id],
  }),
}));

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true });
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;


// --- Cultural Sites ---
export const culturalSites = pgTable("cultural_sites", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").notNull().references(() => destinations.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ticketPrice: text("ticket_price"),
  imageUrl: text("image_url").notNull(),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
});

export const culturalSitesRelations = relations(culturalSites, ({ one }) => ({
  destination: one(destinations, {
    fields: [culturalSites.destinationId],
    references: [destinations.id],
  }),
}));

export const insertCulturalSiteSchema = createInsertSchema(culturalSites).omit({ id: true });
export type CulturalSite = typeof culturalSites.$inferSelect;
export type InsertCulturalSite = z.infer<typeof insertCulturalSiteSchema>;


// --- Favorites ---
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id), // String ID from OIDC provider
  itemId: integer("item_id").notNull(), // Can be countryId or destinationId
  itemType: text("item_type").notNull(), // 'country' | 'destination'
  createdAt: timestamp("created_at").defaultNow(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Request Types
export type CreateFavoriteRequest = InsertFavorite;

