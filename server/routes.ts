import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

// Local and reliable image URLs
const IMAGE_URLS = {
  // ROME - Italian Food (LOCAL)
  romeFood1: "/images/Roscioli Salumeria.jpg", // pasta
  romeFood2: "/images/Da Enzo al 29.jpg", // food
  romeFood3: "/images/Pizzarium Bonci.jpg", // pizza
  romeFood4: "/images/La Pergola.jpg", // italian food
  romeFood5: "/images/Tonnarello.jpg", // risotto
  // ROME - Sites (LOCAL)
  romeSite1: "/images/Colosseum.jpg", // colosseum
  romeSite2: "/images/Pantheon.jpg", // pantheon
  romeSite3: "/images/Vatican Museums.jpg", // vatican
  romeSite4: "/images/Trevi Fountain.jpg", // trevi
  romeSite5: "/images/Roman Forum.jpg", // forum

  // VENICE - Food
  veniceFood1: "/images/Antiche Carampane.jpg", // seafood
  veniceFood2: "/images/Da Fiore.jpg", // italian
  veniceFood3: "/images/osteria dei binari.jpg", // food
  veniceFood4: "/images/al covo.jpg", // pasta
  veniceFood5: "/images/Trattoria al Pont de Vio.jpg", // casual
  // VENICE - Sites
  veniceSite1: "/images/St. Mark's Basilica.jpg", // basilica
  veniceSite2: "/images/Doge's Palace.jpg", // palace
  veniceSite3: "/images/Grand Canal.jpg", // canal
  veniceSite4: "/images/Basilica di Santa Maria della Salute.jpg", // rialto
  veniceSite5: "/images/Rialto Bridge.jpg", // architecture

  // FLORENCE - Food
  florenceFood1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // tuscan pasta
  florenceFood2: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop&q=80", // tuscan food
  florenceFood3: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // italian
  florenceFood4: "https://images.unsplash.com/photo-1571407970349-bc65e05b2c90?w=400&h=400&fit=crop&q=80", // pasta
  florenceFood5: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // ribollita
  // FLORENCE - Sites
  florenceSite1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80", // duomo
  florenceSite2: "https://images.unsplash.com/photo-1551801526-becf464a6a77?w=400&h=400&fit=crop&q=80", // uffizi
  florenceSite3: "https://images.unsplash.com/photo-1578926078328-123f5474f46b?w=400&h=400&fit=crop&q=80", // accademia
  florenceSite4: "https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=400&fit=crop&q=80", // ponte
  florenceSite5: "https://images.unsplash.com/photo-1516565058933-aa282ef429c6?w=400&h=400&fit=crop&q=80", // palazzo

  // MILAN - Food
  milanFood1: "https://images.unsplash.com/photo-1571407970349-bc65e05b2c90?w=400&h=400&fit=crop&q=80", // risotto
  milanFood2: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // pasta
  milanFood3: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop&q=80", // pizza
  milanFood4: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // italian
  milanFood5: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // food
  // MILAN - Sites
  milanSite1: "https://images.unsplash.com/photo-1568448069627-82a28b988ebd?w=400&h=400&fit=crop&q=80", // duomo
  milanSite2: "https://images.unsplash.com/photo-1578926078328-123f5474f46b?w=400&h=400&fit=crop&q=80", // lastsup
  milanSite3: "https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=400&h=400&fit=crop&q=80", // castle
  milanSite4: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80", // galleria
  milanSite5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", // scala

  // TOKYO - Food (Sushi, Ramen, etc - JAPANESE FOOD)
  tokyoFood1: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=80", // sushi
  tokyoFood2: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=400&fit=crop&q=80", // ramen
  tokyoFood3: "https://images.unsplash.com/photo-1582869352990-8446075eaf18?w=400&h=400&fit=crop&q=80", // tempura
  tokyoFood4: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // yakitori
  tokyoFood5: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80", // donburi
  // TOKYO - Sites
  tokyoSite1: "https://images.unsplash.com/photo-1727875074814-66b1a25be58a?w=400&h=400&fit=crop&q=80", // sensoji
  tokyoSite2: "https://images.unsplash.com/photo-1528164344705-47542687c6f1?w=400&h=400&fit=crop&q=80", // skytree
  tokyoSite3: "https://images.unsplash.com/photo-1520434620097-ad8e85ff58dd?w=400&h=400&fit=crop&q=80", // shrine
  tokyoSite4: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&h=400&fit=crop&q=80", // shibuya
  tokyoSite5: "https://images.unsplash.com/photo-1531259683007-016451deb5e2?w=400&h=400&fit=crop&q=80", // teamlab

  // KYOTO - Food (Japanese traditional)
  kyotoFood1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // kaiseki
  kyotoFood2: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80", // veg
  kyotoFood3: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=80", // sushi
  kyotoFood4: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=400&fit=crop&q=80", // ramen
  kyotoFood5: "https://images.unsplash.com/photo-1582869352990-8446075eaf18?w=400&h=400&fit=crop&q=80", // tempura
  // KYOTO - Sites
  kyotoSite1: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=400&h=400&fit=crop&q=80", // fushimi
  kyotoSite2: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop&q=80", // bamboo
  kyotoSite3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80", // kinkaku
  kyotoSite4: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80", // gion
  kyotoSite5: "https://images.unsplash.com/photo-1537799943893-52c29a11a46e?w=400&h=400&fit=crop&q=80", // temple

  // MEXICO CITY - Food (Mexican cuisine)
  mexicoCityFood1: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop&q=80", // mexican
  mexicoCityFood2: "https://images.unsplash.com/photo-1555939594-58d7cb561370?w=400&h=400&fit=crop&q=80", // tacos
  mexicoCityFood3: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // food
  mexicoCityFood4: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // mex
  mexicoCityFood5: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // food2
  // MEXICO CITY - Sites
  mexicoCitySite1: "https://images.unsplash.com/photo-1535139262971-187ea590bd0d?w=400&h=400&fit=crop&q=80", // teotihuacan
  mexicoCitySite2: "https://images.unsplash.com/photo-1516565058933-aa282ef429c6?w=400&h=400&fit=crop&q=80", // frida
  mexicoCitySite3: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop&q=80", // chap
  mexicoCitySite4: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop&q=80", // zocalo
  mexicoCitySite5: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80", // bellas

  // CANCUN - Food (Mexican)
  cancunFood1: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop&q=80", // mexican
  cancunFood2: "https://images.unsplash.com/photo-1555939594-58d7cb561370?w=400&h=400&fit=crop&q=80", // tacos
  cancunFood3: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // food
  cancunFood4: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // mex
  cancunFood5: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // food2
  // CANCUN - Sites
  cancunSite1: "https://images.unsplash.com/photo-1535139262971-187ea590bd0d?w=400&h=400&fit=crop&q=80", // chichen
  cancunSite2: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop&q=80", // tulum
  cancunSite3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80", // cenote
  cancunSite4: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80", // elrey
  cancunSite5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80", // barrier

  // BANGKOK - Food (Thai cuisine)
  bangkokFood1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // thai
  bangkokFood2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80", // padthai
  bangkokFood3: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=400&fit=crop&q=80", // khao
  bangkokFood4: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // thai2
  bangkokFood5: "https://images.unsplash.com/photo-1521305573892-18ecd32ce3bf?w=400&h=400&fit=crop&q=80", // satay
  // BANGKOK - Sites
  bangkokSite1: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=400&h=400&fit=crop&q=80", // palace
  bangkokSite2: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80", // wat
  bangkokSite3: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop&q=80", // market
  bangkokSite4: "https://images.unsplash.com/photo-1537799943893-52c29a11a46e?w=400&h=400&fit=crop&q=80", // watpho
  bangkokSite5: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop&q=80", // khaoSan

  // PHUKET - Food (Thai cuisine)
  phuketFood1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // thai
  phuketFood2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80", // padthai
  phuketFood3: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&h=400&fit=crop&q=80", // thai2
  phuketFood4: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // thai3
  phuketFood5: "https://images.unsplash.com/photo-1521305573892-18ecd32ce3bf?w=400&h=400&fit=crop&q=80", // thai4
  // PHUKET - Sites
  phuketSite1: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=400&h=400&fit=crop&q=80", // buddha
  phuketSite2: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&q=80", // phiphi
  phuketSite3: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop&q=80", // bay
  phuketSite4: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80", // patong
  phuketSite5: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80", // temple

  // PARIS - Food (French cuisine)
  parisFood1: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // french
  parisFood2: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // pasta
  parisFood3: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // food
  parisFood4: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop&q=80", // french2
  parisFood5: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop&q=80", // food2
  // PARIS - Sites
  parisSite1: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop&q=80", // eiffel
  parisSite2: "https://images.unsplash.com/photo-1551801526-becf464a6a77?w=400&h=400&fit=crop&q=80", // louvre
  parisSite3: "https://images.unsplash.com/photo-1537799943893-52c29a11a46e?w=400&h=400&fit=crop&q=80", // notredame
  parisSite4: "https://images.unsplash.com/photo-1578926078328-123f5474f46b?w=400&h=400&fit=crop&q=80", // sacrecoeur
  parisSite5: "https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=400&h=400&fit=crop&q=80", // arc

  // LYON - Food (French cuisine)
  lyonFood1: "https://images.unsplash.com/photo-1612874742237-415ba2fe9c32?w=400&h=400&fit=crop&q=80", // french
  lyonFood2: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&q=80", // french2
  lyonFood3: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80", // food
  lyonFood4: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop&q=80", // french3
  lyonFood5: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop&q=80", // french4
  // LYON - Sites
  lyonSite1: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80", // fourviere
  lyonSite2: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80", // oldtown
  lyonSite3: "https://images.unsplash.com/photo-1551801526-becf464a6a77?w=400&h=400&fit=crop&q=80", // museum
  lyonSite4: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop&q=80", // parctet
  lyonSite5: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80", // confluence
};

// Location-specific hero images
const COUNTRY_IMAGES = {
  // Countries
  italy: "/images/ITALY.jpg",
  japan: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  mexico: "https://images.unsplash.com/photo-1535139262971-187ea590bd0d?w=800&h=600&fit=crop&q=80",
  thailand: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80",
  // Italy destinations
  rome: "/images/ROME.jpg",
  venice: "/images/Venice.jpg",
  florence: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80",
  milan: "https://images.unsplash.com/photo-1568448069627-82a28b988ebd?w=800&h=600&fit=crop&q=80",
  // Japan destinations
  tokyo: "https://images.unsplash.com/photo-1528164344705-47542687c6f1?w=800&h=600&fit=crop&q=80",
  kyoto: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  // Mexico destinations
  mexicoCity: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80",
  cancun: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  // Thailand destinations
  bangkok: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  phuket: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  // France destinations
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80",
  lyon: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80",
};

// Database seeding function
async function seedDatabase() {
  try {
    console.log("🌱 Seeding Taste-Trek database with relevant images...");

    const seedData = [
      {
        name: "Italy",
        slug: "italy",
        description: "A culinary paradise known for its rich history, art, and diverse regional cuisines.",
        heroImage: COUNTRY_IMAGES.italy,
        continent: "Europe",
        destinations: [
          {
            name: "Rome",
            slug: "rome",
            description: "The Eternal City, famous for ancient ruins and Carbonara.",
            image: COUNTRY_IMAGES.rome,
            restaurants: [
              { name: "Roscioli Salumeria", description: "Famous for Carbonara.", cuisine: "Roman", priceRange: "$$$", imageUrl: IMAGE_URLS.romeFood1 },
              { name: "Da Enzo al 29", description: "Classic Trattoria.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood2 },
              { name: "La Pergola", description: "3-Michelin star dining.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.romeFood3 },
              { name: "Pizzarium Bonci", description: "Best pizza al taglio.", cuisine: "Pizza", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood4 },
              { name: "Tonnarello", description: "Hearty pastas.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood5 },
            ],
            sites: [
              { name: "Colosseum", description: "Ancient amphitheater.", ticketPrice: "€16", imageUrl: IMAGE_URLS.romeSite1 },
              { name: "Pantheon", description: "Former Roman temple.", ticketPrice: "Free", imageUrl: IMAGE_URLS.romeSite2 },
              { name: "Vatican Museums", description: "Art collection.", ticketPrice: "€17", imageUrl: IMAGE_URLS.romeSite3 },
              { name: "Trevi Fountain", description: "Baroque fountain.", ticketPrice: "Free", imageUrl: IMAGE_URLS.romeSite4 },
              { name: "Roman Forum", description: "Plaza surrounded by ruins.", ticketPrice: "Incl. Colosseum", imageUrl: IMAGE_URLS.romeSite5 },
            ],
          },
          {
            name: "Venice",
            slug: "venice",
            description: "The City of Canals, famous for gondolas and Renaissance art.",
            image: COUNTRY_IMAGES.venice,
            restaurants: [
              { name: "Antiche Carampane", description: "Traditional Venetian seafood.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood1 },
              { name: "Da Fiore", description: "Michelin-starred classics.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.veniceFood2 },
              { name: "Osteria da Rioba", description: "Modern Italian cuisine.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood3 },
              { name: "Al Covo", description: "Venetian specialties.", cuisine: "Regional", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood4 },
              { name: "Trattoria al Pont de Vio", description: "Casual neighborhood eatery.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.veniceFood5 },
            ],
            sites: [
              { name: "St. Mark's Basilica", description: "Byzantine-style cathedral.", ticketPrice: "€5", imageUrl: IMAGE_URLS.veniceSite1 },
              { name: "Doge's Palace", description: "Historic residence of Venetian rulers.", ticketPrice: "€28", imageUrl: IMAGE_URLS.veniceSite2 },
              { name: "Grand Canal", description: "Main waterway through Venice.", ticketPrice: "Free", imageUrl: IMAGE_URLS.veniceSite3 },
              { name: "Basilica di Santa Maria della Salute", description: "Renaissance religious edifice.", ticketPrice: "€4", imageUrl: IMAGE_URLS.veniceSite4 },
              { name: "Rialto Bridge", description: "Iconic stone bridge.", ticketPrice: "Free", imageUrl: IMAGE_URLS.veniceSite5 },
            ],
          },
          {
            name: "Florence",
            slug: "florence",
            description: "The Renaissance heart of Italy, home to masterpieces and innovation.",
            image: COUNTRY_IMAGES.florence,
            restaurants: [
              { name: "Enoteca Pinchiorri", description: "Michelin 2-star fine dining.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.florenceFood1 },
              { name: "Alloro", description: "Contemporary Tuscan.", cuisine: "Tuscan", priceRange: "$$$", imageUrl: IMAGE_URLS.florenceFood2 },
              { name: "Trattoria da Mariano", description: "Authentic Florentine ribollita.", cuisine: "Tuscan", priceRange: "$$", imageUrl: IMAGE_URLS.florenceFood3 },
              { name: "Il Latini", description: "Family-style bistro.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.florenceFood4 },
              { name: "Cibreo", description: "Chef Fabrizio's Tuscan delights.", cuisine: "Tuscan", priceRange: "$$$", imageUrl: IMAGE_URLS.florenceFood5 },
            ],
            sites: [
              { name: "Florence Cathedral (Duomo)", description: "Magnificent Renaissance dome.", ticketPrice: "€30", imageUrl: IMAGE_URLS.florenceSite1 },
              { name: "Uffizi Gallery", description: "World-class art museum.", ticketPrice: "€12", imageUrl: IMAGE_URLS.florenceSite2 },
              { name: "Accademia Gallery", description: "Home of Michelangelo's David.", ticketPrice: "€12.50", imageUrl: IMAGE_URLS.florenceSite3 },
              { name: "Ponte Vecchio", description: "Historic bridge with shops.", ticketPrice: "Free", imageUrl: IMAGE_URLS.florenceSite4 },
              { name: "Palazzo Pitti", description: "Grand Renaissance palace.", ticketPrice: "€13", imageUrl: IMAGE_URLS.florenceSite5 },
            ],
          },
          {
            name: "Milan",
            slug: "milan",
            description: "Modern Italy's fashion and design capital with Gothic grandeur.",
            image: COUNTRY_IMAGES.milan,
            restaurants: [
              { name: "Cracco", description: "Michelin-starred gastronomy.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.milanFood1 },
              { name: "Da Giacomo", description: "Fresh seafood and classics.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.milanFood2 },
              { name: "Al Matarel", description: "Milanese tradition at its best.", cuisine: "Milanese", priceRange: "$$", imageUrl: IMAGE_URLS.milanFood3 },
              { name: "Ristorante Gino Sorbillo", description: "Famous Neapolitan pizza.", cuisine: "Pizza", priceRange: "$$", imageUrl: IMAGE_URLS.milanFood4 },
              { name: "Armani/Ristorante", description: "High fashion dining.", cuisine: "Fine Dining", priceRange: "$$$", imageUrl: IMAGE_URLS.milanFood5 },
            ],
            sites: [
              { name: "Milan Cathedral (Duomo)", description: "Stunning Gothic architecture.", ticketPrice: "€3", imageUrl: IMAGE_URLS.milanSite1 },
              { name: "The Last Supper (Santa Maria delle Grazie)", description: "Leonardo da Vinci's masterpiece.", ticketPrice: "€15", imageUrl: IMAGE_URLS.milanSite2 },
              { name: "Sforza Castle", description: "Renaissance fortress.", ticketPrice: "€5", imageUrl: IMAGE_URLS.milanSite3 },
              { name: "Galleria Vittorio Emanuele II", description: "Historic shopping arcade.", ticketPrice: "Free", imageUrl: IMAGE_URLS.milanSite4 },
              { name: "La Scala", description: "World-renowned opera house.", ticketPrice: "€20", imageUrl: IMAGE_URLS.milanSite5 },
            ],
          },
        ],
      },
      {
        name: "Japan",
        slug: "japan",
        description: "A blend of ancient traditions and cutting-edge modernity with world-class food.",
        heroImage: COUNTRY_IMAGES.japan,
        continent: "Asia",
        destinations: [
          {
            name: "Tokyo",
            slug: "tokyo",
            description: "The bustling capital, a dynamic mix of neon-lit skyscrapers and serene temples.",
            image: COUNTRY_IMAGES.tokyo,
            restaurants: [
              { name: "Sukiyabashi Jiro", description: "Legendary Sushi.", cuisine: "Sushi", priceRange: "$$$$", imageUrl: IMAGE_URLS.tokyoFood1 },
              { name: "Ichiran Ramen", description: "Famous Tonkotsu Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: IMAGE_URLS.tokyoFood2 },
              { name: "Tempura Kondo", description: "High-end Tempura.", cuisine: "Tempura", priceRange: "$$$", imageUrl: IMAGE_URLS.tokyoFood3 },
              { name: "Yakitori Torishiki", description: "Grilled chicken skewers.", cuisine: "Yakitori", priceRange: "$$$", imageUrl: IMAGE_URLS.tokyoFood4 },
              { name: "Afuri", description: "Yuzu Shio Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: IMAGE_URLS.tokyoFood5 },
            ],
            sites: [
              { name: "Senso-ji", description: "Ancient Buddhist temple.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite1 },
              { name: "Tokyo Skytree", description: "Broadcasting tower.", ticketPrice: "¥3000", imageUrl: IMAGE_URLS.tokyoSite2 },
              { name: "Meiji Shrine", description: "Shinto shrine.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite3 },
              { name: "Shibuya Crossing", description: "Famous scramble crossing.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite4 },
              { name: "TeamLab Planets", description: "Digital art museum.", ticketPrice: "¥3200", imageUrl: IMAGE_URLS.tokyoSite5 },
            ],
          },
          {
            name: "Kyoto",
            slug: "kyoto",
            description: "Ancient capital preserving Japan's traditional culture and temples.",
            image: COUNTRY_IMAGES.kyoto,
            restaurants: [
              { name: "Gion Tanto", description: "Kaiseki cuisine.", cuisine: "Kaiseki", priceRange: "$$$$", imageUrl: IMAGE_URLS.kyotoFood1 },
              { name: "Okutan Kappa Zushi", description: "Tofu specialties.", cuisine: "Vegetarian", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood2 },
              { name: "Hyotei", description: "Traditional Japanese.", cuisine: "Japanese", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood3 },
              { name: "Gion Kappa Zushi", description: "Sushi restaurant.", cuisine: "Sushi", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood4 },
              { name: "Chaseki", description: "Tea house cuisine.", cuisine: "Fusion", priceRange: "$$", imageUrl: IMAGE_URLS.kyotoFood5 },
            ],
            sites: [
              { name: "Fushimi Inari Shrine", description: "Famous torii gates.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite1 },
              { name: "Arashiyama Bamboo Grove", description: "Scenic bamboo forest.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite2 },
              { name: "Kinkaku-ji", description: "Golden Pavilion.", ticketPrice: "¥400", imageUrl: IMAGE_URLS.kyotoSite3 },
              { name: "Gion District", description: "Historic geisha district.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite4 },
              { name: "Kiyomizu-dera", description: "Historic Buddhist temple.", ticketPrice: "¥400", imageUrl: IMAGE_URLS.kyotoSite5 },
            ],
          },
        ],
      },
      {
        name: "Mexico",
        slug: "mexico",
        description: "Vibrant culture, ancient ruins, and spicy, flavorful cuisine.",
        heroImage: COUNTRY_IMAGES.mexico,
        continent: "North America",
        destinations: [
          {
            name: "Mexico City",
            slug: "mexico-city",
            description: "A high-altitude, densely populated capital with incredible food scene.",
            image: COUNTRY_IMAGES.mexicoCity,
            restaurants: [
              { name: "Pujol", description: "Modern Mexican.", cuisine: "Mexican", priceRange: "$$$$", imageUrl: IMAGE_URLS.mexicoCityFood1 },
              { name: "Contramar", description: "Seafood tostadas.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.mexicoCityFood2 },
              { name: "El Huequito", description: "Tacos al Pastor.", cuisine: "Street Food", priceRange: "$", imageUrl: IMAGE_URLS.mexicoCityFood3 },
              { name: "Rosetta", description: "Italian-Mexican fusion.", cuisine: "Fusion", priceRange: "$$$", imageUrl: IMAGE_URLS.mexicoCityFood4 },
              { name: "Churrería El Moro", description: "Famous Churros.", cuisine: "Dessert", priceRange: "$", imageUrl: IMAGE_URLS.mexicoCityFood5 },
            ],
            sites: [
              { name: "Teotihuacan", description: "Ancient pyramids.", ticketPrice: "$80 MXN", imageUrl: IMAGE_URLS.mexicoCitySite1 },
              { name: "Frida Kahlo Museum", description: "Blue House.", ticketPrice: "$250 MXN", imageUrl: IMAGE_URLS.mexicoCitySite2 },
              { name: "Chapultepec Castle", description: "Historic hilltop castle.", ticketPrice: "$85 MXN", imageUrl: IMAGE_URLS.mexicoCitySite3 },
              { name: "Zócalo", description: "Main square.", ticketPrice: "Free", imageUrl: IMAGE_URLS.mexicoCitySite4 },
              { name: "Palacio de Bellas Artes", description: "Cultural center.", ticketPrice: "$75 MXN", imageUrl: IMAGE_URLS.mexicoCitySite5 },
            ],
          },
          {
            name: "Cancun",
            slug: "cancun",
            description: "Tropical beaches and Caribbean luxury destination.",
            image: COUNTRY_IMAGES.cancun,
            restaurants: [
              { name: "La Vaquita", description: "Mexican beachfront dining.", cuisine: "Mexican", priceRange: "$$$", imageUrl: IMAGE_URLS.cancunFood1 },
              { name: "Señor Frog's", description: "Casual seafood.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.cancunFood2 },
              { name: "Palazzo", description: "Italian restaurant.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.cancunFood3 },
              { name: "The Surfin' Burrito", description: "Casual tacos.", cuisine: "Street Food", priceRange: "$", imageUrl: IMAGE_URLS.cancunFood4 },
              { name: "Dady'O Nightclub Restaurant", description: "Nightlife dining.", cuisine: "International", priceRange: "$$", imageUrl: IMAGE_URLS.cancunFood5 },
            ],
            sites: [
              { name: "Chichen Itza", description: "Mayan pyramid ruins.", ticketPrice: "$50 MXN", imageUrl: IMAGE_URLS.cancunSite1 },
              { name: "Tulum Ruins", description: "Clifftop Mayan ruins.", ticketPrice: "$75 MXN", imageUrl: IMAGE_URLS.cancunSite2 },
              { name: "Cenote Ik Kil", description: "Natural sinkhole.", ticketPrice: "$100 MXN", imageUrl: IMAGE_URLS.cancunSite3 },
              { name: "El Rey Ruins", description: "Beach ruins.", ticketPrice: "$50 MXN", imageUrl: IMAGE_URLS.cancunSite4 },
              { name: "Great Mesoamerican Barrier Reef", description: "Snorkeling spot.", ticketPrice: "$80 MXN", imageUrl: IMAGE_URLS.cancunSite5 },
            ],
          },
        ],
      },
      {
        name: "Thailand",
        slug: "thailand",
        description: "Tropical beaches, royal palaces, and incredible street food.",
        heroImage: COUNTRY_IMAGES.thailand,
        continent: "Asia",
        destinations: [
          {
            name: "Bangkok",
            slug: "bangkok",
            description: "City of Angels, a bustling metropolis with temples and street food.",
            image: COUNTRY_IMAGES.bangkok,
            restaurants: [
              { name: "Jay Fai", description: "Michelin-starred crab omelette.", cuisine: "Street Food", priceRange: "$$$", imageUrl: IMAGE_URLS.bangkokFood1 },
              { name: "Gaggan Anand", description: "Progressive Indian.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.bangkokFood2 },
              { name: "Thip Samai", description: "Best Pad Thai.", cuisine: "Noodles", priceRange: "$$", imageUrl: IMAGE_URLS.bangkokFood3 },
              { name: "Wattana Panich", description: "Beef broth stewed for years.", cuisine: "Noodles", priceRange: "$", imageUrl: IMAGE_URLS.bangkokFood4 },
              { name: "Som Tam Nua", description: "Papaya Salad.", cuisine: "Isan", priceRange: "$", imageUrl: IMAGE_URLS.bangkokFood5 },
            ],
            sites: [
              { name: "Grand Palace", description: "Official residence of Kings.", ticketPrice: "500 THB", imageUrl: IMAGE_URLS.bangkokSite1 },
              { name: "Wat Arun", description: "Temple of Dawn.", ticketPrice: "100 THB", imageUrl: IMAGE_URLS.bangkokSite2 },
              { name: "Chatuchak Market", description: "Weekend market.", ticketPrice: "Free", imageUrl: IMAGE_URLS.bangkokSite3 },
              { name: "Wat Pho", description: "Reclining Buddha.", ticketPrice: "200 THB", imageUrl: IMAGE_URLS.bangkokSite4 },
              { name: "Khao San Road", description: "Backpacker hub.", ticketPrice: "Free", imageUrl: IMAGE_URLS.bangkokSite5 },
            ],
          },
          {
            name: "Phuket",
            slug: "phuket",
            description: "Island paradise with beaches, diving, and nightlife.",
            image: COUNTRY_IMAGES.phuket,
            restaurants: [
              { name: "Acqua Restaurant", description: "Italian beachfront.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.phuketFood1 },
              { name: "On the Rock", description: "Seafood with sunset views.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood2 },
              { name: "Thai Kitchen", description: "Traditional Thai cuisine.", cuisine: "Thai", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood3 },
              { name: "Savoey Seafood", description: "Fresh local seafood.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood4 },
              { name: "Ka Jok See", description: "Thai fusion fine dining.", cuisine: "Fusion", priceRange: "$$$", imageUrl: IMAGE_URLS.phuketFood5 },
            ],
            sites: [
              { name: "Big Buddha", description: "Hilltop golden buddha.", ticketPrice: "300 THB", imageUrl: IMAGE_URLS.phuketSite1 },
              { name: "Phi Phi Islands", description: "Island hopping.", ticketPrice: "800 THB", imageUrl: IMAGE_URLS.phuketSite2 },
              { name: "Phang Nga Bay", description: "Limestone karsts.", ticketPrice: "600 THB", imageUrl: IMAGE_URLS.phuketSite3 },
              { name: "Patong Beach", description: "Popular beach resort.", ticketPrice: "Free", imageUrl: IMAGE_URLS.phuketSite4 },
              { name: "Wat Chalong", description: "Historic temple.", ticketPrice: "20 THB", imageUrl: IMAGE_URLS.phuketSite5 },
            ],
          },
        ],
      },
      {
        name: "France",
        slug: "france",
        description: "Medieval cities, alpine villages and glorious beaches.",
        heroImage: COUNTRY_IMAGES.france,
        continent: "Europe",
        destinations: [
          {
            name: "Paris",
            slug: "paris",
            description: "The City of Light, romantic capital of France.",
            image: COUNTRY_IMAGES.paris,
            restaurants: [
              { name: "Le Jules Verne", description: "Eiffel Tower dining.", cuisine: "French", priceRange: "$$$$", imageUrl: IMAGE_URLS.parisFood1 },
              { name: "L'As du Fallafel", description: "Famous falafel.", cuisine: "Middle Eastern", priceRange: "$", imageUrl: IMAGE_URLS.parisFood2 },
              { name: "Bouillon Chartier", description: "Historic brasserie.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.parisFood3 },
              { name: "Angelina", description: "Famous hot chocolate.", cuisine: "Cafe", priceRange: "$$", imageUrl: IMAGE_URLS.parisFood4 },
              { name: "Le Comptoir du Relais", description: "Classic bistro.", cuisine: "Bistro", priceRange: "$$$", imageUrl: IMAGE_URLS.parisFood5 },
            ],
            sites: [
              { name: "Eiffel Tower", description: "Iron lattice tower.", ticketPrice: "€26", imageUrl: IMAGE_URLS.parisSite1 },
              { name: "Louvre Museum", description: "Art museum.", ticketPrice: "€17", imageUrl: IMAGE_URLS.parisSite2 },
              { name: "Notre-Dame", description: "Medieval cathedral.", ticketPrice: "Free", imageUrl: IMAGE_URLS.parisSite3 },
              { name: "Sacré-Cœur", description: "Basilica on a hill.", ticketPrice: "Free", imageUrl: IMAGE_URLS.parisSite4 },
              { name: "Arc de Triomphe", description: "Triumphal arch.", ticketPrice: "€13", imageUrl: IMAGE_URLS.parisSite5 },
            ],
          },
          {
            name: "Lyon",
            slug: "lyon",
            description: "Culinary capital of France with Renaissance old town.",
            image: COUNTRY_IMAGES.lyon,
            restaurants: [
              { name: "Paul Bocuse", description: "Legendary French cuisine.", cuisine: "French", priceRange: "$$$$", imageUrl: IMAGE_URLS.lyonFood1 },
              { name: "La Cour des Loges", description: "Fine dining bistro.", cuisine: "French", priceRange: "$$$", imageUrl: IMAGE_URLS.lyonFood2 },
              { name: "Chez Paul", description: "Traditional Lyonnaise.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.lyonFood3 },
              { name: "Les Trois Gaules", description: "Classic French brasserie.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.lyonFood4 },
              { name: "Café des Fédérations", description: "Historic café.", cuisine: "Bistro", priceRange: "$", imageUrl: IMAGE_URLS.lyonFood5 },
            ],
            sites: [
              { name: "Basilica of Notre-Dame de Fourvière", description: "Hilltop basilica.", ticketPrice: "€10", imageUrl: IMAGE_URLS.lyonSite1 },
              { name: "Old Town (Vieux Lyon)", description: "Renaissance district.", ticketPrice: "Free", imageUrl: IMAGE_URLS.lyonSite2 },
              { name: "Museum of Fine Arts", description: "Art museum.", ticketPrice: "€12", imageUrl: IMAGE_URLS.lyonSite3 },
              { name: "Parc de la Tête d'Or", description: "Urban park with lake.", ticketPrice: "Free", imageUrl: IMAGE_URLS.lyonSite4 },
              { name: "Confluence Museum", description: "Modern museum.", ticketPrice: "€14", imageUrl: IMAGE_URLS.lyonSite5 },
            ],
          },
        ],
      },
    ];

    // Clear existing data and reseed
    for (const c of seedData) {
      const country = await storage.createCountry({
        name: c.name,
        slug: c.slug,
        description: c.description,
        heroImage: c.heroImage,
        continent: c.continent,
      });

      for (const d of c.destinations) {
        const dest = await storage.createDestination({
          countryId: country.id,
          name: d.name,
          slug: d.slug,
          description: d.description,
          image: d.image,
        });

        for (const r of d.restaurants) {
          await storage.createRestaurant({
            destinationId: dest.id,
            name: r.name,
            description: r.description,
            cuisine: r.cuisine,
            priceRange: r.priceRange,
            imageUrl: r.imageUrl,
          });
        }

        for (const s of d.sites) {
          await storage.createCulturalSite({
            destinationId: dest.id,
            name: s.name,
            description: s.description,
            ticketPrice: s.ticketPrice,
            imageUrl: s.imageUrl,
          });
        }
      }
    }

    console.log("✅ Taste-Trek database seeded with relevant images for each location");
  } catch (err) {
    console.error("❌ Database seeding error:", err instanceof Error ? err.message : String(err));
  }
}

export async function registerRoutes(httpServer: Server, app: Express) {
  try {
    // Auth setup
    if (process.env.REPL_ID) {
      try {
        await setupAuth(app);
        registerAuthRoutes(app);
        console.log("✓ Auth routes registered");
      } catch (err) {
        console.warn("⚠ Auth setup skipped:", (err as Error).message);
      }
    }

    // Seed database on startup
    try {
      await seedDatabase();
    } catch (err) {
      console.error("❌ Database seeding error:", err instanceof Error ? err.message : String(err));
    }

    // ===== COUNTRIES ENDPOINTS =====
    app.get(api.countries.list.path, async (req, res) => {
      try {
        const countries = await storage.getCountries();
        res.json(countries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        res.status(500).json({ message: "Error fetching countries" });
      }
    });

    app.get(api.countries.get.path, async (req, res) => {
      try {
        const country = await storage.getCountry(Number(req.params.id));
        if (!country) return res.status(404).json({ message: "Country not found" });
        res.json(country);
      } catch (err) {
        console.error("Error fetching country:", err);
        res.status(500).json({ message: "Error fetching country" });
      }
    });

    app.get(api.countries.destinations.path, async (req, res) => {
      try {
        const dests = await storage.getDestinationsByCountry(Number(req.params.id));
        res.json(dests);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        res.status(500).json({ message: "Error fetching destinations" });
      }
    });

    // ===== DESTINATIONS ENDPOINTS =====
    app.get(api.destinations.get.path, async (req, res) => {
      try {
        const dest = await storage.getDestination(Number(req.params.id));
        if (!dest) return res.status(404).json({ message: "Destination not found" });
        res.json(dest);
      } catch (err) {
        console.error("Error fetching destination:", err);
        res.status(500).json({ message: "Error fetching destination" });
      }
    });

    app.get(api.destinations.restaurants.path, async (req, res) => {
      try {
        const rests = await storage.getRestaurantsByDestination(Number(req.params.id));
        res.json(rests);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).json({ message: "Error fetching restaurants" });
      }
    });

    app.get(api.destinations.culturalSites.path, async (req, res) => {
      try {
        const sites = await storage.getCulturalSitesByDestination(Number(req.params.id));
        res.json(sites);
      } catch (err) {
        console.error("Error fetching cultural sites:", err);
        res.status(500).json({ message: "Error fetching cultural sites" });
      }
    });

    // ===== SEARCH ENDPOINT =====
    app.get(api.search.path, async (req, res) => {
      try {
        const query = req.query.q as string;
        if (!query) return res.json({ countries: [], destinations: [] });
        const results = await storage.search(query);
        res.json(results);
      } catch (err) {
        console.error("Error searching:", err);
        res.status(500).json({ message: "Error during search" });
      }
    });

    // ===== FAVORITES ENDPOINTS =====
    app.get(api.favorites.list.path, async (req, res) => {
      try {
        // @ts-ignore
        const userId = req.user?.claims?.sub;
        if (!userId) {
          return res.json([]);
        }
        const favs = await storage.getFavorites(userId);
        res.json(favs);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        res.status(500).json({ message: "Error fetching favorites" });
      }
    });

    app.post(api.favorites.create.path, async (req, res) => {
      try {
        const input = api.favorites.create.input.parse(req.body);
        // @ts-ignore
        const userId = req.user?.claims?.sub;
        if (!userId) {
          return res.status(401).json({ message: "Authentication required" });
        }
        const fav = await storage.createFavorite({ ...input, userId });
        res.status(201).json(fav);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ message: err.errors[0].message });
        }
        console.error("Error creating favorite:", err);
        res.status(500).json({ message: "Error creating favorite" });
      }
    });

    app.delete(api.favorites.delete.path, async (req, res) => {
      try {
        // @ts-ignore
        const userId = req.user?.claims?.sub;
        if (!userId) {
          return res.status(401).json({ message: "Authentication required" });
        }
        await storage.deleteFavorite(Number(req.params.id), userId);
        res.status(204).send();
      } catch (err) {
        console.error("Error deleting favorite:", err);
        res.status(500).json({ message: "Error deleting favorite" });
      }
    });

    app.get(api.favorites.check.path, async (req, res) => {
      try {
        // @ts-ignore
        const userId = req.user?.claims?.sub;
        const type = req.params.type;
        const id = Number(req.params.id);

        if (!userId) {
          return res.json({ isFavorite: false });
        }

        const fav = await storage.getFavoriteByItem(userId, type, id);
        res.json({ isFavorite: !!fav, favoriteId: fav?.id });
      } catch (err) {
        console.error("Error checking favorite:", err);
        res.status(500).json({ message: "Error checking favorite" });
      }
    });

    console.log("✓ Taste-Trek routes registered successfully");
  } catch (err) {
    console.error("❌ Fatal error registering routes:", err);
  }

  return httpServer;
}
