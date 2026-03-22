'use client';
import { useState, useMemo } from 'react';

// Official Kerala GAD Public Holidays 2026
const HOLIDAYS = [
  { date: '2026-01-02', name: 'Mannam Jayanthi',                         nameMl: 'മന്നം ജയന്തി',                    type: 'state' },
  { date: '2026-01-26', name: 'Republic Day',                             nameMl: 'റിപ്പബ്ലിക് ദിനം',                type: 'national' },
  { date: '2026-03-20', name: 'Id-ul-Fitr (Ramzan)',                      nameMl: 'ഈദുൽ ഫിത്തർ',                   type: 'state', moon: true },
  { date: '2026-04-02', name: 'Maundy Thursday',                          nameMl: 'മോണ്ടി തേഴ്‌സ്‌ഡേ',              type: 'state' },
  { date: '2026-04-03', name: 'Good Friday',                              nameMl: 'ഗുഡ് ഫ്രൈഡേ',                   type: 'state' },
  { date: '2026-04-14', name: 'Dr. B. R. Ambedkar Jayanthi',              nameMl: 'അംബേദ്കർ ജയന്തി',               type: 'national' },
  { date: '2026-04-15', name: 'Vishu',                                    nameMl: 'വിഷു',                           type: 'state' },
  { date: '2026-05-01', name: 'May Day',                                  nameMl: 'മേയ് ദിനം',                      type: 'national' },
  { date: '2026-05-27', name: "Id-ul-Ad'ha (Bakrid)",                     nameMl: 'ഈദുൽ അദ്ഹ',                     type: 'state', moon: true },
  { date: '2026-06-25', name: 'Muharram',                                 nameMl: 'മുഹറം',                          type: 'state', moon: true },
  { date: '2026-08-12', name: 'Karkadaka Vavu',                           nameMl: 'കർക്കടക വാവ്',                   type: 'state' },
  { date: '2026-08-15', name: 'Independence Day',                         nameMl: 'സ്വാതന്ത്ര്യ ദിനം',               type: 'national' },
  { date: '2026-08-25', name: 'First Onam / Milad-i-Sherif',              nameMl: 'ആദ്യ ഓണം / മിലാദ് ഷെരീഫ്',       type: 'state', moon: true },
  { date: '2026-08-26', name: 'Thiruvonam',                               nameMl: 'തിരുവോണം',                       type: 'state' },
  { date: '2026-08-27', name: 'Third Onam',                               nameMl: 'മൂന്നാം ഓണം',                    type: 'state' },
  { date: '2026-08-28', name: 'Fourth Onam / Sree Narayana Guru Jayanthi / Ayyankali Jayanthi', nameMl: 'നാലാം ഓണം / ശ്രീനാരായണ ഗുരു ജയന്തി', type: 'state' },
  { date: '2026-09-04', name: 'Sreekrishna Jayanthi',                     nameMl: 'ശ്രീകൃഷ്ണ ജയന്തി',               type: 'state' },
  { date: '2026-09-21', name: 'Sree Narayana Guru Samadhi Day',           nameMl: 'ശ്രീനാരായണ ഗുരു സമാധി ദിനം',     type: 'state' },
  { date: '2026-10-02', name: 'Gandhi Jayanthi',                          nameMl: 'ഗാന്ധി ജയന്തി',                  type: 'national' },
  { date: '2026-10-20', name: 'Mahanavami',                               nameMl: 'മഹാനവമി',                       type: 'state' },
  { date: '2026-10-21', name: 'Vijayadasami',                             nameMl: 'വിജയദശമി',                       type: 'state' },
  { date: '2026-12-25', name: 'Christmas',                                nameMl: 'ക്രിസ്തുമസ്',                    type: 'state' },
];

const RESTRICTED = [
  { date: '2026-03-04', name: 'Ayya Vaikunda Swami Jayanthi', nameMl: 'അയ്യ വൈകുണ്ഠ സ്വാമി ജയന്തി', community: 'Nadar Community' },
  { date: '2026-08-28', name: 'Avani Avittom',                nameMl: 'അവണി അവിട്ടം',                 community: 'Brahmin Community' },
  { date: '2026-09-17', name: 'Vishwakarma Day',              nameMl: 'വിശ്വകർമ്മ ദിനം',               community: 'Vishwakarma Community' },
];

const ON_SUNDAY = [
  { date: '2026-02-15', name: 'Maha Shivaratri' },
  { date: '2026-04-05', name: 'Easter Sunday' },
  { date: '2026-11-08', name: 'Deepavali' },
];

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getSecondSaturdays(year) {
  const result = [];
  for (let m = 0; m < 12; m++) {
    let count = 0;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(year, m, day);
      if (d.getMonth() !== m) break;
      if (d.getDay() === 6) { count++; if (count === 2) { result.push(d); break; } }
    }
  }
  return result;
}
const SECOND_SATS_2026 = getSecondSaturdays(2026);

const TYPE_META = {
  national: { label: 'National', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  state:    { label: 'State',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

// Day type colours for the strip
const DAY_COLORS = {
  holiday: { bg: '#10b981', text: '#fff', label: 'Holiday' },
  sun:     { bg: '#3b82f6', text: '#fff', label: 'Sunday' },
  sat2:    { bg: '#7c3aed', text: '#fff', label: '2nd Sat' },
  leave:   { bg: '#f59e0b', text: '#fff', label: 'Your Leave' },
  work:    { bg: 'rgba(148,163,184,0.25)', text: '#94a3b8', label: 'Working' },
};

function toDate(str) { return new Date(str + 'T00:00:00'); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
// Use local date string (not UTC) to avoid IST off-by-one bug
function ds(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fmtShort(d) { return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); }
function fmtRange(s, e) {
  const so = s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const eo = e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return so === eo ? so : `${so} – ${eo}`;
}

function buildPlanner() {
  const holidayDates = new Set(HOLIDAYS.map(h => h.date));
  const secondSats   = new Set(SECOND_SATS_2026.map(d => ds(d)));

  function dayType(dateStr) {
    const dow = toDate(dateStr).getDay();
    if (holidayDates.has(dateStr)) return 'holiday';
    if (dow === 0)                  return 'sun';
    if (secondSats.has(dateStr))    return 'sat2';
    return 'work';
  }

  function isOff(dateStr) { return dayType(dateStr) !== 'work'; }

  const plans = [];

  for (const h of HOLIDAYS) {
    const d = toDate(h.date);
    let leaveNeeded = [];
    let start = d, end = d;

    // Extend backward through consecutive off days
    let cur = addDays(d, -1);
    while (isOff(ds(cur))) { start = cur; cur = addDays(cur, -1); }
    const oneBefore = addDays(d, -1);
    const twoBefore = addDays(d, -2);
    if (!isOff(ds(oneBefore)) && isOff(ds(twoBefore))) {
      leaveNeeded.push(ds(oneBefore));
      start = twoBefore;
      let c2 = addDays(twoBefore, -1);
      while (isOff(ds(c2))) { start = c2; c2 = addDays(c2, -1); }
    } else {
      if (isOff(ds(oneBefore))) {
        start = oneBefore;
        let c2 = addDays(oneBefore, -1);
        while (isOff(ds(c2))) { start = c2; c2 = addDays(c2, -1); }
      } else {
        start = d;
      }
    }

    // Extend forward
    cur = addDays(d, 1);
    while (isOff(ds(cur))) { end = cur; cur = addDays(cur, 1); }
    const oneAfter = addDays(end, 1);
    const twoAfter = addDays(end, 2);
    if (!isOff(ds(oneAfter)) && isOff(ds(twoAfter))) {
      leaveNeeded.push(ds(oneAfter));
      end = twoAfter;
      let c2 = addDays(twoAfter, 1);
      while (isOff(ds(c2))) { end = c2; c2 = addDays(c2, 1); }
    }

    // Build day strip
    const days = [];
    let cur2 = new Date(start);
    while (cur2 <= end) {
      const dstr = ds(cur2);
      const t = leaveNeeded.includes(dstr) ? 'leave' : dayType(dstr);
      days.push({ date: cur2, dateStr: dstr, type: t });
      cur2 = addDays(cur2, 1);
    }

    if (days.length >= 3) {
      const leaveCnt = leaveNeeded.length;
      plans.push({
        id: h.date + '-' + leaveNeeded.join(','),
        holiday: h,
        start, end,
        totalDays: days.length,
        leaveDays: leaveNeeded,
        leaveCnt,
        days,
        efficiency: leaveCnt === 0 ? 999 : parseFloat((days.length / leaveCnt).toFixed(1)),
      });
    }
  }

  // Deduplicate overlapping windows
  const seen = new Set();
  return plans
    .filter(p => {
      const k = ds(p.start) + ds(p.end);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.start - b.start);
}

function generateIcal(holidays) {
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Kerala Gov Hub//Holidays 2026//EN','CALSCALE:GREGORIAN','X-WR-CALNAME:Kerala Govt Holidays 2026'];
  for (const h of holidays) {
    const d = h.date.replace(/-/g, '');
    const next = new Date(h.date + 'T00:00:00'); next.setDate(next.getDate() + 1);
    const dNext = next.toISOString().slice(0, 10).replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${dNext}`, `SUMMARY:${h.name}`, `DESCRIPTION:${h.nameMl}${h.moon ? ' (Subject to moon sighting)' : ''}`, `CATEGORIES:${TYPE_META[h.type].label} Holiday`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

const TABS = ['Holidays', 'Planner', 'Restricted'];

// ── Stepper component ──────────────────────────────────────
function Stepper({ label, value, onChange, min = 0, max = 60 }) {
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.75)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 16, background: 'rgba(255,255,255,0.7)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 16, background: 'rgba(255,255,255,0.7)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
      <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>days</div>
    </div>
  );
}

// ── Day strip ─────────────────────────────────────────────
function DayStrip({ days }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 12 }}>
      {days.filter(day => day.type !== 'work').map((day, i) => {
        const c = DAY_COLORS[day.type] || DAY_COLORS.work;
        return (
          <div key={i} title={`${DAYS[day.date.getDay()]} ${day.date.getDate()} — ${c.label}`} style={{
            minWidth: 30, padding: '4px 2px', borderRadius: 8,
            background: c.bg, textAlign: 'center', flex: '0 0 auto',
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>{DAYS[day.date.getDay()]}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: c.text, lineHeight: 1.2 }}>{day.date.getDate()}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function HolidayListClient() {
  const [tab, setTab]         = useState('Holidays');
  const [filter, setFilter]   = useState('all');
  const [clDays, setClDays]   = useState(15);
  const [elDays, setElDays]   = useState(10);
  const [sortBy, setSortBy]   = useState('date');
  const [filterLeave, setFilterLeave] = useState('all');
  const [planned, setPlanned] = useState(new Set());

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const allPlans = useMemo(() => buildPlanner(), []);

  // Filter + sort planner data
  const plannerData = useMemo(() => {
    let data = [...allPlans];
    if (filterLeave === 'natural') data = data.filter(p => p.leaveCnt === 0);
    else if (filterLeave === '1')  data = data.filter(p => p.leaveCnt === 1);
    else if (filterLeave === '2+') data = data.filter(p => p.leaveCnt >= 2);
    if (sortBy === 'value') data.sort((a, b) => b.efficiency - a.efficiency);
    else if (sortBy === 'days') data.sort((a, b) => b.totalDays - a.totalDays);
    else data.sort((a, b) => a.start - b.start);
    return data;
  }, [allPlans, filterLeave, sortBy]);

  // Budget summary
  const plannedLeave = useMemo(() => {
    let total = 0;
    for (const p of allPlans) { if (planned.has(p.id)) total += p.leaveCnt; }
    return total;
  }, [planned, allPlans]);
  const plannedDaysOff = useMemo(() => {
    let total = 0;
    for (const p of allPlans) { if (planned.has(p.id)) total += p.totalDays; }
    return total;
  }, [planned, allPlans]);

  const togglePlan = (id) => setPlanned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = useMemo(() =>
    HOLIDAYS.filter(h => filter === 'all' || h.type === filter), [filter]);

  const byMonth = useMemo(() => {
    const map = {};
    for (const h of filtered) {
      const m = h.date.slice(0, 7);
      if (!map[m]) map[m] = [];
      map[m].push(h);
    }
    return map;
  }, [filtered]);

  const upcoming   = HOLIDAYS.filter(h => toDate(h.date) >= today);
  const next       = upcoming[0];
  const daysToNext = next ? Math.ceil((toDate(next.date) - today) / 86400000) : null;

  function handleDownload() {
    const blob = new Blob([generateIcal(HOLIDAYS)], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'kerala-holidays-2026.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.58)', backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.78)', borderRadius: 20,
    overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  };

  const remainingLeave = clDays + elDays - plannedLeave;
  const budgetOk = remainingLeave >= 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#d1fae5 0%,#dbeafe 50%,#e0f2fe 100%)', padding: '40px 16px 64px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', width: 320, height: 320, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', bottom: -80, left: -80, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 260, height: 260, background: 'rgba(14,165,233,0.12)', borderRadius: '50%', top: -60, right: -60, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📅</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>Kerala Govt Holidays 2026</h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>കേരള സർക്കാർ അവധി ദിനങ്ങൾ — Official GAD List</p>
        </div>

        {/* Next holiday */}
        {next && (
          <div style={{ ...cardStyle, padding: '18px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Next Holiday</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{next.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{next.nameMl} · {toDate(next.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#0284c7)', borderRadius: 14, padding: '10px 16px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{daysToNext === 0 ? '🎉' : daysToNext}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{daysToNext === 0 ? 'Today!' : daysToNext === 1 ? 'Tomorrow' : 'days away'}</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[{ label: 'Total', value: HOLIDAYS.length }, { label: 'National', value: HOLIDAYS.filter(h => h.type === 'national').length }, { label: 'Remaining', value: upcoming.length }, { label: 'On Sunday', value: ON_SUNDAY.length }].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.55)', borderRadius: 14, padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.8)' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.4)', borderRadius: 14, padding: 5 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '9px 6px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: tab === t ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'transparent',
              color: tab === t ? '#fff' : '#475569', transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {/* ── HOLIDAYS TAB ── */}
        {tab === 'Holidays' && (<>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {['all', 'national', 'state'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 12,
                background: filter === f ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'rgba(255,255,255,0.55)',
                color: filter === f ? '#fff' : '#475569', transition: 'all 0.15s',
              }}>{f === 'all' ? 'All' : f === 'national' ? '🇮🇳 National' : '🌴 State'}</button>
            ))}
            <button onClick={handleDownload} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: 'linear-gradient(135deg,#6366f1,#0284c7)', color: '#fff' }}>
              📆 Add to Calendar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(byMonth).map(([mk, holidays]) => {
              const [yr, mon] = mk.split('-');
              return (
                <div key={mk} style={cardStyle}>
                  <div style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 800, color: '#1e293b', letterSpacing: 0.5 }}>
                    {MONTHS[parseInt(mon) - 1]} {yr}
                  </div>
                  {holidays.map((h, idx) => {
                    const d      = toDate(h.date);
                    const isPast = d < today;
                    const isTdy  = d.getTime() === today.getTime();
                    const meta   = TYPE_META[h.type];
                    return (
                      <div key={h.date + h.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.5)' : 'none', opacity: isPast ? 0.42 : 1, background: isTdy ? 'rgba(16,185,129,0.07)' : 'transparent' }}>
                        <div style={{ minWidth: 42, textAlign: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '5px 3px', border: isTdy ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.8)' }}>
                          <div style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{d.getDate()}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>{DAYS[d.getDay()]}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{h.name}{isTdy && <span style={{ marginLeft: 6, fontSize: 10, color: '#10b981', fontWeight: 800 }}>● Today</span>}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{h.nameMl}{h.moon && <span style={{ color: '#f59e0b', marginLeft: 6 }}>🌙 moon-dependent</span>}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30`, flexShrink: 0 }}>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{ ...cardStyle, marginTop: 16, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>⚠ Falls on Sunday — no substitute declared</div>
            {ON_SUNDAY.map(h => (
              <div key={h.date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', padding: '5px 0', borderTop: '1px solid rgba(255,255,255,0.5)' }}>
                <span>{h.name}</span>
                <span style={{ fontWeight: 700 }}>{toDate(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, marginTop: 16, lineHeight: 1.6 }}>
            Source: General Administration Department, Kerala · Moon-sighting dates are approximate.
          </p>
        </>)}

        {/* ── PLANNER TAB ── */}
        {tab === 'Planner' && (<>

          {/* Leave Budget */}
          <div style={{ ...cardStyle, padding: '18px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              🎯 Set your leave balance
              <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>to see what you can plan</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Stepper label="CL (Casual Leave)" value={clDays} onChange={setClDays} max={30} />
              <Stepper label="EL (Earned Leave)" value={elDays} onChange={setElDays} max={60} />
            </div>

            {/* Budget summary bar */}
            <div style={{ background: budgetOk ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: 12, padding: '12px 16px', border: `1px solid ${budgetOk ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Total Budget', value: clDays + elDays, color: '#0284c7' },
                  { label: 'Leave Used', value: plannedLeave, color: '#f59e0b' },
                  { label: 'Remaining', value: remainingLeave, color: budgetOk ? '#10b981' : '#ef4444' },
                  { label: 'Days Off Planned', value: plannedDaysOff, color: '#7c3aed' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {planned.size > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: budgetOk ? '#10b981' : '#ef4444', fontWeight: 600, textAlign: 'center' }}>
                  {budgetOk
                    ? `✅ ${planned.size} break${planned.size > 1 ? 's' : ''} planned — ${remainingLeave} leave days remaining`
                    : `⚠️ Over budget by ${Math.abs(remainingLeave)} day${Math.abs(remainingLeave) > 1 ? 's' : ''}`}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {Object.entries(DAY_COLORS).map(([k, c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: c.bg }} />
                {c.label}
              </div>
            ))}
          </div>

          {/* Sort + Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.45)', borderRadius: 10, padding: 3, flex: 1 }}>
              {[['date', '📅 Date'], ['value', '⚡ Best Value'], ['days', '🏆 Most Days']].map(([k, lbl]) => (
                <button key={k} onClick={() => setSortBy(k)} style={{
                  flex: 1, padding: '6px 4px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 11,
                  background: sortBy === k ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'transparent',
                  color: sortBy === k ? '#fff' : '#64748b', transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.45)', borderRadius: 10, padding: 3 }}>
              {[['all', 'All'], ['natural', '🟢'], ['1', '1 leave'], ['2+', '2+']].map(([k, lbl]) => (
                <button key={k} onClick={() => setFilterLeave(k)} style={{
                  padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 11,
                  background: filterLeave === k ? 'linear-gradient(135deg,#10b981,#0284c7)' : 'transparent',
                  color: filterLeave === k ? '#fff' : '#64748b', transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {plannerData.map(p => {
              const isPast    = p.end < today;
              const isUpcoming = !isPast && allPlans.filter(x => x.end >= today)[0]?.id === p.id;
              const isPlanned = planned.has(p.id);
              const natural   = p.leaveCnt === 0;
              const overBudget = isPlanned && !budgetOk;

              return (
                <div key={p.id} style={{
                  ...cardStyle, padding: '16px 18px',
                  opacity: isPast ? 0.45 : 1,
                  outline: isPlanned ? `2px solid ${overBudget ? '#ef4444' : '#10b981'}` : isUpcoming ? '2px solid rgba(14,165,233,0.5)' : 'none',
                  transition: 'outline 0.2s',
                }}>
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 5 }}>
                        {isUpcoming && <span style={{ fontSize: 10, fontWeight: 800, color: '#0284c7', background: 'rgba(2,132,199,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(2,132,199,0.25)' }}>⭐ UPCOMING</span>}
                        {natural
                          ? <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)' }}>✅ FREE</span>
                          : <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.25)' }}>📋 {p.leaveCnt} leave{p.leaveCnt > 1 ? 's' : ''}</span>}
                        {p.efficiency !== 999 && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.08)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(124,58,237,0.2)' }}>
                            ⚡ {p.efficiency}× value
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{p.holiday.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{fmtRange(p.start, p.end)}</div>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 48 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, color: natural ? '#10b981' : p.leaveCnt === 1 ? '#f59e0b' : '#f97316' }}>{p.totalDays}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>days off</div>
                    </div>
                  </div>

                  {/* Day strip */}
                  <DayStrip days={p.days} />

                  {/* Leave days list */}
                  {p.leaveDays.length > 0 && (
                    <div style={{ marginTop: 10, fontSize: 12, color: '#92400e', background: 'rgba(245,158,11,0.08)', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
                      Apply leave on: <b>{p.leaveDays.map(ld => toDate(ld).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })).join(', ')}</b>
                    </div>
                  )}

                  {/* Plan toggle button */}
                  {!isPast && (
                    <button onClick={() => togglePlan(p.id)} style={{
                      marginTop: 12, width: '100%', padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                      background: isPlanned
                        ? overBudget ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
                        : 'rgba(255,255,255,0.5)',
                      color: isPlanned ? (overBudget ? '#ef4444' : '#10b981') : '#64748b',
                      border: isPlanned
                        ? `1px solid ${overBudget ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`
                        : '1px solid rgba(255,255,255,0.7)',
                    }}>
                      {isPlanned ? (overBudget ? '⚠️ Planned (over budget)' : '✓ Planned — click to remove') : '+ Plan this break'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, marginTop: 16 }}>
            Only 2nd Saturdays are off · 1st / 3rd / 4th Saturdays are working days · Subject to official gazette dates
          </p>
        </>)}

        {/* ── RESTRICTED TAB ── */}
        {tab === 'Restricted' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.55)', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              Restricted holidays are applicable only to employees of specific communities. Each employee may avail <b style={{ color: '#1e293b' }}>2 restricted holidays per year</b> from the list.
            </div>
            {RESTRICTED.map(h => {
              const d = toDate(h.date);
              const isPast = d < today;
              return (
                <div key={h.date} style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, opacity: isPast ? 0.45 : 1 }}>
                  <div style={{ minWidth: 44, textAlign: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '6px 4px', border: '1px solid rgba(255,255,255,0.8)' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>{MONTHS[d.getMonth()].slice(0, 3)}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8' }}>{DAYS[d.getDay()]}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{h.nameMl}</div>
                    <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>👥 {h.community}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
