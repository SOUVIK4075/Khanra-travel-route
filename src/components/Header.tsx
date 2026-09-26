'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, MapPin, Route, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/site/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/#featured-section', label: 'Itineraries', icon: Route, match: '/itinerary' },
  { href: '/directory', label: 'Places Directory', icon: MapPin, match: '/directory' },
  { href: '/submit', label: 'Share a Route', icon: PenLine, match: '/submit' },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-primary/20 ring-1 ring-gold/40 transition-transform group-hover:scale-105">
        <Image src="/icon.png" alt="" width={24} height={24} className="object-contain" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl font-semibold tracking-tight">Khanra Travel</span>
        <span className="hidden text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase sm:block">
          Tirth Yatra Guide
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (match: string) => pathname.startsWith(match);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/65">
      <div className="h-0.5 bg-gradient-to-r from-primary via-gold to-maroon" />
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label, icon: Icon, match }) => (
            <Button
              key={href}
              asChild
              variant="ghost"
              size="lg"
              className={cn('px-3 text-sm', isActive(match) && 'bg-accent text-accent-foreground')}
            >
              <Link href={href}>
                <Icon />
                {label}
              </Link>
            </Button>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl">Khanra Travel</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map(({ href, label, icon: Icon, match }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                      isActive(match) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Icon className="size-4 text-primary" />
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
