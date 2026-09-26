import Link from 'next/link';
import {
    ArrowLeft,
    BedDouble,
    Bus,
    ExternalLink,
    MapPin,
    Navigation,
    Pencil,
    Phone,
    Plane,
    Route,
    ScrollText,
    TrainFront,
    Utensils,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Ornament from '@/components/site/Ornament';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';
import { cn } from '@/lib/utils';

export interface PlaceContact {
    type: string;
    name: string;
    number: string;
    notes?: string;
}

export interface PlaceRecord {
    id: string;
    name: string;
    state?: string;
    type?: string;
    introText: string;
    description: string;
    location: { mapsLink: string; lat: number | null; lng: number | null };
    howToReach?: { nearestRailway?: string; nearestBusStand?: string; nearestAirport?: string };
    facilities: string[];
    contacts: (PlaceContact | string)[];
    lastVerified: string;
}

interface RelatedItinerary {
    id: string;
    title: string;
    duration: string;
}

interface PlaceDetailProps {
    place: PlaceRecord;
    kind: 'Tirth' | 'Dharmshala';
    fallbackIntro: string;
    relatedItineraries: RelatedItinerary[];
    relatedText: string;
}

function FacilityBadge({ available, icon: Icon, label }: { available: boolean; icon: typeof BedDouble; label: string }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'h-7 gap-1.5 px-3 text-xs',
                available
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-muted text-muted-foreground line-through decoration-muted-foreground/40'
            )}
        >
            {available ? <Icon /> : <X />}
            {available ? label : `No ${label}`}
        </Badge>
    );
}

function Panel({ title, icon: Icon, children, className }: { title: string; icon: typeof MapPin; children: React.ReactNode; className?: string }) {
    return (
        <section className={cn('rounded-2xl border bg-card p-5 shadow-sm sm:p-6', className)}>
            <h2 className="mb-4 flex items-center gap-2.5 text-xl font-semibold">
                <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-4" />
                </span>
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function PlaceDetail({ place, kind, fallbackIntro, relatedItineraries, relatedText }: PlaceDetailProps) {
    const hasDharmshala = kind === 'Dharmshala' || place.facilities.includes('Dharmshala');
    const hasBhojanshala = place.facilities.includes('Bhojanshala');
    const reach = place.howToReach;
    const showReach = reach && (reach.nearestRailway || reach.nearestAirport);
    const suggestEditUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfIfYSg3E1d1XI8lDNYkxVZAu_d3w0OJmFE4ea0cfKezoAhNg/viewform?usp=pp_url&entry.900429225=${encodeURIComponent(place.name)}&entry.340669516=${encodeURIComponent(place.id)}&entry.837366253=${kind}`;

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden border-b bg-mandala">
                <div className="container py-10 sm:py-14">
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
                        <Link href="/">
                            <ArrowLeft /> Back to Home
                        </Link>
                    </Button>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {place.state && (
                            <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs">
                                <MapPin /> {place.state}
                            </Badge>
                        )}
                        {kind === 'Tirth' && place.type && (
                            <Badge className="h-7 px-3 text-xs">{place.type}</Badge>
                        )}
                        {kind === 'Dharmshala' ? (
                            <Badge className="h-7 gap-1.5 px-3 text-xs">
                                <BedDouble /> Dharmshala
                            </Badge>
                        ) : (
                            <FacilityBadge available={hasDharmshala} icon={BedDouble} label="Dharmshala" />
                        )}
                        <FacilityBadge available={hasBhojanshala} icon={Utensils} label="Bhojanshala" />
                    </div>

                    <h1 className="max-w-4xl text-3xl leading-tight font-semibold sm:text-5xl">{place.name}</h1>
                    <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
                        {place.introText || fallbackIntro}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <WhatsAppShareButton title={place.name} />
                        <Button asChild variant="outline" size="lg" className="h-10 px-4">
                            <a href={place.location.mapsLink} target="_blank" rel="noopener noreferrer">
                                <Navigation /> Directions
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="container grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
                {/* Main column */}
                <div className="flex flex-col gap-6">
                    {place.description && (
                        <Panel title="About" icon={ScrollText}>
                            <p className="leading-relaxed text-foreground/85">{place.description}</p>
                        </Panel>
                    )}

                    <Panel title="Contact Directory" icon={Phone}>
                        {place.contacts && place.contacts.length > 0 ? (
                            <ul className="divide-y rounded-xl border">
                                {place.contacts.map((c, i) => {
                                    const isString = typeof c === 'string';
                                    const contactType = isString ? 'Office' : c.type;
                                    const contactName = isString ? 'Contact' : c.name;
                                    const contactNumber = isString ? c : c.number;
                                    const contactNotes = isString ? null : c.notes;

                                    return (
                                        <li key={i} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 flex-col gap-0.5">
                                                <span className="text-[0.7rem] font-semibold tracking-wider text-primary uppercase">{contactType}</span>
                                                <span className="font-medium">{contactName}</span>
                                                {contactNotes && <span className="text-sm text-muted-foreground">({contactNotes})</span>}
                                            </div>
                                            <Button asChild variant="secondary" size="lg" className="h-10 shrink-0 px-4 font-semibold">
                                                <a href={`tel:${contactNumber}`}>
                                                    <Phone /> {contactNumber}
                                                </a>
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="rounded-xl border border-dashed bg-muted/50 p-4 text-sm text-muted-foreground">
                                No contact numbers verified yet. Help the community by suggesting an edit below.
                            </p>
                        )}
                        <div className="mt-4 flex justify-end">
                            <Button asChild variant="outline" size="lg" className="h-10 px-4">
                                <a href={suggestEditUrl} target="_blank" rel="noopener noreferrer">
                                    <Pencil /> Suggest an Edit / Add Number
                                </a>
                            </Button>
                        </div>
                    </Panel>
                </div>

                {/* Sidebar */}
                <aside className="flex flex-col gap-6">
                    <Panel title="Location" icon={MapPin}>
                        <Button asChild size="lg" className="h-11 w-full text-sm font-semibold">
                            <a href={place.location.mapsLink} target="_blank" rel="noopener noreferrer">
                                Open in Google Maps <ExternalLink />
                            </a>
                        </Button>

                        {showReach && (
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">How to Reach</h3>
                                <ul className="flex flex-col gap-3 text-sm">
                                    {reach.nearestAirport && (
                                        <li className="flex items-start gap-3">
                                            <Plane className="mt-0.5 size-4 shrink-0 text-primary" /> {reach.nearestAirport}
                                        </li>
                                    )}
                                    {reach.nearestRailway && (
                                        <li className="flex items-start gap-3">
                                            <TrainFront className="mt-0.5 size-4 shrink-0 text-primary" /> {reach.nearestRailway}
                                        </li>
                                    )}
                                    {reach.nearestBusStand && (
                                        <li className="flex items-start gap-3">
                                            <Bus className="mt-0.5 size-4 shrink-0 text-primary" /> {reach.nearestBusStand}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </Panel>

                    {relatedItineraries.length > 0 && (
                        <Panel title="Featured In" icon={Route}>
                            <p className="mb-4 text-sm text-muted-foreground">{relatedText}</p>
                            <div className="flex flex-col gap-2">
                                {relatedItineraries.map((itin) => (
                                    <Link
                                        key={itin.id}
                                        href={`/itinerary/${itin.id}`}
                                        className="group flex items-center justify-between gap-3 rounded-xl border bg-background p-3 transition-colors hover:border-primary/40 hover:bg-accent"
                                    >
                                        <span className="text-sm font-medium group-hover:text-accent-foreground">{itin.title}</span>
                                        <Badge variant="secondary" className="shrink-0">{itin.duration}</Badge>
                                    </Link>
                                ))}
                            </div>
                        </Panel>
                    )}
                </aside>
            </div>

            <Ornament className="pb-4" />
        </div>
    );
}
