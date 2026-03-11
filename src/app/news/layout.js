export const metadata = {
  title: 'വാർത്തകൾ — Kerala Government Employee News',
  description: 'Latest news and announcements for Kerala government employees — DA orders, pay revision, MEDISEP updates, pension circulars, bonus orders and more.',
  keywords: 'Kerala government employee news, DA order Kerala, MEDISEP news, pension news Kerala, pay revision news, bonus order Kerala, government circular Kerala, Kerala employees latest news',
  alternates: { canonical: 'https://keralaemployees.in/news' },
  openGraph: {
    title: 'വാർത്തകൾ — Kerala Government Employee News',
    description: 'Latest news and announcements for Kerala government employees.',
    url: 'https://keralaemployees.in/news',
    images: [{ url: 'https://keralaemployees.in/og-image.png', width: 1200, height: 630, alt: 'Kerala Employees News' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'വാർത്തകൾ — Kerala Government Employee News',
    description: 'Latest news and announcements for Kerala government employees.',
    images: [{ url: 'https://keralaemployees.in/og-image.png' }],
  },
};

export default function NewsLayout({ children }) {
  return children;
}
