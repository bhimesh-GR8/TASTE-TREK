import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Utensils, Landmark } from 'lucide-react';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface RestaurantMarker {
  id: number;
  name: string;
  cuisine: string;
  lat: number;
  lng: number;
  type: 'restaurant';
}

interface CulturalSiteMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'site';
}

type MapMarker = RestaurantMarker | CulturalSiteMarker;

interface DestinationMapProps {
  restaurants: any[];
  culturalSites: any[];
  destinationName: string;
  centerLat: number;
  centerLng: number;
}

const DESTINATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Mexico City': { lat: 19.4326, lng: -99.1332 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Rome': { lat: 41.9028, lng: 12.4964 },
  'Bangkok': { lat: 13.7563, lng: 100.5018 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
};

export function DestinationMap({
  restaurants = [],
  culturalSites = [],
  destinationName,
  centerLat = 40,
  centerLng = 0,
}: DestinationMapProps) {
  const coords = DESTINATION_COORDS[destinationName] || { lat: centerLat, lng: centerLng };

  const markers: MapMarker[] = [
    ...restaurants.map((r: any) => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      lat: coords.lat + (Math.random() - 0.5) * 0.02,
      lng: coords.lng + (Math.random() - 0.5) * 0.02,
      type: 'restaurant' as const,
    })),
    ...culturalSites.map((s: any) => ({
      id: s.id,
      name: s.name,
      lat: coords.lat + (Math.random() - 0.5) * 0.02,
      lng: coords.lng + (Math.random() - 0.5) * 0.02,
      type: 'site' as const,
    })),
  ];

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-border/50 shadow-md">
      <MapContainer
        center={[coords.lat, coords.lng] as [number, number]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {markers.map((marker) => (
          <Marker key={`${marker.type}-${marker.id}`} position={[marker.lat, marker.lng]}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  {marker.type === 'restaurant' ? (
                    <Utensils className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Landmark className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="font-semibold">{marker.name}</span>
                </div>
                {marker.type === 'restaurant' && (
                  <p className="text-sm text-muted-foreground">
                    Cuisine: {(marker as RestaurantMarker).cuisine}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {marker.type === 'restaurant' ? '🍽️ Restaurant' : '🏛️ Cultural Site'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
