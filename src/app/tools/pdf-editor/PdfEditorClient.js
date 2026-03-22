// src/app/tools/pdf-editor/PdfEditorClient.js
'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions, version as pdfjsVersion } from 'pdfjs-dist';
import UploadZone from '@/components/pdf-editor/UploadZone';
import EditorShell from '@/components/pdf-editor/EditorShell';
import usePdfEditor from '@/hooks/usePdfEditor';
import usePdfDownload from '@/hooks/usePdfDownload';

GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export default function PdfEditorClient() {
  const [file,     setFile]     = useState(null);
  const [pdfDoc,   setPdfDoc]   = useState(null);
  const [pageCount,setPageCount]= useState(0);
  const [loadError,setLoadError]= useState(null);

  const editor   = usePdfEditor();
  const { download } = usePdfDownload();

  async function handleFile(f) {
    setLoadError(null);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setFile(f);
      setPdfDoc(doc);
      setPageCount(doc.numPages);
      editor.clearAll();
    } catch (err) {
      if (err.name === 'PasswordException') {
        setLoadError('This PDF is password-protected and cannot be opened.');
      } else {
        setLoadError('Could not read this file. Please choose a valid PDF.');
      }
    }
  }

  function handleOpenNew() {
    setFile(null); setPdfDoc(null); setPageCount(0);
    editor.clearAll();
  }

  function handleDownload() {
    return download(file, editor.annotations);
  }

  if (!file || !pdfDoc) {
    return (
      <div className="relative min-h-screen bg-aurora">
        <UploadZone onFile={handleFile} />
        {loadError && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-[13px]"
            style={{ background: 'rgba(255,69,58,0.15)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.3)' }}>
            {loadError}
          </div>
        )}
      </div>
    );
  }

  return (
    <EditorShell
      file={file}
      pdfDoc={pdfDoc}
      pageCount={pageCount}
      annotations={editor.annotations}
      onAddAnnotation={editor.addAnnotation}
      activeTool={editor.activeTool}
      setActiveTool={editor.setActiveTool}
      currentPage={editor.currentPage}
      setCurrentPage={editor.setCurrentPage}
      style={editor.style}
      setStyle={editor.setStyle}
      onUndo={editor.undo}
      onRedo={editor.redo}
      canUndo={editor.canUndo}
      canRedo={editor.canRedo}
      onOpenNew={handleOpenNew}
      onDownload={handleDownload}
    />
  );
}
