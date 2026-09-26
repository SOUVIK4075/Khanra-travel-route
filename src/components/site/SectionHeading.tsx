import { cn } from '@/lib/utils';
import Ornament from './Ornament';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-8 flex flex-col gap-3', centered ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</span>
      )}
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {centered && <Ornament />}
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
