'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Custom Marker Icons for different types
const tirthIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dharmshalaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Place {
  id: string;
  name: string;
  type?: string; 
  source: 'tirth' | 'dharmshala';
  location?: { lat: number | null; lng: number | null; mapsLink?: string };
  introText?: string;
  state?: string;
  facilities?: string[];
}

function MapUpdater({ places }: { places: Place[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(
        places.map(p => L.latLng(p.location!.lat!, p.location!.lng!))
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [places, map]);

  return null;
}

const containerOverrides = [
  '[&_.leaflet-popup-content-wrapper]:rounded-xl',
  '[&_.leaflet-popup-content-wrapper]:bg-popover',
  '[&_.leaflet-popup-content-wrapper]:text-popover-foreground',
  '[&_.leaflet-popup-tip]:bg-popover',
  '[&_.leaflet-popup-content]:m-3',
  '[&_.leaflet-popup-content_p]:m-0',
  '[&_.leaflet-popup-content_a]:text-primary',
  '[&_.leaflet-tooltip]:rounded-md',
  '[&_.leaflet-tooltip]:border-border',
  '[&_.leaflet-tooltip]:bg-popover',
  '[&_.leaflet-tooltip]:text-popover-foreground',
].join(' ');

export default function PlacesMap({ places }: { places: Place[] }) {
  const validPlaces = places.filter(
    (p) => p.location && p.location.lat != null && p.location.lng != null
  );

  // Default center to central India
  const center: [number, number] = validPlaces.length > 0
    ? [validPlaces[0].location!.lat!, validPlaces[0].location!.lng!]
    : [22.9734, 78.6569];

  return (
    <div className={`isolate h-[65vh] min-h-[420px] w-full overflow-hidden rounded-2xl border shadow-sm sm:h-[600px] ${containerOverrides}`}>
      <MapContainer center={center} zoom={5} className="z-0 size-full">
        <MapUpdater places={validPlaces} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPlaces.map((place) => (
          <Marker
            key={`${place.source}-${place.id}`}
            position={[place.location!.lat!, place.location!.lng!]}
            icon={place.source === 'tirth' ? tirthIcon : dharmshalaIcon}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
              <span className="font-semibold">{place.name}</span>
            </Tooltip>
            <Popup>
              <div className="flex min-w-[180px] flex-col gap-2 font-sans">
                <h3 className="m-0 font-heading text-[15px] font-semibold leading-snug">{place.name}</h3>
                <span
                  className={
                    place.source === 'tirth'
                      ? 'w-fit rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase'
                      : 'w-fit rounded-full bg-maroon/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-maroon uppercase'
                  }
                >
                  {place.type || (place.source === 'tirth' ? 'Tirth' : 'Dharmshala')}
                </span>
                {place.state && <span className="text-[11px] text-muted-foreground">{place.state}</span>}
                {place.introText && (
                  <p className="text-xs leading-snug text-muted-foreground">
                    {place.introText.length > 80 ? `${place.introText.substring(0, 80)}...` : place.introText}
                  </p>
                )}
                <Link href={`/${place.source}/${place.id}`} className="mt-1 text-[13px] font-semibold no-underline hover:underline">
                  View Details &rarr;
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
