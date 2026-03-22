export const metadata = {
  title: 'Articles — Kerala Government Employees | KSR, MEDISEP, Pension, GPF',
  description: 'ലേഖനങ്ങൾ — Kerala government employee articles on MEDISEP, pension, KSR service rules, GPF, NPS, DA, pay revision and benefits. In Malayalam and English.',
  keywords: 'Kerala employees articles, MEDISEP articles Malayalam, pension articles Kerala, KSR service rules articles, GPF articles, NPS articles Kerala, DA allowance Kerala, Kerala government employee news',
  alternates: { canonical: 'https://keralaemployees.in/articles' },
  openGraph: {
    title: 'Articles — Kerala Government Employees Portal',
    description: 'Kerala government employee articles on MEDISEP, pension, KSR, GPF, NPS and more.',
    url: 'https://keralaemployees.in/articles',
    images: [{ url: 'https://keralaemployees.in/og-image.png', width: 1200, height: 630, alt: 'Kerala Employees Articles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles — Kerala Government Employees Portal',
    description: 'Kerala government employee articles on MEDISEP, pension, KSR, GPF, NPS and more.',
    images: [{ url: 'https://keralaemployees.in/og-image.png' }],
  },
};

export default function ArticlesLayout({ children }) {
  return children;
}
