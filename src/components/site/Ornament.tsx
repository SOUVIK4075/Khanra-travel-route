import { cn } from '@/lib/utils';

/** Temple-style gold divider: two tapered lines around a small lotus. */
export default function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex items-center justify-center gap-3 text-gold', className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-current sm:w-20" />
      <svg width="28" height="16" viewBox="0 0 28 16" fill="currentColor">
        <path d="M14 0c2.2 3 2.2 7.5 0 11-2.2-3.5-2.2-8 0-11Z" />
        <path d="M14 11c-2.5-3.2-6.4-4.8-10-4.2 1.3 3.6 5.4 5.6 10 4.2Z" opacity=".75" />
        <path d="M14 11c2.5-3.2 6.4-4.8 10-4.2-1.3 3.6-5.4 5.6-10 4.2Z" opacity=".75" />
        <path d="M4 13.5h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-current sm:w-20" />
    </div>
  );
}
