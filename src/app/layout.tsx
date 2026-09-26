import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import ChatAssistant from "@/components/ChatAssistant";
import { Mukta, Playfair_Display, Noto_Serif_Devanagari } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/site/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const body = Mukta({ subsets: ["latin", "devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const display = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const devanagari = Noto_Serif_Devanagari({ subsets: ["devanagari"], weight: ["500", "600", "700"], variable: "--font-devanagari" });

export const metadata: Metadata = {
  metadataBase: new URL('https://jainroutes.com'),
  title: "Khanra Travel | Plan Your Tirth Yatra",
  description: "Share, discover, and plan detailed Khanra Travel. Complete guides including Dharmshala and Bhojanshala information.",
  keywords: ["Jain", "Tirth", "Yatra", "Routes", "Itinerary", "Pilgrimage", "Dharmshala", "Bhojanshala", "Jainism", "Darshan"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Khanra Travel | Plan Your Tirth Yatra",
    description: "Share, discover, and plan detailed Khanra Travel. Complete guides including Dharmshala and Bhojanshala information.",
    url: "https://jainroutes.com",
    siteName: "Khanra Travel",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Khanra Travel Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(body.variable, display.variable, devanagari.variable)}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F2MGPTFDDH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-F2MGPTFDDH');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <ChatAssistant />
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
