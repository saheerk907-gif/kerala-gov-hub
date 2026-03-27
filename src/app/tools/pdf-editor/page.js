import PdfEditorClient from './PdfEditorClient';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'PDF Editor — Edit PDF Files Free Online',
  description: 'Edit PDF files online for free — annotate, fill forms, add text. Browser-based, no upload required. For Kerala government document editing.',
  path: '/tools/pdf-editor',
  keywords: ['PDF editor online free', 'edit PDF browser', 'PDF annotation tool', 'fill PDF form online'],
});

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
