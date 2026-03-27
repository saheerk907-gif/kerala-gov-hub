'use client';
import { useState, useEffect, useRef } from 'react';
import SectionHeader from '@/components/SectionHeader';
import AnimatedNumber from '@/components/AnimatedNumber';

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
  else                        gpf = newGpf6;
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

  const [animKey, setAnimKey] = useState(0);
  const prevResultNull = useRef(true);
  useEffect(() => {
    const wasNull = prevResultNull.current;
    prevResultNull.current = result === null;
    if (wasNull && result !== null) setAnimKey(k => k + 1);
  }, [result]);

  const netHike   = result ? result.rev.net   - result.cur.net   : 0;
  const grossHike = result ? result.rev.gross - result.cur.gross : 0;

  const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';
  const labelCls = 'text-xs text-white/60 font-medium mb-2 block';

  return (
    <section id="calculator" className="space-y-6">

      {/* ── Header card ── */}
      <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.25)' }}>💰</div>
          <div>
            <h2 className="text-lg font-[900] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>Pay Revision Calculator</h2>
            <p className="text-xs text-white/60">12th PRC — Pay Fixation</p>
          </div>
        </div>
      </div>

      {/* ── Current Pay Details ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Current Pay Details" subtitle="01.07.2024 Basic Pay (11th PRC)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelCls}>Basic Pay (₹)</label>
            <input type="number" value={basicPay} onChange={e => setBasicPay(e.target.value)}
              placeholder="e.g. 45600" className={inputCls} />
            <div className="text-[10px] text-white/55 mt-1">അടിസ്ഥാന ശമ്പളം നൽകുക</div>
          </div>

          <div>
            <label className={labelCls}>Increments After 01.07.2024</label>
            <div className="flex gap-2 flex-wrap">
              {[0,1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setSelectedIncr(n)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${
                    selectedIncr === n
                      ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.06]'
                  }`}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Current DA % — {daP}%</label>
            <input type="range" min="0" max="80" value={daP} onChange={e => setDaP(Number(e.target.value))}
              className="w-full cursor-pointer mb-2" style={{ accentColor: '#ff9f0a' }} />
            <div className="grid grid-cols-3 gap-2 p-3 bg-white/[0.04] rounded-xl border border-white/[0.08]">
              <div className="text-center">
                <div className="text-[9px] text-white/55 uppercase mb-1">Merged</div>
                <div className="text-base font-bold text-white/90">31%</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-white/55 uppercase mb-1">Now</div>
                <div className="text-base font-bold text-white/90">{daP}%</div>
              </div>
              <div className="text-center rounded-lg p-1" style={{ background: 'rgba(255,159,10,0.10)' }}>
                <div className="text-[9px] text-[#ff9f0a] uppercase mb-1">New</div>
                <div className="text-base font-bold text-[#ff9f0a]">{Math.max(0, daP - DA_MERGED)}%</div>
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>HRA Zone</label>
            <select value={hraR} onChange={e => setHraR(parseFloat(e.target.value))} className={inputCls}>
              <option value="0.10">Corporation / City (10%)</option>
              <option value="0.08">District HQ (8%)</option>
              <option value="0.06">Other Municipality (6%)</option>
              <option value="0.04">Panchayat Area (4%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Fitment Options ── */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Fitment Options" subtitle="Deductions & fitment factor" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className={labelCls}>Pension Scheme</label>
            <div className="flex rounded-xl overflow-hidden border border-white/[0.08]">
              {['NPS','OPS'].map(t => (
                <button key={t} onClick={() => setPensionType(t)}
                  className={`flex-1 py-2 text-xs font-bold transition-all ${
                    pensionType === t
                      ? 'bg-[#ff9f0a] text-white'
                      : 'bg-white/[0.04] text-white/55'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Fitment Factor</label>
            <div className="grid grid-cols-3 gap-2">
              {FITMENT_OPTIONS.map((f, i) => (
                <button key={i} onClick={() => setSelectedFitment(i)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                    selectedFitment === i
                      ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/55 hover:border-white/20'
                  }`}>{f.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>SLI (₹/mo)</label>
            <input type="number" value={sliOv} onChange={e => setSliOv(e.target.value)}
              placeholder="1.5%" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>GPF (₹/mo)</label>
            <input type="number" value={gpfOv} onChange={e => setGpfOv(e.target.value)}
              placeholder="6%" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      {!result ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">👆</div>
          <div className="text-lg font-bold text-white/90 mb-2">Basic Pay നൽകി തുടങ്ങൂ</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
            <SectionHeader title="Results" />

            {/* Take-home comparison banner */}
            <div className="rounded-2xl p-6 relative overflow-hidden text-white mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(255,159,10,0.25) 0%, rgba(200,120,0,0.25) 100%)', border: '1px solid rgba(255,159,10,0.35)', boxShadow: '0 10px 30px rgba(255,159,10,0.1)' }}>
              <div className="text-[10px] tracking-[3px] text-white/70 uppercase mb-4 font-bold text-center">
                ESTIMATED MONTHLY TAKE-HOME PAY
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 mb-5 items-center">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-[9px] text-white/60 uppercase mb-1 sm:mb-2">ഇപ്പോൾ</div>
                  <div className="text-xl sm:text-2xl font-black"><AnimatedNumber value={result.cur.net} animKey={animKey} /></div>
                </div>
                <div className="text-center text-white/60 text-xl px-1">→</div>
                <div className="bg-white/20 rounded-xl p-3 sm:p-4 text-center border border-white/30 backdrop-blur-sm">
                  <div className="text-[9px] text-[#ff9f0a] uppercase mb-1 sm:mb-2 font-bold">പുതിയ ശമ്പളം</div>
                  <div className="text-2xl sm:text-3xl font-black text-white"><AnimatedNumber value={result.rev.net} animKey={animKey} /></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-black/10 rounded-xl p-3 sm:p-4 text-center">
                <div>
                  <div className="text-[9px] text-white/60 uppercase mb-1">Net Hike</div>
                  <div className="text-xl font-black text-[#30d158]"><AnimatedNumber value={netHike} animKey={animKey} /></div>
                </div>
                <div>
                  <div className="text-[9px] text-white/60 uppercase mb-1">Annual Gain</div>
                  <div className="text-xl font-black text-[#30d158]"><AnimatedNumber value={netHike * 12} animKey={animKey} /></div>
                </div>
                <div>
                  <div className="text-[9px] text-white/60 uppercase mb-1">Fitment</div>
                  <div className="text-xl font-black text-white">{result.fitment}×</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: '📘 Current (11th PRC)', data: result.cur, color: 'var(--accent-blue)' },
                { label: '🟢 Revised (12th PRC)', data: result.rev, color: 'var(--accent-green)' },
              ].map((s, i) => (
                <div key={i} className="glass-card rounded-2xl p-5">
                  <div className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: s.color }}>{s.label}</div>
                  <div className="space-y-3">
                    {[['Gross', s.data.gross], ['Deductions', -s.data.totalDed], ['Net Pay', s.data.net]].map(([l, v]) => (
                      <div key={l} className={`flex justify-between text-sm ${l === 'Net Pay' ? 'font-black pt-3 border-t border-white/[0.08]' : ''}`}>
                        <span className="text-white/60">{l}</span>
                        <span className={l === 'Deductions' ? 'text-[#ff453a]' : 'text-white/90'}><AnimatedNumber value={v} animKey={animKey} /></span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-5 overflow-x-auto mt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff9f0a] mb-4">📋 Detailed Comparison</div>
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/[0.08] text-white/55">
                    <th className="text-left py-2">Component</th>
                    <th className="text-right py-2">Current</th>
                    <th className="text-right py-2 text-[#30d158]">Revised</th>
                    <th className="text-right py-2">Difference</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  {[
                    ['Basic Pay', result.cur.basic, result.rev.basic],
                    ['DA', result.cur.da, result.rev.da],
                    ['HRA', result.cur.hra, result.rev.hra],
                    ['GROSS PAY', result.cur.gross, result.rev.gross, true],
                    ['SLI', -result.cur.sli, -result.rev.sli],
                    ['Total Deductions', -result.cur.totalDed, -result.rev.totalDed, true],
                    ['NET PAY', result.cur.net, result.rev.net, true]
                  ].map(([l, c, r, bold]) => (
                    <tr key={l} className={`border-b border-white/[0.08]/50 ${bold ? 'font-bold bg-white/[0.06]/30' : ''}`}>
                      <td className="py-2.5 text-white/60">{l}</td>
                      <td className="py-2.5 text-right"><AnimatedNumber value={c} animKey={animKey} /></td>
                      <td className="py-2.5 text-right text-[#30d158]"><AnimatedNumber value={r} animKey={animKey} /></td>
                      <td className="py-2.5 text-right font-bold"><AnimatedNumber value={r-c} animKey={animKey} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl p-4 mt-4 text-[11px] text-white/50 leading-relaxed" style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.18)' }}>
              ⚠️ <strong>Disclaimer:</strong> This is an unofficial estimate. Final values depend on official Government Orders (G.O.).
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
