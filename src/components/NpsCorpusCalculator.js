'use client';
import { useState, useMemo } from 'react';

const PURPLE = '#bf5af2';

function fmtINR(n) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/* Number input + slider combo */
function NumberSliderRow({ label, sublabel, value, min, max, step, onChange, prefix = '', suffix = '' }) {
  const [raw, setRaw] = useState('');
  const [editing, setEditing] = useState(false);

  function handleBlur() {
    setEditing(false);
    const parsed = Number(String(raw).replace(/,/g, ''));
    if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
    setRaw('');
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-sm font-semibold text-white/90">{label}</span>
          {sublabel && <div className="text-[10px] text-white/40 mt-0.5">{sublabel}</div>}
        </div>
        {/* Editable number chip */}
        <div className="flex items-center rounded-lg px-2.5 py-1 flex-shrink-0"
          style={{ background: 'rgba(191,90,242,0.10)', border: '1px solid rgba(191,90,242,0.25)' }}>
          {prefix && <span className="text-xs text-white/50 mr-1">{prefix}</span>}
          <input
            type="text"
            inputMode="numeric"
            value={editing ? raw : (suffix ? `${value}` : value.toLocaleString('en-IN'))}
            onFocus={() => { setEditing(true); setRaw(String(value)); }}
            onChange={e => setRaw(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            className="bg-transparent outline-none text-sm font-black tabular-nums text-right"
            style={{ color: PURPLE, width: `${Math.max(String(value).length, 4) + 1}ch` }}
          />
          {suffix && <span className="text-xs text-white/50 ml-1">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={Math.min(value, max)}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: PURPLE }}
      />
      <div className="flex justify-between text-[10px] text-white/25">
        <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
      </div>
    </div>
  );
}

/* Slider-only row for percentages */
function SliderRow({ label, sublabel, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-white/90">{label}</span>
          {sublabel && <div className="text-[10px] text-white/40 mt-0.5">{sublabel}</div>}
        </div>
        <span className="text-sm font-black tabular-nums" style={{ color: PURPLE }}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: PURPLE }}
      />
      <div className="flex justify-between text-[10px] text-white/25">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

function ageFromDob(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function NpsCorpusCalculator() {
  const [basicPay,       setBasicPay]       = useState(25000);
  const [existingCorpus, setExistingCorpus] = useState(0);
  const [daPercent,      setDaPercent]      = useState(35);
  const [dob,            setDob]            = useState('');
  const [currentAge,     setCurrentAge]     = useState(30);
  const [retirementAge,  setRetirementAge]  = useState(60);
  const [stepUp,         setStepUp]         = useState(5);
  const [roi,            setRoi]            = useState(10);
  const [annuityRatio,   setAnnuityRatio]   = useState(40);
  const [annuityRate,    setAnnuityRate]    = useState(6);

  const result = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 1);
    const N = years * 12;
    const monthlyContrib = basicPay * (1 + daPercent / 100) * 0.20;
    const r = roi / 100 / 12;

    // FV of existing corpus
    const fvExisting = existingCorpus * Math.pow(1 + r, N);

    // FV of contributions with annual step-up
    let fvContrib = 0;
    let totalInvested = 0;
    for (let y = 0; y < years; y++) {
      const c = monthlyContrib * Math.pow(1 + stepUp / 100, y);
      totalInvested += c * 12;
      if (r === 0) {
        fvContrib += c * 12;
      } else {
        fvContrib += c * ((Math.pow(1 + r, 12) - 1) / r) * Math.pow(1 + r, (years - y - 1) * 12);
      }
    }

    const totalCorpus    = fvExisting + fvContrib;
    const annuityCorpus  = totalCorpus * annuityRatio / 100;
    const lumpSum        = totalCorpus - annuityCorpus;
    const monthlyPension = annuityCorpus * annuityRate / 100 / 12;
    const totalGains     = totalCorpus - totalInvested - existingCorpus;

    return { monthlyContrib, totalInvested, totalCorpus, annuityCorpus, lumpSum, monthlyPension, totalGains, years };
  }, [basicPay, existingCorpus, daPercent, currentAge, retirementAge, stepUp, roi, annuityRatio, annuityRate]);

  const gainPct = result.totalInvested > 0
    ? ((result.totalGains / result.totalInvested) * 100).toFixed(0)
    : 0;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Inputs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl"
        style={{ background: 'rgba(191,90,242,0.04)', border: '1px solid rgba(191,90,242,0.14)' }}>

        <NumberSliderRow
          label="Current Basic Pay"
          value={basicPay} min={10000} max={200000} step={1000}
          onChange={setBasicPay} prefix="₹"
        />
        <NumberSliderRow
          label="Current DA"
          value={daPercent} min={0} max={60} step={1}
          onChange={setDaPercent} suffix="%"
        />

        {/* Existing corpus — full width */}
        <div className="md:col-span-2">
          <NumberSliderRow
            label="Existing NPS Corpus"
            sublabel="Current balance in your PRAN account (enter 0 if new)"
            value={existingCorpus} min={0} max={5000000} step={10000}
            onChange={setExistingCorpus} prefix="₹"
          />
        </div>

        {/* Auto-calculated monthly contribution */}
        <div className="md:col-span-2 flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: 'rgba(191,90,242,0.08)', border: '1px solid rgba(191,90,242,0.2)' }}>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-white/50 mb-0.5">
              Total Monthly Contribution
            </div>
            <div className="text-[10px] text-white/40">10% Employee + 10% Government (of Basic + DA)</div>
          </div>
          <div className="text-xl font-black" style={{ color: PURPLE }}>
            {fmtINR(result.monthlyContrib)}/mo
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-white/90">Date of Birth</span>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dob}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              onChange={e => {
                setDob(e.target.value);
                const age = ageFromDob(e.target.value);
                if (age !== null && age >= 18 && age <= 55) {
                  setCurrentAge(age);
                  if (age >= retirementAge) setRetirementAge(Math.min(age + 1, 60));
                }
              }}
              className="flex-1 rounded-xl px-3 py-2.5 text-sm text-white bg-transparent outline-none"
              style={{ border: '1px solid rgba(191,90,242,0.25)', background: 'rgba(191,90,242,0.05)', colorScheme: 'dark' }}
            />
            {dob && (
              <span className="text-sm font-black flex-shrink-0" style={{ color: PURPLE }}>
                {currentAge} yrs
              </span>
            )}
          </div>
          {!dob && (
            <p className="text-[10px] text-white/35">Or use the age slider below</p>
          )}
        </div>

        <NumberSliderRow
          label="Current Age"
          sublabel={dob ? 'Auto-calculated from DOB' : ''}
          value={currentAge} min={18} max={55} step={1}
          onChange={v => { setCurrentAge(v); setDob(''); if (v >= retirementAge) setRetirementAge(Math.min(v + 1, 60)); }}
          suffix=" yrs"
        />
        <NumberSliderRow
          label="Retirement Age"
          value={retirementAge} min={Math.max(currentAge + 1, 45)} max={60} step={1}
          onChange={setRetirementAge} suffix=" yrs"
        />

        <SliderRow
          label="Annual Contribution Step-up"
          sublabel="due to increments / DA hikes"
          value={stepUp} min={0} max={20} step={1}
          onChange={setStepUp} suffix="%"
        />
        <SliderRow
          label="Expected ROI"
          sublabel="historical NPS avg ~10-12%"
          value={roi} min={5} max={15} step={0.5}
          onChange={setRoi} suffix="%"
        />

        <SliderRow
          label="Annuity %"
          sublabel="min 40% as per NPS rules"
          value={annuityRatio} min={40} max={100} step={5}
          onChange={setAnnuityRatio} suffix="%"
        />
        <SliderRow
          label="Expected Annuity Rate"
          sublabel="from insurance company"
          value={annuityRate} min={4} max={10} step={0.5}
          onChange={setAnnuityRate} suffix="%"
        />
      </div>

      {/* ── Results ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 p-6 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(191,90,242,0.15), rgba(191,90,242,0.05))', border: '1px solid rgba(191,90,242,0.3)' }}>
          <div className="text-xs font-black uppercase tracking-widest text-white/50 mb-1">
            Total NPS Corpus at Retirement
          </div>
          <div className="text-[clamp(32px,6vw,52px)] font-black" style={{ color: PURPLE }}>
            {fmtINR(result.totalCorpus)}
          </div>
          <div className="text-xs text-white/45 mt-1">
            After {result.years} years · Invested: {fmtINR(result.totalInvested)} · Gains: {fmtINR(result.totalGains)} ({gainPct}%)
          </div>
        </div>

        <ResultCard icon="💰" label="Lump Sum Withdrawal"
          sublabel={`${100 - annuityRatio}% of corpus — tax-free`}
          value={fmtINR(result.lumpSum)} />
        <ResultCard icon="📈" label="Annuity Corpus"
          sublabel={`${annuityRatio}% used to buy pension`}
          value={fmtINR(result.annuityCorpus)} />
        <ResultCard icon="🏦" label="Estimated Monthly Pension"
          sublabel={`At ${annuityRate}% annuity rate`}
          value={fmtINR(result.monthlyPension)} highlight />
        <ResultCard icon="📅" label="Contribution Period"
          sublabel="Years of NPS contributions"
          value={`${result.years} years`} />
      </div>

      {/* ── Disclaimer ── */}
      <div className="p-5 rounded-2xl text-xs text-white/45 leading-relaxed"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-bold text-white/60 mb-1.5">⚠ Disclaimer</p>
        <p>
          This calculator is meant for <strong className="text-white/60">information and illustration purposes only</strong> and
          does not constitute any financial advice, opinion, or guarantee of returns. The projected corpus and pension
          amounts are estimates based on the inputs provided and assumed rates of return. Actual returns under NPS
          depend on market conditions, fund performance, and annuity rates prevailing at retirement.
        </p>
        <p className="mt-2">
          NPS investments are subject to market risk. Past performance of NPS funds does not guarantee future returns.
          The minimum annuity purchase is <strong className="text-white/60">40% of the corpus</strong> as mandated by PFRDA regulations.
          Please consult a qualified financial adviser before making investment decisions.
        </p>
        <p className="mt-2 text-white/30">
          Source: NPS Trust (npstrust.org.in) · PFRDA guidelines · Kerala Finance Department circulars
        </p>
      </div>

    </div>
  );
}

function ResultCard({ icon, label, sublabel, value, highlight }) {
  return (
    <div className="p-5 rounded-2xl"
      style={{
        background: highlight ? 'rgba(191,90,242,0.08)' : 'rgba(255,255,255,0.04)',
        border: highlight ? '1px solid rgba(191,90,242,0.25)' : '1px solid rgba(255,255,255,0.08)',
      }}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs text-white/50 mb-0.5">{label}</div>
      <div className="text-xs text-white/35 mb-2">{sublabel}</div>
      <div className="text-xl font-black" style={{ color: highlight ? PURPLE : 'rgba(255,255,255,0.9)' }}>
        {value}
      </div>
    </div>
  );
}
