import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { InstagramIcon } from '@/components/site/BrandIcons';

interface ItineraryCardProps {
    id: string;
    title: string;
    duration: string;
    states?: string[];
    description: string;
    author: string;
    authorInstagram?: string;
}

export default function ItineraryCard({
    id,
    title,
    duration,
    states = [],
    description,
    author,
    authorInstagram
}: ItineraryCardProps) {
    const openInstagram = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(authorInstagram, '_blank', 'noopener,noreferrer');
    };

    return (
        <Link href={`/itinerary/${id}`} className="group block h-full rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-primary/10">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-gold to-maroon opacity-70 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                        {states.map((state) => (
                            <Badge key={state} variant="secondary" className="rounded-full">{state}</Badge>
                        ))}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                        <Clock className="size-3" /> {duration}
                    </span>
                </div>

                <h3 className="mb-2 text-xl leading-snug font-semibold transition-colors group-hover:text-primary">{title}</h3>
                <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

                <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span>By</span>
                        <span className="font-semibold text-foreground">{author}</span>
                        {authorInstagram && (
                            <span
                                role="button"
                                tabIndex={0}
                                className="inline-flex rounded p-1 text-muted-foreground transition-colors hover:text-primary"
                                onClick={openInstagram}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') openInstagram(e);
                                }}
                                aria-label="Author's Instagram"
                            >
                                <InstagramIcon className="size-3.5" />
                            </span>
                        )}
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                        View <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </article>
        </Link>
    );
}
