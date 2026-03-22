import dynamic from 'next/dynamic';

const PdfCompressorClient = dynamic(() => import('./PdfCompressorClient'), { ssr: false });

export const metadata = {
  title: 'PDF Compressor — Kerala Gov Employee Hub',
  description: 'Compress PDF file size for government portal uploads — free, browser-only, files never leave your device.',
};

export default function PdfCompressorPage() {
  return <PdfCompressorClient />;
}
