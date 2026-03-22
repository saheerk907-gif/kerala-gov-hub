// src/components/pdf-editor/PdfCanvas.js
'use client';
import { useEffect, useRef, useState } from 'react';

export default function PdfCanvas({
  pdfDoc, pageIndex, annotations, onAddAnnotation,
  activeTool, style, onSignRequest,
}) {
  const containerRef  = useRef(null);
  const pdfCanvasRef  = useRef(null);
  const overlayRef    = useRef(null);
  const textareaRef   = useRef(null);
  const [viewport, setViewport] = useState(null);
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

  function getCanvasCoords(e) {
    const canvas = overlayRef.current;
    const rect   = canvas.getBoundingClientRect();
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
