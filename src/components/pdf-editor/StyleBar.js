// src/components/pdf-editor/StyleBar.js
'use client';

const COLOURS = ['#000000','#2997ff','#ff453a','#30d158','#ff9f0a','#ffffff'];

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 800,
        border: `1px solid ${active ? 'rgba(41,151,255,0.6)' : 'rgba(255,255,255,0.12)'}`,
        background: active ? 'rgba(41,151,255,0.2)' : 'rgba(255,255,255,0.06)',
        color: active ? '#2997ff' : 'rgba(255,255,255,0.55)',
        boxShadow: active ? '0 0 0 2px rgba(41,151,255,0.15)' : 'none',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

export default function StyleBar({ style, onChange, isMobile }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 16,
        /* On mobile: stretch full width and scroll horizontally */
        width: isMobile ? 'calc(100% - 8px)' : 'fit-content',
        maxWidth: '100%',
        margin: isMobile ? '12px auto 0' : '0 auto',
        padding: '8px 14px',
        background: 'rgba(20,20,28,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 10,
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        flexWrap: 'nowrap',
      }}
    >
      {/* Colour swatches */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {COLOURS.map(c => (
          <button
            key={c}
            onClick={() => onChange({ ...style, color: c })}
            style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: c, cursor: 'pointer', border: 'none',
              outline: style.color === c
                ? '2px solid #fff'
                : c === '#ffffff' ? '1px solid rgba(255,255,255,0.3)' : '2px solid transparent',
              outlineOffset: 2,
            }}
          />
        ))}
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* Bold / Italic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <ToggleBtn active={style.bold} onClick={() => onChange({ ...style, bold: !style.bold })}>
          B
        </ToggleBtn>
        <ToggleBtn active={style.italic} onClick={() => onChange({ ...style, italic: !style.italic })}>
          <em>I</em>
        </ToggleBtn>
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* Font size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>Aa</span>
        <input
          type="range" min={8} max={48} value={style.fontSize}
          onChange={e => onChange({ ...style, fontSize: Number(e.target.value) })}
          style={{ width: isMobile ? 60 : 72, accentColor: '#2997ff' }}
        />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', minWidth: 26 }}>{style.fontSize}px</span>
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* Opacity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>
          {isMobile ? '%' : 'opacity'}
        </span>
        <input
          type="range" min={10} max={100} value={Math.round(style.opacity * 100)}
          onChange={e => onChange({ ...style, opacity: Number(e.target.value) / 100 })}
          style={{ width: isMobile ? 60 : 72, accentColor: '#2997ff' }}
        />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>{Math.round(style.opacity * 100)}%</span>
      </div>
    </div>
  );
}
