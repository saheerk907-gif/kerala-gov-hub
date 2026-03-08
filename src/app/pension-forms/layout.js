import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Pension Forms — PRISM Kerala (24 Official Forms)',
  description: 'Download all 24 official Kerala pension forms from PRISM — Form 2, 4B, 5, 6, 8, 11, Commutation Forms A–E, and more. Finance Department, Government of Kerala.',
  path: '/pension-forms',
  keywords: ['Kerala pension forms', 'PRISM pension forms download', 'Form 2 pension Kerala', 'pension application form Kerala', 'DCRG gratuity form', 'family pension nomination form'],
});

export default function Layout({ children }) { return children; }
