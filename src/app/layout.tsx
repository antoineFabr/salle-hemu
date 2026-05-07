import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"

const instrumentSans = Instrument_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hemu Booking",
  description: "Book a room at HEMU for training music !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", instrumentSans.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script defer src="https://umami.audiohub.art/script.js" data-website-id="b2844440-ecc8-46f0-87b7-5b241407cdd8"></script>
        <Toaster/>
      </body>
    </html>
  );
}
