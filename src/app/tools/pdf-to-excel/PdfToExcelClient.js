'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// ─── Styles ──────────────────────────────────────────────────────────────────
const btn = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
  color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  marginTop: 8, letterSpacing: 0.3,
  boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
};
const btnDisabled = { ...btn, opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' };
const outlineBtn  = {
  padding: '9px 18px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
};

// ─── Extraction ───────────────────────────────────────────────────────────────
function extractTableData(items) {
  const valid = items.filter(it => it.str && it.str.trim() !== '');
  if (!valid.length) return [];

  let wSum = 0, wCount = 0;
  for (const it of valid) {
    if (it.width > 0 && it.str.trim().length > 0) { wSum += it.width; wCount += it.str.trim().length; }
  }
  const avgCharW = wCount > 0 ? wSum / wCount : 6;
  const COL_GAP  = Math.max(avgCharW * 2.5, 8);
  const ROW_TOL  = 4;

  const rowKeys = [], rowMap = new Map();
  for (const it of valid) {
    const y = it.transform[5];
    let matched = null, minDist = Infinity;
    for (const ry of rowKeys) {
      const dist = Math.abs(ry - y);
      if (dist <= ROW_TOL && dist < minDist) { matched = ry; minDist = dist; }
    }
    if (matched === null) { rowMap.set(y, []); rowKeys.push(y); matched = y; }
    rowMap.get(matched).push({
      x:    it.transform[4],
      endX: it.transform[4] + (it.width > 0 ? it.width : avgCharW * it.str.length),
      text: it.str,
    });
  }

  return [...rowMap.entries()]
    .sort(([ya], [yb]) => yb - ya)
    .map(([, row]) => {
      row.sort((a, b) => a.x - b.x);
      const cells = [];
      for (const item of row) {
        if (!cells.length) { cells.push({ text: item.text, endX: item.endX }); continue; }
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

function autoColWidths(rows) {
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
  return Array.from({ length: maxCols }, (_, ci) => ({
    wch: Math.min(rows.reduce((m, r) => Math.max(m, String(r[ci] ?? '').length), 8) + 2, 60),
  }));
}

function rowsToTsv(rows) {
  return rows.map(r => r.map(c => String(c ?? '').replace(/\t/g, ' ')).join('\t')).join('\n');
}

function rowsToCsv(rows) {
  return rows.map(r =>
    r.map(c => {
      const s = String(c ?? '');
      return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')
  ).join('\n');
}

// ─── Option toggle chip ───────────────────────────────────────────────────────
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 700,
      background: active ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.06)',
      color:      active ? '#10b981'                : 'rgba(255,255,255,0.45)',
      outline:    active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 36, height: 20, borderRadius: 10, position: 'relative', transition: 'background 0.2s',
        background: checked ? '#10b981' : 'rgba(255,255,255,0.12)',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
    </label>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────
function NumInput({ value, onChange, min, max, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 }}>{label}</span>
      <input
        type="number" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: 56, padding: '4px 8px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.07)', color: '#fff',
          fontSize: 13, fontWeight: 600, textAlign: 'center', outline: 'none',
        }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PdfToExcelClient() {
  const [file,        setFile]        = useState(null);
  const [pdfDoc,      setPdfDoc]      = useState(null);
  const [status,      setStatus]      = useState(null);
  const [progress,    setProgress]    = useState(0);
  const [preview,     setPreview]     = useState([]);
  const [stats,       setStats]       = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [lastRows,    setLastRows]    = useState([]);   // for clipboard copy

  // Options
  const [sheetMode,   setSheetMode]   = useState('single');   // 'single' | 'multi'
  const [exportFmt,   setExportFmt]   = useState('xlsx');     // 'xlsx' | 'csv'
  const [addPageCol,  setAddPageCol]  = useState(false);
  const [boldHeader,  setBoldHeader]  = useState(true);
  const [minCols,     setMinCols]     = useState(1);          // skip rows with fewer cols
  const [pageFrom,    setPageFrom]    = useState(1);
  const [pageTo,      setPageTo]      = useState(1);

  async function handleFile([f]) {
    setStatus('loading'); setPreview([]); setStats(null); setLastRows([]);
    try {
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      setPageFrom(1);
      setPageTo(doc.numPages);
      const previewPages = [];
      for (let p = 1; p <= Math.min(3, doc.numPages); p++) {
        const content = await (await doc.getPage(p)).getTextContent();
        const rows    = extractTableData(content.items);
        if (rows.length) previewPages.push({ pageNum: p, rows: rows.slice(0, 6) });
      }
      setPreview(previewPages);
      setFile(f); setPdfDoc(doc); setStatus(null);
    } catch (err) { setStatus('error: ' + err.message); }
  }

  async function handleConvert() {
    if (!pdfDoc) return;
    setStatus('converting'); setProgress(0); setCopied(false);
    let totalRows = 0, totalSheets = 0;
    const clampedFrom = Math.max(1, Math.min(pageFrom, pdfDoc.numPages));
    const clampedTo   = Math.max(clampedFrom, Math.min(pageTo, pdfDoc.numPages));
    const pageCount   = clampedTo - clampedFrom + 1;

    try {
      if (exportFmt === 'csv') {
        // ── CSV export ────────────────────────────────────────────────────
        const allRows = [];
        for (let p = clampedFrom; p <= clampedTo; p++) {
          setProgress(Math.round(((p - clampedFrom + 1) / pageCount) * 100));
          const content = await (await pdfDoc.getPage(p)).getTextContent();
          const rows    = extractTableData(content.items).filter(r => r.length >= minCols);
          rows.forEach(row => {
            allRows.push(addPageCol ? [`Page ${p}`, ...row] : row);
          });
          totalRows += rows.length;
        }
        setLastRows(allRows);
        const csvStr  = rowsToCsv(allRows);
        const blob    = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const url     = URL.createObjectURL(blob);
        const a       = document.createElement('a');
        a.href = url; a.download = file.name.replace(/\.pdf$/i, '') + '.csv';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        setStats({ pages: pageCount, totalRows, totalSheets: 1 });
        setStatus('done');
        return;
      }

      // ── Excel export ──────────────────────────────────────────────────
      const XLSX = await import('xlsx');
      const wb   = XLSX.utils.book_new();

      if (sheetMode === 'single') {
        const allRows = [];
        for (let p = clampedFrom; p <= clampedTo; p++) {
          setProgress(Math.round(((p - clampedFrom + 1) / pageCount) * 100));
          const content = await (await pdfDoc.getPage(p)).getTextContent();
          const rows    = extractTableData(content.items).filter(r => r.length >= minCols);
          rows.forEach(row => {
            allRows.push(addPageCol ? [`Page ${p}`, ...row] : row);
          });
          totalRows += rows.length;
        }
        setLastRows(allRows);
        const ws = XLSX.utils.aoa_to_sheet(allRows);
        ws['!cols'] = autoColWidths(allRows);
        if (boldHeader && allRows.length) {
          const maxC = allRows[0].length;
          for (let c = 0; c < maxC; c++) {
            const addr = XLSX.utils.encode_cell({ r: 0, c });
            if (ws[addr]) ws[addr].s = { font: { bold: true } };
          }
        }
        XLSX.utils.book_append_sheet(wb, ws, 'All Pages');
        totalSheets = 1;

      } else {
        const allRowsFlat = [];
        for (let p = clampedFrom; p <= clampedTo; p++) {
          setProgress(Math.round(((p - clampedFrom + 1) / pageCount) * 100));
          const content = await (await pdfDoc.getPage(p)).getTextContent();
          const rows    = extractTableData(content.items).filter(r => r.length >= minCols);
          if (!rows.length) continue;
          const sheetRows = addPageCol ? rows.map(r => [`Page ${p}`, ...r]) : rows;
          allRowsFlat.push(...sheetRows);
          const ws = XLSX.utils.aoa_to_sheet(sheetRows);
          ws['!cols'] = autoColWidths(sheetRows);
          if (boldHeader && sheetRows.length) {
            const maxC = sheetRows[0].length;
            for (let c = 0; c < maxC; c++) {
              const addr = XLSX.utils.encode_cell({ r: 0, c });
              if (ws[addr]) ws[addr].s = { font: { bold: true } };
            }
          }
          XLSX.utils.book_append_sheet(wb, ws, `Page ${p}`);
          totalRows += rows.length;
          totalSheets++;
        }
        setLastRows(allRowsFlat);
      }

      XLSX.writeFile(wb, file.name.replace(/\.pdf$/i, '') + '.xlsx');
      setStats({ pages: pageCount, totalRows, totalSheets });
      setStatus('done');
    } catch (err) { setStatus('error: ' + err.message); }
  }

  function handleCopyClipboard() {
    if (!lastRows.length) return;
    navigator.clipboard.writeText(rowsToTsv(lastRows)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleReset() {
    setFile(null); setPdfDoc(null); setStatus(null);
    setProgress(0); setPreview([]); setStats(null);
    setLastRows([]); setCopied(false);
  }

  const busy = status === 'loading' || status === 'converting';

  return (
    <GlassTool icon="📊" title="PDF to Excel" titleMl="PDF → Excel / CSV">

      {!pdfDoc && !busy && (
        <>
          <UploadDropZone onFiles={handleFile} label="Drop a PDF here or click to browse" />
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 14, lineHeight: 1.7, textAlign: 'center' }}>
            Extracts tables & structured text from any PDF.<br/>Files never leave your device.
          </p>
        </>
      )}

      {status === 'loading' && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 24 }}>Analysing PDF…</p>
      )}

      {pdfDoc && (
        <>
          {/* File bar */}
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
            <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16 }}>×</button>
          </div>

          {/* ── Options ── */}
          {status !== 'done' && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px',
              marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16,
            }}>

              {/* Export format */}
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Export format
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Chip active={exportFmt === 'xlsx'} onClick={() => setExportFmt('xlsx')}>📊 Excel (.xlsx)</Chip>
                  <Chip active={exportFmt === 'csv'}  onClick={() => setExportFmt('csv')}>📄 CSV (.csv)</Chip>
                </div>
              </div>

              {/* Sheet layout — only for xlsx */}
              {exportFmt === 'xlsx' && (
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    Sheet layout
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Chip active={sheetMode === 'single'} onClick={() => setSheetMode('single')}>📄 All pages → 1 sheet</Chip>
                    <Chip active={sheetMode === 'multi'}  onClick={() => setSheetMode('multi')}>📑 Each page → separate sheet</Chip>
                  </div>
                </div>
              )}

              {/* Page range */}
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Page range
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <NumInput label="From page" value={pageFrom} min={1} max={pdfDoc.numPages}
                    onChange={v => setPageFrom(Math.max(1, Math.min(v, pageTo)))} />
                  <NumInput label="To page" value={pageTo} min={pageFrom} max={pdfDoc.numPages}
                    onChange={v => setPageTo(Math.max(pageFrom, Math.min(v, pdfDoc.numPages)))} />
                </div>
                {(pageFrom !== 1 || pageTo !== pdfDoc.numPages) && (
                  <p style={{ fontSize: 10, color: '#10b981', marginTop: 6 }}>
                    Converting pages {pageFrom}–{pageTo} ({pageTo - pageFrom + 1} of {pdfDoc.numPages})
                  </p>
                )}
              </div>

              {/* Row filter */}
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Row filter
                </p>
                <NumInput label="Skip rows with fewer than N columns" value={minCols} min={1} max={20}
                  onChange={v => setMinCols(Math.max(1, v))} />
                {minCols > 1 && (
                  <p style={{ fontSize: 10, color: 'rgba(255,200,100,0.8)', marginTop: 6 }}>
                    Rows with &lt;{minCols} columns will be skipped (removes single-column noise)
                  </p>
                )}
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Toggle checked={boldHeader}  onChange={setBoldHeader}  label="Bold first row (header row)" />
                <Toggle checked={addPageCol}  onChange={setAddPageCol}  label="Add page number column" />
              </div>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && status !== 'done' && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Preview (first 3 pages)
              </p>
              {preview.map(({ pageNum, rows }) => {
                const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);
                return (
                  <div key={pageNum} style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>
                      Page {pageNum} — {rows.length} rows · {cols} col{cols !== 1 ? 's' : ''}
                    </p>
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
                        <tbody>
                          {rows.map((row, ri) => (
                            <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              {Array.from({ length: cols }).map((_, ci) => (
                                <td key={ci} style={{
                                  padding: '4px 10px', whiteSpace: 'nowrap',
                                  maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis',
                                  color:      ri === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                                  fontWeight: ri === 0 && boldHeader ? 700 : 400,
                                  background: ri === 0 && boldHeader ? 'rgba(16,185,129,0.07)' : 'transparent',
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

          {/* Convert button */}
          {status !== 'done' && (
            <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleConvert}>
              {status === 'converting'
                ? `Converting… ${progress}%`
                : exportFmt === 'csv' ? '📄 Convert to CSV' : '📊 Convert to Excel (.xlsx)'}
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
                  {stats.totalSheets} sheet{stats.totalSheets > 1 ? 's' : ''} · {stats.totalRows} rows · {stats.pages} page{stats.pages > 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={outlineBtn} onClick={handleConvert}>⬇ Download again</button>
                <button style={outlineBtn} onClick={handleCopyClipboard}>
                  {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
                </button>
                <button style={outlineBtn} onClick={handleReset}>← New file</button>
              </div>
            </>
          )}
        </>
      )}

      {status?.startsWith('error') && (
        <p style={{ color: '#ff453a', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{status}</p>
      )}
    </GlassTool>
  );
}
