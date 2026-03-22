/**
 * Reusable SEO metadata builder for keralaemployees.in
 * Usage: export const metadata = buildMetadata({ title, description, path, image })
 */

const BASE_URL = 'https://keralaemployees.in';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'Kerala Employees';

export function buildMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = [],
}) {
  const fullTitle = title
    ? `${title} | Kerala Employees`
    : 'Kerala Government Employees Portal | keralaemployees.in';

  const canonical = `${BASE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'Kerala government employees',
      'Kerala government servants',
      'Kerala service rules',
      'MEDISEP',
      'Kerala pension',
      ...keywords,
    ].join(', '),
    metadataBase: new URL(BASE_URL),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type,
      locale: 'ml_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

/** Organization JSON-LD for homepage */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kerala Employees',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    'Information portal for Kerala government employees — MEDISEP, pension, service rules, salary calculators, and government orders.',
  sameAs: [],
};

/** Website JSON-LD for homepage */
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kerala Employees',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/news?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

/** Build Article JSON-LD for news detail pages */
export function buildArticleJsonLd({ title, description, url, image, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url,
    image: image ? [image] : [],
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: 'Kerala Employees', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Kerala Employees',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/kerala-coat-of-arms.png` },
    },
    inLanguage: 'ml',
  };
}
