'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { AuryaLogo, SparkleWave, Ornament } from './shared';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TweakValues {
  radius?: number;
  sensitivity?: number;
  glitter?: number;
  heroScale?: number;
  metalTone?: string;
  darkCatalog?: boolean;
}

/* ===================== HERO ===================== */
interface HeroSectionProps {
  onCatalog: () => void;
  tweaks?: TweakValues;
}

function HeroSection({ onCatalog, tweaks }: HeroSectionProps) {
  const heroScale = ((tweaks?.heroScale) ?? 100) / 100;
  const glitter   = ((tweaks?.glitter)   ?? 100) / 100;

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const cueRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [eyebrowRef, logoRef, taglineRef, ctaRef, cueRef].map(r => r.current).filter(Boolean);
      gsap.set(els, { opacity: 0, y: 22 });
      gsap.timeline({ delay: 0.1 })
        .to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' })
        .to(logoRef.current,     { opacity: 1, y: 0, duration: 1.05, ease: 'power2.out' }, '-=0.5')
        .to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, '-=0.55')
        .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.45')
        .to(cueRef.current,      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.3');
    });
    return () => ctx.revert();
  }, []);

  return (
    <section data-screen-label="01 Hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(80px, 12vh, 140px) clamp(20px, 5vw, 32px) clamp(80px, 10vh, 96px)' }}>

      {/* Sparkle waves */}
      <div className="absolute pointer-events-none" style={{ top: '12%', left: '-10%', right: '-10%', opacity: .55 * glitter }}>
        <SparkleWave width={1600} height={320} density={Math.round(420 * glitter)} seed={3} />
      </div>
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '-15%', right: '-5%', opacity: .35 * glitter }}>
        <SparkleWave width={1600} height={260} density={Math.round(300 * glitter)} seed={7} flip />
      </div>

      {/* Eyebrow */}
      <div ref={eyebrowRef} className="relative flex items-center justify-center gap-4 z-[2] mb-10 sm:mb-12 w-full" style={{ textAlign: 'center' }}>
        <span style={{ width: 32, height: 1, background: 'var(--ink-3)' }} />
        <span className="label">Coleção 2026 — Edição Limitada</span>
        <span style={{ width: 32, height: 1, background: 'var(--ink-3)' }} />
      </div>

      {/* Logo */}
      <div ref={logoRef} className="relative z-[2]">
        <div className="origin-top scale-[0.52] xs:scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100"
             style={{ transition: 'transform .3s ease' }}>
          <div style={{ transform: `scale(${heroScale})`, transformOrigin: 'center top', transition: 'transform .4s ease' }}>
            <AuryaLogo size="xl" />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p ref={taglineRef} className="ff-serif relative z-[2] italic font-light text-center max-w-xl leading-relaxed mt-10 sm:mt-14"
         style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: 'var(--ink-1)', letterSpacing: '0.02em' }}>
        Peças que iluminam quem você é —<br/>
        joias artesanais em prata legítima.
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="relative z-[2] mt-10 sm:mt-14">
        <button className="cta" onClick={onCatalog}>
          <span>Explorar Catálogo</span>
          <span className="cta__arrow" />
        </button>
      </div>

      {/* Scroll cue */}
      <div ref={cueRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2]">
        <span className="label" style={{ fontSize: 9 }}>Role para descobrir</span>
        <span style={{ width: 1, height: 28, background: 'linear-gradient(180deg, var(--ink-3) 0%, transparent 100%)', animation: 'scrollPulse 2.5s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: .4; transform: scaleY(.6); transform-origin: top; }
          50%       { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}

/* ===================== SOBRE ===================== */
function SobreSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const imgBoxRef     = useRef<HTMLDivElement>(null);
  const imgInnerRef   = useRef<HTMLDivElement>(null);
  const mobileImgRef  = useRef<HTMLImageElement>(null);
  const labelRef      = useRef<HTMLSpanElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const bodyRef       = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 };

      if (window.innerWidth >= 1024) {
        gsap.to(imgInnerRef.current, { y: -80, ease: 'none', scrollTrigger: st });
      } else {
        gsap.fromTo(mobileImgRef.current,
          { yPercent: -10 },
          { yPercent: 10, ease: 'none', scrollTrigger: st },
        );
      }

      gsap.fromTo(
        [labelRef, headingRef, bodyRef, statsRef].map(r => r.current).filter(Boolean),
        { opacity: 0, y: 38 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.13,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="sobre" data-screen-label="02 Sobre" ref={sectionRef}
      className="relative overflow-hidden">

      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 50%, var(--bg-0) 100%)' }} />

      {/* Mobile: imagem full-bleed com parallax lento */}
      <div className="relative block lg:hidden w-full overflow-hidden"
           style={{ height: 'clamp(220px, 65vw, 360px)' }}>
        <img ref={mobileImgRef} src="/sobre.jpg" alt="Joias Aurya"
             style={{
               position: 'absolute',
               top: '-15%', left: 0,
               width: '100%', height: '130%',
               objectFit: 'cover', objectPosition: 'center',
               willChange: 'transform',
             }} />
      </div>

      {/* Área de conteúdo */}
      <div className="relative w-full flex items-center justify-center lg:min-h-screen"
           style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 32px) clamp(80px, 10vh, 140px)' }}>

        <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 items-center"
             style={{ gap: 'clamp(40px, 6vw, 100px)' }}>

          {/* Desktop: imagem com paralaxe */}
          <div ref={imgBoxRef} className="relative overflow-hidden hidden lg:block"
               style={{ height: 'clamp(240px, 40vw, 620px)' }}>
            <div ref={imgInnerRef} className="absolute left-0 right-0 overflow-hidden"
                 style={{ top: -80, bottom: -80, background: '#eae9e4' }}>
              <img src="/sobre.jpg" alt="Joias Aurya"
                   className="w-full h-full"
                   style={{ objectFit: 'contain', objectPosition: 'center', background: '#eae9e4' }} />
            </div>
          </div>

          {/* Copy */}
          <div>
            <span ref={labelRef} className="label block mb-8">— Sobre a Aurya</span>
            <h2 ref={headingRef} className="ff-display metal-text font-medium leading-[1.05] tracking-[0.02em] mb-9"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
              Brilho que<br/>nasce do cuidado.
            </h2>
            <div ref={bodyRef}>
              <p className="ff-serif font-light leading-relaxed mb-6 max-w-[480px]"
                 style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--ink-1)' }}>
                Cada peça é desenhada e selecionada por <em>Valquíria Wisniewski Konzen</em> — uma ode discreta ao que é precioso. Prata legítima, acabamento à mão e um olhar atento ao detalhe que valoriza quem usa.
              </p>
              <p className="ff-serif font-light leading-relaxed mb-12 max-w-[480px]"
                 style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--ink-1)' }}>
                Não vendemos joias. Compomos memórias para serem usadas.
              </p>
            </div>
            <div ref={statsRef} className="flex gap-8 sm:gap-14 flex-wrap">
              {[
                { n: '08',   l: 'Anos de\nofício' },
                { n: '120+', l: 'Peças únicas\nlançadas' },
                { n: '950',  l: 'Clientes\natendidas' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="ff-display metal-text font-medium leading-none"
                       style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>{s.n}</div>
                  <div className="label mt-2 whitespace-pre-line" style={{ fontSize: 9.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== NEWSLETTER ===================== */
function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topWaveRef = useRef<HTMLDivElement>(null);
  const btmWaveRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(topWaveRef.current,
        { x: -150, opacity: 0.15 },
        { x: 0, opacity: 0.9, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'center 60%', scrub: 1.5 } }
      );
      gsap.fromTo(btmWaveRef.current,
        { x: 150, opacity: 0.15 },
        { x: 0, opacity: 0.9, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'center 60%', scrub: 1.5 } }
      );
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.96, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.from('subscribers').insert({ email: email.trim() });
      if (err) {
        const isDuplicate =
          err.code === '23505' ||
          err.message?.toLowerCase().includes('duplicate') ||
          err.message?.toLowerCase().includes('already exists');
        if (isDuplicate) {
          setError('Este e-mail já está cadastrado.');
          setLoading(false);
          return;
        }
        console.warn('[Newsletter] Supabase error:', err.message);
      }
    } catch (ex) {
      console.warn('[Newsletter] Exception:', ex);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="newsletter" data-screen-label="03 Newsletter" ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(20px, 5vw, 32px)',
               background: 'linear-gradient(180deg, var(--bg-0) 0%, #dedcd6 50%, var(--bg-0) 100%)' }}>

      <div ref={topWaveRef} className="absolute pointer-events-none" style={{ top: '8%', left: '-10%', right: '-10%' }}>
        <SparkleWave width={1600} height={240} density={360} seed={11} />
      </div>
      <div ref={btmWaveRef} className="absolute pointer-events-none" style={{ bottom: '8%', left: '-10%', right: '-10%' }}>
        <SparkleWave width={1600} height={240} density={360} seed={13} flip />
      </div>

      <div ref={contentRef} className="relative text-center w-full max-w-[720px] mx-auto px-2">
        <span className="ff-script block mb-2"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', background: 'var(--metal-grad-soft)',
                       WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                       filter: 'drop-shadow(0 2px 4px rgba(50,55,60,.15))' }}>
          Para você que aprecia o singular —
        </span>

        <h2 className="ff-display metal-text font-medium tracking-[0.06em] leading-none my-6"
            style={{ fontSize: 'clamp(40px, 9vw, 96px)' }}>
          NEWSLETTER
        </h2>

        <div className="mx-auto" style={{ width: 'fit-content' }}><Ornament width={180} /></div>

        <p className="ff-serif font-light leading-relaxed max-w-[520px] mx-auto mt-8"
           style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'var(--ink-1)' }}>
          Receba primeiro lançamentos exclusivos, drops de edição limitada e pequenos rituais de cuidado para suas peças.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}
                className="flex flex-col items-stretch mt-12 mx-auto max-w-[520px]" style={{ gap: 8 }}>
            <div className="flex items-stretch"
                 style={{ border: '1px solid var(--ink-3)', background: 'rgba(255,255,255,.4)', backdropFilter: 'blur(6px)' }}>
              <input type="email" required placeholder="seu melhor e-mail"
                     value={email} onChange={(e) => setEmail(e.target.value)}
                     className="ff-serif flex-1 min-w-0 bg-transparent border-none outline-none italic"
                     style={{ padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 24px)', fontSize: 16, color: 'var(--ink-0)' }} />
              <button type="submit" disabled={loading}
                      className="ff-sans uppercase tracking-[0.16em] text-[11px] text-white border-none cursor-pointer shrink-0"
                      style={{ padding: '0 clamp(14px, 3vw, 28px)', background: 'var(--metal-grad)', opacity: loading ? 0.7 : 1 }}>
                {loading ? '...' : 'Inscrever'}
              </button>
            </div>
            {error && <p className="ff-sans text-center" style={{ fontSize: 11, color: '#b45', letterSpacing: '0.08em' }}>{error}</p>}
          </form>
        ) : (
          <div className="mt-12 mx-auto max-w-[520px] p-6"
               style={{ border: '1px solid var(--silver-1)', background: 'rgba(255,255,255,.5)' }}>
            <span className="ff-script block text-2xl" style={{ color: 'var(--ink-1)' }}>Bem-vinda!</span>
            <p className="ff-serif text-base mt-1" style={{ color: 'var(--ink-1)' }}>
              Sua inscrição foi confirmada. Em breve, novidades cintilantes.
            </p>
          </div>
        )}

        <p className="label mt-6" style={{ fontSize: 9 }}>Sem spam · Sem ruído · Apenas o essencial</p>
      </div>
    </section>
  );
}

/* ===================== CONTATO ===================== */
function ContatoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const ornRef     = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftRef, ornRef, rightRef].map(r => r.current).filter(Boolean),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.16,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="contato" data-screen-label="04 Contato" ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(20px, 5vw, 32px) 80px', background: 'var(--bg-0)' }}>

      <div className="relative w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center"
           style={{ gap: 'clamp(40px, 5vw, 80px)' }}>

        {/* Esquerda */}
        <div ref={leftRef}>
          <span className="label block mb-6">— Contato</span>
          <h2 className="ff-display metal-text font-medium leading-[1.05] tracking-[0.02em] mb-7"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}>
            Vamos conversar.
          </h2>
          <p className="ff-serif font-light leading-relaxed mb-9"
             style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'var(--ink-1)' }}>
            Atendimento personalizado via WhatsApp. Tire dúvidas, peça uma encomenda especial ou reserve uma peça exclusiva.
          </p>
          <div className="flex flex-col gap-[18px]">
            <ContactRow label="Instagram" value="@aurya.val"                href="https://instagram.com/aurya.val" />
            <ContactRow label="WhatsApp"  value="+55 46 9 9901-3150"        href="https://wa.me/5546999013150" />
            <ContactRow label="Atelier"   value="XV de Novembro 1122, Ampére · PR" href="https://maps.google.com/?q=XV+de+Novembro+1122,+Ampere,+PR" />
            <ContactRow label="Horário"   value="Seg–Sex · 9h às 18h" />
          </div>
          <a href="https://wa.me/5546999013150" target="_blank" rel="noopener noreferrer" className="cta mt-12 inline-flex" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Falar no WhatsApp</span>
            <span className="cta__arrow" />
          </a>
        </div>

        {/* Ornamento vertical — oculto no mobile */}
        <div ref={ornRef} className="hidden lg:block">
          <Ornament vertical />
        </div>

        {/* QR card */}
        <div ref={rightRef} className="relative"
             style={{ padding: 'clamp(24px, 4vw, 40px)', background: 'var(--bg-1)',
                      border: '1px solid var(--ink-3)', boxShadow: 'var(--shadow-soft)' }}>
          <div className="absolute pointer-events-none" style={{ top: -10, left: -10, right: -10, opacity: .5 }}>
            <SparkleWave width={400} height={60} density={120} seed={21} />
          </div>
          <div className="absolute pointer-events-none" style={{ bottom: -10, left: -10, right: -10, opacity: .5 }}>
            <SparkleWave width={400} height={60} density={120} seed={23} flip />
          </div>
          <div className="relative flex flex-col items-center gap-5">
            <AuryaLogo size="sm" showJoias={false} showTag={false} />
            <span className="label">Escaneie · WhatsApp</span>
            <a href="https://wa.me/5546999013150" target="_blank" rel="noopener noreferrer"
               style={{ display: 'block', width: 200, height: 200, padding: 16, background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.08)' }}>
              <img src="/qr-whatsapp.png" alt="QR Code WhatsApp Aurya" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            </a>
            <span className="ff-display" style={{ fontSize: 13, letterSpacing: '0.32em',
                             background: 'var(--metal-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              @AURYA.VAL
            </span>
          </div>
        </div>
      </div>

      {/* Footer micro */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center"
           style={{ padding: '0 clamp(20px, 5vw, 48px)' }}>
        <span className="label" style={{ fontSize: 9 }}>© 2026 Joias Aurya · Todos os direitos reservados</span>
        <span className="ff-script hidden sm:block" style={{ fontSize: 22, color: 'var(--ink-2)' }}>Com carinho, Equipe Aurya</span>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-baseline gap-4 pb-[14px]" style={{ borderBottom: '1px solid var(--ink-3)' }}>
      <span className="label" style={{ width: 110, fontSize: 9.5 }}>{label}</span>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer"
             className="ff-serif" style={{ fontSize: 19, color: 'var(--ink-0)', textDecoration: 'none', transition: 'color .2s' }}
             onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--ink-1)'}
             onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--ink-0)'}>
            {value}
          </a>
        : <span className="ff-serif" style={{ fontSize: 19, color: 'var(--ink-0)' }}>{value}</span>
      }
    </div>
  );
}

interface HomeViewProps {
  onNavigate: (view: string, target?: string) => void;
  scrollTarget: string | null;
  tweaks?: TweakValues;
}

export function HomeView({ onNavigate, scrollTarget, tweaks }: HomeViewProps) {
  useEffect(() => {
    if (!scrollTarget) return;
    if (scrollTarget === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(scrollTarget);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
  }, [scrollTarget]);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <HeroSection onCatalog={() => onNavigate('catalog')} tweaks={tweaks} />
      <SobreSection />
      <NewsletterSection />
      <ContatoSection />
    </div>
  );
}
