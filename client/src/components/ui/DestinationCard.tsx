import { Link } from "wouter";
import { MapPin, Heart } from "lucide-react";
import { type Destination } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useCheckFavorite, useToggleFavorite } from "@/hooks/use-trek-data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: favoriteStatus } = useCheckFavorite("destination", destination.id);
  const { add, remove } = useToggleFavorite();
  const [imageError, setImageError] = useState(false);

  const isFavorite = favoriteStatus?.isFavorite;
  const favoriteId = favoriteStatus?.favoriteId;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
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
      add.mutate({
        userId: user.id,
        itemId: destination.id,
        itemType: "destination",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/destination/${destination.id}`}>
        <div className="group relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg cursor-pointer">
          {/* Image */}
          <div className="absolute inset-0">
            {!imageError ? (
              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                <MapPin className="h-20 w-20 text-orange-400" />
              </div>
            )}
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2 text-primary-foreground/80">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Destination</span>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 leading-tight">
              {destination.name}
            </h3>
            <p className="text-white/70 line-clamp-2 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {destination.description}
            </p>
          </div>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 rounded-full bg-black/20 backdrop-blur-sm hover:bg-white/20 text-white transition-all hover:scale-110"
            onClick={handleFavorite}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} 
            />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
