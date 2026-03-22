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
  onUpdateAnnotation, onMoveStart, onDeleteAnnotation,
  onScaleChange,
}) {
  const [showSign,      setShowSign]      = useState(false);
  const [signPos,       setSignPos]       = useState({ x: 0, y: 0 });
  const [dlError,       setDlError]       = useState(null);
  const [selectedAnnId, setSelectedAnnId] = useState(null);

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

  function handlePageChange(p) {
    setSelectedAnnId(null);
    setCurrentPage(p);
  }

  // When style changes, also update the selected text annotation in real-time
  function handleStyleChange(newStyle) {
    setStyle(newStyle);
    if (selectedAnnId) {
      const pageAnns = annotations.get(currentPage) || [];
      const sel = pageAnns.find(a => a.id === selectedAnnId);
      if (sel?.type === 'text') {
        onUpdateAnnotation(currentPage, selectedAnnId, {
          color: newStyle.color,
          fontSize: newStyle.fontSize,
          opacity: newStyle.opacity,
        });
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{
          height: 56, background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span className="text-[15px] font-[900] text-white">PDF Editor</span>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{file?.name}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          Edit your PDF — then click ⬇ Download PDF at the bottom
        </span>
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
          onPageChange={handlePageChange}
        />

        {/* Scrollable canvas area — full width, minimal padding */}
        <div
          style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            padding: '24px 16px 80px',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div data-page-index={currentPage} style={{ width: '100%' }}>
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
              onDeleteAnnotation={(id) => { onDeleteAnnotation(currentPage, id); setSelectedAnnId(null); }}
              selectedId={selectedAnnId}
              onSelectionChange={setSelectedAnnId}
              onScaleChange={onScaleChange}
            />
          </div>

          <StyleBar style={style} onChange={handleStyleChange} />
        </div>
      </div>

      {/* Bottom action bar — always visible */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-6"
        style={{
          height: 64,
          background: 'rgba(10,10,20,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
          🔒 All processing is local — no file leaves your browser
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {dlError && <span style={{ fontSize: 12, color: '#ff453a' }}>{dlError}</span>}
          <button
            onClick={onOpenNew}
            style={{
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              borderRadius: 10, padding: '9px 18px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
            }}
          >
            📂 Open New
          </button>
          <button
            onClick={handleDownload}
            style={{
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              borderRadius: 12, padding: '11px 28px',
              background: '#30d158',
              color: '#000',
              border: 'none',
              boxShadow: '0 4px 20px rgba(48,209,88,0.5)',
              letterSpacing: '0.01em',
            }}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {showSign && (
        <SignModal onConfirm={handleSignConfirm} onClose={() => setShowSign(false)} />
      )}
    </div>
  );
}
