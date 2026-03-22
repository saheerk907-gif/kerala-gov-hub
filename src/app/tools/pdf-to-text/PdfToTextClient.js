'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

const btn = {
  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#10b981,#0284c7)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
};
const btnDisabled = { ...btn, opacity: 0.5, cursor: 'not-allowed' };
const outlineBtn = {
  padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(16,185,129,0.5)',
  background: 'rgba(255,255,255,0.5)', color: '#0f766e', fontWeight: 600,
  fontSize: 13, cursor: 'pointer',
};

export default function PdfToTextClient() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleFile([f]) {
    setFile(f);
    setText('');
    setStatus(null);
    setCopied(false);
  }

  async function handleExtract() {
    if (!file) return;
    setStatus('extracting');
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const parts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        parts.push(`--- Page ${i} ---\n${pageText}`);
      }
      setText(parts.join('\n\n'));
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.pdf$/i, '') || 'extracted') + '.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return (
    <GlassTool icon="📃" title="PDF to Text" titleMl="PDF → ടെക്സ്റ്റ്">
      <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />

      {file && !text && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.55)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 16, fontSize: 13,
          }}>
            <span>📄</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e293b' }}>
              {file.name}
            </span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{(file.size / 1024).toFixed(0)} KB</span>
            <button
              onClick={() => { setFile(null); setStatus(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}
            >×</button>
          </div>
          <button
            style={status === 'extracting' ? btnDisabled : btn}
            disabled={status === 'extracting'}
            onClick={handleExtract}
          >
            {status === 'extracting' ? 'Extracting…' : '📃 Extract Text'}
          </button>
        </>
      )}

      {text && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Extracted text</span>
            <button
              onClick={() => { setFile(null); setText(''); setStatus(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}
            >
              ← New file
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            style={{
              width: '100%', height: 240, padding: '12px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.45)', fontSize: 12,
              color: '#1e293b', resize: 'vertical', fontFamily: 'monospace',
              lineHeight: 1.6, boxSizing: 'border-box', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button style={outlineBtn} onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy All'}
            </button>
            <button style={outlineBtn} onClick={handleDownload}>
              ⬇ Save as .txt
            </button>
          </div>
        </>
      )}

      {status && status.startsWith('error') && (
        <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
