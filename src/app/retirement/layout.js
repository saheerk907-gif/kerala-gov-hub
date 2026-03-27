import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Retirement Calculator — Kerala Government Employees',
  description: 'Calculate your retirement date, countdown, LPR start date, monthly pension, DCRG and leave encashment. Supports both pension and NPS subscribers.',
  path: '/retirement',
  keywords: ['retirement calculator Kerala', 'Kerala government retirement date', 'pension calculator Kerala', 'DCRG calculator', 'LPR leave preparatory to retirement', 'NPS retirement Kerala'],
});

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kerala Retirement Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://keralaemployees.in/retirement',
  description:
    'Calculate retirement date, LPR start date, monthly pension and DCRG for Kerala government employees. Supports traditional pension and NPS.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the retirement age for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'കേരള സർക്കാർ ജീവനക്കാർക്ക് Retirement Age 56 വർഷം ആണ്. Superannuation Retirement-ൽ (Teachers etc.) 56 വർഷം തികയുന്നതിന് ശേഷമുള്ള Academic Term-ന്റെ അവസാനം (March 31 or May 31) ആണ് Retirement Date. മറ്റ് ജീവനക്കാർ ജനന മാസത്തിന്റെ അവസാന ദിവസം Retire ആകും.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is LPR (Leave Preparatory to Retirement)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leave Preparatory to Retirement (LPR) എന്നത് Retirement-ന് തൊട്ടുമുൻപ് Earned Leave ആയി വാങ്ങുന്ന അവകാശ അവധിയാണ്. Maximum 300 ദിവസം LPR ആയി എടുക്കാം. LPR Start Date = Retirement Date − Earned Leave Balance Days.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is the retirement date calculated when born on the 1st of a month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ജനനം മാസത്തിന്റെ 1-ആം തീയ്യതിയാണെങ്കിൽ, Retirement Date അതിന് ഒരു മാസം മുൻപുള്ള മാസത്തിന്റെ അവസാന ദിവസം ആണ് കണക്കാക്കും. ഉദാഹരണം: 01/06/1968 ജനിച്ചവർ 31/05/2024-ൽ Retire ആകും.',
      },
    },
    {
      '@type': 'Question',
      name: 'What benefits does a Kerala government employee get on retirement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Retirement-ൽ ലഭിക്കുന്ന ആനുകൂല്യങ്ങൾ: (1) Monthly Pension — Basic Pension + DA, (2) DCRG — Lump sum, maximum ₹14,00,000, (3) Leave Encashment — Surrendered Earned Leave-ന്റെ Salary, (4) Commutation — Pension-ന്റെ 40% വരെ Lump Sum ആയി, (5) Group Insurance maturity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between traditional pension and NPS at retirement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '2013 January 1-ന് മുൻപ് Join ചെയ്തവർ Traditional Pension Scheme-ൽ ആണ്: Fixed Monthly Pension, DCRG, Family Pension ഉണ്ട്. 2013-ന് ശേഷം Join ചെയ്തവർ NPS-ൽ ആണ്: Retirement-ൽ Corpus-ന്റെ 60% Tax-free ആയി withdraw ചെയ്യാം; 40% Annuity ആയി Monthly Income ലഭിക്കും.',
      },
    },
  ],
};

export default function RetirementLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
