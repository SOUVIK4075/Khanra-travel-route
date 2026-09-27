'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Check, ClipboardCopy, HandHeart, Info, Link2, Mail, MapPin, Plus,
    Search, Sparkles, Trash2, Trophy, X,
} from 'lucide-react';
import { toast } from 'sonner';
import tirthsOriginal from '@/data/tirths.json';
import dharmshalasOriginal from '@/data/dharmshalas.json';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import Ornament from '@/components/site/Ornament';
import { cn } from '@/lib/utils';

const allKnownPlaces = [
    ...tirthsOriginal.map(t => ({ ...t, source: 'tirth' })),
    ...dharmshalasOriginal.map(d => ({ ...d, source: 'dharmshala' }))
];

interface Stop {
    tirthId?: string;
    name: string;
    type: string;
    facilities: string[];
    description: string;
    mapsLink: string;
}

interface Day {
    day: number;
    stops: Stop[];
}

const selectClass =
    'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30';

const checkboxClass = 'size-4 accent-[var(--primary)]';

function RequiredMark() {
    return <span className="text-destructive" aria-hidden>*</span>;
}

function SearchableDropdown({
    currentTirthId,
    onSelect,
    onClear,
}: {
    currentTirthId: string;
    onSelect: (placeId: string) => void;
    onClear: () => void;
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const filteredPlaces = query.trim() === ''
        ? []
        : allKnownPlaces.filter(place =>
            place.name.toLowerCase().includes(query.toLowerCase()) ||
            place.type.toLowerCase().includes(query.toLowerCase()) ||
            (place as any).state?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

    const handleSelect = (place: any) => {
        onSelect(place.id);
        setQuery('');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex(prev => Math.min(prev + 1, filteredPlaces.length - 1));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredPlaces[activeIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    if (currentTirthId) {
        const place = allKnownPlaces.find(p => p.id === currentTirthId);
        const route = place?.type === 'Dharmshala' ? 'dharmshala' : 'tirth';
        return (
            <div className="flex min-h-9 items-center justify-between gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-1.5 text-sm">
                <span className="flex min-w-0 flex-wrap items-center gap-1">
                    <Link2 className="size-3.5 shrink-0 text-success" />
                    Linked to:
                    <a
                        href={`/${route}/${place?.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline-offset-2 hover:underline"
                    >
                        {place?.name}
                    </a>
                    <span className="text-muted-foreground">({place?.type})</span>
                </span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={onClear} title="Clear link" aria-label="Clear link">
                    <X />
                </Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                className="h-9 pl-8"
                placeholder="Search existing Tirth/Dharmshala (e.g. Arihantagiri)"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                    setActiveIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                onKeyDown={handleKeyDown}
            />
            {isOpen && query.trim() !== '' && (
                <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
                    {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place, idx) => (
                            <button
                                type="button"
                                key={place.id}
                                className={cn(
                                    'flex w-full flex-col items-start rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent',
                                    idx === activeIndex && 'bg-accent'
                                )}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(place)}
                            >
                                <span className="text-sm font-medium">{place.name}</span>
                                <span className="text-xs text-muted-foreground">{place.type} • {(place as any).state}</span>
                            </button>
                        ))
                    ) : (
                        <div className="px-2.5 py-3 text-sm text-muted-foreground">No matching places found. Continue typing or fill manually.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SubmitItinerary() {
    const [formType, setFormType] = useState<'detailed' | 'quick'>('detailed');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [states, setStates] = useState<string[]>([]);
    const [customState, setCustomState] = useState('');
    const [author, setAuthor] = useState('');
    const [authorInstagram, setAuthorInstagram] = useState('');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState<Day[]>([{ day: 1, stops: [] }]);
    const [quickOutline, setQuickOutline] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [emailBodyData, setEmailBodyData] = useState('');
    const [copied, setCopied] = useState(false);

    const availableStates = [
        'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Rajasthan',
        'Gujarat', 'Madhya Pradesh', 'Kerala', 'Andhra Pradesh',
        'Uttar Pradesh', 'Bihar', 'Jharkhand'
    ];

    useEffect(() => {
        const savedData = localStorage.getItem('submitItineraryDraft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.formType) setFormType(parsed.formType);
                if (parsed.title) setTitle(parsed.title);
                if (parsed.duration) setDuration(parsed.duration);
                if (parsed.states) setStates(parsed.states);
                if (parsed.author) setAuthor(parsed.author);
                if (parsed.authorInstagram) setAuthorInstagram(parsed.authorInstagram);
                if (parsed.description) setDescription(parsed.description);
                if (parsed.days) setDays(parsed.days);
                if (parsed.quickOutline) setQuickOutline(parsed.quickOutline);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const dataToSave = {
                formType, title, duration, states, author, authorInstagram, description, days, quickOutline
            };
            localStorage.setItem('submitItineraryDraft', JSON.stringify(dataToSave));
        }, 1000);
        return () => clearTimeout(timer);
    }, [formType, title, duration, states, author, authorInstagram, description, days, quickOutline]);

    const clearDraft = () => {
        if (window.confirm('Are you sure you want to clear your saved progress?')) {
            localStorage.removeItem('submitItineraryDraft');
            setFormType('detailed');
            setTitle('');
            setDuration('');
            setStates([]);
            setAuthor('');
            setAuthorInstagram('');
            setDescription('');
            setDays([{ day: 1, stops: [] }]);
            setQuickOutline('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(emailBodyData).then(() => {
            setCopied(true);
            toast.success('Details copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleStateToggle = (state: string) => {
        setStates(prev =>
            prev.includes(state)
                ? prev.filter(s => s !== state)
                : [...prev, state]
        );
    };

    const handleAddCustomState = () => {
        if (customState.trim() && !states.includes(customState.trim())) {
            setStates(prev => [...prev, customState.trim()]);
            setCustomState('');
        }
    };

    const handleRemoveState = (state: string) => {
        setStates(prev => prev.filter(s => s !== state));
    };

    const addDay = () => {
        setDays(prev => [...prev, { day: prev.length + 1, stops: [] }]);
    };

    const removeDay = (dayIndex: number) => {
        setDays(prev => prev.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, day: i + 1 })));
    };

    const addStop = (dayIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? { ...day, stops: [...day.stops, { name: '', type: 'Tirth', facilities: [], description: '', mapsLink: '', tirthId: '' }] }
                : day
        ));
    };

    const removeStop = (dayIndex: number, stopIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? { ...day, stops: day.stops.filter((_, si) => si !== stopIndex) }
                : day
        ));
    };

    const updateStop = (dayIndex: number, stopIndex: number, field: keyof Stop, value: any) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex ? { ...stop, [field]: value } : stop
                    )
                }
                : day
        ));
    };

    const handleClearPlaceLink = (dayIndex: number, stopIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex ? { ...stop, tirthId: '' } : stop
                    )
                }
                : day
        ));
    };

    const handleSelectExistingPlace = (dayIndex: number, stopIndex: number, placeId: string) => {
        const place = allKnownPlaces.find(p => p.id === placeId);
        if (place) {
            setDays(prev => prev.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        stops: day.stops.map((stop, si) =>
                            si === stopIndex ? {
                                ...stop,
                                tirthId: place.id,
                                name: place.name,
                                type: place.type,
                                facilities: place.facilities || [],
                                description: (place as any).introText || '',
                                mapsLink: place.location?.mapsLink || ''
                            } : stop
                        )
                    }
                    : day
            ));
        }
    };

    const toggleFacility = (dayIndex: number, stopIndex: number, facility: string) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex
                            ? {
                                ...stop,
                                facilities: stop.facilities.includes(facility)
                                    ? stop.facilities.filter(f => f !== facility)
                                    : [...stop.facilities, facility]
                            }
                            : stop
                    )
                }
                : day
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        let emailBody = '';

        if (formType === 'detailed') {
            const stopNames = days.flatMap(d => d.stops.map(s => s.name));
            const keywords = Array.from(new Set([
                ...states,
                ...stopNames.slice(0, 10),
                'Jain Tirth',
                'Itinerary'
            ])).filter(Boolean);

            const itineraryData = {
                id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                title,
                duration: `${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}`,
                states,
                author,
                ...(authorInstagram && { authorInstagram }),
                description,
                days,
                keywords
            };

            const jsonString = JSON.stringify(itineraryData, null, 2);

            emailBody = `Jai Jagannath! 🙏

New Detailed Itinerary Submission for Khanra Travel.

Title: ${title}
Duration: ${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}
States: ${states.join(', ')}
Author: ${author}
Instagram: ${authorInstagram || 'Not provided'}
Description: ${description}

Number of Days: ${days.length}
Number of Stops: ${days.reduce((acc, d) => acc + d.stops.length, 0)}

--- JSON DATA FOR ITINERARIES.JSON ---

${jsonString}

--- END JSON ---`;
        } else {
            emailBody = `Jai Jagannath! 🙏

New Quick Outline Submission for Khanra Travel.

Title: ${title}
Author: ${author}
Instagram: ${authorInstagram || 'Not provided'}

--- QUICK OUTLINE DETAILS ---

${quickOutline}

--- END OUTLINE ---`;
        }

        setEmailBodyData(emailBody);

        const mailtoLink = `mailto:khanrasouvik112@gmail.com?subject=${encodeURIComponent(`New Itinerary: ${title}`)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;

        setSubmitted(true);
        setSubmitting(false);

        // Clear local storage on successful generation
        localStorage.removeItem('submitItineraryDraft');
    };

    const resetForm = () => {
        setFormType('detailed');
        setTitle('');
        setDuration('');
        setStates([]);
        setAuthor('');
        setAuthorInstagram('');
        setDescription('');
        setDays([{ day: 1, stops: [] }]);
        setQuickOutline('');
        setSubmitted(false);
    };

    const motivations = [
        { icon: HandHeart, title: 'Sadharmi Seva', text: 'Help fellow Jain Yatris plan their spiritual journeys with ease and safety.' },
        { icon: Sparkles, title: 'Earn Punya', text: 'Sharing knowledge that helps others visit Tirths is a great form of service.' },
        { icon: Trophy, title: 'Get Recognized', text: 'Your name and Instagram will be featured on the route you share.' },
    ];

    return (
        <div className="pb-8">
            <section className="relative overflow-hidden border-b bg-mandala">
                <div className="container max-w-4xl py-10 sm:py-14">
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
                        <Link href="/"><ArrowLeft /> Back to Home</Link>
                    </Button>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Share your yatra</span>
                        <h1 className="text-4xl font-semibold sm:text-5xl">
                            Submit Your <span className="text-gradient-saffron">Itinerary</span>
                        </h1>
                        <Ornament />
                        <p className="max-w-xl text-muted-foreground">
                            Share your Tirth Yatra experience with the community. Fill in the complete details below.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        {motivations.map(({ icon: Icon, title: mTitle, text }) => (
                            <div key={mTitle} className="rounded-xl border bg-card/80 p-4 backdrop-blur-sm">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </span>
                                    <h3 className="text-base font-semibold">{mTitle}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container max-w-4xl pt-8">
                {submitted ? (
                    <Card className="gap-6 py-8">
                        <CardContent className="flex flex-col items-center gap-3 text-center">
                            <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
                                <Mail className="size-8" />
                            </span>
                            <h2 className="text-2xl font-semibold">Email Client Opening...</h2>
                            <p className="max-w-lg text-muted-foreground">
                                Your email client should open with the itinerary data pre-filled.
                                <br />
                                <strong className="text-foreground">Please review and click &quot;Send&quot; in your email to complete the submission.</strong>
                            </p>
                        </CardContent>

                        <CardContent>
                            <div className="rounded-xl border bg-muted/40 p-4 sm:p-6">
                                <h3 className="mb-1 text-lg font-semibold">Email didn&apos;t open?</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Sometimes browser popups fail. You can manually email the details below to{' '}
                                    <a href="mailto:khanrasouvik112@gmail.com" className="font-semibold text-primary hover:underline">khanrasouvik112@gmail.com</a>.
                                </p>

                                <Textarea
                                    readOnly
                                    value={emailBodyData}
                                    aria-label="Email body"
                                    className="h-64 font-mono text-xs [field-sizing:fixed]"
                                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                                />

                                <Button onClick={handleCopy} variant={copied ? 'outline' : 'default'} size="lg" className="mt-4 h-10 px-4">
                                    {copied ? <><Check /> Copied to Clipboard!</> : <><ClipboardCopy /> Copy Details to Clipboard</>}
                                </Button>
                            </div>
                        </CardContent>

                        <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={resetForm} variant="outline" size="lg" className="h-10 px-4">
                                Submit Another Itinerary
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-10 px-4">
                                <Link href="/">Back to Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div role="tablist" aria-label="Form type" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:inline-grid">
                                {([
                                    ['detailed', 'Detailed Form (Preferred)'],
                                    ['quick', 'Quick Outline (Free-form)'],
                                ] as const).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        role="tab"
                                        aria-selected={formType === value}
                                        className={cn(
                                            'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all',
                                            formType === value && 'bg-card text-foreground shadow-sm ring-1 ring-border'
                                        )}
                                        onClick={() => setFormType(value)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={clearDraft} className="self-end text-muted-foreground hover:text-destructive sm:self-auto">
                                <Trash2 /> Clear Draft
                            </Button>
                        </div>

                        {formType === 'quick' && (
                            <Alert className="border-gold/50 bg-accent/60">
                                <Info />
                                <AlertDescription className="text-accent-foreground">
                                    <p><strong>Note:</strong> Submitting the detailed form helps us publish your itinerary quickly. Quick outlines are processed manually by our team taking longer, but they require less effort to submit. Just describe the places visited, duration, and any helpful tips.</p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Basic Info */}
                        <Card className="gap-5 [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
                            <CardHeader className="border-b">
                                <CardTitle className="text-xl font-semibold">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">Itinerary Title <RequiredMark /></Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., 2 Day Northern Tamil Nadu Tirths"
                                        className="h-9"
                                        required
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    {formType === 'detailed' && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="duration">Duration (Days) <RequiredMark /></Label>
                                            <Input
                                                type="number"
                                                id="duration"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                placeholder="e.g., 2"
                                                className="h-9"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="author">Your Name <RequiredMark /></Label>
                                        <Input
                                            type="text"
                                            id="author"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="e.g., Community Member"
                                            className="h-9"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="authorInstagram">Instagram Profile (Optional)</Label>
                                    <Input
                                        type="url"
                                        id="authorInstagram"
                                        value={authorInstagram}
                                        onChange={(e) => setAuthorInstagram(e.target.value)}
                                        placeholder="https://instagram.com/yourusername"
                                        className="h-9"
                                    />
                                </div>

                                {formType === 'detailed' && (
                                    <fieldset className="flex flex-col gap-3">
                                        <legend className="mb-2 text-sm font-medium">States Covered <RequiredMark /></legend>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                            {availableStates.map((state) => (
                                                <label
                                                    key={state}
                                                    className={cn(
                                                        'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent/60',
                                                        states.includes(state) && 'border-primary/60 bg-primary/5'
                                                    )}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className={checkboxClass}
                                                        checked={states.includes(state)}
                                                        onChange={() => handleStateToggle(state)}
                                                    />
                                                    <span>{state}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={customState}
                                                onChange={(e) => setCustomState(e.target.value)}
                                                placeholder="Add other state..."
                                                aria-label="Add other state"
                                                className="h-9"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomState())}
                                            />
                                            <Button type="button" variant="outline" size="lg" onClick={handleAddCustomState} className="h-9 px-3">
                                                <Plus /> Add State
                                            </Button>
                                        </div>

                                        {states.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                                <strong>Selected:</strong>
                                                {states.map(state => (
                                                    <Badge key={state} variant="secondary" className="h-6 gap-1 pr-1">
                                                        {state}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveState(state)}
                                                            className="grid size-4 place-items-center rounded-full hover:bg-foreground/10"
                                                            aria-label={`Remove ${state}`}
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </fieldset>
                                )}

                                {formType === 'detailed' && (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description">Description <RequiredMark /></Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Brief description of the itinerary, key highlights..."
                                            rows={3}
                                            className="min-h-20"
                                            required
                                        />
                                    </div>
                                )}

                                {formType === 'quick' && (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="quickOutline">Free-form Itinerary Details <RequiredMark /></Label>
                                        <Textarea
                                            id="quickOutline"
                                            value={quickOutline}
                                            onChange={(e) => setQuickOutline(e.target.value)}
                                            placeholder="Describe your journey! Mention the Tirths visited, travel details, helpful tips, etc. Don't worry about formatting perfectly."
                                            className="min-h-40"
                                            required
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Day-by-Day Itinerary for Detailed form mode */}
                        {formType === 'detailed' && (
                            <Card className="gap-5 [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]">
                                <CardHeader className="flex items-center justify-between gap-3 border-b">
                                    <CardTitle className="text-xl font-semibold">Day-by-Day Itinerary</CardTitle>
                                    <Button type="button" variant="outline" size="lg" onClick={addDay} className="h-9 px-3">
                                        <Plus /> Add Day
                                    </Button>
                                </CardHeader>

                                <CardContent className="flex flex-col gap-5">
                                    {days.map((day, dayIndex) => (
                                        <section key={dayIndex} className="rounded-xl border bg-muted/30 p-4 sm:p-5">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{day.day}</span>
                                                    Day {day.day}
                                                </h3>
                                                {days.length > 1 && (
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeDay(dayIndex)}>
                                                        <Trash2 /> Remove Day
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                {day.stops.map((stop, stopIndex) => (
                                                    <div key={stopIndex} className="flex flex-col gap-4 rounded-lg border bg-card p-4">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <Badge variant="outline" className="h-6 gap-1 border-gold/60 text-accent-foreground">
                                                                <MapPin /> Stop {stopIndex + 1}
                                                            </Badge>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeStop(dayIndex, stopIndex)} className="text-muted-foreground hover:text-destructive">
                                                                <X /> Remove
                                                            </Button>
                                                        </div>

                                                        <div className="grid gap-4 md:grid-cols-3">
                                                            <div className="flex flex-col gap-2">
                                                                <Label>Link Existing Place (Optional)</Label>
                                                                <SearchableDropdown
                                                                    currentTirthId={stop.tirthId || ''}
                                                                    onSelect={(placeId) => handleSelectExistingPlace(dayIndex, stopIndex, placeId)}
                                                                    onClear={() => handleClearPlaceLink(dayIndex, stopIndex)}
                                                                />
                                                                {!stop.tirthId && <small className="text-xs text-muted-foreground">Link to a place in our database to auto-fill details.</small>}
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <Label htmlFor={`stop-name-${dayIndex}-${stopIndex}`}>Place Name <RequiredMark /></Label>
                                                                <Input
                                                                    id={`stop-name-${dayIndex}-${stopIndex}`}
                                                                    type="text"
                                                                    value={stop.name}
                                                                    onChange={(e) => updateStop(dayIndex, stopIndex, 'name', e.target.value)}
                                                                    placeholder="e.g., Shree Kshetra Arihantagiri"
                                                                    className="h-9"
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <Label htmlFor={`stop-type-${dayIndex}-${stopIndex}`}>Type <RequiredMark /></Label>
                                                                <select
                                                                    id={`stop-type-${dayIndex}-${stopIndex}`}
                                                                    value={stop.type}
                                                                    onChange={(e) => updateStop(dayIndex, stopIndex, 'type', e.target.value)}
                                                                    className={selectClass}
                                                                    required
                                                                    disabled={!!stop.tirthId}
                                                                >
                                                                    <option value="Tirth">Tirth</option>
                                                                    <option value="Temple">Temple</option>
                                                                    <option value="Dharmshala">Dharmshala</option>
                                                                    <option value="Tourist-Attraction">Tourist-Attraction</option>
                                                                    <option value="Travel">Travel</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <fieldset className="flex flex-col gap-2">
                                                            <legend className="mb-2 text-sm font-medium">Facilities</legend>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['Dharmshala', 'Bhojanshala'].map((facility) => (
                                                                    <label
                                                                        key={facility}
                                                                        className={cn(
                                                                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent/60',
                                                                            stop.facilities.includes(facility) && 'border-primary/60 bg-primary/5'
                                                                        )}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className={checkboxClass}
                                                                            checked={stop.facilities.includes(facility)}
                                                                            onChange={() => toggleFacility(dayIndex, stopIndex, facility)}
                                                                        />
                                                                        <span>{facility}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </fieldset>

                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor={`stop-desc-${dayIndex}-${stopIndex}`}>Description</Label>
                                                            <Textarea
                                                                id={`stop-desc-${dayIndex}-${stopIndex}`}
                                                                value={stop.description}
                                                                onChange={(e) => updateStop(dayIndex, stopIndex, 'description', e.target.value)}
                                                                placeholder="Distance, special notes..."
                                                                rows={2}
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <Label htmlFor={`stop-maps-${dayIndex}-${stopIndex}`}>
                                                                Google Maps Link {stop.tirthId ? '' : <RequiredMark />}
                                                            </Label>
                                                            <Input
                                                                id={`stop-maps-${dayIndex}-${stopIndex}`}
                                                                type="url"
                                                                value={stop.mapsLink}
                                                                onChange={(e) => updateStop(dayIndex, stopIndex, 'mapsLink', e.target.value)}
                                                                placeholder="https://maps.app.goo.gl/..."
                                                                className={cn('h-9', stop.tirthId && 'bg-muted text-muted-foreground')}
                                                                required={!stop.tirthId}
                                                                readOnly={!!stop.tirthId}
                                                            />
                                                            <small className="text-xs text-muted-foreground">Essential for automatic coordinate generation.</small>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => addStop(dayIndex)}
                                                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/5"
                                                >
                                                    <Plus className="size-4" /> Add Stop to Day {day.day}
                                                </button>
                                            </div>
                                        </section>
                                    ))}

                                    {days.length > 0 && (
                                        <Button type="button" variant="secondary" size="lg" onClick={addDay} className="h-10">
                                            <Plus /> Add Another Day
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Separator />

                        <div className="flex flex-col items-center gap-4 text-center">
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 w-full px-8 text-base shadow-md sm:w-auto"
                                disabled={(formType === 'detailed' && states.length === 0) || submitting}
                            >
                                <Mail className="size-5" />
                                {submitting ? 'Opening Email...' : 'Generate Email to Submit'}
                            </Button>
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="size-4 text-gold" />
                                After submission, your itinerary will be verified and published with your name and social link!
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
