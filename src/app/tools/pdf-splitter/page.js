import PdfSplitterClient from './PdfSplitterClient';

export const metadata = {
  title: 'PDF Splitter — Kerala Gov Employee Hub',
  description: 'Split a PDF by page range or extract every page — free, browser-only, files never leave your device.',
};

export default function PdfSplitterPage() {
  return <PdfSplitterClient />;
}
