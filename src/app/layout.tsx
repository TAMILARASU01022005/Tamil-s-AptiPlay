import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ReactLenis } from "lenis/react";
import "./globals.css";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Providers } from "./providers";

// Lazy load heavy components

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  other: {
    "google-adsense-account": siteConfig.adsenseId,
  },

  title: {
    default:
      "Capgemini & Cognizant Game-Based Aptitude Practice",
    template: "%s | Blync Cognitive Games",
  },

  description: siteConfig.description,
  keywords: [...siteConfig.keywords],

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    title: "Capgemini & Cognizant Game-Based Aptitude Practice | Blync",
    description:
      "Free game-based aptitude practice for Capgemini & Cognizant. Play Switch, Digit, Grid, Motion, Spacio, Inductive & Deductive challenges with full solutions.",
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "AptiPlay – Game-Based Placement Aptitude Practice",
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Capgemini & Cognizant Placement Games | Blync",
    description:
      "Crack Capgemini & Cognizant game-based rounds using Blync cognitive games. Real exam-style practice.",
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/Efilliks.jpeg",
    apple: "/Efilliks.jpeg",
  },
};

// ✅ STRUCTURED DATA (JSON-LD)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: "Capgemini & Cognizant Placement Games",
  url: siteConfig.url,
  description:
    "Free platform for practicing game-based cognitive aptitude tests used in Capgemini, Cognizant & other campus placements.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.shortName,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.ogImage}`,
  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Aptiplay Cognitive Placement Games",
  url: siteConfig.url,
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  description:
    "Interactive game-based aptitude practice platform for placement preparation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google AdSense */}
        <Script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* ✅ Google Analytics config */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${siteConfig.analyticsId}', {
        page_path: window.location.pathname,
      });`}
        </Script>

        {/* ✅ Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={siteConfig.umamiId}
          strategy="afterInteractive"
        />

        {/* ✅ STRUCTURED DATA */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="schema-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />

        {/* ✅ PERFORMANCE */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>

      <body className="bg-white/50 relative">
        {/* The Gradient Approximation Element */}
        <div className="absolute top-0 left-0 w-full h-[1000px] opacity-40 mix-blend-multiply pointer-events-none overflow-hidden">
          {/* Pink/Red Blob */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-[#FF6B6B]/50 rounded-full blur-3xl"
            style={{ filter: "blur(100px)", transform: "translate(-20%, -20%)" }}
          ></div>
          {/* Blue/Cyan Blob */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-[#4F46E5]/50 rounded-full blur-3xl"
            style={{ filter: "blur(100px)", transform: "translate(20%, -20%)" }}
          ></div>
        </div>

        <Providers>
          <ReactLenis root>
            <main>{children}</main>
          </ReactLenis>
        </Providers>
      </body>
    </html>
  );
}
