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
