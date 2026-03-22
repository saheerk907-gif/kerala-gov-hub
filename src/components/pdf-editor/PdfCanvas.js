// src/components/pdf-editor/PdfCanvas.js
'use client';
import { useEffect, useRef, useState } from 'react';

const HANDLE_R = 8;

function hitTest(ann, x, y) {
  const PAD = 8;
  if (ann.type === 'text') {
    const h = (ann.fontSize || 14) + 6;
    return x >= ann.x - PAD && x <= ann.x + 200 + PAD &&
           y >= ann.y - h - PAD && y <= ann.y + PAD;
  }
  if (ann.type === 'draw') {
    if (!ann.points?.length) return false;
    const xs = ann.points.map(p => p[0]);
    const ys = ann.points.map(p => p[1]);
    return x >= Math.min(...xs) - PAD && x <= Math.max(...xs) + PAD &&
           y >= Math.min(...ys) - PAD && y <= Math.max(...ys) + PAD;
  }
  return x >= ann.x - PAD && x <= ann.x + (ann.width || 0) + PAD &&
         y >= ann.y - PAD && y <= ann.y + (ann.height || 0) + PAD;
}

function getBBox(ann) {
  if (ann.type === 'text') {
    return { x: ann.x, y: ann.y - (ann.fontSize || 14) - 2, w: 200, h: (ann.fontSize || 14) + 4 };
  }
  if (ann.type === 'draw') {
    if (!ann.points?.length) return { x: 0, y: 0, w: 0, h: 0 };
    const xs = ann.points.map(p => p[0]);
    const ys = ann.points.map(p => p[1]);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
  }
  return { x: ann.x, y: ann.y, w: ann.width || 0, h: ann.height || 0 };
}

function getHandles(ann) {
  const bb = getBBox(ann);
  const PAD = 6;
  const x1 = bb.x - PAD, y1 = bb.y - PAD;
  const x2 = bb.x + bb.w + PAD, y2 = bb.y + bb.h + PAD;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return [[x1,y1],[mx,y1],[x2,y1],[x2,my],[x2,y2],[mx,y2],[x1,y2],[x1,my]];
}

function hitTestHandle(handles, x, y) {
  for (let i = 0; i < handles.length; i++) {
    const [hx, hy] = handles[i];
    if (Math.abs(x - hx) <= HANDLE_R && Math.abs(y - hy) <= HANDLE_R) return i;
  }
  return -1;
}

const HANDLE_CURSORS = [
  'nw-resize','n-resize','ne-resize','e-resize',
  'se-resize','s-resize','sw-resize','w-resize',
];

function applyResize(origAnn, handleIdx, dx, dy) {
  if (origAnn.type === 'draw') {
    const bb = getBBox(origAnn);
    let x1 = bb.x, y1 = bb.y, x2 = bb.x + bb.w, y2 = bb.y + bb.h;
    if (handleIdx === 0) { x1 += dx; y1 += dy; }
    else if (handleIdx === 1) { y1 += dy; }
    else if (handleIdx === 2) { x2 += dx; y1 += dy; }
    else if (handleIdx === 3) { x2 += dx; }
    else if (handleIdx === 4) { x2 += dx; y2 += dy; }
    else if (handleIdx === 5) { y2 += dy; }
    else if (handleIdx === 6) { x1 += dx; y2 += dy; }
    else if (handleIdx === 7) { x1 += dx; }
    const newW = Math.max(10, x2 - x1), newH = Math.max(10, y2 - y1);
    const scX = newW / Math.max(1, bb.w), scY = newH / Math.max(1, bb.h);
    return { points: origAnn.points.map(([px, py]) => [x1 + (px - bb.x) * scX, y1 + (py - bb.y) * scY]) };
  }
  let { x, y, width, height } = origAnn;
  if (handleIdx === 0) { x += dx; y += dy; width -= dx; height -= dy; }
  else if (handleIdx === 1) { y += dy; height -= dy; }
  else if (handleIdx === 2) { width += dx; y += dy; height -= dy; }
  else if (handleIdx === 3) { width += dx; }
  else if (handleIdx === 4) { width += dx; height += dy; }
  else if (handleIdx === 5) { height += dy; }
  else if (handleIdx === 6) { x += dx; width -= dx; height += dy; }
  else if (handleIdx === 7) { x += dx; width -= dx; }
  return { x, y, width: Math.max(10, width), height: Math.max(10, height) };
}

function canvasFont(ann) {
  const parts = [];
  if (ann.italic) parts.push('italic');
  if (ann.bold)   parts.push('bold');
  parts.push(`${ann.fontSize || 14}px`);
  parts.push('sans-serif');
  return parts.join(' ');
}

export default function PdfCanvas({
  pdfDoc, pageIndex, annotations, onAddAnnotation,
  activeTool, style, onSignRequest,
  onUpdateAnnotation, onMoveStart, onDeleteAnnotation,
  selectedId, onSelectionChange,
  onScaleChange,
}) {
  const wrapRef      = useRef(null);
  const pdfCanvasRef = useRef(null);
  const overlayRef   = useRef(null);
  const textareaRef  = useRef(null);
  const [viewport, setViewport] = useState(null);
  const [cursor, setCursor]     = useState('crosshair');
  const drawing     = useRef(false);
  const startPt     = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]);
  const pendingText = useRef(null);
  const movingRef   = useRef(null);
  const resizingRef = useRef(null);
  const previewRef  = useRef(null); // live shape preview { x1,y1,x2,y2,tool }

  // Store a stable redraw function so pointer events can call it
  const redrawFnRef = useRef(null);

  // ── Render PDF page ──────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    async function render() {
      const page   = await pdfDoc.getPage(pageIndex + 1);
      const dpr    = window.devicePixelRatio || 1;
      const baseVp = page.getViewport({ scale: 1 });
      const availW   = wrapRef.current?.clientWidth || (window.innerWidth - 100);
      const scaleCSS = Math.min(Math.max(availW * 0.98 / baseVp.width, 1.0), 5.0);
      const vp       = page.getViewport({ scale: scaleCSS * dpr });
      const canvas  = pdfCanvasRef.current;
      const overlay = overlayRef.current;
      if (!canvas || !overlay || cancelled) return;
      canvas.width  = overlay.width  = vp.width;
      canvas.height = overlay.height = vp.height;
      canvas.style.width  = overlay.style.width  = `${vp.width  / dpr}px`;
      canvas.style.height = overlay.style.height = `${vp.height / dpr}px`;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      if (!cancelled) { setViewport(vp); onScaleChange?.(scaleCSS); }
    }
    const t = setTimeout(render, 0);
    return () => { cancelled = true; clearTimeout(t); };
  }, [pdfDoc, pageIndex]);

  // ── Redraw overlay ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !viewport) return;

    function redraw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio || 1;
      const sx  = canvas.width  / (viewport.width  / dpr);
      const sy  = canvas.height / (viewport.height / dpr);

      for (const ann of annotations) {
        ctx.save();
        ctx.globalAlpha = ann.opacity ?? 1;
        if (ann.type === 'text') {
          ctx.font = canvasFont({ ...ann, fontSize: ann.fontSize * sx });
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

      // Live shape preview while dragging
      const prev = previewRef.current;
      if (prev) {
        const px = Math.min(prev.x1, prev.x2) * sx;
        const py = Math.min(prev.y1, prev.y2) * sy;
        const pw = Math.abs(prev.x2 - prev.x1) * sx;
        const ph = Math.abs(prev.y2 - prev.y1) * sy;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.5;
        if (prev.tool === 'whiteout') {
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = '#2997ff';
          ctx.strokeRect(px, py, pw, ph);
        } else if (prev.tool === 'rect') {
          ctx.strokeStyle = '#2997ff';
          ctx.strokeRect(px, py, pw, ph);
        } else if (prev.tool === 'circle') {
          ctx.strokeStyle = '#2997ff';
          ctx.beginPath();
          ctx.ellipse(px + pw / 2, py + ph / 2, Math.abs(pw / 2), Math.abs(ph / 2), 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (prev.tool === 'line') {
          ctx.strokeStyle = '#2997ff';
          ctx.beginPath();
          ctx.moveTo(prev.x1 * sx, prev.y1 * sy);
          ctx.lineTo(prev.x2 * sx, prev.y2 * sy);
          ctx.stroke();
        } else if (prev.tool === 'highlight') {
          ctx.fillStyle = 'rgba(255,255,0,0.35)';
          ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = '#2997ff';
          ctx.strokeRect(px, py, pw, ph);
        }
        ctx.restore();
      }

      // Selection border + 8 handles
      if (selectedId) {
        const sel = annotations.find(a => a.id === selectedId);
        if (sel) {
          const bb = getBBox(sel);
          const PAD = 6;
          const bx = (bb.x - PAD) * sx, by = (bb.y - PAD) * sy;
          const bw = (bb.w + PAD * 2) * sx, bh = (bb.h + PAD * 2) * sy;
          ctx.save();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#2997ff'; ctx.lineWidth = 2;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(bx, by, bw, bh);
          ctx.setLineDash([]);
          getHandles(sel).forEach(([hx, hy]) => {
            ctx.beginPath();
            ctx.arc(hx * sx, hy * sy, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#2997ff'; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          });
          ctx.restore();
        }
      }
    }

    redrawFnRef.current = redraw;
    redraw();
  }, [annotations, viewport, selectedId]);

  function getCanvasCoords(e) {
    const rect = overlayRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function findAnnotationAt(x, y) {
    for (let i = annotations.length - 1; i >= 0; i--) {
      if (hitTest(annotations[i], x, y)) return annotations[i];
    }
    return null;
  }

  function onPointerDown(e) {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    // Resize handle check
    if (selectedId) {
      const sel = annotations.find(a => a.id === selectedId);
      if (sel) {
        const hIdx = hitTestHandle(getHandles(sel), x, y);
        if (hIdx !== -1) {
          onMoveStart?.();
          resizingRef.current = {
            id: sel.id, handleIdx: hIdx, startX: x, startY: y,
            origAnn: { ...sel, points: sel.points ? sel.points.map(p => [...p]) : [] },
          };
          setCursor(HANDLE_CURSORS[hIdx]);
          return;
        }
      }
    }

    const hit = findAnnotationAt(x, y);
    if (hit) {
      onSelectionChange?.(hit.id);
      onMoveStart?.();
      movingRef.current = {
        id: hit.id, startX: x, startY: y,
        origAnn: { ...hit, points: hit.points ? hit.points.map(p => [...p]) : [] },
      };
      setCursor('grabbing');
      return;
    }

    onSelectionChange?.(null);

    if (activeTool === 'sign') { onSignRequest({ x, y }); return; }

    if (activeTool === 'text') {
      commitTextarea();
      pendingText.current = { x, y };
      const rect = overlayRef.current.getBoundingClientRect();
      const ta = textareaRef.current;
      ta.style.left     = `${rect.left + x}px`;
      ta.style.top      = `${rect.top  + y}px`;
      ta.style.fontSize = `${style.fontSize}px`;
      ta.style.fontWeight = style.bold ? 'bold' : 'normal';
      ta.style.fontStyle  = style.italic ? 'italic' : 'normal';
      ta.style.color    = style.color;
      ta.style.display  = 'block';
      ta.value = '';
      ta.focus();
      return;
    }

    drawing.current     = true;
    startPt.current     = { x, y };
    currentPath.current = [[x, y]];
  }

  function onPointerMove(e) {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    if (resizingRef.current) {
      const { id, handleIdx, startX, startY, origAnn } = resizingRef.current;
      onUpdateAnnotation?.(id, applyResize(origAnn, handleIdx, x - startX, y - startY));
      setCursor(HANDLE_CURSORS[handleIdx]);
      return;
    }

    if (movingRef.current) {
      const { id, startX, startY, origAnn } = movingRef.current;
      const dx = x - startX, dy = y - startY;
      if (origAnn.type === 'draw') {
        onUpdateAnnotation?.(id, { points: origAnn.points.map(([px, py]) => [px + dx, py + dy]) });
      } else {
        onUpdateAnnotation?.(id, { x: origAnn.x + dx, y: origAnn.y + dy });
      }
      return;
    }

    if (drawing.current) {
      if (activeTool === 'draw') {
        currentPath.current.push([x, y]);
        const canvas = overlayRef.current;
        const ctx = canvas.getContext('2d');
        const pts = currentPath.current;
        if (pts.length < 2) return;
        const dpr = window.devicePixelRatio || 1;
        const scx = canvas.width / (viewport.width / dpr);
        const scy = canvas.height / (viewport.height / dpr);
        ctx.strokeStyle = style.color; ctx.lineWidth = 2;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 2][0] * scx, pts[pts.length - 2][1] * scy);
        ctx.lineTo(pts[pts.length - 1][0] * scx, pts[pts.length - 1][1] * scy);
        ctx.stroke();
      } else if (['whiteout','rect','circle','line','highlight'].includes(activeTool)) {
        // Show live preview
        previewRef.current = { tool: activeTool, x1: startPt.current.x, y1: startPt.current.y, x2: x, y2: y };
        redrawFnRef.current?.();
      }
      return;
    }

    // Hover cursors
    if (selectedId) {
      const sel = annotations.find(a => a.id === selectedId);
      if (sel) {
        const hIdx = hitTestHandle(getHandles(sel), x, y);
        if (hIdx !== -1) { setCursor(HANDLE_CURSORS[hIdx]); return; }
      }
    }
    const hit = findAnnotationAt(x, y);
    setCursor(hit ? 'grab' : activeTool === 'text' ? 'text' : 'crosshair');
  }

  function onPointerUp(e) {
    e.preventDefault();
    previewRef.current = null; // clear live preview
    if (resizingRef.current) { resizingRef.current = null; setCursor('default'); return; }
    if (movingRef.current)   { movingRef.current   = null; setCursor('grab');    return; }
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
      text: ta.value, color: style.color, fontSize: style.fontSize,
      opacity: style.opacity, bold: style.bold, italic: style.italic,
    });
    ta.value = '';
    ta.style.display = 'none';
  }

  const selectedAnn = annotations.find(a => a.id === selectedId);
  let miniToolbar = null;
  if (selectedAnn) {
    const bb = getBBox(selectedAnn);
    miniToolbar = (
      <div
        style={{
          position: 'absolute', left: Math.max(0, bb.x), top: Math.max(4, bb.y - 46),
          display: 'flex', gap: 4, alignItems: 'center',
          background: 'rgba(18,18,26,0.96)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 10, padding: '5px 10px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
          zIndex: 30, pointerEvents: 'auto', whiteSpace: 'nowrap',
        }}
        onPointerDown={e => e.stopPropagation()}
      >
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize', marginRight: 2 }}>
          {selectedAnn.type}
        </span>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <button title="Drag to move"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'default', fontSize: 15, padding: '0 2px', lineHeight: 1 }}>
          ⠿
        </button>
        <button
          onClick={() => { onDeleteAnnotation?.(selectedAnn.id); onSelectionChange?.(null); }}
          style={{
            background: 'rgba(255,69,58,0.15)', border: '1px solid rgba(255,69,58,0.4)',
            color: '#ff453a', borderRadius: 7, padding: '4px 12px',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
          ✕ Delete
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <canvas ref={pdfCanvasRef} style={{ display: 'block', borderRadius: 6, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }} />
      <canvas
        ref={overlayRef}
        style={{ position: 'absolute', top: 0, left: 0, touchAction: 'none', cursor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      {miniToolbar}
      <textarea
        ref={textareaRef}
        onBlur={commitTextarea}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitTextarea(); } }}
        style={{
          display: 'none', position: 'fixed', zIndex: 50,
          minWidth: 140, minHeight: 32,
          background: 'rgba(255,255,255,0.97)', border: '2px dashed #2997ff',
          borderRadius: 4, padding: '4px 8px', outline: 'none', resize: 'none',
          fontFamily: 'sans-serif', color: '#000',
        }}
      />
    </div>
  );
}
