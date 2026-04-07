'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const btn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
};
const btnDisabled = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };
const outlineBtn = {
  padding: '9px 18px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
};

/** Group text items into rows by rounding Y to nearest tolerance */
function extractRows(items, tolerance = 4) {
  const rowMap = {};
  for (const item of items) {
    if (!item.str?.trim()) continue;
    const y = Math.round(item.transform[5] / tolerance) * tolerance;
    const x = item.transform[4];
    if (!rowMap[y]) rowMap[y] = [];
    rowMap[y].push({ x, text: item.str.trim() });
  }
  // Sort rows top-to-bottom (PDF Y is bottom-up, so descending)
  return Object.keys(rowMap)
    .map(Number)
    .sort((a, b) => b - a)
    .map(y => rowMap[y].sort((a, b) => a.x - b.x).map(c => c.text));
}

export default function PdfToExcelClient() {
  const [file, setFile]       = useState(null);
  const [pdfDoc, setPdfDoc]   = useState(null);
  const [status, setStatus]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState([]); // first page rows for preview

  async function handleFile([f]) {
    setStatus('loading');
    setPreview([]);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      // Generate preview from page 1
      const pg1 = await doc.getPage(1);
      const content = await pg1.getTextContent();
      const rows = extractRows(content.items);
      setPreview(rows.slice(0, 8));
      setFile(f);
      setPdfDoc(doc);
      setStatus(null);
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  async function handleConvert() {
    if (!pdfDoc) return;
    setStatus('converting');
    setProgress(0);
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.utils.book_new();

      for (let p = 1; p <= pdfDoc.numPages; p++) {
        setProgress(Math.round((p / pdfDoc.numPages) * 100));
        const page = await pdfDoc.getPage(p);
        const content = await page.getTextContent();
        const rows = extractRows(content.items);
        const ws = XLSX.utils.aoa_to_sheet(rows);
        // Auto-width columns
        const colWidths = rows.reduce((acc, row) => {
          row.forEach((cell, i) => {
            acc[i] = Math.max(acc[i] || 8, String(cell).length + 2);
          });
          return acc;
        }, []);
        ws['!cols'] = colWidths.map(w => ({ wch: Math.min(w, 50) }));
        XLSX.utils.book_append_sheet(wb, ws, `Page ${p}`);
      }

      const baseName = file.name.replace(/\.pdf$/i, '');
      XLSX.writeFile(wb, `${baseName}.xlsx`);
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  function handleReset() {
    setFile(null); setPdfDoc(null); setStatus(null); setProgress(0); setPreview([]);
  }

  const busy = status === 'loading' || status === 'converting';

  // Max columns in preview
  const maxCols = preview.reduce((m, r) => Math.max(m, r.length), 0);

  return (
    <GlassTool icon="📊" title="PDF to Excel" titleMl="PDF → Excel (.xlsx)">

      {!pdfDoc && !busy && (
        <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />
      )}

      {status === 'loading' && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 24 }}>
          Loading PDF…
        </p>
      )}

      {pdfDoc && (
        <>
          {/* File info bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 16, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span>📄</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.8)' }}>
              {file.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{pdfDoc.numPages} page{pdfDoc.numPages > 1 ? 's' : ''}</span>
            <button onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16 }}>×</button>
          </div>

          {/* Preview table */}
          {preview.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Preview — Page 1 (first {preview.length} rows)
              </p>
              <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <tbody>
                    {preview.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {Array.from({ length: maxCols }).map((_, ci) => (
                          <td key={ci} style={{
                            padding: '5px 10px',
                            color: ri === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                            fontWeight: ri === 0 ? 700 : 400,
                            whiteSpace: 'nowrap',
                            maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis',
                            background: ri === 0 ? 'rgba(16,185,129,0.06)' : 'transparent',
                            fontFamily: "'Noto Sans Malayalam', sans-serif",
                          }}>
                            {row[ci] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Convert button */}
          {status !== 'done' && (
            <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleConvert}>
              {status === 'converting'
                ? `Converting… ${progress}%`
                : '📊 Convert to Excel (.xlsx)'}
            </button>
          )}

          {/* Progress bar */}
          {status === 'converting' && (
            <div style={{ marginTop: 10, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                height: '100%', borderRadius: 4, transition: 'width 0.3s',
                width: `${progress}%`,
                background: 'linear-gradient(90deg,#10b981,#0ea5e9)',
              }} />
            </div>
          )}

          {/* Done state */}
          {status === 'done' && (
            <>
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 12,
                background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#10b981', fontWeight: 700, fontSize: 14, margin: 0 }}>
                  ✓ Download started!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 0' }}>
                  {file.name.replace(/\.pdf$/i, '')}.xlsx — {pdfDoc.numPages} sheet{pdfDoc.numPages > 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button style={outlineBtn} onClick={handleConvert}>⬇ Download again</button>
                <button style={outlineBtn} onClick={handleReset}>← New file</button>
              </div>
            </>
          )}
        </>
      )}

      {/* Tip */}
      {!pdfDoc && !busy && (
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 16, lineHeight: 1.7, textAlign: 'center' }}>
          Best for PDFs with tables or structured data.<br />
          Each PDF page becomes a separate Excel sheet.
        </p>
      )}

      {status?.startsWith('error') && (
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
