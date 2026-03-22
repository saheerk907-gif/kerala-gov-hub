// src/components/pdf-editor/EditorShell.js
'use client';
import { useState, useEffect } from 'react';
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
  const [isMobile,      setIsMobile]      = useState(false);

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>

      {/* Top bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', flexShrink: 0,
          height: isMobile ? 48 : 56,
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap' }}>
          PDF Editor
        </span>

        {/* File name — hide on very small screens */}
        {!isMobile && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {file?.name}
          </span>
        )}

        <span style={{ flex: 1 }} />

        {/* Mobile: page navigation arrows */}
        {isMobile && pageCount > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 16,
                cursor: currentPage === 0 ? 'default' : 'pointer',
                opacity: currentPage === 0 ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', minWidth: 40, textAlign: 'center' }}>
              {currentPage + 1}/{pageCount}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(pageCount - 1, currentPage + 1))}
              disabled={currentPage === pageCount - 1}
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 16,
                cursor: currentPage === pageCount - 1 ? 'default' : 'pointer',
                opacity: currentPage === pageCount - 1 ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          </div>
        )}

        {/* Desktop hint */}
        {!isMobile && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
            ⬇ Download PDF at the bottom
          </span>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={() => onUndo(currentPage)}
        onRedo={() => onRedo(currentPage)}
        canUndo={canUndo(currentPage)}
        canRedo={canRedo(currentPage)}
        isMobile={isMobile}
      />

      {/* Body: thumbnails (desktop only) + canvas */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Page thumbnails — hidden on mobile */}
        {!isMobile && (
          <PageThumbnails
            pdfDoc={pdfDoc}
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Scrollable canvas area */}
        <div
          style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            padding: isMobile ? '8px 4px 80px' : '24px 16px 80px',
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

          <StyleBar style={style} onChange={handleStyleChange} isMobile={isMobile} />
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          flexShrink: 0,
          padding: isMobile ? '0 12px' : '0 24px',
          gap: 10,
          height: isMobile ? 60 : 64,
          background: 'rgba(10,10,20,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {!isMobile && (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
            🔒 All processing is local — no file leaves your browser
          </span>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: isMobile ? 1 : 'unset' }}>
          {dlError && <span style={{ fontSize: 11, color: '#ff453a' }}>{dlError}</span>}
          <button
            onClick={onOpenNew}
            style={{
              fontSize: isMobile ? 12 : 13, fontWeight: 700, cursor: 'pointer',
              borderRadius: 10, padding: isMobile ? '8px 12px' : '9px 18px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
              whiteSpace: 'nowrap',
            }}
          >
            📂 {isMobile ? 'New' : 'Open New'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              fontSize: isMobile ? 13 : 15, fontWeight: 800, cursor: 'pointer',
              borderRadius: 12, padding: isMobile ? '9px 20px' : '11px 28px',
              background: '#30d158', color: '#000', border: 'none',
              boxShadow: '0 4px 20px rgba(48,209,88,0.5)',
              flex: isMobile ? 1 : 'unset',
              whiteSpace: 'nowrap',
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
