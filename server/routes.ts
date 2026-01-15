import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

// Seed Data Helpers
async function seedDatabase() {
  const countries = await storage.getCountries();
  if (countries.length > 0) return;

  console.log("Seeding database...");

  const seedData = [
    {
      name: "Italy",
      slug: "italy",
      description: "A culinary paradise known for its rich history, art, and diverse regional cuisines.",
      heroImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80",
      continent: "Europe",
      destinations: [
        {
          name: "Rome",
          slug: "rome",
          description: "The Eternal City, famous for ancient ruins and Carbonara.",
          image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
          restaurants: [
            { name: "Roscioli Salumeria", description: "Famous for Carbonara.", cuisine: "Roman", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80" },
            { name: "Da Enzo al 29", description: "Classic Trattoria.", cuisine: "Italian", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80" },
            { name: "La Pergola", description: "3-Michelin star dining.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80" },
            { name: "Pizzarium Bonci", description: "Best pizza al taglio.", cuisine: "Pizza", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80" },
            { name: "Tonnarello", description: "Hearty pastas.", cuisine: "Italian", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80" }
          ],
          sites: [
            { name: "Colosseum", description: "Ancient amphitheater.", ticketPrice: "€16", imageUrl: "https://images.unsplash.com/photo-1552483756-32fa4c49d4be?auto=format&fit=crop&q=80" },
            { name: "Pantheon", description: "Former Roman temple.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1555660233-04db80267d34?auto=format&fit=crop&q=80" },
            { name: "Vatican Museums", description: "Art collection.", ticketPrice: "€17", imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc14f?auto=format&fit=crop&q=80" },
            { name: "Trevi Fountain", description: "Baroque fountain.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&q=80" },
            { name: "Roman Forum", description: "Plaza surrounded by ruins.", ticketPrice: "Incl. Colosseum", imageUrl: "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&q=80" }
          ]
        },
        // Add more destinations similarly if needed, kept to 1 detailed for brevity in this prompt context but code handles loop
      ]
    },
    {
      name: "Japan",
      slug: "japan",
      description: "A blend of ancient traditions and cutting-edge modernity with world-class food.",
      heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80",
      continent: "Asia",
      destinations: [
        {
          name: "Tokyo",
          slug: "tokyo",
          description: "The bustling capital.",
          image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80",
          restaurants: [
             { name: "Sukiyabashi Jiro", description: "Legendary Sushi.", cuisine: "Sushi", priceRange: "$$$$", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80" },
             { name: "Ichiran Ramen", description: "Famous Tonkotsu Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80" },
             { name: "Tempura Kondo", description: "High-end Tempura.", cuisine: "Tempura", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80" },
             { name: "Yakitori Torishiki", description: "Grilled chicken skewers.", cuisine: "Yakitori", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1604859069502-d9f242548858?auto=format&fit=crop&q=80" },
             { name: "Afuri", description: "Yuzu Shio Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80" }
          ],
          sites: [
             { name: "Senso-ji", description: "Ancient Buddhist temple.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1580227974556-11f879684128?auto=format&fit=crop&q=80" },
             { name: "Tokyo Skytree", description: "Broadcasting tower.", ticketPrice: "¥3000", imageUrl: "https://images.unsplash.com/photo-1536768371176-5e26195690b8?auto=format&fit=crop&q=80" },
             { name: "Meiji Shrine", description: "Shinto shrine.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1594246083164-92931a29369d?auto=format&fit=crop&q=80" },
             { name: "Shibuya Crossing", description: "Famous scramble crossing.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80" },
             { name: "TeamLab Planets", description: "Digital art museum.", ticketPrice: "¥3200", imageUrl: "https://images.unsplash.com/photo-1583095117911-53b0544f874d?auto=format&fit=crop&q=80" }
          ]
        }
      ]
    },
    {
      name: "Mexico",
      slug: "mexico",
      description: "Vibrant culture, ancient ruins, and spicy, flavorful cuisine.",
      heroImage: "https://images.unsplash.com/photo-1518659477543-98444df48974?auto=format&fit=crop&q=80",
      continent: "North America",
      destinations: [
        {
          name: "Mexico City",
          slug: "mexico-city",
          description: "A high-altitude, densely populated capital.",
          image: "https://images.unsplash.com/photo-1585464231875-d9cae9e030bd?auto=format&fit=crop&q=80",
          restaurants: [
             { name: "Pujol", description: "Modern Mexican.", cuisine: "Mexican", priceRange: "$$$$", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" },
             { name: "Contramar", description: "Seafood tostadas.", cuisine: "Seafood", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80" },
             { name: "El Huequito", description: "Tacos al Pastor.", cuisine: "Street Food", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80" },
             { name: "Rosetta", description: "Italian-Mexican fusion.", cuisine: "Fusion", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1594834749740-74b3f6764be4?auto=format&fit=crop&q=80" },
             { name: "Churrería El Moro", description: "Famous Churros.", cuisine: "Dessert", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80" }
          ],
          sites: [
             { name: "Teotihuacan", description: "Ancient pyramids.", ticketPrice: "$80 MXN", imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80" },
             { name: "Frida Kahlo Museum", description: "Blue House.", ticketPrice: "$250 MXN", imageUrl: "https://images.unsplash.com/photo-1588602672584-6338b1f7a63d?auto=format&fit=crop&q=80" },
             { name: "Chapultepec Castle", description: "Historic hilltop castle.", ticketPrice: "$85 MXN", imageUrl: "https://images.unsplash.com/photo-1574349372223-9c8e8d89345c?auto=format&fit=crop&q=80" },
             { name: "Zócalo", description: "Main square.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1565675306660-31627931390d?auto=format&fit=crop&q=80" },
             { name: "Palacio de Bellas Artes", description: "Cultural center.", ticketPrice: "$75 MXN", imageUrl: "https://images.unsplash.com/photo-1518118238717-8c54032d698e?auto=format&fit=crop&q=80" }
          ]
        }
      ]
    },
    {
      name: "Thailand",
      slug: "thailand",
      description: "Tropical beaches, royal palaces, and incredible street food.",
      heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80",
      continent: "Asia",
      destinations: [
        {
          name: "Bangkok",
          slug: "bangkok",
          description: "City of Angels.",
          image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=80",
          restaurants: [
             { name: "Jay Fai", description: "Michelin-starred crab omelette.", cuisine: "Street Food", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80" },
             { name: "Gaggan Anand", description: "Progressive Indian.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" },
             { name: "Thip Samai", description: "Best Pad Thai.", cuisine: "Noodles", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80" },
             { name: "Wattana Panich", description: "Beef broth stewed for years.", cuisine: "Noodles", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1594221708779-94832f4320d1?auto=format&fit=crop&q=80" },
             { name: "Som Tam Nua", description: "Papaya Salad.", cuisine: "Isan", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80" }
          ],
          sites: [
             { name: "Grand Palace", description: "Official residence of Kings.", ticketPrice: "500 THB", imageUrl: "https://images.unsplash.com/photo-1599525419934-8b6b0266023d?auto=format&fit=crop&q=80" },
             { name: "Wat Arun", description: "Temple of Dawn.", ticketPrice: "100 THB", imageUrl: "https://images.unsplash.com/photo-1560079963-e4d650eb1c5e?auto=format&fit=crop&q=80" },
             { name: "Chatuchak Market", description: "Weekend market.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80" },
             { name: "Wat Pho", description: "Reclining Buddha.", ticketPrice: "200 THB", imageUrl: "https://images.unsplash.com/photo-1605707736637-230a1334464c?auto=format&fit=crop&q=80" },
             { name: "Khao San Road", description: "Backpacker hub.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1580894080182-36d75ae3b4e6?auto=format&fit=crop&q=80" }
          ]
        }
      ]
    },
    {
      name: "France",
      slug: "france",
      description: "Medieval cities, alpine villages and glorious beaches.",
      heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
      continent: "Europe",
      destinations: [
        {
          name: "Paris",
          slug: "paris",
          description: "The City of Light.",
          image: "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&q=80",
          restaurants: [
             { name: "Le Jules Verne", description: "Eiffel Tower dining.", cuisine: "French", priceRange: "$$$$", imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80" },
             { name: "L'As du Fallafel", description: "Famous falafel.", cuisine: "Middle Eastern", priceRange: "$", imageUrl: "https://images.unsplash.com/photo-1547516508-4c1f9c7c47ee?auto=format&fit=crop&q=80" },
             { name: "Bouillon Chartier", description: "Historic brasserie.", cuisine: "French", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1608249682542-a42f5c22500c?auto=format&fit=crop&q=80" },
             { name: "Angelina", description: "Famous hot chocolate.", cuisine: "Cafe", priceRange: "$$", imageUrl: "https://images.unsplash.com/photo-1514467008620-1b776269c3a7?auto=format&fit=crop&q=80" },
             { name: "Le Comptoir du Relais", description: "Classic bistro.", cuisine: "Bistro", priceRange: "$$$", imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80" }
          ],
          sites: [
             { name: "Eiffel Tower", description: "Iron lattice tower.", ticketPrice: "€26", imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80" },
             { name: "Louvre Museum", description: "Art museum.", ticketPrice: "€17", imageUrl: "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&q=80" },
             { name: "Notre-Dame", description: "Medieval cathedral.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1478391679964-159e691238a4?auto=format&fit=crop&q=80" },
             { name: "Sacré-Cœur", description: "Basilica on a hill.", ticketPrice: "Free", imageUrl: "https://images.unsplash.com/photo-1492136344046-866c85e0bf04?auto=format&fit=crop&q=80" },
             { name: "Arc de Triomphe", description: "Triumphal arch.", ticketPrice: "€13", imageUrl: "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&q=80" }
          ]
        }
      ]
    }
  ];

  for (const c of seedData) {
    const country = await storage.createCountry({
      name: c.name,
      slug: c.slug,
      description: c.description,
      heroImage: c.heroImage,
      continent: c.continent
    });

    for (const d of c.destinations) {
      const dest = await storage.createDestination({
        countryId: country.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        image: d.image
      });

      for (const r of d.restaurants) {
        await storage.createRestaurant({
          destinationId: dest.id,
          name: r.name,
          description: r.description,
          cuisine: r.cuisine,
          priceRange: r.priceRange,
          imageUrl: r.imageUrl
        });
      }

      for (const s of d.sites) {
        await storage.createCulturalSite({
          destinationId: dest.id,
          name: s.name,
          description: s.description,
          ticketPrice: s.ticketPrice,
          imageUrl: s.imageUrl
        });
      }
    }
  }
  console.log("Seeding complete.");
}

export async function registerRoutes(httpServer: Server, app: Express) {
  // Auth Routes
  await setupAuth(app);
  registerAuthRoutes(app);

  // Seed Data on Start (simple check)
  seedDatabase().catch(console.error);

  // Countries
  app.get(api.countries.list.path, async (req, res) => {
    const countries = await storage.getCountries();
    res.json(countries);
  });

  app.get(api.countries.get.path, async (req, res) => {
    const country = await storage.getCountry(Number(req.params.id));
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.json(country);
  });

  app.get(api.countries.destinations.path, async (req, res) => {
    const dests = await storage.getDestinationsByCountry(Number(req.params.id));
    res.json(dests);
  });

  // Destinations
  app.get(api.destinations.get.path, async (req, res) => {
    const dest = await storage.getDestination(Number(req.params.id));
    if (!dest) return res.status(404).json({ message: "Destination not found" });
    res.json(dest);
  });

  app.get(api.destinations.restaurants.path, async (req, res) => {
    const rests = await storage.getRestaurantsByDestination(Number(req.params.id));
    res.json(rests);
  });

  app.get(api.destinations.culturalSites.path, async (req, res) => {
    const sites = await storage.getCulturalSitesByDestination(Number(req.params.id));
    res.json(sites);
  });

  // Search
  app.get(api.search.path, async (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json({ countries: [], destinations: [] });
    const results = await storage.search(query);
    res.json(results);
  });

  // Favorites
  app.get(api.favorites.list.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const favs = await storage.getFavorites(userId);
    res.json(favs);
  });

  app.post(api.favorites.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.favorites.create.input.parse(req.body);
      // @ts-ignore
      const userId = req.user.claims.sub;
      const fav = await storage.createFavorite({ ...input, userId });
      res.status(201).json(fav);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.favorites.delete.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    await storage.deleteFavorite(Number(req.params.id), userId);
    res.status(204).send();
  });

  app.get(api.favorites.check.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user.claims.sub;
    const type = req.params.type;
    const id = Number(req.params.id);
    
    const fav = await storage.getFavoriteByItem(userId, type, id);
    res.json({ isFavorite: !!fav, favoriteId: fav?.id });
  });

  return httpServer;
}
