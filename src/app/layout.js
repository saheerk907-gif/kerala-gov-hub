import './globals.css';
import { Plus_Jakarta_Sans, Noto_Sans_Malayalam } from 'next/font/google';
import Navbar from '@/components/Navbar';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  display: 'swap',
  variable: '--font-noto-malayalam',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const BASE_URL = 'https://keralaemployees.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Kerala Government Employees Portal – KSR Rules, MEDISEP, Pension, GOs & Calculators',
    template: '%s | Kerala Employees',
  },
  description:
    'കേരള സർക്കാർ ജീവനക്കാർക്കുള്ള സമഗ്ര പോർട്ടൽ. KSR ചട്ടങ്ങൾ, MEDISEP, പെൻഷൻ വിവരങ്ങൾ, സർക്കാർ ഉത്തരവുകൾ, ശമ്പള കണക്കുകൂട്ടൽ — എല്ലാം ഒരിടത്ത്. Kerala Service Rules, pension calculator, GPF, departmental tests & government orders.',
  keywords:
    'Kerala government employees, കേരള സർക്കാർ ജീവനക്കാർ, MEDISEP, Kerala pension calculator, KSR rules, Kerala service rules, GPF, NPS, APS, PRC calculator, government orders Kerala, departmental tests Kerala, pension forms Kerala, DCRG calculator',
  authors: [{ name: 'Kerala Employees', url: BASE_URL }],
  creator: 'Kerala Employees',
  publisher: 'Kerala Employees',
  robots: { index: true, follow: true },
  themeColor: '#121416',
  openGraph: {
    type: 'website',
    locale: 'ml_IN',
    url: BASE_URL,
    siteName: 'Kerala Employees',
    title: 'Kerala Government Employees Portal – KSR, MEDISEP, Pension & Calculators',
    description:
      'കേരള സർക്കാർ ജീവനക്കാർക്കുള്ള സമഗ്ര പോർട്ടൽ. KSR ചട്ടങ്ങൾ, MEDISEP, പെൻഷൻ, സർക്കാർ ഉത്തരവുകൾ, ശമ്പള കണക്കുകൂട്ടൽ.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Kerala Government Employees Portal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala Government Employees Portal – KSR, MEDISEP, Pension & Calculators',
    description:
      'KSR ചട്ടങ്ങൾ, MEDISEP, പെൻഷൻ കാൽക്കുലേറ്റർ, സർക്കാർ ഉത്തരവുകൾ — കേരള ജീവനക്കാർക്കുള്ള സമഗ്ര പോർട്ടൽ.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml" className={`${plusJakarta.variable} ${notoMalayalam.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1165010251713055"
          crossOrigin="anonymous"
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
      <body className="font-sans bg-[#121416] text-white antialiased overflow-x-hidden min-h-screen">
        <GoogleAnalytics />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
