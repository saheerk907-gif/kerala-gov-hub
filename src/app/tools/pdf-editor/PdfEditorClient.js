'use client';
import { useState } from 'react';
import UploadZone from '@/components/pdf-editor/UploadZone';

export default function PdfEditorClient() {
  const [file, setFile] = useState(null);
  if (!file) return <UploadZone onFile={setFile} />;
  return <div style={{ color: 'white', padding: 40 }}>File: {file.name}</div>;
}
