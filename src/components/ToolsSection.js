'use client';

import Link from 'next/link';

export default function ToolsSection() {
  const tools = [
    {
      icon: '📝',
      title: 'PDF Editor',
      titleMl: 'PDF എഡിറ്റർ',
      desc: 'Edit, annotate, sign and whiteout PDFs — all in your browser, files never leave your device',
      href: '/tools/pdf-editor',
      color: '#2997ff',
      badge: 'New',
      tags: ['pdf', 'editor', 'sign', 'annotate'],
    },
    {
      icon: '🗂️',
      title: 'PDF Merger',
      titleMl: 'PDF ലയനം',
      desc: 'Combine multiple PDF files into one — browser-only, files never leave your device',
      href: '/tools/pdf-merger',
      color: '#10b981',
      tags: ['pdf', 'merge', 'combine'],
    },
    {
      icon: '✂️',
      title: 'PDF Splitter',
      titleMl: 'PDF വിഭജനം',
      desc: 'Extract pages or split a PDF by range — browser-only, files never leave your device',
      href: '/tools/pdf-splitter',
      color: '#0284c7',
      tags: ['pdf', 'split', 'extract', 'pages'],
    },
    {
      icon: '📃',
      title: 'PDF to Text',
      titleMl: 'PDF → ടെക്സ്റ്റ്',
      desc: 'Extract all text from a PDF — copy or save as .txt, browser-only',
      href: '/tools/pdf-to-text',
      color: '#7c3aed',
      tags: ['pdf', 'text', 'extract', 'ocr'],
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <Link key={idx} href={tool.href}>
              <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{tool.icon}</span>
                  {tool.badge && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{tool.title}</h3>
                {tool.titleMl && (
                  <p className="text-sm text-gray-600 mb-2">{tool.titleMl}</p>
                )}
                <p className="text-gray-700 text-sm">{tool.desc}</p>
                {tool.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
