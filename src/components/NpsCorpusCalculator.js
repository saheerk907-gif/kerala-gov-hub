'use client';
import { useState, useMemo } from 'react';

const PURPLE = '#bf5af2';

function fmtINR(n) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function SliderRow({ label, sublabel, value, min, max, step, onChange, display }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-white/90">{label}</span>
          {sublabel && <span className="text-xs text-white/45 ml-2">{sublabel}</span>}
        </div>
        <span className="text-sm font-black tabular-nums" style={{ color: PURPLE }}>
          {display ?? value}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: PURPLE }}
      />
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{display ? display.replace(/[\d,.]+/, min) : min}</span>
        <span>{display ? display.replace(/[\d,.]+/, max) : max}</span>
      </div>
    </div>
  );
}

export default function NpsCorpusCalculator() {
  const [basicPay,      setBasicPay]      = useState(25000);
  const [daPercent,     setDaPercent]     = useState(35);
  const [currentAge,    setCurrentAge]    = useState(30);
  const [retirementAge, setRetirementAge] = useState(56);
  const [stepUp,        setStepUp]        = useState(5);
  const [roi,           setRoi]           = useState(10);
  const [annuityRatio,  setAnnuityRatio]  = useState(40);
  const [annuityRate,   setAnnuityRate]   = useState(6);

  const result = useMemo(() => {
    const years = Math.max(retirementAge - currentAge, 1);
    const monthlyContrib = basicPay * (1 + daPercent / 100) * 0.20; // 10% emp + 10% govt
    const r = roi / 100 / 12; // monthly rate

    // FV of contributions with annual step-up
    let fvContrib = 0;
    let totalInvested = 0;
    for (let y = 0; y < years; y++) {
      const c = monthlyContrib * Math.pow(1 + stepUp / 100, y);
      totalInvested += c * 12;
      if (r === 0) {
        fvContrib += c * 12;
      } else {
        // FV of 12 equal end-of-month payments, then grown for remaining (years-y-1) years
        fvContrib += c * ((Math.pow(1 + r, 12) - 1) / r) * Math.pow(1 + r, (years - y - 1) * 12);
      }
    }

    const totalCorpus   = fvContrib;
    const annuityCorpus = totalCorpus * annuityRatio / 100;
    const lumpSum       = totalCorpus - annuityCorpus;
    const monthlyPension = annuityCorpus * annuityRate / 100 / 12;
    const totalGains    = totalCorpus - totalInvested;

    return { monthlyContrib, totalInvested, totalCorpus, annuityCorpus, lumpSum, monthlyPension, totalGains, years };
  }, [basicPay, daPercent, currentAge, retirementAge, stepUp, roi, annuityRatio, annuityRate]);

  const gainPct = result.totalInvested > 0
    ? ((result.totalGains / result.totalInvested) * 100).toFixed(0)
    : 0;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Inputs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl"
        style={{ background: 'rgba(191,90,242,0.04)', border: '1px solid rgba(191,90,242,0.14)' }}>

        <SliderRow
          label="Current Basic Pay"
          value={basicPay} min={10000} max={150000} step={1000}
          onChange={setBasicPay}
          display={`₹${basicPay.toLocaleString('en-IN')}`}
        />
        <SliderRow
          label="Current DA"
          value={daPercent} min={0} max={60} step={1}
          onChange={setDaPercent}
          display={`${daPercent}%`}
        />

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

        <SliderRow
          label="Current Age"
          value={currentAge} min={18} max={55} step={1}
          onChange={v => { setCurrentAge(v); if (v >= retirementAge) setRetirementAge(v + 1); }}
          display={`${currentAge} yrs`}
        />
        <SliderRow
          label="Retirement Age"
          value={retirementAge} min={Math.max(currentAge + 1, 45)} max={60} step={1}
          onChange={setRetirementAge}
          display={`${retirementAge} yrs`}
        />

        <SliderRow
          label="Annual Contribution Step-up"
          sublabel="due to increments / DA hikes"
          value={stepUp} min={0} max={20} step={1}
          onChange={setStepUp}
          display={`${stepUp}%`}
        />
        <SliderRow
          label="Expected ROI"
          sublabel="historical NPS avg ~10-12%"
          value={roi} min={5} max={15} step={0.5}
          onChange={setRoi}
          display={`${roi}%`}
        />

        <SliderRow
          label="Annuity %"
          sublabel="min 40% as per NPS rules"
          value={annuityRatio} min={40} max={100} step={5}
          onChange={setAnnuityRatio}
          display={`${annuityRatio}%`}
        />
        <SliderRow
          label="Expected Annuity Rate"
          sublabel="from insurance company"
          value={annuityRate} min={4} max={10} step={0.5}
          onChange={setAnnuityRate}
          display={`${annuityRate}%`}
        />
      </div>

      {/* ── Results ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Corpus — hero card */}
        <div className="sm:col-span-2 p-6 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(191,90,242,0.15), rgba(191,90,242,0.05))', border: '1px solid rgba(191,90,242,0.3)' }}>
          <div className="text-xs font-black uppercase tracking-widest text-white/50 mb-1">
            Total NPS Corpus at Retirement
          </div>
          <div className="text-[clamp(32px,6vw,52px)] font-black" style={{ color: PURPLE }}>
            {fmtINR(result.totalCorpus)}
          </div>
          <div className="text-xs text-white/45 mt-1">
            After {result.years} years · Total Invested: {fmtINR(result.totalInvested)} · Gains: {fmtINR(result.totalGains)} ({gainPct}%)
          </div>
        </div>

        <ResultCard
          icon="💰"
          label="Lump Sum Withdrawal"
          sublabel={`${100 - annuityRatio}% of corpus — tax-free`}
          value={fmtINR(result.lumpSum)}
        />
        <ResultCard
          icon="📈"
          label="Annuity Corpus"
          sublabel={`${annuityRatio}% used to buy pension`}
          value={fmtINR(result.annuityCorpus)}
        />
        <ResultCard
          icon="🏦"
          label="Estimated Monthly Pension"
          sublabel={`At ${annuityRate}% annuity rate`}
          value={fmtINR(result.monthlyPension)}
          highlight
        />
        <ResultCard
          icon="📅"
          label="Contribution Period"
          sublabel="Years of service under NPS"
          value={`${result.years} years`}
        />
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
