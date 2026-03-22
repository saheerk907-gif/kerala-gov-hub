'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

const btn = {
  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#10b981,#0284c7)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
};
const btnDisabled = { ...btn, opacity: 0.5, cursor: 'not-allowed' };

const MODES = [
  {
    key: 'lossless',
    label: 'Lossless',
    icon: '✨',
    desc: 'No quality loss — best for text & GOs',
    warning: null,
  },
  {
    key: 'raster',
    label: 'Aggressive',
    icon: '📉',
    desc: 'Rasterise pages — for scanned/image PDFs only',
    warning: 'May blur text. Use only for scanned documents.',
  },
];

// Lossless: reload with pdf-lib and re-save with object stream compression
async function compressLossless(arrayBuffer) {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const bytes  = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
  return bytes;
}

// Raster: render each page to canvas → embed as JPEG (for scanned PDFs)
async function compressRaster(arrayBuffer, onProgress) {
  const scale  = 2.2;
  const jpegQ  = 0.88;
  const pdfSrc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const outDoc = await PDFDocument.create();

  for (let i = 1; i <= pdfSrc.numPages; i++) {
    onProgress(`Compressing page ${i} of ${pdfSrc.numPages}…`);
    const page     = await pdfSrc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = Math.round(viewport.width);
    canvas.height  = Math.round(viewport.height);
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQ);
    const jpegBytes   = await fetch(jpegDataUrl).then(r => r.arrayBuffer());
    const jpegImage   = await outDoc.embedJpg(jpegBytes);
    const pdfPage     = outDoc.addPage([canvas.width, canvas.height]);
    pdfPage.drawImage(jpegImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  }

  return await outDoc.save();
}

export default function PdfCompressorClient() {
  const [file, setFile]       = useState(null);
  const [mode, setMode]       = useState('lossless');
  const [status, setStatus]   = useState(null);
  const [progress, setProgress] = useState('');
  const [result, setResult]   = useState(null);

  async function handleFile([f]) {
    setFile(f); setResult(null); setStatus(null);
  }

  async function handleCompress() {
    if (!file) return;
    setStatus('compressing'); setResult(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      let compressedBytes;

      if (mode === 'lossless') {
        setProgress('Recompressing…');
        compressedBytes = await compressLossless(arrayBuffer);
      } else {
        compressedBytes = await compressRaster(arrayBuffer, setProgress);
      }

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      setResult({
        originalSize:   file.size,
        compressedSize: compressedBytes.byteLength,
        url,
        filename: file.name.replace(/\.pdf$/i, '') + '-compressed.pdf',
      });
      setStatus('done');
      setProgress('');
    } catch (err) {
      setStatus('error: ' + err.message);
      setProgress('');
    }
  }

  function handleDownload() {
    const a = document.createElement('a');
    a.href = result.url; a.download = result.filename; a.click();
  }

  function handleReset() {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null); setResult(null); setStatus(null); setProgress('');
  }

  const saving = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0;
  const busy   = status === 'compressing';

  return (
    <GlassTool icon="📦" title="PDF Compressor" titleMl="PDF കംപ്രസ്സർ">

      {!file && <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />}

      {file && !result && (
        <>
          {/* File info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.55)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 20, fontSize: 13,
          }}>
            <span>📄</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e293b' }}>
              {file.name}
            </span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{fmtSize(file.size)}</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>×</button>
          </div>

          {/* Mode selector */}
          <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Method
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {MODES.map(m => (
              <button key={m.key} onClick={() => setMode(m.key)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: mode === m.key
                  ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(2,132,199,0.15))'
                  : 'rgba(255,255,255,0.45)',
                outline: mode === m.key ? '2px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.6)',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{m.desc}</div>
                  {m.warning && (
                    <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4, fontWeight: 600 }}>
                      ⚠ {m.warning}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleCompress}>
            {busy ? progress || 'Compressing…' : '📦 Compress PDF'}
          </button>
        </>
      )}

      {result && (
        <>
          <div style={{
            background: 'rgba(255,255,255,0.55)', borderRadius: 14,
            padding: '18px 20px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>ORIGINAL</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{fmtSize(result.originalSize)}</div>
              </div>
              <div style={{ fontSize: 22 }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>COMPRESSED</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: saving > 0 ? '#10b981' : '#f59e0b' }}>
                  {fmtSize(result.compressedSize)}
                </div>
              </div>
              <div style={{
                background: saving > 0 ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'rgba(100,116,139,0.2)',
                borderRadius: 10, padding: '8px 14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, color: saving > 0 ? 'rgba(255,255,255,0.8)' : '#94a3b8' }}>SAVED</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: saving > 0 ? '#fff' : '#64748b' }}>
                  {saving > 0 ? `${saving}%` : '~0%'}
                </div>
              </div>
            </div>
            {saving <= 0 && (
              <p style={{ fontSize: 12, color: '#f59e0b', textAlign: 'center', marginTop: 4 }}>
                This PDF is already well-optimised. Try Aggressive mode if you need a smaller file.
              </p>
            )}
          </div>

          <button style={btn} onClick={handleDownload}>⬇ Download Compressed PDF</button>
          <button onClick={handleReset} style={{
            width: '100%', padding: '10px', marginTop: 10, borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,0.4)', color: '#475569', fontWeight: 600,
            fontSize: 13, cursor: 'pointer',
          }}>
            ← Compress another file
          </button>
        </>
      )}

      {status && status.startsWith('error') && (
        <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
