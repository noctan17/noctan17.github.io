'use client';

interface DockProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const TABS = [
  { id: 'work', num: '01', label: 'WORK' },
  { id: 'stack', num: '02', label: 'STACK' },
  { id: 'contact', num: '03', label: 'CONTACT' },
];

export default function Dock({ activeSection, setActiveSection }: DockProps) {
  const onClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="dock">
      <a
        className="dock-brand"
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 L12 2 L22 12 L12 22 Z" stroke="var(--accent)" strokeWidth="1.5"/>
          <path d="M7 12 L12 7 L17 12 L12 17 Z" fill="var(--accent)"/>
        </svg>
        <span>NOCTANA</span>
      </a>
      <div className="dock-tabs">
        {TABS.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className={`dock-tab ${activeSection === t.id ? 'active' : ''}`}
            onClick={(e) => onClick(t.id, e)}
          >
            <i>{t.num}</i>
            <span>{t.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
