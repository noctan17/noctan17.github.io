'use client';

import { useState } from 'react';
import Section from './Section';
import { PROJECTS } from '@/lib/constants';

function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

export default function WorkSection() {
  const [active, setActive] = useState(0);
  const p = PROJECTS[active];

  return (
    <Section id="work" num="01" label="WORK" title="Selected Projects" screenLabel="03 Work">
      <p className="lead lead-cyan" style={{ marginBottom: 32 }}>
        Personal side projects built outside of my main job — exploring ideas on my own time.
      </p>
      <div className="work">
        <div className="work-list">
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.id}
              className={`work-row ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              style={{ cursor: 'pointer' }}
            >
              <span className="row-id">{proj.id}</span>
              <span className="row-title">{proj.title}</span>
              <span className="row-year">{proj.year}</span>
            </div>
          ))}
        </div>
        <div className="work-detail" key={active}>
          <div className="work-meta-row">
            <span className="work-num">{p.id}</span>
            <span className="work-year">{p.year}</span>
          </div>
          <div className="work-title-row">
            {p.icon && <img className="work-title-icon" src={p.icon} alt="" />}
            <h3>{p.title}</h3>
          </div>
          <p className="role">{p.role}</p>
          <p className="desc">{p.desc}</p>
          <div className="tags">
            {p.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
          {(p.href || p.privacyHref) && (
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              {p.href && (
                <a className="ghost-cta" href={p.href} target="_blank" rel="noreferrer">
                  <span>VIEW ON APP STORE</span>
                  <ArrowUpRight />
                </a>
              )}
              {p.privacyHref && (
                <a className="ghost-cta ghost-cta--white" href={p.privacyHref} target="_blank" rel="noreferrer">
                  <span>PRIVACY POLICY</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
