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
const btnDisabled  = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };
const outlineBtn   = {
  padding: '9px 18px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
};

/**
 * Robust table extraction from pdfjs text content.
 *
 * Row grouping:
 *   Items whose Y positions are within ROW_TOL of each other are on the same row.
 *   We use CLOSEST-match (not first-match) so a slightly large tolerance never
 *   accidentally swallows items that belong to the next row.
 *   ROW_TOL is fixed at 4 pt — enough to cover baseline variation within a row
 *   (mixed fonts, slight kerning) but small enough that rows 10+ pt apart stay separate.
 *
 * Column detection:
 *   COL_GAP = max(2.5 × avgCharWidth, 8 pt).
 *   Items closer than COL_GAP are merged into the same cell (text joined with a space).
 *   Items farther apart start a new column.
 */
function extractTableData(items) {
  // ── 1. Filter blanks ──────────────────────────────────────────────────────
  const valid = items.filter(it => it.str && it.str.trim() !== '');
  if (!valid.length) return [];

  // ── 2. Average character width for adaptive column gap ───────────────────
  let wSum = 0, wCount = 0;
  for (const it of valid) {
    if (it.width > 0 && it.str.trim().length > 0) {
      wSum   += it.width;
      wCount += it.str.trim().length;
    }
  }
  const avgCharW = wCount > 0 ? wSum / wCount : 6;
  const COL_GAP  = Math.max(avgCharW * 2.5, 8);   // adaptive, min 8 pt

  // Fixed small row tolerance — just enough to absorb baseline jitter within one line
  const ROW_TOL = 4;

  // ── 3. Fuzzy row grouping (CLOSEST match) ─────────────────────────────────
  const rowKeys = [];   // representative Y values, in insertion order
  const rowMap  = new Map();

  for (const it of valid) {
    const y = it.transform[5]; // ty

    // Find the CLOSEST existing row within ROW_TOL
    let matched = null, minDist = Infinity;
    for (const ry of rowKeys) {
      const dist = Math.abs(ry - y);
      if (dist <= ROW_TOL && dist < minDist) { matched = ry; minDist = dist; }
    }

    if (matched === null) {
      rowMap.set(y, []);
      rowKeys.push(y);
      matched = y;
    }

    rowMap.get(matched).push({
      x:    it.transform[4],
      endX: it.transform[4] + (it.width > 0 ? it.width : avgCharW * it.str.length),
      text: it.str,
    });
  }

  // ── 4. Build 2-D array ────────────────────────────────────────────────────
  return [...rowMap.entries()]
    .sort(([ya], [yb]) => yb - ya)   // PDF Y is bottom-up → descending = top-first
    .map(([, row]) => {
      row.sort((a, b) => a.x - b.x); // left → right within row

      // Merge adjacent items into cells by X gap
      const cells = [];
      for (const item of row) {
        if (!cells.length) {
          cells.push({ text: item.text, endX: item.endX });
          continue;
        }
        const prev = cells[cells.length - 1];
        const gap  = item.x - prev.endX;

        if (gap <= COL_GAP) {
          const sp = gap > 0.5 && !/\s$/.test(prev.text) && !/^\s/.test(item.text);
          prev.text += (sp ? ' ' : '') + item.text;
          prev.endX  = Math.max(prev.endX, item.endX);
        } else {
          cells.push({ text: item.text, endX: item.endX });
        }
      }

      return cells.map(c => c.text.trim()).filter(Boolean);
    })
    .filter(row => row.length > 0);
}

export default function PdfToExcelClient() {
  const [file,     setFile]     = useState(null);
  const [pdfDoc,   setPdfDoc]   = useState(null);
  const [status,   setStatus]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [preview,  setPreview]  = useState([]);   // [{pageNum, rows}]
  const [stats,    setStats]    = useState(null);  // {pages, totalRows}

  async function handleFile([f]) {
    setStatus('loading');
    setPreview([]);
    setStats(null);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;

      // Preview pages 1–3 (or all if fewer)
      const previewPages = [];
      for (let p = 1; p <= Math.min(3, doc.numPages); p++) {
        const pg      = await doc.getPage(p);
        const content = await pg.getTextContent();
        const rows    = extractTableData(content.items);
        if (rows.length) previewPages.push({ pageNum: p, rows: rows.slice(0, 6) });
      }
      setPreview(previewPages);
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
    let totalRows = 0;
    try {
      const XLSX = await import('xlsx');
      const wb   = XLSX.utils.book_new();

      for (let p = 1; p <= pdfDoc.numPages; p++) {
        setProgress(Math.round((p / pdfDoc.numPages) * 100));
        const page    = await pdfDoc.getPage(p);
        const content = await page.getTextContent();
        const rows    = extractTableData(content.items);
        totalRows    += rows.length;

        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Auto-width columns
        const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
        const colW    = Array.from({ length: maxCols }, (_, ci) => ({
          wch: Math.min(
            rows.reduce((m, r) => Math.max(m, String(r[ci] ?? '').length), 8) + 2,
            60,
          ),
        }));
        ws['!cols'] = colW;

        XLSX.utils.book_append_sheet(wb, ws, `Page ${p}`);
      }

      XLSX.writeFile(wb, file.name.replace(/\.pdf$/i, '') + '.xlsx');
      setStats({ pages: pdfDoc.numPages, totalRows });
      setStatus('done');
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  function handleReset() {
    setFile(null); setPdfDoc(null); setStatus(null);
    setProgress(0); setPreview([]); setStats(null);
  }

  const busy    = status === 'loading' || status === 'converting';
  const maxCols = preview.reduce((m, { rows }) =>
    rows.reduce((m2, r) => Math.max(m2, r.length), m), 0);

  return (
    <GlassTool icon="📊" title="PDF to Excel" titleMl="PDF → Excel (.xlsx)">

      {!pdfDoc && !busy && (
        <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />
      )}

      {status === 'loading' && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 24 }}>
          Analysing PDF…
        </p>
      )}

      {pdfDoc && (
        <>
          {/* File info */}
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

          {/* Preview */}
          {preview.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Preview (first 6 rows per page)
              </p>
              {preview.map(({ pageNum, rows }) => {
                const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);
                return (
                  <div key={pageNum} style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>Page {pageNum} — {rows.length} rows · {cols} col{cols !== 1 ? 's' : ''}</p>
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                        <tbody>
                          {rows.map((row, ri) => (
                            <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              {Array.from({ length: cols }).map((_, ci) => (
                                <td key={ci} style={{
                                  padding: '4px 10px',
                                  color: ri === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                                  fontWeight: ri === 0 ? 700 : 400,
                                  whiteSpace: 'nowrap',
                                  maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis',
                                  background: ri === 0 ? 'rgba(16,185,129,0.07)' : 'transparent',
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
                );
              })}
            </div>
          )}

          {/* Convert */}
          {status !== 'done' && (
            <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleConvert}>
              {status === 'converting' ? `Converting… ${progress}%` : '📊 Convert to Excel (.xlsx)'}
            </button>
          )}

          {/* Progress bar */}
          {status === 'converting' && (
            <div style={{ marginTop: 10, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                height: '100%', borderRadius: 4, transition: 'width 0.3s',
                width: `${progress}%`, background: 'linear-gradient(90deg,#10b981,#0ea5e9)',
              }} />
            </div>
          )}

          {/* Done */}
          {status === 'done' && stats && (
            <>
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 12,
                background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#10b981', fontWeight: 700, fontSize: 14, margin: 0 }}>✓ Download started!</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 0' }}>
                  {stats.pages} sheet{stats.pages > 1 ? 's' : ''} · {stats.totalRows} rows extracted
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
