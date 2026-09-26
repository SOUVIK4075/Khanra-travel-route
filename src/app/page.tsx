'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Download, FileText, MapPin, Navigation, CarTaxiFront, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/site/SectionHeading';
import Ornament from '@/components/site/Ornament';
import SearchFilters from '@/components/SearchFilters';
import ItineraryCard from '@/components/ItineraryCard';
import ChaturmasModal from '@/components/ChaturmasModal';
import itinerariesOriginal from '@/data/itineraries.json';

// Type definition to ensure type safety with JSON import
interface Itinerary {
  id: string;
  title: string;
  duration: string;
  states: string[];
  author: string;
  description: string;
  startingCity?: string;
  endingCity?: string;
  keywords?: string[];
  days: any[];
}

const itineraries: Itinerary[] = itinerariesOriginal as unknown as Itinerary[];

// Bengaluru Chaturmaas 2026 resources shown in the banner below the hero.
const CHATURMAS_RESOURCES = [
  { href: '/gyanoday-travel-guide?lang=en', icon: Navigation, title: 'How to Reach Shri Gyanoday Tirth', subtitle: 'English Guide' },
  { href: '/gyanoday-travel-guide?lang=hi', icon: MapPin, title: 'श्री ज्ञानोदय तीर्थ कैसे पहुँचें?', subtitle: 'हिंदी मार्गदर्शिका' },
  { href: '/pdfs/karnataka-itinerary-en.pdf', icon: FileText, title: 'Karnataka Itineraries', subtitle: 'English PDF', external: true },
  { href: '/pdfs/karnataka-itinerary-hi.pdf', icon: Download, title: 'कर्नाटक यात्रा मार्ग', subtitle: 'हिंदी PDF', external: true },
  { href: '/pdfs/tamil-nadu-itinerary-en.pdf', icon: FileText, title: 'Tamil Nadu Itineraries', subtitle: 'English PDF', external: true },
  { href: '/pdfs/tamil-nadu-itinerary-hi.pdf', icon: Download, title: 'तमिलनाडु यात्रा मार्ग', subtitle: 'हिंदी PDF', external: true },
  { href: '/chaturmas-cabs?lang=en', icon: CarTaxiFront, title: 'Negotiated Cabs & Tours', subtitle: 'English Version' },
  { href: '/chaturmas-cabs?lang=hi', icon: CarTaxiFront, title: 'रियायती कैब और यात्रा दरें', subtitle: 'हिंदी संस्करण' },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean | undefined>(undefined);

  const handleSearchClick = () => {
    // Scroll to results section 
    const featuredSection = document.getElementById('featured-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredItineraries = useMemo(() => {
    return itineraries.filter((itinerary) => {
      const matchesSearch = searchTerm === '' ||
        itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.days.some(day =>
          day.stops.some((stop: any) =>
            stop.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

      const matchesState = selectedState === '' ||
        itinerary.states.includes(selectedState);

      // Extract number from duration string (e.g., "2 Days" -> 2)
      const durationMatch = itinerary.duration.match(/\d+/);
      const durationNumber = durationMatch ? parseInt(durationMatch[0]) : 0;

      const matchesDuration = selectedDuration === '' ||
        (selectedDuration === '5+' ? durationNumber >= 5 : durationNumber.toString() === selectedDuration);

      return matchesSearch && matchesState && matchesDuration;
    });
  }, [searchTerm, selectedState, selectedDuration]);

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    itineraries.forEach(itinerary => {
      suggestions.add(itinerary.title);
      itinerary.days.forEach(day => {
        day.stops.forEach((stop: any) => {
          suggestions.add(stop.name);
        });
      });
    });
    return Array.from(suggestions).sort();
  }, []);

  const totalRoutes = itineraries.length;
  const totalUniqueTirths = useMemo(() => {
    const tirths = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.days.forEach(day => {
        day.stops.forEach((stop: any) => {
          if (stop.type === 'Tirth' || stop.type === 'Temple') {
            tirths.add(stop.name);
          }
        });
      });
    });
    return tirths.size;
  }, []);

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.states.forEach(state => states.add(state));
    });
    return Array.from(states).sort();
  }, []);

  return (
    <div>
      <ChaturmasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-mandala">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-gold/25 to-transparent blur-3xl" />
        <div className="relative container flex flex-col items-center py-16 text-center sm:py-24">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/70 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-accent-foreground uppercase backdrop-blur">
            <Sparkles className="size-3.5 text-gold" /> Jai Jagannath 🙏
          </span>
          <h1 className="max-w-4xl text-4xl leading-[1.1] font-bold sm:text-6xl">
            Discover & Share{' '}
            <span className="block text-gradient-saffron">Khanra Travel</span>
          </h1>
          <Ornament className="my-6" />
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explore sacred Jain Tirths and temples across India with day-by-day routes, Dharmshalas, Bhojanshalas and directions for every stop.
          </p>

          <div className="w-full max-w-5xl">
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              searchSuggestions={searchSuggestions}
              states={uniqueStates}
              onSearchClick={handleSearchClick}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-11 rounded-full px-6"
              onClick={() => document.getElementById('search')?.focus()}
            >
              <Compass /> Explore Routes
            </Button>
            <Button asChild size="lg" className="h-11 rounded-full px-6">
              <Link href="/directory">
                <MapPin /> Places Directory
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Permanent Banner Section for Chaturmas PDFs */}
      <section className="container py-12">
        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-accent via-card to-secondary p-6 shadow-sm sm:p-8">
          <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative mb-6">
            <h3 className="text-xl font-semibold text-maroon sm:text-2xl dark:text-gold">
              🙏 Bengaluru Chaturmaas 2026 (आत्म-सिलिकॉन वर्षायोग) - Itinerary PDFs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Download ready-to-use print & digital itinerary tables.</p>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHATURMAS_RESOURCES.map(({ href, icon: Icon, title, subtitle, external }) => (
              <a
                key={href}
                href={href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex items-center gap-3 rounded-xl border bg-card/90 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-sm leading-snug font-semibold">{title}</strong>
                  <span className="text-xs text-muted-foreground">{subtitle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section id="featured-section" className="container scroll-mt-24 py-8">
        <SectionHeading
          eyebrow="Yatra Routes"
          title={
            filteredItineraries.length === itineraries.length
              ? 'Featured Itineraries'
              : `Found ${filteredItineraries.length} ${filteredItineraries.length !== 1 ? 'Itineraries' : 'Itinerary'}`
          }
        />
        {filteredItineraries.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed bg-card p-10 text-center">
            <p className="font-medium">No itineraries found matching your search criteria.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to{' '}
              <Link href="/submit" className="font-semibold text-primary underline underline-offset-4">share a route</Link>{' '}
              for this area!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                id={itinerary.id}
                title={itinerary.title}
                duration={itinerary.duration}
                states={itinerary.states}
                description={itinerary.description}
                author={itinerary.author}
                authorInstagram={(itinerary as any).authorInstagram}
              />
            ))}
          </div>
        )}
      </section>

      {/* Community impact */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-3xl bg-maroon px-6 py-14 text-center text-maroon-foreground sm:px-12">
          <div aria-hidden className="absolute inset-0 bg-mandala opacity-60" />
          <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-4xl">Our Community Impact</h2>
            <Ornament className="my-4" />
            <p className="mx-auto max-w-xl text-maroon-foreground/80">Khanra Travel is built by the community, for the community.</p>

            <div className="mx-auto my-10 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                { value: totalUniqueTirths, label: 'Tirths Covered' },
                { value: totalRoutes, label: 'Verified Routes' },
                { value: '1000+', label: 'Yatris & Growing' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="font-heading text-5xl font-bold text-gold">{value}</p>
                  <p className="mt-2 text-sm tracking-wide text-maroon-foreground/80 uppercase">{label}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto max-w-xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="mb-2 text-2xl font-semibold">Earn Punya by Guiding Others</h3>
              <p className="mb-6 text-maroon-foreground/80">Your travel experience can help a fellow Sadharmi plan their spiritual journey safely and comfortably.</p>
              <Button asChild size="lg" className="h-12 rounded-full bg-gold px-8 text-base text-gold-foreground hover:bg-gold/90">
                <Link href="/submit">
                  Contribute an Itinerary <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
