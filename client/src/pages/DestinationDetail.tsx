import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useDestination, useRestaurants, useCulturalSites, useCheckFavorite, useToggleFavorite, useCountry } from "@/hooks/use-trek-data";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Heart, Landmark, Utensils, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Icons } from "@/components/Icons";
import { DestinationMap } from "@/components/ui/DestinationMap";
import { useState } from "react";

export default function DestinationDetail() {
  const [, params] = useRoute("/destination/:id");
  const id = Number(params?.id);
  const [heroImageError, setHeroImageError] = useState(false);
  const [restaurantImageErrors, setRestaurantImageErrors] = useState<Set<number>>(new Set());
  const [culturalSiteImageErrors, setCulturalSiteImageErrors] = useState<Set<number>>(new Set());
  
  const { data: destination, isLoading: isDestLoading } = useDestination(id);
  const { data: restaurants } = useRestaurants(id);
  const { data: sites } = useCulturalSites(id);
  const { data: country } = useCountry(destination?.countryId || 0);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: favoriteStatus } = useCheckFavorite("destination", id);
  const { add, remove } = useToggleFavorite();

  const isFavorite = favoriteStatus?.isFavorite;
  const favoriteId = favoriteStatus?.favoriteId;

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite && favoriteId) {
      remove.mutate(favoriteId);
    } else {
      const favorite = {
        userId: user.id,
        itemId: id,
        itemType: "destination",
      };
      
      // Also store country name in localStorage for display
      const favorites = JSON.parse(localStorage.getItem("taste-trek-favorites") || "[]");
      const newFav = {
        id: Math.max(...favorites.map((f: any) => f.id || 0), 0) + 1,
        ...favorite,
        countryName: country?.name,
        name: destination?.name,
        image: destination?.image,
      };
      favorites.push(newFav);
      localStorage.setItem("taste-trek-favorites", JSON.stringify(favorites));
      
      add.mutate(favorite);
      toast({
        title: "Added to favorites!",
        description: `${destination?.name} has been saved.`,
      });
    }
  };

  if (isDestLoading) return <div className="min-h-screen bg-background" />; // Simplified loading
  if (!destination) return <div>Destination not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[50vh] w-full bg-gradient-to-br from-slate-200 to-slate-300">
        {!heroImageError ? (
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover"
            onError={() => setHeroImageError(true)}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-24 w-24 text-orange-400 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 max-w-7xl mx-auto">
           <Link href={`/country/${destination.countryId}`}>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 w-fit mb-4 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Country
            </Button>
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Icons.Compass className="h-6 w-6 text-primary" />
                <h1 className="font-display text-5xl font-bold text-white">{destination.name}</h1>
              </div>
            </div>
            <Button 
              size="lg" 
              variant={isFavorite ? "secondary" : "default"}
              className={`gap-2 ${isFavorite ? "bg-white text-red-500 hover:bg-white/90" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
              onClick={handleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Save to Trips"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold mb-4">About the Destination</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{destination.description}</p>
            </div>

            <Tabs defaultValue="restaurants" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border p-0 mb-8 rounded-none space-x-8">
                <TabsTrigger 
                  value="map" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-lg px-0 rounded-none bg-transparent"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger 
                  value="restaurants" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-lg px-0 rounded-none bg-transparent"
                >
                  Local Restaurants
                </TabsTrigger>
                <TabsTrigger 
                  value="culture" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-lg px-0 rounded-none bg-transparent"
                >
                  Cultural Sites
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-6">
                <DestinationMap
                  restaurants={restaurants || []}
                  culturalSites={sites || []}
                  destinationName={destination.name}
                  centerLat={destination.coordinates?.lat || 40}
                  centerLng={destination.coordinates?.lng || 0}
                />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
                    <Utensils className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Restaurants</p>
                      <p className="text-2xl font-bold">{restaurants?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
                    <Landmark className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cultural Sites</p>
                      <p className="text-2xl font-bold">{sites?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="restaurants" className="space-y-6">
                {restaurants?.map((restaurant) => {
                  const hasImageError = restaurantImageErrors.has(restaurant.id);
                  return (
                    <motion.div 
                      key={restaurant.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-6 bg-card p-4 rounded-2xl border border-border/50 hover:shadow-md transition-shadow"
                    >
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-200 to-slate-300">
                        {!hasImageError ? (
                          <img 
                            src={restaurant.imageUrl} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover" 
                            onError={() => {
                              setRestaurantImageErrors(prev => new Set(prev).add(restaurant.id));
                            }}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Utensils className="h-8 w-8 text-orange-400 opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl">{restaurant.name}</h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{restaurant.priceRange}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Utensils className="h-3 w-3" />
                          <span>{restaurant.cuisine}</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">{restaurant.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </TabsContent>

              <TabsContent value="culture" className="space-y-6">
                {sites?.map((site) => {
                  const hasImageError = culturalSiteImageErrors.has(site.id);
                  return (
                    <motion.div 
                      key={site.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-6 bg-card p-4 rounded-2xl border border-border/50 hover:shadow-md transition-shadow"
                    >
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-200 to-slate-300">
                        {!hasImageError ? (
                          <img 
                            src={site.imageUrl} 
                            alt={site.name} 
                            className="w-full h-full object-cover" 
                            onError={() => {
                              setCulturalSiteImageErrors(prev => new Set(prev).add(site.id));
                            }}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Landmark className="h-8 w-8 text-orange-400 opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl">{site.name}</h3>
                          {site.ticketPrice && (
                            <Badge variant="outline">{site.ticketPrice}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Landmark className="h-3 w-3" />
                          <span>Cultural Site</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">{site.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Map Placeholder */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                <h3 className="font-bold mb-4">Location</h3>
                {/* Placeholder Map */}
                <div className="bg-muted rounded-xl h-48 w-full flex items-center justify-center text-muted-foreground mb-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4241,37.78,14.25,0,60/600x600?access_token=YOUR_TOKEN')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                  <span className="relative z-10 font-medium">Map View</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Located in the heart of the region, {destination.name} is accessible via major transport links.
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/25">
                <h3 className="font-bold text-xl mb-2">Plan Your Visit</h3>
                <p className="text-white/80 mb-6 text-sm">Get a curated itinerary for your trip to {destination.name}.</p>
                <Button variant="secondary" className="w-full font-semibold text-primary">Download Guide</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
