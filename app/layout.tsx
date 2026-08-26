import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { INLINE_NO_FLASH_SCRIPT } from "@/lib/theme"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://fakerpk.vercel.app"),
  title: "FakerPK™ — Backend & Automations Developer",
  description:
    "Websocket fleets, multi-connection proxy pools, and node management that stays online. Built for uptime, monitored end to end.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "FakerPK™ — Backend & Automations Developer",
    description:
      "Websocket automation, proxy pools, and node management that runs itself. View my work and collaborate.",
    url: "https://fakerpk.vercel.app",
    siteName: "FakerPK",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "FakerPK Portfolio Thumbnail",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FakerPK™ — Backend & Automations Developer",
    description: "Websocket automation, proxy pools, and node management that runs itself.",
    images: ["/thumbnail.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INLINE_NO_FLASH_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
      <Analytics />
    </html>
  )
}
