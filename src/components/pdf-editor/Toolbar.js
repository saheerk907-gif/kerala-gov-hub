// src/components/pdf-editor/Toolbar.js
'use client';

const TOOL_GROUPS = [
  [
    { id: 'text',      label: '✏️ Text' },
    { id: 'whiteout',  label: '⬜ Whiteout' },
  ],
  [
    { id: 'rect',      label: '🔲 Rectangle' },
    { id: 'circle',    label: '⭕ Circle' },
    { id: 'line',      label: '➖ Line' },
  ],
  [
    { id: 'draw',      label: '🖊️ Draw' },
    { id: 'highlight', label: '💬 Highlight' },
  ],
  [
    { id: 'sign',      label: '✍️ Sign' },
  ],
];

export default function Toolbar({ activeTool, onToolChange, onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div
      className="flex items-center gap-1 flex-wrap px-3 py-2 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {TOOL_GROUPS.map((group, gi) => (
        <span key={gi} className="flex items-center gap-1">
          {gi > 0 && (
            <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 3px', display: 'inline-block' }} />
          )}
          {group.map(tool => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className="flex items-center gap-1 font-[600] text-[11px] border-none cursor-pointer rounded-[10px] transition-all"
              style={{
                padding: '6px 12px',
                background: activeTool === tool.id ? 'rgba(41,151,255,0.18)' : 'rgba(255,255,255,0.05)',
                color: activeTool === tool.id ? '#2997ff' : 'rgba(255,255,255,0.55)',
                border: `1px solid ${activeTool === tool.id ? 'rgba(41,151,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {tool.label}
            </button>
          ))}
        </span>
      ))}

      <span style={{ flex: 1 }} />

      {/* Undo / Redo */}
      {[
        { label: '↩ Undo', action: onUndo, enabled: canUndo },
        { label: '↪ Redo', action: onRedo, enabled: canRedo },
      ].map(({ label, action, enabled }) => (
        <button
          key={label}
          onClick={action}
          disabled={!enabled}
          className="font-[600] text-[11px] border-none cursor-pointer rounded-[10px] transition-all disabled:opacity-30"
          style={{ padding: '6px 12px', background: 'transparent', color: 'rgba(255,255,255,0.35)' }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
