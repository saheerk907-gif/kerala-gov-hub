// src/components/pdf-editor/UploadZone.js
'use client';
import { useRef, useState } from 'react';

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export default function UploadZone({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  function handleFile(file) {
    setError(null);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a valid PDF file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File too large (max 50 MB).');
      return;
    }
    onFile(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="px-4 md:px-6 max-w-[860px] mx-auto pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="section-label mb-2">Tools</div>
        <h1 className="text-[clamp(26px,4vw,40px)] font-[900] text-white tracking-[-0.02em]">
          PDF Editor
        </h1>
        <p className="text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>
          Edit, annotate and sign PDFs — everything stays in your browser
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-[28px] transition-all duration-300"
        style={{
          border: `2px dashed ${dragging ? 'rgba(41,151,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
          background: dragging ? 'rgba(41,151,255,0.05)' : 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(16px)',
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>📄</div>
        <div className="text-[22px] font-[800] text-white mb-2">Drop your PDF here</div>
        <div className="text-[14px] mb-8" style={{ color: 'var(--text-muted)' }}>
          Drag & drop any PDF file to get started
        </div>
        <div className="text-[12px] mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>— OR —</div>
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="text-white font-[700] text-[15px] border-none cursor-pointer"
          style={{ background: '#2997ff', padding: '14px 36px', borderRadius: 14 }}
        >
          📂 Choose PDF File
        </button>
        <div className="text-[11px] mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Supports PDF files up to 50 MB
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 text-[13px] px-4 py-3 rounded-xl"
          style={{ background: 'rgba(255,69,58,0.1)', color: '#ff453a' }}>
          {error}
        </div>
      )}

      {/* Privacy badge */}
      <div className="mt-5 flex items-center justify-center gap-2 py-4 rounded-[16px]"
        style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)' }}>
        <span className="text-[13px] font-[600]" style={{ color: 'rgba(48,209,88,0.85)' }}>
          🔒 Your files never leave your device — all editing happens locally in the browser
        </span>
      </div>
    </div>
  );
}
