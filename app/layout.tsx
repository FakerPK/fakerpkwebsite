import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FakerPK's Portfolio",
  description: "FakerPK's Portfolio",
  generator: "v0.app",
  icons: {
    icon: "/icon.png", // transparent background PNG
    shortcut: "/icon.png", // fallback
    apple: "/icon.png", // for iOS devices
  },
  openGraph: {
    title: "FakerPK's Portfolio",
    description: "Check out my work & projects 👨‍💻🔥",
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
    title: "FakerPK's Portfolio",
    description: "Check out my work & projects 👨‍💻🔥",
    images: ["/thumbnail.png"],
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
