import Footer from '@/components/Footer';

const LAST_UPDATED = 'March 2026';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: [
      'Kerala Gov Employee Hub does not require you to create an account or provide personal information to use any feature of this site.',
      'We may automatically collect non-personally identifiable information such as browser type, device type, pages visited, time spent on pages, and referring URLs. This data is collected in aggregate form only and cannot be used to identify you personally.',
      'If you use our contact form, we collect the name, email address, and message content you voluntarily provide. This information is used solely to respond to your query.',
    ],
  },
  {
    title: '2. Cookies',
    content: [
      'We use a single localStorage key ("theme") to remember your light/dark mode preference. This data never leaves your device and is not transmitted to any server.',
      'Google Analytics (see Section 3) may set cookies to measure site traffic. These cookies are governed by Google\'s own Privacy Policy.',
      'We do not use advertising cookies, tracking pixels, or third-party profiling cookies.',
    ],
  },
  {
    title: '3. Google Analytics',
    content: [
      'This site uses Google Analytics 4 to understand how visitors use the site. Analytics data is anonymised and aggregated — we cannot identify individual users from this data.',
      'Google Analytics may collect information such as your IP address (anonymised), device type, browser, and pages visited.',
      'You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on available at tools.google.com/dlpage/gaoptout.',
    ],
  },
  {
    title: '4. How We Use Information',
    content: [
      'Contact form submissions are used exclusively to reply to your query and are not shared with third parties.',
      'Aggregated analytics data is used to improve site content and user experience.',
      'We do not sell, rent, trade, or otherwise transfer your personal information to any outside party.',
    ],
  },
  {
    title: '5. Third-Party Links',
    content: [
      'This site contains links to official government portals (e.g., spark.gov.in, treasury.kerala.gov.in) and other external websites. Once you leave keralaemployees.in, we have no control over those sites and are not responsible for their privacy practices.',
      'We encourage you to review the privacy policy of any external site you visit.',
    ],
  },
  {
    title: '6. Children\'s Privacy',
    content: [
      'This site is intended for Kerala government employees and is not directed at children under 13 years of age. We do not knowingly collect personal information from children.',
    ],
  },
  {
    title: '7. Data Security',
    content: [
      'We take reasonable precautions to protect the information submitted through our contact form. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      'Contact form data is processed by Formspree, a third-party form service, which has its own privacy and security policies.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated "Last Updated" date. Continued use of the site after changes constitutes acceptance of the revised policy.',
    ],
  },
  {
    title: '9. Contact',
    content: [
      'If you have questions about this Privacy Policy, please contact us at hello@keralaemployees.in or through our Contact page.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-[760px] mx-auto">

          {/* Header */}
          <div className="mb-10">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Legal</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white/90 mb-3">Privacy Policy</h1>
            <p className="text-[13px] text-white/35">Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Intro */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-[14px] text-white/65 leading-relaxed">
              Kerala Gov Employee Hub (&ldquo;<strong className="text-white/80">we</strong>&rdquo;, &ldquo;<strong className="text-white/80">us</strong>&rdquo;, or &ldquo;<strong className="text-white/80">our</strong>&rdquo;) operates{' '}
              <strong className="text-white/80">keralaemployees.in</strong>. This Privacy Policy explains what information we collect when you visit this site, how we use it, and the choices you have. By using this site, you agree to the practices described here.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4">
            {SECTIONS.map((s) => (
              <div key={s.title} className="glass-card rounded-2xl p-6">
                <h2 className="text-[13px] font-bold text-white/80 mb-3">{s.title}</h2>
                <div className="flex flex-col gap-2">
                  {s.content.map((para, i) => (
                    <p key={i} className="text-[13px] text-white/55 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-[12px] text-white/25 text-center">
            For any privacy-related concerns, email us at{' '}
            <a href="mailto:hello@keralaemployees.in" className="text-white/40 hover:text-white/70 transition-colors">
              hello@keralaemployees.in
            </a>
          </p>

        </div>
      </div>
      <Footer />
    </div>
  );
}
