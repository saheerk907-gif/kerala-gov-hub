'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    orders: 0,
    schemes: 0,
    links: 0,
  })

  useEffect(() => {
    async function load() {
      const [o, s, l] = await Promise.all([
        supabase
          .from('government_orders')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('schemes')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('quick_links')
          .select('id', { count: 'exact', head: true }),
      ])

      setCounts({
        orders: o.count || 0,
        schemes: s.count || 0,
        links: l.count || 0,
      })
    }

    load()
  }, [])

  const cards = [
    {
      label: 'സർക്കാർ ഉത്തരവുകൾ',
      en: 'Government Orders',
      count: counts.orders,
      color: '#ff9f0a',
      href: '/admin/orders',
    },
    {
      label: 'പദ്ധതികൾ',
      en: 'Schemes',
      count: counts.schemes,
      color: '#2997ff',
      href: '/admin/schemes',
    },
    {
      label: 'ലിങ്കുകൾ',
      en: 'Quick Links',
      count: counts.links,
      color: '#30d158',
      href: '/admin/links',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">ഡാഷ്‌ബോർഡ്</h1>
      <p className="text-sm text-[#6e6e73] mb-8 font-sans">
        Welcome to the admin panel
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <a
            key={c.en}
            href={c.href}
            className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 no-underline text-inherit hover:border-white/[0.12] hover:bg-[#1a1a1a] transition-all"
          >
            <div
              className="text-3xl font-bold font-sans mb-1"
              style={{ color: c.color }}
            >
              {c.count}
            </div>
            <div className="text-sm font-semibold">{c.label}</div>
            <div className="text-[10px] text-[#6e6e73] font-sans">
              {c.en}
            </div>
          </a>
        ))}
      </div>

      <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4">എങ്ങനെ ഉപയോഗിക്കാം</h2>

        <div className="flex flex-col gap-3 text-sm text-[#86868b] leading-relaxed">
          <div className="flex gap-3">
            <span>📄</span>
            <p>
              <strong className="text-white">ഉത്തരവുകൾ</strong> — പുതിയ സർക്കാർ
              ഉത്തരവുകൾ ചേർക്കാം, എഡിറ്റ് ചെയ്യാം, PDF അപ്‌ലോഡ് ചെയ്യാം
            </p>
          </div>

          <div className="flex gap-3">
            <span>📋</span>
            <p>
              <strong className="text-white">പദ്ധതികൾ</strong> — MEDISEP, GPF,
              NPS മുതലായ പദ്ധതികളുടെ വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യാം
            </p>
          </div>

          <div className="flex gap-3">
            <span>🔗</span>
            <p>
              <strong className="text-white">ലിങ്കുകൾ</strong> — ഔദ്യോഗിക
              പോർട്ടൽ ലിങ്കുകൾ മാനേജ് ചെയ്യാം
            </p>
          </div>

          <div className="flex gap-3">
            <span>⚡</span>
            <p>
              <strong className="text-white">ഓട്ടോ അപ്‌ഡേറ്റ്</strong> —
              മാറ്റങ്ങൾ ഉടൻ പബ്ലിക് സൈറ്റിൽ കാണാം
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
