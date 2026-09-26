'use client';

import { Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Stop {
    name: string;
    lat?: number;
    lng?: number;
}

interface MapEmbedProps {
    day: number;
    stops: Stop[];
    states: string[];
    previousDayLastStop?: Stop;
    startLocation?: string;
    endLocation?: string;
}

export default function MapEmbed({ day, stops, states, previousDayLastStop, startLocation, endLocation }: MapEmbedProps) {
    if (!stops || stops.length === 0) return null;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Format a stop as coordinates if available, otherwise fall back to name with state context
    const formatStop = (stop: Stop) => {
        if (stop.lat && stop.lng) {
            return encodeURIComponent(`${stop.lat},${stop.lng}`);
        }
        const stateContext = states.length > 0 ? `, ${states[0]}` : '';
        return encodeURIComponent(`${stop.name}${stateContext}`);
    };

    // Build the full list of routing stops
    // 1. If we have a startLocation (Day 1), prepend it
    // 2. Else if we have previousDayLastStop, prepend it
    // 3. If we have an endLocation (Last Day), append it
    let routingStops: (Stop | string)[] = [...stops];

    if (day === 1 && startLocation) {
        routingStops = [startLocation, ...routingStops];
    } else if (previousDayLastStop) {
        routingStops = [previousDayLastStop, ...routingStops];
    }

    if (endLocation) {
        routingStops = [...routingStops, endLocation];
    }

    const getStopString = (stop: Stop | string) => {
        if (typeof stop === 'string') return encodeURIComponent(stop);
        return formatStop(stop);
    };

    let embedUrl = '';
    let universalLink = '';

    if (routingStops.length === 1) {
        // Single stop - use Place mode for embed and Search mode for link
        const place = getStopString(routingStops[0]);
        embedUrl = apiKey ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${place}` : '';
        universalLink = `https://www.google.com/maps/search/?api=1&query=${place}`;
    } else {
        // Multiple stops - use Directions mode
        const origin = getStopString(routingStops[0]);
        const destination = getStopString(routingStops[routingStops.length - 1]);

        let waypoints = '';
        if (routingStops.length > 2) {
            const middleStops = routingStops.slice(1, routingStops.length - 1);
            waypoints = middleStops.map(stop => getStopString(stop)).join('|');
        }

        if (apiKey) {
            embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}`;
            if (waypoints) {
                embedUrl += `&waypoints=${waypoints}`;
            }
        }

        universalLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        if (waypoints) {
            universalLink += `&waypoints=${waypoints}`;
        }
    }

    return (
        <div className="my-6 overflow-hidden rounded-2xl border bg-card shadow-sm print:break-inside-avoid">
            {apiKey ? (
                <div className="h-72 w-full bg-muted sm:h-96">
                    <iframe
                        title={`Day ${day} Route Map`}
                        className="size-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedUrl}
                    ></iframe>
                </div>
            ) : null}

            <div className="flex justify-center border-t bg-secondary/40 p-4">
                <Button asChild size="lg" className="h-10 w-full max-w-md gap-2 px-4 text-sm">
                    <a href={universalLink} target="_blank" rel="noopener noreferrer">
                        <MapIcon className="size-4" />
                        {stops.length > 1 ? `Open Day ${day} Route in Google Maps` : `View Location in Google Maps`}
                    </a>
                </Button>
            </div>
        </div>
    );
}
