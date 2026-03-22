# PDF Editor — Design Spec

**Date:** 2026-03-22
**Status:** Approved
**Route:** `/tools/pdf-editor`

---

## Overview

A fully client-side PDF editor for Kerala government employees. All processing happens in the browser — no file is ever uploaded to a server. Users open a PDF, annotate it (text, shapes, whiteout, draw, highlight, signature), and download the result.

**Libraries:**
- `pdfjs-dist` — render PDF pages onto canvas
- `pdf-lib` — flatten annotations into the final downloaded PDF

---

## User Flow

1. User visits `/tools/pdf-editor`
2. **Upload screen** — large drop zone (drag & drop or file picker), 50 MB limit enforced client-side
3. PDF loads → **Editor screen** replaces the upload screen (same page, React state toggle)
4. User picks a tool, annotates on the canvas overlay
5. **Download PDF** → pdf-lib flattens all annotations → browser downloads the file
6. **Open New** → returns to upload screen, clears all state

---

## Component Architecture

```
src/app/tools/pdf-editor/
  page.js                        ← server component, exports metadata only
  PdfEditorClient.js             ← 'use client', owns upload/editor state

src/components/pdf-editor/
  UploadZone.js                  ← drop zone UI ('use client')
  EditorShell.js                 ← full-viewport editor layout ('use client')
  Toolbar.js                     ← tool selector row
  PageThumbnails.js              ← left sidebar thumbnails (low-res renders)
  PdfCanvas.js                   ← PDF.js render + overlay canvas + tool handlers
  StyleBar.js                    ← floating colour/size/opacity pill
  SignModal.js                   ← signature drawing modal

src/hooks/
  usePdfEditor.js                ← annotations map, undo/redo, active tool, style
  usePdfDownload.js              ← pdf-lib flatten + download
```

`page.js` is a **server component** — it only exports metadata. All state lives in `PdfEditorClient.js` which is `'use client'`.

---

## Layout

### Upload Screen
- Page header: label "Tools", title "PDF Editor", subtitle "Everything stays in your browser"
- **Large drop zone** — glass card, dashed border, 80px padding, drag-and-drop, "📂 Choose PDF File" button, file input `accept=".pdf"`
- **Privacy badge** — green pill: "🔒 Your files never leave your device"
- Client-side 50 MB check on file selection; show inline error if exceeded

### Editor Screen (full viewport height, no body scroll)
```
┌─────────────────────────────────────────────────────┐
│ Topbar: title | filename.pdf       Open New Download │
├─────────────────────────────────────────────────────┤
│ Toolbar: Text Whiteout | Rect Circle Line | Draw     │
│          Highlight | Sign              Undo  Redo    │
├──────────┬──────────────────────────────────────────┤
│ Thumbs   │  Canvas area (flex:1, overflow-y:auto)   │
│ 76px     │                                           │
│  [pg 1]◀ │   [PDF page — full width white card]     │
│  [pg 2]  │                                           │
│  [pg 3]  │   [floating style bar at bottom]          │
├──────────┴──────────────────────────────────────────┤
│ 🔒 Privacy bar (9px text)                            │
└─────────────────────────────────────────────────────┘
```

---

## Tools

| Tool | Behaviour |
|---|---|
| **Text** | Pointer down on canvas → absolutely-positioned `<textarea>` appears at click coords → on blur, annotation committed |
| **Whiteout** | Pointer down + drag → white filled rectangle; covers underlying content |
| **Rectangle** | Pointer down + drag → outlined rectangle |
| **Circle** | Pointer down + drag → outlined ellipse |
| **Line** | Pointer down + drag → straight line |
| **Draw** | Freehand path — pointerdown starts path, pointermove appends points, pointerup commits |
| **Highlight** | Pointer down + drag → semi-transparent yellow rectangle (opacity 0.35 default) |
| **Sign** | Opens `SignModal` (canvas pad, clear button, confirm); on confirm → PNG data URL placed on PDF at last-clicked position; default size 200×80px; draggable after placement |
| **Undo** | Removes last annotation from current page's array |
| **Redo** | Re-applies last undone annotation |

**All tools use the Pointer Events API** (`onPointerDown`, `onPointerMove`, `onPointerUp`) for consistent mouse + touch support. `touch-action: none` on the overlay canvas.

**Page navigation:** If a tool interaction is in progress (e.g., textarea focused, draw path started), navigating to another thumbnail auto-commits the in-progress annotation before switching pages.

---

## Data Model

```js
// Per annotation
{
  id: string,                   // crypto.randomUUID()
  type: 'text'|'whiteout'|'rect'|'circle'|'line'|'draw'|'highlight'|'sign',
  // Coords in PDF point space (origin bottom-left, matching pdf-lib)
  x: Number, y: Number,
  width: Number, height: Number,
  text: String,                 // text tool only
  points: [[x,y], ...],         // draw tool only
  imageDataUrl: String,         // sign tool only
  color: String,                // hex e.g. '#000000'
  fontSize: Number,             // text tool
  opacity: Number,              // 0–1
}

// State shape in usePdfEditor
{
  annotations: Map<pageIndex, Annotation[]>,
  undoStack:   Map<pageIndex, Annotation[][]>,   // snapshots
  redoStack:   Map<pageIndex, Annotation[][]>,
  activeTool:  ToolName,
  style: { color, fontSize, opacity },
  currentPage: Number,
}
```

---

## Coordinate System

PDF.js and pdf-lib use **different origins**:
- **PDF.js canvas**: origin top-left, Y increases downward
- **pdf-lib**: origin bottom-left, Y increases upward

**Transform formula** (applied in `usePdfDownload.js`):

```js
// viewport = PDF.js page.getViewport({ scale: 1.5 })
// page dimensions in PDF points (72dpi):
const pdfWidth  = pdfPage.getWidth();   // pdf-lib
const pdfHeight = pdfPage.getHeight();

// From overlay canvas coords (px) → PDF point space:
const scaleX = pdfWidth  / (viewport.width  / devicePixelRatio);
const scaleY = pdfHeight / (viewport.height / devicePixelRatio);

const pdfX =  annotation.x * scaleX;
const pdfY =  pdfHeight - (annotation.y * scaleY) - (annotation.height * scaleY);
```

All annotations store coords in **overlay canvas px at 1× DPR**. The transform to pdf-lib space is applied only at download time.

---

## Rendering Strategy (Memory)

- **Thumbnails**: rendered at `scale: 0.2` into small offscreen canvases on load, cached, never re-rendered
- **Main canvas**: only the **current page** is rendered at full resolution (`scale: 1.5 × devicePixelRatio`). When the user navigates to a different page, the previous page's canvas is cleared and the new page rendered. No simultaneous full-res rendering of multiple pages.
- **Overlay canvas**: one per page, kept in a `Map<pageIndex, HTMLCanvasElement>` — overlays for non-visible pages are preserved in memory but detached from the DOM

---

## Download (pdf-lib flattening)

For each page with annotations:
1. Get the pdf-lib page object
2. For **text** annotations: use `page.drawText()` with the stored font size and colour (native PDF text, not rasterised)
3. For **sign** annotations: embed the PNG data URL via `pdfDoc.embedPng()`, then `page.drawImage()`
4. For **all other annotations** (whiteout, shapes, draw, highlight): draw onto a fresh offscreen canvas at native PDF resolution → embed as PNG → `page.drawImage()` covering the page area

**Known limitation:** Non-text annotations are rasterised. Text annotations are native PDF text and remain selectable/sharp.

---

## Error States

| Situation | UI Response |
|---|---|
| File > 50 MB | Inline error below file input: "File too large (max 50 MB)" |
| Password-protected PDF | Toast/banner: "This PDF is password-protected and cannot be opened" |
| Corrupted / non-PDF file | Toast/banner: "Could not read this file. Please choose a valid PDF." |
| PDF.js worker fails to load | Full-page error state with retry button |
| pdf-lib download fails | Toast: "Download failed. Please try again." |

All errors caught in try/catch; PDF.js errors identified by `e.name === 'PasswordException'`.

---

## PDF.js Worker Setup

Use the CDN URL to avoid bundling issues and stale copies after `npm update`:

```js
// In PdfEditorClient.js (or a shared lib/pdfjs.js)
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

No `public/` copy needed. No `postinstall` script. Version is read from the installed package at runtime so they always match.

---

## ToolsSection Integration

Add to the `tools` array in `src/components/ToolsSection.js`:

```js
{
  icon: '📝',
  title: 'PDF Editor',
  titleMl: 'PDF എഡിറ്റർ',
  desc: 'Edit, annotate, sign and whiteout PDFs — all in your browser',
  href: '/tools/pdf-editor',
  color: '#2997ff',
  badge: 'New',
  tags: ['pdf', 'editor', 'sign', 'annotate'],
}
```

---

## SEO / Metadata

```js
// src/app/tools/pdf-editor/page.js
export const metadata = {
  title: 'PDF Editor — Kerala Gov Employee Hub',
  description: 'Edit, annotate, whiteout and sign PDF documents online. All processing happens in your browser — your files are never uploaded.',
  keywords: ['PDF editor', 'PDF annotate', 'PDF sign', 'whiteout PDF', 'Kerala government'],
};
```

---

## Styling

- Background: `bg-aurora` (matches rest of site)
- Glass cards: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.09)`, `backdrop-filter: blur(20px)`
- CSS variables used: `--bg-card`, `--border-xs`, `--border-sm`, `--surface-xs`, `--surface-sm`, `--text-primary`, `--text-secondary`, `--text-muted`
- Editor shell: `height: 100vh; overflow: hidden` — no page scroll while editing
- Light mode: all inline colours use CSS variables; no hardcoded `rgba(255,255,255,...)` inline styles

---

## Constraints

- No server involvement — zero API routes
- `'use client'` on all editor components
- Undo/redo scope is per-page
- Works on mobile via Pointer Events API; minimum viable on small screens (toolbar wraps)
