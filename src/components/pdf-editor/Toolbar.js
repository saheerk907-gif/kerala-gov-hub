// src/components/pdf-editor/Toolbar.js
'use client';

const TOOL_GROUPS = [
  [
    { id: 'text',      label: '✏️ Text' },
    { id: 'whiteout',  label: '⬜ Whiteout' },
  ],
  [
    { id: 'rect',      label: '▭ Rectangle' },
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

export default function Toolbar({ activeTool, onToolChange, onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div
      className="flex items-center gap-1.5 flex-wrap px-4 flex-shrink-0"
      style={{
        minHeight: 52,
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {TOOL_GROUPS.map((group, gi) => (
        <span key={gi} className="flex items-center gap-1.5">
          {gi > 0 && (
            <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 4px', display: 'inline-block', flexShrink: 0 }} />
          )}
          {group.map(tool => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                fontSize: 13, fontWeight: 700,
                borderRadius: 10, cursor: 'pointer',
                transition: 'all 0.15s',
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

      <span style={{ flex: 1 }} />

      <button
        onClick={onUndo} disabled={!canUndo}
        style={{
          padding: '8px 14px', fontSize: 13, fontWeight: 700,
          borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
          opacity: canUndo ? 1 : 0.3,
        }}
      >↩ Undo</button>
      <button
        onClick={onRedo} disabled={!canRedo}
        style={{
          padding: '8px 14px', fontSize: 13, fontWeight: 700,
          borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
          opacity: canRedo ? 1 : 0.3,
        }}
      >↪ Redo</button>
    </div>
  );
}
