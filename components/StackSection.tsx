import Section from './Section';
import { STACK } from '@/lib/constants';

export default function StackSection() {
  const lead = (
    <>
      Full Stack Developer with software engineering experience —
      building web applications across backend, frontend, and cloud infrastructure.
    </>
  );

  return (
    <Section id="stack" num="02" label="STACK" title="Tools & Tech" screenLabel="04 Stack">
      <p className="lead lead-cyan" style={{ marginBottom: 48 }}>{lead}</p>
      <div className="stack">
        {STACK.map((g, i) => (
          <div key={g.group} className="stack-group">
            <div className="stack-head">
              <span className="num">0{i + 1}</span>
              <span className="label">{g.group}</span>
            </div>
            <ul>
              {g.items.map((it) => (
                <li key={it.name}>
                  {it.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="stack-icon" src={`https://cdn.simpleicons.org/${it.icon}/ffffff`} alt="" />
                  ) : it.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="stack-icon" src={it.src} alt="" />
                  ) : (
                    <span className="stack-mono" aria-hidden="true">{it.mono ?? '•'}</span>
                  )}
                  <span className="stack-name">{it.name}</span>
                  {it.level && <span className="stack-level">{it.level}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
