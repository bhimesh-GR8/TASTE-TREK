import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useCountry, useCountryRestaurants, useCountryDestinations } from "@/hooks/use-trek-data";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FoodGuide() {
  const [, params] = useRoute("/country/:id/food");
  const id = Number(params?.id);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const { data: country, isLoading: isCountryLoading } = useCountry(id);
  const { data: restaurants, isLoading: isRestLoading } = useCountryRestaurants(id);
  const { data: destinations } = useCountryDestinations(id);

  if (isCountryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Skeleton className="h-[50vh] w-full" />
      </div>
    );
  }

  if (!country) {
    return <div className="min-h-screen bg-background">Country not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/country/${id}`}>
          <Button variant="ghost" className="mb-6">
            &larr; Back to {country.name}
          </Button>
        </Link>

        <h1 className="font-display text-4xl font-bold mb-4">
          {country.name} Food Guide
        </h1>
        <p className="text-muted-foreground mb-8">
          All of the best restaurants across {country.name} — sorted by destination.
        </p>

        {isRestLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map(restaurant => {
              const hasError = imageErrors.has(restaurant.id);
              const destName = restaurant.destinationName ||
                destinations?.find(d => d.id === restaurant.destinationId)?.name ||
                "";

              return (
                <div
                  key={restaurant.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="h-48 w-full relative bg-muted">
                    {!hasError && restaurant.imageUrl ? (
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => new Set(prev).add(restaurant.id))}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                        <MapPin className="h-12 w-12 text-orange-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {restaurant.cuisine} · {restaurant.priceRange}
                    </p>
                    {destName && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Destination:</span> {destName}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No restaurants found.</p>
        )}
      </div>
    </div>
  );
}
