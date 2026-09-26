'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Globe, Phone, ExternalLink, TriangleAlert, CarTaxiFront } from 'lucide-react';
import { cabOptions, CabOption } from '@/data/cabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Ornament from '@/components/site/Ornament';
import { cn } from '@/lib/utils';

type FilterType = 'All' | '4 Seater' | '6/7 Seater' | '12 Seater';

const FILTER_LABELS_HI: Record<FilterType, string> = {
  'All': 'सभी',
  '4 Seater': '4 सीटर',
  '6/7 Seater': '6/7 सीटर',
  '12 Seater': '12 सीटर',
};

function CabsContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [filter, setFilter] = useState<FilterType>('All');

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam === 'hi') {
      setLang('hi');
    }
  }, [searchParams]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const isHi = lang === 'hi';

  // Apply filter
  const filteredCabs = cabOptions.filter((cab) => {
    if (filter === 'All') return true;
    if (filter === '4 Seater') return cab.capacity === 4;
    if (filter === '6/7 Seater') return cab.capacity === 6 || cab.capacity === 7;
    if (filter === '12 Seater') return cab.capacity === 12;
    return true;
  });

  // Group filtered cabs by company name
  const groupedCabs = filteredCabs.reduce((acc, cab) => {
    if (!acc[cab.companyName]) {
      acc[cab.companyName] = [];
    }
    acc[cab.companyName].push(cab);
    return acc;
  }, {} as Record<string, CabOption[]>);

  // Sort companies by priority order (using the first cab's priority order)
  const sortedCompanies = Object.keys(groupedCabs).sort(
    (a, b) => groupedCabs[a][0].priorityOrder - groupedCabs[b][0].priorityOrder
  );

  return (
    <div className="pb-8">
      <section className="bg-mandala border-b bg-secondary/40">
        <div className="container flex flex-col gap-6 py-10 sm:py-14">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                <CarTaxiFront className="size-4" /> Chaturmaas 2026
              </span>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                {isHi ? 'रियायती कैब और यात्रा दरें' : 'Negotiated Cabs & Tours'}
              </h1>
              <p className="text-muted-foreground">
                {isHi ? 'बेंगलुरु चातुर्मास 2026 यात्रियों के लिए विशेष दरें' : 'Special rates for Bengaluru Chaturmaas 2026 Yatris'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="lg" className="h-10 px-4" onClick={toggleLang}>
                <Globe /> {isHi ? 'Read in English' : 'हिंदी में पढ़ें'}
              </Button>
              <Button asChild size="lg" className="h-10 px-4">
                <a
                  href="https://docs.google.com/spreadsheets/d/1vLxLAB8CwDth1KU605bdT_5MMEkVpeFbfaKJWh5sBk4/export?format=pdf&gid=183019313"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download /> {isHi ? 'PDF डाउनलोड करें' : 'Download PDF'}
                </a>
              </Button>
            </div>
          </div>

          <Alert className="border-gold/50 bg-gold/10">
            <TriangleAlert className="text-gold-foreground dark:text-gold" />
            <AlertDescription className="text-foreground">
              <p>
                <strong>{isHi ? 'ध्यान दें:' : 'Note:'}</strong>{' '}
                {isHi ? 'टोल टैक्स, पार्किंग शुल्क और स्टेट परमिट (कर्नाटक के बाहर) का भुगतान यात्री को अतिरिक्त करना होगा।' : 'Toll charges, parking fees, and state permits (if traveling outside Karnataka) are extra and must be paid by the passenger.'}
              </p>
            </AlertDescription>
          </Alert>

          <div role="group" aria-label={isHi ? 'वाहन क्षमता' : 'Vehicle capacity'} className="flex flex-wrap gap-2">
            {(['All', '4 Seater', '6/7 Seater', '12 Seater'] as FilterType[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  filter === f
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card hover:border-primary/50 hover:bg-accent'
                )}
              >
                {isHi ? FILTER_LABELS_HI[f] : f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container pt-8">
        {sortedCompanies.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            {isHi ? 'इस फिल्टर से मेल खाने वाले कोई वाहन नहीं मिले।' : 'No vehicles found matching this filter.'}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedCompanies.map((company) => {
              const cabs = groupedCabs[company];
              const contact = cabs[0].contact;
              const isLink = contact.startsWith('http');

              return (
                <Card key={company} className="gap-0 py-0 shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b bg-secondary/50 py-4">
                    <CardTitle className="font-heading text-lg font-semibold">{company}</CardTitle>
                    {isLink ? (
                      <Button asChild variant="outline" size="sm" className="h-8 px-3">
                        <a href={contact} target="_blank" rel="noopener noreferrer">
                          <ExternalLink /> {isHi ? 'वेबसाइट देखें' : 'Visit Website'}
                        </a>
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="h-8 px-3">
                        <a href={`tel:${contact}`}>
                          <Phone /> {contact}
                        </a>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="overflow-x-auto px-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
                          <th className="px-4 py-2.5 font-semibold">{isHi ? 'वाहन' : 'Vehicle'}</th>
                          <th className="px-4 py-2.5 font-semibold">
                            {company === 'Aishwarya Cabs' ? (isHi ? 'कुल लागत' : 'Cost') : (isHi ? 'दर/किमी' : 'Rate/Km')}
                          </th>
                          <th className="px-4 py-2.5 font-semibold">{isHi ? 'भत्ता/दिन' : 'Bata/Day'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cabs.map((cab, idx) => (
                          <tr key={idx} className="border-b last:border-0 even:bg-muted/40">
                            <td className="px-4 py-3 font-medium">
                              {cab.vehicleType}
                              {cab.capacity && cab.capacity !== '-' && (
                                <span className="block text-xs font-normal text-muted-foreground">
                                  {isHi ? 'क्षमता:' : 'Capacity:'} {cab.capacity}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold text-primary">
                              {cab.ratePerKm !== '-' ? `₹${cab.ratePerKm}` : '-'}
                            </td>
                            <td className="px-4 py-3">
                              {cab.bataPerDay !== '-' ? `₹${cab.bataPerDay}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        <Ornament className="mt-12" />
      </div>
    </div>
  );
}

export default function ChaturmasCabsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading...</div>}>
      <CabsContent />
    </Suspense>
  );
}
