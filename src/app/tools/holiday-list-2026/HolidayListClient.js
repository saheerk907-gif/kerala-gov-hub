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
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.09)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 900, fontSize: 16, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 900, fontSize: 16, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 4 }}>days</div>
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

  // Dark glass token aliases
  const card  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, overflow: 'hidden' };
  const card2 = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16 };

  const remainingLeave = clDays + elDays - plannedLeave;
  const budgetOk = remainingLeave >= 0;

  return (
    <div style={{ minHeight: '100vh', background: '#121416', color: '#fff', fontFamily: 'inherit' }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(41,151,255,0.06)', filter: 'blur(100px)', top: -100, right: -100, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 400, height: 400, borderRadius: '50%', background: 'rgba(48,209,88,0.05)', filter: 'blur(90px)', bottom: -80, left: -80, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 18, fontSize: 28, marginBottom: 16, background: 'rgba(41,151,255,0.10)', border: '1px solid rgba(41,151,255,0.18)' }}>📅</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Kerala Govt Holidays 2026</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>കേരള സർക്കാർ അവധി ദിനങ്ങൾ — Official GAD List</p>
        </div>

        {/* Next holiday */}
        {next && (
          <div style={{ ...card2, padding: '18px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Next Holiday</div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{next.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{next.nameMl} · {toDate(next.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#2997ff,#30d158)', borderRadius: 14, padding: '10px 18px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{daysToNext === 0 ? '🎉' : daysToNext}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{daysToNext === 0 ? 'Today!' : daysToNext === 1 ? 'Tomorrow' : 'days away'}</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[{ label: 'Total', value: HOLIDAYS.length, color: '#2997ff' }, { label: 'National', value: HOLIDAYS.filter(h => h.type === 'national').length, color: '#ff9f0a' }, { label: 'Remaining', value: upcoming.length, color: '#30d158' }, { label: 'On Sunday', value: ON_SUNDAY.length, color: '#ff453a' }].map(s => (
            <div key={s.label} style={{ flex: 1, ...card2, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 6px', borderRadius: 11, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: tab === t ? 'linear-gradient(135deg,#2997ff,#0ea5e9)' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s',
              boxShadow: tab === t ? '0 2px 12px rgba(41,151,255,0.3)' : 'none',
            }}>{t}</button>
          ))}
        </div>

        {/* ── HOLIDAYS TAB ── */}
        {tab === 'Holidays' && (<>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['all', 'national', 'state'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 12,
                background: filter === f ? 'linear-gradient(135deg,#2997ff,#0ea5e9)' : 'rgba(255,255,255,0.07)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: filter === f ? '#fff' : 'rgba(255,255,255,0.55)', transition: 'all 0.15s',
              }}>{f === 'all' ? 'All' : f === 'national' ? '🇮🇳 National' : '🌴 State'}</button>
            ))}
            <button onClick={handleDownload} style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: 'linear-gradient(135deg,#bf5af2,#2997ff)', color: '#fff' }}>
              📆 Add to Calendar
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(byMonth).map(([mk, holidays]) => {
              const [yr, mon] = mk.split('-');
              return (
                <div key={mk} style={card}>
                  <div style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>
                    {MONTHS[parseInt(mon) - 1]} {yr}
                  </div>
                  {holidays.map((h, idx) => {
                    const d      = toDate(h.date);
                    const isPast = d < today;
                    const isTdy  = d.getTime() === today.getTime();
                    const meta   = TYPE_META[h.type];
                    return (
                      <div key={h.date + h.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', opacity: isPast ? 0.35 : 1, background: isTdy ? 'rgba(41,151,255,0.06)' : 'transparent' }}>
                        <div style={{ minWidth: 44, textAlign: 'center', flexShrink: 0, background: isTdy ? 'rgba(41,151,255,0.15)' : 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '6px 4px', border: isTdy ? '1px solid rgba(41,151,255,0.4)' : '1px solid rgba(255,255,255,0.09)' }}>
                          <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{d.getDate()}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{DAYS[d.getDay()]}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                            {h.name}
                            {isTdy && <span style={{ marginLeft: 8, fontSize: 10, color: '#30d158', fontWeight: 800 }}>● Today</span>}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                            {h.nameMl}{h.moon && <span style={{ color: '#ff9f0a', marginLeft: 8 }}>🌙 moon-dependent</span>}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`, flexShrink: 0 }}>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{ ...card2, marginTop: 16, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ff9f0a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>⚠ Falls on Sunday — no substitute declared</div>
            {ON_SUNDAY.map(h => (
              <div key={h.date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.45)', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span>{h.name}</span>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{toDate(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 16, lineHeight: 1.6 }}>
            Source: General Administration Department, Kerala · Moon-sighting dates are approximate.
          </p>
        </>)}

        {/* ── PLANNER TAB ── */}
        {tab === 'Planner' && (<>

          {/* Leave Budget */}
          <div style={{ ...card2, padding: '20px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
              🎯 Your leave balance
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 8 }}>set to see what you can plan</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Stepper label="CL (Casual Leave)" value={clDays} onChange={setClDays} max={30} />
              <Stepper label="EL (Earned Leave)" value={elDays} onChange={setElDays} max={60} />
            </div>

            {/* Budget summary */}
            <div style={{ background: budgetOk ? 'rgba(48,209,88,0.07)' : 'rgba(255,69,58,0.08)', borderRadius: 12, padding: '14px 16px', border: `1px solid ${budgetOk ? 'rgba(48,209,88,0.2)' : 'rgba(255,69,58,0.25)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Total Budget', value: clDays + elDays, color: '#2997ff' },
                  { label: 'Leave Used',   value: plannedLeave,    color: '#ff9f0a' },
                  { label: 'Remaining',    value: remainingLeave,  color: budgetOk ? '#30d158' : '#ff453a' },
                  { label: 'Days Off',     value: plannedDaysOff,  color: '#bf5af2' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {planned.size > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: budgetOk ? '#30d158' : '#ff453a', fontWeight: 600, textAlign: 'center' }}>
                  {budgetOk
                    ? `✅ ${planned.size} break${planned.size > 1 ? 's' : ''} planned — ${remainingLeave} days remaining`
                    : `⚠️ Over budget by ${Math.abs(remainingLeave)} day${Math.abs(remainingLeave) > 1 ? 's' : ''}`}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            {Object.entries(DAY_COLORS).filter(([k]) => k !== 'work').map(([k, c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: c.bg }} />
                {c.label}
              </div>
            ))}
          </div>

          {/* Sort + Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 3, flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
              {[['date', '📅 Date'], ['value', '⚡ Best Value'], ['days', '🏆 Most Days']].map(([k, lbl]) => (
                <button key={k} onClick={() => setSortBy(k)} style={{
                  flex: 1, padding: '7px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap',
                  background: sortBy === k ? 'linear-gradient(135deg,#2997ff,#0ea5e9)' : 'transparent',
                  color: sortBy === k ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s',
                }}>{lbl}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
              {[['all', 'All'], ['natural', '🟢 Free'], ['1', '1 leave'], ['2+', '2+']].map(([k, lbl]) => (
                <button key={k} onClick={() => setFilterLeave(k)} style={{
                  padding: '7px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap',
                  background: filterLeave === k ? 'linear-gradient(135deg,#2997ff,#0ea5e9)' : 'transparent',
                  color: filterLeave === k ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s',
                }}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plannerData.map(p => {
              const isPast     = p.end < today;
              const isUpcoming = !isPast && allPlans.filter(x => x.end >= today)[0]?.id === p.id;
              const isPlanned  = planned.has(p.id);
              const natural    = p.leaveCnt === 0;
              const overBudget = isPlanned && !budgetOk;

              return (
                <div key={p.id} style={{
                  ...card2, padding: '18px',
                  opacity: isPast ? 0.35 : 1,
                  outline: isPlanned
                    ? `2px solid ${overBudget ? 'rgba(255,69,58,0.6)' : 'rgba(48,209,88,0.5)'}`
                    : isUpcoming ? '2px solid rgba(41,151,255,0.4)' : 'none',
                  transition: 'outline 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                        {isUpcoming && <span style={{ fontSize: 10, fontWeight: 800, color: '#2997ff', background: 'rgba(41,151,255,0.12)', padding: '2px 9px', borderRadius: 20, border: '1px solid rgba(41,151,255,0.25)' }}>⭐ UPCOMING</span>}
                        {natural
                          ? <span style={{ fontSize: 10, fontWeight: 800, color: '#30d158', background: 'rgba(48,209,88,0.1)', padding: '2px 9px', borderRadius: 20, border: '1px solid rgba(48,209,88,0.25)' }}>✅ FREE</span>
                          : <span style={{ fontSize: 10, fontWeight: 800, color: '#ff9f0a', background: 'rgba(255,159,10,0.1)', padding: '2px 9px', borderRadius: 20, border: '1px solid rgba(255,159,10,0.25)' }}>📋 {p.leaveCnt} leave{p.leaveCnt > 1 ? 's' : ''}</span>}
                        {p.efficiency !== 999 && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#bf5af2', background: 'rgba(191,90,242,0.1)', padding: '2px 9px', borderRadius: 20, border: '1px solid rgba(191,90,242,0.2)' }}>
                            ⚡ {p.efficiency}× value
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.92)' }}>{p.holiday.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{fmtRange(p.start, p.end)}</div>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 52 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: natural ? '#30d158' : p.leaveCnt === 1 ? '#ff9f0a' : '#ff6b35' }}>{p.totalDays}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>days off</div>
                    </div>
                  </div>

                  <DayStrip days={p.days} />

                  {p.leaveDays.length > 0 && (
                    <div style={{ marginTop: 12, fontSize: 12, color: '#ff9f0a', background: 'rgba(255,159,10,0.07)', padding: '9px 13px', borderRadius: 10, border: '1px solid rgba(255,159,10,0.18)' }}>
                      Apply leave on: <b style={{ color: 'rgba(255,255,255,0.75)' }}>{p.leaveDays.map(ld => toDate(ld).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })).join(', ')}</b>
                    </div>
                  )}

                  {!isPast && (
                    <button onClick={() => togglePlan(p.id)} style={{
                      marginTop: 12, width: '100%', padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                      background: isPlanned
                        ? overBudget ? 'rgba(255,69,58,0.12)' : 'rgba(48,209,88,0.1)'
                        : 'rgba(255,255,255,0.06)',
                      color: isPlanned ? (overBudget ? '#ff453a' : '#30d158') : 'rgba(255,255,255,0.5)',
                      border: isPlanned
                        ? `1px solid ${overBudget ? 'rgba(255,69,58,0.3)' : 'rgba(48,209,88,0.25)'}`
                        : '1px solid rgba(255,255,255,0.1)',
                    }}>
                      {isPlanned ? (overBudget ? '⚠️ Planned (over budget)' : '✓ Planned — click to remove') : '+ Plan this break'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 16 }}>
            Only 2nd Saturdays are off · 1st / 3rd / 4th Saturdays are working days · Subject to official gazette dates
          </p>
        </>)}

        {/* ── RESTRICTED TAB ── */}
        {tab === 'Restricted' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ ...card2, padding: '14px 18px', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Restricted holidays apply only to employees of specific communities. Each employee may avail <b style={{ color: 'rgba(255,255,255,0.8)' }}>2 restricted holidays per year</b> from the list.
            </div>
            {RESTRICTED.map(h => {
              const d = toDate(h.date);
              const isPast = d < today;
              return (
                <div key={h.date} style={{ ...card2, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, opacity: isPast ? 0.35 : 1 }}>
                  <div style={{ minWidth: 48, textAlign: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '7px 4px', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{MONTHS[d.getMonth()].slice(0, 3)}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>{DAYS[d.getDay()]}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{h.nameMl}</div>
                    <div style={{ fontSize: 11, color: '#bf5af2', marginTop: 5, fontWeight: 600 }}>👥 {h.community}</div>
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
