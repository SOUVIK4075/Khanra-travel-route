import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import tirthsOriginal from '@/data/tirths.json';
import itinerariesOriginal from '@/data/itineraries.json';
import PlaceDetail, { type PlaceRecord } from '@/app/directory/_components/PlaceDetail';

type Params = Promise<{ id: string }>;

const tirths = tirthsOriginal as unknown as PlaceRecord[];

export async function generateStaticParams() {
    return tirths.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const tirth = tirths.find((t) => t.id === id);
    if (!tirth) return { title: 'Tirth Not Found | Khanra Travel' };

    return {
        title: `${tirth.name} | Khanra Travel`,
        description: tirth.introText || `Plan your visit to ${tirth.name}. View contact numbers, Dharmshala details, and connected itineraries.`,
    };
}

export default async function TirthPage({ params }: { params: Params }) {
    const { id } = await params;
    const tirth = tirths.find((t) => t.id === id);

    if (!tirth) {
        notFound();
    }

    // Find itineraries that include this tirth
    const relatedItineraries = itinerariesOriginal.filter(itin =>
        itin.days.some(day =>
            day.stops.some((stop: any) => stop.tirthId === tirth.id)
        )
    );

    return (
        <PlaceDetail
            place={tirth}
            kind="Tirth"
            fallbackIntro={`A sacred pilgrimage site located in ${tirth.state}.`}
            relatedItineraries={relatedItineraries}
            relatedText={`This tirth is part of ${relatedItineraries.length} itinerary route(s).`}
        />
    );
}
