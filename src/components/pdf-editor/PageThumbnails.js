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
