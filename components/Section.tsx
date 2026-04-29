'use client';

import { useRef, useEffect, useState } from 'react';

interface SectionProps {
  id: string;
  num: string;
  label: string;
  title: string;
  screenLabel: string;
  children: React.ReactNode;
}

export default function Section({ id, num, label, title, screenLabel, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`sec${visible ? ' sec-visible' : ''}`} data-screen-label={screenLabel}>
      <div className="sec-head">
        <span className="sec-num">{num}</span>
        <span className="sec-label">{label}</span>
        <span className="sec-rule" />
      </div>
      <h2 className="sec-title">{title}</h2>
      <div className="sec-body">{children}</div>
    </section>
  );
}
