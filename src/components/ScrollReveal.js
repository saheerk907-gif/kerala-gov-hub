'use client';
import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  const transforms = {
    up:    { hidden: 'translateY(48px)', visible: 'translateY(0)' },
    down:  { hidden: 'translateY(-48px)', visible: 'translateY(0)' },
    left:  { hidden: 'translateX(48px)',  visible: 'translateX(0)' },
    right: { hidden: 'translateX(-48px)', visible: 'translateX(0)' },
    scale: { hidden: 'scale(0.92)',       visible: 'scale(1)' },
    fade:  { hidden: 'translateY(0)',     visible: 'translateY(0)' },
  };

  const t = transforms[direction] || transforms.up;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? t.visible : t.hidden,
        filter: visible ? 'blur(0px)' : 'blur(4px)',
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease`,
        transitionDelay: `${delay}ms`,
      }}>
      {children}
    </div>
  );
}
