'use client';

import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/site/BrandIcons';
import { cn } from '@/lib/utils';

interface WhatsAppShareButtonProps {
    title: string;
    className?: string;
}

export default function WhatsAppShareButton({ title, className }: WhatsAppShareButtonProps) {
    const handleWhatsAppShare = () => {
        const url = window.location.href;
        const isCustom = url.includes('?c=') || url.includes('&c=');
        const text = `Check out this ${isCustom ? 'customized ' : ''}Tirth Yatra itinerary: *${title}*\n\n${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Button
            onClick={handleWhatsAppShare}
            size="lg"
            className={cn('h-10 gap-2 bg-[#25D366] px-4 text-white hover:bg-[#1ebe5b]', className)}
            aria-label="Share on WhatsApp"
        >
            <WhatsAppIcon className="size-5" />
            Share on WhatsApp
        </Button>
    );
}
