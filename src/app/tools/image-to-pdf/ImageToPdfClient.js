'use client';
import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import GlassTool from '@/components/pdf-tools/GlassTool';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/bmp';

const btn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#2997ff,#0ea5e9)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(41,151,255,0.25)',
};
const btnDisabled = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };

const A4 = { w: 595.28, h: 841.89 };

async function imageFileToBytes(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(async blob => {
        resolve({ bytes: await blob.arrayBuffer(), type: 'png' });
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageToPdfClient() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  function addImages(files) {
    const newImgs = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({ file, previewUrl: URL.createObjectURL(file), id: Math.random() }));
    setImages(prev => [...prev, ...newImgs]);
    setStatus(null);
  }

  function removeImage(id) {
    setImages(prev => {
      const removed = prev.find(i => i.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  }

  function moveUp(idx) {
    if (idx === 0) return;
    setImages(prev => { const arr = [...prev]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; return arr; });
  }

  function moveDown(idx) {
    setImages(prev => {
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; return arr;
    });
  }

  async function handleConvert() {
    if (!images.length) return;
    setStatus('converting');
    try {
      const pdfDoc = await PDFDocument.create();
      for (const img of images) {
        const { bytes } = await imageFileToBytes(img.file);
        const embedded = await pdfDoc.embedPng(bytes);
        const { width: iw, height: ih } = embedded;
        const margin = 20;
        const maxW = A4.w - margin * 2;
        const maxH = A4.h - margin * 2;
        const scale = Math.min(maxW / iw, maxH / ih, 1);
        const dw = iw * scale;
        const dh = ih * scale;
        const page = pdfDoc.addPage([A4.w, A4.h]);
        page.drawImage(embedded, { x: (A4.w - dw) / 2, y: (A4.h - dh) / 2, width: dw, height: dh });
      }
      const bytes = await pdfDoc.save();
      const blob  = new Blob([bytes], { type: 'application/pdf' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href = url; a.download = 'images.pdf'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  const busy = status === 'converting';

  return (
    <GlassTool icon="🖼️" title="Image to PDF" titleMl="ചിത്രം → PDF">

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addImages(e.dataTransfer.files); }}
        style={{
          border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 14,
          padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)', marginBottom: 16,
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.6 }}>🖼️</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, margin: 0 }}>
          Drop images here or click to browse
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP, BMP supported</p>
        <input
          ref={inputRef} type="file" accept={ACCEPT} multiple style={{ display: 'none' }}
          onChange={e => { addImages(e.target.files); e.target.value = ''; }}
        />
      </div>

      {images.length > 0 && (
        <>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            {images.length} image{images.length > 1 ? 's' : ''} — each becomes one page
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {images.map((img, idx) => (
              <div key={img.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <img src={img.previewUrl} alt="" style={{
                  width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {idx + 1}. {img.file.name}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button onClick={() => moveUp(idx)} disabled={idx === 0}
                    style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.45)', fontSize: 14, padding: '2px 6px' }}>↑</button>
                  <button onClick={() => moveDown(idx)} disabled={idx === images.length - 1}
                    style={{ background: 'none', border: 'none', cursor: idx === images.length - 1 ? 'default' : 'pointer', color: idx === images.length - 1 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.45)', fontSize: 14, padding: '2px 6px' }}>↓</button>
                  <button onClick={() => removeImage(img.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16, padding: '2px 6px' }}>×</button>
                </div>
              </div>
            ))}
          </div>

          <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleConvert}>
            {busy ? 'Converting…' : `⬇ Convert ${images.length} Image${images.length > 1 ? 's' : ''} to PDF`}
          </button>

          {status === 'done' && (
            <p style={{ color: '#30d158', fontSize: 13, textAlign: 'center', marginTop: 10, fontWeight: 600 }}>
              ✓ images.pdf downloaded
            </p>
          )}
        </>
      )}

      {status && status.startsWith('error') && (
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
