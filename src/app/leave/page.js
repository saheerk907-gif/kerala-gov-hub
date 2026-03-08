import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeaveCalculator from '@/components/LeaveCalculator';

export const metadata = {
  title: 'Earned Leave Calculator — Kerala Service Rules (KSR) | Kerala Government Employees',
  description:
    'Calculate Earned Leave (EL) for Kerala government employees as per KSR Part I. Supports permanent, temporary, vacation department and limited-period officers. Includes KSR FAQ on Maternity Leave, Casual Leave, Half-Pay Leave, Subsistence Allowance, and more.',
  alternates: { canonical: 'https://keralaemployees.in/leave' },
  keywords:
    'earned leave calculator Kerala, KSR leave rules, Kerala Service Rules leave, EL calculation Kerala, casual leave Kerala, maternity leave Kerala, half pay leave KSR, leave preparatory to retirement, vacation department leave, temporary employee leave Kerala',
  openGraph: {
    title: 'Earned Leave Calculator — Kerala Service Rules (KSR)',
    description:
      'Accurately calculate Earned Leave under KSR Part I for permanent, temporary, vacation-department, and contract employees. With comprehensive KSR FAQ.',
    url: 'https://keralaemployees.in/leave',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earned Leave Calculator — KSR Kerala',
    description: 'EL calculation as per Kerala Service Rules Part I — all categories covered.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is Earned Leave (EL) calculated for Kerala Government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Earned leave for permanent officers is calculated at 1/11th of the period spent on duty as per KSR Part I. The maximum accumulation is 300 days. The maximum grant at one time is 180 days (300 days for Leave Preparatory to Retirement).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the earned leave rate for temporary government employees in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Temporary/officiating officers earn leave at 1/22nd of the duty period for the first 3 years of service. After completing 3 years of continuous service, they earn at the same rate as permanent officers — 1/11th of the duty period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is earned leave calculated for vacation department employees in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If full vacation is availed, no earned leave is admissible. If partial vacation is availed, earned leave = (days of vacation not taken ÷ full vacation) × 30. If no vacation is availed, normal 1/11 rule applies.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Age of Compulsory Retirement under the Kerala Service Rules?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generally, compulsory retirement takes effect from the afternoon of the last day of the month in which an officer attains 56 years. Exceptions include Medical Education Service doctors and Ayurveda/Homoeopathy college teaching staff, who retire at 60.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many days of Maternity Leave are allowed under KSR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A female officer may be granted maternity leave on full pay for 180 days from the date of commencement. This is admissible to both permanent and temporary female officers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many days of Casual Leave are allowed under Kerala Service Rules?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generally, no officer may be absent on casual leave for more than 20 days in a calendar year. Teaching staff of educational institutions are limited to 15 days of casual leave per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is Half-Pay Leave calculated under KSR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Half-pay leave admissible to a permanent officer is 20 days for each completed year of service. Commuted leave not exceeding half the amount of half-pay leave due may also be granted; twice the commuted leave is debited from half-pay leave.',
      },
    },
    {
      '@type': 'Question',
      name: 'What subsistence allowance is paid during suspension of a Kerala government employee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A suspended officer is entitled to a subsistence allowance equal to the leave salary they would have drawn on half-pay leave on the date of suspension, plus applicable Dearness Allowance.',
      },
    },
  ],
};

export default function LeavePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
            <span>›</span>
            <a href="/ksr" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Kerala Service Rules</a>
            <span>›</span>
            <span className="text-[#64d2ff]">Earned Leave Calculator</span>
          </div>

          <LeaveCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
