import dynamic from 'next/dynamic';

const PdfMergerClient = dynamic(() => import('./PdfMergerClient'), { ssr: false });

export const metadata = {
  title: 'PDF Merger — Kerala Gov Employee Hub',
  description: 'Merge multiple PDF files into one — free, browser-only, files never leave your device.',
};

export default function PdfMergerPage() {
  return <PdfMergerClient />;
}

