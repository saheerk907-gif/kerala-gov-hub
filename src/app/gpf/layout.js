import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'GPF Calculator — General Provident Fund Kerala',
  description: 'Calculate GPF balance, interest, and final payment for Kerala government employees. General Provident Fund rules, nomination, withdrawal guidelines.',
  path: '/gpf',
  keywords: ['GPF calculator Kerala', 'general provident fund Kerala', 'GPF balance Kerala', 'GPF interest rate Kerala', 'GPF withdrawal Kerala'],
});

export default function Layout({ children }) { return children; }
