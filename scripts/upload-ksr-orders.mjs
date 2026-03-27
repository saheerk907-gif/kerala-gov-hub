import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://xjfvfzusjsohksyenqsw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = 'documents';

const ORDERS = [
  { go_number: 'GO(P) No.93/2025/Fin',    title_ml: 'Special Casual Leave for Pacemaker Implantation — Rule 19E',          go_date: '2025-07-19', id: 1090 },
  { go_number: 'GO(P) No.74/2023/Fin',    title_ml: 'Special CL for Chemotherapy — Amended Rule 19A',                      go_date: '2023-07-15', id: 1106 },
  { go_number: 'G.O.(P)No.6/2024/P&ARD', title_ml: 'Miscarriage & Hysterectomy Leave Reckoned as Duty for Probation',     go_date: '2024-09-23', id: 1059 },
  { go_number: 'G.O.(P)No.17/2023/P&ARD',title_ml: 'Relinquishment Not Allowed on/after Promotion/Transfer — Rule 3',     go_date: '2023-11-30', id: 1049 },
  { go_number: 'GO(P) No.58/2023/Fin',    title_ml: 'Rule 26(c) Part III — Compassionate Allowance Eligibility',           go_date: '2023-06-14', id: 1039 },
  { go_number: 'G.O.(P)No.123/2022/Fin',  title_ml: 'Compensation Leave — Gazetted Officers Eligibility',                  go_date: '2022-10-07', id: 994  },
  { go_number: 'GO(P) No.87/2022/Fin',    title_ml: 'LWA Period Limited to 5 Years',                                       go_date: '2022-08-03', id: 986  },
  { go_number: 'G.O.(P)No.2/2022/P&ARD', title_ml: 'KS&SSR (Amendment) Rules 2022 — Rules 13B, 27B',                      go_date: '2022-01-15', id: 823  },
  { go_number: 'G.O.(P)No.144/2021/Fin',  title_ml: 'Special Casual Leave for Angioplasty — 30 Days',                     go_date: '2021-10-30', id: 767  },
  { go_number: 'G.O.(P)No.143/2021/Fin',  title_ml: 'Enhanced LWA Sanction Power to HOD',                                  go_date: '2021-10-30', id: 766  },
  { go_number: 'GO(P)No.62/2021/Fin',     title_ml: 'Modification in Rule 59 Part III — Pension Reduction',               go_date: '2021-04-12', id: 566  },
  { go_number: 'GO(P)No.192/2018/Fin',    title_ml: 'Insertion of Rule 59(c) Part III — Post-retirement Conduct',         go_date: '2018-12-11', id: 565  },
  { go_number: 'GO(P)No.198/2018/Fin',    title_ml: 'Modification in Rule 59 Part III KSR — Pension Withdrawal',          go_date: '2018-12-22', id: 564  },
  { go_number: 'GO(P)No.145/2020/Fin',    title_ml: 'Rounding of Qualifying Service for Pension — Rules 57, 64, 65',      go_date: '2020-10-30', id: 447  },
  { go_number: 'GO(P)No.60/2016/Fin',     title_ml: 'Special Casual Leave for Treatment of Children Undergoing Chemotherapy', go_date: '2016-05-02', id: 443  },
  { go_number: 'GO(P)No.581/2014/Fin',    title_ml: 'Enhancement of Special Casual Leave for Chemotherapy — 6 Months',   go_date: '2014-12-29', id: 442  },
  { go_number: 'GO(P)No.130/2020/Fin',    title_ml: 'Calculation of Qualifying Service for Pension',                       go_date: '2020-10-01', id: 403  },
  { go_number: 'GO(P)No.216/2012/Fin',    title_ml: 'Enhancement of Maternity Leave to 180 Days',                         go_date: '2012-04-11', id: 390  },
  { go_number: 'GO(P)No.73/2017/Fin',     title_ml: 'Modification of Monetary Limit — Rules 90A, 93, 103',                go_date: '2017-05-22', id: 228  },
  { go_number: 'GO(P)No.2/2014/P&ARD',   title_ml: 'Paternity Leave Reckoned as Duty for Probation',                     go_date: '2014-01-08', id: 215  },
  { go_number: 'GO(P)No.165/2019/Fin',    title_ml: 'Dies-non Count for Pension — Strike Participation',                  go_date: '2019-11-27', id: 213  },
  { go_number: 'GO(P)No.102/2018/Fin',    title_ml: 'Revised Compensatory Allowance — Training Outside State',             go_date: '2018-07-03', id: 173  },
  { go_number: 'GO(P)No.95/2018/Fin',     title_ml: 'Service in Temporary Munciff Magistrate Reckoned for Pension',       go_date: '2018-06-22', id: 172  },
  { go_number: 'GO(P)No.93/2018/Fin',     title_ml: 'Prior Service in PSU Not Counted for Pension and DCRG',              go_date: '2018-06-16', id: 171  },
  { go_number: 'GO(P)No.92/2018/Fin',     title_ml: 'Pensionary Benefits to Children from Void Marriages',                go_date: '2018-06-16', id: 170  },
  { go_number: 'GO(P)No.91/2018/Fin',     title_ml: 'Disbursement of DCRG to Legal Heirs — Modified',                    go_date: '2018-06-14', id: 169  },
  { go_number: 'GO(P)No.90/2018/Fin',     title_ml: 'Debarred from Receiving DCRG and Family Pension',                   go_date: '2018-06-14', id: 168  },
  { go_number: 'GO(P)No.15/2018/Fin',     title_ml: 'Special Casual Leave for Anti-rabies Treatment — Modified',         go_date: '2018-02-06', id: 167  },
  { go_number: 'GO(P)No.130/2017/Fin',    title_ml: 'KSR Amendment 2017 — Rule 28A Part I',                              go_date: '2017-10-12', id: 133  },
  { go_number: 'GO(P)No.88/2017/Fin',     title_ml: 'Charge Allowance Revised — 4% and 2% Rates',                       go_date: '2017-07-11', id: 136  },
  { go_number: 'GO(P)No.127/2019/Fin',    title_ml: 'Enhanced Fee for Duplicate Pension Book — Rs.250',                  go_date: '2019-09-19', id: 148  },
  { go_number: 'GO(P)No.126/2019/Fin',    title_ml: 'Withdrawal of Extra Ordinary Pension',                               go_date: '2019-09-18', id: 147  },
  { go_number: 'GO(P)No.125/2019/Fin',    title_ml: 'Modification of Form 2 and Form II Part II KSR',                    go_date: '2019-09-06', id: 146  },
  { go_number: 'GO(P)No.123/2019/Fin',    title_ml: 'Calculation of DCRG and Family Pension — Pay Changes',              go_date: '2019-09-06', id: 145  },
  { go_number: 'GO(P)No.82/2019/Fin',     title_ml: 'Insertion of Sub Rule (d) in Rule 59 Part III',                     go_date: '2019-07-09', id: 144  },
  { go_number: 'GO(P)No.52/2019/Fin',     title_ml: 'Special Leave up to 90 Days — Sexual Harassment Inquiry',           go_date: '2019-05-03', id: 143  },
  { go_number: 'GO(P)No.26/2019/Fin',     title_ml: 'Revision of Maximum DCRG, Minimum Pension etc.',                   go_date: '2019-03-07', id: 142  },
  { go_number: 'GO(P)No.20/2019/Fin',     title_ml: 'Ensure Pension to 50% of Minimum of Revised Scale',                go_date: '2019-02-22', id: 139  },
  { go_number: 'GO(P)No.19/2019/Fin',     title_ml: 'Entering Appointment Details in Service Book — Merit/Reservation',  go_date: '2019-02-22', id: 140  },
  { go_number: 'GO(P)No.18/2019/Fin',     title_ml: 'Income Criteria for Family Pension',                                 go_date: '2019-02-20', id: 137  },
  { go_number: 'GO(P)No.16/2019/Fin',     title_ml: 'Disbursement of Pensionary Benefits to Grand Parents',              go_date: '2019-02-20', id: 138  },
];

async function downloadPdf(id) {
  const url = `https://keralaservice.org/govt-orders-circulars.html?task=download.send&id=${id}&catid=24&m=0`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/pdf,*/*',
      'Referer': 'https://keralaservice.org/',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for id=${id}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('pdf') && !ct.includes('octet-stream')) {
    throw new Error(`Not a PDF (content-type: ${ct}) for id=${id}`);
  }
  return await res.arrayBuffer();
}

async function uploadToSupabase(buffer, fileName) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: buffer,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Upload failed: ${t}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

async function insertOrder(order, pdf_url) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/government_orders`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      go_number: order.go_number,
      title_ml: order.title_ml,
      go_date: order.go_date,
      category: 'ksr',
      pdf_url,
      is_published: true,
      is_pinned: false,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Insert failed: ${t}`);
  }
}

async function main() {
  console.log(`Starting upload of ${ORDERS.length} KSR Amendment orders...\n`);
  let success = 0, failed = 0;

  for (const order of ORDERS) {
    const fileName = `ksr-${order.id}-${order.go_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    process.stdout.write(`[${order.id}] ${order.go_number} ... `);
    try {
      const buffer = await downloadPdf(order.id);
      const pdf_url = await uploadToSupabase(buffer, fileName);
      await insertOrder(order, pdf_url);
      console.log(`✓ uploaded (${(buffer.byteLength / 1024).toFixed(0)} KB)`);
      success++;
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
}

main();
