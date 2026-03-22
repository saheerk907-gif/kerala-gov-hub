// src/components/pdf-editor/EditorShell.js
'use client';
import { useState } from 'react';
import Toolbar from './Toolbar';
import PageThumbnails from './PageThumbnails';
import PdfCanvas from './PdfCanvas';
import StyleBar from './StyleBar';
import SignModal from './SignModal';

export default function EditorShell({
  file, pdfDoc, pageCount,
  annotations, onAddAnnotation,
  activeTool, setActiveTool,
  currentPage, setCurrentPage,
  style, setStyle,
  onUndo, onRedo, canUndo, canRedo,
  onOpenNew, onDownload,
  onUpdateAnnotation, onMoveStart,
}) {
  const [showSign, setShowSign] = useState(false);
  const [signPos,  setSignPos]  = useState({ x: 0, y: 0 });
  const [dlError,  setDlError]  = useState(null);

  function handleSignRequest(pos) { setSignPos(pos); setShowSign(true); }
  function handleSignConfirm(dataUrl) {
    onAddAnnotation(currentPage, {
      type: 'sign', x: signPos.x, y: signPos.y,
      width: 200, height: 80,
      imageDataUrl: dataUrl, color: '#000', opacity: 1, fontSize: 14,
    });
    setShowSign(false);
  }

  async function handleDownload() {
    setDlError(null);
    const result = await onDownload();
    if (!result?.ok) setDlError('Download failed. Please try again.');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          height: 48, background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span className="text-[14px] font-[900] text-white">PDF Editor</span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{file?.name}</span>
        <span style={{ flex: 1 }} />
        {dlError && <span className="text-[11px]" style={{ color: '#ff453a' }}>{dlError}</span>}
        <button
          onClick={onOpenNew}
          className="text-[11px] font-[700] border-none cursor-pointer rounded-[10px] px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
        >
          📂 Open New
        </button>
        <button
          onClick={handleDownload}
          className="text-[11px] font-[700] border-none cursor-pointer rounded-[10px] px-3 py-1.5"
          style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158', border: '1px solid rgba(48,209,88,0.3)' }}
        >
          ⬇ Download PDF
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={() => onUndo(currentPage)}
        onRedo={() => onRedo(currentPage)}
        canUndo={canUndo(currentPage)}
        canRedo={canRedo(currentPage)}
      />

      {/* Body: thumbnails + canvas */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PageThumbnails
          pdfDoc={pdfDoc}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {/* Scrollable canvas area */}
        <div
          style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 32px 80px',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div data-page-index={currentPage}>
            <PdfCanvas
              pdfDoc={pdfDoc}
              pageIndex={currentPage}
              annotations={annotations.get(currentPage) || []}
              onAddAnnotation={(ann) => onAddAnnotation(currentPage, ann)}
              activeTool={activeTool}
              style={style}
              onSignRequest={handleSignRequest}
              onUpdateAnnotation={(id, updates) => onUpdateAnnotation(currentPage, id, updates)}
              onMoveStart={() => onMoveStart(currentPage)}
            />
          </div>

          <StyleBar style={style} onChange={setStyle} />
        </div>
      </div>

      {/* Privacy bar */}
      <div
        className="text-center flex-shrink-0 py-1.5"
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        🔒 All processing happens locally in your browser — no file is uploaded to any server
      </div>

      {showSign && (
        <SignModal onConfirm={handleSignConfirm} onClose={() => setShowSign(false)} />
      )}
    </div>
  );
}
