'use client';

export default function GlassTool({ icon, title, titleMl, children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 50%, #e0f2fe 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 16px 64px',
    }}>
      {/* ambient blobs */}
      <div style={{
        position: 'fixed', width: 320, height: 320,
        background: 'rgba(16,185,129,0.18)', borderRadius: '50%',
        bottom: -80, left: -80, filter: 'blur(70px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', width: 260, height: 260,
        background: 'rgba(14,165,233,0.15)', borderRadius: '50%',
        top: -60, right: -60, filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* header */}
      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h1>
        {titleMl && (
          <p style={{ fontSize: 15, color: '#475569', marginTop: 4 }}>{titleMl}</p>
        )}
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
          Files never leave your device
        </p>
      </div>

      {/* glass card */}
      <div style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.78)',
        borderRadius: 24,
        padding: '32px 28px',
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}
