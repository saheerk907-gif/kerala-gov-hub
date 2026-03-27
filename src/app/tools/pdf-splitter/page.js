import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const PdfSplitterClient = dynamic(() => import('./PdfSplitterClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'PDF Splitter — Split PDF Pages Free Online',
  description: 'Split a PDF into individual pages or page ranges online for free. Browser-based, no upload. Ideal for splitting Kerala government orders.',
  path: '/tools/pdf-splitter',
  keywords: ['PDF splitter online', 'split PDF pages', 'PDF page extractor free'],
});

export default function PdfSplitterPage() {
  return <PdfSplitterClient />;
}
