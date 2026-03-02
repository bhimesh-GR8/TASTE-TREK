// Mock data for frontend-only deployment
import type { Country, Destination, Restaurant, CulturalSite } from "@shared/schema";

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

  // TOKYO - Food
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

  // KYOTO - Food
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

  // MEXICO CITY - Food
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

  // CANCUN - Food
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

  // BANGKOK - Food
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

  // PHUKET - Food
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

  // PARIS - Food
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

  // LYON - Food
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
  italy: "/images/ITALY.jpg",
  japan: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  mexico: "https://images.unsplash.com/photo-1535139262971-187ea590bd0d?w=800&h=600&fit=crop&q=80",
  thailand: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80",
  rome: "/images/ROME.jpg",
  venice: "/images/Venice.jpg",
  florence: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80",
  milan: "https://images.unsplash.com/photo-1568448069627-82a28b988ebd?w=800&h=600&fit=crop&q=80",
  tokyo: "https://images.unsplash.com/photo-1528164344705-47542687c6f1?w=800&h=600&fit=crop&q=80",
  kyoto: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  mexicoCity: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80",
  cancun: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  bangkok: "https://images.unsplash.com/photo-1522383150241-6c328020254e?w=800&h=600&fit=crop&q=80",
  phuket: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80",
  lyon: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80",
};

export const mockCountriesData: Country[] = [
  {
    id: 1,
    name: "Italy",
    slug: "italy",
    description: "A culinary paradise known for its rich history, art, and diverse regional cuisines.",
    heroImage: COUNTRY_IMAGES.italy,
    continent: "Europe",
  },
  {
    id: 2,
    name: "Japan",
    slug: "japan",
    description: "A blend of ancient traditions and cutting-edge modernity with world-class food.",
    heroImage: COUNTRY_IMAGES.japan,
    continent: "Asia",
  },
  {
    id: 3,
    name: "Mexico",
    slug: "mexico",
    description: "Vibrant culture, ancient ruins, and spicy, flavorful cuisine.",
    heroImage: COUNTRY_IMAGES.mexico,
    continent: "North America",
  },
  {
    id: 4,
    name: "Thailand",
    slug: "thailand",
    description: "Tropical beaches, royal palaces, and incredible street food.",
    heroImage: COUNTRY_IMAGES.thailand,
    continent: "Asia",
  },
  {
    id: 5,
    name: "France",
    slug: "france",
    description: "Medieval cities, alpine villages and glorious beaches.",
    heroImage: COUNTRY_IMAGES.france,
    continent: "Europe",
  },
];

export const mockDestinationsData: Destination[] = [
  {
    id: 1,
    countryId: 1,
    name: "Rome",
    slug: "rome",
    description: "The Eternal City, famous for ancient ruins and Carbonara.",
    image: COUNTRY_IMAGES.rome,
    coordinates: { lat: 41.9028, lng: 12.4964 },
  },
  {
    id: 2,
    countryId: 1,
    name: "Venice",
    slug: "venice",
    description: "The City of Canals, famous for gondolas and Renaissance art.",
    image: COUNTRY_IMAGES.venice,
    coordinates: { lat: 45.4408, lng: 12.3155 },
  },
  {
    id: 3,
    countryId: 1,
    name: "Florence",
    slug: "florence",
    description: "The Renaissance heart of Italy, home to masterpieces and innovation.",
    image: COUNTRY_IMAGES.florence,
    coordinates: { lat: 43.7696, lng: 11.2558 },
  },
  {
    id: 4,
    countryId: 1,
    name: "Milan",
    slug: "milan",
    description: "Modern Italy's fashion and design capital with Gothic grandeur.",
    image: COUNTRY_IMAGES.milan,
    coordinates: { lat: 45.4642, lng: 9.1900 },
  },
  {
    id: 5,
    countryId: 2,
    name: "Tokyo",
    slug: "tokyo",
    description: "The bustling capital, a dynamic mix of neon-lit skyscrapers and serene temples.",
    image: COUNTRY_IMAGES.tokyo,
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: 6,
    countryId: 2,
    name: "Kyoto",
    slug: "kyoto",
    description: "Ancient capital preserving Japan's traditional culture and temples.",
    image: COUNTRY_IMAGES.kyoto,
    coordinates: { lat: 35.0116, lng: 135.7681 },
  },
  {
    id: 7,
    countryId: 3,
    name: "Mexico City",
    slug: "mexico-city",
    description: "A high-altitude, densely populated capital with incredible food scene.",
    image: COUNTRY_IMAGES.mexicoCity,
    coordinates: { lat: 19.4326, lng: -99.1332 },
  },
  {
    id: 8,
    countryId: 3,
    name: "Cancun",
    slug: "cancun",
    description: "Tropical beaches and Caribbean luxury destination.",
    image: COUNTRY_IMAGES.cancun,
    coordinates: { lat: 21.1619, lng: -86.8515 },
  },
  {
    id: 9,
    countryId: 4,
    name: "Bangkok",
    slug: "bangkok",
    description: "City of Angels, a bustling metropolis with temples and street food.",
    image: COUNTRY_IMAGES.bangkok,
    coordinates: { lat: 13.7563, lng: 100.5018 },
  },
  {
    id: 10,
    countryId: 4,
    name: "Phuket",
    slug: "phuket",
    description: "Island paradise with beaches, diving, and nightlife.",
    image: COUNTRY_IMAGES.phuket,
    coordinates: { lat: 8.0863, lng: 98.2808 },
  },
  {
    id: 11,
    countryId: 5,
    name: "Paris",
    slug: "paris",
    description: "The City of Light, romantic capital of France.",
    image: COUNTRY_IMAGES.paris,
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: 12,
    countryId: 5,
    name: "Lyon",
    slug: "lyon",
    description: "Culinary capital of France with Renaissance old town.",
    image: COUNTRY_IMAGES.lyon,
    coordinates: { lat: 45.7640, lng: 4.8357 },
  },
];

export const mockRestaurantsData: Restaurant[] = [
  // Rome
  { id: 1, destinationId: 1, name: "Roscioli Salumeria", description: "Famous for Carbonara.", cuisine: "Roman", priceRange: "$$$", imageUrl: IMAGE_URLS.romeFood1, coordinates: { lat: 41.8952, lng: 12.4758 } },
  { id: 2, destinationId: 1, name: "Da Enzo al 29", description: "Classic Trattoria.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood2, coordinates: { lat: 41.8945, lng: 12.4750 } },
  { id: 3, destinationId: 1, name: "La Pergola", description: "3-Michelin star dining.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.romeFood3, coordinates: { lat: 41.9029, lng: 12.4964 } },
  { id: 4, destinationId: 1, name: "Pizzarium Bonci", description: "Best pizza al taglio.", cuisine: "Pizza", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood4, coordinates: { lat: 41.8935, lng: 12.4765 } },
  { id: 5, destinationId: 1, name: "Tonnarello", description: "Hearty pastas.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.romeFood5, coordinates: { lat: 41.8950, lng: 12.4955 } },

  // Venice
  { id: 6, destinationId: 2, name: "Antiche Carampane", description: "Traditional Venetian seafood.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood1, coordinates: { lat: 45.4371, lng: 12.3250 } },
  { id: 7, destinationId: 2, name: "Da Fiore", description: "Michelin-starred classics.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.veniceFood2, coordinates: { lat: 45.4380, lng: 12.3180 } },
  { id: 8, destinationId: 2, name: "Osteria da Rioba", description: "Modern Italian cuisine.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood3, coordinates: { lat: 45.4400, lng: 12.3200 } },
  { id: 9, destinationId: 2, name: "Al Covo", description: "Venetian specialties.", cuisine: "Regional", priceRange: "$$$", imageUrl: IMAGE_URLS.veniceFood4, coordinates: { lat: 45.4350, lng: 12.3350 } },
  { id: 10, destinationId: 2, name: "Trattoria al Pont de Vio", description: "Casual neighborhood eatery.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.veniceFood5, coordinates: { lat: 45.4420, lng: 12.3140 } },

  // Florence
  { id: 11, destinationId: 3, name: "Enoteca Pinchiorri", description: "Michelin 2-star fine dining.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.florenceFood1, coordinates: { lat: 43.7730, lng: 11.2600 } },
  { id: 12, destinationId: 3, name: "Alloro", description: "Contemporary Tuscan.", cuisine: "Tuscan", priceRange: "$$$", imageUrl: IMAGE_URLS.florenceFood2, coordinates: { lat: 43.7750, lng: 11.2580 } },
  { id: 13, destinationId: 3, name: "Trattoria da Mariano", description: "Authentic Florentine ribollita.", cuisine: "Tuscan", priceRange: "$$", imageUrl: IMAGE_URLS.florenceFood3, coordinates: { lat: 43.7700, lng: 11.2550 } },
  { id: 14, destinationId: 3, name: "Il Latini", description: "Family-style bistro.", cuisine: "Italian", priceRange: "$$", imageUrl: IMAGE_URLS.florenceFood4, coordinates: { lat: 43.7780, lng: 11.2620 } },
  { id: 15, destinationId: 3, name: "Cibreo", description: "Chef Fabrizio's Tuscan delights.", cuisine: "Tuscan", priceRange: "$$$", imageUrl: IMAGE_URLS.florenceFood5, coordinates: { lat: 43.7720, lng: 11.2570 } },

  // Milan
  { id: 16, destinationId: 4, name: "Cracco", description: "Michelin-starred gastronomy.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.milanFood1, coordinates: { lat: 45.4630, lng: 9.1920 } },
  { id: 17, destinationId: 4, name: "Da Giacomo", description: "Fresh seafood and classics.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.milanFood2, coordinates: { lat: 45.4650, lng: 9.1900 } },
  { id: 18, destinationId: 4, name: "Al Matarel", description: "Milanese tradition at its best.", cuisine: "Milanese", priceRange: "$$", imageUrl: IMAGE_URLS.milanFood3, coordinates: { lat: 45.4610, lng: 9.1880 } },
  { id: 19, destinationId: 4, name: "Ristorante Gino Sorbillo", description: "Famous Neapolitan pizza.", cuisine: "Pizza", priceRange: "$$", imageUrl: IMAGE_URLS.milanFood4, coordinates: { lat: 45.4670, lng: 9.1940 } },
  { id: 20, destinationId: 4, name: "Armani/Ristorante", description: "High fashion dining.", cuisine: "Fine Dining", priceRange: "$$$", imageUrl: IMAGE_URLS.milanFood5, coordinates: { lat: 45.4640, lng: 9.1910 } },

  // Tokyo
  { id: 21, destinationId: 5, name: "Sukiyabashi Jiro", description: "Legendary Sushi.", cuisine: "Sushi", priceRange: "$$$$", imageUrl: IMAGE_URLS.tokyoFood1, coordinates: { lat: 35.6737, lng: 139.7654 } },
  { id: 22, destinationId: 5, name: "Ichiran Ramen", description: "Famous Tonkotsu Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: IMAGE_URLS.tokyoFood2, coordinates: { lat: 35.6788, lng: 139.7652 } },
  { id: 23, destinationId: 5, name: "Tempura Kondo", description: "High-end Tempura.", cuisine: "Tempura", priceRange: "$$$", imageUrl: IMAGE_URLS.tokyoFood3, coordinates: { lat: 35.6750, lng: 139.7680 } },
  { id: 24, destinationId: 5, name: "Yakitori Torishiki", description: "Grilled chicken skewers.", cuisine: "Yakitori", priceRange: "$$$", imageUrl: IMAGE_URLS.tokyoFood4, coordinates: { lat: 35.6762, lng: 139.6550 } },
  { id: 25, destinationId: 5, name: "Afuri", description: "Yuzu Shio Ramen.", cuisine: "Ramen", priceRange: "$", imageUrl: IMAGE_URLS.tokyoFood5, coordinates: { lat: 35.6800, lng: 139.7700 } },

  // Kyoto
  { id: 26, destinationId: 6, name: "Gion Tanto", description: "Kaiseki cuisine.", cuisine: "Kaiseki", priceRange: "$$$$", imageUrl: IMAGE_URLS.kyotoFood1, coordinates: { lat: 35.0050, lng: 135.7750 } },
  { id: 27, destinationId: 6, name: "Okutan Kappa Zushi", description: "Tofu specialties.", cuisine: "Vegetarian", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood2, coordinates: { lat: 35.0100, lng: 135.7700 } },
  { id: 28, destinationId: 6, name: "Hyotei", description: "Traditional Japanese.", cuisine: "Japanese", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood3, coordinates: { lat: 35.0080, lng: 135.7720 } },
  { id: 29, destinationId: 6, name: "Gion Kappa Zushi", description: "Sushi restaurant.", cuisine: "Sushi", priceRange: "$$$", imageUrl: IMAGE_URLS.kyotoFood4, coordinates: { lat: 35.0000, lng: 135.7680 } },
  { id: 30, destinationId: 6, name: "Chaseki", description: "Tea house cuisine.", cuisine: "Fusion", priceRange: "$$", imageUrl: IMAGE_URLS.kyotoFood5, coordinates: { lat: 35.0120, lng: 135.7740 } },

  // Mexico City
  { id: 31, destinationId: 7, name: "Pujol", description: "Modern Mexican.", cuisine: "Mexican", priceRange: "$$$$", imageUrl: IMAGE_URLS.mexicoCityFood1, coordinates: { lat: 19.4326, lng: -99.1332 } },
  { id: 32, destinationId: 7, name: "Contramar", description: "Seafood tostadas.", cuisine: "Seafood", priceRange: "$$$", imageUrl: IMAGE_URLS.mexicoCityFood2, coordinates: { lat: 19.4350, lng: -99.1350 } },
  { id: 33, destinationId: 7, name: "El Huequito", description: "Tacos al Pastor.", cuisine: "Street Food", priceRange: "$", imageUrl: IMAGE_URLS.mexicoCityFood3, coordinates: { lat: 19.4300, lng: -99.1300 } },
  { id: 34, destinationId: 7, name: "Rosetta", description: "Italian-Mexican fusion.", cuisine: "Fusion", priceRange: "$$$", imageUrl: IMAGE_URLS.mexicoCityFood4, coordinates: { lat: 19.4370, lng: -99.1380 } },
  { id: 35, destinationId: 7, name: "Churrería El Moro", description: "Famous Churros.", cuisine: "Dessert", priceRange: "$", imageUrl: IMAGE_URLS.mexicoCityFood5, coordinates: { lat: 19.4400, lng: -99.1400 } },

  // Cancun
  { id: 36, destinationId: 8, name: "La Vaquita", description: "Mexican beachfront dining.", cuisine: "Mexican", priceRange: "$$$", imageUrl: IMAGE_URLS.cancunFood1, coordinates: { lat: 21.1619, lng: -86.8515 } },
  { id: 37, destinationId: 8, name: "Señor Frog's", description: "Casual seafood.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.cancunFood2, coordinates: { lat: 21.1630, lng: -86.8500 } },
  { id: 38, destinationId: 8, name: "Palazzo", description: "Italian restaurant.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.cancunFood3, coordinates: { lat: 21.1600, lng: -86.8530 } },
  { id: 39, destinationId: 8, name: "The Surfin' Burrito", description: "Casual tacos.", cuisine: "Street Food", priceRange: "$", imageUrl: IMAGE_URLS.cancunFood4, coordinates: { lat: 21.1650, lng: -86.8490 } },
  { id: 40, destinationId: 8, name: "Dady'O Nightclub Restaurant", description: "Nightlife dining.", cuisine: "International", priceRange: "$$", imageUrl: IMAGE_URLS.cancunFood5, coordinates: { lat: 21.1640, lng: -86.8520 } },

  // Bangkok
  { id: 41, destinationId: 9, name: "Jay Fai", description: "Michelin-starred crab omelette.", cuisine: "Street Food", priceRange: "$$$", imageUrl: IMAGE_URLS.bangkokFood1, coordinates: { lat: 13.7500, lng: 100.5100 } },
  { id: 42, destinationId: 9, name: "Gaggan Anand", description: "Progressive Indian.", cuisine: "Fine Dining", priceRange: "$$$$", imageUrl: IMAGE_URLS.bangkokFood2, coordinates: { lat: 13.7550, lng: 100.5050 } },
  { id: 43, destinationId: 9, name: "Thip Samai", description: "Best Pad Thai.", cuisine: "Noodles", priceRange: "$$", imageUrl: IMAGE_URLS.bangkokFood3, coordinates: { lat: 13.7580, lng: 100.5020 } },
  { id: 44, destinationId: 9, name: "Wattana Panich", description: "Beef broth stewed for years.", cuisine: "Noodles", priceRange: "$", imageUrl: IMAGE_URLS.bangkokFood4, coordinates: { lat: 13.7600, lng: 100.5040 } },
  { id: 45, destinationId: 9, name: "Som Tam Nua", description: "Papaya Salad.", cuisine: "Isan", priceRange: "$", imageUrl: IMAGE_URLS.bangkokFood5, coordinates: { lat: 13.7560, lng: 100.5060 } },

  // Phuket
  { id: 46, destinationId: 10, name: "Acqua Restaurant", description: "Italian beachfront.", cuisine: "Italian", priceRange: "$$$", imageUrl: IMAGE_URLS.phuketFood1, coordinates: { lat: 8.0863, lng: 98.2808 } },
  { id: 47, destinationId: 10, name: "On the Rock", description: "Seafood with sunset views.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood2, coordinates: { lat: 8.0880, lng: 98.2820 } },
  { id: 48, destinationId: 10, name: "Thai Kitchen", description: "Traditional Thai cuisine.", cuisine: "Thai", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood3, coordinates: { lat: 8.0850, lng: 98.2790 } },
  { id: 49, destinationId: 10, name: "Savoey Seafood", description: "Fresh local seafood.", cuisine: "Seafood", priceRange: "$$", imageUrl: IMAGE_URLS.phuketFood4, coordinates: { lat: 8.0900, lng: 98.2830 } },
  { id: 50, destinationId: 10, name: "Ka Jok See", description: "Thai fusion fine dining.", cuisine: "Fusion", priceRange: "$$$", imageUrl: IMAGE_URLS.phuketFood5, coordinates: { lat: 8.0870, lng: 98.2810 } },

  // Paris
  { id: 51, destinationId: 11, name: "Le Jules Verne", description: "Eiffel Tower dining.", cuisine: "French", priceRange: "$$$$", imageUrl: IMAGE_URLS.parisFood1, coordinates: { lat: 48.8584, lng: 2.2945 } },
  { id: 52, destinationId: 11, name: "L'As du Fallafel", description: "Famous falafel.", cuisine: "Middle Eastern", priceRange: "$", imageUrl: IMAGE_URLS.parisFood2, coordinates: { lat: 48.8620, lng: 2.3650 } },
  { id: 53, destinationId: 11, name: "Bouillon Chartier", description: "Historic brasserie.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.parisFood3, coordinates: { lat: 48.8730, lng: 2.3490 } },
  { id: 54, destinationId: 11, name: "Angelina", description: "Famous hot chocolate.", cuisine: "Cafe", priceRange: "$$", imageUrl: IMAGE_URLS.parisFood4, coordinates: { lat: 48.8630, lng: 2.3300 } },
  { id: 55, destinationId: 11, name: "Le Comptoir du Relais", description: "Classic bistro.", cuisine: "Bistro", priceRange: "$$$", imageUrl: IMAGE_URLS.parisFood5, coordinates: { lat: 48.8520, lng: 2.3340 } },

  // Lyon
  { id: 56, destinationId: 12, name: "Paul Bocuse", description: "Legendary French cuisine.", cuisine: "French", priceRange: "$$$$", imageUrl: IMAGE_URLS.lyonFood1, coordinates: { lat: 45.7620, lng: 4.8357 } },
  { id: 57, destinationId: 12, name: "La Cour des Loges", description: "Fine dining bistro.", cuisine: "French", priceRange: "$$$", imageUrl: IMAGE_URLS.lyonFood2, coordinates: { lat: 45.7640, lng: 4.8370 } },
  { id: 58, destinationId: 12, name: "Chez Paul", description: "Traditional Lyonnaise.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.lyonFood3, coordinates: { lat: 45.7650, lng: 4.8350 } },
  { id: 59, destinationId: 12, name: "Les Trois Gaules", description: "Classic French brasserie.", cuisine: "French", priceRange: "$$", imageUrl: IMAGE_URLS.lyonFood4, coordinates: { lat: 45.7630, lng: 4.8340 } },
  { id: 60, destinationId: 12, name: "Café des Fédérations", description: "Historic café.", cuisine: "Bistro", priceRange: "$", imageUrl: IMAGE_URLS.lyonFood5, coordinates: { lat: 45.7610, lng: 4.8360 } },
];

export const mockCulturalSitesData: CulturalSite[] = [
  // Rome
  { id: 1, destinationId: 1, name: "Colosseum", description: "Ancient amphitheater.", ticketPrice: "€16", imageUrl: IMAGE_URLS.romeSite1, coordinates: { lat: 41.8902, lng: 12.4923 } },
  { id: 2, destinationId: 1, name: "Pantheon", description: "Former Roman temple.", ticketPrice: "Free", imageUrl: IMAGE_URLS.romeSite2, coordinates: { lat: 41.8986, lng: 12.4769 } },
  { id: 3, destinationId: 1, name: "Vatican Museums", description: "Art collection.", ticketPrice: "€17", imageUrl: IMAGE_URLS.romeSite3, coordinates: { lat: 41.9065, lng: 12.4537 } },
  { id: 4, destinationId: 1, name: "Trevi Fountain", description: "Baroque fountain.", ticketPrice: "Free", imageUrl: IMAGE_URLS.romeSite4, coordinates: { lat: 41.9009, lng: 12.4833 } },
  { id: 5, destinationId: 1, name: "Roman Forum", description: "Plaza surrounded by ruins.", ticketPrice: "Incl. Colosseum", imageUrl: IMAGE_URLS.romeSite5, coordinates: { lat: 41.8925, lng: 12.4858 } },

  // Venice
  { id: 6, destinationId: 2, name: "St. Mark's Basilica", description: "Byzantine-style cathedral.", ticketPrice: "€5", imageUrl: IMAGE_URLS.veniceSite1, coordinates: { lat: 45.4343, lng: 12.3401 } },
  { id: 7, destinationId: 2, name: "Doge's Palace", description: "Historic residence of Venetian rulers.", ticketPrice: "€28", imageUrl: IMAGE_URLS.veniceSite2, coordinates: { lat: 45.4343, lng: 12.3385 } },
  { id: 8, destinationId: 2, name: "Grand Canal", description: "Main waterway through Venice.", ticketPrice: "Free", imageUrl: IMAGE_URLS.veniceSite3, coordinates: { lat: 45.4370, lng: 12.3260 } },
  { id: 9, destinationId: 2, name: "Basilica di Santa Maria della Salute", description: "Renaissance religious edifice.", ticketPrice: "€4", imageUrl: IMAGE_URLS.veniceSite4, coordinates: { lat: 45.4314, lng: 12.3270 } },
  { id: 10, destinationId: 2, name: "Rialto Bridge", description: "Iconic stone bridge.", ticketPrice: "Free", imageUrl: IMAGE_URLS.veniceSite5, coordinates: { lat: 45.4389, lng: 12.3357 } },

  // Florence
  { id: 11, destinationId: 3, name: "Florence Cathedral (Duomo)", description: "Magnificent Renaissance dome.", ticketPrice: "€30", imageUrl: IMAGE_URLS.florenceSite1, coordinates: { lat: 43.7731, lng: 11.2549 } },
  { id: 12, destinationId: 3, name: "Uffizi Gallery", description: "World-class art museum.", ticketPrice: "€12", imageUrl: IMAGE_URLS.florenceSite2, coordinates: { lat: 43.7679, lng: 11.2631 } },
  { id: 13, destinationId: 3, name: "Accademia Gallery", description: "Home of Michelangelo's David.", ticketPrice: "€12.50", imageUrl: IMAGE_URLS.florenceSite3, coordinates: { lat: 43.7761, lng: 11.2556 } },
  { id: 14, destinationId: 3, name: "Ponte Vecchio", description: "Historic bridge with shops.", ticketPrice: "Free", imageUrl: IMAGE_URLS.florenceSite4, coordinates: { lat: 43.7682, lng: 11.2533 } },
  { id: 15, destinationId: 3, name: "Palazzo Pitti", description: "Grand Renaissance palace.", ticketPrice: "€13", imageUrl: IMAGE_URLS.florenceSite5, coordinates: { lat: 43.7645, lng: 11.2489 } },

  // Milan
  { id: 16, destinationId: 4, name: "Milan Cathedral (Duomo)", description: "Stunning Gothic architecture.", ticketPrice: "€3", imageUrl: IMAGE_URLS.milanSite1, coordinates: { lat: 45.4641, lng: 9.1919 } },
  { id: 17, destinationId: 4, name: "The Last Supper (Santa Maria delle Grazie)", description: "Leonardo da Vinci's masterpiece.", ticketPrice: "€15", imageUrl: IMAGE_URLS.milanSite2, coordinates: { lat: 45.4692, lng: 9.1760 } },
  { id: 18, destinationId: 4, name: "Sforza Castle", description: "Renaissance fortress.", ticketPrice: "€5", imageUrl: IMAGE_URLS.milanSite3, coordinates: { lat: 45.4706, lng: 9.1819 } },
  { id: 19, destinationId: 4, name: "Galleria Vittorio Emanuele II", description: "Historic shopping arcade.", ticketPrice: "Free", imageUrl: IMAGE_URLS.milanSite4, coordinates: { lat: 45.4650, lng: 9.1945 } },
  { id: 20, destinationId: 4, name: "La Scala", description: "World-renowned opera house.", ticketPrice: "€20", imageUrl: IMAGE_URLS.milanSite5, coordinates: { lat: 45.4682, lng: 9.2012 } },

  // Tokyo
  { id: 21, destinationId: 5, name: "Senso-ji", description: "Ancient Buddhist temple.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite1, coordinates: { lat: 35.7148, lng: 139.7967 } },
  { id: 22, destinationId: 5, name: "Tokyo Skytree", description: "Broadcasting tower.", ticketPrice: "¥3000", imageUrl: IMAGE_URLS.tokyoSite2, coordinates: { lat: 35.7101, lng: 139.8107 } },
  { id: 23, destinationId: 5, name: "Meiji Shrine", description: "Shinto shrine.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite3, coordinates: { lat: 35.6761, lng: 139.7009 } },
  { id: 24, destinationId: 5, name: "Shibuya Crossing", description: "Famous scramble crossing.", ticketPrice: "Free", imageUrl: IMAGE_URLS.tokyoSite4, coordinates: { lat: 35.6595, lng: 139.7004 } },
  { id: 25, destinationId: 5, name: "TeamLab Planets", description: "Digital art museum.", ticketPrice: "¥3200", imageUrl: IMAGE_URLS.tokyoSite5, coordinates: { lat: 35.6453, lng: 139.7314 } },

  // Kyoto
  { id: 26, destinationId: 6, name: "Fushimi Inari Shrine", description: "Famous torii gates.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite1, coordinates: { lat: 34.9667, lng: 135.7725 } },
  { id: 27, destinationId: 6, name: "Arashiyama Bamboo Grove", description: "Scenic bamboo forest.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite2, coordinates: { lat: 35.0166, lng: 135.6792 } },
  { id: 28, destinationId: 6, name: "Kinkaku-ji", description: "Golden Pavilion.", ticketPrice: "¥400", imageUrl: IMAGE_URLS.kyotoSite3, coordinates: { lat: 35.0394, lng: 135.7297 } },
  { id: 29, destinationId: 6, name: "Gion District", description: "Historic geisha district.", ticketPrice: "Free", imageUrl: IMAGE_URLS.kyotoSite4, coordinates: { lat: 35.0047, lng: 135.7750 } },
  { id: 30, destinationId: 6, name: "Kiyomizu-dera", description: "Historic Buddhist temple.", ticketPrice: "¥400", imageUrl: IMAGE_URLS.kyotoSite5, coordinates: { lat: 34.9948, lng: 135.7852 } },

  // Mexico City
  { id: 31, destinationId: 7, name: "Teotihuacan", description: "Ancient pyramids.", ticketPrice: "$80 MXN", imageUrl: IMAGE_URLS.mexicoCitySite1, coordinates: { lat: 19.6923, lng: -98.8449 } },
  { id: 32, destinationId: 7, name: "Frida Kahlo Museum", description: "Blue House.", ticketPrice: "$250 MXN", imageUrl: IMAGE_URLS.mexicoCitySite2, coordinates: { lat: 19.4326, lng: -99.1332 } },
  { id: 33, destinationId: 7, name: "Chapultepec Castle", description: "Historic hilltop castle.", ticketPrice: "$85 MXN", imageUrl: IMAGE_URLS.mexicoCitySite3, coordinates: { lat: 19.4265, lng: -99.1865 } },
  { id: 34, destinationId: 7, name: "Zócalo", description: "Main square.", ticketPrice: "Free", imageUrl: IMAGE_URLS.mexicoCitySite4, coordinates: { lat: 19.4326, lng: -99.1332 } },
  { id: 35, destinationId: 7, name: "Palacio de Bellas Artes", description: "Cultural center.", ticketPrice: "$75 MXN", imageUrl: IMAGE_URLS.mexicoCitySite5, coordinates: { lat: 19.4370, lng: -99.1391 } },

  // Cancun
  { id: 36, destinationId: 8, name: "Chichen Itza", description: "Mayan pyramid ruins.", ticketPrice: "$50 MXN", imageUrl: IMAGE_URLS.cancunSite1, coordinates: { lat: 20.6843, lng: -87.1450 } },
  { id: 37, destinationId: 8, name: "Tulum Ruins", description: "Clifftop Mayan ruins.", ticketPrice: "$75 MXN", imageUrl: IMAGE_URLS.cancunSite2, coordinates: { lat: 20.2111, lng: -87.4253 } },
  { id: 38, destinationId: 8, name: "Cenote Ik Kil", description: "Natural sinkhole.", ticketPrice: "$100 MXN", imageUrl: IMAGE_URLS.cancunSite3, coordinates: { lat: 20.8864, lng: -87.2934 } },
  { id: 39, destinationId: 8, name: "El Rey Ruins", description: "Beach ruins.", ticketPrice: "$50 MXN", imageUrl: IMAGE_URLS.cancunSite4, coordinates: { lat: 21.0919, lng: -86.7975 } },
  { id: 40, destinationId: 8, name: "Great Mesoamerican Barrier Reef", description: "Snorkeling spot.", ticketPrice: "$80 MXN", imageUrl: IMAGE_URLS.cancunSite5, coordinates: { lat: 21.3333, lng: -86.7500 } },

  // Bangkok
  { id: 41, destinationId: 9, name: "Grand Palace", description: "Official residence of Kings.", ticketPrice: "500 THB", imageUrl: IMAGE_URLS.bangkokSite1, coordinates: { lat: 13.7503, lng: 100.4933 } },
  { id: 42, destinationId: 9, name: "Wat Arun", description: "Temple of Dawn.", ticketPrice: "100 THB", imageUrl: IMAGE_URLS.bangkokSite2, coordinates: { lat: 13.7452, lng: 100.4881 } },
  { id: 43, destinationId: 9, name: "Chatuchak Market", description: "Weekend market.", ticketPrice: "Free", imageUrl: IMAGE_URLS.bangkokSite3, coordinates: { lat: 13.8011, lng: 100.5542 } },
  { id: 44, destinationId: 9, name: "Wat Pho", description: "Reclining Buddha.", ticketPrice: "200 THB", imageUrl: IMAGE_URLS.bangkokSite4, coordinates: { lat: 13.7450, lng: 100.4918 } },
  { id: 45, destinationId: 9, name: "Khao San Road", description: "Backpacker hub.", ticketPrice: "Free", imageUrl: IMAGE_URLS.bangkokSite5, coordinates: { lat: 13.7634, lng: 100.5034 } },

  // Phuket
  { id: 46, destinationId: 10, name: "Big Buddha", description: "Hilltop golden buddha.", ticketPrice: "300 THB", imageUrl: IMAGE_URLS.phuketSite1, coordinates: { lat: 7.8137, lng: 98.2962 } },
  { id: 47, destinationId: 10, name: "Phi Phi Islands", description: "Island hopping.", ticketPrice: "800 THB", imageUrl: IMAGE_URLS.phuketSite2, coordinates: { lat: 8.1892, lng: 98.7789 } },
  { id: 48, destinationId: 10, name: "Phang Nga Bay", description: "Limestone karsts.", ticketPrice: "600 THB", imageUrl: IMAGE_URLS.phuketSite3, coordinates: { lat: 8.2433, lng: 98.5043 } },
  { id: 49, destinationId: 10, name: "Patong Beach", description: "Popular beach resort.", ticketPrice: "Free", imageUrl: IMAGE_URLS.phuketSite4, coordinates: { lat: 7.8972, lng: 98.2948 } },
  { id: 50, destinationId: 10, name: "Wat Chalong", description: "Historic temple.", ticketPrice: "20 THB", imageUrl: IMAGE_URLS.phuketSite5, coordinates: { lat: 7.8748, lng: 98.3190 } },

  // Paris
  { id: 51, destinationId: 11, name: "Eiffel Tower", description: "Iron lattice tower.", ticketPrice: "€26", imageUrl: IMAGE_URLS.parisSite1, coordinates: { lat: 48.8584, lng: 2.2945 } },
  { id: 52, destinationId: 11, name: "Louvre Museum", description: "Art museum.", ticketPrice: "€17", imageUrl: IMAGE_URLS.parisSite2, coordinates: { lat: 48.8606, lng: 2.3352 } },
  { id: 53, destinationId: 11, name: "Notre-Dame", description: "Medieval cathedral.", ticketPrice: "Free", imageUrl: IMAGE_URLS.parisSite3, coordinates: { lat: 48.8530, lng: 2.3499 } },
  { id: 54, destinationId: 11, name: "Sacré-Cœur", description: "Basilica on a hill.", ticketPrice: "Free", imageUrl: IMAGE_URLS.parisSite4, coordinates: { lat: 48.8867, lng: 2.3431 } },
  { id: 55, destinationId: 11, name: "Arc de Triomphe", description: "Triumphal arch.", ticketPrice: "€13", imageUrl: IMAGE_URLS.parisSite5, coordinates: { lat: 48.8738, lng: 2.2950 } },

  // Lyon
  { id: 56, destinationId: 12, name: "Basilica of Notre-Dame de Fourvière", description: "Hilltop basilica.", ticketPrice: "€10", imageUrl: IMAGE_URLS.lyonSite1, coordinates: { lat: 45.7656, lng: 4.8227 } },
  { id: 57, destinationId: 12, name: "Old Town (Vieux Lyon)", description: "Renaissance district.", ticketPrice: "Free", imageUrl: IMAGE_URLS.lyonSite2, coordinates: { lat: 45.7631, lng: 4.8320 } },
  { id: 58, destinationId: 12, name: "Museum of Fine Arts", description: "Art museum.", ticketPrice: "€12", imageUrl: IMAGE_URLS.lyonSite3, coordinates: { lat: 45.7668, lng: 4.8363 } },
  { id: 59, destinationId: 12, name: "Parc de la Tête d'Or", description: "Urban park with lake.", ticketPrice: "Free", imageUrl: IMAGE_URLS.lyonSite4, coordinates: { lat: 45.7702, lng: 4.8425 } },
  { id: 60, destinationId: 12, name: "Confluence Museum", description: "Modern museum.", ticketPrice: "€14", imageUrl: IMAGE_URLS.lyonSite5, coordinates: { lat: 45.7390, lng: 4.8257 } },
];
