import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fightingSpirit = {
  variable: "--font-fighting-spirit",
  url: "https://fonts.cdnfonts.com/css/fighting-spirit",
};

export const metadata: Metadata = {
  title: "FakerPK",
  description: "Faiq Khan's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fightingSpirit.variable} antialiased bg-black`}
      >
        <div className="h-screen w-screen">
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-white text-5xl font-fighting-spirit">Faker</h1>
              <h1 className="text-orange-500 text-5xl font-fighting-spirit">PK</h1>
              <p className="text-white text-lg">Faiq Khan</p>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-screen h-screen bg-starry-night" />
          {children}
        </div>
      </body>
    </html>
  );
}