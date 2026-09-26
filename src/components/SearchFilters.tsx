'use client';

import { Search } from 'lucide-react';
import Autocomplete from './Autocomplete';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedState: string;
    setSelectedState: (state: string) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
    searchSuggestions: string[];
    states: string[];
    onSearchClick?: () => void;
}

// Radix Select items can't have an empty value, so "any" stands in for "no filter".
const ANY = 'any';

const DURATIONS = [
    { value: '1', label: '1 Day' },
    { value: '2', label: '2 Days' },
    { value: '3', label: '3 Days' },
    { value: '4', label: '4 Days' },
    { value: '5+', label: '5+ Days' },
];

export default function SearchFilters({
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    selectedDuration,
    setSelectedDuration,
    searchSuggestions,
    states,
    onSearchClick
}: SearchFiltersProps) {
    return (
        <div className="grid gap-4 rounded-2xl border bg-card/90 p-4 text-left shadow-xl shadow-primary/5 backdrop-blur sm:p-5 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
            <div className="grid gap-2">
                <Label htmlFor="search" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Tirth / Place Name
                </Label>
                <Autocomplete
                    id="search"
                    placeholder="e.g. Ponnur Malai"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    suggestions={searchSuggestions}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="state" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    State
                </Label>
                <Select value={selectedState || ANY} onValueChange={(v) => setSelectedState(v === ANY ? '' : v)}>
                    <SelectTrigger id="state" className="h-11! w-full bg-background">
                        <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ANY}>All States</SelectItem>
                        {states.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="duration" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Duration
                </Label>
                <Select value={selectedDuration || ANY} onValueChange={(v) => setSelectedDuration(v === ANY ? '' : v)}>
                    <SelectTrigger id="duration" className="h-11! w-full bg-background">
                        <SelectValue placeholder="Any Duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ANY}>Any Duration</SelectItem>
                        {DURATIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                size="lg"
                className="h-11 px-6 text-sm font-semibold"
                onClick={onSearchClick}
                aria-label="Search Routes"
                type="button"
            >
                <Search />
                Search
            </Button>
        </div>
    );
}
