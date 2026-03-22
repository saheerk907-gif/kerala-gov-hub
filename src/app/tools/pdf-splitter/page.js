import dynamic from 'next/dynamic';

const PdfSplitterClient = dynamic(() => import('./PdfSplitterClient'), { ssr: false });

export const metadata = {
  title: 'PDF Splitter — Kerala Gov Employee Hub',
  description: 'Split a PDF by page range or extract every page — free, browser-only, files never leave your device.',
};

export default function PdfSplitterPage() {
  return <PdfSplitterClient />;
}
