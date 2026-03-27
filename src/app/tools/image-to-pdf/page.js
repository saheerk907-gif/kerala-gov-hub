import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const ImageToPdfClient = dynamic(() => import('./ImageToPdfClient'), { ssr: false });

export const metadata = buildMetadata({
  title: 'Image to PDF — Convert Images to PDF Free',
  description: 'Convert JPG and PNG images to PDF online for free. Browser-based, no upload required. Useful for Kerala government document submission.',
  path: '/tools/image-to-pdf',
  keywords: ['image to PDF converter', 'JPG to PDF online free', 'convert image PDF browser'],
});

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
