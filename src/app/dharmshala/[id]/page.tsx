import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dharmshalasOriginal from '@/data/dharmshalas.json';
import itinerariesOriginal from '@/data/itineraries.json';
import PlaceDetail, { type PlaceRecord } from '@/app/directory/_components/PlaceDetail';

type Params = Promise<{ id: string }>;

const dharmshalas = dharmshalasOriginal as unknown as PlaceRecord[];

export async function generateStaticParams() {
    return dharmshalas.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const dharmshala = dharmshalas.find((d) => d.id === id);
    if (!dharmshala) return { title: 'Dharmshala Not Found | Khanra Travel' };

    return {
        title: `${dharmshala.name} | Khanra Travel`,
        description: dharmshala.introText || `View contacts and details for ${dharmshala.name}.`,
    };
}

export default async function DharmshalaPage({ params }: { params: Params }) {
    const { id } = await params;
    const dharmshala = dharmshalas.find((d) => d.id === id);

    if (!dharmshala) {
        notFound();
    }

    // Find itineraries that include this dharmshala
    // Note: tirthId is still used in itineraries for referencing both Tirths and Dharmshalas
    const relatedItineraries = itinerariesOriginal.filter(itin =>
        itin.days.some(day =>
            day.stops.some((stop: any) => stop.tirthId === dharmshala.id)
        )
    );

    return (
        <PlaceDetail
            place={dharmshala}
            kind="Dharmshala"
            fallbackIntro={`A place of stay and rest located in ${dharmshala.state}.`}
            relatedItineraries={relatedItineraries}
            relatedText={`This dharmshala is a stop in ${relatedItineraries.length} itinerary route(s).`}
        />
    );
}
