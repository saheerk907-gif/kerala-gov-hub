import Link from 'next/link';

const pdfTools = [
  {
    icon: '📝',
    title: 'PDF Editor',
    subtitle: 'PDF എഡിറ്റർ',
    desc: 'Edit, annotate, sign and whiteout PDFs — all in your browser, files never leave your device',
    href: '/tools/pdf-editor',
    color: '#2997ff',
    badge: 'New',
  },
  {
    icon: '🗂️',
    title: 'PDF Merger',
    subtitle: 'PDF ലയനം',
    desc: 'Combine multiple PDF files into one — browser-only, files never leave your device',
    href: '/tools/pdf-merger',
    color: '#10b981',
    badge: 'NEW',
  },
  {
    icon: '✂️',
    title: 'PDF Splitter',
    subtitle: 'PDF വിഭജനം',
    desc: 'Extract pages or split a PDF by range — browser-only, files never leave your device',
    href: '/tools/pdf-splitter',
    color: '#0284c7',
    badge: 'NEW',
  },
  {
    icon: '📃',
    title: 'PDF to Text',
    subtitle: 'PDF → ടെക്സ്റ്റ്',
    desc: 'Extract all text from a PDF — copy or save as .txt, browser-only',
    href: '/tools/pdf-to-text',
    color: '#7c3aed',
    badge: 'NEW',
  },
  {
    icon: '🖼️',
    title: 'Image to PDF',
    subtitle: 'ചിത്രം → PDF',
    desc: 'Convert JPG, PNG images to a PDF — reorder pages, browser-only',
    href: '/tools/image-to-pdf',
    color: '#ec4899',
    badge: 'NEW',
  },
  {
    icon: '📊',
    title: 'PDF to Excel',
    subtitle: 'PDF → Excel',
    desc: 'Extract tables from PDF and download as .xlsx — browser-only, files never leave your device',
    href: '/tools/pdf-to-excel',
    color: '#10b981',
    badge: 'NEW',
  },
  {
    icon: '🔄',
    title: 'Excel to CSV',
    subtitle: 'Excel → CSV',
    desc: 'Convert Excel sheets to CSV — choose delimiter, preview data, browser-only',
    href: '/tools/excel-to-csv',
    color: '#f59e0b',
    badge: 'NEW',
  },
];

const utilityTools = [
  {
    icon: '⬛',
    title: 'QR Code Generator',
    subtitle: 'QR കോഡ് ജനറേറ്റർ',
    desc: 'Generate QR codes for URLs, portal links, text — custom colour & size',
    href: '/tools/qr-generator',
    color: '#0ea5e9',
    badge: 'NEW',
  },
  {
    icon: '📅',
    title: 'Holiday List 2026',
    subtitle: 'അവധി ദിനങ്ങൾ 2026',
    desc: 'Kerala Govt holidays 2026 — next holiday countdown + iCal export',
    href: '/tools/holiday-list-2026',
    color: '#10b981',
    badge: 'NEW',
  },
];

function ToolCard({ t }) {
  return (
    <Link
      href={t.href}
      className="group relative flex flex-col items-start text-left rounded-[16px] p-4 no-underline transition-all duration-200 hover:bg-white/[0.06] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {t.badge && (
        <span className="absolute top-2 right-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(41,151,255,0.2)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.3)' }}>
          NEW
        </span>
      )}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl mb-2.5"
        style={{ background: t.color + '20', border: `1px solid ${t.color}35` }}>
        {t.icon}
      </div>
      <h3 className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors leading-snug mb-0.5">
        {t.title}
      </h3>
      <div className="text-[9px] font-semibold uppercase tracking-wider text-white/50 mb-1.5"
        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
        {t.subtitle}
      </div>
      <p className="text-[11px] text-white/55 leading-relaxed">{t.desc}</p>
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden pb-14 md:pb-0 pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-[11px] text-white/40 hover:text-white/60 no-underline transition-colors">← Back to Home</Link>
          <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.02em] text-white mt-3 mb-1">
            Tools & Utilities
          </h1>
          <p className="text-[13px] text-white/55">Browser-based tools — your files never leave your device</p>
        </div>

        {/* PDF Tools */}
        <div className="glass-card glow-top rounded-[24px] p-4 md:p-5 mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-white/50">PDF Tools</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pdfTools.map(t => <ToolCard key={t.href} t={t} />)}
          </div>
        </div>

        {/* Utilities */}
        <div className="glass-card glow-top rounded-[24px] p-4 md:p-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-white/50">Utilities</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {utilityTools.map(t => <ToolCard key={t.href} t={t} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
