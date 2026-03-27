'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import SectionHeader from '@/components/SectionHeader';
import AnimatedNumber from '@/components/AnimatedNumber';

/* ── KSR rounding: fraction ≥ 0.5 → ceil, else floor ── */
function roundKSR(val) {
  const frac = val - Math.floor(val);
  return frac >= 0.5 ? Math.ceil(val) : Math.floor(val);
}

/* ── Date helpers ── */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(fromStr, toStr) {
  const a = new Date(fromStr);
  const b = new Date(toStr);
  return Math.max(0, Math.round((b - a) / 86400000) + 1);
}

function yearsBetween(fromStr, toStr) {
  const a = new Date(fromStr);
  const b = new Date(toStr);
  return Math.max(0, (b - a) / (365.25 * 86400000));
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Core calculation per KSR Part I ── */
function calculateEL({ category, dutyDays, yearsOfService, fullVacation, vacationAvailed, appointmentType, existingBalance, isLPR }) {
  const existing   = Number(existingBalance) || 0;
  const duty       = Number(dutyDays) || 0;
  const years      = Number(yearsOfService) || 0;
  const MAX_ACCUM  = 300;
  let earned       = 0;
  let rateNote     = '';
  let maxGrant     = isLPR ? 300 : 180;

  if (category === 'permanent') {
    earned   = roundKSR(duty / 11);
    rateNote = `1/11 of ${duty} days on duty`;

  } else if (category === 'temporary') {
    if (years >= 3) {
      earned   = roundKSR(duty / 11);
      rateNote = `1/11 (≥3 years service) of ${duty} days`;
    } else {
      earned   = roundKSR(duty / 22);
      rateNote = `1/22 (first 3 years service) of ${duty} days`;
    }

  } else if (category === 'vacation') {
    const fullV   = Number(fullVacation) || 0;
    const availed = Number(vacationAvailed) || 0;
    if (fullV === 0) {
      earned   = 0;
      rateNote = 'Enter full vacation days to calculate';
    } else if (availed >= fullV) {
      earned   = 0;
      rateNote = 'Full vacation availed — no earned leave admissible this year';
    } else if (availed === 0) {
      earned   = roundKSR(duty / 11);
      rateNote = `No vacation availed — 1/11 of ${duty} days (normal rule)`;
    } else {
      const notTaken = fullV - availed;
      const raw      = (notTaken / fullV) * 30;
      earned   = roundKSR(raw);
      rateNote = `(${notTaken} days not taken ÷ ${fullV}) × 30 = ${raw.toFixed(2)} → ${earned} days`;
    }

  } else if (category === 'limited') {
    const raw = roundKSR(duty / 11);
    if (appointmentType === 'upto1year') {
      earned   = Math.min(raw, 15);
      rateNote = `1/11 of ${duty} days = ${raw}, capped at 15 days (appointment ≤1 year)`;
    } else {
      const maxByYear  = roundKSR(years * 15);
      const capApplied = Math.min(raw, maxByYear, 60);
      earned   = Math.max(0, capApplied);
      rateNote = `1/11 of ${duty} days = ${raw}, max 15 days/year (${maxByYear} days), lifetime cap 60 days`;
    }
  }

  const room            = Math.max(0, MAX_ACCUM - existing);
  const effectiveEarned = Math.min(earned, room);
  const newBalance      = existing + effectiveEarned;
  const cappedAt300     = earned > room;

  return { earned, effectiveEarned, newBalance, cappedAt300, maxGrant, rateNote, canGrant: Math.min(newBalance, maxGrant) };
}

const CATEGORIES = [
  { id: 'permanent', label: 'Permanent Officer',         sub: 'Non-vacation dept' },
  { id: 'temporary', label: 'Temporary / Officiating',   sub: 'Non-permanent employ' },
  { id: 'vacation',  label: 'Vacation Department',       sub: 'Schools / Courts / Colleges' },
  { id: 'limited',   label: 'Limited Period (Contract)', sub: 'Up to 5 years appointment' },
];

const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';
const labelCls = 'text-xs text-white/60 font-medium mb-2 block';

function ResultRow({ label, value, accent, small }) {
  return (
    <div className={`flex justify-between items-center ${small ? 'py-1.5' : 'py-2.5'} border-b border-white/[0.06] last:border-0`}>
      <span className={small ? 'text-xs text-white/60' : 'text-sm text-white/65'}>{label}</span>
      <span className={`font-bold tabular-nums ${small ? 'text-sm' : 'text-base'} ${accent ? 'text-[#ff9f0a]' : 'text-white'}`}>{value}</span>
    </div>
  );
}

const FAQ_DATA = [
  {
    q: 'How is Earned Leave (EL) calculated and accumulated for Government Employees in Kerala?',
    a: 'Under the Kerala Service Rules, the earned leave admissible to an officer in permanent employ is calculated at 1/11th of the period spent on duty. An officer will cease to earn this leave once the accumulated earned leave due amounts to a maximum of 300 days. The maximum amount of earned leave that can be granted at a single time is normally restricted to 180 days. However, if an officer applies for leave preparatory to retirement, the maximum earned leave granted at a time can be up to 300 days.',
  },
  {
    q: 'What is the Age of Compulsory Retirement under the Kerala Service Rules?',
    a: 'The general rule is that the date of compulsory retirement of an officer takes effect from the afternoon of the last day of the month in which they attain the age of 56 years. There are specific exceptions, such as for doctors in the Medical Education Service and teaching staff of Ayurveda and Homoeopathic Medical Colleges, who retire at the age of 60 years. Additionally, teaching staff of educational institutions who complete 56 years during the course of an academic year are allowed to continue in service till the last day of the month in which the academic year ends.',
  },
  {
    q: 'What are the Maternity and Paternity Leave benefits under KSR?',
    a: 'A competent authority may grant a female officer maternity leave on full pay for a period of 180 days from the date of its commencement. This leave is also admissible to temporary female officers. For male State Government employees, the competent authority may grant paternity leave for a period of up to 10 days during the confinement of his wife for two deliveries, with full pay and allowances. Paternity leave can be taken before or within three months after the date of delivery.',
  },
  {
    q: 'How many days of Casual Leave are allowed in a calendar year?',
    a: 'Normally, no officer may be absent on casual leave for more than 20 days in the course of one calendar year. However, members of the teaching staff of educational institutions are eligible for only 15 days of casual leave in a calendar year. Officers are allowed to combine casual leave with Sundays and other authorized holidays, provided the resulting period of absence from duty does not exceed 15 days at a stretch.',
  },
  {
    q: 'How is Half-Pay Leave (HPL) calculated and can it be commuted?',
    a: 'The half-pay leave admissible to an officer in permanent employ is 20 days for each completed year of service. This leave can be availed of either on private affairs or on medical certificate. Furthermore, commuted leave not exceeding half the amount of half-pay leave due may be granted to an officer in permanent employ. When commuted leave is granted, twice the amount of such leave is debited against the half-pay leave due.',
  },
  {
    q: "What is the Subsistence Allowance granted during an employee's Suspension?",
    a: 'An officer under suspension is entitled to a subsistence allowance at an amount equal to the leave salary which the officer would have drawn had they been on leave on half-pay on the date of suspension. In addition, the officer may be granted Dearness Allowance and Dearness Pay not exceeding the amount admissible had they been on a leave salary equal to the rate of the subsistence allowance.',
  },
  {
    q: 'Can Earned Leave be combined with Vacation periods?',
    a: 'Yes, vacation may be taken in combination with or in continuation of any kind of leave. However, the total duration of the vacation and earned leave taken together must not exceed the maximum amount of earned leave due and admissible to the officer at a time (which is generally 180 days).',
  },
  {
    q: 'What happens if a Government servant overstays their sanctioned leave?',
    a: 'If an officer governed by these rules remains absent after the end of their leave, the period of such overstayal is treated as half-pay leave to the extent such leave is due. If the period of overstayal exceeds the half-pay leave due, the remaining period is treated as leave without allowances. The officer is not entitled to leave salary during this overstayal period unless the leave is extended by the competent authority.',
  },
];

export default function LeaveCalculator() {
  const today = todayStr();

  const [category,        setCategory]    = useState('permanent');
  const [joiningDate,     setJoiningDate] = useState('');
  const [asOfDate,        setAsOfDate]    = useState(today);
  const [fullVacation,    setFullVacation] = useState('');
  const [vacationAvailed, setVacAvailed]  = useState('');
  const [appointmentType, setApptType]    = useState('upto1year');
  const [existingBalance, setExisting]    = useState('');
  const [isLPR,           setIsLPR]       = useState(false);
  const [openFaq,         setOpenFaq]     = useState(null);

  const dutyDays       = useMemo(() => joiningDate && asOfDate ? daysBetween(joiningDate, asOfDate) : 0, [joiningDate, asOfDate]);
  const yearsOfService = useMemo(() => joiningDate && asOfDate ? yearsBetween(joiningDate, asOfDate) : 0, [joiningDate, asOfDate]);

  const ready  = joiningDate && asOfDate && dutyDays > 0;
  const result = ready ? calculateEL({ category, dutyDays, yearsOfService, fullVacation, vacationAvailed, appointmentType, existingBalance, isLPR }) : null;

  const yearsDisplay = yearsOfService > 0
    ? `${Math.floor(yearsOfService)} yr${Math.floor(yearsOfService) !== 1 ? 's' : ''} ${Math.round((yearsOfService % 1) * 12)} mo`
    : '—';

  const [animKey, setAnimKey] = useState(0);
  const prevResultNull = useRef(true);
  useEffect(() => {
    const wasNull = prevResultNull.current;
    prevResultNull.current = result === null;
    if (wasNull && result !== null) setAnimKey(k => k + 1);
  }, [result]);

  return (
    <div className="space-y-6">

      {/* ── Header card ── */}
      <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.25)' }}>📅</div>
          <div>
            <h1 className="text-lg font-[900] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>Leave Calculator</h1>
            <p className="text-xs text-white/60">KSR Part I — Earned Leave</p>
          </div>
        </div>
      </div>

      {/* ── Service Type ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Service Type" />
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`text-left rounded-xl px-3 py-2.5 border transition-all duration-150 ${
                category === c.id
                  ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-bold leading-tight">{c.label}</div>
              <div className="text-[10px] text-white/55 mt-0.5">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Leave Period ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Leave Period" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className={labelCls}>Date of Joining / Service Start</label>
            <input
              type="date"
              max={asOfDate}
              value={joiningDate}
              onChange={e => setJoiningDate(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">First day of duty in the current post</p>
          </div>

          <div>
            <label className={labelCls}>Calculate As Of</label>
            <input
              type="date"
              min={joiningDate || undefined}
              max={today}
              value={asOfDate}
              onChange={e => setAsOfDate(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">Defaults to today; change for a past/future date</p>
          </div>

          {joiningDate && asOfDate && dutyDays > 0 && (
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
                <span className="text-[10px] text-white/60 uppercase tracking-wider">Total Period</span>
                <span className="text-xs font-bold text-white">{dutyDays.toLocaleString('en-IN')} days</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
                <span className="text-[10px] text-white/60 uppercase tracking-wider">Service Length</span>
                <span className="text-xs font-bold text-white">{yearsDisplay}</span>
              </div>
              {category === 'temporary' && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${yearsOfService >= 3 ? 'bg-[#30d158]/10 border-[#30d158]/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">Rate Applied</span>
                  <span className={`text-xs font-bold ${yearsOfService >= 3 ? 'text-[#30d158]' : 'text-amber-400'}`}>
                    {yearsOfService >= 3 ? '1/11 (≥3 yrs)' : '1/22 (<3 yrs)'}
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className={labelCls}>Existing EL Balance (days)</label>
            <input
              type="number"
              min="0"
              max="300"
              placeholder="e.g. 120"
              value={existingBalance}
              onChange={e => setExisting(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">Leave already accumulated before this period</p>
          </div>

          {category === 'vacation' && (
            <>
              <div>
                <label className={labelCls}>Full Vacation Entitlement (days/year)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 60"
                  value={fullVacation}
                  onChange={e => setFullVacation(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Vacation Actually Availed (days)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  value={vacationAvailed}
                  onChange={e => setVacAvailed(e.target.value)}
                  className={inputCls}
                />
              </div>
            </>
          )}

          {category === 'limited' && (
            <div>
              <label className={labelCls}>Appointment Duration</label>
              <select
                value={appointmentType}
                onChange={e => setApptType(e.target.value)}
                className={inputCls}
              >
                <option value="upto1year">Up to 1 Year</option>
                <option value="1to5years">1 to 5 Years</option>
              </select>
            </div>
          )}

          {(category === 'permanent' || category === 'temporary') && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setIsLPR(!isLPR)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isLPR ? 'bg-[#ff9f0a]' : 'bg-white/15'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${isLPR ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-white/60">
                  Leave Preparatory to Retirement (LPR) — max grant increases to 300 days
                </span>
              </label>
            </div>
          )}

          {!joiningDate && (
            <div className="md:col-span-2 text-center py-8 rounded-[16px] border border-dashed border-white/10">
              <p className="text-sm text-white/50">Enter your Date of Joining above to calculate Earned Leave</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
          <SectionHeader title="Results" />
          <p className="text-[10px] text-white/45 mb-3">
            {fmtDate(joiningDate)} → {fmtDate(asOfDate)} · {dutyDays.toLocaleString('en-IN')} days
          </p>

          <ResultRow label="EL Earned this period"   value={<AnimatedNumber value={result.earned} animKey={animKey} prefix="" suffix=" days" />} accent />
          {result.cappedAt300 && (
            <ResultRow label="EL Credited (300-day cap)" value={<AnimatedNumber value={result.effectiveEarned} animKey={animKey} prefix="" suffix=" days" />} small />
          )}
          <ResultRow label="Updated EL Balance"      value={<AnimatedNumber value={result.newBalance} animKey={animKey} prefix="" suffix=" days" />} />
          <ResultRow label="Max Accumulation Limit"  value="300 days" small />
          <ResultRow label={`Max Grant at a Time${isLPR ? ' (LPR)' : ''}`} value={<AnimatedNumber value={result.maxGrant} animKey={animKey} prefix="" suffix=" days" />} small />
          <ResultRow label="Admissible Grant Now"    value={<AnimatedNumber value={result.canGrant} animKey={animKey} prefix="" suffix=" days" />} accent />

          <p className="mt-3 text-[11px] text-white/50 leading-relaxed">{result.rateNote}</p>

          {result.cappedAt300 && (
            <p className="mt-2 text-[11px] text-amber-400/70 leading-relaxed">
              ⚠ Accumulation limit of 300 days exceeded. Only {result.effectiveEarned} days credited; officer ceases to earn further leave until balance drops below 300.
            </p>
          )}

          <p className="mt-4 text-[11px] text-white/40 leading-relaxed">
            Note: Calculation is based on total calendar days from joining date. Actual entitlement excludes periods spent on leave, EOL, and suspension, and is subject to audit and competent authority's sanction per KSR Part I.
          </p>
        </div>
      )}

      {/* ── KSR Rules Reference Table ── */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-[900] text-white mb-4" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          KSR Earned Leave Rules — Quick Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2 pr-4">Category</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2 pr-4">Rate</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2 pr-4">Max Accum.</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2">Max Grant</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Permanent (Non-Vacation)',              '1/11 of duty days',                     '300 days', '180 days (300 for LPR)'],
                ['Temporary / Officiating (<3 yrs)',      '1/22 of duty days',                     '—',        '—'],
                ['Temporary / Officiating (≥3 yrs)',      '1/11 of duty days',                     '—',        '—'],
                ['Vacation Dept — Full vacation availed', 'Nil',                                   '—',        '—'],
                ['Vacation Dept — Partial vacation',      '(Days not taken ÷ Full vacation) × 30', '—',        '—'],
                ['Vacation Dept — No vacation availed',   '1/11 of duty days',                     '—',        '—'],
                ['Limited Period ≤1 year',                '1/11, max 15 days total',               '15 days',  '15 days'],
                ['Limited Period 1–5 years',              '1/11, max 15 days/year',                '60 days',  '60 days'],
              ].map(([cat, rate, accum, grant]) => (
                <tr key={cat} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-2.5 pr-4 text-white/70 text-xs">{cat}</td>
                  <td className="py-2.5 pr-4 text-[#ff9f0a] text-xs font-mono">{rate}</td>
                  <td className="py-2.5 pr-4 text-white/50 text-xs">{accum}</td>
                  <td className="py-2.5 text-white/50 text-xs">{grant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-white/45">
          Fractions: &lt;0.5 ignored · ≥0.5 counted as 1 full day (KSR Part I rounding rule)
        </p>
      </div>

      {/* ── FAQ Section ── */}
      <section aria-label="Frequently Asked Questions on Kerala Service Rules Leave">
        <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] text-white mb-2" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          Frequently Asked Questions — KSR Leave Rules
        </h2>
        <p className="text-sm text-white/60 mb-6">
          Common questions on Earned Leave, Casual Leave, Maternity Leave, and other service benefits under Kerala Service Rules (KSR) Part I &amp; II.
        </p>
        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="glass-card rounded-[16px] overflow-hidden border border-white/[0.07]">
              <button
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-snug">
                  {item.q}
                </h3>
                <span className={`flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-white/60 text-xs transition-transform duration-200 mt-0.5 ${openFaq === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-white/55 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
