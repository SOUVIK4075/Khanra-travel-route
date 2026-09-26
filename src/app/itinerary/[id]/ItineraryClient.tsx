'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
    ArrowDown,
    ArrowDownUp,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    BadgeCheck,
    BedDouble,
    Check,
    ChevronDown,
    ClipboardList,
    Clock,
    ExternalLink,
    Flag,
    Landmark,
    Lightbulb,
    Loader2,
    LocateFixed,
    MapPin,
    Navigation,
    Pencil,
    Phone,
    Plus,
    Printer,
    Trash2,
    Undo2,
    UserRound,
    Utensils,
    X,
} from 'lucide-react';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';
import MapEmbed from '@/components/MapEmbed';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InstagramIcon } from '@/components/site/BrandIcons';

interface Itinerary {
    id: string;
    title: string;
    duration: string;
    states: string[];
    author: string;
    authorInstagram?: string;
    description: string;
    startingCity?: string;
    endingCity?: string;
    keywords?: string[];
    days: {
        day: number;
        stops: {
            tirthId?: string;
            tirth?: any;
            name: string;
            type: string;
            facilities: string[];
            description: string;
            mapsLink: string;
            lat?: number;
            lng?: number;
        }[];
    }[];
}

interface ItineraryClientProps {
    itinerary: Itinerary;
}

export default function ItineraryClient({ itinerary }: ItineraryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [expandedContacts, setExpandedContacts] = useState<Record<string, boolean>>({});
    const [isPreparingPrint, setIsPreparingPrint] = useState(false);

    // --- Customization State ---
    const [isEditing, setIsEditing] = useState(false);

    const parseCustomUrl = () => {
        const cParam = searchParams.get('c');
        if (!cParam) return null;
        
        const days = cParam.split('~');
        return days.map(dayStr => {
            if (!dayStr) return [];
            return dayStr.split('-').map(stopRef => {
                const [d, s] = stopRef.split('_').map(Number);
                return { originalDay: d, originalStop: s };
            });
        });
    };

    const getInitialDays = () => {
        const customStructure = parseCustomUrl();
        if (customStructure) {
            return customStructure.map((dayRef, index) => {
                const stops = dayRef.map(ref => {
                    const originalDay = itinerary.days[ref.originalDay];
                    const originalStop = originalDay ? originalDay.stops[ref.originalStop] : null;
                    if (originalStop) {
                        return { ...originalStop, _ref: `${ref.originalDay}_${ref.originalStop}` };
                    }
                    return null;
                }).filter(Boolean) as any[];
                
                return {
                    day: index + 1,
                    stops
                };
            });
        }
        
        return itinerary.days.map((day, dIdx) => ({
            ...day,
            stops: day.stops.map((stop, sIdx) => ({
                ...stop,
                _ref: `${dIdx}_${sIdx}`
            }))
        }));
    };

    const [activeDays, setActiveDays] = useState(getInitialDays());
    const [editableDays, setEditableDays] = useState(activeDays);
    
    const daysToRender = isEditing ? editableDays : activeDays;

    useEffect(() => {
        const newActiveDays = getInitialDays();
        setActiveDays(newActiveDays);
        if (!isEditing) {
            setEditableDays(newActiveDays);
        }
    }, [itinerary, searchParams, isEditing]); // Ensure activeDays updates when URL changes

    const handleApplyChanges = () => {
        const filteredDays = editableDays.filter(day => day.stops.length > 0);
        
        const cParam = filteredDays.map(day => {
            return day.stops.map((stop: any) => stop._ref).join('-');
        }).join('~');
        
        const params = new URLSearchParams(searchParams.toString());
        if (cParam) {
            params.set('c', cParam);
        } else {
            params.delete('c');
        }
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsEditing(false);
    };

    const moveStop = (dayIdx: number, stopIdx: number, direction: 'up' | 'down') => {
        const newDays = [...editableDays];
        const dayStops = [...newDays[dayIdx].stops];
        if (direction === 'up' && stopIdx > 0) {
            const temp = dayStops[stopIdx];
            dayStops[stopIdx] = dayStops[stopIdx - 1];
            dayStops[stopIdx - 1] = temp;
        } else if (direction === 'down' && stopIdx < dayStops.length - 1) {
            const temp = dayStops[stopIdx];
            dayStops[stopIdx] = dayStops[stopIdx + 1];
            dayStops[stopIdx + 1] = temp;
        }
        newDays[dayIdx].stops = dayStops;
        setEditableDays(newDays);
    };

    const moveStopDay = (dayIdx: number, stopIdx: number, direction: 'prev' | 'next') => {
        const newDays = [...editableDays];
        const targetDayIdx = direction === 'prev' ? dayIdx - 1 : dayIdx + 1;
        
        if (targetDayIdx >= 0 && targetDayIdx < newDays.length) {
            const stop = newDays[dayIdx].stops[stopIdx];
            newDays[dayIdx].stops = newDays[dayIdx].stops.filter((_, i) => i !== stopIdx);
            
            if (direction === 'prev') {
                newDays[targetDayIdx].stops = [...newDays[targetDayIdx].stops, stop];
            } else {
                newDays[targetDayIdx].stops = [stop, ...newDays[targetDayIdx].stops];
            }
            setEditableDays(newDays);
        }
    };

    const removeStop = (dayIdx: number, stopIdx: number) => {
        const newDays = [...editableDays];
        newDays[dayIdx].stops = newDays[dayIdx].stops.filter((_, i) => i !== stopIdx);
        setEditableDays(newDays);
    };

    const reverseItinerary = () => {
        const newDays = [...editableDays].reverse().map((day, idx) => ({
            ...day,
            day: idx + 1,
            stops: [...day.stops].reverse()
        }));
        setEditableDays(newDays);
    };

    const getRemovedStops = () => {
        const activeRefs = new Set(editableDays.flatMap(d => d.stops.map(s => s._ref)));
        const removed: any[] = [];
        
        itinerary.days.forEach((day, dIdx) => {
            day.stops.forEach((stop, sIdx) => {
                const ref = `${dIdx}_${sIdx}`;
                if (!activeRefs.has(ref)) {
                    removed.push({ ...stop, _ref: ref });
                }
            });
        });
        return removed;
    };

    const removedStops = isEditing ? getRemovedStops() : [];

    const restoreStop = (stopToRestore: any) => {
        const newDays = [...editableDays];
        if (newDays.length === 0) {
            newDays.push({ day: 1, stops: [stopToRestore] });
        } else {
            newDays[newDays.length - 1].stops.push(stopToRestore);
        }
        setEditableDays(newDays);
    };
    // --- End Customization State ---

    const toggleContacts = (stopId: string) => {
        setExpandedContacts(prev => ({
            ...prev,
            [stopId]: !prev[stopId]
        }));
    };

    useEffect(() => {
        const urlStart = searchParams.get('start');
        const urlEnd = searchParams.get('end');
        
        const savedStart = localStorage.getItem('userStartingLocation');
        const savedEnd = localStorage.getItem('userEndingLocation');
        const hasSeenHint = localStorage.getItem('hasSeenLocationHint');
        
        if (urlStart) {
            setStartLocation(urlStart);
            localStorage.setItem('userStartingLocation', urlStart);
        } else if (savedStart) {
            setStartLocation(savedStart);
        } else if (itinerary.startingCity) {
            setStartLocation(itinerary.startingCity);
        }

        if (urlEnd) {
            setEndLocation(urlEnd);
            localStorage.setItem('userEndingLocation', urlEnd);
        } else if (savedEnd) {
            setEndLocation(savedEnd);
        } else if (itinerary.endingCity || itinerary.startingCity) {
            setEndLocation(itinerary.endingCity || itinerary.startingCity || 'Bangalore, Karnataka, India');
        }

        if (!hasSeenHint) {
            setShowHint(true);
        }

        const handleBeforePrint = () => {
            const newExpanded: Record<string, boolean> = {};
            daysToRender.forEach((day, dayIndex) => {
                day.stops.forEach((stop, index) => {
                    if (stop.tirth && stop.tirth.contacts && stop.tirth.contacts.length > 0) {
                        newExpanded[`${dayIndex}-${index}`] = true;
                    }
                });
            });
            setExpandedContacts(newExpanded);
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        return () => window.removeEventListener('beforeprint', handleBeforePrint);
    }, [itinerary]); // Run once on mount

    // Sync locations to URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            let changed = false;
            
            if (startLocation) {
                if (params.get('start') !== startLocation) {
                    params.set('start', startLocation);
                    changed = true;
                }
            } else if (params.has('start')) {
                params.delete('start');
                changed = true;
            }
            
            if (endLocation) {
                if (params.get('end') !== endLocation) {
                    params.set('end', endLocation);
                    changed = true;
                }
            } else if (params.has('end')) {
                params.delete('end');
                changed = true;
            }

            if (changed) {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [startLocation, endLocation, pathname, router, searchParams]);

    const dismissHint = () => {
        setShowHint(false);
        localStorage.setItem('hasSeenLocationHint', 'true');
    };

    const handleStartLocationChange = (val: string) => {
        setStartLocation(val);
        localStorage.setItem('userStartingLocation', val);
    };

    const handleEndLocationChange = (val: string) => {
        setEndLocation(val);
        localStorage.setItem('userEndingLocation', val);
    };

    const handleUseMyLocationForStart = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleStartLocationChange(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    };

    const handleUseMyLocationForEnd = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleEndLocationChange(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    };

    const handlePrint = async () => {
        setIsPreparingPrint(true);

        const iframes = document.querySelectorAll('iframe');

        // Programmatically scroll to each iframe to trigger lazy loading and rendering
        for (let i = 0; i < iframes.length; i++) {
            iframes[i].scrollIntoView({ block: 'center' });
            // Wait 1.5s for each map to fully load and render
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Scroll back to the top of the page
        window.scrollTo(0, 0);

        // Small buffer before opening print dialog
        setTimeout(() => {
            window.print();
            setIsPreparingPrint(false);
        }, 500);
    };

    const stopTypeIcon = (type: string) => {
        if (type === 'Tirth' || type === 'Temple') return Landmark;
        if (type === 'Dharmshala') return BedDouble;
        if (type === 'Bhojanshala') return Utensils;
        return MapPin;
    };

    return (
        <div className="pb-16">
            <section className="relative overflow-hidden border-b bg-mandala print:border-0 print:bg-none">
                <div className="container py-8 sm:py-12">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary print:hidden"
                    >
                        <ArrowLeft className="size-4" /> Back to Itineraries
                    </Link>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {itinerary.states.map((state) => (
                            <Badge key={state} variant="secondary" className="h-6 px-2.5 text-xs">
                                <MapPin /> {state}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="max-w-4xl text-3xl font-semibold sm:text-5xl">{itinerary.title}</h1>

                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-4 text-primary" /> {itinerary.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <UserRound className="size-4 text-primary" /> Shared by {itinerary.author}
                            {itinerary.authorInstagram && (
                                <a
                                    href={itinerary.authorInstagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-1 inline-flex size-7 items-center justify-center rounded-full text-maroon transition-colors hover:bg-accent hover:text-primary"
                                    aria-label="Author's Instagram"
                                >
                                    <InstagramIcon className="size-4" />
                                </a>
                            )}
                        </span>
                    </div>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">{itinerary.description}</p>

                    <div className="mt-6 flex flex-wrap gap-2 print:hidden">
                        <WhatsAppShareButton title={itinerary.title} />
                        {!isEditing ? (
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-10 gap-2 px-4"
                                onClick={() => {
                                    setIsEditing(true);
                                    setEditableDays(activeDays);
                                }}
                            >
                                <Pencil /> Customize Itinerary
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-10 gap-2 px-4"
                                    onClick={reverseItinerary}
                                    title="Reverse order of days and stops"
                                >
                                    <ArrowDownUp /> Reverse
                                </Button>
                                <Button
                                    size="lg"
                                    className="h-10 gap-2 bg-success px-4 text-white hover:bg-success/90"
                                    onClick={handleApplyChanges}
                                >
                                    <Check /> Apply
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="h-10 gap-2 px-4"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X /> Cancel
                                </Button>
                            </>
                        )}
                        <Button
                            variant="secondary"
                            size="lg"
                            className="h-10 gap-2 px-4"
                            onClick={handlePrint}
                            disabled={isPreparingPrint}
                            aria-label="Print or Save as PDF"
                        >
                            {isPreparingPrint ? (
                                <>
                                    <Loader2 className="animate-spin" /> Preparing Maps...
                                </>
                            ) : (
                                <>
                                    <Printer /> Save as PDF / Print
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </section>

            <div className="container mt-8 space-y-8">
                {/* Interactive At-a-Glance Summary Matrix */}
                {(() => {
                    let totalStops = 0;
                    let totalTirths = 0;

                    itinerary.days.forEach((day) => {
                        totalStops += day.stops.length;
                        day.stops.forEach((stop) => {
                            if (stop.type === 'Tirth' || stop.type === 'Temple') {
                                totalTirths += 1;
                            }
                        });
                    });

                    return (
                        <Card className="gap-0 py-0 print:break-inside-avoid print:shadow-none">
                            <div className="flex flex-col gap-3 border-b bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                <h3 className="inline-flex items-center gap-2 text-lg font-semibold sm:text-xl">
                                    <ClipboardList className="size-5 text-primary" /> Itinerary Overview at a Glance
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="h-6 bg-card px-2.5">
                                        <Clock /> {itinerary.duration}
                                    </Badge>
                                    <Badge variant="outline" className="h-6 bg-card px-2.5">
                                        <MapPin /> {totalStops} Total Stops
                                    </Badge>
                                    <Badge variant="outline" className="h-6 bg-card px-2.5">
                                        <Landmark /> {totalTirths} Tirths
                                    </Badge>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[40rem] text-left text-sm">
                                    <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                                        <tr>
                                            <th className="w-24 px-4 py-3 font-semibold">Day</th>
                                            <th className="px-4 py-3 font-semibold">Places Covered (Click to Jump)</th>
                                            <th className="w-48 px-4 py-3 font-semibold">Night Stay / End Stop</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {daysToRender.map((day, dayIndex) => {
                                            const lastStop = day.stops[day.stops.length - 1];
                                            const dharmshalaStop = lastStop && (lastStop.type === 'Dharmshala' || lastStop.facilities?.includes('Dharmshala')) ? lastStop : null;
                                            const isLastDay = dayIndex === daysToRender.length - 1;

                                            return (
                                                <tr key={day.day} className="align-top">
                                                    <td className="px-4 py-3">
                                                        <strong className="block font-heading text-base">Day {day.day}</strong>
                                                        <span className="text-xs text-muted-foreground">{day.stops.length} stops</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {day.stops.map((stop, stopIndex) => (
                                                                <button
                                                                    key={stopIndex}
                                                                    type="button"
                                                                    className="inline-flex items-center gap-1.5 rounded-full border bg-card py-1 pr-3 pl-1 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-accent print:border-border"
                                                                    onClick={() => {
                                                                        const el = document.getElementById(`stop-${dayIndex}-${stopIndex}`);
                                                                        if (el) {
                                                                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                        }
                                                                    }}
                                                                    title={`Click to jump to ${stop.name}`}
                                                                >
                                                                    <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary">
                                                                        {stopIndex + 1}
                                                                    </span>
                                                                    <span>{stop.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {isLastDay && lastStop ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-maroon/10 px-2.5 py-1 text-xs font-medium text-maroon" title="End of Journey / Final Stop">
                                                                <Flag className="size-3.5 shrink-0" /> {lastStop.name}
                                                            </span>
                                                        ) : dharmshalaStop ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success" title="Night Stay Dharmshala Available">
                                                                <BedDouble className="size-3.5 shrink-0" /> {dharmshalaStop.name}
                                                            </span>
                                                        ) : lastStop ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground" title="End of Day / Final Stop">
                                                                <MapPin className="size-3.5 shrink-0" /> {lastStop.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    );
                })()}

                <Card className="print:hidden">
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="startLocation" className="gap-1.5">
                                <Navigation className="size-4 text-primary" /> My Starting Location
                            </Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    id="startLocation"
                                    value={startLocation}
                                    onChange={(e) => handleStartLocationChange(e.target.value)}
                                    placeholder="e.g. Bangalore"
                                    className="h-10 pr-10"
                                />
                                <div className="absolute inset-y-0 right-1 flex items-center">
                                    {!startLocation && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleUseMyLocationForStart}
                                            title="Use my current location"
                                            aria-label="Use my current location"
                                        >
                                            <LocateFixed className="text-primary" />
                                        </Button>
                                    )}
                                    {startLocation && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleStartLocationChange('')}
                                            title="Clear location"
                                            aria-label="Clear location"
                                        >
                                            <X />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Directions for the first stop will start from here.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endLocation" className="gap-1.5">
                                <Flag className="size-4 text-primary" /> My Ending Location
                            </Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    id="endLocation"
                                    value={endLocation}
                                    onChange={(e) => handleEndLocationChange(e.target.value)}
                                    placeholder="e.g. Bangalore"
                                    className="h-10 pr-10"
                                />
                                <div className="absolute inset-y-0 right-1 flex items-center">
                                    {!endLocation && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleUseMyLocationForEnd}
                                            title="Use my current location"
                                            aria-label="Use my current location"
                                        >
                                            <LocateFixed className="text-primary" />
                                        </Button>
                                    )}
                                    {endLocation && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEndLocationChange('')}
                                            title="Clear location"
                                            aria-label="Clear location"
                                        >
                                            <X />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Return directions from the final stop will end here.</p>
                        </div>

                        {showHint && (
                            <Alert className="border-gold/50 bg-accent/60 sm:col-span-2">
                                <Lightbulb className="text-gold" />
                                <AlertDescription className="flex flex-col gap-3 text-foreground sm:flex-row sm:items-center sm:justify-between">
                                    <span>
                                        <strong>Hint:</strong> You can change your start & end cities here or click the GPS icon to use your current location.
                                    </span>
                                    <Button size="sm" variant="outline" onClick={dismissHint} className="shrink-0">
                                        Got it
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-12">
                    {daysToRender.map((day, dayIndex) => {
                        const prevDayStops = dayIndex > 0 ? daysToRender[dayIndex - 1].stops : [];
                        const lastStop = prevDayStops.length > 0 ? prevDayStops[prevDayStops.length - 1] : undefined;
                        const previousDayLastStop = lastStop ? { name: lastStop.name, lat: lastStop.lat, lng: lastStop.lng } : undefined;

                        return (
                            <section key={day.day}>
                                <div className="flex items-center gap-4">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-maroon font-heading text-lg font-semibold text-primary-foreground shadow-md ring-4 ring-gold/25">
                                        {day.day}
                                    </span>
                                    <h2 className="text-2xl font-semibold sm:text-3xl">Day {day.day}</h2>
                                    <span className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
                                </div>

                                <MapEmbed
                                    day={day.day}
                                    stops={day.stops}
                                    states={itinerary.states}
                                    previousDayLastStop={previousDayLastStop}
                                    startLocation={dayIndex === 0 ? startLocation : undefined}
                                    endLocation={dayIndex === daysToRender.length - 1 ? endLocation : undefined}
                                />

                                <ol className="relative space-y-4 border-l-2 border-dashed border-gold/40 pl-6 sm:ml-6 sm:pl-8">
                                    {day.stops.map((stop, index) => {
                                        // Determine origin for directions
                                        let origin = '';
                                        if (dayIndex === 0 && index === 0) {
                                            origin = startLocation || 'My+Location';
                                        } else if (index === 0 && previousDayLastStop) {
                                            origin = previousDayLastStop.lat && previousDayLastStop.lng
                                                ? `${previousDayLastStop.lat},${previousDayLastStop.lng}`
                                                : `${previousDayLastStop.name}, ${itinerary.states[0]}`;
                                        } else {
                                            const prevStop = day.stops[index - 1];
                                            origin = prevStop.lat && prevStop.lng
                                                ? `${prevStop.lat},${prevStop.lng}`
                                                : `${prevStop.name}, ${itinerary.states[0]}`;
                                        }

                                        const dest = stop.lat && stop.lng
                                            ? `${stop.lat},${stop.lng}`
                                            : `${stop.name}, ${itinerary.states[0]}`;

                                        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`;
                                        const TypeIcon = stopTypeIcon(stop.type);
                                        const contactsKey = `${dayIndex}-${index}`;
                                        const contactsOpen = !!expandedContacts[contactsKey];

                                        return (
                                            <li key={index} id={`stop-${dayIndex}-${index}`} className="relative scroll-mt-24">
                                                <span className="absolute top-5 -left-[2.4rem] grid size-7 place-items-center rounded-full border-2 border-gold/60 bg-card text-xs font-bold text-primary sm:-left-[2.9rem]">
                                                    {index + 1}
                                                </span>
                                                <Card className="gap-4 transition-shadow hover:shadow-md print:break-inside-avoid print:shadow-none">
                                                    <CardContent className="space-y-4">
                                                        {isEditing && (
                                                            <div className="flex flex-wrap gap-1 rounded-lg border border-dashed bg-muted/50 p-1.5 print:hidden">
                                                                <Button variant="ghost" size="icon" onClick={() => moveStop(dayIndex, index, 'up')} disabled={index === 0} title="Move Up" aria-label="Move Up">
                                                                    <ArrowUp />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => moveStop(dayIndex, index, 'down')} disabled={index === day.stops.length - 1} title="Move Down" aria-label="Move Down">
                                                                    <ArrowDown />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => moveStopDay(dayIndex, index, 'prev')} disabled={dayIndex === 0} title="Move to Previous Day" aria-label="Move to Previous Day">
                                                                    <ArrowLeft />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => moveStopDay(dayIndex, index, 'next')} disabled={dayIndex === daysToRender.length - 1} title="Move to Next Day" aria-label="Move to Next Day">
                                                                    <ArrowRight />
                                                                </Button>
                                                                <Button variant="destructive" size="icon" className="ml-auto" onClick={() => removeStop(dayIndex, index)} title="Remove Stop" aria-label="Remove Stop">
                                                                    <Trash2 />
                                                                </Button>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <h3 className="text-xl font-semibold">
                                                                {index + 1}. {stop.name}
                                                            </h3>
                                                            <Badge variant="outline" className="h-6 gap-1 border-primary/30 bg-primary/10 px-2.5 text-primary">
                                                                <TypeIcon /> {stop.type}
                                                            </Badge>
                                                        </div>

                                                        {stop.facilities?.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {stop.facilities.map((fac: string) => (
                                                                    <Badge key={fac} variant="secondary" className="h-6 px-2.5">
                                                                        {fac === 'Bhojanshala' ? <Utensils /> : <BedDouble />} {fac}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <p className="leading-relaxed text-muted-foreground">{stop.description || stop.tirth?.introText}</p>

                                                        {stop.tirth && stop.tirth.contacts && stop.tirth.contacts.length > 0 && (
                                                            <div className="overflow-hidden rounded-xl border">
                                                                <button
                                                                    type="button"
                                                                    className="flex w-full items-center justify-between gap-2 bg-muted/50 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                                                    onClick={() => toggleContacts(contactsKey)}
                                                                    aria-expanded={contactsOpen}
                                                                >
                                                                    <span className="inline-flex items-center gap-2">
                                                                        <Phone className="size-4 text-primary" /> Contact Information
                                                                    </span>
                                                                    <ChevronDown className={`size-4 transition-transform print:hidden ${contactsOpen ? 'rotate-180' : ''}`} />
                                                                </button>

                                                                {contactsOpen && (
                                                                    <div className="space-y-3 p-4">
                                                                        <div className="space-y-2">
                                                                            {stop.tirth.contacts.map((contact: any, i: number) => (
                                                                                <div key={i} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                                                                    <span className="text-muted-foreground">{contact.type} ({contact.name})</span>
                                                                                    <a href={`tel:${contact.number}`} className="font-semibold text-primary hover:underline">
                                                                                        {contact.number}
                                                                                    </a>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex items-center justify-between border-t pt-3 text-xs">
                                                                            <span className="inline-flex items-center gap-1 font-medium text-success">
                                                                                <BadgeCheck className="size-3.5" /> verified
                                                                            </span>
                                                                            <a
                                                                                href={`https://docs.google.com/forms/d/e/1FAIpQLSfIfYSg3E1d1XI8lDNYkxVZAu_d3w0OJmFE4ea0cfKezoAhNg/viewform?usp=pp_url&entry.900429225=${encodeURIComponent(stop.name)}&entry.340669516=${encodeURIComponent(stop.tirth.id)}&entry.837366253=${encodeURIComponent(stop.type)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline print:hidden"
                                                                            >
                                                                                Suggest Edit
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 print:hidden">
                                                            <Button asChild size="sm" className="h-8 gap-1.5 px-3">
                                                                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                                                                    <Navigation /> Get Directions
                                                                </a>
                                                            </Button>
                                                            {dayIndex === daysToRender.length - 1 && index === day.stops.length - 1 && (
                                                                <Button asChild size="sm" variant="secondary" className="h-8 gap-1.5 px-3">
                                                                    <a
                                                                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(dest)}&destination=${encodeURIComponent(endLocation || 'My+Location')}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <Undo2 /> Return Directions
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            {stop.type === 'Dharmshala' && stop.tirth ? (
                                                                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 px-3">
                                                                    <Link href={`/dharmshala/${stop.tirth.id}`}>
                                                                        <BedDouble /> View Dharmshala
                                                                    </Link>
                                                                </Button>
                                                            ) : (['Tirth', 'Temple'].includes(stop.type) && stop.tirth) ? (
                                                                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 px-3">
                                                                    <Link href={`/tirth/${stop.tirth.id}`}>
                                                                        <Landmark /> View Place
                                                                    </Link>
                                                                </Button>
                                                            ) : (
                                                                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 px-3">
                                                                    <a href={stop.mapsLink} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink /> View on Map
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </section>
                        );
                    })}
                </div>

                {isEditing && removedStops.length > 0 && (
                    <section className="rounded-2xl border-2 border-dashed bg-muted/40 p-5 sm:p-8 print:hidden">
                        <h2 className="inline-flex items-center gap-2 text-2xl font-semibold">
                            <Trash2 className="size-5 text-destructive" /> Removed Places
                        </h2>
                        <p className="mt-1 mb-5 text-sm text-muted-foreground">Click &quot;Add Back&quot; to restore these places to the end of your itinerary.</p>
                        <div className="space-y-3">
                            {removedStops.map((stop, idx) => (
                                <div key={idx} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-heading text-lg font-semibold">{stop.name}</h4>
                                        <Badge variant="secondary">{stop.type}</Badge>
                                    </div>
                                    <Button size="sm" variant="outline" className="gap-1.5 border-success/50 text-success hover:bg-success/10 hover:text-success" onClick={() => restoreStop(stop)}>
                                        <Plus /> Add Back
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
