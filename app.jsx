const { useState, useEffect, useRef, useMemo } = React;

// ---------- Tweaks defaults ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00E5FF",
  "heroEffect": "Motion Rush",
  "showScanlines": true,
  "introStyle": "Cyan Mono",
  "heroName": "NOCTANA",
  "heroRole": "Full Stack Developer",
  "showHud": true,
  "showGrid": true
}/*EDITMODE-END*/;

// ---------- Icons ----------
const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const ArrowUpRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
);
const PlayIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

// ---------- Hero (full viewport) ----------
function Hero({ tweaks, activeSection, setActiveSection }) {
  const [time, setTime] = useState("");
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [tick, setTick] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [remaining, setRemaining] = useState({ day: 0, week: 0, year: 0 });
  const [fps, setFps] = useState(60);
  const [viewport, setViewport] = useState({ w: 0, h: 0, dpr: 1 });
  const [online, setOnline] = useState(true);
  const heroRef = useRef(null);

  // Real environment info
  const env = useMemo(() => {
    const lang = (navigator.language || "en-US");
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const tzOffset = -new Date().getTimezoneOffset();
    const offStr = `UTC${tzOffset >= 0 ? "+" : "-"}${String(Math.floor(Math.abs(tzOffset)/60)).padStart(2,"0")}:${String(Math.abs(tzOffset)%60).padStart(2,"0")}`;
    const platform = (navigator.userAgentData?.platform || navigator.platform || "Web").split(" ")[0];
    const cores = navigator.hardwareConcurrency || "—";
    return { lang, tz, offStr, platform, cores };
  }, []);

  useEffect(() => {
    const t0 = Date.now();
    const calcRemaining = () => {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
      const secDay = Math.max(0, Math.floor((midnight - now) / 1000));
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
      endOfWeek.setHours(24, 0, 0, 0);
      const secWeek = Math.max(0, Math.floor((endOfWeek - now) / 1000));
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
      const secYear = Math.max(0, Math.floor((endOfYear - now) / 1000));
      setRemaining({ day: secDay, week: secWeek, year: secYear });
    };
    const t = setInterval(() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      setUptime(Math.floor((Date.now() - t0) / 1000));
      calcRemaining();
    }, 1000);
    calcRemaining();
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 120);
    return () => clearInterval(t);
  }, []);

  // FPS meter (rAF-based)
  useEffect(() => {
    let raf;
    let frames = 0;
    let last = performance.now();
    const loop = (now) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Viewport + online
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 });
    update();
    window.addEventListener("resize", update);
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", onOn);
    window.addEventListener("offline", onOff);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("online", onOn);
      window.removeEventListener("offline", onOff);
    };
  }, []);

  useEffect(() => {
    // マウス追尾は無効化
    return () => {};
  }, []);

  const parX = 0;
  const parY = 0;

  const showScanlines = tweaks.showScanlines;
  const showGlitch = false;
  const showChromatic = tweaks.heroEffect === "Chromatic Glitch";
  const showMotionBlur = tweaks.heroEffect === "Motion Rush";
  const showCRT = tweaks.heroEffect === "Motion Rush";

  return (
    <section ref={heroRef} className="hero" style={{ "--accent": tweaks.accent }}>
      <div className="hero-img-wrap" style={{ transform: `translate3d(${parX * -0.4}px, ${parY * -0.4}px, 0) scale(1.04)` }}>
        <img className="hero-img base" src="assets/hero-v2.png" alt="" />
        {showMotionBlur && <img className="hero-img motion-blur" src="assets/hero-v2.png" alt="" />}
        {showMotionBlur && <img className="hero-img motion-blur-2" src="assets/hero-v2.png" alt="" />}
        {showChromatic && <img className="hero-img chroma-r" src="assets/hero-v2.png" alt="" />}
        {showChromatic && <img className="hero-img chroma-b" src="assets/hero-v2.png" alt="" />}
      </div>

      {showScanlines && <div className="scanlines" />}
      {showCRT && <div className="crt-flicker" />}

      {tweaks.showGrid && (
        <svg className="hero-grid" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,180,210,0)" />
              <stop offset="60%" stopColor="rgba(0,180,210,0.3)" />
              <stop offset="100%" stopColor="rgba(0,180,210,0)" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="900" stroke="url(#gridFade)" strokeWidth="1" />
          ))}
          {[...Array(12)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 75} x2="1600" y2={i * 75} stroke="url(#gridFade)" strokeWidth="1" />
          ))}
        </svg>
      )}

      {tweaks.showHud && (
        <>
          {/* Top-left: REC + clock + uptime */}
          <div className="hud-corner tl">
            <span className="hud-bracket" />
            <div className="hud-stack">
              <div className="hud-row">
                <span className="hud-dot rec" />
                <span className="hud-meta">REC · {time}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">UPTIME</span>
                <span className="hud-value">{String(Math.floor(uptime/3600)).padStart(2,"0")}:{String(Math.floor(uptime/60)%60).padStart(2,"0")}:{String(uptime%60).padStart(2,"0")}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">TZ</span>
                <span className="hud-value">{env.offStr}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">DAY LEFT</span>
                <span className="hud-value">{`${String(Math.floor(remaining.day/3600)).padStart(2,"0")}:${String(Math.floor(remaining.day/60)%60).padStart(2,"0")}:${String(remaining.day%60).padStart(2,"0")}`}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">WEEK LEFT</span>
                <span className="hud-value">{`${Math.floor(remaining.week/86400)}d ${String(Math.floor(remaining.week%86400/3600)).padStart(2,"0")}:${String(Math.floor(remaining.week/60)%60).padStart(2,"0")}:${String(remaining.week%60).padStart(2,"0")}`}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">YEAR LEFT</span>
                <span className="hud-value">{`${Math.floor(remaining.year/86400)}d ${String(Math.floor(remaining.year%86400/3600)).padStart(2,"0")}:${String(Math.floor(remaining.year/60)%60).padStart(2,"0")}:${String(remaining.year%60).padStart(2,"0")}`}</span>
              </div>
            </div>
          </div>

          {/* Top-right: device/browser + online status */}
          <div className="hud-corner tr">
            <div className="hud-stack right">
              <div className="hud-row end">
                <span className="hud-meta">{env.platform.toUpperCase()} · CORES {env.cores}</span>
                <span className={`hud-dot ${online ? "ok" : "off"}`} />
              </div>
              <div className="hud-row end">
                <span className="hud-label">VIEWPORT</span>
                <span className="hud-value">{viewport.w}×{viewport.h} @{viewport.dpr.toFixed(1)}x</span>
              </div>
              <div className="hud-row end">
                <span className="hud-label">NET</span>
                <span className="hud-value">{online ? "ONLINE" : "OFFLINE"}</span>
              </div>
            </div>
            <span className="hud-bracket" />
          </div>

          {/* Bottom-left: locale + timezone */}
          <div className="hud-corner bl">
            <span className="hud-bracket" />
            <div className="hud-stack">
              <div className="hud-row">
                <span className="hud-label">LOCALE</span>
                <span className="hud-value">{env.lang}</span>
              </div>
              <div className="hud-row">
                <span className="hud-label">TZ</span>
                <span className="hud-value">{env.tz}</span>
              </div>
            </div>
          </div>

          {/* Bottom-right: FPS meter (real) */}
          <div className="hud-corner br">
            <div className="hud-stack right">
              <div className="hud-row end">
                <span className="hud-label">FPS</span>
                <span className="hud-value">{fps}</span>
              </div>
              <div className="hud-row end">
                <span className="hud-meta">BUILD v2.0.4 · STABLE</span>
              </div>
            </div>
            <span className="hud-bracket" />
          </div>
        </>
      )}

      {/* Hero content (left) */}
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="line">{tweaks.heroName}</span>
        </h1>
        <p className="hero-sub">{tweaks.heroRole}</p>
        <div className="hero-scroll-hint">
          <span>SCROLL</span>
          <span className="scroll-bar" />
        </div>
      </div>

      {/* Bottom dock — segmented nav */}
      <Dock activeSection={activeSection} setActiveSection={setActiveSection} />
    </section>
  );
}

// ---------- Dock (bottom segmented nav, replaces top nav) ----------
function Dock({ activeSection, setActiveSection }) {
  const tabs = [
    { id: "work", num: "01", label: "WORK" },
    { id: "stack", num: "02", label: "STACK" },
    { id: "contact", num: "03", label: "CONTACT" },
  ];
  const onClick = (id, e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="dock">
      <a className="dock-brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{cursor:'pointer'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 L12 2 L22 12 L12 22 Z" stroke="var(--accent)" strokeWidth="1.5"/>
          <path d="M7 12 L12 7 L17 12 L12 17 Z" fill="var(--accent)"/>
        </svg>
        <span>NOCTANA</span>
      </a>
      <div className="dock-tabs">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className={`dock-tab ${activeSection === t.id ? "active" : ""}`}
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

// ---------- Sections (scroll content under hero) ----------
function Section({ id, num, label, title, children, screenLabel }) {
  return (
    <section id={id} className="sec" data-screen-label={screenLabel}>
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

function WorkSection() {
  const [active, setActive] = useState(0);
  return (
    <Section id="work" num="01" label="WORK" title="Selected Projects" screenLabel="03 Work">
      <p className="lead lead-cyan" style={{marginBottom: 32}}>
        Personal side projects built outside of my main job — exploring ideas on my own time.
      </p>
      <div className="work">
        <div className="work-list">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`work-row ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              style={{cursor:'pointer'}}
            >
              <span className="row-id">{p.id}</span>
              <span className="row-title">{p.title}</span>
              <span className="row-year">{p.year}</span>
            </div>
          ))}
        </div>
        <div className="work-detail" key={active}>
          <div className="work-meta-row">
            <span className="work-num">{PROJECTS[active].id}</span>
            <span className="work-year">{PROJECTS[active].year}</span>
          </div>
          <div className="work-title-row">
            {PROJECTS[active].icon && (
              <img className="work-title-icon" src={PROJECTS[active].icon} alt="" />
            )}
            <h3>{PROJECTS[active].title}</h3>
          </div>
          <p className="role">{PROJECTS[active].role}</p>
          <p className="desc">{PROJECTS[active].desc}</p>
          <div className="tags">
            {PROJECTS[active].tags.map((t) => <span key={t}>{t}</span>)}
          </div>
          {(PROJECTS[active].href || PROJECTS[active].privacyHref) && (
            <div style={{display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap"}}>
              {PROJECTS[active].href && (
                <a className="ghost-cta" href={PROJECTS[active].href} target="_blank" rel="noreferrer">
                  <span>VIEW ON APP STORE</span>
                  <ArrowUpRight size={14}/>
                </a>
              )}
              {PROJECTS[active].privacyHref && (
                <a className="ghost-cta ghost-cta--white" href={PROJECTS[active].privacyHref} target="_blank" rel="noreferrer">
                  <span>PRIVACY POLICY</span>
                  <ArrowUpRight size={14}/>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function StackSection({ style }) {
  const lead = (
    <>
      Full Stack Developer with software engineering experience —
      building web applications across backend, frontend, and cloud infrastructure.
    </>
  );
  return (
    <Section id="stack" num="02" label="STACK" title="Tools & Tech" screenLabel="04 Stack">
      {style === "Cyan Mono" && (
        <p className="lead lead-cyan" style={{marginBottom: 48}}>{lead}</p>
      )}
      {style === "Dark Card" && (
        <div className="lead-card" style={{marginBottom: 48}}>
          <p className="lead">{lead}</p>
        </div>
      )}
      {style === "HUD Frame" && (
        <div className="lead-hud" style={{marginBottom: 48}}>
          <span className="lead-hud-tag">// BIO_001</span>
          <p className="lead lead-hud-text">{lead}</p>
        </div>
      )}
      <div className="stack">
        {STACK.map((g, i) => (
          <div key={g.group} className="stack-group">
            <div className="stack-head">
              <span className="num">0{i+1}</span>
              <span className="label">{g.group}</span>
            </div>
            <ul>
              {g.items.map((it) => (
                <li key={it.name}>
                  {it.icon ? (
                    <img className="stack-icon" src={`https://cdn.simpleicons.org/${it.icon}/ffffff`} alt="" />
                  ) : it.src ? (
                    <img className="stack-icon" src={it.src} alt="" />
                  ) : (
                    <span className="stack-mono" aria-hidden="true">{it.mono || "•"}</span>
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

function ContactSection() {
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = (e) => {
    e.preventDefault();
    const m = ['noctana177', 'gmail.com'].join('@');
    navigator.clipboard.writeText(m).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Section id="contact" num="03" label="CONTACT" title="Initiate Transmission" screenLabel="05 Contact">
      <div className="lead-hud-block">
        <span className="lead-hud-block-tag">// SIGNAL_INBOUND</span>
        <p className="lead lead-hud-inner">
          Taking on a small number of engagements per quarter.
          0-to-1 product, design systems, motion-heavy interfaces.
        </p>
      </div>
      <div className="social-row">
        <a className="social-pill" href="#" onClick={handleCopyEmail} aria-label="Email" style={{transition: "color 0.2s"}}>
          {copied
            ? <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
          }
          <span className="social-handle">{copied ? "COPIED!" : <>noctana177<span style={{opacity:0,fontSize:0}}>_NOSPAM_</span>@gmail.com</>}</span>
        </a>
        <a className="social-pill" href="https://github.com/noctan17" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.37.5.5 5.37.5 12c0 5.25 3.38 9.69 8 11.25.59.1.8-.25.8-.5 0-.27-.01-1.18-.02-2.14-3.25.71-3.93-1.57-3.93-1.57-.53-1.33-1.29-1.68-1.29-1.68-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.49-.28-5.12-1.25-5.12-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.4.11-2.91 0 0 .94-.3 3.08 1.16a10.71 10.71 0 0 1 2.81-.38c.95.004 1.91.13 2.81.38 2.14-1.46 3.08-1.16 3.08-1.16.61 1.51.23 2.63.11 2.91.72.79 1.16 1.79 1.16 3.02 0 4.35-2.63 5.27-5.12 5.55.42.36.79 1.07.79 2.16 0 1.56-.01 2.81-.01 3.19 0 .26.2.61.8.5 4.62-1.56 8-5 8-11.25C23.5 5.37 18.63.5 12 .5z"/>
          </svg>
          <span className="social-handle">@noctan17</span>
        </a>
        <a className="social-pill" href="https://x.com/djsoszhsow" target="_blank" rel="noreferrer" aria-label="X">
          <svg viewBox="0 0 1200 1227" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>
          </svg>
          <span className="social-handle">@djsoszhsow</span>
        </a>
        <a className="social-pill" href="https://apps.apple.com/jp/app/kataribe-%E6%AD%B4%E5%8F%B2%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%E6%95%A3%E7%AD%96%E3%83%9E%E3%83%83%E3%83%97/id6759606727" target="_blank" rel="noreferrer" aria-label="App Store">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M17.05 12.04c-.03-2.93 2.4-4.34 2.51-4.41-1.37-2-3.5-2.27-4.26-2.31-1.81-.18-3.54 1.07-4.46 1.07-.93 0-2.34-1.04-3.85-1.01-1.98.03-3.82 1.15-4.84 2.92-2.07 3.59-.53 8.9 1.49 11.81.99 1.43 2.17 3.02 3.71 2.97 1.49-.06 2.05-.96 3.85-.96 1.79 0 2.31.96 3.88.93 1.6-.03 2.61-1.45 3.59-2.88 1.13-1.65 1.6-3.25 1.62-3.34-.04-.02-3.11-1.19-3.14-4.79zM14.4 3.39c.81-.99 1.36-2.36 1.21-3.73-1.17.05-2.6.78-3.44 1.76-.75.86-1.41 2.27-1.23 3.6 1.31.1 2.65-.66 3.46-1.63z"/>
          </svg>
          <span className="social-handle">KATARIBE</span>
        </a>
      </div>
    </Section>
  );
}

// ---------- Detail panel (right side) ----------
const PROJECTS = [
  {
    id: "P-001", year: "2026", title: "KATARIBE",
    icon: "assets/kataribe-icon.png",
    role: "Solo Developer · Designer",
    desc: "AI-guided historical-spot map app for iOS. SwiftUI client + AWS Lambda backend. AI character \"Kunato\" narrates landmarks via Bedrock; map shows nearby castles, shrines, and battlefields from your location.",
    tags: ["SWIFTUI", "LAMBDA", "BEDROCK", "AI"],
    href: "https://apps.apple.com/jp/app/kataribe-%E6%AD%B4%E5%8F%B2%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%E6%95%A3%E7%AD%96%E3%83%9E%E3%83%83%E3%83%97/id6759606727",
    privacyHref: "https://noctan17.github.io/kataribe/privacy/",
  },
  {
    id: "P-002", year: "2025", title: "TexCrafter",
    role: "Solo Developer · In Development",
    desc: "A LaTeX editor for university students and researchers. Real-time preview, project management, and citation handling. Built with React on the front and Node.js on the back.",
    tags: ["REACT", "NODE.JS", "LATEX", "WIP"],
    href: null,
  },
  {
    id: "P-003", year: "2024", title: "noctana-web",
    role: "Solo Developer",
    desc: "Personal portfolio site. React + Vite + Tailwind CSS, deployed on Firebase Hosting via GitHub Actions. Simple static site that introduces myself.",
    tags: ["REACT", "VITE", "TAILWIND", "FIREBASE"],
    href: null,
  },
];

const STACK = [
  { group: "BACKEND", items: [
    { name: "Python", icon: "python", level: "EXPERT" },
    { name: "Java", icon: null, src: "assets/icon-java.png" },
    { name: "Scala", icon: "scala" },
    { name: "Node.js", icon: "nodedotjs" },
    { name: "PostgreSQL", icon: "postgresql" },
  ] },
  { group: "FRONTEND", items: [
    { name: "TypeScript", icon: "typescript" },
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextdotjs" },
    { name: "Vue", icon: "vuedotjs" },
    { name: "Tailwind CSS", icon: "tailwindcss" },
  ] },
  { group: "CLOUD / INFRA", items: [
    { name: "AWS", icon: null, src: "assets/icon-aws.png", level: "EXPERT" },
    { name: "Snowflake", icon: "snowflake" },
    { name: "Terraform", icon: "terraform" },
    { name: "Docker", icon: "docker" },
    { name: "Linux", icon: "linux" },
    { name: "GitHub Actions", icon: "githubactions" },
  ] },
];

function DetailPanel({ activeTab }) {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <aside className="panel">
      <div className="panel-header">
        <span className="panel-id">// {activeTab.toUpperCase()}_BUFFER</span>
        <span className="panel-status">● LIVE</span>
      </div>

      <div className="panel-body" key={activeTab}>
        {activeTab === "intro" && (
          <div className="tab intro">
            <p className="lead">
              Full-stack engineer treating the whole stack as one surface — from
              schema design to the last 2px of an animation curve.
            </p>
            <p>
              Nine years shipping production systems that stay calm under load.
              I write the migration <i>and</i> the empty state.
            </p>
            <div className="stat-row">
              <div><b>09</b><span>YEARS</span></div>
              <div><b>32</b><span>SHIPPED</span></div>
              <div><b>2.4M</b><span>USERS</span></div>
            </div>
            <a className="ghost-cta" href="#contact">
              <span>INITIATE TRANSMISSION</span>
              <ArrowRight size={14}/>
            </a>
          </div>
        )}

        {activeTab === "work" && (
          <div className="tab work">
            <div className="work-list">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  className={`work-row ${i === activeProject ? "active" : ""}`}
                  onMouseEnter={() => setActiveProject(i)}
                >
                  <span className="row-id">{p.id}</span>
                  <span className="row-title">{p.title}</span>
                  <span className="row-year">{p.year}</span>
                </button>
              ))}
            </div>
            <div className="work-detail">
              <div className="work-meta-row">
                <span className="work-num">{PROJECTS[activeProject].id}</span>
                <span className="work-year">{PROJECTS[activeProject].year}</span>
              </div>
              <h3>{PROJECTS[activeProject].title}</h3>
              <p className="role">{PROJECTS[activeProject].role}</p>
              <p className="desc">{PROJECTS[activeProject].desc}</p>
              <div className="tags">
                {PROJECTS[activeProject].tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          </div>
        )}

        {activeTab === "stack" && (
          <div className="tab stack">
            {STACK.map((g, i) => (
              <div key={g.group} className="stack-group">
                <div className="stack-head">
                  <span className="num">0{i+1}</span>
                  <span className="label">{g.group}</span>
                </div>
                <ul>
                  {g.items.map((it) => <li key={it}><span className="bullet"/>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contact" && (
          <div className="tab contact">
            <p className="lead">
              Taking on a small number of engagements per quarter.
              0-to-1 product, design systems, motion-heavy interfaces.
            </p>
            <a className="contact-mail" href="mailto:hello@noctan17.dev">
              <span>hello@noctan17.dev</span>
              <ArrowUpRight size={18}/>
            </a>
            <div className="links">
              <a href="https://github.com/noctan17" target="_blank" rel="noreferrer"><span>GITHUB</span>noctan17</a>
              <a href="https://apps.apple.com/jp/app/kataribe-%E6%AD%B4%E5%8F%B2%E3%82%B9%E3%83%9D%E3%83%83%E3%83%88%E6%95%A3%E7%AD%96%E3%83%9E%E3%83%83%E3%83%97/id6759606727" target="_blank" rel="noreferrer"><span>APP STORE</span>KATARIBE</a>
              <a><span>X</span>@noctan17</a>
              <a><span>RESUME</span>·pdf</a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ---------- Tweaks panel ----------
function TweaksUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Identity">
        <TweakText label="Name" value={tweaks.heroName} onChange={(v) => setTweak("heroName", v)} />
        <TweakText label="Role" value={tweaks.heroRole} onChange={(v) => setTweak("heroRole", v)} />
      </TweakSection>
      <TweakSection label="Look">
        <TweakColor label="Accent" value={tweaks.accent} onChange={(v) => setTweak("accent", v)} />
        <TweakSelect
          label="Hero effect"
          value={tweaks.heroEffect}
          options={["Motion Rush", "Chromatic Glitch", "Clean"]}
          onChange={(v) => setTweak("heroEffect", v)}
        />
        <TweakToggle label="Scanlines" value={tweaks.showScanlines} onChange={(v) => setTweak("showScanlines", v)} />
        <TweakSelect
          label="Intro style"
          value={tweaks.introStyle}
          options={["Cyan Mono", "Dark Card", "HUD Frame"]}
          onChange={(v) => setTweak("introStyle", v)}
        />
        <TweakToggle label="Grid" value={tweaks.showGrid} onChange={(v) => setTweak("showGrid", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ---------- App ----------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeSection, setActiveSection] = useState("work");
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks.accent]);

  // scroll-spy: highlight dock tab for current section
  useEffect(() => {
    const ids = ["work", "stack", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="page" data-screen-label="01 Portfolio">
      <Hero tweaks={tweaks} activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="sections">
        <WorkSection />
        <StackSection style={tweaks.introStyle} />
        <ContactSection />
      </main>
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
