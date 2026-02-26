'use client';
import { useState, useEffect, useRef } from 'react';

const FITMENT_OPTIONS = [
  { label: 'Scenario A – 1.35×', factor: 1.35 },
  { label: 'Scenario B – 1.38×', factor: 1.38 },
  { label: 'Scenario C – 1.40×', factor: 1.40 },
];
const DA_MERGED = 31;

function r100(n) { return Math.round(n / 100) * 100; }
function rup(n)  { return Math.ceil(n); }
function fmt(n) {
  const abs = Math.abs(Math.round(n));
  const str = abs.toLocaleString('en-IN');
  return n < 0 ? `-₹${str}` : `₹${str}`;
}
function getMasterIncrement(basic) {
  if (basic < 17700)  return 300;
  if (basic < 19700)  return 400;
  if (basic < 22700)  return 500;
  if (basic < 26300)  return 600;
  if (basic < 33100)  return 700;
  if (basic < 41100)  return 800;
  if (basic < 50100)  return 900;
  if (basic < 61900)  return 1000;
  if (basic < 74900)  return 1100;
  if (basic < 91700)  return 1200;
  if (basic < 110500) return 1300;
  if (basic < 131500) return 1400;
  if (basic < 155500) return 1500;
  if (basic < 170500) return 1600;
  return 1700;
}
function calcCurrent(basicBase, incr, daP, hraR, sliOv, gpfOv, pensionType) {
  let basic = basicBase;
  for (let i = 0; i < incr; i++) basic += getMasterIncrement(basic);
  const da  = rup(basic * daP / 100);
  const hra = rup(basic * hraR);
  const gross = basic + da + hra;
  const sliMin = rup(basic * 0.015);
  const sli    = sliOv ? Math.max(sliOv, sliMin) : sliMin;
  const gis    = Math.max(800, rup(basic * 0.015));
  const medisep = 689;
  const gpf6 = rup(basic * 0.06);
  const gpf  = gpfOv ? Math.max(gpfOv, gpf6) : gpf6;
  const nps  = pensionType === 'NPS' ? rup((basic + da) * 0.10) : 0;
  const totalDed = sli + gis + medisep + gpf + nps;
  return { basic, da, hra, gross, sli, gis, medisep, gpf, nps, totalDed, net: gross - totalDed };
}
function calcRevised(basicBase, incr, revDAP, hraR, fitment, sliOv, gpfOv, pensionType) {
  const rbRaw = r100(basicBase * fitment);
  let rb = rbRaw;
  let tracker = basicBase;
  for (let i = 0; i < incr; i++) {
    rb += r100(getMasterIncrement(tracker) * fitment);
    tracker += getMasterIncrement(tracker);
    rb = r100(rb);
  }
  const da  = rup(rb * revDAP / 100);
  const hra = rup(rb * hraR);
  const gross = rb + da + hra;
  const sliMin = rup(rb * 0.015);
  const sli    = sliOv ? Math.max(sliOv, sliMin) : sliMin;
  const gis    = Math.max(800, rup(rb * 0.015));
  const medisep = 689;
  const newGpf6 = rup(rb * 0.06);
  const oldGpf6 = rup(basicBase * 0.06);
  let gpf;
  if (!gpfOv)               gpf = newGpf6;
  else if (gpfOv >= oldGpf6) gpf = Math.max(gpfOv, newGpf6);
  else                       gpf = newGpf6;
  const nps = pensionType === 'NPS' ? rup((rb + da) * 0.10) : 0;
  const totalDed = sli + gis + medisep + gpf + nps;
  return { basic: rb, basicBeforeIncr: rbRaw, da, hra, gross, sli, gis, medisep, gpf, nps, totalDed, net: gross - totalDed };
}

export default function PayCalculator() {
  const [basicPay, setBasicPay]       = useState('');
  const [daP, setDaP]                 = useState(35);
  const [hraR, setHraR]               = useState(0.10);
  const [sliOv, setSliOv]             = useState('');
  const [gpfOv, setGpfOv]             = useState('');
  const [pensionType, setPensionType] = useState('NPS');
  const [selectedIncr, setSelectedIncr]       = useState(0);
  const [selectedFitment, setSelectedFitment] = useState(1);
  const [result, setResult]           = useState(null);

  useEffect(() => {
    const base = parseFloat(basicPay) || 0;
    if (!base) { setResult(null); return; }
    const newDAP  = Math.max(0, daP - DA_MERGED);
    const fitment = FITMENT_OPTIONS[selectedFitment].factor;
    const cur = calcCurrent(base, selectedIncr, daP, hraR, parseFloat(sliOv)||0, parseFloat(gpfOv)||0, pensionType);
    const rev = calcRevised(base, selectedIncr, newDAP, hraR, fitment, parseFloat(sliOv)||0, parseFloat(gpfOv)||0, pensionType);
    setResult({ cur, rev, newDAP, fitment });
  }, [basicPay, daP, hraR, sliOv, gpfOv, pensionType, selectedIncr, selectedFitment]);

  const netHike   = result ? result.rev.net   - result.cur.net   : 0;
  const grossHike = result ? result.rev.gross - result.cur.gross : 0;

  const inputCls = "w-full px-3 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white font-semibold outline-none focus:border-[#2997ff] transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5";

  return (
    <section id="calculator" className="relative z-[1] py-24 px-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="text-xs font-bold uppercase tracking-widest text-[#ff9f0a] mb-2.5 font-sans">PAY REVISION</div>
      <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.15] mb-4">
        12th PRC<br />
        <span className="bg-gradient-to-r from-[#30d158] to-[#2997ff] bg-clip-text text-transparent">
          ശമ്പള കണക്കുകൂട്ടൽ
        </span>
      </h2>
      <p className="text-base text-[#86868b] leading-relaxed max-w-[640px] mb-10">
        കേരള 12th Pay Revision Commission — നിങ്ങളുടെ ഇപ്പോഴത്തെയും പരിഷ്കരിച്ചതുമായ ശമ്പളം ഒരിടത്ത് കണക്കാക്കൂ. (Unofficial Estimate)
      </p>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Card 1: Pay Details */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff] mb-4 pb-2 border-b border-white/[0.06]">
            💰 Pay Details (01.07.2024)
          </div>
          <label className={labelCls}>Basic Pay as on 01.07.2024 (₹)</label>
          <input type="number" value={basicPay} onChange={e => setBasicPay(e.target.value)}
            placeholder="e.g. 45600" className={inputCls} />
          <div className="text-[10px] text-[#6e6e73] mt-1 mb-4">ഇത് എല്ലാ കണക്കുകൂട്ടലുകളുടെയും അടിസ്ഥാനം</div>

          <label className={labelCls}>01.07.2024 ന് ശേഷം ലഭിച്ച Increments</label>
          <div className="flex gap-2 flex-wrap">
            {[0,1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setSelectedIncr(n)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  selectedIncr === n
                    ? 'bg-[#2997ff] text-white'
                    : 'bg-[#1c1c1e] border border-white/10 text-[#86868b] hover:border-white/20'
                }`}>{n}</button>
            ))}
          </div>
        </div>

        {/* Card 2: Allowances */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff] mb-4 pb-2 border-b border-white/[0.06]">
            📊 Allowance Rates
          </div>
          <label className={labelCls}>Current DA % — {daP}%</label>
          <input type="range" min="0" max="80" value={daP} onChange={e => setDaP(Number(e.target.value))}
            className="w-full accent-[#2997ff] cursor-pointer mb-1" />

          {/* DA Box */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#0a2240] rounded-xl border border-[#2997ff]/20">
            <div className="text-center">
              <div className="text-[9px] text-[#6e6e73] uppercase tracking-wider mb-1">DA Merged</div>
              <div className="text-base font-bold text-[#2997ff]">31%</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-[#6e6e73] uppercase tracking-wider mb-1">Current DA</div>
              <div className="text-base font-bold text-white">{daP}%</div>
            </div>
            <div className="text-center bg-[#2997ff]/10 rounded-lg p-1">
              <div className="text-[9px] text-[#2997ff] uppercase tracking-wider mb-1">New DA</div>
              <div className="text-base font-bold text-[#2997ff]">{Math.max(0, daP - DA_MERGED)}%</div>
            </div>
          </div>

          <label className={labelCls}>HRA Zone</label>
          <select value={hraR} onChange={e => setHraR(parseFloat(e.target.value))} className={inputCls}>
            <option value="0.10">Corporation / City (10%)</option>
            <option value="0.08">District HQ Municipality (8%)</option>
            <option value="0.06">Other Municipality (6%)</option>
            <option value="0.04">Panchayat Area (4%)</option>
          </select>
        </div>

        {/* Card 3: Deductions & Fitment */}
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff] mb-4 pb-2 border-b border-white/[0.06]">
            🔧 Deductions & Fitment
          </div>
          <label className={labelCls}>Pension Scheme</label>
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-4">
            {['NPS','OPS'].map(t => (
              <button key={t} onClick={() => setPensionType(t)}
                className={`flex-1 py-2 text-xs font-bold transition-all ${
                  pensionType === t ? 'bg-[#2997ff] text-white' : 'bg-[#1c1c1e] text-[#86868b]'
                }`}>
                {t === 'NPS' ? '🔵 NPS' : '📘 OPS'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>SLI (₹/mo)</label>
              <input type="number" value={sliOv} onChange={e => setSliOv(e.target.value)}
                placeholder="Auto 1.5%" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>GPF (₹/mo)</label>
              <input type="number" value={gpfOv} onChange={e => setGpfOv(e.target.value)}
                placeholder="Auto 6%" className={inputCls} />
            </div>
          </div>

          <label className={labelCls}>12th PRC Fitment Factor</label>
          <div className="grid grid-cols-3 gap-2">
            {FITMENT_OPTIONS.map((f, i) => (
              <button key={i} onClick={() => setSelectedFitment(i)}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  selectedFitment === i
                    ? 'bg-[#30d158] text-black'
                    : 'bg-[#1c1c1e] border border-white/10 text-[#86868b] hover:border-white/20'
                }`}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {!result ? (
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">👆</div>
          <div className="text-lg font-bold text-white mb-2">Basic Pay നൽകി തുടങ്ങൂ</div>
          <div className="text-sm text-[#6e6e73]">01.07.2024 ലെ Basic Pay നൽകിയാൽ കണക്ക് ഇവിടെ കാണാം</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Hero Banner */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #003d1a 0%, #005c28 50%, #007a38 100%)', boxShadow: '0 6px 32px rgba(0,80,40,.35)' }}>
            <div className="text-[10px] tracking-[3px] text-white/60 uppercase mb-4">
              💰 12th Pay Revision ശേഷം കൈയ്യിൽ കിട്ടുന്ന ശമ്പളം (Estimated)
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5 items-center">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-[10px] text-white/60 uppercase tracking-widest mb-2">ഇപ്പോൾ (11th PRC)</div>
                <div className="text-2xl md:text-3xl font-black text-[#aad4ff]">{fmt(result.cur.net)}</div>
                <div className="text-[10px] text-white/40 mt-1">per month in hand</div>
              </div>
              <div className="text-center text-white/30 text-2xl">→</div>
              <div className="bg-white/10 rounded-xl p-4 text-center border-2 border-[#30d158]/40">
                <div className="text-[10px] text-[#30d158]/80 uppercase tracking-widest mb-2">12th PRC ശേഷം</div>
                <div className="text-3xl md:text-4xl font-black text-[#80ffaa]">{fmt(result.rev.net)}</div>
                <div className="text-[10px] text-[#30d158]/60 mt-1">per month in hand</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-[#ffe566]/10 border border-[#ffe566]/30 rounded-xl p-4">
              <div className="text-center">
                <div className="text-[9px] text-[#ffe566]/70 uppercase tracking-wider mb-1">Monthly Extra</div>
                <div className="text-xl font-black text-[#ffe566]">{fmt(netHike)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-[#ffe566]/70 uppercase tracking-wider mb-1">Annual Extra</div>
                <div className="text-xl font-black text-[#ffe566]">{fmt(netHike * 12)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-[#ffe566]/70 uppercase tracking-wider mb-1">Fitment</div>
                <div className="text-xl font-black text-[#ffe566]">{result.fitment}×</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '📘 Current Pay (11th PRC)', data: result.cur, color: '#2997ff', basic: `Basic: ${fmt(result.cur.basic)} | DA: ${daP}%` },
              { label: '🟢 Estimated (12th PRC)',   data: result.rev, color: '#30d158', basic: `Revised Basic: ${fmt(result.rev.basicBeforeIncr)} | DA: ${result.newDAP}%` },
            ].map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/[0.08] rounded-2xl p-4"
                style={{ borderColor: i === 1 ? 'rgba(48,209,88,0.3)' : undefined }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.color }}>{s.label}</div>
                <div className="text-[10px] text-[#6e6e73] mb-3">{s.basic}</div>
                <div className="space-y-2">
                  {[['Gross', s.data.gross], ['Deductions', -s.data.totalDed], ['In Hand', s.data.net]].map(([l, v]) => (
                    <div key={l} className={`flex justify-between text-sm ${l === 'In Hand' ? 'font-black pt-2 border-t border-white/[0.06]' : ''}`}>
                      <span className="text-[#86868b]">{l}</span>
                      <span style={{ color: l === 'Deductions' ? '#ff453a' : l === 'In Hand' ? s.color : 'white' }}>
                        {l === 'Deductions' ? `-${fmt(s.data.totalDed)}` : fmt(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5 overflow-x-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff] mb-4">📋 Detailed Pay Comparison</div>
            <table className="w-full text-xs min-w-[540px]">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-2 text-[#6e6e73] font-bold w-[40%]">Component</th>
                  <th className="text-right py-2 text-[#2997ff] font-bold">Current</th>
                  <th className="text-right py-2 text-[#30d158] font-bold">Revised</th>
                  <th className="text-right py-2 text-[#ff9f0a] font-bold">Diff</th>
                </tr>
              </thead>
              <tbody>
                {/* Earnings */}
                <tr><td colSpan={4} className="py-2 text-[10px] font-bold uppercase tracking-widest text-[#ff9f0a]">▶ Earnings</td></tr>
                {[
                  ['Basic Pay', result.cur.basic, result.rev.basic],
                  ['DA', result.cur.da, result.rev.da],
                  ['HRA', result.cur.hra, result.rev.hra],
                ].map(([l, c, r]) => (
                  <tr key={l} className="border-b border-white/[0.04]">
                    <td className="py-2 pl-3 text-[#86868b]">{l}</td>
                    <td className="py-2 text-right text-white">{fmt(c)}</td>
                    <td className="py-2 text-right text-[#30d158]">{fmt(r)}</td>
                    <td className="py-2 text-right" style={{ color: r-c >= 0 ? '#30d158' : '#ff453a' }}>
                      {r-c >= 0 ? '+' : ''}{fmt(r-c)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#2997ff]/5 border-b border-white/10">
                  <td className="py-2 pl-3 font-bold text-white">GROSS</td>
                  <td className="py-2 text-right font-bold text-white">{fmt(result.cur.gross)}</td>
                  <td className="py-2 text-right font-bold text-[#30d158]">{fmt(result.rev.gross)}</td>
                  <td className="py-2 text-right font-bold text-[#ff9f0a]">+{fmt(grossHike)}</td>
                </tr>

                {/* Deductions */}
                <tr><td colSpan={4} className="py-2 text-[10px] font-bold uppercase tracking-widest text-[#ff453a]">▶ Deductions</td></tr>
                {[
                  ['SLI (1.5%)', result.cur.sli, result.rev.sli],
                  ['GIS (1.5%, min ₹800)', result.cur.gis, result.rev.gis],
                  ['MEDISEP (Fixed)', result.cur.medisep, result.rev.medisep],
                  ['GPF (min 6%)', result.cur.gpf, result.rev.gpf],
                  ...(pensionType === 'NPS' ? [['NPS (10% of Basic+DA)', result.cur.nps, result.rev.nps]] : []),
                ].map(([l, c, r]) => (
                  <tr key={l} className="border-b border-white/[0.04]">
                    <td className="py-2 pl-3 text-[#86868b]">{l}</td>
                    <td className="py-2 text-right text-[#ff453a]">-{fmt(c)}</td>
                    <td className="py-2 text-right text-[#ff453a]">-{fmt(r)}</td>
                    <td className="py-2 text-right text-[#ff453a]">-{fmt(r-c)}</td>
                  </tr>
                ))}
                <tr className="bg-[#ff453a]/5 border-b border-white/10">
                  <td className="py-2 pl-3 font-bold text-white">TOTAL DEDUCTIONS</td>
                  <td className="py-2 text-right font-bold text-[#ff453a]">-{fmt(result.cur.totalDed)}</td>
                  <td className="py-2 text-right font-bold text-[#ff453a]">-{fmt(result.rev.totalDed)}</td>
                  <td className="py-2 text-right font-bold text-[#ff453a]">-{fmt(result.rev.totalDed - result.cur.totalDed)}</td>
                </tr>

                {/* Net */}
                <tr className="bg-[#30d158]/10">
                  <td className="py-3 pl-3 font-black text-white text-sm">🟢 NET PAY (In-hand)</td>
                  <td className="py-3 text-right font-black text-[#2997ff] text-sm">{fmt(result.cur.net)}</td>
                  <td className="py-3 text-right font-black text-[#30d158] text-sm">{fmt(result.rev.net)}</td>
                  <td className="py-3 text-right font-black text-[#30d158] text-sm">+{fmt(netHike)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fitment Scenarios */}
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#2997ff] mb-4">📈 All Fitment Scenarios</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {FITMENT_OPTIONS.map((f, i) => {
                const newDAP = Math.max(0, daP - DA_MERGED);
                const r = calcRevised(parseFloat(basicPay)||0, selectedIncr, newDAP, hraR, f.factor,
                  parseFloat(sliOv)||0, parseFloat(gpfOv)||0, pensionType);
                const hike = r.net - result.cur.net;
                const isActive = i === selectedFitment;
                return (
                  <button key={i} onClick={() => setSelectedFitment(i)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isActive ? 'border-[#30d158] bg-[#30d158]/10' : 'border-white/[0.08] bg-[#1c1c1e] hover:border-white/20'
                    }`}>
                    <div className={`text-xs font-bold mb-2 ${isActive ? 'text-[#30d158]' : 'text-[#86868b]'}`}>{f.label}</div>
                    <div className="text-[10px] text-[#6e6e73] mb-2">Revised Basic: {fmt(r.basicBeforeIncr)}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {[['Net', r.net, '#30d158'], ['Hike', hike, '#ff9f0a']].map(([l,v,c]) => (
                        <div key={l} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-[#6e6e73] mb-0.5">{l}</div>
                          <div className="text-xs font-bold" style={{ color: c }}>{l==='Hike'?'+':''}{fmt(v)}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#ff9f0a]/5 border border-[#ff9f0a]/20 rounded-2xl p-4 text-xs text-[#86868b]">
            ⚠️ <strong className="text-[#ff9f0a]">Unofficial Estimate:</strong> എല്ലാ 12th PRC കണക്കുകളും ഒരു estimate മാത്രം. ഔദ്യോഗിക pay scales Finance Department, Kerala യുടെ G.O. വഴി മാത്രം confirm ആകും. MEDISEP = ₹689 fixed | GIS = max(₹800, 1.5% of Basic) | Rounding: Basic/Increments → nearest ₹100; DA/HRA/SLI/NPS → ceiling.
          </div>
        </div>
      )}
    </section>
  );
}
