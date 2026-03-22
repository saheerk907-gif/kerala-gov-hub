'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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

function parseRanges(str, totalPages) {
  if (!str.trim()) return Array.from({ length: totalPages }, (_, i) => i);
  const indices = new Set();
  for (const part of str.split(',')) {
    const trimmed = part.trim();
    const dash = trimmed.indexOf('-');
    if (dash > 0) {
      const start = parseInt(trimmed.slice(0, dash)) - 1;
      const end = parseInt(trimmed.slice(dash + 1)) - 1;
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(0, start); i <= Math.min(totalPages - 1, end); i++) indices.add(i);
      }
    } else {
      const n = parseInt(trimmed) - 1;
      if (!isNaN(n) && n >= 0 && n < totalPages) indices.add(n);
    }
  }
  return [...indices].sort((a, b) => a - b);
}

export default function PdfSplitterClient() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState('');
  const [status, setStatus] = useState(null);

  async function handleFile([f]) {
    setStatus(null);
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      setFile({ file: f, buf, doc });
      setPageCount(doc.getPageCount());
      setRange('');
    } catch (err) {
      setStatus('Could not read PDF: ' + err.message);
    }
  }

  const indices = file ? parseRanges(range, pageCount) : [];
  const blankRange = range.trim() === '';

  async function handleSplit() {
    if (!file) return;
    setStatus('splitting');
    try {
      if (blankRange) {
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(file.doc, [i]);
          out.addPage(page);
          const bytes = await out.save();
          zip.file(`page-${i + 1}.pdf`, bytes);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'split-pages.zip'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else if (indices.length === 0) {
        setStatus('No valid pages in that range.');
        return;
      } else {
        const out = await PDFDocument.create();
        const pages = await out.copyPages(file.doc, indices);
        pages.forEach(p => out.addPage(p));
        const bytes = await out.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'split.pdf'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  const rangeLabel = file
    ? blankRange
      ? `Split all ${pageCount} pages into separate files (zip)`
      : indices.length > 0
        ? `Extract ${indices.length} page${indices.length > 1 ? 's' : ''} into one PDF`
        : 'No valid pages in range'
    : '';

  return (
    <GlassTool icon="✂️" title="PDF Splitter" titleMl="PDF വിഭജനം">
      <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />

      {file && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 20, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span>📄</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.8)' }}>
              {file.file.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{pageCount} pages</span>
            <button
              onClick={() => { setFile(null); setPageCount(0); setStatus(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16 }}
            >×</button>
          </div>

          <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
            Pages to extract
          </label>
          <input
            type="text"
            placeholder={`e.g. 1-3, 5, 7-9  (1–${pageCount})`}
            value={range}
            onChange={e => { setRange(e.target.value); setStatus(null); }}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', fontSize: 13,
              color: '#fff', outline: 'none', marginBottom: 6, boxSizing: 'border-box',
            }}
          />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 16 }}>
            {rangeLabel || 'Leave blank to split every page into separate files (.zip)'}
          </p>

          <button
            style={!file || status === 'splitting' ? btnDisabled : btn}
            disabled={!file || status === 'splitting'}
            onClick={handleSplit}
          >
            {status === 'splitting' ? 'Splitting…' : '⬇ Split & Download'}
          </button>
        </>
      )}

      {status === 'done' && (
        <p style={{ color: '#30d158', fontSize: 13, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>✓ Download started</p>
      )}
      {status && status.startsWith('error') && (
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
      {status === 'No valid pages in that range.' && (
        <p style={{ color: '#ff9f0a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
