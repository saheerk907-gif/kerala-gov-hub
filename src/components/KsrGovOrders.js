'use client';

import { useState, useMemo } from 'react';

const BLUE = '#2997ff';

const KSR_ORDERS = [
  { orderNo: 'G.O.(P)No.55/2024/Fin Dated 15-07-2024', subject: 'Kerala Service Rules — Amendment to Leave Rules — Maternity Leave enhanced to 180 days', date: '15-07-2024', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.12/2024/Fin Dated 20-02-2024', subject: 'KSR Part II — Paternity Leave — Amendment and enhancement of Paternity Leave provisions', date: '20-02-2024', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.18/2023/Fin Dated 10-04-2023', subject: 'KSR — Joining Time on Transfer — Clarification on counting of public holidays', date: '10-04-2023', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.87/2022/Fin Dated 22-11-2022', subject: 'KSR Part II — Study Leave — Revised guidelines and eligibility criteria for higher studies abroad', date: '22-11-2022', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.63/2022/Fin Dated 30-08-2022', subject: 'Kerala Service Rules — Special Casual Leave — Extension for various categories of employees', date: '30-08-2022', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.52/2022/Fin Dated 14-07-2022', subject: 'KSR — Earned Leave encashment on retirement — Procedure and ceiling clarification', date: '14-07-2022', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.31/2021/Fin Dated 05-05-2021', subject: 'KSR Part I — Transfer TA — Revised rules for transportation of personal effects on transfer', date: '05-05-2021', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.18/2021/Fin Dated 12-03-2021', subject: 'Kerala Service Rules — Probation period — Clarification on regularisation for temporary employees', date: '12-03-2021', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.9/2021/Fin Dated 18-02-2021', subject: 'KSR — Casual Leave — Clarification on combination with other leave during COVID period', date: '18-02-2021', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.145/2020/Fin Dated 28-10-2020', subject: 'KSR Part II — Hospital Leave — Enhanced provisions for employees injured on duty', date: '28-10-2020', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.88/2020/Fin Dated 10-07-2020', subject: 'Kerala Service Rules — Special Leave — COVID-19 quarantine leave provisions', date: '10-07-2020', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.31/2020/Fin Dated 22-04-2020', subject: 'KSR — Work from Home — Attendance and leave marking during lockdown period', date: '22-04-2020', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.56/2019/Fin Dated 14-06-2019', subject: 'KSR Part I — Promotion — Revised DPC guidelines and seniority rules', date: '14-06-2019', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.34/2019/Fin Dated 25-04-2019', subject: 'KSR — Child Care Leave — Enhanced provisions for women employees with minor children', date: '25-04-2019', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.47/2019/Fin Dated 11-07-2019', subject: 'KSR Part II — Half Pay Leave — Commutation and encashment procedure clarification', date: '11-07-2019', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.102/2018/Fin Dated 10-08-2018', subject: 'Kerala Service Rules — Pay revision implementation — Fitment and fixation rules as per 11th PRC', date: '10-08-2018', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.78/2018/Fin Dated 12-06-2018', subject: 'KSR Part I — Appointment on compassionate grounds — Revised eligibility and procedure', date: '12-06-2018', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.61/2018/Fin Dated 22-09-2018', subject: 'KSR — Disciplinary proceedings — Revised procedure for minor penalty cases', date: '22-09-2018', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.45/2017/Fin Dated 05-05-2017', subject: 'KSR Part II — Earned Leave accumulation — Ceiling enhanced from 300 to 360 days', date: '05-05-2017', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.22/2017/Fin Dated 08-03-2017', subject: 'Kerala Service Rules — Deputation — Revised rules for inter-department and PSU deputation', date: '08-03-2017', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.14/2016/Fin Dated 25-02-2016', subject: 'KSR — Service Book — Maintenance and verification procedure for computerised service records', date: '25-02-2016', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.91/2015/Fin Dated 30-09-2015', subject: 'KSR Part III — Pension — Revised procedure for voluntary retirement and pension computation', date: '30-09-2015', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.56/2015/Fin Dated 18-06-2015', subject: 'Kerala Service Rules — Medical Attendance — Reimbursement rules revised under MEDISEP precursor scheme', date: '18-06-2015', type: 'GO', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'Circular No.78/2014/Fin Dated 05-11-2014', subject: 'KSR — Conduct Rules — Clarification on social media usage and outside employment', date: '05-11-2014', type: 'Circular', url: 'https://finance.kerala.gov.in' },
  { orderNo: 'G.O.(P)No.34/2013/Fin Dated 20-04-2013', subject: 'KSR Part I — Amendment — Revised rules for contract appointments and regularisation', date: '20-04-2013', type: 'GO', url: 'https://finance.kerala.gov.in' },
];

const TYPE_COLORS = {
  GO:       { bg: 'rgba(48,209,88,0.12)',   color: '#30d158', label: 'GO' },
  Circular: { bg: 'rgba(41,151,255,0.12)',  color: '#2997ff', label: 'Circular' },
  Notice:   { bg: 'rgba(255,159,10,0.12)',  color: '#ff9f0a', label: 'Notice' },
  Amendment:{ bg: 'rgba(191,90,242,0.12)', color: '#bf5af2', label: 'Amendment' },
};

const ALL_TYPES = ['All', 'GO', 'Circular', 'Notice', 'Amendment'];

function OrderRow({ order }) {
  const typeStyle = TYPE_COLORS[order.type] || TYPE_COLORS.GO;
  return (
    <a
      href={order.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 p-4 rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:border-white/20"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base mt-0.5"
        style={{ background: typeStyle.bg }}>
        📄
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: typeStyle.bg, color: typeStyle.color }}>
            {typeStyle.label}
          </span>
          {order.date && (
            <span className="text-[10px] text-white/30">{order.date}</span>
          )}
        </div>
        <div className="text-xs font-bold text-white/80 mb-0.5 leading-snug">{order.orderNo}</div>
        <div className="text-[11px] text-white/50 leading-relaxed line-clamp-2"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
          {order.subject}
        </div>
      </div>
      <span className="text-white/20 group-hover:text-white/50 flex-shrink-0 text-sm mt-1 transition-colors">↗</span>
    </a>
  );
}

export default function KsrGovOrders({ previewMode = false, previewLimit = 5 }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KSR_ORDERS.filter(o => {
      const matchType = activeType === 'All' || o.type === activeType;
      const matchQuery = !q ||
        o.orderNo.toLowerCase().includes(q) ||
        o.subject.toLowerCase().includes(q) ||
        o.date.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [query, activeType]);

  if (previewMode) {
    const preview = KSR_ORDERS.slice(0, previewLimit);
    return (
      <div>
        <div className="flex flex-col gap-2">
          {preview.map((order, i) => <OrderRow key={i} order={order} />)}
        </div>
        <a
          href="/ksr/orders"
          className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
          style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}25` }}
        >
          എല്ലാ ഉത്തരവുകളും കാണൂ — {KSR_ORDERS.length} Orders
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

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TYPES.map(t => {
          const isActive = activeType === t;
          const style = t !== 'All' ? TYPE_COLORS[t] : null;
          return (
            <button key={t} onClick={() => setActiveType(t)}
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={isActive
                ? { background: style ? style.bg : `${BLUE}15`, color: style ? style.color : BLUE, border: `1px solid ${style ? style.color : BLUE}40` }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              {t}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-white/35 mb-4">
        {filtered.length} of {KSR_ORDERS.length} orders
        {query ? ` matching "${query}"` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/35">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No orders found. Try a different search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((order, i) => <OrderRow key={i} order={order} />)}
        </div>
      )}

      <p className="mt-6 text-[10px] text-white/25 text-center">
        Source: Kerala Finance Department · finance.kerala.gov.in
      </p>
    </div>
  );
}
