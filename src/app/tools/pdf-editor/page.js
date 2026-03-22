import PdfEditorClient from './PdfEditorClient';

export const metadata = {
  title: 'PDF Editor — Kerala Gov Employee Hub',
  description: 'Edit, annotate, whiteout and sign PDF documents online. All processing happens in your browser — your files are never uploaded.',
  keywords: ['PDF editor', 'PDF annotate', 'PDF sign', 'whiteout PDF', 'Kerala government'],
};

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
