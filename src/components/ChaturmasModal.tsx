'use client';

import { useState, useEffect } from 'react';
import { FileText, ScrollText, CarTaxiFront, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Ornament from '@/components/site/Ornament';

interface ChaturmasModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const LINKS = [
    { href: '/pdfs/karnataka-itinerary-en.pdf', icon: FileText, title: 'Karnataka Itineraries', sub: 'English Version', external: true },
    { href: '/pdfs/karnataka-itinerary-hi.pdf', icon: ScrollText, title: 'कर्नाटक यात्रा मार्ग', sub: 'हिंदी संस्करण', external: true },
    { href: '/pdfs/tamil-nadu-itinerary-en.pdf', icon: FileText, title: 'Tamil Nadu Itineraries', sub: 'English Version', external: true },
    { href: '/pdfs/tamil-nadu-itinerary-hi.pdf', icon: ScrollText, title: 'तमिलनाडु यात्रा मार्ग', sub: 'हिंदी संस्करण', external: true },
    { href: '/chaturmas-cabs?lang=en', icon: CarTaxiFront, title: 'Negotiated Cabs & Tours', sub: 'English Version', external: false },
    { href: '/chaturmas-cabs?lang=hi', icon: CarTaxiFront, title: 'रियायती कैब और यात्रा दरें', sub: 'हिंदी संस्करण', external: false },
];

export default function ChaturmasModal({ isOpen: controlledIsOpen, onClose }: ChaturmasModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    useEffect(() => {
        if (controlledIsOpen === undefined) {
            const hasSeen = sessionStorage.getItem('hasSeenChaturmasModal');
            if (!hasSeen) {
                // Show popup on reload with a slight smooth delay
                const timer = setTimeout(() => {
                    setInternalOpen(true);
                }, 600);
                return () => clearTimeout(timer);
            }
        }
    }, [controlledIsOpen]);

    const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

    const handleClose = () => {
        sessionStorage.setItem('hasSeenChaturmasModal', 'true');
        if (onClose) {
            onClose();
        } else {
            setInternalOpen(false);
        }
    };

    return (
        <Dialog open={isVisible} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
                <DialogHeader className="bg-mandala items-center gap-3 border-b bg-secondary/60 px-6 pt-8 pb-6 text-center">
                    <span className="text-3xl" aria-hidden>🙏</span>
                    <DialogTitle className="font-heading text-xl leading-snug font-semibold sm:text-2xl">
                        Welcome to All Yatris arriving for
                        <br />
                        <span className="text-gradient-saffron">Bengaluru Chaturmaas 2026</span>
                    </DialogTitle>
                    <DialogDescription className="font-heading text-base text-maroon dark:text-gold">
                        (आत्म-सिलिकॉन वर्षायोग)
                    </DialogDescription>
                    <Ornament />
                </DialogHeader>

                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                    {LINKS.map(({ href, icon: Icon, title, sub, external }) => (
                        <a
                            key={href}
                            href={href}
                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="group flex items-center gap-3 rounded-xl border bg-card p-3.5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                                <Icon className="size-5" />
                            </span>
                            <span className="flex min-w-0 flex-col">
                                <strong className="truncate text-sm font-semibold">{title}</strong>
                                <span className="text-xs text-muted-foreground">{sub}</span>
                            </span>
                        </a>
                    ))}
                </div>

                <div className="flex justify-center border-t bg-muted/40 px-6 py-4">
                    <Button size="lg" className="h-11 rounded-full px-6 text-base" onClick={handleClose}>
                        Explore Khanra Travel <ArrowRight />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
