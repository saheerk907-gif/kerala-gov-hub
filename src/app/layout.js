import './globals.css';
import { IBM_Plex_Mono, Noto_Sans_Malayalam } from 'next/font/google';
import Navbar from '@/components/Navbar';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ScrollToTop from '@/components/ScrollToTop';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

// Only the weights actually used — was 5 files, now 2 files
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '700'],
});

// Reduced from 7 weights → 3. Drops ~60% of Malayalam font payload.
// preload:true injects <link rel="preload"> so the headline text
// doesn't block FCP waiting for the font response.
const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  display: 'swap',
  variable: '--font-noto-malayalam',
  weight: ['400', '700', '900'],
  preload: true,
});

const BASE_URL = 'https://keralaemployees.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Kerala Employees Portal – Salary, DA, Pension Updates', // 53 chars
    template: '%s | Kerala Employees',
  },
  description:
    'Latest Kerala govt employee updates: DA arrears, pension rules, MEDISEP, salary tools & calculators. Simple, accurate, updated.',
  // Keep description under 160 chars — do not exceed
  keywords:
    'Kerala government employees, കേരള സർക്കാർ ജീവനക്കാർ, MEDISEP, Kerala pension calculator, KSR rules, Kerala service rules, GPF, NPS, APS, PRC calculator, government orders Kerala, departmental tests Kerala, pension forms Kerala, DCRG calculator',
  authors: [{ name: 'Kerala Employees', url: BASE_URL }],
  creator: 'Kerala Employees',
  publisher: 'Kerala Employees',
  robots: { index: true, follow: true },
  themeColor: '#121416',
  alternates: { canonical: BASE_URL },
  icons: {
    icon: '/logo.webp',
    apple: '/logo.webp',
  },
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
        {/* Hint browser to pre-connect to Google Fonts CDN — reduces font TTFB */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
