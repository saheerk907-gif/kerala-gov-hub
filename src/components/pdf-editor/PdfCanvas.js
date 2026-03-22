// src/components/pdf-editor/PdfCanvas.js
'use client';
import { useEffect, useRef, useState } from 'react';

// Returns true if (x, y) in CSS-px space hits the annotation
function hitTest(ann, x, y) {
  const PAD = 8;
  if (ann.type === 'text') {
    const h = (ann.fontSize || 14) + 6;
    // text baseline is at y; rendered above that
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

export default function PdfCanvas({
  pdfDoc, pageIndex, annotations, onAddAnnotation,
  activeTool, style, onSignRequest,
  onUpdateAnnotation, onMoveStart,
}) {
  const pdfCanvasRef = useRef(null);
  const overlayRef   = useRef(null);
  const textareaRef  = useRef(null);
  const [viewport, setViewport] = useState(null);
  const drawing     = useRef(false);
  const startPt     = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]);
  const pendingText = useRef(null);
  const movingRef   = useRef(null); // { id, startX, startY, origAnn }
  const [cursor, setCursor] = useState('crosshair');

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

  // ── Redraw overlay annotations ───────────────────────────────────
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
  }, [annotations, viewport]);

  // ── Coordinate helper ────────────────────────────────────────────
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

    // Always check for a hit on existing annotation first → drag-move
    const hit = findAnnotationAt(x, y);
    if (hit) {
      onMoveStart?.();   // push undo snapshot before move
      movingRef.current = {
        id: hit.id,
        startX: x, startY: y,
        origAnn: {
          ...hit,
          points: hit.points ? hit.points.map(p => [...p]) : [],
        },
      };
      setCursor('grabbing');
      return;
    }

    // No hit — use the active tool
    if (activeTool === 'sign') {
      onSignRequest({ x, y });
      return;
    }

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

    // ── Drag-move an existing annotation ──
    if (movingRef.current) {
      const { id, startX, startY, origAnn } = movingRef.current;
      const dx = x - startX;
      const dy = y - startY;
      if (origAnn.type === 'draw') {
        onUpdateAnnotation?.(id, { points: origAnn.points.map(([px, py]) => [px + dx, py + dy]) });
      } else {
        onUpdateAnnotation?.(id, { x: origAnn.x + dx, y: origAnn.y + dy });
      }
      return;
    }

    // ── Live draw preview ──
    if (drawing.current && activeTool === 'draw') {
      currentPath.current.push([x, y]);
      const canvas = overlayRef.current;
      const ctx = canvas.getContext('2d');
      const pts = currentPath.current;
      if (pts.length < 2) return;
      const dpr = window.devicePixelRatio || 1;
      const sx  = canvas.width  / (viewport.width  / dpr);
      const sy  = canvas.height / (viewport.height / dpr);
      ctx.strokeStyle = style.color; ctx.lineWidth = 2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2][0] * sx, pts[pts.length - 2][1] * sy);
      ctx.lineTo(pts[pts.length - 1][0] * sx, pts[pts.length - 1][1] * sy);
      ctx.stroke();
      return;
    }

    // ── Hover: update cursor ──
    if (!drawing.current) {
      const hit = findAnnotationAt(x, y);
      setCursor(hit ? 'grab' : activeTool === 'text' ? 'text' : 'crosshair');
    }
  }

  function onPointerUp(e) {
    e.preventDefault();

    // End drag-move
    if (movingRef.current) {
      movingRef.current = null;
      setCursor('crosshair');
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
