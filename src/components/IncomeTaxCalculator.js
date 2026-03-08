'use client';
import { useState, useMemo } from 'react';

// ─── Formatters ───────────────────────────────────────────────────────────────
const n = (v) => Number(v) || 0;
const fmt = (v) => Math.round(Math.abs(v)).toLocaleString('en-IN');
const fmtR = (v) => `₹${fmt(v)}`;
const fmtPrint = (v) => Math.round(Math.abs(v)).toLocaleString('en-IN');
const nilOrAmt = (v) => (Math.round(Math.abs(v)) === 0 ? 'NIL' : fmtPrint(v));
const clamp = (v, max) => Math.min(Math.max(0, n(v)), max);

// ─── Month arrays ──────────────────────────────────────────────────────────────
const MONTH_NAMES = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const MONTH_NAMES_FY = ['April 2025', 'May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026'];

// ─── Tax Slabs ────────────────────────────────────────────────────────────────
const NEW_SLABS = [
  { min: 0,         max: 400_000,   rate: 0  },
  { min: 400_000,   max: 800_000,   rate: 5  },
  { min: 800_000,   max: 1_200_000, rate: 10 },
  { min: 1_200_000, max: 1_600_000, rate: 15 },
  { min: 1_600_000, max: 2_000_000, rate: 20 },
  { min: 2_000_000, max: 2_400_000, rate: 25 },
  { min: 2_400_000, max: Infinity,  rate: 30 },
];

const OLD_SLABS = {
  below60: [
    { min: 0,          max: 250_000,  rate: 0  },
    { min: 250_000,    max: 500_000,  rate: 5  },
    { min: 500_000,    max: 1_000_000, rate: 20 },
    { min: 1_000_000,  max: Infinity, rate: 30 },
  ],
  senior: [
    { min: 0,          max: 300_000,  rate: 0  },
    { min: 300_000,    max: 500_000,  rate: 5  },
    { min: 500_000,    max: 1_000_000, rate: 20 },
    { min: 1_000_000,  max: Infinity, rate: 30 },
  ],
  superSenior: [
    { min: 0,          max: 500_000,  rate: 0  },
    { min: 500_000,    max: 1_000_000, rate: 20 },
    { min: 1_000_000,  max: Infinity, rate: 30 },
  ],
};

// ─── Slab tax computation ──────────────────────────────────────────────────────
function slabTax(income, slabs) {
  let tax = 0;
  const rows = [];
  for (const s of slabs) {
    if (income <= s.min) break;
    const taxable = Math.min(income, s.max === Infinity ? income : s.max) - s.min;
    const t = taxable * s.rate / 100;
    rows.push({ from: s.min, to: s.max, rate: s.rate, taxableAmount: taxable, tax: t });
    tax += t;
  }
  return { tax, rows };
}

// ─── Surcharge ────────────────────────────────────────────────────────────────
function computeSurcharge(rawTax, taxableIncome, isNew) {
  const maxSurcharge = isNew ? 25 : 37;
  let rate = 0;
  if (taxableIncome > 50_000_000) rate = maxSurcharge;
  else if (taxableIncome > 20_000_000) rate = 25;
  else if (taxableIncome > 10_000_000) rate = 15;
  else if (taxableIncome > 5_000_000) rate = 10;

  let surcharge = rawTax * rate / 100;

  // Marginal relief on surcharge at each threshold
  if (rate > 0) {
    const thresholds = [
      { limit: 5_000_000, rate: 10 },
      { limit: 10_000_000, rate: 15 },
      { limit: 20_000_000, rate: 25 },
      { limit: 50_000_000, rate: maxSurcharge },
    ];
    for (const t of thresholds) {
      if (taxableIncome > t.limit) {
        // compute tax + surcharge at threshold
        const taxAtThreshold = rawTax; // simplified: apply marginal relief
        const excessIncome = taxableIncome - t.limit;
        const surchargeAtThreshold = rawTax * (t.rate === rate ? 0 : (rate > t.rate ? t.rate : 0)) / 100;
        const netTaxAtThreshold = taxAtThreshold + surchargeAtThreshold;
        const netTaxCurrent = rawTax + surcharge;
        const relief = Math.max(0, netTaxCurrent - (netTaxAtThreshold + excessIncome));
        if (relief > 0) surcharge = Math.max(0, surcharge - relief);
      }
    }
  }

  return { rate, surcharge };
}

// ─── Main Tax Calculation ─────────────────────────────────────────────────────
function computeTax(inputs) {
  const {
    regime, ageCategory,
    basic1, incrementOption, basic2, incrementFromMonth,
    daPct, hraMonthly, otherAllowMonthly,
    daArrear, payRevisionArrear, otherArrear,
    leaveSurrender, festivalAllowance,
    fdInterest, otherIncome,
    // old regime
    rentPaidAnnual, isMetro,
    profTax,
    housingLoanInterest,
    gpfContrib, sliPremium, licPremium, ppfContrib, elssAmount,
    nscAmount, hlPrincipal, tuitionFees, npsEmployee80C, otherC80,
    npsAdditional,
    employerNPS,
    mediclaimSelf, mediclaimParents, seniorParents,
    housingLoanInterest80EEA,
    eduLoanInterest,
    donations,
    savingsInterest,
    // TDS
    monthsAlreadyDeducted, tdsPaidAmount,
  } = inputs;

  const isNew = regime === 'new';

  // ── Annual Basic calculation ─────────────────────────────────────────────────
  let annualBasic = 0;
  let preMonths = 0, postMonths = 0;
  if (incrementOption === 'yes' && n(basic2) > 0) {
    preMonths = n(incrementFromMonth) - 1;
    postMonths = 12 - preMonths;
    annualBasic = n(basic1) * preMonths + n(basic2) * postMonths;
  } else {
    annualBasic = n(basic1) * 12;
    preMonths = 0;
    postMonths = 12;
  }

  const annualDA = annualBasic * n(daPct) / 100;
  const basicPlusDA = annualBasic + annualDA;
  const annualHRA = n(hraMonthly) * 12;
  const annualOther = n(otherAllowMonthly) * 12;

  const totalArrears = n(daArrear) + n(payRevisionArrear) + n(otherArrear);
  const leaveSurrenderAmt = n(leaveSurrender);
  const festivalAllowanceAmt = n(festivalAllowance);

  const grossFromEmployer = annualBasic + annualDA + annualHRA + annualOther +
    totalArrears + leaveSurrenderAmt + festivalAllowanceAmt;

  // ── Standard Deduction ───────────────────────────────────────────────────────
  const stdDed = isNew ? 75_000 : 50_000;

  // ── HRA Exemption (old regime only) ─────────────────────────────────────────
  let hraExemptAmt = 0;
  if (!isNew && annualHRA > 0) {
    const rentPaid = n(rentPaidAnnual);
    const metroFactor = isMetro ? 0.5 : 0.4;
    const hraA = annualHRA;
    const hraB = Math.max(0, rentPaid - 0.1 * basicPlusDA);
    const hraC = metroFactor * basicPlusDA;
    hraExemptAmt = Math.max(0, Math.min(hraA, hraB, hraC));
  }

  // ── Professional Tax ─────────────────────────────────────────────────────────
  const profTaxDed = isNew ? 0 : Math.min(n(profTax), 5_000);

  // ── Net Salary Income ────────────────────────────────────────────────────────
  const netSalaryIncome = grossFromEmployer - stdDed - hraExemptAmt - profTaxDed;

  // ── Other Income ─────────────────────────────────────────────────────────────
  const otherIncomeTotal = n(fdInterest) + n(otherIncome);

  // ── Gross Total Income ───────────────────────────────────────────────────────
  const grossTotalIncome = netSalaryIncome + otherIncomeTotal;

  // ── Old Regime Deductions ────────────────────────────────────────────────────
  let hlInterestDed = 0;
  let c80Total = 0;
  let npsAddDed = 0;
  let empNPSDed = 0;
  let d80Total = 0;
  let hlInterest80EEADed = 0;
  let eduLoanDed = 0;
  let donationDed = 0;
  let savingsDed = 0;
  let totalChapterVIA = 0;

  if (!isNew) {
    hlInterestDed = clamp(housingLoanInterest, 200_000);
    const c80Raw = n(gpfContrib) + n(sliPremium) + n(licPremium) + n(ppfContrib) +
      n(elssAmount) + n(nscAmount) + n(hlPrincipal) + n(tuitionFees) +
      n(npsEmployee80C) + n(otherC80);
    c80Total = Math.min(c80Raw, 150_000);
    npsAddDed = clamp(npsAdditional, 50_000);
    empNPSDed = Math.min(n(employerNPS), 0.1 * basicPlusDA);

    const selfMedMax = ageCategory === 'below60' ? 25_000 : 50_000;
    const parentsMedMax = seniorParents ? 50_000 : 25_000;
    d80Total = clamp(mediclaimSelf, selfMedMax) + clamp(mediclaimParents, parentsMedMax);

    hlInterest80EEADed = clamp(housingLoanInterest80EEA, 150_000);
    eduLoanDed = n(eduLoanInterest);
    donationDed = n(donations) * 0.5;
    savingsDed = ageCategory === 'superSenior' ? 0
      : ageCategory === 'senior' ? clamp(savingsInterest, 50_000)
      : clamp(savingsInterest, 10_000);

    totalChapterVIA = hlInterestDed + c80Total + npsAddDed + empNPSDed + d80Total +
      hlInterest80EEADed + eduLoanDed + donationDed + savingsDed;
  } else {
    // New regime: only employer NPS 80CCD(2)
    empNPSDed = Math.min(n(employerNPS), 0.1 * basicPlusDA);
    totalChapterVIA = empNPSDed;
  }

  // ── Taxable Income ───────────────────────────────────────────────────────────
  const taxableIncome = Math.max(0, grossTotalIncome - totalChapterVIA);

  // ── Slab Tax ─────────────────────────────────────────────────────────────────
  const slabs = isNew ? NEW_SLABS : OLD_SLABS[ageCategory];
  const { tax: rawTaxBase, rows: slabRows } = slabTax(taxableIncome, slabs);
  let rawTax = rawTaxBase;

  // ── Rebate u/s 87A ───────────────────────────────────────────────────────────
  let rebate87A = 0;
  let rebateNote = '';
  if (isNew) {
    if (taxableIncome <= 1_200_000) {
      rebate87A = rawTax;
      rebateNote = 'Full rebate u/s 87A (taxable income ≤ ₹12,00,000)';
    } else if (taxableIncome <= 1_270_588) {
      // Marginal relief: tax = income - 12L
      const effectiveTax = taxableIncome - 1_200_000;
      rebate87A = Math.max(0, rawTax - effectiveTax);
      rawTax = effectiveTax;
      rebateNote = `Marginal relief applied (income ₹${fmt(taxableIncome)} — effective tax = income − ₹12,00,000)`;
    }
  } else {
    if (taxableIncome <= 500_000) {
      rebate87A = Math.min(rawTax, 12_500);
      rebateNote = `Rebate u/s 87A: min(tax, ₹12,500) for taxable income ≤ ₹5,00,000`;
    }
  }

  const taxAfterRebate = Math.max(0, rawTax - rebate87A);

  // ── Surcharge ─────────────────────────────────────────────────────────────────
  const { rate: surchargeRate, surcharge: surchargeAmt } = computeSurcharge(taxAfterRebate, taxableIncome, isNew);

  // ── Cess ──────────────────────────────────────────────────────────────────────
  const cess = (taxAfterRebate + surchargeAmt) * 0.04;

  // ── Total Tax ────────────────────────────────────────────────────────────────
  const totalTaxRaw = taxAfterRebate + surchargeAmt + cess;
  const totalTax = Math.round(totalTaxRaw / 10) * 10;

  // ── Monthly TDS ──────────────────────────────────────────────────────────────
  const tdsAlreadyPaid = n(tdsPaidAmount);
  const mDeducted = n(monthsAlreadyDeducted);
  const remainingMonths = Math.max(1, 12 - mDeducted);
  const balanceTax = Math.max(0, totalTax - tdsAlreadyPaid);
  const monthlyTDS = Math.ceil(balanceTax / remainingMonths);

  return {
    annualBasic, annualDA, annualHRA, annualOther,
    basicPlusDA,
    totalArrears, leaveSurrenderAmt, festivalAllowanceAmt,
    grossFromEmployer,
    stdDed, hraExemptAmt, profTaxDed,
    netSalaryIncome, otherIncomeTotal, grossTotalIncome,
    hlInterestDed, c80Total, npsAddDed, empNPSDed, d80Total,
    hlInterest80EEADed, eduLoanDed, donationDed, savingsDed,
    totalChapterVIA,
    taxableIncome, slabRows, rawTax, rawTaxBase,
    rebate87A, rebateNote,
    taxAfterRebate, surchargeRate, surchargeAmt, cess,
    totalTax, remainingMonths, balanceTax, monthlyTDS,
    preMonths, postMonths,
    // raw 80C sum for display
    c80Raw: n(gpfContrib) + n(sliPremium) + n(licPremium) + n(ppfContrib) +
      n(elssAmount) + n(nscAmount) + n(hlPrincipal) + n(tuitionFees) +
      n(npsEmployee80C) + n(otherC80),
  };
}

// ─── Print Handler ────────────────────────────────────────────────────────────
function handlePrint(inputs, R) {
  const {
    regime, ageCategory,
    name, designation, department, officeName, pan, employeeCode, gpfNpsNo, aadhaarLast4,
    basic1, incrementOption, basic2, incrementFromMonth, daPct,
    monthsAlreadyDeducted, tdsPaidAmount,
    isMetro, rentPaidAnnual,
    gpfContrib, sliPremium, licPremium, ppfContrib, elssAmount,
    nscAmount, hlPrincipal, tuitionFees, npsEmployee80C, otherC80,
    mediclaimSelf, mediclaimParents, seniorParents,
    profTax, ageCategory: ac,
    daArrear, payRevisionArrear, otherArrear,
    fdInterest, otherIncome, housingLoanInterest, housingLoanInterest80EEA,
    eduLoanInterest, donations, savingsInterest, employerNPS, npsAdditional,
    leaveSurrender, festivalAllowance,
  } = inputs;

  const isNew = regime === 'new';
  const mDeducted = n(monthsAlreadyDeducted);

  // TDS deducted months label
  let tdsMonthLabel = 'None';
  if (mDeducted === 1) tdsMonthLabel = 'April 2025';
  else if (mDeducted === 2) tdsMonthLabel = 'April–May 2025';
  else if (mDeducted === 3) tdsMonthLabel = 'April–June 2025';
  else if (mDeducted === 4) tdsMonthLabel = 'April–July 2025';
  else if (mDeducted === 5) tdsMonthLabel = 'April–August 2025';
  else if (mDeducted === 6) tdsMonthLabel = 'April–September 2025';
  else if (mDeducted === 7) tdsMonthLabel = 'April–October 2025';
  else if (mDeducted === 8) tdsMonthLabel = 'April–November 2025';
  else if (mDeducted === 9) tdsMonthLabel = 'April–December 2025';
  else if (mDeducted === 10) tdsMonthLabel = 'April 2025–January 2026';
  else if (mDeducted === 11) tdsMonthLabel = 'April 2025–February 2026';

  // Basic pay display
  let basicPayDisplay = '';
  if (incrementOption === 'yes' && n(basic2) > 0 && R.preMonths > 0) {
    const fromMonth = MONTH_NAMES[0];
    const toMonth = MONTH_NAMES[R.preMonths - 1];
    const fromMonth2 = MONTH_NAMES[R.preMonths];
    const toMonth2 = MONTH_NAMES[11];
    basicPayDisplay = `₹${fmtPrint(n(basic1))} × ${R.preMonths} months (${fromMonth}–${toMonth} 2025) + ₹${fmtPrint(n(basic2))} × ${R.postMonths} months (${fromMonth2} ${n(incrementFromMonth) <= 9 ? '2025' : '2026'}–Mar 2026)`;
  } else {
    basicPayDisplay = `₹${fmtPrint(n(basic1))} × 12 months`;
  }

  // HRA computation details for print
  const rentPaid = n(rentPaidAnnual);
  const hraA = R.annualHRA;
  const hraB = Math.max(0, rentPaid - 0.1 * R.basicPlusDA);
  const hraC = (isMetro ? 0.5 : 0.4) * R.basicPlusDA;

  // Age label
  const ageLabel = ageCategory === 'below60' ? 'Below 60 years' : ageCategory === 'senior' ? 'Senior Citizen (60–79 years)' : 'Super Senior Citizen (80+ years)';

  // Slabs for print
  const slabRowsHtml = R.slabRows.map(row => {
    const toLabel = row.to === Infinity ? 'Above' : `₹${fmtPrint(row.to)}`;
    const fromLabel = `₹${fmtPrint(row.from)}`;
    return `<tr>
      <td class="indent">${fromLabel} – ${toLabel} @ ${row.rate}%</td>
      <td class="right">${row.tax === 0 ? '<span class="nil">NIL</span>' : `₹${fmtPrint(row.tax)}`}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Anticipatory Income Tax Statement FY 2025-26</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11pt; margin: 0; padding: 15mm; color: #000; }
  h2 { text-align: center; font-size: 13pt; margin: 0; }
  h3 { text-align: center; font-size: 11pt; margin: 4px 0; font-weight: normal; }
  .header-box { border: 2px solid #000; padding: 10px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th, td { border: 1px solid #555; padding: 4px 8px; font-size: 10.5pt; }
  th { background: #f0f0f0; font-weight: bold; }
  .section-head th { background: #333; color: #fff; font-size: 10pt; text-transform: uppercase; }
  .total-row td { font-weight: bold; background: #f9f9f9; }
  .grand-total td { font-weight: bold; font-size: 12pt; background: #e8e8e8; }
  .right { text-align: right; }
  .indent { padding-left: 20px; }
  .nil { color: #666; }
  .sig-area { display: flex; justify-content: space-between; margin-top: 20px; }
  .sig-box { text-align: center; min-width: 200px; }
  .sig-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 4px; font-size: 10pt; }
  .footer { border-top: 1px solid #999; margin-top: 15px; font-size: 9pt; color: #666; text-align: center; }
  .highlight { background: #fff3cd !important; }
  @page { size: A4; margin: 15mm; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>

<div class="header-box">
  <h2>ANTICIPATORY INCOME TAX STATEMENT</h2>
  <h3>Financial Year 2025-26 (Assessment Year 2026-27)</h3>
  <h3>Tax Regime: <strong>${isNew ? 'NEW REGIME (Section 115BAC)' : 'OLD REGIME'}</strong></h3>
</div>

<!-- Employee Details -->
<table>
  <tr>
    <th colspan="4" style="background:#1a1a1a;color:#fff;text-align:center;">EMPLOYEE DETAILS</th>
  </tr>
  <tr>
    <th style="width:20%">Name</th>
    <td style="width:30%">${name || '___________________________'}</td>
    <th style="width:20%">Designation</th>
    <td>${designation || '___________________________'}</td>
  </tr>
  <tr>
    <th>Department</th>
    <td>${department || '___________________________'}</td>
    <th>Office Name</th>
    <td>${officeName || '___________________________'}</td>
  </tr>
  <tr>
    <th>PAN</th>
    <td>${pan || '___________'}</td>
    <th>Employee Code</th>
    <td>${employeeCode || '___________'}</td>
  </tr>
  <tr>
    <th>GPF/NPS A/c No.</th>
    <td>${gpfNpsNo || '___________'}</td>
    <th>Aadhaar (last 4)</th>
    <td>XXXX XXXX ${aadhaarLast4 || '____'}</td>
  </tr>
  <tr>
    <th>Age Category</th>
    <td>${ageLabel}</td>
    <th>Tax Regime</th>
    <td><strong>${isNew ? 'New Regime (Sec 115BAC)' : 'Old Regime'}</strong></td>
  </tr>
</table>

<!-- PART A: Income from Salary -->
<table>
  <tr class="section-head"><th colspan="2">PART A: INCOME FROM SALARY</th></tr>
  <tr><th>Sl.</th><th>Particulars</th></tr>
  <tr>
    <td>1</td>
    <td>Basic Pay — ${basicPayDisplay}<span class="right" style="float:right">₹${fmtPrint(R.annualBasic)}</span></td>
  </tr>
  <tr>
    <td>2</td>
    <td>Dearness Allowance @ ${daPct}% of Basic Pay<span class="right" style="float:right">₹${fmtPrint(R.annualDA)}</span></td>
  </tr>
  <tr>
    <td>3</td>
    <td>House Rent Allowance (Annual)<span class="right" style="float:right">₹${fmtPrint(R.annualHRA)}</span></td>
  </tr>
  <tr>
    <td>4</td>
    <td>Other Taxable Allowances (Annual)<span class="right" style="float:right">${nilOrAmt(R.annualOther)}</span></td>
  </tr>
  <tr class="total-row">
    <td colspan="2">Sub-total: Regular Salary<span class="right" style="float:right">₹${fmtPrint(R.annualBasic + R.annualDA + R.annualHRA + R.annualOther)}</span></td>
  </tr>
  <tr>
    <td>5</td>
    <td>DA Arrears<span class="right" style="float:right">${nilOrAmt(n(daArrear))}</span></td>
  </tr>
  <tr>
    <td>6</td>
    <td>Pay Revision / Increment Arrears<span class="right" style="float:right">${nilOrAmt(n(payRevisionArrear))}</span></td>
  </tr>
  <tr>
    <td>7</td>
    <td>Other Arrears<span class="right" style="float:right">${nilOrAmt(n(otherArrear))}</span></td>
  </tr>
  <tr>
    <td>8</td>
    <td>Leave Surrender Value<span class="right" style="float:right">${nilOrAmt(R.leaveSurrenderAmt)}</span></td>
  </tr>
  <tr>
    <td>9</td>
    <td>Festival Allowance / Onam Bonus<span class="right" style="float:right">${nilOrAmt(R.festivalAllowanceAmt)}</span></td>
  </tr>
  <tr class="grand-total">
    <td colspan="2">GROSS SALARY FROM EMPLOYER<span class="right" style="float:right">₹${fmtPrint(R.grossFromEmployer)}</span></td>
  </tr>
</table>

<!-- PART B: Exemptions -->
<table>
  <tr class="section-head"><th colspan="2">PART B: EXEMPTIONS / DEDUCTIONS FROM SALARY</th></tr>
  <tr>
    <td>10</td>
    <td>Standard Deduction u/s 16(ia) [${isNew ? '₹75,000 — New Regime' : '₹50,000 — Old Regime'}]
      <span class="right" style="float:right">₹${fmtPrint(R.stdDed)}</span>
    </td>
  </tr>
  ${!isNew && R.annualHRA > 0 ? `
  <tr>
    <td>11</td>
    <td>
      HRA Exemption u/s 10(13A):<br/>
      &nbsp;&nbsp;(a) Actual HRA Received (Annual) = ₹${fmtPrint(hraA)}<br/>
      &nbsp;&nbsp;(b) Rent Paid − 10% of (Basic+DA) = ₹${fmtPrint(hraB)}<br/>
      &nbsp;&nbsp;(c) ${isMetro ? '50%' : '40%'} of (Basic+DA) [${isMetro ? 'Metro' : 'Non-Metro'}] = ₹${fmtPrint(hraC)}<br/>
      &nbsp;&nbsp;<strong>HRA Exemption (least of above)</strong>
      <span class="right" style="float:right">₹${fmtPrint(R.hraExemptAmt)}</span>
    </td>
  </tr>` : ''}
  ${!isNew ? `
  <tr>
    <td>${R.annualHRA > 0 ? '12' : '11'}</td>
    <td>Professional Tax u/s 16(iii)<span class="right" style="float:right">${nilOrAmt(R.profTaxDed)}</span></td>
  </tr>` : ''}
  <tr class="total-row">
    <td colspan="2">INCOME FROM SALARY (Net)
      <span class="right" style="float:right">₹${fmtPrint(R.netSalaryIncome)}</span>
    </td>
  </tr>
</table>

<!-- PART C: Other Income -->
<table>
  <tr class="section-head"><th colspan="2">PART C: INCOME FROM OTHER SOURCES</th></tr>
  <tr>
    <td>13</td>
    <td>Interest / FD / Other Income<span class="right" style="float:right">${nilOrAmt(R.otherIncomeTotal)}</span></td>
  </tr>
  <tr class="grand-total">
    <td colspan="2">GROSS TOTAL INCOME<span class="right" style="float:right">₹${fmtPrint(R.grossTotalIncome)}</span></td>
  </tr>
</table>

${!isNew ? `
<!-- PART D: Deductions Chapter VI-A (Old Regime) -->
<table>
  <tr class="section-head"><th colspan="2">PART D: DEDUCTIONS UNDER CHAPTER VI-A (OLD REGIME)</th></tr>
  <tr>
    <td>14</td>
    <td>Section 24(b) — Housing Loan Interest (Max ₹2,00,000)
      <span class="right" style="float:right">${nilOrAmt(R.hlInterestDed)}</span>
    </td>
  </tr>
  <tr>
    <td rowspan="12">15</td>
    <td><strong>Section 80C — (Max ₹1,50,000)</strong></td>
  </tr>
  <tr><td class="indent">(a) GPF/PF Contribution<span class="right" style="float:right">${nilOrAmt(n(gpfContrib))}</span></td></tr>
  <tr><td class="indent">(b) SLI Premium<span class="right" style="float:right">${nilOrAmt(n(sliPremium))}</span></td></tr>
  <tr><td class="indent">(c) LIC Premium<span class="right" style="float:right">${nilOrAmt(n(licPremium))}</span></td></tr>
  <tr><td class="indent">(d) PPF Contribution<span class="right" style="float:right">${nilOrAmt(n(ppfContrib))}</span></td></tr>
  <tr><td class="indent">(e) ELSS / Mutual Fund<span class="right" style="float:right">${nilOrAmt(n(elssAmount))}</span></td></tr>
  <tr><td class="indent">(f) NSC<span class="right" style="float:right">${nilOrAmt(n(nscAmount))}</span></td></tr>
  <tr><td class="indent">(g) Housing Loan Principal<span class="right" style="float:right">${nilOrAmt(n(hlPrincipal))}</span></td></tr>
  <tr><td class="indent">(h) Children Tuition Fees<span class="right" style="float:right">${nilOrAmt(n(tuitionFees))}</span></td></tr>
  <tr><td class="indent">(i) NPS Employee Contribution u/s 80CCD(1)<span class="right" style="float:right">${nilOrAmt(n(npsEmployee80C))}</span></td></tr>
  <tr><td class="indent">(j) Others<span class="right" style="float:right">${nilOrAmt(n(otherC80))}</span></td></tr>
  <tr class="total-row"><td>Total u/s 80C [Restricted to ₹1,50,000]<span class="right" style="float:right">₹${fmtPrint(R.c80Total)}</span></td></tr>
  <tr>
    <td>16</td>
    <td>Section 80CCD(1B) — Additional NPS Contribution (Max ₹50,000)
      <span class="right" style="float:right">${nilOrAmt(R.npsAddDed)}</span>
    </td>
  </tr>
  <tr>
    <td>17</td>
    <td>Section 80CCD(2) — Employer NPS Contribution [10% of Basic+DA]
      <span class="right" style="float:right">${nilOrAmt(R.empNPSDed)}</span>
    </td>
  </tr>
  <tr>
    <td>18</td>
    <td>Section 80D — Medical Insurance Premium
      <br/>&nbsp;&nbsp;Self &amp; Family: ₹${fmtPrint(n(mediclaimSelf))} | Parents ${seniorParents ? '(Senior)' : ''}: ₹${fmtPrint(n(mediclaimParents))}
      <span class="right" style="float:right">${nilOrAmt(R.d80Total)}</span>
    </td>
  </tr>
  <tr>
    <td>19</td>
    <td>Section 80E — Education Loan Interest (Unlimited)
      <span class="right" style="float:right">${nilOrAmt(R.eduLoanDed)}</span>
    </td>
  </tr>
  <tr>
    <td>20</td>
    <td>Section 80EEA — Additional Housing Loan Interest (Max ₹1,50,000)
      <span class="right" style="float:right">${nilOrAmt(R.hlInterest80EEADed)}</span>
    </td>
  </tr>
  <tr>
    <td>21</td>
    <td>Section 80G — Charitable Donations (50% deduction)
      <span class="right" style="float:right">${nilOrAmt(R.donationDed)}</span>
    </td>
  </tr>
  <tr>
    <td>22</td>
    <td>Section 80TTA / 80TTB — Savings Interest
      [${ageCategory === 'below60' ? 'Max ₹10,000' : 'Max ₹50,000 (Senior)'}]
      <span class="right" style="float:right">${nilOrAmt(R.savingsDed)}</span>
    </td>
  </tr>
  <tr class="grand-total">
    <td colspan="2">TOTAL DEDUCTIONS UNDER CHAPTER VI-A
      <span class="right" style="float:right">₹${fmtPrint(R.totalChapterVIA)}</span>
    </td>
  </tr>
</table>` : `
<!-- New Regime: only 80CCD(2) -->
<table>
  <tr class="section-head"><th colspan="2">DEDUCTIONS ALLOWED UNDER NEW REGIME</th></tr>
  <tr>
    <td>14</td>
    <td>Section 80CCD(2) — Employer NPS Contribution [10% of Basic+DA; State Govt]
      <span class="right" style="float:right">${nilOrAmt(R.empNPSDed)}</span>
    </td>
  </tr>
  <tr class="grand-total">
    <td colspan="2">TOTAL DEDUCTIONS
      <span class="right" style="float:right">₹${fmtPrint(R.totalChapterVIA)}</span>
    </td>
  </tr>
</table>`}

<!-- PART E: Tax Computation -->
<table>
  <tr class="section-head"><th colspan="2">PART E: COMPUTATION OF INCOME TAX</th></tr>
  <tr class="highlight">
    <td><strong>Net Taxable Income</strong></td>
    <td class="right"><strong>₹${fmtPrint(R.taxableIncome)}</strong></td>
  </tr>
  <tr><td colspan="2"><strong>Tax on ₹${fmtPrint(R.taxableIncome)} as per ${isNew ? 'New Regime slabs' : 'Old Regime slabs'}:</strong></td></tr>
  ${slabRowsHtml}
  <tr class="total-row">
    <td>Tax on Total Income (Before Rebate)</td>
    <td class="right">₹${fmtPrint(R.rawTaxBase)}</td>
  </tr>
  <tr>
    <td>Less: Rebate u/s 87A ${R.rebateNote ? `<br/><small style="color:#444">${R.rebateNote}</small>` : ''}</td>
    <td class="right">${R.rebate87A > 0 ? `(₹${fmtPrint(R.rebate87A)})` : 'NIL'}</td>
  </tr>
  <tr class="total-row">
    <td>Tax after Rebate</td>
    <td class="right">₹${fmtPrint(R.taxAfterRebate)}</td>
  </tr>
  <tr>
    <td>Add: Surcharge @ ${R.surchargeRate}%</td>
    <td class="right">${nilOrAmt(R.surchargeAmt)}</td>
  </tr>
  <tr>
    <td>Add: Health &amp; Education Cess @ 4%</td>
    <td class="right">₹${fmtPrint(R.cess)}</td>
  </tr>
  <tr class="grand-total highlight">
    <td>TOTAL TAX PAYABLE (Rounded to nearest ₹10)</td>
    <td class="right">₹${fmtPrint(R.totalTax)}</td>
  </tr>
</table>

<!-- PART F: Monthly TDS Schedule -->
<table>
  <tr class="section-head"><th colspan="2">PART F: MONTHLY TDS SCHEDULE (FY 2025-26)</th></tr>
  <tr>
    <td>(A) Total Tax Payable</td>
    <td class="right">₹${fmtPrint(R.totalTax)}</td>
  </tr>
  <tr>
    <td>(B) Less: TDS Already Deducted (${tdsMonthLabel})</td>
    <td class="right">${n(tdsPaidAmount) > 0 ? `₹${fmtPrint(n(tdsPaidAmount))}` : 'NIL'}</td>
  </tr>
  <tr class="total-row">
    <td>Balance Tax (A − B)</td>
    <td class="right">₹${fmtPrint(R.balanceTax)}</td>
  </tr>
  <tr>
    <td>Balance Months Remaining (Apr 2025 – Mar 2026)</td>
    <td class="right">${R.remainingMonths} month${R.remainingMonths > 1 ? 's' : ''}</td>
  </tr>
  <tr class="grand-total highlight">
    <td>MONTHLY TDS REQUIRED (Balance ÷ Months)</td>
    <td class="right">₹${fmtPrint(R.monthlyTDS)}</td>
  </tr>
</table>

<!-- Declaration -->
<div style="border:1px solid #555;padding:10px;margin-top:10px;font-size:10pt;">
  <strong>DECLARATION</strong><br/>
  I hereby declare that the particulars furnished above are true and correct to the best of my knowledge and belief. This is an anticipatory statement prepared for the purpose of monthly TDS deduction from salary for the Financial Year 2025-26 (Assessment Year 2026-27) under the provisions of Section 192 of the Income Tax Act, 1961.
</div>

<div class="sig-area">
  <div class="sig-box">
    <div class="sig-line">Employee Signature</div>
    <div style="font-size:9pt;margin-top:4px">${name || '___________________________'}<br/>${designation || ''}<br/>Date: _______________</div>
  </div>
  <div class="sig-box">
    <div class="sig-line">Signature of Drawing Officer / DDO</div>
    <div style="font-size:9pt;margin-top:4px">${officeName || '___________________________'}<br/>Seal &amp; Date: _______________</div>
  </div>
</div>

<div class="footer">
  Generated by keralaemployees.in | For reference only — Not an official document | All calculations as per Income Tax Act 1961 | FY 2025-26 / AY 2026-27
</div>

</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Popup blocked. Please allow popups for this site and try again.');
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.print();
  }, 500);
}

// ─── Input Field Component ────────────────────────────────────────────────────
function InputField({ label, value, onChange, placeholder = '0', type = 'number', hint, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-white/60 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all"
      />
      {hint && <span className="text-xs text-white/40">{hint}</span>}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-[#ff9f0a] uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Result Row ───────────────────────────────────────────────────────────────
function ResultRow({ label, value, highlight, indent, className = '' }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${indent ? 'pl-4' : ''} ${highlight ? 'border-t border-white/10 mt-1 pt-2' : ''} ${className}`}>
      <span className={`text-sm ${highlight ? 'text-white font-semibold' : 'text-white/70'}`}>{label}</span>
      <span className={`text-sm font-mono ${highlight ? 'text-[#ff9f0a] font-bold text-base' : 'text-white'}`}>{value}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function IncomeTaxCalculator() {
  // Employee Details
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [officeName, setOfficeName] = useState('');
  const [pan, setPan] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [gpfNpsNo, setGpfNpsNo] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');

  // Regime & Category
  const [regime, setRegime] = useState('new');
  const [ageCategory, setAgeCategory] = useState('below60');
  const [pensionType, setPensionType] = useState('nps');

  // Salary
  const [basic1, setBasic1] = useState('');
  const [incrementOption, setIncrementOption] = useState('none');
  const [basic2, setBasic2] = useState('');
  const [incrementFromMonth, setIncrementFromMonth] = useState('4'); // July = month 4 (1-indexed from April)
  const [daPct, setDaPct] = useState('49');
  const [hraMonthly, setHraMonthly] = useState('');
  const [otherAllowMonthly, setOtherAllowMonthly] = useState('');

  // Arrears
  const [daArrear, setDaArrear] = useState('');
  const [payRevisionArrear, setPayRevisionArrear] = useState('');
  const [otherArrear, setOtherArrear] = useState('');

  // Other Salary
  const [leaveSurrender, setLeaveSurrender] = useState('');
  const [festivalAllowance, setFestivalAllowance] = useState('');

  // Other Income
  const [fdInterest, setFdInterest] = useState('');
  const [otherIncome, setOtherIncome] = useState('');

  // Old Regime — HRA
  const [rentPaidAnnual, setRentPaidAnnual] = useState('');
  const [isMetro, setIsMetro] = useState(false);

  // Old Regime — Sec 16
  const [profTax, setProfTax] = useState('2400');

  // Old Regime — 24(b)
  const [housingLoanInterest, setHousingLoanInterest] = useState('');

  // Old Regime — 80C
  const [gpfContrib, setGpfContrib] = useState('');
  const [sliPremium, setSliPremium] = useState('');
  const [licPremium, setLicPremium] = useState('');
  const [ppfContrib, setPpfContrib] = useState('');
  const [elssAmount, setElssAmount] = useState('');
  const [nscAmount, setNscAmount] = useState('');
  const [hlPrincipal, setHlPrincipal] = useState('');
  const [tuitionFees, setTuitionFees] = useState('');
  const [npsEmployee80C, setNpsEmployee80C] = useState('');
  const [otherC80, setOtherC80] = useState('');

  // Old Regime — 80CCD(1B)
  const [npsAdditional, setNpsAdditional] = useState('');

  // 80CCD(2) — both regimes
  const [employerNPS, setEmployerNPS] = useState('');

  // Old Regime — 80D
  const [mediclaimSelf, setMediclaimSelf] = useState('');
  const [mediclaimParents, setMediclaimParents] = useState('');
  const [seniorParents, setSeniorParents] = useState(false);

  // Old Regime — Others
  const [housingLoanInterest80EEA, setHousingLoanInterest80EEA] = useState('');
  const [eduLoanInterest, setEduLoanInterest] = useState('');
  const [donations, setDonations] = useState('');
  const [savingsInterest, setSavingsInterest] = useState('');

  // TDS
  const [monthsAlreadyDeducted, setMonthsAlreadyDeducted] = useState('0');
  const [tdsPaidAmount, setTdsPaidAmount] = useState('');

  // Collect all inputs
  const inputs = {
    regime, ageCategory, pensionType,
    name, designation, department, officeName, pan, employeeCode, gpfNpsNo, aadhaarLast4,
    basic1, incrementOption, basic2, incrementFromMonth, daPct, hraMonthly, otherAllowMonthly,
    daArrear, payRevisionArrear, otherArrear, leaveSurrender, festivalAllowance,
    fdInterest, otherIncome,
    rentPaidAnnual, isMetro, profTax,
    housingLoanInterest,
    gpfContrib, sliPremium, licPremium, ppfContrib, elssAmount,
    nscAmount, hlPrincipal, tuitionFees, npsEmployee80C, otherC80,
    npsAdditional, employerNPS,
    mediclaimSelf, mediclaimParents, seniorParents,
    housingLoanInterest80EEA, eduLoanInterest, donations, savingsInterest,
    monthsAlreadyDeducted, tdsPaidAmount,
  };

  const R = useMemo(() => {
    try { return computeTax(inputs); }
    catch { return null; }
  }, [
    regime, ageCategory, basic1, incrementOption, basic2, incrementFromMonth, daPct,
    hraMonthly, otherAllowMonthly, daArrear, payRevisionArrear, otherArrear,
    leaveSurrender, festivalAllowance, fdInterest, otherIncome,
    rentPaidAnnual, isMetro, profTax, housingLoanInterest,
    gpfContrib, sliPremium, licPremium, ppfContrib, elssAmount,
    nscAmount, hlPrincipal, tuitionFees, npsEmployee80C, otherC80,
    npsAdditional, employerNPS, mediclaimSelf, mediclaimParents, seniorParents,
    housingLoanInterest80EEA, eduLoanInterest, donations, savingsInterest,
    monthsAlreadyDeducted, tdsPaidAmount,
  ]);

  const canPrint = n(basic1) > 0 && R !== null;

  // 80C live total
  const c80Raw = n(gpfContrib) + n(sliPremium) + n(licPremium) + n(ppfContrib) +
    n(elssAmount) + n(nscAmount) + n(hlPrincipal) + n(tuitionFees) +
    n(npsEmployee80C) + n(otherC80);
  const c80Pct = Math.min(100, (c80Raw / 150_000) * 100);

  // Auto-hint for employer NPS
  const annualBasicForHint = useMemo(() => {
    if (incrementOption === 'yes' && n(basic2) > 0) {
      const pre = n(incrementFromMonth) - 1;
      const post = 12 - pre;
      return n(basic1) * pre + n(basic2) * post;
    }
    return n(basic1) * 12;
  }, [basic1, basic2, incrementOption, incrementFromMonth]);
  const daForHint = annualBasicForHint * n(daPct) / 100;
  const empNPSHint = Math.round(0.1 * (annualBasicForHint + daForHint));

  // TDS month label for dropdown
  const tdsDropdownOptions = [
    { value: '0', label: 'None yet (0 months)' },
    { value: '1', label: 'April 2025 (1 month)' },
    { value: '2', label: 'April–May 2025 (2 months)' },
    { value: '3', label: 'April–June 2025 (3 months)' },
    { value: '4', label: 'April–July 2025 (4 months)' },
    { value: '5', label: 'April–August 2025 (5 months)' },
    { value: '6', label: 'April–September 2025 (6 months)' },
    { value: '7', label: 'April–October 2025 (7 months)' },
    { value: '8', label: 'April–November 2025 (8 months)' },
    { value: '9', label: 'April–December 2025 (9 months)' },
    { value: '10', label: 'April 2025–January 2026 (10 months)' },
    { value: '11', label: 'April 2025–February 2026 (11 months)' },
  ];

  const inputCls = 'bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff9f0a]/50 focus:bg-white/[0.09] transition-all w-full';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Income Tax Calculator</h1>
            <p className="text-sm text-white/50">FY 2025-26 (AY 2026-27) · Kerala Government Employees</p>
          </div>
          <button
            onClick={() => canPrint && handlePrint(inputs, R)}
            disabled={!canPrint}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${canPrint
              ? 'bg-[#ff9f0a] text-black hover:bg-[#e8900a] shadow-lg shadow-[#ff9f0a]/20 cursor-pointer'
              : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            <span>📄</span>
            <span>Preview &amp; Print</span>
          </button>
        </div>
      </div>

      {/* Regime Selector */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Tax Regime & Category" />
        <div className="space-y-4">
          {/* Regime Toggle */}
          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Tax Regime</label>
            <div className="flex gap-2">
              {[
                { value: 'new', label: 'New Regime (Sec 115BAC)', sub: '₹75K std ded, no deductions' },
                { value: 'old', label: 'Old Regime', sub: '₹50K std ded, full deductions' },
              ].map(r => (
                <button
                  key={r.value}
                  onClick={() => setRegime(r.value)}
                  className={`flex-1 px-4 py-3 rounded-xl text-left transition-all border ${regime === r.value
                    ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'}`}
                >
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-xs mt-0.5 opacity-60">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Age Category */}
          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Age Category</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'below60', label: 'Below 60' },
                { value: 'senior', label: 'Senior (60–79)' },
                { value: 'superSenior', label: 'Super Senior (80+)' },
              ].map(a => (
                <button
                  key={a.value}
                  onClick={() => setAgeCategory(a.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${ageCategory === a.value
                    ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-[#ff9f0a]'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pension Type */}
          <div>
            <label className="text-xs text-white/60 font-medium mb-2 block">Pension Type</label>
            <div className="flex gap-2">
              {[{ value: 'nps', label: 'NPS (National Pension System)' }, { value: 'gpf', label: 'GPF (Old Pension Scheme)' }].map(p => (
                <button
                  key={p.value}
                  onClick={() => setPensionType(p.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${pensionType === p.value
                    ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Details */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Employee Details" subtitle="Required for print statement" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="As per service records" type="text" />
          <InputField label="Designation" value={designation} onChange={setDesignation} placeholder="e.g., Assistant" type="text" />
          <InputField label="Department" value={department} onChange={setDepartment} placeholder="e.g., Finance Department" type="text" />
          <InputField label="Office Name" value={officeName} onChange={setOfficeName} placeholder="Name of office" type="text" />
          <InputField label="PAN" value={pan} onChange={setPan} placeholder="ABCDE1234F" type="text" />
          <InputField label="Employee Code" value={employeeCode} onChange={setEmployeeCode} placeholder="Employee Code" type="text" />
          <InputField label="GPF / NPS Account No." value={gpfNpsNo} onChange={setGpfNpsNo} placeholder="Account number" type="text" />
          <InputField label="Aadhaar (Last 4 Digits)" value={aadhaarLast4} onChange={setAadhaarLast4} placeholder="XXXX" type="text" />
        </div>
      </div>

      {/* Salary Details */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Salary Details" subtitle="Enter monthly amounts" />
        <div className="space-y-4">
          {/* Basic Pay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label={incrementOption === 'yes' ? 'Basic Pay (Before Increment) — Monthly' : 'Basic Pay — Monthly'}
              value={basic1}
              onChange={setBasic1}
              placeholder="e.g. 45000"
              hint="Monthly basic pay"
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60 font-medium">Pay Increment This Year?</label>
              <div className="flex gap-2 mt-1">
                {[{ value: 'none', label: 'No Increment' }, { value: 'yes', label: 'Yes, Had Increment' }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setIncrementOption(opt.value)}
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${incrementOption === opt.value
                      ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                      : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {incrementOption === 'yes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <InputField
                label="Basic Pay After Increment — Monthly"
                value={basic2}
                onChange={setBasic2}
                placeholder="e.g. 46500"
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">Increment Effective From</label>
                <select
                  value={incrementFromMonth}
                  onChange={e => setIncrementFromMonth(e.target.value)}
                  className={inputCls}
                >
                  {MONTH_NAMES_FY.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
                <span className="text-xs text-white/40">
                  {n(incrementFromMonth) > 1
                    ? `Pre: ${n(incrementFromMonth) - 1} months · Post: ${12 - (n(incrementFromMonth) - 1)} months`
                    : 'All 12 months at new pay'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="DA Percentage (%)"
              value={daPct}
              onChange={setDaPct}
              placeholder="49"
              hint={annualBasicForHint > 0 ? `DA = ${fmtR(annualBasicForHint * n(daPct) / 100)} p.a.` : 'Annual DA'}
            />
            <InputField label="HRA — Monthly" value={hraMonthly} onChange={setHraMonthly} placeholder="e.g. 5000" />
            <InputField label="Other Taxable Allowances — Monthly" value={otherAllowMonthly} onChange={setOtherAllowMonthly} placeholder="e.g. 1000" />
          </div>
        </div>
      </div>

      {/* Arrears & Other Salary */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Arrears & Other Salary" subtitle="Lump sum amounts received during FY 2025-26" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="DA Arrears" value={daArrear} onChange={setDaArrear} placeholder="0" hint="Annual lump sum" />
          <InputField label="Pay Revision / Increment Arrears" value={payRevisionArrear} onChange={setPayRevisionArrear} placeholder="0" />
          <InputField label="Other Arrears" value={otherArrear} onChange={setOtherArrear} placeholder="0" />
          <InputField label="Leave Surrender / Encashment" value={leaveSurrender} onChange={setLeaveSurrender} placeholder="0" />
          <InputField label="Festival Allowance / Onam Bonus" value={festivalAllowance} onChange={setFestivalAllowance} placeholder="0" />
        </div>
      </div>

      {/* Other Income */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="Other Income" subtitle="Annual income from other sources" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Interest / FD Income (Annual)" value={fdInterest} onChange={setFdInterest} placeholder="0" />
          <InputField label="Any Other Income (Annual)" value={otherIncome} onChange={setOtherIncome} placeholder="0" />
        </div>
      </div>

      {/* Employer NPS — both regimes */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader
          title="Employer NPS Contribution — Sec 80CCD(2)"
          subtitle={`Allowed in both regimes · 10% of Basic+DA (State Govt) · Auto-hint: ${fmtR(empNPSHint)}`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60 font-medium">Employer NPS Contribution (Annual)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={employerNPS}
                onChange={e => setEmployerNPS(e.target.value)}
                placeholder={String(empNPSHint)}
                className={inputCls}
              />
              <button
                onClick={() => setEmployerNPS(String(empNPSHint))}
                className="px-3 py-2 bg-[#ff9f0a]/15 border border-[#ff9f0a]/30 rounded-xl text-xs text-[#ff9f0a] hover:bg-[#ff9f0a]/25 transition-all whitespace-nowrap"
              >
                Use Hint
              </button>
            </div>
            <span className="text-xs text-white/40">Hint: 10% of (Basic+DA) = {fmtR(empNPSHint)} p.a.</span>
          </div>
        </div>
      </div>

      {/* Old Regime Only Sections */}
      {regime === 'old' && (
        <>
          {/* HRA */}
          {n(hraMonthly) > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <SectionHeader title="HRA Exemption — Section 10(13A)" subtitle="Leave blank if you don't claim HRA or live in own house" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Rent Paid (Annual)" value={rentPaidAnnual} onChange={setRentPaidAnnual} placeholder="0" />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/60 font-medium">City Type</label>
                  <div className="flex gap-2 mt-1">
                    {[{ value: false, label: 'Non-Metro (40%)' }, { value: true, label: 'Metro (50%)' }].map(opt => (
                      <button
                        key={String(opt.value)}
                        onClick={() => setIsMetro(opt.value)}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${isMetro === opt.value
                          ? 'bg-[#ff9f0a]/15 border-[#ff9f0a]/50 text-white'
                          : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/40">Metro: Mumbai, Delhi, Kolkata, Chennai</span>
                </div>
              </div>
              {R && R.hraExemptAmt > 0 && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="text-sm text-green-400">HRA Exemption: {fmtR(R.hraExemptAmt)}</span>
                </div>
              )}
            </div>
          )}

          {/* Section 16 */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Professional Tax — Section 16(iii)" subtitle="Kerala standard: ₹2,400 per year. Max allowed: ₹5,000" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Professional Tax Paid (Annual)" value={profTax} onChange={setProfTax} placeholder="2400" hint="Max ₹5,000 allowed" />
            </div>
          </div>

          {/* Section 24(b) */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Housing Loan Interest — Section 24(b)" subtitle="Self-occupied property · Max ₹2,00,000" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Housing Loan Interest Paid (Annual)" value={housingLoanInterest} onChange={setHousingLoanInterest} placeholder="0" hint="Max ₹2,00,000 deductible" />
            </div>
          </div>

          {/* Section 80C */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Section 80C Investments" subtitle="Maximum deduction: ₹1,50,000" />
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/50">80C Usage</span>
                <span className={`text-xs font-semibold ${c80Raw > 150_000 ? 'text-red-400' : 'text-green-400'}`}>
                  {fmtR(Math.min(c80Raw, 150_000))} / ₹1,50,000 {c80Raw > 150_000 ? '(capped)' : ''}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c80Raw > 150_000 ? 'bg-red-400' : 'bg-green-400'}`}
                  style={{ width: `${c80Pct}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="GPF / PF Contribution (Annual)" value={gpfContrib} onChange={setGpfContrib} placeholder="0" />
              <InputField label="SLI Premium (Annual)" value={sliPremium} onChange={setSliPremium} placeholder="0" />
              <InputField label="LIC Premium (Annual)" value={licPremium} onChange={setLicPremium} placeholder="0" />
              <InputField label="PPF Contribution (Annual)" value={ppfContrib} onChange={setPpfContrib} placeholder="0" />
              <InputField label="ELSS / Mutual Fund (Annual)" value={elssAmount} onChange={setElssAmount} placeholder="0" />
              <InputField label="NSC (Annual)" value={nscAmount} onChange={setNscAmount} placeholder="0" />
              <InputField label="Housing Loan Principal Repaid (Annual)" value={hlPrincipal} onChange={setHlPrincipal} placeholder="0" />
              <InputField label="Children Tuition Fees (Annual)" value={tuitionFees} onChange={setTuitionFees} placeholder="0" hint="Max 2 children" />
              <InputField label="NPS Employee Contribution u/s 80CCD(1) (Annual)" value={npsEmployee80C} onChange={setNpsEmployee80C} placeholder="0" />
              <InputField label="Others (Annual)" value={otherC80} onChange={setOtherC80} placeholder="0" />
            </div>
          </div>

          {/* 80CCD(1B) */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Section 80CCD(1B) — Additional NPS" subtitle="Additional NPS contribution over 80C · Max ₹50,000" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Additional NPS Contribution (Annual)" value={npsAdditional} onChange={setNpsAdditional} placeholder="0" hint="Max ₹50,000 (over & above 80C)" />
            </div>
          </div>

          {/* 80D */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Section 80D — Medical Insurance (Medisep / Mediclaim)" subtitle={`Self/family max: ${ageCategory === 'below60' ? '₹25,000' : '₹50,000'} · Parents max: ${seniorParents ? '₹50,000 (senior)' : '₹25,000'}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label={`Mediclaim/Medisep — Self & Family (Max ${ageCategory === 'below60' ? '₹25,000' : '₹50,000'})`}
                value={mediclaimSelf}
                onChange={setMediclaimSelf}
                placeholder="0"
              />
              <InputField
                label={`Mediclaim — Parents (Max ${seniorParents ? '₹50,000' : '₹25,000'})`}
                value={mediclaimParents}
                onChange={setMediclaimParents}
                placeholder="0"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setSeniorParents(!seniorParents)}
                className={`w-10 h-5 rounded-full transition-all relative ${seniorParents ? 'bg-[#ff9f0a]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${seniorParents ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-white/60">Parents are Senior Citizens (60+) — Max ₹50,000</span>
            </div>
          </div>

          {/* Other deductions */}
          <div className="glass-card rounded-2xl p-6">
            <SectionHeader title="Other Deductions" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Section 80EEA — Additional Housing Loan Interest (Max ₹1,50,000)" value={housingLoanInterest80EEA} onChange={setHousingLoanInterest80EEA} placeholder="0" hint="Affordable housing only; cannot combine with 80EE" />
              <InputField label="Section 80E — Education Loan Interest (Unlimited)" value={eduLoanInterest} onChange={setEduLoanInterest} placeholder="0" />
              <InputField label="Section 80G — Charitable Donations (50% deduction)" value={donations} onChange={setDonations} placeholder="0" hint="Enter actual donation; 50% will be deducted" />
              <InputField
                label={`Section ${ageCategory === 'senior' || ageCategory === 'superSenior' ? '80TTB — Bank Interest (Max ₹50,000)' : '80TTA — Savings Interest (Max ₹10,000)'}`}
                value={savingsInterest}
                onChange={setSavingsInterest}
                placeholder="0"
              />
            </div>
          </div>
        </>
      )}

      {/* TDS Already Paid */}
      <div className="glass-card rounded-2xl p-6">
        <SectionHeader title="TDS Already Deducted" subtitle="For monthly TDS schedule calculation" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/60 font-medium">Months for which TDS already deducted</label>
            <select
              value={monthsAlreadyDeducted}
              onChange={e => setMonthsAlreadyDeducted(e.target.value)}
              className={inputCls}
            >
              {tdsDropdownOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <InputField
            label="Total TDS Already Deducted (₹)"
            value={tdsPaidAmount}
            onChange={setTdsPaidAmount}
            placeholder="0"
            hint="Sum of all TDS deducted so far"
          />
        </div>
      </div>

      {/* Results Panel */}
      {R && (
        <div className="glass-card rounded-2xl p-6 border border-[#ff9f0a]/20">
          <SectionHeader title="Tax Computation Results" subtitle="Live calculation — updates as you type" />

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Gross Salary', value: fmtR(R.grossFromEmployer) },
              { label: 'Taxable Income', value: fmtR(R.taxableIncome) },
              { label: 'Total Tax', value: fmtR(R.totalTax), highlight: true },
              { label: 'Monthly TDS', value: fmtR(R.monthlyTDS), highlight: true },
            ].map(card => (
              <div
                key={card.label}
                className={`rounded-xl p-4 text-center ${card.highlight ? 'bg-[#ff9f0a]/10 border border-[#ff9f0a]/30' : 'bg-white/[0.04] border border-white/10'}`}
              >
                <div className="text-xs text-white/50 mb-1">{card.label}</div>
                <div className={`text-base font-bold font-mono ${card.highlight ? 'text-[#ff9f0a]' : 'text-white'}`}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-1 divide-y divide-white/[0.05]">
            <ResultRow label="Annual Basic Pay" value={fmtR(R.annualBasic)} />
            <ResultRow label="Dearness Allowance" value={fmtR(R.annualDA)} />
            <ResultRow label="HRA (Annual)" value={fmtR(R.annualHRA)} />
            <ResultRow label="Other Allowances" value={fmtR(R.annualOther)} />
            <ResultRow label="Arrears (Total)" value={fmtR(R.totalArrears)} />
            <ResultRow label="Leave Surrender" value={fmtR(R.leaveSurrenderAmt)} />
            <ResultRow label="Festival Allowance" value={fmtR(R.festivalAllowanceAmt)} />
            <ResultRow label="Gross Salary from Employer" value={fmtR(R.grossFromEmployer)} highlight />
            <div className="pt-2">
              <ResultRow label={`Standard Deduction u/s 16(ia)`} value={`- ${fmtR(R.stdDed)}`} />
              {regime === 'old' && R.hraExemptAmt > 0 && (
                <ResultRow label="HRA Exemption u/s 10(13A)" value={`- ${fmtR(R.hraExemptAmt)}`} />
              )}
              {regime === 'old' && R.profTaxDed > 0 && (
                <ResultRow label="Professional Tax u/s 16(iii)" value={`- ${fmtR(R.profTaxDed)}`} />
              )}
            </div>
            <ResultRow label="Net Salary Income" value={fmtR(R.netSalaryIncome)} highlight />
            <ResultRow label="Other Income" value={fmtR(R.otherIncomeTotal)} />
            <ResultRow label="Gross Total Income" value={fmtR(R.grossTotalIncome)} highlight />
            {R.totalChapterVIA > 0 && (
              <>
                {regime === 'old' && R.hlInterestDed > 0 && <ResultRow label="Sec 24(b) Housing Loan Interest" value={`- ${fmtR(R.hlInterestDed)}`} />}
                {regime === 'old' && R.c80Total > 0 && <ResultRow label="Section 80C (capped)" value={`- ${fmtR(R.c80Total)}`} />}
                {regime === 'old' && R.npsAddDed > 0 && <ResultRow label="Sec 80CCD(1B) Additional NPS" value={`- ${fmtR(R.npsAddDed)}`} />}
                {R.empNPSDed > 0 && <ResultRow label="Sec 80CCD(2) Employer NPS" value={`- ${fmtR(R.empNPSDed)}`} />}
                {regime === 'old' && R.d80Total > 0 && <ResultRow label="Section 80D Mediclaim" value={`- ${fmtR(R.d80Total)}`} />}
                {regime === 'old' && R.hlInterest80EEADed > 0 && <ResultRow label="Sec 80EEA HL Interest" value={`- ${fmtR(R.hlInterest80EEADed)}`} />}
                {regime === 'old' && R.eduLoanDed > 0 && <ResultRow label="Sec 80E Education Loan" value={`- ${fmtR(R.eduLoanDed)}`} />}
                {regime === 'old' && R.donationDed > 0 && <ResultRow label="Sec 80G Donations (50%)" value={`- ${fmtR(R.donationDed)}`} />}
                {regime === 'old' && R.savingsDed > 0 && <ResultRow label="Sec 80TTA/TTB Savings Interest" value={`- ${fmtR(R.savingsDed)}`} />}
                <ResultRow label="Total Deductions" value={`- ${fmtR(R.totalChapterVIA)}`} highlight />
              </>
            )}
            <ResultRow label="NET TAXABLE INCOME" value={fmtR(R.taxableIncome)} highlight />
          </div>

          {/* Slab Breakdown */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-[#ff9f0a] mb-3">Slab-wise Tax Breakdown</h4>
            <div className="space-y-1 bg-white/[0.03] rounded-xl p-4">
              {R.slabRows.map((row, i) => (
                <div key={i} className="flex justify-between items-center py-1 text-sm">
                  <span className="text-white/60">
                    {fmtR(row.from)} – {row.to === Infinity ? 'Above' : fmtR(row.to)} @ {row.rate}%
                  </span>
                  <span className="text-white font-mono">
                    {row.tax === 0 ? <span className="text-white/30">NIL</span> : fmtR(row.tax)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-1.5 border-t border-white/10 text-sm font-semibold mt-1">
                <span className="text-white">Tax on Total Income</span>
                <span className="text-white font-mono">{fmtR(R.rawTaxBase)}</span>
              </div>
              {R.rebate87A > 0 && (
                <div className="flex justify-between items-center py-1 text-sm">
                  <span className="text-green-400">Less: Rebate u/s 87A</span>
                  <span className="text-green-400 font-mono">- {fmtR(R.rebate87A)}</span>
                </div>
              )}
              {R.rebateNote && (
                <p className="text-xs text-white/40 mt-1 italic">{R.rebateNote}</p>
              )}
              <div className="flex justify-between items-center py-1 text-sm">
                <span className="text-white/60">Tax after Rebate</span>
                <span className="text-white font-mono">{fmtR(R.taxAfterRebate)}</span>
              </div>
              {R.surchargeAmt > 0 && (
                <div className="flex justify-between items-center py-1 text-sm">
                  <span className="text-white/60">Surcharge @ {R.surchargeRate}%</span>
                  <span className="text-white font-mono">{fmtR(R.surchargeAmt)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 text-sm">
                <span className="text-white/60">Health & Education Cess @ 4%</span>
                <span className="text-white font-mono">{fmtR(R.cess)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-[#ff9f0a]/30 mt-1">
                <span className="text-[#ff9f0a] font-bold">Total Tax Payable</span>
                <span className="text-[#ff9f0a] font-bold font-mono text-base">{fmtR(R.totalTax)}</span>
              </div>
            </div>
          </div>

          {/* TDS Schedule */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-[#ff9f0a] mb-3">Monthly TDS Schedule</h4>
            <div className="space-y-1 bg-white/[0.03] rounded-xl p-4">
              <ResultRow label="(A) Total Tax Payable" value={fmtR(R.totalTax)} />
              <ResultRow label={`(B) TDS Already Deducted (${tdsDropdownOptions.find(o => o.value === monthsAlreadyDeducted)?.label || '0 months'})`} value={`- ${fmtR(n(tdsPaidAmount))}`} />
              <ResultRow label="Balance Tax (A − B)" value={fmtR(R.balanceTax)} highlight />
              <ResultRow label={`Balance Months (${R.remainingMonths} months)`} value="" />
              <div className="flex justify-between items-center py-2 border-t border-[#ff9f0a]/30 mt-1">
                <span className="text-[#ff9f0a] font-bold">Monthly TDS Required</span>
                <span className="text-[#ff9f0a] font-bold font-mono text-base">{fmtR(R.monthlyTDS)}</span>
              </div>
            </div>
          </div>

          {/* Print Button at bottom */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => canPrint && handlePrint(inputs, R)}
              disabled={!canPrint}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all ${canPrint
                ? 'bg-[#ff9f0a] text-black hover:bg-[#e8900a] shadow-lg shadow-[#ff9f0a]/20 cursor-pointer'
                : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              <span>📄</span>
              <span>Preview &amp; Print Anticipatory Income Tax Statement</span>
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="glass-card rounded-2xl p-4 border border-white/[0.06]">
        <p className="text-xs text-white/40 text-center">
          This calculator is for reference only. All computations are based on Income Tax Act 1961 provisions for FY 2025-26 / AY 2026-27.
          Consult your DDO or a tax professional for official deductions. Generated by <span className="text-[#ff9f0a]">keralaemployees.in</span>.
        </p>
      </div>
    </div>
  );
}
