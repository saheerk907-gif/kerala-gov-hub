const TOPICS = [
  {
    icon: '🏦',
    ml: 'പെൻഷൻ & GPF',
    en: 'Pension delays, GPF withdrawals, loan approvals',
  },
  {
    icon: '🚌',
    ml: 'സ്ഥലംമാറ്റം',
    en: 'Transfer requests, hardship quotas, wait times',
  },
  {
    icon: '📋',
    ml: 'സർവ്വീസ് ബുക്ക്',
    en: 'Service record corrections, retirement paperwork',
  },
  {
    icon: '🏥',
    ml: 'മെഡിക്കൽ & ലീവ്',
    en: 'Medical reimbursement, leave encashment, LTC',
  },
];

export default function ExperiencesSeoBlock() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-8">
      <div
        className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/40"
      >
        ഇവിടെ എന്താണ് ലഭിക്കുക?
      </div>

      {/* 4 topic cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {TOPICS.map((t) => (
          <div
            key={t.ml}
            className="rounded-[16px] p-4"
            style={{
              background: 'var(--surface-xs)',
              border: '1px solid var(--border-sm)',
            }}
          >
            <div className="text-2xl mb-2">{t.icon}</div>
            <div
              className="text-[13px] font-semibold text-white/80 mb-1"
              style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
            >
              {t.ml}
            </div>
            <div className="text-[11px] text-white/40 leading-relaxed">{t.en}</div>
          </div>
        ))}
      </div>

      {/* SEO paragraph — server-rendered, English */}
      <p className="text-[13px] text-white/35 leading-relaxed max-w-2xl">
        Kerala government employees often face delays in pension processing, GPF
        withdrawals, transfer approvals, and retirement documentation. This page
        collects real, first-hand experiences shared by employees across
        departments — so you know what to expect before you apply, appeal, or
        escalate. Many employees search for real experiences before applying for
        pension, GPF loans, or transfers — this page helps you understand the
        actual process and delays involved.
      </p>
    </div>
  );
}
