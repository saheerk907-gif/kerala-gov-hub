import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Government Forms — Kerala Finance Department (65+ Forms)',
  description: 'Download 65+ official government forms for Kerala employees — Pension, GPF, Leave, NPS, GIS, SLI, HBA, KFC, Treasury, and IT forms from Finance Department.',
  path: '/forms',
  keywords: ['Kerala government forms download', 'GPF forms Kerala', 'pension forms Kerala', 'leave forms Kerala', 'HBA forms Kerala', 'treasury forms Kerala', 'NPS forms Kerala'],
});

export default function Layout({ children }) { return children; }
