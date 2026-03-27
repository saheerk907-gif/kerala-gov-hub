'use client';
import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const btn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#2997ff,#0ea5e9)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(41,151,255,0.25)',
};
const btnDisabled = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };
const ocrBtn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#bf5af2,#2997ff)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(191,90,242,0.2)',
};
const outlineBtn = {
  padding: '9px 18px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
};

function joinPageItems(items) {
  let result = '';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.str) continue;
    result += item.str;
    if (item.hasEOL) {
      result += '\n';
    } else if (i < items.length - 1 && items[i + 1]?.str) {
      const next = items[i + 1].str;
      const endsWithMal = /[\u0D00-\u0D7F]$/.test(item.str);
      const startsWithMal = /^[\u0D00-\u0D7F]/.test(next);
      if (!endsWithMal && !startsWithMal) result += ' ';
    }
  }
  return result.normalize('NFC');
}

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
  const [status, setStatus] = useState(null);
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
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 16 }}>Loading PDF…</p>
      )}

      {pdfDoc && !text && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 16, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span>📄</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.8)' }}>
              {file.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{pdfDoc.numPages} pages</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16 }}>×</button>
          </div>

          <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleExtract}>
            {status === 'extracting' ? 'Extracting…' : '📃 Extract Text (Fast)'}
          </button>

          <button style={busy ? { ...ocrBtn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' } : ocrBtn} disabled={busy} onClick={handleOcr}>
            {status === 'ocr' ? ocrProgress || 'Running OCR…' : '🔍 Malayalam OCR (Accurate)'}
          </button>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 12, lineHeight: 1.6, textAlign: 'center' }}>
            <b style={{ color: 'rgba(255,255,255,0.5)' }}>Fast</b> — works for Unicode PDFs (most modern documents)<br />
            <b style={{ color: 'rgba(255,255,255,0.5)' }}>Malayalam OCR</b> — for scanned PDFs or garbled text (~30s/page)
          </p>

          {status === 'ocr' && ocrProgress && (
            <p style={{ color: '#bf5af2', fontSize: 12, textAlign: 'center', marginTop: 8, fontWeight: 600 }}>
              {ocrProgress}
            </p>
          )}
        </>
      )}

      {text && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Extracted text</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
              ← New file
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            style={{
              width: '100%', height: 280, padding: '12px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.04)', fontSize: 13,
              color: 'rgba(255,255,255,0.8)', resize: 'vertical',
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
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
