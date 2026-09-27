import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Ornament from '@/components/site/Ornament';

export default function NotFound() {
    return (
        <div className="relative overflow-hidden bg-mandala">
            <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
                <h1 className="text-8xl font-bold text-gradient-saffron sm:text-9xl">404</h1>
                <Ornament className="my-4" />
                <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">Page Not Found</h2>
                <p className="mb-8 max-w-md text-muted-foreground">
                    Jai Jagannath! 🙏 The page you are looking for might have been removed,
                    had its name changed, or is temporarily unavailable.
                </p>
                <Button asChild size="lg" className="h-11 rounded-full px-6">
                    <Link href="/">
                        <Home /> Return to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
