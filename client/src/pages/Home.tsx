import { useState } from "react";
import { useSearch, useCountries } from "@/hooks/use-trek-data";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountryCard } from "@/components/ui/CountryCard";
import { Search, ArrowRight, Utensils, Globe, Camera } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Icons } from "@/components/Icons";


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heroImageError, setHeroImageError] = useState(false);
  const [countryImageErrors, setCountryImageErrors] = useState<Set<number>>(new Set());
  const [destImageErrors, setDestImageErrors] = useState<Set<number>>(new Set());
  
  const { data: searchResults, isLoading: isSearching } = useSearch(searchQuery);
  const { data: countries, isLoading: isCountriesLoading } = useCountries();

  // Featured countries (take first 3)
  const featuredCountries = countries?.slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Unsplash: Scenic landscape with food elements */}
          {!heroImageError ? (
            <>
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                alt="Hero Background" 
                className="w-full h-full object-cover"
                onError={() => setHeroImageError(true)}
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/50">
                <Utensils className="h-24 w-24 mx-auto mb-4 opacity-30" />
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight text-shadow-lg"
          >
            Travel the World <br />
            <span className="text-primary italic">Through Taste</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto"
          >
            Discover culinary secrets, heritage sites, and unforgettable flavors across the globe.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full transform group-hover:scale-105 transition-transform" />
            <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2 transition-all ring-4 ring-white/10 focus-within:ring-primary/50">
              <Search className="ml-4 h-6 w-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for countries, cities, or cuisines..."
                className="border-none shadow-none focus-visible:ring-0 text-lg py-6 px-4 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                Search
              </Button>
            </div>

            {/* Search Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-card rounded-2xl shadow-xl border border-border/50 p-2 overflow-hidden z-20">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">Searching...</div>
                ) : searchResults?.countries.length === 0 && searchResults?.destinations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No results found.</div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {searchResults?.countries.map(country => {
                      const hasImageError = countryImageErrors.has(country.id);
                      return (
                        <Link key={country.id} href={`/country/${country.id}`}>
                          <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                            {!hasImageError ? (
                              <img 
                                src={country.heroImage} 
                                className="w-10 h-10 rounded-full object-cover" 
                                alt={country.name}
                                onError={() => {
                                  setCountryImageErrors(prev => new Set(prev).add(country.id));
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-orange-600">{country.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="text-left">
                              <p className="font-semibold text-foreground">{country.name}</p>
                              <p className="text-xs text-muted-foreground">Country</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {searchResults?.destinations.map(dest => {
                      const hasImageError = destImageErrors.has(dest.id);
                      return (
                        <Link key={dest.id} href={`/destination/${dest.id}`}>
                          <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                            {!hasImageError ? (
                              <img 
                                src={dest.image} 
                                className="w-10 h-10 rounded-full object-cover" 
                                alt={dest.name}
                                onError={() => {
                                  setDestImageErrors(prev => new Set(prev).add(dest.id));
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-orange-600">{dest.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="text-left">
                              <p className="font-semibold text-foreground">{dest.name}</p>
                              <p className="text-xs text-muted-foreground">Destination</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Culinary Journeys</h3>
              <p className="text-muted-foreground">Explore curated lists of the best local restaurants and street food spots.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Cultural Heritage</h3>
              <p className="text-muted-foreground">Dive deep into the history and traditions of each destination.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl bg-muted/30 border border-border/50 text-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Scenic Views</h3>
              <p className="text-muted-foreground">Find the most instagrammable spots and breathtaking landscapes.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold mb-4">Popular Destinations</h2>
              <p className="text-muted-foreground max-w-md">Start your journey by exploring these top-rated countries known for their exceptional food and culture.</p>
            </div>
            <Link href="/countries">
              <Button variant="outline" className="hidden sm:flex group">
                View All Countries
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isCountriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCountries?.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/countries">
              <Button variant="outline" className="w-full">View All Countries</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ready to taste the world?</h2>
          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of food travelers sharing their favorite spots and hidden gems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 rounded-full h-14">
              Start Planning Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 rounded-full px-8">
              Browse Locations
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 text-primary">🧭</span>
            <span className="font-display font-bold text-xl">Taste Trek</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Taste Trek. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
