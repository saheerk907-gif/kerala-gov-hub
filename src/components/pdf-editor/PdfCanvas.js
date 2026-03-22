// src/components/pdf-editor/PdfCanvas.js
'use client';
import { useEffect, useRef, useState } from 'react';

// Hit-test in CSS-px space
function hitTest(ann, x, y) {
  const PAD = 8;
  if (ann.type === 'text') {
    const h = (ann.fontSize || 14) + 6;
    return x >= ann.x - PAD && x <= ann.x + 160 + PAD &&
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

// Bounding box of an annotation in CSS px
function getBBox(ann) {
  if (ann.type === 'text') {
    return { x: ann.x, y: ann.y - (ann.fontSize || 14) - 2, w: 160, h: (ann.fontSize || 14) + 4 };
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

export default function PdfCanvas({
  pdfDoc, pageIndex, annotations, onAddAnnotation,
  activeTool, style, onSignRequest,
  onUpdateAnnotation, onMoveStart, onDeleteAnnotation,
}) {
  const pdfCanvasRef = useRef(null);
  const overlayRef   = useRef(null);
  const textareaRef  = useRef(null);
  const [viewport, setViewport]     = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [cursor, setCursor]         = useState('crosshair');
  const drawing     = useRef(false);
  const startPt     = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]);
  const pendingText = useRef(null);
  const movingRef   = useRef(null); // { id, startX, startY, origAnn }

  // Clear selection when annotations change externally (e.g. undo removes selected)
  useEffect(() => {
    if (selectedId && !annotations.find(a => a.id === selectedId)) {
      setSelectedId(null);
    }
  }, [annotations, selectedId]);

  // ── Render PDF page ──────────────────────────────────────────────
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    async function render() {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const dpr  = window.devicePixelRatio || 1;
      const vp   = page.getViewport({ scale: 1.5 * dpr });
      const canvas  = pdfCanvasRef.current;
      const overlay = overlayRef.current;
      if (!canvas || !overlay || cancelled) return;
      canvas.width  = overlay.width  = vp.width;
      canvas.height = overlay.height = vp.height;
      canvas.style.width  = overlay.style.width  = `${vp.width  / dpr}px`;
      canvas.style.height = overlay.style.height = `${vp.height / dpr}px`;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      setViewport(vp);
    }
    render();
    return () => { cancelled = true; };
  }, [pdfDoc, pageIndex]);

  // ── Redraw overlay: annotations + selection border ───────────────
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || !viewport) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dpr = window.devicePixelRatio || 1;
    const sx  = canvas.width  / (viewport.width  / dpr);
    const sy  = canvas.height / (viewport.height / dpr);

    for (const ann of annotations) {
      ctx.save();
      ctx.globalAlpha = ann.opacity ?? 1;

      if (ann.type === 'text') {
        ctx.font = `${ann.fontSize * sx}px sans-serif`;
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

    // ── Draw selection border ────────────────────────────────────
    if (selectedId) {
      const sel = annotations.find(a => a.id === selectedId);
      if (sel) {
        const bb = getBBox(sel);
        const PAD = 5;
        const bx = (bb.x - PAD) * sx;
        const by = (bb.y - PAD) * sy;
        const bw = (bb.w + PAD * 2) * sx;
        const bh = (bb.h + PAD * 2) * sy;

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#2997ff';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(bx, by, bw, bh);

        // Corner handles
        ctx.setLineDash([]);
        ctx.fillStyle = '#2997ff';
        for (const [hx, hy] of [
          [bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh],
        ]) {
          ctx.beginPath();
          ctx.arc(hx, hy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }, [annotations, viewport, selectedId]);

  // ── Helpers ──────────────────────────────────────────────────────
  function getCanvasCoords(e) {
    const canvas = overlayRef.current;
    const rect   = canvas.getBoundingClientRect();
    const src    = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function findAnnotationAt(x, y) {
    for (let i = annotations.length - 1; i >= 0; i--) {
      if (hitTest(annotations[i], x, y)) return annotations[i];
    }
    return null;
  }

  // ── Pointer handlers ─────────────────────────────────────────────
  function onPointerDown(e) {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    // Hit-test existing annotations first → drag-move + select
    const hit = findAnnotationAt(x, y);
    if (hit) {
      setSelectedId(hit.id);
      onMoveStart?.();
      movingRef.current = {
        id: hit.id, startX: x, startY: y,
        origAnn: { ...hit, points: hit.points ? hit.points.map(p => [...p]) : [] },
      };
      setCursor('grabbing');
      return;
    }

    // Clicked empty space → deselect, then use active tool
    setSelectedId(null);

    if (activeTool === 'sign') { onSignRequest({ x, y }); return; }

    if (activeTool === 'text') {
      commitTextarea();
      pendingText.current = { x, y };
      const rect = overlayRef.current.getBoundingClientRect();
      const ta = textareaRef.current;
      ta.style.left     = `${rect.left + x}px`;
      ta.style.top      = `${rect.top  + y}px`;
      ta.style.fontSize = `${style.fontSize}px`;
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

    // Drag-move
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

    // Live draw preview
    if (drawing.current && activeTool === 'draw') {
      currentPath.current.push([x, y]);
      const canvas = overlayRef.current;
      const ctx = canvas.getContext('2d');
      const pts = currentPath.current;
      if (pts.length < 2) return;
      const dpr = window.devicePixelRatio || 1;
      const sx  = canvas.width / (viewport.width / dpr);
      const sy  = canvas.height / (viewport.height / dpr);
      ctx.strokeStyle = style.color; ctx.lineWidth = 2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2][0] * sx, pts[pts.length - 2][1] * sy);
      ctx.lineTo(pts[pts.length - 1][0] * sx, pts[pts.length - 1][1] * sy);
      ctx.stroke();
      return;
    }

    // Hover cursor
    if (!drawing.current) {
      const hit = findAnnotationAt(x, y);
      setCursor(hit ? 'grab' : activeTool === 'text' ? 'text' : 'crosshair');
    }
  }

  function onPointerUp(e) {
    e.preventDefault();

    if (movingRef.current) {
      movingRef.current = null;
      setCursor('grab'); // stay grab until mouse leaves annotation
      return;
    }

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

  // ── Mini-toolbar for selected annotation ─────────────────────────
  const selectedAnn = annotations.find(a => a.id === selectedId);
  let toolbar = null;
  if (selectedAnn) {
    const bb = getBBox(selectedAnn);
    const tbTop  = Math.max(4, bb.y - 44);
    const tbLeft = bb.x;

    toolbar = (
      <div
        style={{
          position: 'absolute', left: tbLeft, top: tbTop,
          display: 'flex', gap: 4, alignItems: 'center',
          background: 'rgba(18,18,24,0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '5px 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          zIndex: 30, pointerEvents: 'auto',
        }}
        onPointerDown={e => e.stopPropagation()}
      >
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginRight: 4, userSelect: 'none' }}>
          {selectedAnn.type}
        </span>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <button
          title="Move (drag)"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'grab', fontSize: 14, padding: '0 4px' }}
        >⠿</button>
        <button
          title="Delete"
          onClick={() => { onDeleteAnnotation?.(selectedAnn.id); setSelectedId(null); }}
          style={{
            background: 'rgba(255,69,58,0.15)', border: '1px solid rgba(255,69,58,0.35)',
            color: '#ff453a', borderRadius: 6, padding: '3px 9px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}
        >✕ Delete</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={pdfCanvasRef} style={{ display: 'block', borderRadius: 6 }} />

      <canvas
        ref={overlayRef}
        style={{ position: 'absolute', top: 0, left: 0, touchAction: 'none', cursor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />

      {/* Mini-toolbar floats above selected annotation */}
      {toolbar}

      {/* Text input */}
      <textarea
        ref={textareaRef}
        onBlur={commitTextarea}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitTextarea(); } }}
        style={{
          display: 'none', position: 'fixed', zIndex: 50,
          minWidth: 120, minHeight: 28,
          background: 'rgba(255,255,255,0.95)', border: '2px dashed #2997ff',
          borderRadius: 4, padding: '4px 8px', outline: 'none', resize: 'none',
          fontFamily: 'sans-serif', color: '#000',
        }}
      />
    </div>
  );
}
