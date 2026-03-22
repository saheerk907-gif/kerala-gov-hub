'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GREEN = '#30d158';
const MAX_BODY = 5000;

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  color: '#fff',
  padding: '12px 16px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: "var(--font-noto-malayalam), sans-serif",
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.55)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export default function SubmitExperiencePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [department, setDepartment] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validation
    const trimTitle = title.trim();
    const trimBody = body.trim();
    const trimAuthor = authorName.trim();

    if (trimTitle.length < 10 || trimTitle.length > 150) {
      setError('Title must be between 10 and 150 characters.');
      return;
    }
    if (trimBody.length < 50 || trimBody.length > MAX_BODY) {
      setError(`Experience must be between 50 and ${MAX_BODY} characters.`);
      return;
    }
    if (!isAnonymous && !trimAuthor) {
      setError('Please enter your name, or choose to post anonymously.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/experiences/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimTitle,
          body: trimBody,
          author_name: isAnonymous ? '' : trimAuthor,
          department: department.trim(),
          is_anonymous: isAnonymous,
          website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen" style={{ background: '#0d0d12' }}>
        <Navbar />
        <main className="px-4 md:px-6 max-w-[600px] mx-auto pt-24 pb-16 text-center">
          <div
            className="glass-card rounded-[24px] p-8 md:p-12"
            style={{ border: `1px solid ${GREEN}30` }}
          >
            <div className="text-5xl mb-4">✅</div>
            <h1
              className="text-[22px] font-[900] text-white mb-3"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              നന്ദി! അനുഭവം ലഭിച്ചു.
            </h1>
            <p
              className="text-[14px] text-white/60 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
            >
              നിങ്ങളുടെ അനുഭവം അഡ്മിൻ അവലോകനത്തിനായി സ്വീകരിച്ചു.
              അംഗീകാരത്തിനു ശേഷം ഇത് പ്രസിദ്ധീകരിക്കും.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/experiences"
                className="px-5 py-3 rounded-2xl text-[13px] font-bold no-underline transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)' }}
              >
                ← അനുഭവങ്ങൾ കാണുക
              </Link>
              <Link
                href="/"
                className="px-5 py-3 rounded-2xl text-[13px] font-bold no-underline"
                style={{ background: `${GREEN}20`, color: GREEN, border: `1px solid ${GREEN}40` }}
              >
                Home →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: '#0d0d12' }}>
      <Navbar />

      <main className="px-4 md:px-6 max-w-[680px] mx-auto pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 no-underline mb-5 transition-colors"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
          <div className="section-label mb-2">Community</div>
          <h1
            className="text-[clamp(24px,4vw,36px)] font-[900] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          >
            അനുഭവം പങ്കിടുക
          </h1>
          <div
            className="h-[2px] w-10 mt-2 rounded-full"
            style={{ background: `linear-gradient(to right, ${GREEN}, transparent)` }}
          />
          <p
            className="text-[13px] text-white/50 mt-3 leading-relaxed"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
          >
            നിങ്ങളുടെ സർക്കാർ സേവന അനുഭവം മറ്റ് ജീവനക്കാർക്ക് ഉപകാരപ്പെടും.
            അഡ്മിൻ അവലോകനത്തിനു ശേഷം ഇത് പ്രസിദ്ധീകരിക്കും.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from real users */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div
            className="glass-card rounded-[24px] p-6 md:p-8 flex flex-col gap-6"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Title */}
            <div>
              <label style={labelStyle} htmlFor="exp-title">
                Title <span style={{ color: '#ff453a' }}>*</span>
              </label>
              <input
                id="exp-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GPF Loan — 2 ആഴ്ചയ്ക്കുള്ളിൽ ലഭിച്ചു"
                maxLength={150}
                required
                style={inputStyle}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-white/30">10–150 characters</span>
                <span
                  className="text-[11px]"
                  style={{ color: title.length < 10 ? '#ff453a' : 'rgba(255,255,255,0.3)' }}
                >
                  {title.length}/150
                </span>
              </div>
            </div>

            {/* Body */}
            <div>
              <label style={labelStyle} htmlFor="exp-body">
                Experience <span style={{ color: '#ff453a' }}>*</span>
              </label>
              <textarea
                id="exp-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="നിങ്ങളുടെ അനുഭവം വിശദമായി എഴുതുക..."
                rows={8}
                maxLength={MAX_BODY}
                required
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-white/30">50–{MAX_BODY} characters</span>
                <span
                  className="text-[11px]"
                  style={{
                    color:
                      body.length > MAX_BODY
                        ? '#ff453a'
                        : body.length >= MAX_BODY * 0.9
                        ? '#ff9f0a'
                        : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {body.length}/{MAX_BODY}
                </span>
              </div>
            </div>

            {/* Anonymous toggle */}
            <div>
              <label style={labelStyle}>Post as</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all border cursor-pointer"
                  style={{
                    background: !isAnonymous ? `${GREEN}20` : 'rgba(255,255,255,0.04)',
                    border: !isAnonymous ? `1px solid ${GREEN}50` : '1px solid rgba(255,255,255,0.1)',
                    color: !isAnonymous ? GREEN : 'rgba(255,255,255,0.5)',
                  }}
                >
                  Named
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all border cursor-pointer"
                  style={{
                    background: isAnonymous ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                    border: isAnonymous ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.1)',
                    color: isAnonymous ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  Anonymous
                </button>
              </div>
            </div>

            {/* Author name — shown only when named */}
            {!isAnonymous && (
              <div>
                <label style={labelStyle} htmlFor="exp-author">
                  Your Name <span style={{ color: '#ff453a' }}>*</span>
                </label>
                <input
                  id="exp-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={100}
                  required
                  style={inputStyle}
                />
              </div>
            )}

            {/* Department */}
            <div>
              <label style={labelStyle} htmlFor="exp-dept">
                Department <span className="text-[10px] font-normal normal-case tracking-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>Optional</span>
              </label>
              <input
                id="exp-dept"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Revenue Department, Education"
                maxLength={100}
                style={inputStyle}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-[13px]"
                style={{ background: 'rgba(255,69,58,0.12)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.2)' }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl text-[14px] font-black tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: submitting
                  ? 'rgba(48,209,88,0.3)'
                  : `linear-gradient(135deg, ${GREEN}, #27b84a)`,
                color: '#fff',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Experience →'}
            </button>

            <p className="text-[11px] text-white/30 text-center leading-relaxed">
              By submitting, you agree that your experience will be reviewed by admin before publishing.
              Anonymous posts do not publicly reveal your identity.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
