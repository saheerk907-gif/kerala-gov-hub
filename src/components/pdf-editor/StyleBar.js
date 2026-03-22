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
      }}
    >
      {children}
    </button>
  );
}

export default function StyleBar({ style, onChange }) {
  return (
    <div
      className="flex items-center gap-3 flex-wrap"
      style={{
        position: 'sticky',
        bottom: 16,
        width: 'fit-content',
        margin: '0 auto',
        padding: '8px 16px',
        background: 'rgba(20,20,28,0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        zIndex: 10,
      }}
    >
      {/* Colour swatches */}
      <div className="flex items-center gap-1.5">
        {COLOURS.map(c => (
          <button
            key={c}
            onClick={() => onChange({ ...style, color: c })}
            className="border-none cursor-pointer transition-all"
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: c,
              border: `2px solid ${style.color === c ? '#fff' : 'transparent'}`,
              outline: c === '#ffffff' ? '1px solid rgba(255,255,255,0.3)' : 'none',
            }}
          />
        ))}
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />

      {/* Bold / Italic */}
      <div className="flex items-center gap-1">
        <ToggleBtn active={style.bold} onClick={() => onChange({ ...style, bold: !style.bold })}>
          B
        </ToggleBtn>
        <ToggleBtn active={style.italic} onClick={() => onChange({ ...style, italic: !style.italic })}>
          <em>I</em>
        </ToggleBtn>
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />

      {/* Font size */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-[800] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Aa</span>
        <input
          type="range" min={8} max={48} value={style.fontSize}
          onChange={e => onChange({ ...style, fontSize: Number(e.target.value) })}
          style={{ width: 72, accentColor: '#2997ff' }}
        />
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', minWidth: 26 }}>{style.fontSize}px</span>
      </div>

      <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />

      {/* Opacity */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-[800] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>opacity</span>
        <input
          type="range" min={10} max={100} value={Math.round(style.opacity * 100)}
          onChange={e => onChange({ ...style, opacity: Number(e.target.value) / 100 })}
          style={{ width: 72, accentColor: '#2997ff' }}
        />
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>{Math.round(style.opacity * 100)}%</span>
      </div>
    </div>
  );
}
