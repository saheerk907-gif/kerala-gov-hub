'use client';
import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';

const SIZES = [128, 256, 512, 1024];

const PRESETS = [
  { label: 'URL',       placeholder: 'https://example.com' },
  { label: 'SPARK',     placeholder: 'https://spark.kerala.gov.in' },
  { label: 'Treasury',  placeholder: 'https://treasury.kerala.gov.in' },
  { label: 'Plain text',placeholder: 'Type any text…' },
];

export default function QrGeneratorClient() {
  const [text, setText]       = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize]       = useState(256);
  const [qrUrl, setQrUrl]     = useState(null);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);
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

  function handleDownload() {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qr-code.png';
    a.click();
  }

  async function handleCopy() {
    if (!qrUrl) return;
    try {
      const blob = await fetch(qrUrl).then(r => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: '#121416', color: '#fff', fontFamily: 'inherit' }}>
      {/* ambient glows */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(14,165,233,0.06)', filter: 'blur(100px)',
        top: -100, right: -100, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(41,151,255,0.05)', filter: 'blur(80px)',
        bottom: -80, left: -80, pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Back link */}
        <Link href="/#tools" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
          marginBottom: 32, transition: 'color 0.15s',
        }}>
          ← Back to tools
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16, fontSize: 26, marginBottom: 16,
            background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)',
          }}>⬛</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            QR Code Generator
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            QR കോഡ് ജനറേറ്റർ — browser-only, nothing uploaded
          </p>
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {PRESETS.map(p => (
            <button key={p.label}
              onClick={() => setText(p.placeholder)}
              style={{
                padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)',
                transition: 'all 0.15s',
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
            width: '100%', padding: '14px 16px', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff', fontSize: 14, resize: 'none', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
            marginBottom: 20,
          }}
        />

        {/* Colors + Size row */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '20px', marginBottom: 20,
        }}>
          {/* Colors */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' }}>
            Colours
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[['QR Color', fgColor, setFgColor], ['Background', bgColor, setBgColor]].map(([label, val, set]) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{label}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <input type="color" value={val} onChange={e => set(e.target.value)}
                    style={{ width: 26, height: 26, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0, background: 'none' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Size */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>
            Export Size
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SIZES.map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
                background: size === s ? 'linear-gradient(135deg,#2997ff,#0ea5e9)' : 'rgba(255,255,255,0.06)',
                color: size === s ? '#fff' : 'rgba(255,255,255,0.45)',
                boxShadow: size === s ? '0 2px 12px rgba(41,151,255,0.3)' : 'none',
              }}>
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* QR Preview */}
        {qrUrl ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '28px', marginBottom: 16, textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-block', padding: 16, background: bgColor,
              borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            }}>
              <img src={qrUrl} alt="QR Code" style={{ width: 180, height: 180, display: 'block' }} />
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
              {size}×{size}px · Error correction: High
            </p>
          </div>
        ) : (
          !error && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '40px 0', textAlign: 'center',
              color: 'rgba(255,255,255,0.2)', fontSize: 13, marginBottom: 16,
            }}>
              Type something above to generate a QR code
            </div>
          )
        )}

        {error && (
          <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>{error}</p>
        )}

        {/* Action buttons */}
        {qrUrl && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownload} style={{
              flex: 1, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#2997ff,#0ea5e9)',
              color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 0.3,
              boxShadow: '0 4px 20px rgba(41,151,255,0.25)',
            }}>
              ⬇ Download PNG
            </button>
            <button onClick={handleCopy} style={{
              padding: '14px 20px', borderRadius: 14, cursor: 'pointer',
              background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.07)',
              border: copied ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.12)',
              color: copied ? '#34d399' : 'rgba(255,255,255,0.7)',
              fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
