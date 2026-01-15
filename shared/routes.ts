import { z } from 'zod';
import { 
  insertCountrySchema, 
  countries, 
  insertDestinationSchema, 
  destinations, 
  insertRestaurantSchema, 
  restaurants,
  insertCulturalSiteSchema,
  culturalSites,
  insertFavoriteSchema,
  favorites
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  countries: {
    list: {
      method: 'GET' as const,
      path: '/api/countries',
      responses: {
        200: z.array(z.custom<typeof countries.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/countries/:id',
      responses: {
        200: z.custom<typeof countries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    destinations: {
      method: 'GET' as const,
      path: '/api/countries/:id/destinations',
      responses: {
        200: z.array(z.custom<typeof destinations.$inferSelect>()),
      },
    }
  },
  destinations: {
    get: {
      method: 'GET' as const,
      path: '/api/destinations/:id',
      responses: {
        200: z.custom<typeof destinations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    restaurants: {
      method: 'GET' as const,
      path: '/api/destinations/:id/restaurants',
      responses: {
        200: z.array(z.custom<typeof restaurants.$inferSelect>()),
      },
    },
    culturalSites: {
      method: 'GET' as const,
      path: '/api/destinations/:id/cultural-sites',
      responses: {
        200: z.array(z.custom<typeof culturalSites.$inferSelect>()),
      },
    }
  },
  search: {
    method: 'GET' as const,
    path: '/api/search',
    input: z.object({ q: z.string() }),
    responses: {
      200: z.object({
        countries: z.array(z.custom<typeof countries.$inferSelect>()),
        destinations: z.array(z.custom<typeof destinations.$inferSelect>()),
      }),
    },
  },
  favorites: {
    list: {
      method: 'GET' as const,
      path: '/api/favorites',
      responses: {
        200: z.array(z.custom<typeof favorites.$inferSelect & { item: any }>()), // Returns populated items
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/favorites',
      input: insertFavoriteSchema,
      responses: {
        201: z.custom<typeof favorites.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/favorites/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    check: {
      method: 'GET' as const,
      path: '/api/favorites/check/:type/:id',
      responses: {
        200: z.object({ isFavorite: z.boolean(), favoriteId: z.number().optional() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
