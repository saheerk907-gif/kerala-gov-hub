import dynamic from 'next/dynamic';

const QrGeneratorClient = dynamic(() => import('./QrGeneratorClient'), { ssr: false });

export const metadata = {
  title: 'QR Code Generator — Kerala Gov Employee Hub',
  description: 'Generate QR codes for URLs, government portal links, text — free, browser-only.',
};

export default function QrGeneratorPage() {
  return <QrGeneratorClient />;
}
