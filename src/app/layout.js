import './globals.css';
import { IBM_Plex_Mono, Noto_Sans_Malayalam } from 'next/font/google';
import dynamic from 'next/dynamic';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// ── Fonts ─────────────────────────────────────────────────────────────────────
// display:'optional' — browser gets 100ms, then uses system font permanently.
// IBM Plex Mono is only for code/mono text — never worth blocking paint for.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '700'],
});

// Malayalam font — 3 weights: 400 body, 700 subheads, 900 headlines.
// display:'swap' — browser renders with system Malayalam font first,
// then swaps when Noto loads. Critical for body-text readability.
// adjustFontFallback trims the layout shift on swap.
const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  display: 'swap',
  variable: '--font-noto-malayalam',
  weight: ['400', '700', '900'],
  preload: true,
  adjustFontFallback: true,
});

// ── Lazy-hydrate heavy layout components ─────────────────────────────────────
// Navbar: SSR=true so nav links are in HTML (SEO + accessibility preserved),
// but JS chunk is code-split → doesn't block initial hydration.
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true });

// ScrollToTop: pure UI enhancement, zero SEO value — defer entirely.
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
  loading: () => null,
});

const BASE_URL = 'https://keralaemployees.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Kerala Employees Portal – Salary, DA, Pension Updates',
    template: '%s | Kerala Employees',
  },
  description:
    'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.',
  keywords:
    'Kerala government employees, കേരള സർക്കാർ ജീവനക്കാർ, MEDISEP, Kerala pension calculator, KSR rules, Kerala service rules, GPF, NPS, APS, PRC calculator, government orders Kerala, departmental tests Kerala, pension forms Kerala, DCRG calculator',
  authors: [{ name: 'Kerala Employees', url: BASE_URL }],
  creator: 'Kerala Employees',
  publisher: 'Kerala Employees',
  robots: { index: true, follow: true },
  themeColor: '#121416',
  alternates: { canonical: BASE_URL },
  icons: { icon: '/logo.webp', apple: '/logo.webp' },
  openGraph: {
    type: 'website',
    locale: 'ml_IN',
    url: BASE_URL,
    siteName: 'Kerala Employees',
    title: 'Kerala Employees Portal – Salary, DA, Pension Updates',
    description:
      'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Kerala Government Employees Portal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala Employees Portal – Salary, DA, Pension Updates',
    description:
      'DA arrears, pension rules, MEDISEP, salary tools & calculators for Kerala government employees.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml" className={`${ibmPlexMono.variable} ${notoMalayalam.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/*
          Explicit preload for LCP image — tells browser to fetch it at highest
          priority before it even parses the page body. next/image priority prop
          adds this too, but explicit <link> fires earlier in the waterfall.
        */}
        <link
          rel="preload"
          as="image"
          href="/kerala-secretariat-opt.webp"
          fetchPriority="high"
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#121416] text-white antialiased overflow-x-hidden min-h-screen">
        <GoogleAnalytics />
        <Navbar />
        <main>{children}</main>
        <ScrollToTop />
      </body>
    </html>
  );
}
