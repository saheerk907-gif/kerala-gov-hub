import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const PdfToTextClient = dynamic(() => import('./PdfToTextClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'PDF to Text — Extract Text from PDF Free',
  description: 'Extract text from PDF files instantly in your browser. No upload, privacy-safe. Useful for Kerala government orders and circulars.',
  path: '/tools/pdf-to-text',
  keywords: ['PDF to text converter', 'extract text from PDF', 'PDF text extractor online free'],
});

export default function PdfToTextPage() {
  return <PdfToTextClient />;
}
