'use client';
import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import GlassTool from '@/components/pdf-tools/GlassTool';

const SIZES = [128, 256, 512, 1024];

const btn = {
  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#10b981,#0284c7)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
};
const btnDisabled = { ...btn, opacity: 0.5, cursor: 'not-allowed' };

const PRESETS = [
  { label: 'URL',       placeholder: 'https://example.com' },
  { label: 'SPARK',     placeholder: 'https://spark.kerala.gov.in/...' },
  { label: 'Treasury',  placeholder: 'https://treasury.kerala.gov.in/...' },
  { label: 'Plain text',placeholder: 'Type any text…' },
];

export default function QrGeneratorClient() {
  const [text, setText]         = useState('');
  const [fgColor, setFgColor]   = useState('#000000');
  const [bgColor, setBgColor]   = useState('#ffffff');
  const [size, setSize]         = useState(512);
  const [qrUrl, setQrUrl]       = useState(null);
  const [error, setError]       = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!text.trim()) { setQrUrl(null); setError(''); return; }
    debounceRef.current = setTimeout(generate, 300);
    return () => clearTimeout(debounceRef.current);
  }, [text, fgColor, bgColor, size]);

  async function generate() {
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      setQrUrl(url);
      setError('');
    } catch (e) {
      setError(e.message);
      setQrUrl(null);
    }
  }

  function handleDownload(format) {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr-code.${format}`;
    a.click();
  }

  const colorInput = (label, value, onChange) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.55)', borderRadius: 10, padding: '8px 12px',
        border: '1px solid rgba(255,255,255,0.8)' }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0, background: 'none' }} />
        <span style={{ fontSize: 13, color: '#1e293b', fontFamily: 'monospace' }}>{value}</span>
      </div>
    </div>
  );

  return (
    <GlassTool icon="⬛" title="QR Code Generator" titleMl="QR കോഡ് ജനറേറ്റർ">

      {/* Quick presets */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => setText('')}
            style={{
              padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.35)',
              background: 'rgba(255,255,255,0.45)', color: '#0f766e',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Text input */}
      <textarea
        rows={3}
        placeholder="Enter URL, text, GO number, phone number…"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.8)',
          background: 'rgba(255,255,255,0.5)', fontSize: 14, color: '#1e293b',
          resize: 'none', outline: 'none', boxSizing: 'border-box',
          fontFamily: 'inherit', lineHeight: 1.5, marginBottom: 16,
        }}
      />

      {/* Colors */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {colorInput('QR Color', fgColor, setFgColor)}
        {colorInput('Background', bgColor, setBgColor)}
      </div>

      {/* Size */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Size
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => setSize(s)} style={{
              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 12,
              background: size === s ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'rgba(255,255,255,0.45)',
              color: size === s ? '#fff' : '#475569',
              transition: 'all 0.15s',
            }}>
              {s}px
            </button>
          ))}
        </div>
      </div>

      {/* QR preview */}
      {qrUrl && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            display: 'inline-block', padding: 12,
            background: bgColor, borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.8)',
          }}>
            <img src={qrUrl} alt="QR Code" style={{ width: 180, height: 180, display: 'block' }} />
          </div>
          <p style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>
            {size}×{size}px · Error correction: High
          </p>
        </div>
      )}

      {!qrUrl && !text && (
        <div style={{
          textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 13,
        }}>
          Type something above to generate a QR code
        </div>
      )}

      {/* Download buttons */}
      {qrUrl && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ ...btn, marginTop: 0, flex: 1 }} onClick={() => handleDownload('png')}>
            ⬇ Download PNG
          </button>
          <button
            onClick={() => {
              // Copy to clipboard
              fetch(qrUrl).then(r => r.blob()).then(blob => {
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              });
            }}
            style={{
              padding: '13px 18px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.5)',
              background: 'rgba(255,255,255,0.5)', color: '#0f766e', fontWeight: 600,
              fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            📋 Copy
          </button>
        </div>
      )}

      {error && <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{error}</p>}
    </GlassTool>
  );
}
