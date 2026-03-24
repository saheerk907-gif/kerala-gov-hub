import Link from 'next/link';

const GREEN = '#30d158';

export default function ExperienceShareCta() {
  return (
    <div
      className="rounded-[24px] p-7 md:p-8 my-8"
      style={{
        background: 'rgba(48,209,88,0.07)',
        border: '1px solid rgba(48,209,88,0.2)',
      }}
    >
      <div className="text-2xl mb-3">✍️</div>
      <h3
        className="text-[18px] font-[900] text-white mb-2"
        style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
      >
        നിങ്ങൾക്കും ഒരു അനുഭവം ഉണ്ടോ?
      </h3>
      <p
        className="text-[14px] text-white/60 leading-relaxed mb-5"
        style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
      >
        ഈ ജീവനക്കാരൻ പങ്കിട്ടതുപോലെ, നിങ്ങളുടെ അനുഭവം മറ്റുള്ളവർക്ക് വഴികാട്ടിയാകും.
      </p>
      <Link
        href="/experiences/submit"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all"
        style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
      >
        + അനുഭവം പങ്കിടുക
      </Link>
      <p className="text-[11px] text-white/30 mt-3">
        Anonymous posting supported · അഡ്മിൻ അവലോകനത്തിനു ശേഷം പ്രസിദ്ധീകരിക്കും
      </p>
    </div>
  );
}
