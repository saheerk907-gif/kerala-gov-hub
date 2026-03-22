import dynamic from 'next/dynamic';

const ImageToPdfClient = dynamic(() => import('./ImageToPdfClient'), { ssr: false });

export const metadata = {
  title: 'Image to PDF — Kerala Gov Employee Hub',
  description: 'Convert JPG, PNG and other images to a PDF — free, browser-only, files never leave your device.',
};

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
