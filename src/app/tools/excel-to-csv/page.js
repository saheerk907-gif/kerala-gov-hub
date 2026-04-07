import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const ExcelToCsvClient = dynamic(() => import('./ExcelToCsvClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'Excel to CSV — Convert Excel Sheets to CSV Free',
  description: 'Convert Excel (.xlsx, .xls) files to CSV instantly in your browser. Choose any sheet, preview data, no upload needed — 100% private.',
  path: '/tools/excel-to-csv',
  keywords: ['Excel to CSV', 'xlsx to csv converter', 'convert excel to csv free', 'spreadsheet converter'],
});

export default function ExcelToCsvPage() {
  return <ExcelToCsvClient />;
}
