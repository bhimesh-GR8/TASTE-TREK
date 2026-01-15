import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useCountry, useCountryDestinations } from "@/hooks/use-trek-data";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Map, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

export default function CountryDetail() {
  const [, params] = useRoute("/country/:id");
  const id = Number(params?.id);
  
  const { data: country, isLoading: isCountryLoading } = useCountry(id);
  const { data: destinations, isLoading: isDestLoading } = useCountryDestinations(id);

  if (isCountryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Skeleton className="h-[50vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!country) return <div>Country not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={country.heroImage} 
          alt={country.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link href="/countries">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 w-fit mb-6 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Countries
            </Button>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-4"
          >
            {country.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-white/90 text-lg uppercase tracking-wider font-medium"
          >
            <Map className="h-5 w-5" />
            <span>{country.continent}</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-xl border border-border/50 mb-16">
          <h2 className="font-display text-2xl font-bold mb-4">About</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {country.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2">Top Destinations</h2>
            <p className="text-muted-foreground">Places you absolutely cannot miss in {country.name}</p>
          </div>
        </div>

        {isDestLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations?.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        )}

        {/* Flavor Trail Section */}
        <section className="mt-24 bg-primary/5 rounded-3xl p-8 md:p-16 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Flavor Trail</span>
              </div>
              <h2 className="font-display text-4xl font-bold mb-6">Taste of {country.name}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Embark on a culinary journey through {country.name}. From street food stalls to fine dining, 
                experience the authentic flavors that define this region. Don't leave without trying the local specialties!
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Food Guide
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl transform rotate-12" />
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
                alt="Food of the region" 
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
