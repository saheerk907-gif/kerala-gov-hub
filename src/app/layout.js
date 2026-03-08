import './globals.css';
import Navbar from '@/components/Navbar';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

const BASE_URL = 'https://keralaemployees.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Kerala Government Employees Portal | keralaemployees.in',
    template: '%s | Kerala Employees',
  },
  description:
    'MEDISEP scheme, pension calculator, service rules, salary calculators, government orders, and departmental tests for Kerala government employees.',
  keywords:
    'Kerala government employees, MEDISEP, Kerala pension, Kerala service rules, GPF, NPS, PRC calculator, government orders, departmental tests',
  authors: [{ name: 'Kerala Employees', url: BASE_URL }],
  creator: 'Kerala Employees',
  publisher: 'Kerala Employees',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ml_IN',
    url: BASE_URL,
    siteName: 'Kerala Employees',
    title: 'Kerala Government Employees Portal',
    description:
      'MEDISEP, pension, service rules, salary calculators, and government orders for Kerala government employees.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala Government Employees Portal',
    description: 'MEDISEP, pension, salary calculators, and government orders for Kerala government employees.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Malayalam:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-malayalam bg-[#121416] text-white antialiased overflow-x-hidden min-h-screen">
        <GoogleAnalytics />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
