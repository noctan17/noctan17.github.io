'use client';

import { useState, useEffect, useMemo } from 'react';
import Dock from './Dock';
import { HERO_NAME, HERO_ROLE, HERO_EFFECT, SHOW_SCANLINES, SHOW_HUD, SHOW_GRID } from '@/lib/constants';

interface HeroProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

function ArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

export default function Hero({ activeSection, setActiveSection }: HeroProps) {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState(0);
  const [remaining, setRemaining] = useState({ day: 0, week: 0, year: 0 });
  const [fps, setFps] = useState(60);
  const [viewport, setViewport] = useState({ w: 0, h: 0, dpr: 1 });
  const [online, setOnline] = useState(true);

  const env = useMemo(() => {
    if (typeof window === 'undefined') {
      return { lang: 'en-US', tz: 'UTC', offStr: 'UTC+00:00', platform: 'Web', cores: '—' };
    }
    const lang = navigator.language || 'en-US';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const tzOffset = -new Date().getTimezoneOffset();
    const sign = tzOffset >= 0 ? '+' : '-';
    const offStr = `UTC${sign}${String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0')}:${String(Math.abs(tzOffset) % 60).padStart(2, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const platform = ((navigator as any).userAgentData?.platform || navigator.platform || 'Web').split(' ')[0];
    const cores = navigator.hardwareConcurrency || '—';
    return { lang, tz, offStr, platform, cores };
  }, []);

  useEffect(() => {
    const t0 = Date.now();
    const calcRemaining = () => {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
      const secDay = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
      endOfWeek.setHours(24, 0, 0, 0);
      const secWeek = Math.max(0, Math.floor((endOfWeek.getTime() - now.getTime()) / 1000));
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
      const secYear = Math.max(0, Math.floor((endOfYear.getTime() - now.getTime()) / 1000));
      setRemaining({ day: secDay, week: secWeek, year: secYear });
    };
    const t = setInterval(() => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      setUptime(Math.floor((Date.now() - t0) / 1000));
      calcRemaining();
    }, 1000);
    calcRemaining();
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let raf: number;
    let frames = 0;
    let last = performance.now();
    const loop = (now: number) => {
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

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 });
    update();
    window.addEventListener('resize', update);
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener('online', onOn);
    window.addEventListener('offline', onOff);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('online', onOn);
      window.removeEventListener('offline', onOff);
    };
  }, []);

  const showChromatic = HERO_EFFECT === 'Chromatic Glitch';
  const showMotionBlur = HERO_EFFECT === 'Motion Rush';
  const showCRT = HERO_EFFECT === 'Motion Rush';

  const hms = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const dhms = (s: number) =>
    `${Math.floor(s / 86400)}d ${String(Math.floor((s % 86400) / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <section className="hero" style={{ '--accent': '#00E5FF' } as React.CSSProperties}>
      <div className="hero-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-img base" src="/assets/hero-v2.png" alt="" />
        {showMotionBlur && <img className="hero-img motion-blur" src="/assets/hero-v2.png" alt="" />}
        {showMotionBlur && <img className="hero-img motion-blur-2" src="/assets/hero-v2.png" alt="" />}
        {showChromatic && <img className="hero-img chroma-r" src="/assets/hero-v2.png" alt="" />}
        {showChromatic && <img className="hero-img chroma-b" src="/assets/hero-v2.png" alt="" />}
      </div>

      {SHOW_SCANLINES && <div className="scanlines" />}
      {showCRT && <div className="crt-flicker" />}

      {SHOW_GRID && (
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

      {SHOW_HUD && (
        <>
          {/* TL: clock + uptime + countdowns */}
          <div className="hud-corner tl">
            <span className="hud-bracket" />
            <div className="hud-stack">
              <div className="hud-row"><span className="hud-dot rec" /><span className="hud-meta">REC · {time}</span></div>
              <div className="hud-row"><span className="hud-label">UPTIME</span><span className="hud-value">{hms(uptime)}</span></div>
              <div className="hud-row"><span className="hud-label">TZ</span><span className="hud-value">{env.offStr}</span></div>
              <div className="hud-row"><span className="hud-label">DAY LEFT</span><span className="hud-value">{hms(remaining.day)}</span></div>
              <div className="hud-row"><span className="hud-label">WEEK LEFT</span><span className="hud-value">{dhms(remaining.week)}</span></div>
              <div className="hud-row"><span className="hud-label">YEAR LEFT</span><span className="hud-value">{dhms(remaining.year)}</span></div>
            </div>
          </div>

          {/* TR: device + online */}
          <div className="hud-corner tr">
            <div className="hud-stack right">
              <div className="hud-row end">
                <span className="hud-meta">{String(env.platform).toUpperCase()} · CORES {env.cores}</span>
                <span className={`hud-dot ${online ? 'ok' : 'off'}`} />
              </div>
              <div className="hud-row end">
                <span className="hud-label">VIEWPORT</span>
                <span className="hud-value">{viewport.w}×{viewport.h} @{viewport.dpr.toFixed(1)}x</span>
              </div>
              <div className="hud-row end">
                <span className="hud-label">NET</span>
                <span className="hud-value">{online ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
            <span className="hud-bracket" />
          </div>

          {/* BL: locale + TZ */}
          <div className="hud-corner bl">
            <span className="hud-bracket" />
            <div className="hud-stack">
              <div className="hud-row"><span className="hud-label">LOCALE</span><span className="hud-value">{env.lang}</span></div>
              <div className="hud-row"><span className="hud-label">TZ</span><span className="hud-value">{env.tz}</span></div>
            </div>
          </div>

          {/* BR: FPS */}
          <div className="hud-corner br">
            <div className="hud-stack right">
              <div className="hud-row end"><span className="hud-label">FPS</span><span className="hud-value">{fps}</span></div>
              <div className="hud-row end"><span className="hud-meta">BUILD v3.0.0 · STABLE</span></div>
            </div>
            <span className="hud-bracket" />
          </div>
        </>
      )}

      <div className="hero-content">
        <h1 className="hero-title"><span className="line">{HERO_NAME}</span></h1>
        <p className="hero-sub">{HERO_ROLE}</p>
        <div className="hero-scroll-hint">
          <span>SCROLL</span>
          <span className="scroll-bar" />
        </div>
      </div>

      <Dock activeSection={activeSection} setActiveSection={setActiveSection} />
    </section>
  );
}
