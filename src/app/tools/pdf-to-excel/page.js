import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const PdfToExcelClient = dynamic(() => import('./PdfToExcelClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'PDF to Excel — Convert PDF Tables to Spreadsheet Free',
  description: 'Convert PDF tables to Excel (.xlsx) instantly in your browser. No upload, 100% private. Great for Kerala government orders and salary tables.',
  path: '/tools/pdf-to-excel',
  keywords: ['PDF to Excel converter', 'PDF table to spreadsheet', 'convert PDF to xlsx free', 'Kerala government PDF tools'],
});

export default function PdfToExcelPage() {
  return <PdfToExcelClient />;
}
