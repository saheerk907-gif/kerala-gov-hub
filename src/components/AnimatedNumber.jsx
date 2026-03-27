'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `value` over `duration` ms using ease-in-out-cubic.
 * Animation triggers when `animKey` increments.
 * When `value` changes without `animKey` changing, updates instantly (no animation).
 */
export default function AnimatedNumber({
  value,
  animKey,
  prefix = '₹',
  suffix = '',
  format = n => Math.abs(Math.round(n)).toLocaleString('en-IN'),
  duration = 900,
  className = '',
}) {
  const [displayed, setDisplayed] = useState(Math.abs(value ?? 0));
  const rafRef      = useRef(null);
  const hasMounted  = useRef(false);
  const prevAnimKey = useRef(animKey);

  useEffect(() => {
    const target = Math.abs(value ?? 0);

    const animate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      function tick(now) {
        const t    = Math.min((now - start) / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setDisplayed(Math.round(ease * target));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!hasMounted.current) {
      // First mount
      hasMounted.current = true;
      if (animKey >= 1) {
        animate();              // Mounted after trigger already fired — animate
      } else {
        setDisplayed(target);  // animKey=0 sentinel — show instantly (no animation yet)
      }
    } else if (animKey !== prevAnimKey.current) {
      // animKey changed — re-trigger animation
      prevAnimKey.current = animKey;
      animate();
    } else {
      // Only value changed — update instantly
      setDisplayed(target);
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animKey, value, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const sign = (value ?? 0) < 0 ? '-' : '';
  return (
    <span className={className}>
      {sign}{prefix}{format(displayed)}{suffix}
    </span>
  );
}
