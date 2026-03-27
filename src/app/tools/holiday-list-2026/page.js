import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const HolidayListClient = dynamic(() => import('./HolidayListClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'Kerala Holiday List 2026 — Government Employees',
  description: 'Complete list of public holidays and optional holidays for Kerala government employees in 2026. Download printable holiday calendar.',
  path: '/tools/holiday-list-2026',
  keywords: ['Kerala holiday list 2026', 'Kerala government holidays 2026', 'Kerala public holidays 2026'],
});

export default function HolidayListPage() {
  return <HolidayListClient />;
}
