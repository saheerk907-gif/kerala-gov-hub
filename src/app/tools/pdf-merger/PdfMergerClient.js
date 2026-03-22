'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

const btn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#2997ff,#0ea5e9)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(41,151,255,0.25)',
};
const btnDisabled = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };

export default function PdfMergerClient() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(null);

  function addFiles(newFiles) {
    setFiles(prev => [...prev, ...newFiles]);
    setStatus(null);
  }

  function removeFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setStatus(null);
  }

  async function handleMerge() {
    if (files.length < 2) return;
    setStatus('merging');
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'merged.pdf'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  return (
    <GlassTool icon="🗂️" title="PDF Merger" titleMl="PDF ലയനം">
      <UploadDropZone onFiles={addFiles} multiple label="Drop PDF files here or click to browse" />

      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.05)', borderRadius: 10,
              padding: '9px 14px', marginBottom: 8, fontSize: 13,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 16 }}>📄</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.8)' }}>
                {i + 1}. {f.name}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, whiteSpace: 'nowrap' }}>
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                onClick={() => removeFile(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16, lineHeight: 1 }}
                title="Remove"
              >×</button>
            </div>
          ))}
        </div>
      )}

      <button
        style={files.length < 2 || status === 'merging' ? btnDisabled : btn}
        disabled={files.length < 2 || status === 'merging'}
        onClick={handleMerge}
      >
        {status === 'merging' ? 'Merging…' : `⬇ Merge ${files.length > 0 ? `${files.length} files` : ''} & Download`}
      </button>

      {files.length === 1 && (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
          Add at least one more PDF to merge
        </p>
      )}

      {status === 'done' && (
        <p style={{ color: '#30d158', fontSize: 13, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>
          ✓ merged.pdf downloaded
        </p>
      )}
      {status && status.startsWith('error') && (
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
