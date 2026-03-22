// src/components/pdf-editor/StyleBar.js
'use client';

const COLOURS = [
  { hex: '#000000', label: 'Black' },
  { hex: '#1a1a2e', label: 'Dark Blue' },
  { hex: '#2997ff', label: 'Blue' },
  { hex: '#ff453a', label: 'Red' },
  { hex: '#30d158', label: 'Green' },
  { hex: '#ff9f0a', label: 'Orange' },
  { hex: '#bf5af2', label: 'Purple' },
  { hex: '#ffffff', label: 'White' },
];

const Divider = () => (
  <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)', margin: '0 2px', flexShrink: 0 }} />
);

export default function StyleBar({ style, onChange, isMobile }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 14,
        margin: isMobile ? '10px 0 0' : '16px auto 0',
        width: isMobile ? '100%' : 'fit-content',
        maxWidth: '100%',
        background: 'rgba(22,22,32,0.97)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 18,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'stretch',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        height: 52,
        padding: '0 4px',
      }}
    >

      {/* ── Color swatches ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', marginRight: 2 }}>COLOR</span>
        {COLOURS.map(({ hex, label }) => (
          <button
            key={hex}
            title={label}
            onClick={() => onChange({ ...style, color: hex })}
            style={{
              width: style.color === hex ? 26 : 22,
              height: style.color === hex ? 26 : 22,
              borderRadius: '50%',
              background: hex,
              border: style.color === hex
                ? '3px solid #2997ff'
                : hex === '#ffffff' ? '1.5px solid rgba(255,255,255,0.25)' : '2px solid transparent',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s',
              boxShadow: style.color === hex ? '0 0 0 2px rgba(41,151,255,0.35)' : 'none',
            }}
          />
        ))}
      </div>

      <Divider />

      {/* ── Bold / Italic ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 10px', flexShrink: 0 }}>
        {[
          { key: 'bold',   label: 'B', style: { fontWeight: 900, fontSize: 15 } },
          { key: 'italic', label: 'I', style: { fontStyle: 'italic', fontWeight: 700, fontSize: 15 } },
        ].map(({ key, label, style: btnStyle }) => (
          <button
            key={key}
            title={key === 'bold' ? 'Bold' : 'Italic'}
            onClick={() => onChange({ ...style, [key]: !style[key] })}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              border: style[key]
                ? '1.5px solid rgba(41,151,255,0.7)'
                : '1.5px solid rgba(255,255,255,0.1)',
              background: style[key]
                ? 'rgba(41,151,255,0.22)'
                : 'rgba(255,255,255,0.05)',
              color: style[key] ? '#2997ff' : 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: style[key] ? '0 0 0 3px rgba(41,151,255,0.14)' : 'none',
              transition: 'all 0.15s',
              flexShrink: 0,
              ...btnStyle,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <Divider />

      {/* ── Font size ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>SIZE</span>
        <button
          onClick={() => onChange({ ...style, fontSize: Math.max(8, style.fontSize - 2) })}
          style={{
            width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
            fontSize: 16, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >−</button>
        <span style={{
          minWidth: 42, textAlign: 'center',
          fontSize: 14, fontWeight: 800, color: '#fff',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 8, padding: '4px 6px',
        }}>
          {style.fontSize}
        </span>
        <button
          onClick={() => onChange({ ...style, fontSize: Math.min(72, style.fontSize + 2) })}
          style={{
            width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
            fontSize: 16, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
      </div>

      <Divider />

      {/* ── Opacity ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
          {isMobile ? 'OPC' : 'OPACITY'}
        </span>
        <input
          type="range" min={10} max={100} value={Math.round(style.opacity * 100)}
          onChange={e => onChange({ ...style, opacity: Number(e.target.value) / 100 })}
          style={{ width: isMobile ? 64 : 80, accentColor: '#2997ff', cursor: 'pointer' }}
        />
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#fff',
          minWidth: 36, textAlign: 'center',
          background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 6px',
        }}>
          {Math.round(style.opacity * 100)}%
        </span>
      </div>

    </div>
  );
}
