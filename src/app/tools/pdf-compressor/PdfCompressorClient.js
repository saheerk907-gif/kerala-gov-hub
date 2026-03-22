'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const QUALITY_PRESETS = {
  low:    { label: 'Low',    scale: 1.5, jpegQ: 0.72, desc: '~144 DPI · readable, smaller file' },
  medium: { label: 'Medium', scale: 2.0, jpegQ: 0.82, desc: '~192 DPI · good balance' },
  high:   { label: 'High',   scale: 2.5, jpegQ: 0.88, desc: '~240 DPI · near-original quality' },
};

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

export default function PdfCompressorClient() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null); // { originalSize, compressedSize, url, filename }

  async function handleFile([f]) {
    setFile(f);
    setResult(null);
    setStatus(null);
  }

  async function handleCompress() {
    if (!file) return;
    setStatus('compressing');
    setResult(null);
    const preset = QUALITY_PRESETS[quality];

    try {
      const buf = await file.arrayBuffer();
      const pdfSrc = await pdfjsLib.getDocument({ data: buf }).promise;
      const numPages = pdfSrc.numPages;
      const outDoc = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Compressing page ${i} of ${numPages}…`);
        const page = await pdfSrc.getPage(i);
        const viewport = page.getViewport({ scale: preset.scale });

        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

        // Convert to JPEG blob at chosen quality
        const jpegDataUrl = canvas.toDataURL('image/jpeg', preset.jpegQ);
        const jpegBytes = await fetch(jpegDataUrl).then(r => r.arrayBuffer());
        const jpegImage = await outDoc.embedJpg(jpegBytes);

        const pdfPage = outDoc.addPage([canvas.width, canvas.height]);
        pdfPage.drawImage(jpegImage, { x: 0, y: 0, width: canvas.width, height: canvas.height });
      }

      const compressedBytes = await outDoc.save();
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
  const busy = status === 'compressing';

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
            <span style={{ color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' }}>{fmtSize(file.size)}</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>×</button>
          </div>

          {/* Quality selector */}
          <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Quality
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {Object.entries(QUALITY_PRESETS).map(([key, p]) => (
              <button key={key} onClick={() => setQuality(key)} style={{
                flex: 1, padding: '10px 6px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 13,
                background: quality === key ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'rgba(255,255,255,0.45)',
                color: quality === key ? '#fff' : '#475569',
                boxShadow: quality === key ? '0 4px 12px rgba(16,185,129,0.25)' : 'none',
                transition: 'all 0.15s',
              }}>
                {p.label}
                <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.8 }}>{p.desc.split(',')[0]}</div>
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
          {/* Size comparison */}
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
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>{fmtSize(result.compressedSize)}</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg,#10b981,#0284c7)', borderRadius: 10,
                padding: '8px 14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>SAVED</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{saving}%</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${100 - saving}%`, height: '100%',
                background: 'linear-gradient(90deg,#10b981,#0284c7)', borderRadius: 99,
              }} />
            </div>
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
