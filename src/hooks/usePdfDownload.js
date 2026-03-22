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
  // getRenderScale: optional fn returning the CSS-px scale used when rendering the PDF canvas
  const download = useCallback(async (originalFile, annotationsMap, getRenderScale) => {
    try {
      const arrayBuffer = await originalFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages  = pdfDoc.getPages();
      const fonts  = {
        normal:     await pdfDoc.embedFont(StandardFonts.Helvetica),
        bold:       await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        italic:     await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
        boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
      };
      function pickFont(ann) {
        if (ann.bold && ann.italic) return fonts.boldItalic;
        if (ann.bold)   return fonts.bold;
        if (ann.italic) return fonts.italic;
        return fonts.normal;
      }

      for (const [pageIndex, anns] of annotationsMap.entries()) {
        if (!anns || !anns.length) continue;
        const page = pages[pageIndex];
        if (!page) continue;
        const pdfW = page.getWidth();
        const pdfH = page.getHeight();

        // Annotations stored in CSS-px at the render scale used by PdfCanvas.
        // Convert: 1 CSS px = 1/RENDER_SCALE PDF points.
        const RENDER_SCALE = getRenderScale ? getRenderScale() : 1.5;
        const scaleX = 1 / RENDER_SCALE;
        const scaleY = 1 / RENDER_SCALE;

        for (const ann of anns) {
          const pdfX = ann.x * scaleX;
          const pdfY = pdfH - ann.y * scaleY - (ann.height || 0) * scaleY;

          if (ann.type === 'text') {
            page.drawText(ann.text || '', {
              x: pdfX, y: pdfH - ann.y * scaleY,
              size: (ann.fontSize || 14) * scaleX,
              font: pickFont(ann), color: hexToRgb(ann.color || '#000000'),
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
