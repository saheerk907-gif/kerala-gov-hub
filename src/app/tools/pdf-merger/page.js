import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const PdfMergerClient = dynamic(() => import('./PdfMergerClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'PDF Merger — Combine PDF Files Free Online',
  description: 'Merge multiple PDF files into one online for free. No upload required — 100% browser-based. Ideal for combining Kerala government documents.',
  path: '/tools/pdf-merger',
  keywords: ['PDF merger online', 'combine PDF files', 'merge PDF free', 'browser PDF merger'],
});

export default function PdfMergerPage() {
  return <PdfMergerClient />;
}
