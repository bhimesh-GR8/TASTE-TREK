import { Link } from "wouter";
import { type Country } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/country/${country.id}`}>
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl shadow-md cursor-pointer group bg-gradient-to-br from-slate-200 to-slate-300">
          {!imageError ? (
            <img
              src={country.heroImage}
              alt={country.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
              <MapPin className="h-16 w-16 text-orange-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h3 className="font-display text-3xl font-bold tracking-tight mb-2 text-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {country.name}
            </h3>
            <span className="text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0">
              Explore Culture & Cuisine
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
