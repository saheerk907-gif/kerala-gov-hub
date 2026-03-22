'use client';
import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
const ocrBtn = {
  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#7c3aed,#0284c7)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
};

// Smarter text joining that preserves Malayalam text flow
function joinPageItems(items) {
  let result = '';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.str) continue;
    result += item.str;
    if (item.hasEOL) {
      result += '\n';
    } else if (i < items.length - 1 && items[i + 1]?.str) {
      // Add space only if neither ends/starts with Malayalam or zero-width joiner
      const next = items[i + 1].str;
      const endsWithMal = /[\u0D00-\u0D7F]$/.test(item.str);
      const startsWithMal = /^[\u0D00-\u0D7F]/.test(next);
      if (!endsWithMal && !startsWithMal) result += ' ';
    }
  }
  return result.normalize('NFC');
}

// Render a pdfjs page to a canvas at given scale
async function renderPageToCanvas(page, scale = 2) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

export default function PdfToTextClient() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'extracting' | 'ocr' | 'done' | 'error:...'
  const [ocrProgress, setOcrProgress] = useState('');
  const [copied, setCopied] = useState(false);
  const workerRef = useRef(null);

  async function handleFile([f]) {
    setStatus('loading');
    setText('');
    setCopied(false);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      setFile(f);
      setPdfDoc(doc);
      setStatus(null);
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  async function handleExtract() {
    if (!pdfDoc) return;
    setStatus('extracting');
    try {
      const parts = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = joinPageItems(content.items);
        parts.push(`--- Page ${i} ---\n${pageText}`);
      }
      setText(parts.join('\n\n'));
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  async function handleOcr() {
    if (!pdfDoc) return;
    setStatus('ocr');
    setOcrProgress('Loading Malayalam OCR engine…');
    try {
      // Lazy-load Tesseract to keep initial bundle small
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('mal+eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(`Page recognition: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      workerRef.current = worker;

      const parts = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        setOcrProgress(`OCR: page ${i} of ${pdfDoc.numPages}…`);
        const page = await pdfDoc.getPage(i);
        const canvas = await renderPageToCanvas(page, 2);
        const { data: { text: pageText } } = await worker.recognize(canvas);
        parts.push(`--- Page ${i} ---\n${pageText.trim()}`);
      }

      await worker.terminate();
      workerRef.current = null;
      setText(parts.join('\n\n'));
      setStatus('done');
      setOcrProgress('');
    } catch (err) {
      setStatus('error: ' + err.message);
      setOcrProgress('');
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.pdf$/i, '') || 'extracted') + '.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function handleReset() {
    setFile(null); setPdfDoc(null); setText(''); setStatus(null); setCopied(false);
  }

  const busy = status === 'extracting' || status === 'ocr' || status === 'loading';

  return (
    <GlassTool icon="📃" title="PDF to Text" titleMl="PDF → ടെക്സ്റ്റ്">
      {!pdfDoc && (
        <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />
      )}

      {status === 'loading' && (
        <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 16 }}>Loading PDF…</p>
      )}

      {pdfDoc && !text && (
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
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{pdfDoc.numPages} pages</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>×</button>
          </div>

          <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleExtract}>
            {status === 'extracting' ? 'Extracting…' : '📃 Extract Text (Fast)'}
          </button>

          <button style={busy ? { ...ocrBtn, opacity: 0.5, cursor: 'not-allowed' } : ocrBtn} disabled={busy} onClick={handleOcr}>
            {status === 'ocr' ? ocrProgress || 'Running OCR…' : '🔍 Malayalam OCR (Accurate)'}
          </button>

          <p style={{ color: '#64748b', fontSize: 11, marginTop: 10, lineHeight: 1.5, textAlign: 'center' }}>
            <b>Fast</b> — works for Unicode PDFs (most modern documents)<br />
            <b>Malayalam OCR</b> — use this for scanned PDFs or garbled text (~30s per page)
          </p>

          {status === 'ocr' && ocrProgress && (
            <p style={{ color: '#7c3aed', fontSize: 12, textAlign: 'center', marginTop: 8, fontWeight: 600 }}>
              {ocrProgress}
            </p>
          )}
        </>
      )}

      {text && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Extracted text</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}>
              ← New file
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            style={{
              width: '100%', height: 280, padding: '12px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.45)', fontSize: 13,
              color: '#1e293b', resize: 'vertical',
              fontFamily: "'Noto Sans Malayalam', 'Meera', sans-serif",
              lineHeight: 1.8, boxSizing: 'border-box', outline: 'none',
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

          {/* Try OCR if text looks wrong */}
          <button
            style={{ ...ocrBtn, marginTop: 14, fontSize: 13, padding: '10px' }}
            onClick={() => { setText(''); handleOcr(); }}
            disabled={busy}
          >
            🔍 Text looks wrong? Try Malayalam OCR
          </button>
        </>
      )}

      {status && status.startsWith('error') && (
        <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
