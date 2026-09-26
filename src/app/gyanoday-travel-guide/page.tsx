'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import {
  ArrowLeft, Bus, Download, Globe, Info, Lightbulb, MapPin, Plane, Sparkles, Star, TrainFront,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Ornament from '@/components/site/Ornament';
import { cn } from '@/lib/utils';

function Section({ icon: Icon, title, children, className }: { icon: LucideIcon; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border bg-card p-5 shadow-sm sm:p-7', className)}>
      <h3 className="mb-4 flex items-start gap-3 text-xl font-semibold sm:text-2xl">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
          <Icon className="size-5" />
        </span>
        <span className="pt-0.5">{title}</span>
      </h3>
      <div className="space-y-4 leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

function OptionBlock({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border-l-4 border-primary bg-muted/50 p-4 sm:p-5">{children}</div>;
}

function FareLine({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">{children}</p>;
}

function TravelGuideContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

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

  const t = {
    title: isHi ? 'श्री ज्ञानोदय दिगम्बर जैन मंदिर, बेंगलुरु' : 'Shri Gyanoday Digamber Jain Temple, Bengaluru',
    subtitle: isHi ? 'मंदिर का पता' : 'Temple Location',
    address: isHi
      ? 'Digambar Jain Mandir Road, Near VIBGYOR High School, Silver Springs Layout, Munnekollal, Marathahalli, Bengaluru, Karnataka – 560066'
      : 'Digambar Jain Mandir Road, Near VIBGYOR High School, Silver Springs Layout, Munnekollal, Marathahalli, Bengaluru, Karnataka – 560066',
    mapsBtn: isHi ? 'Google Maps पर देखें' : 'View on Google Maps',
    downloadBtn: isHi ? 'PDF डाउनलोड करें' : 'Download PDF',
    quickInfo: isHi ? 'संक्षिप्त यात्रा जानकारी' : 'Quick Travel Information',
    infoCol1: isHi ? 'जानकारी' : 'Information',
    infoCol2: isHi ? 'विवरण' : 'Details',
    airportLabel: isHi ? 'निकटतम हवाई अड्डा' : 'Nearest Airport',
    airportVal: isHi ? 'केम्पेगौड़ा अंतरराष्ट्रीय हवाई अड्डा (BLR)' : 'Kempegowda International Airport (BLR)',
    metroLabel: isHi ? 'निकटतम मेट्रो स्टेशन' : 'Nearest Metro Station',
    metroVal: isHi ? 'कुन्दलहल्ली मेट्रो स्टेशन (पर्पल लाइन) या सीतारमपाल्या मेट्रो स्टेशन (पर्पल लाइन)' : 'Kundalahalli Metro Station (Purple Line) or Seetharampalya (Purple Line)',
    railLabel: isHi ? 'निकटतम रेलवे स्टेशन' : 'Nearest Railway Station',
    railVal: isHi ? 'कृष्णराजपुरम (KR पुरम)' : 'Krishnarajapuram (KR Puram)',
    cabLabel: isHi ? 'कैब सुविधा' : 'Cab Services',
    cabVal: isHi ? 'Uber, Ola एवं Airport Taxi उपलब्ध' : 'Uber, Ola and Airport Taxi Available',
    autoLabel: isHi ? 'ऑटो सुविधा' : 'Auto Availability',
    autoVal: isHi ? 'सभी प्रमुख रेलवे एवं मेट्रो स्टेशनों पर उपलब्ध' : 'Easily available near all Metro & Railway Stations',

    flightTitle: isHi ? 'हवाई जहाज द्वारा (By Flight)' : 'Reaching by Flight',
    flightSubtitle: isHi ? 'केम्पेगौड़ा अंतरराष्ट्रीय हवाई अड्डा (BLR)' : 'Kempegowda International Airport (BLR)',
    distTime: isHi ? 'मंदिर से दूरी- लगभग 42 किलोमीटर | अनुमानित यात्रा समय- 90–180 मिनट' : 'Distance: ~42 km | Travel Time: 90–180 minutes',

    flightOpt1: isHi ? 'विकल्प 1 – टैक्सी (सबसे सुविधाजनक)' : 'Option 1 – Taxi (Recommended)',
    flightOpt1Desc: isHi
      ? 'आगमन (Arrival) टर्मिनल से बाहर निकलने के बाद Uber, Ola या Airport Taxi बुक करें। Destination में लिखें: Shri Gyanoday Digamber Jain Temple. यदि आपके साथ अधिक सामान, बुजुर्ग अथवा छोटे बच्चे हों, तो यह सबसे सुविधाजनक विकल्प है।'
      : 'After exiting the Arrival Terminal, book an Uber, Ola, or Airport Taxi. Enter the destination: Shri Gyanoday Digamber Jain Temple. This is the most comfortable option, especially with luggage or elderly family members.',
    fareTime1: isHi ? 'किराया: ₹700–₹1,500 | समय: 75–150 मिनट' : 'Fare: ₹700–₹1,500 | Time: 75–150 mins',

    flightOpt2: isHi ? 'विकल्प 2 – एयरपोर्ट बस + ऑटो' : 'Option 2 – Airport Bus + Auto',
    flightOpt2Desc: isHi
      ? 'BMTC की Vayu Vajra Airport Bus सेवा हवाई अड्डे को शहर के विभिन्न भागों से जोड़ती है। Marathahalli / Whitefield दिशा की बस लें (बस नं: KIA-6, KIA-4A, and KIA-8)। कुन्दलहल्ली / मराठाहल्ली के निकट उतरकर ऑटो अथवा कैब द्वारा मंदिर पहुँचें।'
      : 'BMTC operates Vayu Vajra airport buses. Take a bus towards Marathahalli / Whitefield (Bus No. KIA-6, KIA-4A, and KIA-8). Get down near Kundalahalli/Marathahalli, then hire an Auto or Cab to the temple.',
    fareTime2: isHi ? 'किराया: ₹450 तक | समय: 90–180 मिनट' : 'Fare: ~₹450 | Time: 90–180 mins',

    trainTitle: isHi ? 'रेल द्वारा (By Train)' : 'Reaching by Train',
    trainDesc: isHi ? 'बेंगलुरु में कई रेलवे स्टेशन हैं। सबसे सुविधाजनक स्टेशन नीचे दिए गए हैं:' : 'Bengaluru has several railway stations. The most convenient ones are:',

    krPuram: isHi ? '1. कृष्णराजपुरम (KR पुरम) रेलवे स्टेशन (7 किमी)' : '1. Krishnarajapuram (KR Puram) Railway Station (7 km)',
    krPuramDesc: isHi
      ? 'विकल्प 1 (कैब/ऑटो): स्टेशन के बाहर से Uber/Ola बुक करें (₹200–₹400)।\nविकल्प 2 (मेट्रो+ऑटो): KR पुरम मेट्रो स्टेशन पहुँचें। पर्पल लाइन में Challaghatta दिशा की मेट्रो लें। कुन्दलहल्ली या सीतारमपाल्या पर उतरें। वहाँ से ऑटो लें।'
      : 'Option 1 (Cab/Auto): Book Uber/Ola directly from station (₹200–₹400).\nOption 2 (Metro+Auto): Go to KR Puram Metro Station. Board Purple Line towards Challaghatta. Get down at Kundalahalli. Take Auto.',

    smvt: isHi ? '2. सर एम. विश्वेश्वरैया टर्मिनल (SMVT) (8-10 किमी)' : '2. Sir M. Visvesvaraya Terminal Bengaluru (SMVT) (8-10 km)',
    smvtDesc: isHi ? 'सीधे Uber या Ola लेना सबसे सुविधाजनक रहेगा। (₹250–₹500 | 30-60 मिनट)' : 'Direct Uber or Ola is recommended. (₹250–₹500 | 30-60 mins)',

    majestic: isHi ? '3. केएसआर बेंगलुरु सिटी रेलवे स्टेशन (मैजेस्टिक) (20 किमी)' : '3. KSR Bengaluru City Railway Station (Majestic) (20 km)',
    majesticDesc: isHi
      ? 'सुविधाजनक मार्ग (मेट्रो): रेलवे स्टेशन से पैदल चलकर नादप्रभु केम्पेगौड़ा (मैजेस्टिक) मेट्रो स्टेशन पहुँचें। पर्पल लाइन (Whitefield/Kadugodi दिशा) में बैठें। कुन्दलहल्ली मेट्रो स्टेशन पर उतरें और ऑटो लें। (₹70–₹180 | 60 मिनट)'
      : 'Metro Route: Walk to Nadaprabhu Kempegowda (Majestic) Metro Station. Board Purple Line towards Whitefield (Kadugodi). Get down at Kundalahalli Metro Station. Take an Auto. (₹70–₹180 | 60 mins)',

    yesvantpur: isHi ? '4. यशवंतपुर जंक्शन (22 किमी)' : '4. Yesvantpur Junction (22 km)',
    yesvantpurDesc: isHi
      ? 'मेट्रो मार्ग: यशवंतपुर मेट्रो स्टेशन से ग्रीन लाइन लें -> मैजेस्टिक मेट्रो स्टेशन -> पर्पल लाइन (Whitefield दिशा) बदलें -> कुन्दलहल्ली मेट्रो स्टेशन पर उतरें -> ऑटो लें। (75–150 मिनट)'
      : 'Metro Route: Take Green Line from Yesvantpur -> Change to Purple Line at Majestic (towards Whitefield) -> Get down at Kundalahalli -> Take Auto. (75–150 mins)',

    cantonment: isHi ? '5. बेंगलुरु कैंटोनमेंट रेलवे स्टेशन (17 किमी)' : '5. Bengaluru Cantonment Railway Station (17 km)',
    cantonmentDesc: isHi
      ? 'निकटतम पर्पल लाइन मेट्रो स्टेशन (जैसे Cubbon Park) पहुँचें। Whitefield दिशा की मेट्रो लें और कुन्दलहल्ली उतरें। या सीधे कैब लें। (50–90 मिनट)'
      : 'Reach nearest Purple Line Metro (e.g. Cubbon Park). Board towards Whitefield. Get down at Kundalahalli. Or take a direct cab. (50–90 mins)',

    busTitle: isHi ? 'बस द्वारा (By Bus)' : 'Reaching by Bus',
    busDesc: isHi
      ? 'यदि आप बस से यात्रा करना चाहते हैं, तो Whitefield, ITPL, AECS Layout, Kundalahalli या Marathahalli दिशा की बसें (BMTC) लें। कुन्दलहल्ली गेट या सीतारमपाल्या बस स्टॉप पर उतरें। वहाँ से ऑटो लें।'
      : 'If travelling entirely by bus, board BMTC buses heading towards Whitefield, ITPL, AECS Layout, Kundalahalli, or Marathahalli. Get down at Kundalahalli Gate or Seetharampalya. Take a short Auto ride.',

    tipsTitle: isHi ? 'यात्रा संबंधी सुझाव (Travel Tips)' : 'Travel Tips',
    tips: isHi ? [
      'सप्ताह के कार्यदिवसों में मेट्रो यात्रा सबसे तेज़ एवं सुविधाजनक रहती है।',
      'यदि आपके साथ बुजुर्ग, छोटे बच्चे या अधिक सामान हो, तो सीधे कैब लेना बेहतर रहेगा।',
      'Uber, Ola एवं ऑटो पूरे बेंगलुरु में आसानी से उपलब्ध हैं।',
      'अधिकांश चालक UPI, नकद एवं डिजिटल भुगतान स्वीकार करते हैं।',
      'मोबाइल में पर्याप्त बैटरी एवं इंटरनेट अवश्य रखें।',
      'सुबह (8:30–11:00 बजे) तथा शाम (5:30–8:30 बजे) के व्यस्त समय में यात्रा का समय अधिक लग सकता है।'
    ] : [
      'Metro is usually the fastest option during weekday traffic.',
      'If travelling with elderly devotees or heavy luggage, booking a Cab directly is recommended.',
      'Uber, Ola, and Auto services are widely available throughout Bengaluru.',
      'Most drivers accept UPI and cash.',
      'Keep your phone charged and carry mobile data for navigation.',
      'During peak office hours (8:30–11:00 AM and 5:30–8:30 PM), travel times may increase significantly due to traffic.'
    ]
  };

  const pdfUrl = isHi ? '/pdfs/gyanoday-travel-guide-hi.pdf' : '/pdfs/gyanoday-travel-guide-en.pdf';
  const mapUrl = 'https://www.google.com/maps?cid=10167995298631462920';

  const hubs: { id: string; icon: LucideIcon; name: string }[] = [
    { id: 'flight', icon: Plane, name: isHi ? 'हवाई अड्डा (BLR Airport)' : 'Airport (BLR)' },
    { id: 'kr-puram', icon: TrainFront, name: isHi ? 'KR पुरम स्टेशन' : 'KR Puram Station' },
    { id: 'smvt', icon: TrainFront, name: isHi ? 'SMVT टर्मिनल' : 'SMVT Terminal' },
    { id: 'majestic', icon: TrainFront, name: isHi ? 'मैजेस्टिक स्टेशन' : 'Majestic Station' },
    { id: 'yesvantpur', icon: TrainFront, name: isHi ? 'यशवंतपुर जंक्शन' : 'Yesvantpur Junction' },
    { id: 'cantonment', icon: TrainFront, name: isHi ? 'कैंटोनमेंट स्टेशन' : 'Cantonment Station' },
    { id: 'bus', icon: Bus, name: isHi ? 'बस स्टैंड (BMTC)' : 'Bus Station (BMTC)' }
  ];

  const renderSelectedContent = () => {
    switch (selectedHub) {
      case 'flight':
        return (
          <Section icon={Plane} title={t.flightTitle}>
            <div>
              <p className="font-semibold">{t.flightSubtitle}</p>
              <p className="text-muted-foreground">{t.distTime}</p>
            </div>

            <OptionBlock>
              <h4 className="mb-2 flex flex-wrap items-center gap-2 text-lg font-semibold">
                {t.flightOpt1}
                <Badge className="bg-gold text-gold-foreground"><Star className="fill-current" /> Recommended</Badge>
              </h4>
              <p>{t.flightOpt1Desc}</p>
              <div className="mt-3 rounded-lg border border-success/40 bg-success/10 p-3 text-sm">
                <strong className="mb-1 flex items-center gap-1.5 text-success">
                  <Sparkles className="size-4" /> {isHi ? 'विशेष ऑफर:' : 'Special Offer:'}
                </strong>
                <p>
                  {isHi ? 'Airport यात्रियों के लिए Aishwarya Cabs द्वारा विशेष एयरपोर्ट ड्रॉप/पिकअप (₹900 + toll) उपलब्ध है।' : 'Aishwarya Cabs offers a special fixed rate (₹900+toll) for airport travelers.'}
                </p>
                <a href="https://www.aishwaryacabs.in/" target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold text-success underline underline-offset-2">
                  {isHi ? 'यहाँ बुक करें' : 'Book Here'}
                </a>
              </div>
              <FareLine>{t.fareTime1}</FareLine>
            </OptionBlock>

            <OptionBlock>
              <h4 className="mb-2 text-lg font-semibold">{t.flightOpt2}</h4>
              <p>{t.flightOpt2Desc}</p>
              <FareLine>{t.fareTime2}</FareLine>
            </OptionBlock>
          </Section>
        );
      case 'kr-puram':
        return (
          <Section icon={TrainFront} title={t.krPuram}>
            <OptionBlock>
              <p className="whitespace-pre-line">{t.krPuramDesc}</p>
            </OptionBlock>
          </Section>
        );
      case 'smvt':
        return (
          <Section icon={TrainFront} title={t.smvt}>
            <OptionBlock><p>{t.smvtDesc}</p></OptionBlock>
          </Section>
        );
      case 'majestic':
        return (
          <Section icon={TrainFront} title={t.majestic}>
            <OptionBlock><p>{t.majesticDesc}</p></OptionBlock>
          </Section>
        );
      case 'yesvantpur':
        return (
          <Section icon={TrainFront} title={t.yesvantpur}>
            <OptionBlock><p>{t.yesvantpurDesc}</p></OptionBlock>
          </Section>
        );
      case 'cantonment':
        return (
          <Section icon={TrainFront} title={t.cantonment}>
            <OptionBlock><p>{t.cantonmentDesc}</p></OptionBlock>
          </Section>
        );
      case 'bus':
        return (
          <Section icon={Bus} title={t.busTitle}>
            <p>{t.busDesc}</p>
          </Section>
        );
      default:
        return null;
    }
  };

  const quickInfoRows = [
    [t.airportLabel, t.airportVal],
    [t.metroLabel, t.metroVal],
    [t.railLabel, t.railVal],
    [t.cabLabel, t.cabVal],
    [t.autoLabel, t.autoVal],
  ];

  return (
    <div className="pb-8">
      <Head>
        <title>{t.title} | Travel Guide</title>
      </Head>

      <section className="bg-mandala border-b bg-secondary/40">
        <div className="container flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between sm:py-14">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{t.subtitle}</span>
            <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">{t.title}</h1>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-1 size-4 shrink-0 text-primary" /> {t.address}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild size="lg" className="h-10 px-4">
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin /> {t.mapsBtn}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-10 px-4">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download /> {t.downloadBtn}
                </a>
              </Button>
            </div>
          </div>
          <Button variant="secondary" size="lg" className="h-10 self-start px-4" onClick={toggleLang}>
            <Globe /> {isHi ? 'Read in English' : 'हिंदी में पढ़ें'}
          </Button>
        </div>
      </section>

      <div className="container mx-auto flex max-w-4xl flex-col gap-6 pt-8">
        {!selectedHub ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">{isHi ? 'आप कहाँ पहुँच रहे हैं?' : 'Where are you arriving?'}</h2>
              <Ornament className="mt-3" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {hubs.map(({ id, icon: Icon, name }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedHub(id)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-accent text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-semibold">{name}</span>
                </button>
              ))}
            </div>

            <Section icon={Info} title={t.quickInfo}>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <tbody>
                    {quickInfoRows.map(([label, value]) => (
                      <tr key={label} className="border-b last:border-0 even:bg-muted/40">
                        <th scope="row" className="w-2/5 bg-secondary/60 px-4 py-3 text-left align-top font-semibold">{label}</th>
                        <td className="px-4 py-3">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </>
        ) : (
          <>
            <Button variant="ghost" className="self-start" onClick={() => setSelectedHub(null)}>
              <ArrowLeft /> {isHi ? 'वापस जाएँ (Back to Options)' : 'Back to Options'}
            </Button>

            {renderSelectedContent()}
          </>
        )}

        <Section icon={Lightbulb} title={t.tipsTitle} className={cn(!selectedHub && 'mt-2')}>
          <ul className="space-y-2.5">
            {t.tips.map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="flex justify-center pt-2">
          <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download /> {t.downloadBtn}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TravelGuidePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading...</div>}>
      <TravelGuideContent />
    </Suspense>
  );
}
