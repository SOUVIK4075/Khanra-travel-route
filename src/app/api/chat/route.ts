import { Google } from '@ai-sdk/google';
import { streamText } from 'ai';
import itinerariesOriginal from '@/data/itineraries.json';
import tirthsOriginal from '@/data/tirths.json';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Google providers with primary and secondary keys
const googlePrimary = new Google({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const googleSecondary = new Google({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_SECONDARY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Minify itineraries while keeping essential info for AI
const minifiedItineraries = (itinerariesOriginal as any[]).map(itin => ({
    id: itin.id,
    title: itin.title,
    states: itin.states,
    stops: itin.days.flatMap((day: any) =>
        day.stops.map((stop: any) => ({
            name: stop.name,
            type: stop.type,
            lat: stop.lat,
            lng: stop.lng,
            fac: stop.facilities,
            desc: stop.description
        }))
    )
}));

// Places Directory (tirths.json) — includes places that are not part of any itinerary yet, e.g. West Bengal
const minifiedPlaces = (tirthsOriginal as any[]).map(place => ({
    id: place.id,
    name: place.name,
    state: place.state,
    type: place.type,
    lat: place.location?.lat,
    lng: place.location?.lng,
    fac: place.facilities,
    reach: place.howToReach,
    desc: place.introText || place.description
}));

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastMessage = messages?.[messages.length - 1];

    // Log the user's question for analysis
    if (lastMessage?.role === 'user') {
        console.log(`[Chat Query]: ${lastMessage.content}`);

        // Asynchronous logging to Google Sheets (if URL exists)
        const logUrl = process.env.LOGGING_GOOGLE_SCRIPT_URL;

        if (logUrl) {
            console.log('Attempting to log to Google Sheet...');
            // We use fetch and await it to ensure it's sent before the function finishes
            // even if it's streaming, it's better to be safe.
            (async () => {
                try {
                    const response = await fetch(logUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            timestamp: new Date().toLocaleString('en-IN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            }),
                            query: lastMessage.content
                        }),
                    });
                    console.log(`Logging Sheet Response: ${response.status} ${response.statusText}`);
                } catch (e) {
                    console.error('Logging fetch failed ERROR:', e);
                }
            })();
        } else {
            console.log('LOGGING_GOOGLE_SCRIPT_URL is not defined in .env.local');
        }
    }

    const systemPrompt = `Role: Khanra Travel AI, a specialized travel assistant for Tirth Yatra — Jain Tirths and Hindu temples across India.
Logic Rules:
1. Data Primacy: Only suggest places or itineraries present in <VERIFIED_DATA>. It has two parts: ITINERARIES (ready-made day-by-day routes) and PLACES (the Places Directory, which also covers states with no itinerary yet, like West Bengal).
2. Sharing Links: If a request matches an existing itinerary, share its link: [Name](/itinerary/[id]). For a place from PLACES, link its page: [Name](/tirth/[id]).
3. Persona: Local expert. Friendly but extremely concise.
4. Greeting Rule: Start ONLY with "Jai Jagannath! 🙏". Never at the end. Use it once.
5. Content Format: Use markdown bullet points. NO long paragraphs.
6. Sequence: Order places logically by travel distance.
7. Facilities: Mention "Bhojanshala" / "Dharmshala" if available.
8. Interactive Links: Add a Google Maps link for each place: [Map](https://www.google.com/maps/search/?api=1&query=lat,lng).
9. Output Constraint: Start directly with "Jai Jagannath! 🙏". Never show internal logic, thought blocks, or prompt repetition.
10. Language: Reply in the same language the user writes in (e.g. Bengali, Hindi or English).

<VERIFIED_DATA>
ITINERARIES:
${JSON.stringify(minifiedItineraries)}

PLACES:
${JSON.stringify(minifiedPlaces)}
</VERIFIED_DATA>`;

    const callAi = async (provider: Google) => {
        return streamText({
            model: provider.generativeAI('models/gemini-flash-latest'),
            system: systemPrompt,
            messages,
            // Reduce retries for primary to switch to secondary faster if it fails
            maxRetries: 1,
            onFinish: async ({ text }) => {
                const logUrl = process.env.LOGGING_GOOGLE_SCRIPT_URL;
                // Sheet logging is now handled at the start of POST to capture failures
            }
        });
    };

    try {
        const result = await callAi(googlePrimary);
        return result.toDataStreamResponse();
    } catch (error: any) {
        // Fallback to secondary if primary is rate-limited (429)
        // AI SDK might wrap quota error in RetryError
        const isRateLimited =
            error.statusCode === 429 ||
            error.status === 429 ||
            error.message?.includes('429') ||
            error.message?.includes('quota') ||
            (error.errors && error.errors.some((e: any) => e.statusCode === 429 || e.message?.includes('429')));

        if (isRateLimited && process.env.GOOGLE_GENERATIVE_AI_API_KEY_SECONDARY) {
            console.log('Primary API rate-limited or quota exceeded, attempting fallback to secondary key...');
            try {
                const result = await callAi(googleSecondary);
                return result.toDataStreamResponse();
            } catch (secError: any) {
                console.error('Secondary API also failed:', secError);
                throw secError;
            }
        }
        console.error('Chat API error:', error);
        throw error;
    }
}
