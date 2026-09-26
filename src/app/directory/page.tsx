'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, BedDouble, Landmark, LayoutGrid, Map as MapIcon, MapPin, Search, SearchX, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Ornament from '@/components/site/Ornament';
import { cn } from '@/lib/utils';
import tirthsData from '@/data/tirths.json';
import dharmshalasData from '@/data/dharmshalas.json';

// Dynamically import the map component with SSR disabled
const PlacesMap = dynamic(() => import('@/components/PlacesMap'), {
  ssr: false,
  loading: () => (
    <Skeleton className="grid h-[65vh] min-h-[420px] w-full place-items-center rounded-2xl sm:h-[600px]">
      <span className="text-sm text-muted-foreground">Loading Map...</span>
    </Skeleton>
  ),
});

type PlaceType = 'tirth' | 'dharmshala';
type FilterType = 'all' | 'tirth' | 'temple' | 'dharmshala';

interface Place {
  id: string;
  name: string;
  type?: string;
  introText?: string;
  state?: string;
  source: PlaceType;
  facilities: string[];
  location: { lat: number | null; lng: number | null; mapsLink: string };
}

const allPlaces: Place[] = [
  ...tirthsData.map(t => ({ ...t, source: 'tirth' as PlaceType })),
  ...dharmshalasData.map(d => ({ ...d, source: 'dharmshala' as PlaceType }))
].sort((a, b) => a.name.localeCompare(b.name));

const ALL_STATES = '__all__';

function matchesType(place: Place, filter: FilterType) {
  if (filter === 'all') return true;
  if (filter === 'dharmshala') return place.source === 'dharmshala';
  if (place.source !== 'tirth') return false;
  return filter === 'temple' ? place.type === 'Temple' : place.type !== 'Temple';
}

const TYPE_FILTERS: { value: FilterType; label: string; icon: typeof Landmark }[] = [
  { value: 'all', label: 'All Places', icon: Sparkles },
  { value: 'tirth', label: 'Tirths', icon: Landmark },
  { value: 'temple', label: 'Temples', icon: Landmark },
  { value: 'dharmshala', label: 'Dharmshalas', icon: BedDouble },
];

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterState, setFilterState] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    allPlaces.forEach(p => {
      if (p.state) states.add(p.state);
    });
    return Array.from(states).sort();
  }, []);

  // Places matching search + state, before the type filter (used for tab counts)
  const baseFiltered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allPlaces.filter(place => {
      const displayState = place.state || '';

      const matchesSearch = searchTerm === '' ||
        place.name.toLowerCase().includes(term) ||
        (place.introText || '').toLowerCase().includes(term) ||
        displayState.toLowerCase().includes(term);

      const matchesState = filterState === '' || displayState === filterState;

      return matchesSearch && matchesState;
    });
  }, [searchTerm, filterState]);

  const filteredPlaces = useMemo(
    () => baseFiltered.filter(place => matchesType(place, filterType)),
    [baseFiltered, filterType]
  );

  const typeCounts = useMemo(() => {
    const counts = {} as Record<FilterType, number>;
    TYPE_FILTERS.forEach(({ value }) => {
      counts[value] = baseFiltered.filter(p => matchesType(p, value)).length;
    });
    return counts;
  }, [baseFiltered]);

  const hasFilters = searchTerm !== '' || filterState !== '' || filterType !== 'all';
  const clearFilters = () => {
    setSearchTerm('');
    setFilterState('');
    setFilterType('all');
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-mandala">
        <div className="container flex flex-col items-center gap-4 py-12 text-center sm:py-16">
          <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {allPlaces.length} places · {uniqueStates.length} states
          </span>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Jain Places <span className="text-gradient-saffron">Directory</span>
          </h1>
          <Ornament />
          <p className="max-w-2xl text-muted-foreground sm:text-lg">
            Explore our comprehensive database of Jain Tirths, Temples, and Dharmshalas across India.
          </p>
        </div>
      </section>

      <div className="container py-8 sm:py-10">
        {/* Controls */}
        <div className="sticky top-[4.5rem] z-20 -mx-4 mb-8 border-y bg-background/85 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:px-5 sm:shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                aria-label="Search places"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 pl-9 text-base sm:text-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Select
              value={filterState || ALL_STATES}
              onValueChange={(v) => setFilterState(v === ALL_STATES ? '' : v)}
            >
              <SelectTrigger aria-label="Filter by state" className="h-11! w-full sm:w-56">
                <MapPin className="text-primary" />
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATES}>All States</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Filter by type" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:pb-0">
              {TYPE_FILTERS.map(({ value, label, icon: Icon }) => {
                const active = filterType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilterType(value)}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    <Icon className="size-3.5" />
                    {label}
                    <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-primary-foreground/20' : 'bg-muted')}>
                      {typeCounts[value]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div role="group" aria-label="View mode" className="inline-flex shrink-0 self-start rounded-lg border bg-muted p-1 sm:self-auto">
              {([
                { value: 'list', label: 'List', icon: LayoutGrid },
                { value: 'map', label: 'Map', icon: MapIcon },
              ] as const).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={viewMode === value}
                  onClick={() => setViewMode(value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    viewMode === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <p aria-live="polite">
            Showing <span className="font-semibold text-foreground">{filteredPlaces.length}</span> of {allPlaces.length} places
            {filterState && <> in <span className="font-semibold text-foreground">{filterState}</span></>}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X /> Clear filters
            </Button>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-muted/40 px-6 py-16 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No places found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            )}
          </div>
        ) : viewMode === 'map' ? (
          <PlacesMap places={filteredPlaces} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map(place => {
              const isTirth = place.source === 'tirth';
              return (
                <Link
                  href={`/${place.source}/${place.id}`}
                  key={`${place.source}-${place.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className={cn('h-1 w-full', isTirth ? 'bg-gradient-to-r from-primary to-gold' : 'bg-gradient-to-r from-maroon to-primary')}
                  />
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-6 px-2.5 text-[0.7rem] font-semibold tracking-wide uppercase',
                          isTirth ? 'border-primary/30 bg-primary/10 text-primary' : 'border-maroon/30 bg-maroon/10 text-maroon'
                        )}
                      >
                        {isTirth ? <Landmark /> : <BedDouble />}
                        {place.type || (isTirth ? 'Tirth' : 'Dharmshala')}
                      </Badge>
                    </div>
                    <h2 className="text-lg leading-snug font-semibold transition-colors group-hover:text-primary">{place.name}</h2>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {place.introText || `View details and contact information for ${place.name}.`}
                    </p>
                    {place.facilities && place.facilities.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {place.facilities.slice(0, 3).map(f => (
                          <Badge key={f} variant="secondary" className="font-normal">{f}</Badge>
                        ))}
                        {place.facilities.length > 3 && (
                          <Badge variant="secondary" className="font-normal">+{place.facilities.length - 3} more</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t bg-muted/40 px-5 py-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" /> {place.state || 'India'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      View Details <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
