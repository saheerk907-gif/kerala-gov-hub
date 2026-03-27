// src/components/pdf-editor/Toolbar.js
'use client';

const TOOL_GROUPS = [
  [
    { id: 'text',      label: '✏️ Text' },
    { id: 'whiteout',  label: '⬜ Whiteout' },
  ],
  [
    { id: 'rect',      label: '▭ Rect' },
    { id: 'circle',    label: '○ Circle' },
    { id: 'line',      label: '╱ Line' },
  ],
  [
    { id: 'draw',      label: '🖊 Draw' },
    { id: 'highlight', label: '🖍 Highlight' },
  ],
  [
    { id: 'sign',      label: '✍️ Sign' },
  ],
];

export default function Toolbar({ activeTool, onToolChange, onUndo, onRedo, canUndo, canRedo, isMobile }) {
  const btnPad  = isMobile ? '6px 10px' : '8px 16px';
  const btnSize = isMobile ? 11 : 13;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: isMobile ? '0 8px' : '0 16px',
        minHeight: isMobile ? 44 : 52,
        flexShrink: 0,
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {TOOL_GROUPS.map((group, gi) => (
        <span key={gi} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {gi > 0 && (
            <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          )}
          {group.map(tool => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: btnPad,
                fontSize: btnSize, fontWeight: 700,
                borderRadius: 10, cursor: 'pointer',
                transition: 'all 0.15s',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                background: activeTool === tool.id ? 'rgba(41,151,255,0.2)' : 'rgba(255,255,255,0.06)',
                color: activeTool === tool.id ? '#2997ff' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${activeTool === tool.id ? 'rgba(41,151,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: activeTool === tool.id ? '0 0 0 3px rgba(41,151,255,0.12)' : 'none',
              }}
            >
              {tool.label}
            </button>
          ))}
        </span>
      ))}

      <span style={{ flex: 1, minWidth: 8 }} />

      {/* Undo / Redo */}
      {[
        { label: '↩', title: 'Undo', onClick: onUndo, enabled: canUndo },
        { label: '↪', title: 'Redo', onClick: onRedo, enabled: canRedo },
      ].map(({ label, title, onClick, enabled }) => (
        <button
          key={title}
          title={title}
          onClick={onClick}
          disabled={!enabled}
          style={{
            padding: btnPad, fontSize: btnSize, fontWeight: 700,
            borderRadius: 10, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
            opacity: enabled ? 1 : 0.3, flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >{label} {title}</button>
      ))}
    </div>
  );
}
