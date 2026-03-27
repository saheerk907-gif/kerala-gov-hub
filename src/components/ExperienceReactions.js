'use client';
import { useEffect, useState } from 'react';

const GREEN = '#30d158';

function getOrCreateFingerprint() {
  try {
    let fp = localStorage.getItem('exp_fp');
    if (!fp) {
      fp =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);
      localStorage.setItem('exp_fp', fp);
    }
    return fp;
  } catch {
    // localStorage unavailable (SSR guard / private mode)
    return Math.random().toString(36).slice(2);
  }
}

export default function ExperienceReactions({ experienceId, initialCounts = {} }) {
  const [counts, setCounts] = useState({
    helpful: initialCounts.helpful || 0,
    relatable: initialCounts.relatable || 0,
  });
  const [active, setActive] = useState({ helpful: false, relatable: false });
  const [loading, setLoading] = useState({ helpful: false, relatable: false });
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    setFingerprint(getOrCreateFingerprint());
  }, []);

  async function handleReact(type) {
    if (!fingerprint || loading[type]) return;

    const wasActive = active[type];

    // Optimistic update
    setActive((prev) => ({ ...prev, [type]: !wasActive }));
    setCounts((prev) => ({
      ...prev,
      [type]: wasActive ? Math.max(0, prev[type] - 1) : prev[type] + 1,
    }));
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await fetch('/api/experiences/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience_id: experienceId, type, fingerprint }),
      });

      if (!res.ok) {
        // Revert on failure
        setActive((prev) => ({ ...prev, [type]: wasActive }));
        setCounts((prev) => ({
          ...prev,
          [type]: wasActive ? prev[type] + 1 : Math.max(0, prev[type] - 1),
        }));
      }
      // On success, keep the optimistic state — server matches our expectation
    } catch {
      // Network error — revert
      setActive((prev) => ({ ...prev, [type]: wasActive }));
      setCounts((prev) => ({
        ...prev,
        [type]: wasActive ? prev[type] + 1 : Math.max(0, prev[type] - 1),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }

  const pills = [
    { type: 'helpful', emoji: '👍', label: 'Helpful' },
    { type: 'relatable', emoji: '❤️', label: 'Relatable' },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {pills.map(({ type, emoji, label }) => {
        const isActive = active[type];
        const isLoading = loading[type];
        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={isLoading || !fingerprint}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 border cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: isActive ? `${GREEN}25` : 'var(--surface-sm)',
              border: isActive ? `1px solid ${GREEN}50` : '1px solid var(--border-sm)',
              color: isActive ? GREEN : 'var(--text-dim)',
              transform: isLoading ? 'scale(0.96)' : 'scale(1)',
            }}
            aria-pressed={isActive}
            aria-label={`${label}: ${counts[type]}`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: isActive ? GREEN : 'var(--text-faint)' }}
            >
              {counts[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
