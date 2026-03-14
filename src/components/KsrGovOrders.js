'use client';

import { useState, useMemo, useEffect } from 'react';

const BLUE = '#2997ff';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TYPE_COLORS = {
  Amendment: { bg: 'rgba(191,90,242,0.12)', color: '#bf5af2', label: 'Amendment' },
  GO:        { bg: 'rgba(48,209,88,0.12)',   color: '#30d158', label: 'GO' },
  Circular:  { bg: 'rgba(41,151,255,0.12)',  color: '#2997ff', label: 'Circular' },
};

function OrderRow({ order }) {
  const typeStyle = TYPE_COLORS.Amendment;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base mt-0.5"
        style={{ background: typeStyle.bg }}>
        📄
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: typeStyle.bg, color: typeStyle.color }}>
            KSR Amendment
          </span>
          {order.go_date && <span className="text-[10px] text-white/30">{order.go_date}</span>}
        </div>
        <div className="text-xs font-bold text-white/80 mb-0.5 leading-snug">{order.go_number}</div>
        <div className="text-[11px] text-white/50 leading-relaxed line-clamp-2"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
          {order.title_ml}
        </div>
        {order.description_ml && (
          <div className="text-[10px] text-white/35 mt-0.5 line-clamp-1">{order.description_ml}</div>
        )}
        <div className="mt-2 flex items-center gap-3">
          {order.pdf_url ? (
            <a href={order.pdf_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold no-underline px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
              ⬇ Download PDF
            </a>
          ) : (
            <span className="text-[10px] text-white/20">PDF not available</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KsrGovOrders({ previewMode = false, previewLimit = 5 }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/government_orders?category=eq.ksr&is_published=eq.true&order=go_date.desc&select=*`,
          {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o =>
      o.go_number?.toLowerCase().includes(q) ||
      o.title_ml?.toLowerCase().includes(q) ||
      o.description_ml?.toLowerCase().includes(q)
    );
  }, [query, orders]);

  if (previewMode) {
    const preview = loading ? [] : orders.slice(0, previewLimit);
    return (
      <div>
        {loading ? (
          <div className="text-center py-6 text-white/30 text-sm">Loading...</div>
        ) : (
          <div className="flex flex-col gap-2">
            {preview.map(order => <OrderRow key={order.id} order={order} />)}
          </div>
        )}
        <a
          href="/ksr/orders"
          className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
          style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}
        >
          എല്ലാ ഉത്തരവുകളും കാണൂ — {orders.length} Orders
          <span className="text-base">→</span>
        </a>
        <p className="mt-4 text-[10px] text-white/25 text-center">
          Source: Kerala Finance Department · finance.kerala.gov.in
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by order number or subject..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg leading-none transition-colors">
            ×
          </button>
        )}
      </div>

      <p className="text-xs text-white/35 mb-4">
        {loading ? 'Loading...' : `${filtered.length} of ${orders.length} orders${query ? ` matching "${query}"` : ''}`}
      </p>

      {loading ? (
        <div className="text-center py-12 text-white/35">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-sm">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/35">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">{query ? 'No orders found. Try a different search.' : 'No KSR orders uploaded yet.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(order => <OrderRow key={order.id} order={order} />)}
        </div>
      )}

      <p className="mt-6 text-[10px] text-white/25 text-center">
        Source: Kerala Finance Department · finance.kerala.gov.in
      </p>
    </div>
  );
}
