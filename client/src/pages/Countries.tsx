import { Navbar } from "@/components/layout/Navbar";
import { useCountries } from "@/hooks/use-trek-data";
import { CountryCard } from "@/components/ui/CountryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/Icons";

export default function Countries() {
  const { data: countries, isLoading } = useCountries();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <div className="bg-muted/30 py-20 px-4 mb-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <Icons.Compass className="h-6 w-6 text-primary mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Explore Countries</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a country to discover its unique culinary landscape and cultural heritage.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries?.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
