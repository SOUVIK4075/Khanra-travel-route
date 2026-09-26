'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
    id?: string;
    className?: string;
}

export default function Autocomplete({
    value,
    onChange,
    suggestions,
    placeholder = 'Search...',
    id = 'autocomplete',
    className,
}: AutocompleteProps) {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listId = `${id}-listbox`;

    // Filter suggestions based on input value
    useEffect(() => {
        if (value.trim().length > 0) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    }, [value, suggestions]);

    // Handle clicks outside the component to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowSuggestions(true);
        setActiveSuggestionIndex(0);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && showSuggestions && filteredSuggestions[activeSuggestionIndex]) {
            handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const open = showSuggestions && value.trim().length > 0;

    return (
        <div className={cn('relative', className)} ref={containerRef}>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => value.trim().length > 0 && setShowSuggestions(true)}
                className="h-11 bg-background pl-9 text-base md:text-sm"
                autoComplete="off"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
            />
            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => {
                            const isSelected = index === activeSuggestionIndex;
                            const matchIndex = suggestion.toLowerCase().indexOf(value.toLowerCase());

                            // Highlight the matching part
                            const before = suggestion.substring(0, matchIndex);
                            const match = suggestion.substring(matchIndex, matchIndex + value.length);
                            const after = suggestion.substring(matchIndex + value.length);

                            return (
                                <li
                                    key={index}
                                    role="option"
                                    aria-selected={isSelected}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm',
                                        isSelected && 'bg-accent text-accent-foreground'
                                    )}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                                >
                                    <Search className="size-3.5 shrink-0 opacity-50" />
                                    <span>
                                        {before}<span className="font-semibold text-primary">{match}</span>{after}
                                    </span>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-3 py-2 text-sm text-muted-foreground">No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
