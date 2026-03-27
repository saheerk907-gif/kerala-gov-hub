import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const QrGeneratorClient = dynamic(() => import('./QrGeneratorClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'QR Code Generator — Free Online QR Maker',
  description: 'Generate QR codes for URLs, text, and contact info online for free. Browser-based, instant download. Useful for Kerala government notice boards.',
  path: '/tools/qr-generator',
  keywords: ['QR code generator free', 'QR code maker online', 'create QR code browser'],
});

export default function QrGeneratorPage() {
  return <QrGeneratorClient />;
}
