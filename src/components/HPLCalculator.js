'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import SectionHeader from '@/components/SectionHeader';

// ─── Date helpers ────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Count full anniversaries between startDate and endDate (both as Date objects).
 * Anniversary day itself counts as a completed year (>= comparison).
 * e.g. joining 2020-03-18, today 2023-03-18 → 3 completed years.
 * Handles Feb-29 joiners correctly by constructing each anniversary independently.
 */
function countFullAnniversaries(startDate, endDate) {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  if (end <= start) return 0;
  let years = 0;
  for (let y = start.getFullYear() + 1; y <= end.getFullYear(); y++) {
    const anniv = new Date(y, start.getMonth(), start.getDate());
    if (anniv <= end) years++;
  }
  return years;
}

/**
 * Merge overlapping date-range pairs [{from, to}, ...] and return total
 * day count excluded from service. Both from and to are inclusive.
 * Clamps: to > today → today. from < joiningDate → joiningDate.
 */
function calcExcludedDays(lwaRanges, joiningStr) {
  const today   = new Date(todayStr());
  const joining = new Date(joiningStr);

  // Normalise each range; track whether any `from` was clamped past joiningDate
  let lwaBeforeJoining = false;
  const normalised = lwaRanges
    .filter(r => r.from && r.to)
    .map(r => {
      let from = new Date(r.from);
      let to   = new Date(r.to);
      // clamp from to joiningDate — record if clamping occurred
      if (from < joining) { lwaBeforeJoining = true; from = new Date(joining); }
      // clamp to to today
      if (to > today) to = new Date(today);
      return { from, to };
    })
    .filter(r => r.from <= r.to);

  if (normalised.length === 0) return { days: 0, lwaBeforeJoining };

  // Sort by from-date
  normalised.sort((a, b) => a.from - b.from);

  // Merge overlapping ranges
  const merged = [normalised[0]];
  for (let i = 1; i < normalised.length; i++) {
    const last = merged[merged.length - 1];
    const curr = normalised[i];
    if (curr.from <= new Date(last.to.getTime() + 86400000)) {
      // overlapping or adjacent — extend
      if (curr.to > last.to) last.to = curr.to;
    } else {
      merged.push({ from: new Date(curr.from), to: new Date(curr.to) });
    }
  }

  // Sum inclusive days across merged ranges
  const days = merged.reduce((sum, r) => {
    return sum + Math.round((r.to - r.from) / 86400000) + 1;
  }, 0);
  return { days, lwaBeforeJoining };
}

// ─── Core HPL / Commuted Leave calculation ───────────────────────────────────

/**
 * @param {Object} params
 * @param {string}  params.joiningDate       ISO date string
 * @param {Array}   params.lwaRanges         [{from, to}] — LWA periods to exclude
 * @param {number}  params.hplTaken          cumulative HPL days already taken
 * @param {number}  params.commutedTaken     cumulative Commuted Leave days already taken
 * @param {number}  params.clTakenThisYear   CL days taken in current calendar year
 * @param {boolean} params.isPermanent
 */
function calculateHPL({ joiningDate, lwaRanges, hplTaken, commutedTaken, clTakenThisYear, isPermanent }) {
  const today   = new Date(todayStr());
  const joining = new Date(joiningDate);

  // Shift joining date forward by excluded LWA days
  const { days: excludedDays, lwaBeforeJoining } = calcExcludedDays(lwaRanges, joiningDate);
  const effectiveJoining = new Date(joining.getTime() + excludedDays * 86400000);

  const completedYears  = countFullAnniversaries(effectiveJoining, today);
  const totalHPLEarned  = completedYears * 20;

  const hpl = Number(hplTaken)      || 0;
  const com = Number(commutedTaken) || 0;
  const cl  = Number(clTakenThisYear) || 0;

  const rawHplDue    = totalHPLEarned - hpl - com * 2;
  const hplDue       = Math.max(0, rawHplDue);
  const showOverflow = rawHplDue < 0;

  const commutedEligible     = isPermanent || completedYears >= 3;
  const maxCommutedAvailable = commutedEligible ? Math.floor(hplDue / 2) : 0;

  const clRemaining = Math.max(0, 20 - cl);
  const clOverflow  = cl > 20;

  return {
    completedYears,
    excludedDays,
    lwaBeforeJoining,
    totalHPLEarned,
    hplDue,
    showOverflow,
    commutedEligible,
    maxCommutedAvailable,
    clRemaining,
    clOverflow,
  };
}

// ─── "Can I take X days?" checker ────────────────────────────────────────────

function checkLeave({ leaveType, desired, result }) {
  const d = Number(desired) || 0;
  if (d <= 0) return null;

  const { hplDue, commutedEligible, maxCommutedAvailable, clRemaining } = result;

  if (leaveType === 'HPL') {
    if (d <= hplDue) {
      const reduction = Math.floor(d / 2);
      return {
        ok: true,
        message: `Yes — you can take ${d} day${d !== 1 ? 's' : ''} HPL. This reduces your Commuted Leave ceiling by ${reduction} day${reduction !== 1 ? 's' : ''}.`,
      };
    }
    return {
      ok: false,
      message: `No — only ${hplDue} day${hplDue !== 1 ? 's' : ''} of HPL available.`,
    };
  }

  if (leaveType === 'Commuted') {
    if (!commutedEligible) {
      return { ok: false, message: 'Not eligible — Non-permanent employees need 3 years of service for Commuted Leave.' };
    }
    if (d <= maxCommutedAvailable) {
      const hplAfter = hplDue - d * 2;
      return {
        ok: true,
        message: `Yes — you can take ${d} day${d !== 1 ? 's' : ''} Commuted Leave. HPL balance after debit: ${hplAfter} days.`,
        advisory: 'Note: KSR requires that Commuted Leave combined with Earned Leave and Vacation must not exceed 240 days at a stretch. Verify with your office.',
      };
    }
    return {
      ok: false,
      message: `No — only ${maxCommutedAvailable} day${maxCommutedAvailable !== 1 ? 's' : ''} of Commuted Leave available.`,
    };
  }

  if (leaveType === 'CL') {
    if (d <= clRemaining) {
      return { ok: true, message: `Yes — you can take ${d} day${d !== 1 ? 's' : ''} Casual Leave. Remaining after: ${clRemaining - d} days.` };
    }
    return { ok: false, message: `No — only ${clRemaining} day${clRemaining !== 1 ? 's' : ''} of CL remaining this year.` };
  }

  return null;
}

// ─── Animated counter hook ───────────────────────────────────────────────────

/**
 * Returns a display value that counts from 0 to `target` over `duration` ms.
 * Re-triggers whenever `target` changes.
 */
function useAnimatedCounter(target, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    const to    = target;

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(to * progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

// ─── Shared style constants (mirrors LeaveCalculator.js) ─────────────────────
const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#64d2ff]/50 focus:bg-white/[0.09] transition-all w-full';
const labelCls = 'text-xs text-white/60 font-medium mb-2 block';
const ACCENT   = '#64d2ff';

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, accent, bar, barUsed, barTotal, unit = 'days' }) {
  const displayVal = useAnimatedCounter(value);
  return (
    <div className="flex flex-col gap-1.5 rounded-xl p-3 bg-white/[0.04] border border-white/[0.07]">
      <span className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">{label}</span>
      <span
        className="text-2xl font-[900] tabular-nums leading-none"
        style={{ color: accent ? ACCENT : 'white' }}
      >
        {displayVal}
        <span className="text-sm font-semibold text-white/50 ml-1">{unit}</span>
      </span>
      {bar && barTotal > 0 && (
        <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden mt-0.5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (barUsed / barTotal) * 100).toFixed(1)}%`,
              background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}99)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function EligibilityBadge({ eligible, reason }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
        eligible
          ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#30d158]'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      }`}
    >
      <span>{eligible ? '✓' : '⏳'}</span>
      <span>{reason}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function HPLCalculator() {
  const today = todayStr();

  // Inputs
  const [isPermanent,   setIsPermanent]   = useState(true);
  const [joiningDate,   setJoiningDate]   = useState('');
  const [lwaRanges,     setLwaRanges]     = useState([]);
  const [hplTaken,      setHplTaken]      = useState('');
  const [commutedTaken, setCommutedTaken] = useState('');
  const [clTaken,       setClTaken]       = useState('');

  // Checker inputs
  const [checkDays, setCheckDays] = useState('');
  const [checkType, setCheckType] = useState('HPL');

  const ready = !!joiningDate;

  const result = useMemo(() => {
    if (!ready) return null;
    return calculateHPL({
      joiningDate,
      lwaRanges,
      hplTaken:        Number(hplTaken)      || 0,
      commutedTaken:   Number(commutedTaken) || 0,
      clTakenThisYear: Number(clTaken)       || 0,
      isPermanent,
    });
  }, [joiningDate, lwaRanges, hplTaken, commutedTaken, clTaken, isPermanent]);

  const checkResult = useMemo(() => {
    if (!result || !checkDays) return null;
    return checkLeave({ leaveType: checkType, desired: Number(checkDays), result });
  }, [result, checkDays, checkType]);

  // LWA range helpers
  function addLwa() { setLwaRanges(r => [...r, { from: '', to: '' }]); }
  function removeLwa(i) { setLwaRanges(r => r.filter((_, idx) => idx !== i)); }
  function updateLwa(i, key, val) {
    setLwaRanges(r => r.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  return (
    <div className="space-y-6 mt-8">

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.07]" />
        <span className="text-[10px] uppercase tracking-widest text-white/35 font-semibold">Half-Pay &amp; Commuted Leave</span>
        <div className="h-px flex-1 bg-white/[0.07]" />
      </div>

      {/* ── Header card ── */}
      <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}35` }}
          >
            📋
          </div>
          <div>
            <h2
              className="text-lg font-[900] text-white leading-tight"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
            >
              HPL &amp; Commuted Leave Calculator
            </h2>
            <p className="text-xs text-white/60">KSR Part I — Half-Pay Leave &amp; Commuted Leave</p>
          </div>
        </div>
      </div>

      {/* ── Employment Type ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Employment Type" />
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: true,  label: 'Permanent Employee',     sub: 'Confirmed in service' },
            { id: false, label: 'Non-Permanent Employee', sub: 'Probationer / Officiating' },
          ].map(opt => (
            <button
              key={String(opt.id)}
              onClick={() => setIsPermanent(opt.id)}
              className={`text-left rounded-xl px-3 py-2.5 border transition-all duration-150 ${
                isPermanent === opt.id
                  ? 'border-[#64d2ff]/50 text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20'
              }`}
              style={isPermanent === opt.id ? { background: `${ACCENT}15` } : {}}
            >
              <div className="text-xs font-bold leading-tight">{opt.label}</div>
              <div className="text-[10px] text-white/55 mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>
        {!isPermanent && (
          <p className="mt-3 text-[11px] text-amber-400/80 leading-relaxed">
            ⚠ Commuted Leave requires 3 completed years of continuous service for non-permanent employees.
          </p>
        )}
      </div>

      {/* ── Service Details ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Service Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className={labelCls}>Date of Joining</label>
            <input
              type="date"
              max={today}
              value={joiningDate}
              onChange={e => setJoiningDate(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">First day of continuous government service</p>
          </div>

          <div>
            <label className={labelCls}>HPL Already Taken (days)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 40"
              value={hplTaken}
              onChange={e => setHplTaken(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">Cumulative HPL used over your entire career</p>
          </div>

          <div>
            <label className={labelCls}>Commuted Leave Already Taken (days)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={commutedTaken}
              onChange={e => setCommutedTaken(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-white/45">Each day debits 2 days from HPL balance</p>
          </div>

          <div>
            <label className={labelCls}>CL Taken This Year (days)</label>
            <input
              type="number"
              min="0"
              max="20"
              placeholder="e.g. 5"
              value={clTaken}
              onChange={e => setClTaken(e.target.value)}
              className={inputCls}
            />
            {Number(clTaken) > 20 && (
              <p className="mt-1 text-[10px] text-amber-400/80">⚠ CL limit is 20 days per calendar year</p>
            )}
          </div>

          {/* LWA Exclusion */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/60 font-medium">
                LWA Periods to Exclude
                <span className="ml-1 text-white/35">(employment abroad / within country)</span>
              </label>
              <button
                onClick={addLwa}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
              >
                + Add Period
              </button>
            </div>

            {lwaRanges.length === 0 && (
              <p className="text-[11px] text-white/35 py-2">No LWA exclusion periods. Click &quot;+ Add Period&quot; if applicable.</p>
            )}

            <div className="space-y-2">
              {lwaRanges.map((r, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    {i === 0 && <span className="text-[10px] text-white/45 mb-1 block">From</span>}
                    <input
                      type="date"
                      max={today}
                      value={r.from}
                      onChange={e => updateLwa(i, 'from', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex-1">
                    {i === 0 && <span className="text-[10px] text-white/45 mb-1 block">To</span>}
                    <input
                      type="date"
                      max={today}
                      value={r.to}
                      onChange={e => updateLwa(i, 'to', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <button
                    onClick={() => removeLwa(i)}
                    className="mb-0.5 text-white/40 hover:text-red-400 transition-colors text-lg leading-none pb-2.5"
                    aria-label="Remove LWA period"
                  >×</button>
                </div>
              ))}
            </div>

            {lwaRanges.length > 0 && result && (
              <p className="mt-2 text-[11px] text-white/45">
                Total excluded: {result.excludedDays.toLocaleString('en-IN')} day{result.excludedDays !== 1 ? 's' : ''}
              </p>
            )}
            {result?.lwaBeforeJoining && (
              <p className="mt-1 text-[11px] text-amber-400/80">
                ⚠ One or more LWA periods start before your Date of Joining. Those dates have been clamped to your joining date.
              </p>
            )}
          </div>

          {/* Overflow warning */}
          {result?.showOverflow && (
            <div className="md:col-span-2 rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/25">
              <p className="text-xs text-amber-400 font-semibold">
                ⚠ The leave days you have entered exceed your total HPL earned ({result.totalHPLEarned} days). Please recheck your inputs.
              </p>
            </div>
          )}

          {!joiningDate && (
            <div className="md:col-span-2 text-center py-8 rounded-[16px] border border-dashed border-white/10">
              <p className="text-sm text-white/50">Enter your Date of Joining above to calculate HPL &amp; Commuted Leave</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="glass-card rounded-2xl p-6" style={{ borderColor: `${ACCENT}25`, borderWidth: 1 }}>
          <SectionHeader title="Results" />

          {/* Eligibility badge */}
          <div className="mb-4">
            <EligibilityBadge
              eligible={result.commutedEligible}
              reason={
                result.commutedEligible
                  ? 'Eligible for Commuted Leave'
                  : `Commuted Leave available after ${3 - result.completedYears} more year${3 - result.completedYears !== 1 ? 's' : ''} of service`
              }
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard
              label="Completed Years"
              value={result.completedYears}
              unit="years"
            />
            <StatCard
              label="Total HPL Earned"
              value={result.totalHPLEarned}
            />
            <StatCard
              label="HPL Balance"
              value={result.hplDue}
              accent
              bar
              barUsed={result.totalHPLEarned - result.hplDue}
              barTotal={result.totalHPLEarned}
            />
            <StatCard
              label="Max Commuted Leave"
              value={result.maxCommutedAvailable}
              accent={result.commutedEligible}
            />
            <StatCard
              label="CL Remaining"
              value={result.clRemaining}
              bar
              barUsed={20 - result.clRemaining}
              barTotal={20}
            />
          </div>

          <p className="mt-4 text-[11px] text-white/40 leading-relaxed">
            Note: Based on anniversary-based completed years of service. Actual entitlement is subject to audit and competent authority&apos;s sanction per KSR Part I.
          </p>
        </div>
      )}

      {/* ── Can I take X days? ── */}
      {result && (
        <div className="glass-card rounded-2xl p-6">
          <SectionHeader title="Can I Take X Days?" subtitle="Check leave eligibility instantly" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-1">
              <label className={labelCls}>Leave Type</label>
              <select
                value={checkType}
                onChange={e => { setCheckType(e.target.value); setCheckDays(''); }}
                className={inputCls}
              >
                <option value="HPL">Half-Pay Leave (HPL)</option>
                <option value="Commuted">Commuted Leave</option>
                <option value="CL">Casual Leave (CL)</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <label className={labelCls}>Number of Days</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 15"
                value={checkDays}
                onChange={e => setCheckDays(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {checkResult && (
            <div
              className={`rounded-xl px-4 py-3 border transition-all duration-300 ${
                checkResult.ok
                  ? 'bg-[#30d158]/10 border-[#30d158]/30'
                  : 'bg-red-500/10 border-red-500/25'
              }`}
            >
              <p className={`text-sm font-semibold ${checkResult.ok ? 'text-[#30d158]' : 'text-red-400'}`}>
                {checkResult.message}
              </p>
              {checkResult.advisory && (
                <p className="mt-2 text-[11px] text-white/50 leading-relaxed">{checkResult.advisory}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── KSR Reference Table ── */}
      <div className="glass-card rounded-2xl p-6">
        <h3
          className="text-base font-[900] text-white mb-4"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        >
          KSR HPL &amp; Commuted Leave Rules — Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2 pr-6">Rule</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-white/60 font-bold py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HPL earning rate',         '20 days per completed year of service'],
                ['LWA exclusion',            'LWA for employment abroad / within country excluded from completed years'],
                ['Commuted Leave max',       'Half of HPL due at the time of application'],
                ['HPL debit',                '2 days HPL debited per 1 day of Commuted Leave'],
                ['Commuted eligibility',     'Permanent: always. Non-permanent: after 3 years continuous service'],
                ['CL limit',                 '20 days per calendar year'],
                ['Combined limit (KSR 86)',  'Commuted Leave + Earned Leave + Vacation ≤ 240 days at a stretch'],
              ].map(([rule, detail]) => (
                <tr key={rule} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-2.5 pr-6 text-white/70 text-xs font-semibold">{rule}</td>
                  <td className="py-2.5 text-xs" style={{ color: ACCENT }}>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
