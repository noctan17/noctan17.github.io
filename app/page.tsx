'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import WorkSection from '@/components/WorkSection';
import StackSection from '@/components/StackSection';
import ContactSection from '@/components/ContactSection';

const SECTION_IDS = ['work', 'stack', 'contact'];

export default function Page() {
  const [activeSection, setActiveSection] = useState('work');

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page" data-screen-label="01 Portfolio">
      <Hero activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="sections">
        <WorkSection />
        <StackSection />
        <ContactSection />
      </main>
    </div>
  );
}
