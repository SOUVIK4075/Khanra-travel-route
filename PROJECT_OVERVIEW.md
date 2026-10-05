# Khanra Travel — Project Overview

> Yeh document poore project ko samajhne ke liye hai: project kyun bana, website mein kya-kya features hain, aur abhi project kis haal mein hai.
>
> Last updated: 28 September 2026

---

## 1. Project ka main objective

**Khanra Travel ek Tirth Yatra planning website hai.** Iska maqsad hai ki koi bhi yatri bina bhatke, aaram se aur surakshit tarike se apni dharmik yatra plan kar sake.

Aam taur par tirth yatra ki jaankari WhatsApp messages, PDFs aur logon ki yaadon mein bikhri hoti hai: kaunsa mandir kahan hai, raat kahan rukein (Dharmshala), khana kahan milega (Bhojanshala), agla stop kitna door hai. Yeh website us sab ko **ek jagah, searchable aur shareable** bana deti hai.

**Teen core goals:**

1. **Ready-made routes dena:** din-wise (Day 1, Day 2...) itineraries, jisme har stop ka map, facilities aur directions ho.
2. **Har jagah ki jaankari dena:** Places Directory, jisme har tirth ya mandir ka location, contact number aur kaise pahunchein, sab ho.
3. **Community se seekhna:** jo yatri yatra kar chuke hain, woh apna route submit karein taaki doosron ko madad mile ("Earn Punya by Guiding Others").

Shuruaat mein yeh project sirf **Jain Tirthon** ke liye tha (original project "Jain Routes"). Ab ise **Khanra Travel** naam se rebrand kiya gaya hai aur isme **West Bengal ke Jain tirth aur Hindu mandir** bhi jode gaye hain.

---

## 2. Website ke saare features

### 2.1 Home page (`/`)

| Feature | Kya karta hai |
|---|---|
| **Hero section** | "Jai Jagannath 🙏" badge, website ka title aur ek line ka parichay |
| **Search** | Tirth ya jagah ka naam likhte hi suggestions aate hain (autocomplete, keyboard se bhi chalta hai) |
| **State filter** | Kisi ek state ke routes dikhata hai |
| **Duration filter** | 1, 2, 3, 4 ya 5+ din ke routes |
| **Featured Itineraries** | Saare routes cards mein; har card par states, kitne din, chhota description, author ka naam aur Instagram |
| **Chaturmaas 2026 banner** | Bengaluru Chaturmaas ke liye PDFs (Karnataka, Tamil Nadu; English + Hindi), Gyanoday Tirth guide aur cab rates ke links |
| **Community Impact** | Kitne tirth covered hain, kitne routes hain, "1000+ yatris" |
| **Welcome popup** | Pehli baar site kholne par Chaturmaas 2026 ki jaankari (ek session mein ek hi baar dikhta hai) |

### 2.2 Itinerary page (`/itinerary/[id]`)

Yeh website ka sabse powerful page hai.

- **Overview table:** ek nazar mein har din ke stops aur raat kahan rukna hai.
- **Day-wise timeline:** har din ke saare stops, har stop par:
  - type (Tirth / Temple / Dharmshala), description, facilities (Dharmshala, Bhojanshala)
  - contact numbers (tap karke call)
  - "Directions" button, jo pichhle stop se is stop tak ka Google Maps route kholta hai
  - "Suggest an Edit" (Google Form)
- **Har din ka embedded map:** poore din ka route Google Maps par dikhata hai. Iske liye API key chahiye, dekho section 4.
- **Start / End location:** apni city ya "📍 My Location" (GPS) daal do, to pehle aur aakhri stop ke directions wahin se banenge.
- **Customize Itinerary:**
  - stops ko upar-neeche karna, ek din se doosre din mein bhejna, hataana aur wapas laana
  - "Apply" dabane par ek **naya share link** banta hai (`?c=...`), jisse doosre bhi wahi customized route dekh sakte hain
- **Share on WhatsApp:** ek click mein route ka link WhatsApp par.
- **Save as PDF / Print:** print ke liye saaf layout; buttons chhup jaate hain, contacts khul jaate hain.

### 2.3 Places Directory (`/directory`)

- **130 jagahein:** 65 Tirth + 65 Temple, 10 states mein, aur 2 Dharmshalas.
- **Search:** naam ya location se.
- **Filters:** state ke hisaab se, aur type ke hisaab se (All / Tirths / Temples / Dharmshalas), har filter par count ke saath.
- **List / Map toggle:** Map view mein saari jagahein Leaflet map par markers ke roop mein.
- **Cards:** type badge, facilities, state aur "View Details".

### 2.4 Tirth / Temple detail page (`/tirth/[id]`) aur Dharmshala page (`/dharmshala/[id]`)

- Naam, state, type badge, Dharmshala aur Bhojanshala hai ya nahi.
- Parichay (intro) aur "About" section.
- **Contact Directory:** phone numbers (tap-to-call). Number na ho to "Suggest an Edit / Add Number" button.
- **Location:** "Open in Google Maps" aur "Directions" button.
- **How to Reach:** nearest airport, railway station aur bus stand.
- **Featured In:** yeh jagah kin itineraries mein aati hai.
- WhatsApp share.

### 2.5 Submit an Itinerary (`/submit`)

Community ke liye apna route bhejne ka form:

- **Do tarah ke form:**
  - **Detailed Form:** din-wise stops, har stop ka type, facilities, description aur maps link
  - **Quick Outline:** bas free-text mein poora route likh do
- **Place autocomplete:** stop ka naam likhte hi directory ki jagah suggest hoti hai aur uski details apne aap bhar jaati hain.
- **Auto-save draft:** form browser mein save hota rehta hai; page band ho jaaye to bhi data wapas aa jaata hai. "Clear Draft" ka option bhi hai.
- **Submit:** email app khulta hai jisme poori jaankari (JSON ke saath) **khanrasouvik112@gmail.com** ko jaati hai. Email app na khule to text copy karne ka fallback hai.

### 2.6 Chaturmaas Cabs (`/chaturmas-cabs`)

- Bengaluru Chaturmaas 2026 yatriyon ke liye **5 cab operators** ki negotiated rates: Bhushan Jain, Rakesh, Sriniwas, Laxmi, Aishwarya Cabs.
- Har gaadi (Etios, Innova Crysta, Ertiga, Tempo Traveller...) ki rate per km aur bata (bhatta) per day.
- Seat ke hisaab se filter (4 / 6-7 / 12 seater), tap-to-call aur PDF download.
- **English aur Hindi** dono mein (`?lang=hi`).

### 2.7 Gyanoday Travel Guide (`/gyanoday-travel-guide`)

- Shri Gyanoday Digambar Jain Temple, Bengaluru tak kaise pahunchein.
- 7 arrival points chun sakte ho: Airport, KR Puram, SMVT, Majestic, Yesvantpur, Cantonment aur Bus Stand. Har ek ke liye doori, travel options aur tips.
- English + Hindi, Google Maps link aur PDF.

### 2.8 Khanra Travel AI (chat assistant)

- Har page ke kone mein saffron chat button hai.
- Google Gemini AI par chalta hai. Ise website ke **saare 12 itineraries aur 130 jagahon** ka data diya gaya hai, aur yeh sirf isi verified data se jawab deta hai.
- "Jai Jagannath! 🙏" se shuru karta hai, aur jis bhasha mein sawaal poocha jaaye (Bangla, Hindi, English) usi mein jawab deta hai.
- Jawab mein itinerary aur place pages ke links aur Google Maps links hote hain.
- Primary API key ki limit khatam hone par secondary key par switch kar sakta hai.

### 2.9 Design aur baaki features

- **Heritage design:** saffron, gold aur maroon rang, mandala pattern, serif headings.
- **Dark mode:** header mein 🌙/☀️ button; default mein phone ki setting follow karta hai.
- **Mobile friendly:** chhoti screen par menu slide-out ban jaata hai.
- **PWA manifest:** phone par "Add to Home Screen" ho sakta hai.
- **SEO:** har page ka apna title aur description, WhatsApp/Facebook link preview.
- **404 page:** galat link par sundar error page.

---

## 3. Data — website mein kya-kya jaankari hai

| Data | File | Kitna |
|---|---|---|
| Itineraries (routes) | `src/data/itineraries.json` | **12 routes**, 33 din, 158 stops |
| Places (Tirth + Temple) | `src/data/tirths.json` | **130 jagahein** |
| Dharmshalas | `src/data/dharmshalas.json` | 2 |
| Cab rates | `src/data/cabs.ts` | 5 operators, 27 rate rows |
| PDFs | `public/pdfs/` | Karnataka, Tamil Nadu, Gyanoday guide (EN + HI) |

**States ke hisaab se places:** Karnataka 50, West Bengal 27, Tamil Nadu 17, Madhya Pradesh 16, Bihar 9, Telangana 4, Jharkhand 3, Andhra Pradesh 2, Chhattisgarh 1, Maharashtra 1.

**Itineraries kin states ki:** Karnataka (8), Telangana (2), Tamil Nadu, Madhya Pradesh, Maharashtra, Andhra Pradesh, Jharkhand, Bihar. **West Bengal ka abhi koi itinerary nahi hai**; wahan ki jagahein sirf directory mein hain.

Sab data JSON files mein hai, koi database nahi. Naya route ya jagah jodne ka matlab hai JSON file edit karke push karna (tareeka `add_itinerary.MD` mein likha hai).

---

## 4. Abhi project mein kya ho raha hai (current status)

### ✅ Ho chuka hai

1. **Rebranding:** "Jain Routes" → **Khanra Travel**. Naam, email (khanrasouvik112@gmail.com), saare authors (Souvik Khanra), Instagram (`_yehi_to_hai_`) aur GitHub link badal diye gaye.
2. **West Bengal ki 27 jagahein** jodi gayi: 7 Jain (Kolkata Parasnath Temple, Belgachia, Kathgola, Jagat Seth House, Azimganj–Jiaganj, Pakbirra...) aur 20 Hindu mandir (Dakshineswar, Kalighat, Belur Math, Tarapith, Mayapur ISKCON, Bishnupur, Gangasagar, Digha Jagannath Dham...).
3. **Poora UI redesign:** Next.js 13 → **15**, React 18 → **19**, **Tailwind CSS + shadcn/ui**, heritage theme aur dark mode.
4. **Greeting:** "Jai Jinendra" → **"Jai Jagannath 🙏"** har jagah (home, AI chat, 404, submit email).
5. **AI chat ko West Bengal samet poori directory ka data** diya gaya (pehle sirf itineraries dekhta tha).
6. **Nayi GitHub repo:** https://github.com/SOUVIK4075/Khanra-travel-route. Isme contributor sirf **SOUVIK4075** hai.

### ⏳ Chal raha hai / baaki hai

1. **Vercel par deploy:** website ko public link par live karna. Steps chat mein bataye gaye hain (Vercel → Import repo → Deploy).
2. **API keys daalna** (Vercel → Settings → Environment Variables):
   - `GOOGLE_GENERATIVE_AI_API_KEY`: AI chat ke liye (https://aistudio.google.com/apikey)
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: itinerary ke maps ke liye (Google Cloud Console → Maps Embed API)
   - Optional: `GOOGLE_GENERATIVE_AI_API_KEY_SECONDARY` (backup key), `LOGGING_GOOGLE_SCRIPT_URL` (chat ke sawaal Google Sheet mein save karne ke liye)
3. **AI chat ka live test:** West Bengal wala sawaal dobara poochh kar check karna. Mac par API key nahi hai, isliye abhi tak test nahi hua.

### ⚠️ Dhyan dene wali baatein (known issues)

| # | Baat | Asar | Kya karna chahiye |
|---|---|---|---|
| 1 | **Google Analytics ID (`G-F2MGPTFDDH`)** original developer ka hai (`src/app/layout.tsx`) | Aapki website ke visitors ka data **unke** Google Analytics mein ja raha hai | Apna GA4 property banakar ID badlo, ya hata do |
| 2 | **"Suggest an Edit" Google Form** original developer ka hai | Log jo edits ya numbers suggest karenge, woh **unke** paas jaayenge | Apna Google Form banakar link badlo |
| 3 | **Website address abhi bhi `jainroutes.com`** hai (`metadataBase` in `layout.tsx`) | WhatsApp/Facebook link preview galat domain se image dhoondhega | Vercel link milne par update karna |
| 4 | Directory ka heading **"Jain Places Directory"** hai | Ab Hindu mandir bhi hain, wording purani lagti hai | Heading badalna (optional) |
| 5 | West Bengal ki jagahon mein **phone numbers nahi hain**, aur 8 jagahon ke coordinates approximate hain | "No contact numbers" dikhta hai; map pin thoda idhar-udhar ho sakta hai (Google Maps button phir bhi sahi jagah kholta hai) | Verified numbers aur exact coordinates jodna |
| 6 | Kuch West Bengal jagahon par **"❌ No Dharmshala"** dikhta hai jahan asal mein rukne ki jagah ho sakti hai (jaise Belur Math, Tarapith) | Galat jaankari lag sakti hai | Facilities verify karke `tirths.json` update karna |
| 7 | **Chaturmaas 2026 (Bengaluru)** ka content (banner, popup, cab rates, Gyanoday guide) original project ke event ka hai | Aapke audience ke liye relevant ho ya na ho | Rakhna hai ya hatana hai, decide karna |
| 8 | Code mein **32 lint warnings** (zyadatar `any` types) | Website par koi asar nahi, build pass hota hai | Dheere-dheere saaf karna (optional) |
| 9 | `walkthrough.md` aur `README.md` purane hain | Sirf documentation | Is file (`PROJECT_OVERVIEW.md`) ko main reference maano |

---

## 5. Technology (short mein)

| Cheez | Kya use hua hai |
|---|---|
| Framework | **Next.js 15** (App Router), **React 19**, TypeScript |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (Radix) components, lucide icons |
| Fonts | Playfair Display (headings), Mukta (body + Hindi), Noto Serif Devanagari |
| Maps | Leaflet (directory map), Google Maps Embed API (itinerary maps) |
| AI | Vercel AI SDK + Google Gemini (`/api/chat`) |
| Dark mode | next-themes |
| Hosting | Vercel (planned) |
| Code | GitHub: `SOUVIK4075/Khanra-travel-route` |

**Folder structure (zaroori hisse):**

```
src/
  app/                  → har folder ek page hai
    page.tsx            → Home
    itinerary/[id]/     → Itinerary page
    directory/          → Places Directory
    tirth/[id]/         → Tirth/Temple page
    dharmshala/[id]/    → Dharmshala page
    submit/             → Submit form
    chaturmas-cabs/     → Cab rates
    gyanoday-travel-guide/
    api/chat/route.ts   → AI chat ka backend
  components/           → Header, Footer, cards, chat, maps
    ui/                 → shadcn/ui components (button, card, dialog...)
    site/               → theme toggle, ornament, brand icons
  data/                 → saara content (JSON)
scripts/                → itinerary stops ke lat/lng nikalne wala script
public/pdfs/            → downloadable PDFs
```

**Apne Mac par chalane ke liye:**

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

---

## 6. Aage kya kiya ja sakta hai (ideas)

- West Bengal ke liye ek **ready-made itinerary** (jaise "Kolkata Jain + Kali Temple Darshan, 2 Days" ya "Murshidabad Jain Heritage Yatra").
- Aur states ke Hindu tirth, jaise Puri Jagannath (Odisha), jo "Jai Jagannath" theme ke saath match karega.
- Apna custom domain (jaise `khanratravel.in`) Vercel se jodna.
- Hindi/Bangla mein poori website (abhi sirf cabs aur Gyanoday guide mein Hindi hai).
