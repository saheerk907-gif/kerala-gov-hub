export default function KsrContent({ html, accentColor = '#2997ff' }) {
  if (!html || html === '<p><br></p>') return null;

  return (
    <>
      <div className="ksr-content" dangerouslySetInnerHTML={{ __html: html }} />
      <style>{`
        .ksr-content {
          line-height: 1.9;
          color: #e5e5e7;
          font-family: var(--font-noto-malayalam), Georgia, serif;
        }

        /* Headings */
        .ksr-content h2 {
          font-size: clamp(1.15rem, 2.5vw, 1.4rem);
          font-weight: 800;
          color: white;
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          font-family: var(--font-noto-malayalam), sans-serif;
        }
        .ksr-content h2:first-child { margin-top: 0; }

        .ksr-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: ${accentColor};
          margin: 2rem 0 0.6rem;
          padding-left: 12px;
          border-left: 3px solid ${accentColor};
          font-family: var(--font-noto-malayalam), sans-serif;
        }

        /* Paragraphs */
        .ksr-content p {
          margin-bottom: 1.1rem;
          color: #aeaeb2;
          font-size: 0.95rem;
          line-height: 1.9;
        }

        /* Bold */
        .ksr-content strong,
        .ksr-content b {
          color: rgba(255,255,255,0.9);
          font-weight: 700;
        }

        /* Italic */
        .ksr-content em { color: #c7c7cc; font-style: italic; }

        /* Unordered list */
        .ksr-content ul {
          list-style: none;
          padding: 0;
          margin: 0.75rem 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ksr-content ul li {
          position: relative;
          padding: 0.8rem 1rem 0.8rem 2.25rem;
          background: ${accentColor}07;
          border: 1px solid ${accentColor}15;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #aeaeb2;
          line-height: 1.6;
        }
        .ksr-content ul li::before {
          content: '✦';
          color: ${accentColor};
          font-size: 0.55rem;
          position: absolute;
          left: 0.85rem;
          top: 0.95rem;
        }

        /* Ordered list */
        .ksr-content ol {
          list-style: none;
          padding: 0;
          margin: 0.75rem 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          counter-reset: ksr-counter;
        }
        .ksr-content ol li {
          position: relative;
          padding: 0.8rem 1rem 0.8rem 2.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          font-size: 0.9rem;
          color: #aeaeb2;
          line-height: 1.6;
          counter-increment: ksr-counter;
        }
        .ksr-content ol li::before {
          content: counter(ksr-counter);
          position: absolute;
          left: 0.75rem;
          top: 0.75rem;
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;
          background: ${accentColor}18;
          color: ${accentColor};
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Blockquote */
        .ksr-content blockquote {
          margin: 1.25rem 0;
          padding: 1rem 1.25rem;
          border-left: 3px solid ${accentColor};
          background: ${accentColor}06;
          border-radius: 0 12px 12px 0;
          color: #aeaeb2;
          font-size: 0.9rem;
          line-height: 1.75;
        }
        .ksr-content blockquote p { margin: 0; color: inherit; }

        /* Table */
        .ksr-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          border-radius: 12px;
          overflow: hidden;
        }
        .ksr-content th {
          background: ${accentColor}14;
          color: white;
          font-weight: 700;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid ${accentColor}25;
        }
        .ksr-content td {
          padding: 0.65rem 1rem;
          color: #aeaeb2;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ksr-content tr:last-child td { border-bottom: none; }
        .ksr-content tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
        .ksr-content tr:hover td { background: ${accentColor}05; }
      `}</style>
    </>
  );
}
