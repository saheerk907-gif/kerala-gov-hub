'use client';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      const s = (Math.random() * 2 + 1) + 'px';
      p.style.width = s;
      p.style.height = s;
      p.style.opacity = String(Math.random() * 0.4);
      c.appendChild(p);
    }
  }, []);
  return <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}
