import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites, useToggleFavorite, useCountry, useDestination } from "@/hooks/use-trek-data";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, MapPin } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Icons } from '../components/Icons';

export default function Favorites() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: favorites, isLoading: isFavLoading } = useFavorites();
  const { remove } = useToggleFavorite();
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (isAuthLoading) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold mb-4">Sign in to view favorites</h1>
          <p className="text-muted-foreground mb-8">Create an account or sign in to save your favorite destinations and plan your next trip.</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold mb-2">My Trip Plan</h1>
        <p className="text-muted-foreground mb-12">Your saved destinations and potential stops.</p>

        {isFavLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : favorites?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring destinations and tap the heart icon to save them.</p>
            <Link href="/countries">
              <Button>Explore Destinations</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {favorites?.map((fav: any) => {
              const FavoriteCard = () => {
                const item = fav.item || fav;
                if (!item || !item.id) return null;
                
                const link = fav.itemType === 'country' ? `/country/${item.id}` : `/destination/${item.id}`;
                const image = fav.itemType === 'country' ? item.heroImage : item.image;
                const hasImageError = imageErrors.has(fav.id);
                const countryName = fav.itemType === 'destination' ? item.countryName || 'Unknown' : null;
                
                return (
                  <motion.div 
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col sm:flex-row gap-6 items-center group"
                  >
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 relative bg-muted">
                      {!hasImageError && image ? (
                        <img 
                          src={image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                          onError={() => {
                            setImageErrors(prev => new Set(prev).add(fav.id));
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                          <MapPin className="h-12 w-12 text-orange-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                         <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {fav.itemType}
                         </span>
                      </div>
                      <h3 className="text-2xl font-bold font-display mb-2">{item.name}</h3>
                      {countryName && (
                         <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground gap-1 mb-3">
                           <MapPin className="h-3 w-3" />
                           <span>{countryName}</span>
                         </div>
                      )}
                      {fav.itemType === 'destination' && !countryName && (
                         <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground gap-1">
                           <MapPin className="h-3 w-3" />
                           <span>View on map</span>
                         </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link href={link}>
                        <Button variant="outline" size="sm" className="gap-2">
                          View Details <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove.mutate(fav.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              };
              
              return <FavoriteCard key={fav.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
