'use client';

import { useState, useRef } from 'react';
import Section from './Section';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdayqykn';

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        formRef.current?.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.92)',
    fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
    fontSize: '13px',
    letterSpacing: '0.05em',
    padding: '12px 16px',
    outline: 'none',
    borderRadius: 0,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
    fontSize: '10px',
    letterSpacing: '0.25em',
    color: 'rgba(0,229,255,0.7)',
    marginBottom: '6px',
  };

  return (
    <div style={{
      marginTop: 40,
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.22)',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      padding: '32px',
    }}>
      <div style={{ marginBottom: 24, fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(0,229,255,0.7)' }}>
        // CONTACT_FORM
      </div>

      {status === 'sent' ? (
        <div style={{ textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace', fontSize: '13px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)' }}>
          TRANSMISSION SENT ✓
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>NAME</label>
            <input name="name" type="text" required placeholder="your name" style={inputStyle} className="contact-input" />
          </div>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input name="email" type="email" required placeholder="your@email.com" style={inputStyle} className="contact-input" />
          </div>
          <div>
            <label style={labelStyle}>MESSAGE</label>
            <textarea name="message" required rows={5} placeholder="your message..." style={{ ...inputStyle, resize: 'vertical' }} className="contact-input" />
          </div>
          {status === 'error' && (
            <p style={{ fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,80,80,0.8)', letterSpacing: '0.1em', margin: 0 }}>
              TRANSMISSION FAILED — try again
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="ghost-cta"
            style={{ alignSelf: 'flex-start', opacity: status === 'sending' ? 0.5 : 1 }}
          >
            <span>{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}

function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const m = ['noctana177', 'gmail.com'].join('@');
    navigator.clipboard.writeText(m).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Section id="contact" num="03" label="CONTACT" title="Initiate Transmission" screenLabel="05 Contact">
      <p className="lead lead-cyan" style={{ marginBottom: 32 }}>
        Taking on a small number of engagements per quarter.
        0-to-1 product, design systems, motion-heavy interfaces.
      </p>
      <div className="social-row">
        <a className="social-pill" href="#" onClick={handleCopyEmail} aria-label="Email" style={{ transition: 'color 0.2s' }}>
          {copied
            ? <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
          }
          <span className="social-handle">
            {copied ? 'COPIED!' : <><span>noctana177</span><span style={{ opacity: 0, fontSize: 0 }}>_NOSPAM_</span><span>@gmail.com</span></>}
          </span>
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
      <ContactForm />
    </Section>
  );
}
