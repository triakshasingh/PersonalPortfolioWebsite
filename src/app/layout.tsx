import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import Nav from "@/components/Nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://triaksha.dev/#person",
      name: "Triaksha Singh",
      jobTitle: "Electrical & Computer Engineering Student",
      description:
        "ECE student at University of Washington specializing in AI systems, quantitative infrastructure, embedded hardware, and ML-powered health tech.",
      url: "https://triaksha.dev",
      email: "tsingh05@uw.edu",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Washington",
        url: "https://www.washington.edu",
      },
      sameAs: [
        "https://github.com/triakshasingh",
        "https://www.linkedin.com/in/triakshasingh/",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Quantitative Finance",
        "Embedded Systems",
        "Systems Programming",
        "Robotics",
        "Computer Vision",
        "Health Technology",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Allbritton Bioengineering Lab, University of Washington",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://triaksha.dev/#website",
      url: "https://triaksha.dev",
      name: "Triaksha Singh — Portfolio",
      description:
        "Portfolio of Triaksha Singh, ECE @ UW, specializing in AI systems engineering, quantitative infrastructure, and embedded systems.",
      publisher: { "@id": "https://triaksha.dev/#person" },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Triaksha Singh | Systems & Quant Engineering",
    template: "%s | Triaksha Singh",
  },
  description:
    "ECE @ University of Washington. Building at the intersection of ML systems, quantitative engineering, and robotics. Open to Summer 2026 internships.",
  keywords: [
    "Triaksha Singh",
    "ECE",
    "Electrical Computer Engineering",
    "University of Washington",
    "UW",
    "AI Systems",
    "Quant infrastructure",
    "Quantitative Engineering",
    "Quant",
    "Embedded Systems",
    "Machine Learning",
    "Health Tech",
    "Software Engineering",
    "Systems Programming",
    "Robotics",
    "Portfolio",
    "SWE Intern",
    "Quant Research",
  ],
  authors: [{ name: "Triaksha Singh", url: "https://triaksha.dev" }],
  creator: "Triaksha Singh",
  metadataBase: new URL("https://triaksha.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://triaksha.dev",
    siteName: "Triaksha Singh — Portfolio",
    title: "Triaksha Singh | Systems & Quant Engineering",
    description:
      "Portfolio of Triaksha Singh — ML systems, quant engineering, robotics control, and bioengineering research. ECE @ UW.",
    // OG image: add opengraph-image.png (1200×630) to /app or use dynamic route /opengraph-image.tsx
    // images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Triaksha Singh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Triaksha Singh | Systems & Quant Engineering",
    description:
      "ML systems, quant engineering, robotics, and bioengineering research. ECE @ University of Washington.",
    creator: "@triaksha", // [PLACEHOLDER: Update with your Twitter handle]
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
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0A0F] text-[#F8F8FF] antialiased">
        <ToastProvider>
          <Nav />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
