'use client';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-[#1c1c1e] border border-white/10 rounded-xl flex items-center justify-center text-[#6e6e73] text-sm">
      Loading editor...
    </div>
  ),
});

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote'],
  ['clean'],
];

export default function RichTextEditor({ value, onChange, placeholder = '', minHeight = 180 }) {
  return (
    <div className="rich-editor-wrap">
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{ toolbar: TOOLBAR }}
        style={{ minHeight }}
      />
      <style>{`
        .rich-editor-wrap .ql-toolbar {
          background: #1c1c1e;
          border: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px 12px 0 0;
        }
        .rich-editor-wrap .ql-container {
          background: #1c1c1e;
          border: 1px solid rgba(255,255,255,0.1);
          border-top: none;
          border-radius: 0 0 12px 12px;
          min-height: ${minHeight}px;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
        }
        .rich-editor-wrap .ql-editor {
          min-height: ${minHeight}px;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .rich-editor-wrap .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.50);
          font-style: normal;
        }
        .rich-editor-wrap .ql-toolbar .ql-stroke { stroke: rgba(255,255,255,0.5); }
        .rich-editor-wrap .ql-toolbar .ql-fill   { fill:   rgba(255,255,255,0.5); }
        .rich-editor-wrap .ql-toolbar .ql-picker-label { color: rgba(255,255,255,0.5); }
        .rich-editor-wrap .ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrap .ql-toolbar button.ql-active .ql-stroke { stroke: #2997ff; }
        .rich-editor-wrap .ql-toolbar button:hover .ql-fill,
        .rich-editor-wrap .ql-toolbar button.ql-active .ql-fill   { fill:   #2997ff; }
        .rich-editor-wrap .ql-toolbar button:hover,
        .rich-editor-wrap .ql-toolbar button.ql-active { color: #2997ff; }
        .rich-editor-wrap .ql-picker-options {
          background: #1c1c1e;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
        .rich-editor-wrap .ql-container:focus-within {
          border-color: #2997ff;
        }
        .rich-editor-wrap .ql-editor h1,
        .rich-editor-wrap .ql-editor h2,
        .rich-editor-wrap .ql-editor h3 { color: white; margin: 8px 0 4px; }
        .rich-editor-wrap .ql-editor ul,
        .rich-editor-wrap .ql-editor ol  { padding-left: 1.5em; }
        .rich-editor-wrap .ql-editor li  { margin: 4px 0; }
        .rich-editor-wrap .ql-editor blockquote {
          border-left: 3px solid #2997ff;
          padding-left: 12px;
          color: rgba(255,255,255,0.5);
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}
