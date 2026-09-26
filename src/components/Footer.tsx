import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/site/BrandIcons';
import Ornament from '@/components/site/Ornament';

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t bg-secondary/40">
      <div className="container flex flex-col items-center gap-6 py-12 text-center">
        <Ornament />
        <div className="space-y-2">
          <p className="font-heading text-2xl font-semibold">Have a route to share?</p>
          <p className="text-sm text-muted-foreground">Help a fellow yatri plan a peaceful and comfortable journey.</p>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          Submit an Itinerary <ArrowRight className="size-4" />
        </Link>

        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
          <a href="mailto:khanrasouvik112@gmail.com" className="inline-flex items-center gap-2 transition-colors hover:text-primary">
            <Mail className="size-4" /> khanrasouvik112@gmail.com
          </a>
          <a
            href="https://github.com/SOUVIK4075"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-primary"
          >
            <GithubIcon className="size-4" /> Developer? Contribute on GitHub
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Khanra Travel. Built for the community.
        </p>
      </div>
    </footer>
  );
}
