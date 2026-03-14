'use client';

import { useState, useMemo } from 'react';

const BLUE = '#2997ff';

const KSR_ORDERS = [
  { orderNo: 'GO(P) No.93/2025/Fin',    subject: 'Special Casual Leave for pacemaker implantation — Rule 19E',                              date: '19-07-2025', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=1090&catid=24&m=0' },
  { orderNo: 'GO(P) No.74/2023/Fin',    subject: 'Special CL for Chemotherapy — amended Rule 19A',                                          date: '15-07-2023', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=1106&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.6/2024/P&ARD', subject: 'Miscarriage & Hysterectomy Leave reckoned as duty for probation',                          date: '23-09-2024', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=1059&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.17/2023/P&ARD',subject: 'Relinquishment not allowed on/after promotion/Transfer — Rule 3',                          date: '30-11-2023', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=1049&catid=24&m=0' },
  { orderNo: 'GO(P) No.58/2023/Fin',    subject: 'Rule 26(c) Part III — Compassionate allowance eligibility',                                date: '14-06-2023', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=1039&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.123/2022/Fin',  subject: 'Compensation Leave — Gazetted officers eligibility',                                       date: '07-10-2022', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=994&catid=24&m=0' },
  { orderNo: 'GO(P) No.87/2022/Fin',    subject: 'LWA Period Limited to 5 Years',                                                            date: '03-08-2022', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=986&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.2/2022/P&ARD', subject: 'KS&SSR (Amendment) Rules 2022 — Rules 13B, 27B',                                           date: '15-01-2022', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=823&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.144/2021/Fin',  subject: 'Special Casual Leave for Angioplasty — 30 days',                                           date: '30-10-2021', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=767&catid=24&m=0' },
  { orderNo: 'G.O.(P)No.143/2021/Fin',  subject: 'Enhanced LWA Sanction Power to HOD',                                                       date: '30-10-2021', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=766&catid=24&m=0' },
  { orderNo: 'GO(P)No.62/2021/Fin',     subject: 'Modification in Rule 59 Part III — Pension reduction',                                     date: '12-04-2021', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=566&catid=24&m=0' },
  { orderNo: 'GO(P)No.198/2018/Fin',    subject: 'Modification in Rule 59 Part III KSR — Pension withdrawal',                                date: '22-12-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=564&catid=24&m=0' },
  { orderNo: 'GO(P)No.192/2018/Fin',    subject: 'Insertion of Rule 59(c) Part III — Post-retirement conduct',                               date: '11-12-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=565&catid=24&m=0' },
  { orderNo: 'GO(P)No.145/2020/Fin',    subject: 'Rounding of Qualifying Service for Pension — Rules 57, 64, 65',                            date: '30-10-2020', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=447&catid=24&m=0' },
  { orderNo: 'GO(P)No.130/2020/Fin',    subject: 'Calculation of Qualifying Service for Pension',                                             date: '01-10-2020', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=403&catid=24&m=0' },
  { orderNo: 'GO(P)No.165/2019/Fin',    subject: 'Dies-non count for pension — Strike participation',                                        date: '27-11-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=213&catid=24&m=0' },
  { orderNo: 'GO(P)No.127/2019/Fin',    subject: 'Enhanced fee for Duplicate Pension Book — Rs.250',                                         date: '19-09-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=148&catid=24&m=0' },
  { orderNo: 'GO(P)No.126/2019/Fin',    subject: 'Withdrawal of Extra Ordinary Pension',                                                     date: '18-09-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=147&catid=24&m=0' },
  { orderNo: 'GO(P)No.125/2019/Fin',    subject: 'Modification of Form 2 and Form II Part II KSR',                                           date: '06-09-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=146&catid=24&m=0' },
  { orderNo: 'GO(P)No.123/2019/Fin',    subject: 'Calculation of DCRG and Family Pension — Pay changes',                                     date: '06-09-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=145&catid=24&m=0' },
  { orderNo: 'GO(P)No.82/2019/Fin',     subject: 'Insertion of sub rule (d) in Rule 59 Part III',                                            date: '09-07-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=144&catid=24&m=0' },
  { orderNo: 'GO(P)No.52/2019/Fin',     subject: 'Special leave up to 90 days — Sexual harassment inquiry',                                  date: '03-05-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=143&catid=24&m=0' },
  { orderNo: 'GO(P)No.26/2019/Fin',     subject: 'Revision of Maximum DCRG, Minimum Pension etc.',                                          date: '07-03-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=142&catid=24&m=0' },
  { orderNo: 'GO(P)No.20/2019/Fin',     subject: 'Ensure Pension to 50% of minimum of revised scale',                                       date: '22-02-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=139&catid=24&m=0' },
  { orderNo: 'GO(P)No.19/2019/Fin',     subject: 'Entering appointment details in Service Book — Merit/reservation',                        date: '22-02-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=140&catid=24&m=0' },
  { orderNo: 'GO(P)No.18/2019/Fin',     subject: 'Income Criteria for Family Pension',                                                       date: '20-02-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=137&catid=24&m=0' },
  { orderNo: 'GO(P)No.16/2019/Fin',     subject: 'Disbursement of Pensionary benefits to Grand Parents',                                     date: '20-02-2019', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=138&catid=24&m=0' },
  { orderNo: 'GO(P)No.102/2018/Fin',    subject: 'Revised compensatory allowance — Training outside state',                                   date: '03-07-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=173&catid=24&m=0' },
  { orderNo: 'GO(P)No.95/2018/Fin',     subject: 'Service in Temporary Munciff Magistrate reckoned for Pension',                             date: '22-06-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=172&catid=24&m=0' },
  { orderNo: 'GO(P)No.93/2018/Fin',     subject: 'Prior service in PSU not counted for pension and DCRG',                                    date: '16-06-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=171&catid=24&m=0' },
  { orderNo: 'GO(P)No.92/2018/Fin',     subject: 'Pensionary benefits to children from void marriages',                                      date: '16-06-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=170&catid=24&m=0' },
  { orderNo: 'GO(P)No.91/2018/Fin',     subject: 'Disbursement of DCRG to legal heirs — Modified',                                          date: '14-06-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=169&catid=24&m=0' },
  { orderNo: 'GO(P)No.90/2018/Fin',     subject: 'Debarred from receiving DCRG and Family Pension',                                          date: '14-06-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=168&catid=24&m=0' },
  { orderNo: 'GO(P)No.15/2018/Fin',     subject: 'Special casual leave for anti-rabies treatment — modified',                                date: '06-02-2018', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=167&catid=24&m=0' },
  { orderNo: 'GO(P)No.130/2017/Fin',    subject: 'KSR Amendment 2017 — Rule 28A Part I',                                                    date: '12-10-2017', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=133&catid=24&m=0' },
  { orderNo: 'GO(P)No.88/2017/Fin',     subject: 'Charge Allowance Revised — 4% and 2% rates',                                               date: '11-07-2017', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=136&catid=24&m=0' },
  { orderNo: 'GO(P)No.73/2017/Fin',     subject: 'Modification of monetary limit — Rules 90A, 93, 103',                                      date: '22-05-2017', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=228&catid=24&m=0' },
  { orderNo: 'GO(P)No.60/2016/Fin',     subject: 'Special Casual Leave for Treatment of Children undergoing Chemotherapy',                    date: '02-05-2016', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=443&catid=24&m=0' },
  { orderNo: 'GO(P)No.581/2014/Fin',    subject: 'Enhancement of Special Casual Leave for Chemotherapy — 6 months',                          date: '29-12-2014', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=442&catid=24&m=0' },
  { orderNo: 'GO(P)No.2/2014/P&ARD',   subject: 'Paternity Leave reckoned as duty for probation',                                            date: '08-01-2014', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=215&catid=24&m=0' },
  { orderNo: 'GO(P)No.216/2012/Fin',    subject: 'Enhancement of Maternity Leave to 180 Days',                                               date: '11-04-2012', type: 'Amendment', pdf_url: 'https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=390&catid=24&m=0' },
];

const TYPE_COLORS = {
  GO:       { bg: 'rgba(48,209,88,0.12)',   color: '#30d158', label: 'GO' },
  Circular: { bg: 'rgba(41,151,255,0.12)',  color: '#2997ff', label: 'Circular' },
  Notice:   { bg: 'rgba(255,159,10,0.12)',  color: '#ff9f0a', label: 'Notice' },
  Amendment:{ bg: 'rgba(191,90,242,0.12)', color: '#bf5af2', label: 'Amendment' },
};

const ALL_TYPES = ['All', 'Amendment'];

function OrderRow({ order }) {
  const typeStyle = TYPE_COLORS[order.type] || TYPE_COLORS.GO;
  const isDirectPdf = !!order.pdf_url;

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
            {typeStyle.label}
          </span>
          {order.date && <span className="text-[10px] text-white/30">{order.date}</span>}
        </div>
        <div className="text-xs font-bold text-white/80 mb-0.5 leading-snug">{order.orderNo}</div>
        <div className="text-[11px] text-white/50 leading-relaxed line-clamp-2"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
          {order.subject}
        </div>
        <div className="mt-2 flex items-center gap-3">
          {isDirectPdf && (
            <a href={order.pdf_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold no-underline px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
              ⬇ Download PDF
            </a>
          )}
          {order.url && (
            <a href={order.url} target="_blank" rel="noopener noreferrer"
              className="text-[10px] text-white/30 no-underline hover:text-white/60 transition-colors">
              Source ↗
            </a>
          )}
          {!isDirectPdf && !order.url && (
            <span className="text-[10px] text-white/20">PDF not available</span>
          )}
        </div>
      </div>
    </div>
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
