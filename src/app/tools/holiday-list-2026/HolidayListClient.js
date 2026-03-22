'use client';
import { useState, useMemo } from 'react';

const HOLIDAYS = [
  // Jan
  { date: '2026-01-01', name: 'New Year\'s Day',           nameMl: 'പുതുവർഷം',              type: 'state' },
  { date: '2026-01-14', name: 'Makaravilakku / Pongal',    nameMl: 'മകരവിളക്ക്',             type: 'state' },
  { date: '2026-01-26', name: 'Republic Day',               nameMl: 'റിപ്പബ്ലിക് ദിനം',       type: 'national' },
  // Feb
  { date: '2026-02-19', name: 'Maha Shivaratri',            nameMl: 'മഹാശിവരാത്രി',           type: 'state' },
  // Mar
  { date: '2026-03-20', name: 'Eid ul Fitr',                nameMl: 'ഈദുൽ ഫിത്തർ',           type: 'state', note: 'Subject to moon sighting' },
  // Apr
  { date: '2026-04-03', name: 'Good Friday',                nameMl: 'ഗുഡ് ഫ്രൈഡേ',            type: 'state' },
  { date: '2026-04-14', name: 'Vishu',                      nameMl: 'വിഷു',                   type: 'state' },
  { date: '2026-04-14', name: 'Dr. B.R. Ambedkar Jayanthi', nameMl: 'അംബേദ്കർ ജയന്തി',        type: 'national' },
  // May
  { date: '2026-05-01', name: 'May Day / Kerala Day',       nameMl: 'മേയ് ദിനം',              type: 'state' },
  { date: '2026-05-27', name: 'Eid ul Adha',                nameMl: 'ഈദുൽ അദ്ഹ',             type: 'state', note: 'Subject to moon sighting' },
  // Aug
  { date: '2026-08-15', name: 'Independence Day',           nameMl: 'സ്വാതന്ത്ര്യ ദിനം',       type: 'national' },
  { date: '2026-08-17', name: 'Milad-i-Sherif',             nameMl: 'മിലാദ് ഷെരീഫ്',          type: 'state', note: 'Subject to moon sighting' },
  // Sep
  { date: '2026-09-02', name: 'Onam / Thiruvonam',          nameMl: 'തിരുവോണം',               type: 'state' },
  // Oct
  { date: '2026-10-02', name: 'Gandhi Jayanthi',            nameMl: 'ഗാന്ധി ജയന്തി',           type: 'national' },
  { date: '2026-10-19', name: 'Deepavali',                  nameMl: 'ദീപാവലി',               type: 'state' },
  // Nov
  { date: '2026-11-01', name: 'Kerala Piravi',              nameMl: 'കേരള പിറവി',             type: 'state' },
  // Dec
  { date: '2026-12-25', name: 'Christmas',                  nameMl: 'ക്രിസ്തുമസ്',            type: 'state' },
];

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const TYPE_META = {
  national: { label: 'National', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  state:    { label: 'State',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

function toDateObj(str) { return new Date(str + 'T00:00:00'); }

function generateIcal(holidays) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kerala Gov Employee Hub//Holiday List 2026//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Kerala Govt Holidays 2026',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];
  for (const h of holidays) {
    const d     = h.date.replace(/-/g, '');
    const dNext = h.date.replace(/-/g, '').slice(0,6) +
      String(parseInt(h.date.slice(-2)) + 1).padStart(2,'0');
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${dNext}`,
      `SUMMARY:${h.name}`,
      `DESCRIPTION:${h.nameMl}${h.note ? ' (' + h.note + ')' : ''}`,
      `CATEGORIES:${TYPE_META[h.type].label} Holiday`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export default function HolidayListClient() {
  const [filter, setFilter] = useState('all'); // all | national | state
  const today = new Date(); today.setHours(0,0,0,0);

  const filtered = useMemo(() =>
    HOLIDAYS.filter(h => filter === 'all' || h.type === filter),
    [filter]
  );

  // Group by month
  const byMonth = useMemo(() => {
    const map = {};
    for (const h of filtered) {
      const m = h.date.slice(0, 7);
      if (!map[m]) map[m] = [];
      map[m].push(h);
    }
    return map;
  }, [filtered]);

  const upcoming   = HOLIDAYS.filter(h => toDateObj(h.date) >= today);
  const next       = upcoming[0];
  const daysToNext = next ? Math.ceil((toDateObj(next.date) - today) / 86400000) : null;

  function handleDownload() {
    const ical  = generateIcal(HOLIDAYS);
    const blob  = new Blob([ical], { type: 'text/calendar;charset=utf-8' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href = url; a.download = 'kerala-holidays-2026.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#d1fae5 0%,#dbeafe 50%,#e0f2fe 100%)',
      padding: '48px 16px 64px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* blobs */}
      <div style={{ position:'fixed', width:320, height:320, background:'rgba(16,185,129,0.15)', borderRadius:'50%', bottom:-80, left:-80, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:260, height:260, background:'rgba(14,165,233,0.12)', borderRadius:'50%', top:-60, right:-60, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>📅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Kerala Govt Holidays 2026</h1>
          <p style={{ fontSize: 14, color: '#475569', marginTop: 6 }}>കേരള സർക്കാർ അവധി ദിനങ്ങൾ</p>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            Dates as per standard almanac · Festival dates subject to official gazette
          </p>
        </div>

        {/* Next holiday card */}
        {next && (
          <div style={{
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.8)', borderRadius: 20,
            padding: '20px 24px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Next Holiday
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{next.name}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                {toDateObj(next.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg,#10b981,#0284c7)',
              borderRadius: 14, padding: '12px 18px', textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {daysToNext === 0 ? '🎉' : daysToNext}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                {daysToNext === 0 ? 'Today!' : daysToNext === 1 ? 'Tomorrow' : 'days away'}
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          {[
            { label:'Total Holidays', value: HOLIDAYS.length },
            { label:'National', value: HOLIDAYS.filter(h=>h.type==='national').length },
            { label:'Remaining', value: upcoming.length },
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:'rgba(255,255,255,0.55)', borderRadius:14,
              padding:'14px 10px', textAlign:'center',
              border:'1px solid rgba(255,255,255,0.8)',
            }}>
              <div style={{ fontSize:24, fontWeight:900, color:'#0f172a' }}>{s.value}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter + iCal */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {['all','national','state'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer',
              fontWeight:700, fontSize:12, textTransform:'capitalize',
              background: filter===f ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'rgba(255,255,255,0.55)',
              color: filter===f ? '#fff' : '#475569',
              transition:'all 0.15s',
            }}>
              {f === 'all' ? 'All Holidays' : f === 'national' ? '🇮🇳 National' : '🌴 State'}
            </button>
          ))}
          <button onClick={handleDownload} style={{
            marginLeft:'auto', padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer',
            fontWeight:700, fontSize:12,
            background:'linear-gradient(135deg,#6366f1,#0284c7)', color:'#fff',
          }}>
            📆 Add to Calendar (.ics)
          </button>
        </div>

        {/* Holiday list grouped by month */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {Object.entries(byMonth).map(([monthKey, holidays]) => {
            const [year, mon] = monthKey.split('-');
            return (
              <div key={monthKey} style={{
                background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)',
                border:'1px solid rgba(255,255,255,0.78)', borderRadius:20,
                overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
              }}>
                {/* Month header */}
                <div style={{
                  padding:'12px 20px',
                  background:'rgba(255,255,255,0.4)',
                  borderBottom:'1px solid rgba(255,255,255,0.6)',
                  fontSize:13, fontWeight:800, color:'#1e293b', letterSpacing:0.5,
                }}>
                  {MONTHS[parseInt(mon)-1]} {year}
                </div>

                {holidays.map((h, idx) => {
                  const d       = toDateObj(h.date);
                  const isPast  = d < today;
                  const isToday = d.getTime() === today.getTime();
                  const meta    = TYPE_META[h.type];
                  return (
                    <div key={h.date+h.name} style={{
                      display:'flex', alignItems:'center', gap:14,
                      padding:'14px 20px',
                      borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                      opacity: isPast ? 0.45 : 1,
                      background: isToday ? 'rgba(16,185,129,0.08)' : 'transparent',
                    }}>
                      {/* Date box */}
                      <div style={{
                        minWidth:44, textAlign:'center', flexShrink:0,
                        background:'rgba(255,255,255,0.6)', borderRadius:10,
                        padding:'6px 4px',
                        border: isToday ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.8)',
                      }}>
                        <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', lineHeight:1 }}>
                          {d.getDate()}
                        </div>
                        <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', marginTop:2 }}>
                          {DAYS[d.getDay()]}
                        </div>
                      </div>

                      {/* Name */}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1e293b' }}>
                          {h.name}
                          {isToday && <span style={{ marginLeft:6, fontSize:11, color:'#10b981', fontWeight:800 }}>● Today</span>}
                        </div>
                        <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{h.nameMl}</div>
                        {h.note && <div style={{ fontSize:10, color:'#f59e0b', marginTop:2 }}>⚠ {h.note}</div>}
                      </div>

                      {/* Type badge */}
                      <span style={{
                        fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20,
                        background: meta.bg, color: meta.color, flexShrink:0,
                        border:`1px solid ${meta.color}30`,
                      }}>
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign:'center', color:'#94a3b8', fontSize:11, marginTop:24, lineHeight:1.6 }}>
          Festival dates (Eid, Onam, etc.) are approximate and subject to official Kerala Government Gazette notification.
        </p>

      </div>
    </div>
  );
}
