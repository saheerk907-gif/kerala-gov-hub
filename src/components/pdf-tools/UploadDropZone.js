'use client';
import { useRef, useState } from 'react';

export default function UploadDropZone({ onFiles, multiple = false, label = 'Drop PDF(s) here or click to browse' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length) onFiles(multiple ? files : [files[0]]);
  }

  function handleChange(e) {
    const files = Array.from(e.target.files);
    if (files.length) onFiles(multiple ? files : [files[0]]);
    e.target.value = '';
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'rgba(41,151,255,0.7)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 14,
        padding: '32px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'rgba(41,151,255,0.07)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.2s',
        marginBottom: 20,
        userSelect: 'none',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.7 }}>📎</div>
      <p style={{ color: dragging ? '#2997ff' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, margin: 0 }}>
        {label}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 }}>PDF only</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
