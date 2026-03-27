# PDF Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully client-side PDF editor at `/tools/pdf-editor` with text, whiteout, shapes, draw, highlight, signature tools and PDF download.

**Architecture:** `page.js` is a server component (metadata only). `PdfEditorClient.js` owns all state. PDF.js renders pages onto canvases; a transparent overlay canvas captures pointer interactions and stores annotations. On download, pdf-lib flattens annotations into the PDF — text as native PDF text, everything else rasterised as PNG.

**Tech Stack:** Next.js 14 App Router, `pdfjs-dist`, `pdf-lib`, HTML5 Canvas API, Pointer Events API

**Spec:** `docs/superpowers/specs/2026-03-22-pdf-editor-design.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Install | `package.json` | Add pdfjs-dist, pdf-lib |
| Create | `src/app/tools/pdf-editor/page.js` | Server component, metadata |
| Create | `src/app/tools/pdf-editor/PdfEditorClient.js` | `'use client'` — upload vs editor state |
| Create | `src/components/pdf-editor/UploadZone.js` | Drop zone UI |
| Create | `src/components/pdf-editor/EditorShell.js` | Full-viewport layout wrapper |
| Create | `src/components/pdf-editor/Toolbar.js` | Tool selector row |
| Create | `src/components/pdf-editor/PageThumbnails.js` | Left sidebar thumbnails |
| Create | `src/components/pdf-editor/PdfCanvas.js` | PDF.js render + overlay + tool handlers |
| Create | `src/components/pdf-editor/StyleBar.js` | Floating colour/size/opacity pill |
| Create | `src/components/pdf-editor/SignModal.js` | Signature drawing modal |
| Create | `src/hooks/usePdfEditor.js` | Annotations map, undo/redo, active tool, style |
| Create | `src/hooks/usePdfDownload.js` | pdf-lib flatten + browser download |
| Modify | `src/components/ToolsSection.js` | Add PDF Editor card to tools array |

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Install pdfjs-dist and pdf-lib**

```bash
cd "/home/saheer-anas-k/kerala-gov-hub-main "
npm install pdfjs-dist pdf-lib
```

- [ ] **Verify installation**

```bash
node -e "require('pdfjs-dist'); require('pdf-lib'); console.log('OK')"
```
Expected: `OK`

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install pdfjs-dist and pdf-lib for PDF editor"
```

---

## Task 2: Page route + metadata (server component)

**Files:**
- Create: `src/app/tools/pdf-editor/page.js`
- Create: `src/app/tools/pdf-editor/PdfEditorClient.js` (stub)

- [ ] **Create the server page**

```js
// src/app/tools/pdf-editor/page.js
import PdfEditorClient from './PdfEditorClient';

export const metadata = {
  title: 'PDF Editor — Kerala Gov Employee Hub',
  description: 'Edit, annotate, whiteout and sign PDF documents online. All processing happens in your browser — your files are never uploaded.',
  keywords: ['PDF editor', 'PDF annotate', 'PDF sign', 'whiteout PDF', 'Kerala government'],
};

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
```

- [ ] **Create stub client component**

```js
// src/app/tools/pdf-editor/PdfEditorClient.js
'use client';

export default function PdfEditorClient() {
  return <div style={{ color: 'white', padding: 40 }}>PDF Editor — coming soon</div>;
}
```

- [ ] **Verify page loads**

Run `npm run dev`, open `http://localhost:3000/tools/pdf-editor` — should see "PDF Editor — coming soon".

- [ ] **Commit**

```bash
git add src/app/tools/pdf-editor/
git commit -m "feat: add /tools/pdf-editor route with metadata"
```

---

## Task 3: usePdfEditor hook — state management

**Files:**
- Create: `src/hooks/usePdfEditor.js`

- [ ] **Create the hook**

```js
// src/hooks/usePdfEditor.js
'use client';
import { useState, useCallback } from 'react';

export const TOOLS = ['text','whiteout','rect','circle','line','draw','highlight','sign'];

export default function usePdfEditor() {
  const [annotations, setAnnotations] = useState(new Map()); // pageIndex -> Annotation[]
  const [undoStack,   setUndoStack]   = useState(new Map()); // pageIndex -> Annotation[][]
  const [redoStack,   setRedoStack]   = useState(new Map()); // pageIndex -> Annotation[][]
  const [activeTool,  setActiveTool]  = useState('text');
  const [currentPage, setCurrentPage] = useState(0);
  const [style, setStyle] = useState({ color: '#000000', fontSize: 14, opacity: 1 });

  const getPageAnnotations = useCallback((pageIndex) =>
    annotations.get(pageIndex) || [], [annotations]);

  const addAnnotation = useCallback((pageIndex, annotation) => {
    setAnnotations(prev => {
      const next = new Map(prev);
      const page = next.get(pageIndex) || [];
      next.set(pageIndex, [...page, { ...annotation, id: crypto.randomUUID() }]);
      return next;
    });
    // push snapshot to undo stack, clear redo
    setUndoStack(prev => {
      const next = new Map(prev);
      const stack = next.get(pageIndex) || [];
      next.set(pageIndex, [...stack, getPageAnnotations(pageIndex)]);
      return next;
    });
    setRedoStack(prev => { const n = new Map(prev); n.delete(pageIndex); return n; });
  }, [getPageAnnotations]);

  const undo = useCallback((pageIndex) => {
    setUndoStack(prev => {
      const stack = prev.get(pageIndex) || [];
      if (!stack.length) return prev;
      const snapshot = stack[stack.length - 1];
      const next = new Map(prev);
      next.set(pageIndex, stack.slice(0, -1));
      // save current to redo
      setRedoStack(r => {
        const rn = new Map(r);
        rn.set(pageIndex, [...(r.get(pageIndex) || []), getPageAnnotations(pageIndex)]);
        return rn;
      });
      setAnnotations(a => { const an = new Map(a); an.set(pageIndex, snapshot); return an; });
      return next;
    });
  }, [getPageAnnotations]);

  const redo = useCallback((pageIndex) => {
    setRedoStack(prev => {
      const stack = prev.get(pageIndex) || [];
      if (!stack.length) return prev;
      const snapshot = stack[stack.length - 1];
      const next = new Map(prev);
      next.set(pageIndex, stack.slice(0, -1));
      setUndoStack(u => {
        const un = new Map(u);
        un.set(pageIndex, [...(u.get(pageIndex) || []), getPageAnnotations(pageIndex)]);
        return un;
      });
      setAnnotations(a => { const an = new Map(a); an.set(pageIndex, snapshot); return an; });
      return next;
    });
  }, [getPageAnnotations]);

  const clearAll = useCallback(() => {
    setAnnotations(new Map());
    setUndoStack(new Map());
    setRedoStack(new Map());
    setCurrentPage(0);
  }, []);

  return {
    annotations, activeTool, setActiveTool,
    currentPage, setCurrentPage,
    style, setStyle,
    getPageAnnotations, addAnnotation,
    undo, redo, clearAll,
    canUndo: (pageIndex) => (undoStack.get(pageIndex) || []).length > 0,
    canRedo: (pageIndex) => (redoStack.get(pageIndex) || []).length > 0,
  };
}
```

- [ ] **Commit**

```bash
git add src/hooks/usePdfEditor.js
git commit -m "feat: add usePdfEditor hook with annotations and undo/redo"
```

---

## Task 4: UploadZone component

**Files:**
- Create: `src/components/pdf-editor/UploadZone.js`

- [ ] **Create UploadZone**

```js
// src/components/pdf-editor/UploadZone.js
'use client';
import { useRef, useState } from 'react';

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export default function UploadZone({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  function handleFile(file) {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a valid PDF file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File too large (max 50 MB).');
      return;
    }
    onFile(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="px-4 md:px-6 max-w-[860px] mx-auto pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-2">Tools</div>
        <h1 className="text-[clamp(26px,4vw,40px)] font-[900] text-white tracking-[-0.02em]">
          PDF Editor
        </h1>
        <p className="text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>
          Edit, annotate and sign PDFs — everything stays in your browser
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-[28px] transition-all duration-300"
        style={{
          border: `2px dashed ${dragging ? 'rgba(41,151,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
          background: dragging ? 'rgba(41,151,255,0.05)' : 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(16px)',
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>📄</div>
        <div className="text-[22px] font-[800] text-white mb-2">Drop your PDF here</div>
        <div className="text-[14px] mb-8" style={{ color: 'var(--text-muted)' }}>
          Drag & drop any PDF file to get started
        </div>
        <div className="text-[12px] mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>— OR —</div>
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="text-white font-[700] text-[15px] border-none cursor-pointer"
          style={{ background: '#2997ff', padding: '14px 36px', borderRadius: 14 }}
        >
          📂 Choose PDF File
        </button>
        <div className="text-[11px] mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Supports PDF files up to 50 MB
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 text-[13px] px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,69,58,0.1)', color: '#ff453a' }}>
          {error}
        </div>
      )}

      {/* Privacy badge */}
      <div className="mt-5 flex items-center justify-center gap-2 py-4 rounded-[16px]"
        style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)' }}>
        <span className="text-[13px] font-[600]" style={{ color: 'rgba(48,209,88,0.85)' }}>
          🔒 Your files never leave your device — all editing happens locally in the browser
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Wire into PdfEditorClient and smoke-test**

Update `PdfEditorClient.js`:

```js
'use client';
import { useState } from 'react';
import UploadZone from '@/components/pdf-editor/UploadZone';

export default function PdfEditorClient() {
  const [file, setFile] = useState(null);
  if (!file) return <UploadZone onFile={setFile} />;
  return <div style={{ color: 'white', padding: 40 }}>File: {file.name}</div>;
}
```

Open `http://localhost:3000/tools/pdf-editor` — drop zone should appear, choosing a PDF should show the filename.

- [ ] **Commit**

```bash
git add src/components/pdf-editor/UploadZone.js src/app/tools/pdf-editor/PdfEditorClient.js
git commit -m "feat: add PDF upload drop zone"
```

---

## Task 5: Toolbar component

**Files:**
- Create: `src/components/pdf-editor/Toolbar.js`

- [ ] **Create Toolbar**

```js
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
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/Toolbar.js
git commit -m "feat: add PDF editor toolbar component"
```

---

## Task 6: StyleBar component

**Files:**
- Create: `src/components/pdf-editor/StyleBar.js`

- [ ] **Create StyleBar**

```js
// src/components/pdf-editor/StyleBar.js
'use client';

const COLOURS = ['#000000','#2997ff','#ff453a','#30d158','#ff9f0a','#ffffff'];

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
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/StyleBar.js
git commit -m "feat: add floating StyleBar component"
```

---

## Task 7: SignModal component

**Files:**
- Create: `src/components/pdf-editor/SignModal.js`

- [ ] **Create SignModal**

```js
// src/components/pdf-editor/SignModal.js
'use client';
import { useRef, useEffect, useState } from 'react';

export default function SignModal({ onConfirm, onClose }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [src.clientX - rect.left, src.clientY - rect.top];
  }

  function onDown(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [x, y] = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setHasStrokes(true);
  }

  function onMove(e) {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [x, y] = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function onUp(e) { e.preventDefault(); setDrawing(false); }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  }

  function confirm() {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onConfirm(dataUrl);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-[24px] p-6 w-[420px] max-w-[95vw]"
        style={{ background: '#1a1a1e', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-[800] text-white">Draw your signature</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white border-none bg-transparent cursor-pointer text-lg">✕</button>
        </div>

        <canvas
          ref={canvasRef}
          width={380} height={160}
          className="w-full rounded-[12px] border cursor-crosshair touch-none"
          style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#fff' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={clear}
            className="flex-1 py-3 rounded-[12px] text-[13px] font-[700] border-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
          >
            Clear
          </button>
          <button
            onClick={confirm}
            disabled={!hasStrokes}
            className="flex-1 py-3 rounded-[12px] text-[13px] font-[700] text-white border-none cursor-pointer disabled:opacity-40"
            style={{ background: '#2997ff' }}
          >
            Place Signature
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/SignModal.js
git commit -m "feat: add signature drawing modal"
```

---

## Task 8: PageThumbnails component

**Files:**
- Create: `src/components/pdf-editor/PageThumbnails.js`

- [ ] **Create PageThumbnails**

```js
// src/components/pdf-editor/PageThumbnails.js
'use client';
import { useEffect, useRef } from 'react';

export default function PageThumbnails({ pdfDoc, pageCount, currentPage, onPageChange }) {
  const refs = useRef([]); // array of canvas refs

  useEffect(() => {
    if (!pdfDoc) return;
    async function renderThumbs() {
      for (let i = 0; i < pageCount; i++) {
        const canvas = refs.current[i];
        if (!canvas) continue;
        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.2 });
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      }
    }
    renderThumbs();
  }, [pdfDoc, pageCount]);

  return (
    <div
      className="flex flex-col items-center gap-2 py-3 overflow-y-auto flex-shrink-0"
      style={{
        width: 76,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className="border-none cursor-pointer rounded-[7px] overflow-hidden transition-all p-0"
          style={{
            width: 54, minHeight: 70,
            border: `1.5px solid ${currentPage === i ? '#2997ff' : 'rgba(255,255,255,0.07)'}`,
            background: currentPage === i ? 'rgba(41,151,255,0.08)' : 'rgba(255,255,255,0.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <canvas
            ref={el => refs.current[i] = el}
            style={{ width: '100%', display: 'block', borderRadius: 4 }}
          />
          <span className="text-[9px] mt-1" style={{ color: currentPage === i ? '#2997ff' : 'rgba(255,255,255,0.3)' }}>
            {i + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/PageThumbnails.js
git commit -m "feat: add page thumbnails sidebar"
```

---

## Task 9: PdfCanvas — rendering + annotations + tools

**Files:**
- Create: `src/components/pdf-editor/PdfCanvas.js`

This is the core component. It renders the PDF page, draws existing annotations on the overlay, and handles all pointer tool interactions.

- [ ] **Create PdfCanvas**

```js
// src/components/pdf-editor/PdfCanvas.js
'use client';
import { useEffect, useRef, useCallback, useState } from 'react';

export default function PdfCanvas({
  pdfDoc, pageIndex, annotations, onAddAnnotation,
  activeTool, style, onSignRequest,
}) {
  const containerRef  = useRef(null);
  const pdfCanvasRef  = useRef(null);
  const overlayRef    = useRef(null);
  const textareaRef   = useRef(null);
  const [viewport, setViewport] = useState(null);
  const [pdfDims, setPdfDims]   = useState({ w: 0, h: 0 }); // PDF point dims
  const drawing = useRef(false);
  const startPt = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]);
  const pendingText = useRef(null); // { x, y }

  // Render PDF page
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    async function render() {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const dpr  = window.devicePixelRatio || 1;
      const vp   = page.getViewport({ scale: 1.5 * dpr });
      const canvas = pdfCanvasRef.current;
      const overlay = overlayRef.current;
      if (!canvas || !overlay || cancelled) return;
      canvas.width  = overlay.width  = vp.width;
      canvas.height = overlay.height = vp.height;
      canvas.style.width  = overlay.style.width  = `${vp.width  / dpr}px`;
      canvas.style.height = overlay.style.height = `${vp.height / dpr}px`;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      setViewport(vp);
      setPdfDims({ w: page.getWidth(), h: page.getHeight() });
    }
    render();
    return () => { cancelled = true; };
  }, [pdfDoc, pageIndex]);

  // Redraw overlay annotations
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !viewport) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dpr = window.devicePixelRatio || 1;

    for (const ann of annotations) {
      ctx.save();
      ctx.globalAlpha = ann.opacity;

      const sx = canvas.width  / (viewport.width  / dpr);
      const sy = canvas.height / (viewport.height / dpr);

      if (ann.type === 'text') {
        ctx.font = `${ann.fontSize * (canvas.width / (viewport.width / dpr))}px sans-serif`;
        ctx.fillStyle = ann.color;
        ctx.fillText(ann.text, ann.x * sx, ann.y * sy);
      } else if (ann.type === 'whiteout') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ann.x * sx, ann.y * sy, ann.width * sx, ann.height * sy);
      } else if (ann.type === 'rect') {
        ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
        ctx.strokeRect(ann.x * sx, ann.y * sy, ann.width * sx, ann.height * sy);
      } else if (ann.type === 'circle') {
        ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
          (ann.x + ann.width / 2) * sx, (ann.y + ann.height / 2) * sy,
          Math.abs(ann.width / 2) * sx, Math.abs(ann.height / 2) * sy, 0, 0, Math.PI * 2
        );
        ctx.stroke();
      } else if (ann.type === 'line') {
        ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ann.x * sx, ann.y * sy);
        ctx.lineTo((ann.x + ann.width) * sx, (ann.y + ann.height) * sy);
        ctx.stroke();
      } else if (ann.type === 'draw') {
        ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ann.points.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(px * sx, py * sy);
          else ctx.lineTo(px * sx, py * sy);
        });
        ctx.stroke();
      } else if (ann.type === 'highlight') {
        ctx.fillStyle = ann.color || '#ffff00';
        ctx.globalAlpha = 0.35;
        ctx.fillRect(ann.x * sx, ann.y * sy, ann.width * sx, ann.height * sy);
      } else if (ann.type === 'sign') {
        const img = new Image();
        img.src = ann.imageDataUrl;
        img.onload = () => ctx.drawImage(img, ann.x * sx, ann.y * sy, ann.width * sx, ann.height * sy);
      }
      ctx.restore();
    }
  }, [annotations, viewport]);

  function getCanvasCoords(e) {
    const canvas = overlayRef.current;
    const rect   = canvas.getBoundingClientRect();
    const dpr    = window.devicePixelRatio || 1;
    const src    = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left),
      y: (src.clientY - rect.top),
    };
  }

  function onPointerDown(e) {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'sign') {
      onSignRequest({ x, y });
      return;
    }

    if (activeTool === 'text') {
      // commit any existing textarea first
      commitTextarea();
      pendingText.current = { x, y };
      // position & show textarea
      const canvas = overlayRef.current;
      const rect   = canvas.getBoundingClientRect();
      const ta = textareaRef.current;
      ta.style.left    = `${rect.left + x}px`;
      ta.style.top     = `${rect.top  + y}px`;
      ta.style.fontSize = `${style.fontSize}px`;
      ta.style.color   = style.color;
      ta.style.display = 'block';
      ta.value = '';
      ta.focus();
      return;
    }

    drawing.current = true;
    startPt.current = { x, y };
    currentPath.current = [[x, y]];
  }

  function onPointerMove(e) {
    e.preventDefault();
    if (!drawing.current) return;
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'draw') {
      currentPath.current.push([x, y]);
      // live preview
      const canvas = overlayRef.current;
      const ctx = canvas.getContext('2d');
      const pts = currentPath.current;
      if (pts.length < 2) return;
      const dpr = window.devicePixelRatio || 1;
      const sx = canvas.width / (viewport.width / dpr);
      const sy = canvas.height / (viewport.height / dpr);
      ctx.strokeStyle = style.color; ctx.lineWidth = 2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2][0] * sx, pts[pts.length - 2][1] * sy);
      ctx.lineTo(pts[pts.length - 1][0] * sx, pts[pts.length - 1][1] * sy);
      ctx.stroke();
    }
  }

  function onPointerUp(e) {
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;
    const { x, y } = getCanvasCoords(e);
    const { x: sx, y: sy } = startPt.current;

    const base = { color: style.color, opacity: style.opacity, fontSize: style.fontSize };

    if (activeTool === 'draw') {
      onAddAnnotation({ type: 'draw', x: 0, y: 0, width: 0, height: 0, points: currentPath.current, ...base });
    } else if (['whiteout','rect','circle','line','highlight'].includes(activeTool)) {
      onAddAnnotation({
        type: activeTool,
        x: Math.min(sx, x), y: Math.min(sy, y),
        width: Math.abs(x - sx), height: Math.abs(y - sy),
        points: [],
        ...base,
        ...(activeTool === 'highlight' ? { color: '#ffff00', opacity: 0.35 } : {}),
      });
    }
  }

  function commitTextarea() {
    const ta = textareaRef.current;
    if (!ta || ta.style.display === 'none' || !ta.value.trim()) {
      if (ta) ta.style.display = 'none';
      return;
    }
    const { x, y } = pendingText.current;
    onAddAnnotation({
      type: 'text', x, y, width: 0, height: 0, points: [],
      text: ta.value, color: style.color, fontSize: style.fontSize, opacity: style.opacity,
    });
    ta.value = '';
    ta.style.display = 'none';
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* PDF render canvas */}
      <canvas ref={pdfCanvasRef} style={{ display: 'block', borderRadius: 6 }} />

      {/* Annotation overlay */}
      <canvas
        ref={overlayRef}
        style={{ position: 'absolute', top: 0, left: 0, touchAction: 'none', cursor: activeTool === 'text' ? 'text' : 'crosshair' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />

      {/* Text input (floats over page at pointer position) */}
      <textarea
        ref={textareaRef}
        onBlur={commitTextarea}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitTextarea(); } }}
        style={{
          display: 'none', position: 'fixed', zIndex: 50,
          minWidth: 120, minHeight: 28,
          background: 'rgba(255,255,255,0.9)', border: '1px dashed #2997ff',
          borderRadius: 4, padding: '2px 6px', outline: 'none', resize: 'none',
          fontFamily: 'sans-serif',
        }}
      />
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/PdfCanvas.js
git commit -m "feat: add PdfCanvas with PDF.js rendering and annotation overlay"
```

---

## Task 10: usePdfDownload hook

**Files:**
- Create: `src/hooks/usePdfDownload.js`

- [ ] **Create download hook**

```js
// src/hooks/usePdfDownload.js
'use client';
import { useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return rgb(r, g, b);
}

export default function usePdfDownload() {
  const download = useCallback(async (originalFile, annotationsMap, viewportRef) => {
    try {
      const arrayBuffer = await originalFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages  = pdfDoc.getPages();
      const font   = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const [pageIndex, anns] of annotationsMap.entries()) {
        if (!anns || !anns.length) continue;
        const page = pages[pageIndex];
        if (!page) continue;
        const pdfW = page.getWidth();
        const pdfH = page.getHeight();

        // Annotations are stored in overlay canvas px at 1× DPR (CSS px).
        // PdfCanvas renders at RENDER_SCALE=1.5, so 1 CSS px = 1/1.5 PDF points.
        const RENDER_SCALE = 1.5;
        const scaleX = 1 / RENDER_SCALE;
        const scaleY = 1 / RENDER_SCALE;

        for (const ann of anns) {
          const pdfX = ann.x * scaleX;
          const pdfY = pdfH - ann.y * scaleY - (ann.height || 0) * scaleY;

          if (ann.type === 'text') {
            page.drawText(ann.text || '', {
              x: pdfX, y: pdfH - ann.y * scaleY,
              size: (ann.fontSize || 14) * scaleX,
              font, color: hexToRgb(ann.color || '#000000'),
              opacity: ann.opacity ?? 1,
            });
          } else if (ann.type === 'sign' && ann.imageDataUrl) {
            const imgBytes = await fetch(ann.imageDataUrl).then(r => r.arrayBuffer());
            const img = await pdfDoc.embedPng(imgBytes);
            page.drawImage(img, { x: pdfX, y: pdfY, width: ann.width * scaleX, height: ann.height * scaleY, opacity: ann.opacity ?? 1 });
          } else {
            // Rasterise: draw annotation onto a temp canvas, embed as PNG
            const tmp = document.createElement('canvas');
            tmp.width  = Math.max(1, Math.round(ann.width  * scaleX));
            tmp.height = Math.max(1, Math.round(ann.height * scaleY));
            if (tmp.width < 1 || tmp.height < 1) continue;
            const ctx = tmp.getContext('2d');
            ctx.globalAlpha = ann.opacity ?? 1;

            if (ann.type === 'whiteout') {
              ctx.fillStyle = '#fff'; ctx.fillRect(0,0,tmp.width,tmp.height);
            } else if (ann.type === 'rect') {
              ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.strokeRect(1,1,tmp.width-2,tmp.height-2);
            } else if (ann.type === 'circle') {
              ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.ellipse(tmp.width/2,tmp.height/2,tmp.width/2-1,tmp.height/2-1,0,0,Math.PI*2); ctx.stroke();
            } else if (ann.type === 'highlight') {
              ctx.fillStyle = '#ffff00'; ctx.globalAlpha = 0.35; ctx.fillRect(0,0,tmp.width,tmp.height);
            } else if (ann.type === 'draw') {
              ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
              const ox = Math.min(...ann.points.map(p=>p[0]));
              const oy = Math.min(...ann.points.map(p=>p[1]));
              const scX = tmp.width  / (ann.width  || 1);
              const scY = tmp.height / (ann.height || 1);
              ctx.beginPath();
              ann.points.forEach(([px,py],i) => {
                const cx=(px-ox)*scX, cy=(py-oy)*scY;
                i===0 ? ctx.moveTo(cx,cy) : ctx.lineTo(cx,cy);
              });
              ctx.stroke();
            } else if (ann.type === 'line') {
              ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(tmp.width,tmp.height); ctx.stroke();
            }

            const pngUrl   = tmp.toDataURL('image/png');
            const pngBytes = await fetch(pngUrl).then(r => r.arrayBuffer());
            const pngImg   = await pdfDoc.embedPng(pngBytes);
            page.drawImage(pngImg, { x: pdfX, y: pdfY, width: ann.width * scaleX, height: ann.height * scaleY });
          }
        }
      }

      const bytes = await pdfDoc.save();
      const blob  = new Blob([bytes], { type: 'application/pdf' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href = url; a.download = 'edited.pdf'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return { ok: true };
    } catch (err) {
      console.error('PDF download error', err);
      return { ok: false, error: err.message };
    }
  }, []);

  return { download };
}
```

- [ ] **Commit**

```bash
git add src/hooks/usePdfDownload.js
git commit -m "feat: add usePdfDownload hook with pdf-lib flattening"
```

---

## Task 11: EditorShell — full-viewport layout

**Files:**
- Create: `src/components/pdf-editor/EditorShell.js`

- [ ] **Create EditorShell**

```js
// src/components/pdf-editor/EditorShell.js
'use client';
import { useRef, useState } from 'react';
import Toolbar from './Toolbar';
import PageThumbnails from './PageThumbnails';
import PdfCanvas from './PdfCanvas';
import StyleBar from './StyleBar';
import SignModal from './SignModal';

export default function EditorShell({
  file, pdfDoc, pageCount,
  annotations, onAddAnnotation,
  activeTool, setActiveTool,
  currentPage, setCurrentPage,
  style, setStyle,
  onUndo, onRedo, canUndo, canRedo,
  onOpenNew, onDownload,
}) {
  const [showSign, setShowSign] = useState(false);
  const [signPos,  setSignPos]  = useState({ x: 0, y: 0 });
  const [dlError,  setDlError]  = useState(null);

  function handleSignRequest(pos) { setSignPos(pos); setShowSign(true); }
  function handleSignConfirm(dataUrl) {
    onAddAnnotation(currentPage, {
      type: 'sign', x: signPos.x, y: signPos.y,
      width: 200, height: 80,
      imageDataUrl: dataUrl, color: '#000', opacity: 1, fontSize: 14,
    });
    setShowSign(false);
  }

  async function handleDownload() {
    setDlError(null);
    const result = await onDownload();
    if (!result?.ok) setDlError('Download failed. Please try again.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          height: 48, background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span className="text-[14px] font-[900] text-white">PDF Editor</span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{file?.name}</span>
        <span style={{ flex: 1 }} />
        {dlError && <span className="text-[11px]" style={{ color: '#ff453a' }}>{dlError}</span>}
        <button
          onClick={onOpenNew}
          className="text-[11px] font-[700] border-none cursor-pointer rounded-[10px] px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
        >
          📂 Open New
        </button>
        <button
          onClick={handleDownload}
          className="text-[11px] font-[700] border-none cursor-pointer rounded-[10px] px-3 py-1.5"
          style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158', border: '1px solid rgba(48,209,88,0.3)' }}
        >
          ⬇ Download PDF
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={() => onUndo(currentPage)}
        onRedo={() => onRedo(currentPage)}
        canUndo={canUndo(currentPage)}
        canRedo={canRedo(currentPage)}
      />

      {/* Body: thumbnails + canvas */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PageThumbnails
          pdfDoc={pdfDoc}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {/* Scrollable canvas area */}
        <div
          style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 32px 80px',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div data-page-index={currentPage}>
            <PdfCanvas
              pdfDoc={pdfDoc}
              pageIndex={currentPage}
              annotations={annotations.get(currentPage) || []}
              onAddAnnotation={(ann) => onAddAnnotation(currentPage, ann)}
              activeTool={activeTool}
              style={style}
              onSignRequest={handleSignRequest}
            />
          </div>

          <StyleBar style={style} onChange={setStyle} />
        </div>
      </div>

      {/* Privacy bar */}
      <div
        className="text-center flex-shrink-0 py-1.5"
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        🔒 All processing happens locally in your browser — no file is uploaded to any server
      </div>

      {showSign && (
        <SignModal onConfirm={handleSignConfirm} onClose={() => setShowSign(false)} />
      )}
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/pdf-editor/EditorShell.js
git commit -m "feat: add EditorShell full-viewport layout"
```

---

## Task 12: PdfEditorClient — wire everything together

**Files:**
- Modify: `src/app/tools/pdf-editor/PdfEditorClient.js`

- [ ] **Update PdfEditorClient with full wiring**

```js
// src/app/tools/pdf-editor/PdfEditorClient.js
'use client';
import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist'; // named imports for worker setup
import UploadZone from '@/components/pdf-editor/UploadZone';
import EditorShell from '@/components/pdf-editor/EditorShell';
import usePdfEditor from '@/hooks/usePdfEditor';
import usePdfDownload from '@/hooks/usePdfDownload';

GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export default function PdfEditorClient() {
  const [file,     setFile]     = useState(null);
  const [pdfDoc,   setPdfDoc]   = useState(null);
  const [pageCount,setPageCount]= useState(0);
  const [loadError,setLoadError]= useState(null);

  const editor   = usePdfEditor();
  const { download } = usePdfDownload();

  async function handleFile(f) {
    setLoadError(null);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setFile(f);
      setPdfDoc(doc);
      setPageCount(doc.numPages);
      editor.clearAll();
    } catch (err) {
      if (err.name === 'PasswordException') {
        setLoadError('This PDF is password-protected and cannot be opened.');
      } else {
        setLoadError('Could not read this file. Please choose a valid PDF.');
      }
    }
  }

  function handleOpenNew() {
    setFile(null); setPdfDoc(null); setPageCount(0);
    editor.clearAll();
  }

  function handleDownload() {
    return download(file, editor.annotations);
  }

  if (!file || !pdfDoc) {
    return (
      <div className="relative min-h-screen bg-aurora">
        <UploadZone onFile={handleFile} />
        {loadError && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-[13px]"
            style={{ background: 'rgba(255,69,58,0.15)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.3)' }}>
            {loadError}
          </div>
        )}
      </div>
    );
  }

  return (
    <EditorShell
      file={file}
      pdfDoc={pdfDoc}
      pageCount={pageCount}
      annotations={editor.annotations}
      onAddAnnotation={editor.addAnnotation}
      activeTool={editor.activeTool}
      setActiveTool={editor.setActiveTool}
      currentPage={editor.currentPage}
      setCurrentPage={editor.setCurrentPage}
      style={editor.style}
      setStyle={editor.setStyle}
      onUndo={editor.undo}
      onRedo={editor.redo}
      canUndo={editor.canUndo}
      canRedo={editor.canRedo}
      onOpenNew={handleOpenNew}
      onDownload={handleDownload}
    />
  );
}
```

- [ ] **Manual smoke test — full flow**

1. Run `npm run dev`
2. Open `http://localhost:3000/tools/pdf-editor`
3. Drop a PDF → editor opens, page renders, thumbnails visible
4. Click **Text** tool → click on page → type text → press Enter → text appears on overlay
5. Click **Whiteout** → drag over text area → white box covers it
6. Click **Rectangle** → drag → outlined rectangle appears
7. Click **Draw** → freehand stroke appears
8. Click **Sign** → modal opens → draw signature → Place Signature → appears on page
9. Click **Undo** → last annotation disappears
10. Click **Download PDF** → browser downloads an edited PDF
11. Open downloaded PDF in a viewer — all annotations present

- [ ] **Commit**

```bash
git add src/app/tools/pdf-editor/PdfEditorClient.js
git commit -m "feat: wire full PDF editor — upload, annotate, download"
```

---

## Task 13: Add PDF Editor card to ToolsSection

**Files:**
- Modify: `src/components/ToolsSection.js`

- [ ] **Add the card to the tools array**

In `src/components/ToolsSection.js`, add to the `tools` array (after the first item):

```js
{
  icon: '📝',
  title: 'PDF Editor',
  subtitle: 'Edit, Annotate & Sign',
  desc: 'Edit, annotate, sign and whiteout PDFs — all in your browser, files never leave your device',
  href: '/tools/pdf-editor',
  color: '#2997ff',
  badge: 'NEW',
  tags: ['PDF', 'Edit', 'Sign', 'Annotate'],
},
```

- [ ] **Verify on homepage**

Open `http://localhost:3000` — PDF Editor card appears in the Tools section. Clicking it navigates to `/tools/pdf-editor`.

- [ ] **Commit**

```bash
git add src/components/ToolsSection.js
git commit -m "feat: add PDF Editor card to ToolsSection"
```

---

## Task 14: Final polish + push

- [ ] **Test light mode** — toggle to light mode, verify upload zone and editor are readable (all inline colours use CSS variables or opacity-based rgba)

- [ ] **Test mobile** — open on phone/tablet, verify drop zone is tappable, toolbar wraps, canvas tools work via touch (pointer events)

- [ ] **Test error states:**
  - Upload a non-PDF file → "Please choose a valid PDF file" error shown
  - Upload a file > 50 MB → "File too large" error shown
  - If possible, try a password-protected PDF → appropriate message

- [ ] **Run build to confirm no errors**

```bash
cd "/home/saheer-anas-k/kerala-gov-hub-main "
npm run build
```
Expected: clean build, no TypeScript/webpack errors.

- [ ] **Push to GitHub**

```bash
git push origin main
```

---

## Done ✓

The PDF editor is live at `/tools/pdf-editor` with:
- Large drop zone upload screen
- Full-viewport editor: toolbar, page thumbnails, wide canvas, floating style bar
- Tools: Text, Whiteout, Rectangle, Circle, Line, Draw, Highlight, Sign
- Undo/Redo per page
- Download as edited PDF (text native, everything else rasterised)
- 100% client-side — no server, no uploads
