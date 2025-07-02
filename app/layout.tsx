import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "The AMPD Project | Empowering Creativity in Media and Arts",
  description:
    "The Art, Music, Photography/Film, and Design (AMPD) Project is a veteran-founded 501(c)(3) non-profit organization dedicated to empowering students and veterans through their passion for media and entertainment production.",
  keywords: ["AMPD", "art", "music", "photography", "film", "design", "veterans", "education", "non-profit"],
  authors: [{ name: "AMPD Project" }],
  openGraph: {
    title: "The AMPD Project | Empowering Creativity in Media and Arts",
    description:
      "The Art, Music, Photography/Film, and Design (AMPD) Project is a veteran-founded 501(c)(3) non-profit organization dedicated to empowering students and veterans through their passion for media and entertainment production.",
    url: "https://www.ampdproject.com",
    siteName: "The AMPD Project",
    images: [
      {
        url: "https://www.ampdproject.com/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AMPD Project | Empowering Creativity in Media and Arts",
    description:
      "The Art, Music, Photography/Film, and Design (AMPD) Project is a veteran-founded 501(c)(3) non-profit organization dedicated to empowering students and veterans through their passion for media and entertainment production.",
    images: ["https://www.ampdproject.com/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Q13T53WY1W" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q13T53WY1W');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1773575020259025');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1773575020259025&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
