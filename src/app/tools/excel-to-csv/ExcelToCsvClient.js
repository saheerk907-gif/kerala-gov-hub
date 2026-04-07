'use client';
import { useState, useRef } from 'react';
import GlassTool from '@/components/pdf-tools/GlassTool';
import UploadDropZone from '@/components/pdf-tools/UploadDropZone';

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

function rowsToCsv(rows) {
  return rows.map(r =>
    r.map(c => {
      const s = String(c ?? '');
      return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')
  ).join('\n');
}

function rowsToTsv(rows) {
  return rows.map(r => r.map(c => String(c ?? '').replace(/\t/g, ' ')).join('\t')).join('\n');
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

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 700,
      background: active ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.06)',
      color:      active ? '#10b981'                : 'rgba(255,255,255,0.45)',
      outline:    active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.15s',
    }}>{children}</button>
  );
}

// ─── Sheet tab ────────────────────────────────────────────────────────────────
function SheetTab({ name, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
      fontSize: 11, fontWeight: 600,
      background: active ? 'rgba(41,151,255,0.18)' : 'rgba(255,255,255,0.05)',
      color:      active ? '#2997ff'               : 'rgba(255,255,255,0.4)',
      outline:    active ? '1px solid rgba(41,151,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{name}</button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ExcelToCsvClient() {
  const [file,         setFile]         = useState(null);
  const [sheets,       setSheets]       = useState([]);      // [{ name, rows }]
  const [activeSheet,  setActiveSheet]  = useState(0);
  const [status,       setStatus]       = useState(null);
  const [copied,       setCopied]       = useState(false);

  // Options
  const [exportAll,    setExportAll]    = useState(false);   // export all sheets as zip? no — export each as separate download
  const [delimiter,    setDelimiter]    = useState(',');     // ',' | ';' | '\t'
  const [skipEmpty,    setSkipEmpty]    = useState(true);    // skip fully empty rows
  const [includeHeader,setIncludeHeader]= useState(true);    // keep first row

  const busy = status === 'loading' || status === 'converting';

  async function handleFile([f]) {
    setStatus('loading'); setSheets([]); setCopied(false);
    try {
      const XLSX   = await import('xlsx');
      const buf    = await f.arrayBuffer();
      const wb     = XLSX.read(buf, { type: 'array' });
      const parsed = wb.SheetNames.map(name => {
        const ws   = wb.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        return { name, rows };
      });
      setFile(f);
      setSheets(parsed);
      setActiveSheet(0);
      setStatus(null);
    } catch (err) {
      setStatus('error: ' + err.message);
    }
  }

  function getProcessedRows(sheetIdx) {
    let rows = sheets[sheetIdx]?.rows ?? [];
    if (skipEmpty) rows = rows.filter(r => r.some(c => String(c ?? '').trim() !== ''));
    if (!includeHeader && rows.length > 0) rows = rows.slice(1);
    return rows;
  }

  function buildCsvString(rows, sep) {
    return rows.map(r =>
      r.map(c => {
        const s = String(c ?? '');
        return (s.includes(sep) || s.includes('"') || s.includes('\n'))
          ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(sep)
    ).join('\n');
  }

  function downloadCsv(rows, name, sep) {
    const csvStr  = buildCsvString(rows, sep);
    const mime    = sep === '\t' ? 'text/tab-separated-values' : 'text/csv';
    const ext     = sep === '\t' ? '.tsv' : '.csv';
    const blob    = new Blob(['\uFEFF' + csvStr], { type: `${mime};charset=utf-8;` });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url;
    a.download = name + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function handleConvertCurrent() {
    const rows = getProcessedRows(activeSheet);
    const baseName = (file.name.replace(/\.(xlsx?|ods)$/i, '') + '_' + sheets[activeSheet].name).replace(/\s+/g, '_');
    downloadCsv(rows, baseName, delimiter);
    setStatus('done');
  }

  function handleConvertAll() {
    sheets.forEach((_, i) => {
      const rows     = getProcessedRows(i);
      const baseName = (file.name.replace(/\.(xlsx?|ods)$/i, '') + '_' + sheets[i].name).replace(/\s+/g, '_');
      downloadCsv(rows, baseName, delimiter);
    });
    setStatus('done');
  }

  function handleCopy() {
    const rows = getProcessedRows(activeSheet);
    navigator.clipboard.writeText(rowsToTsv(rows)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleReset() {
    setFile(null); setSheets([]); setActiveSheet(0);
    setStatus(null); setCopied(false);
  }

  const currentRows   = sheets.length ? getProcessedRows(activeSheet) : [];
  const previewRows   = currentRows.slice(0, 8);
  const previewCols   = previewRows.reduce((m, r) => Math.max(m, r.length), 0);

  const delimLabel = { ',': 'Comma  ,', ';': 'Semicolon  ;', '\t': 'Tab  ⇥' };

  return (
    <GlassTool icon="🔄" title="Excel to CSV" titleMl="Excel → CSV">

      {!file && !busy && (
        <>
          <UploadDropZone
            onFiles={handleFile}
            label="Drop an Excel file (.xlsx / .xls) here or click to browse"
            accept=".xlsx,.xls,.ods"
            filterFn={f => /\.(xlsx?|ods)$/i.test(f.name)}
          />
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 14, lineHeight: 1.7, textAlign: 'center' }}>
            Supports .xlsx, .xls and .ods files.<br/>Files never leave your device.
          </p>
        </>
      )}

      {status === 'loading' && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 24 }}>Reading Excel file…</p>
      )}

      {file && sheets.length > 0 && (
        <>
          {/* File bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', borderRadius: 10,
            padding: '9px 14px', marginBottom: 16, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span>📊</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.8)' }}>
              {file.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
              {sheets.length} sheet{sheets.length > 1 ? 's' : ''}
            </span>
            <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff453a', fontSize: 16 }}>×</button>
          </div>

          {/* Sheet selector */}
          {sheets.length > 1 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Sheets
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {sheets.map((s, i) => (
                  <SheetTab key={s.name} name={s.name} active={activeSheet === i} onClick={() => { setActiveSheet(i); setStatus(null); }} />
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {status !== 'done' && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px',
              marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {/* Delimiter */}
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Delimiter
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[',', ';', '\t'].map(d => (
                    <Chip key={d} active={delimiter === d} onClick={() => setDelimiter(d)}>
                      {delimLabel[d]}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Toggle checked={skipEmpty}     onChange={setSkipEmpty}     label="Skip fully empty rows" />
                <Toggle checked={includeHeader} onChange={setIncludeHeader} label="Include header row (first row)" />
              </div>
            </div>
          )}

          {/* Preview */}
          {previewRows.length > 0 && status !== 'done' && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Preview — {sheets[activeSheet].name} ({currentRows.length} rows)
              </p>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 11, width: '100%' }}>
                  <tbody>
                    {previewRows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {Array.from({ length: previewCols }).map((_, ci) => (
                          <td key={ci} style={{
                            padding: '4px 10px', whiteSpace: 'nowrap',
                            maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis',
                            color:      ri === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                            fontWeight: ri === 0 && includeHeader ? 700 : 400,
                            background: ri === 0 && includeHeader ? 'rgba(41,151,255,0.07)' : 'transparent',
                          }}>
                            {String(row[ci] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {currentRows.length > 8 && (
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4, textAlign: 'right' }}>
                  …and {currentRows.length - 8} more rows
                </p>
              )}
            </div>
          )}

          {/* Convert buttons */}
          {status !== 'done' && (
            <>
              <button style={busy ? btnDisabled : btn} disabled={busy} onClick={handleConvertCurrent}>
                ⬇ Download "{sheets[activeSheet]?.name}" as CSV
              </button>
              {sheets.length > 1 && (
                <button style={{ ...outlineBtn, width: '100%', marginTop: 8, textAlign: 'center' }} onClick={handleConvertAll}>
                  ⬇ Download all {sheets.length} sheets as separate CSVs
                </button>
              )}
            </>
          )}

          {/* Done */}
          {status === 'done' && (
            <>
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 12,
                background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#10b981', fontWeight: 700, fontSize: 14, margin: 0 }}>✓ Download started!</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 0' }}>
                  {currentRows.length} rows exported
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={outlineBtn} onClick={handleConvertCurrent}>⬇ Download again</button>
                <button style={outlineBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
                </button>
                <button style={outlineBtn} onClick={() => setStatus(null)}>← Back to options</button>
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
