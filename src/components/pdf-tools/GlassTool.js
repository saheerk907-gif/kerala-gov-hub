'use client';
import Link from 'next/link';

export default function GlassTool({ icon, title, titleMl, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#121416',
      color: '#fff',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        background: 'rgba(41,151,255,0.06)', filter: 'blur(100px)',
        top: -100, right: -100, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(48,209,88,0.04)', filter: 'blur(90px)',
        bottom: -80, left: -80, pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 560, margin: '0 auto',
        padding: '48px 16px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Back link */}
        <div style={{ width: '100%', marginBottom: 28 }}>
          <Link href="/#tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
          }}>
            ← Back to tools
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32, width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: 18, fontSize: 26, marginBottom: 14,
            background: 'rgba(41,151,255,0.10)', border: '1px solid rgba(41,151,255,0.18)',
          }}>{icon}</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#fff' }}>
            {title}
          </h1>
          {titleMl && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>{titleMl}</p>
          )}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            Files never leave your device
          </p>
        </div>

        {/* Content card */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          padding: '28px 24px',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
