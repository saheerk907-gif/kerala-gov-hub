import dynamic from 'next/dynamic';

const HolidayListClient = dynamic(() => import('./HolidayListClient'), { ssr: false });

export const metadata = {
  title: 'Kerala Govt Holiday List 2026 — Kerala Gov Employee Hub',
  description: 'Complete list of Kerala Government holidays 2026 with iCal export for Google Calendar and Apple Calendar.',
};

export default function HolidayListPage() {
  return <HolidayListClient />;
}
