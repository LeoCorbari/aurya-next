'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate } from 'framer-motion';
import gsap from 'gsap';
import { fetchCatalogData } from '@/lib/catalog-cache';
import { JewelryPlaceholder } from './shared';

/* ===================== Static fallback data ===================== */
const PIECES = [
  { id: 'p1',  name: 'Anel Lumen',         shape: 'ring',     price: 'R$ 489',  category: 'Anéis',     desc: 'Prata 925 com torção fina', image_url: '', video_url: '' },
  { id: 'p2',  name: 'Pingente Aurora',    shape: 'pendant',  price: 'R$ 612',  category: 'Pingentes', desc: 'Gota cinzelada à mão', image_url: '', video_url: '' },
  { id: 'p3',  name: 'Argolas Lis',        shape: 'earring',  price: 'R$ 358',  category: 'Brincos',   desc: 'Argola alongada · 3cm', image_url: '', video_url: '' },
  { id: 'p4',  name: 'Pulseira Veneza',    shape: 'bracelet', price: 'R$ 745',  category: 'Pulseiras', desc: 'Elos veneziana · 19cm', image_url: '', video_url: '' },
  { id: 'p5',  name: 'Colar Sereno',       shape: 'necklace', price: 'R$ 892',  category: 'Colares',   desc: 'Cordão duplo · 45cm', image_url: '', video_url: '' },
  { id: 'p6',  name: 'Anel Coração',       shape: 'ring',     price: 'R$ 425',  category: 'Anéis',     desc: 'Trançado com pingente', image_url: '', video_url: '' },
  { id: 'p7',  name: 'Pingente Lágrima',   shape: 'pendant',  price: 'R$ 589',  category: 'Pingentes', desc: 'Acabamento fosco', image_url: '', video_url: '' },
  { id: 'p8',  name: 'Brinco Estela',      shape: 'earring',  price: 'R$ 412',  category: 'Brincos',   desc: 'Argola oval · 2.5cm', image_url: '', video_url: '' },
  { id: 'p9',  name: 'Pulseira Atelier',   shape: 'bracelet', price: 'R$ 698',  category: 'Pulseiras', desc: 'Esferas polidas · 18cm', image_url: '', video_url: '' },
  { id: 'p10', name: 'Colar Etérea',       shape: 'necklace', price: 'R$ 1.140',category: 'Colares',   desc: 'Pingente em gota · 50cm', image_url: '', video_url: '' },
  { id: 'p11', name: 'Anel Solène',        shape: 'ring',     price: 'R$ 538',  category: 'Anéis',     desc: 'Aro liso · acabamento espelhado', image_url: '', video_url: '' },
  { id: 'p12', name: 'Pingente Ofélia',    shape: 'pendant',  price: 'R$ 672',  category: 'Pingentes', desc: 'Coração liso polido', image_url: '', video_url: '' },
  { id: 'p13', name: 'Brinco Mira',        shape: 'earring',  price: 'R$ 392',  category: 'Brincos',   desc: 'Argola ondulada', image_url: '', video_url: '' },
  { id: 'p14', name: 'Colar Florença',     shape: 'necklace', price: 'R$ 985',  category: 'Colares',   desc: 'Veneziana fina · 42cm', image_url: '', video_url: '' },
  { id: 'p15', name: 'Piercing Luna',      shape: 'earring',  price: 'R$ 198',  category: 'Piercings', desc: 'Tragus · prata 925', image_url: '', video_url: '' },
  { id: 'p16', name: 'Piercing Orion',     shape: 'ring',     price: 'R$ 224',  category: 'Piercings', desc: 'Helix · aro fino · 8mm', image_url: '', video_url: '' },
];

const CATS = ['Todos', 'Colares', 'Anéis', 'Pingentes', 'Brincos', 'Pulseiras', 'Piercings'];

interface PieceData {
  id: string;
  name: string;
  shape: string;
  price: string;
  category: string;
  desc: string;
  image_url: string;
  video_url: string;
  [key: string]: unknown;
}

interface TweakValues {
  radius?: number;
  sensitivity?: number;
  glitter?: number;
  heroScale?: number;
  metalTone?: string;
  darkCatalog?: boolean;
}

/* ===================== CylinderCard ===================== */
interface CylinderCardProps {
  piece: PieceData;
  index: number;
  active: boolean;
}

function CylinderCard({ piece, index, active }: CylinderCardProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!active || !piece.video_url) { setShowVideo(false); return; }
    const t = setTimeout(() => setShowVideo(true), 500);
    return () => { clearTimeout(t); setShowVideo(false); };
  }, [active, piece.video_url]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (showVideo) { v.currentTime = 0; v.play().catch(() => {}); }
    else { v.pause(); }
  }, [showVideo]);

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      background: 'linear-gradient(180deg, #1f2126 0%, #14161a 100%)',
      border: active ? '1px solid rgba(220,224,228,.55)' : '1px solid rgba(220,224,228,.12)',
      boxShadow: active
        ? '0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 60px rgba(180,190,200,.08)'
        : '0 16px 40px rgba(0,0,0,.4)',
      transition: 'border-color .3s ease, box-shadow .3s ease',
      overflow: 'hidden',
      cursor: active ? 'pointer' : 'inherit',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ flex: '1 1 auto', position: 'relative', margin: 14, marginBottom: 0, overflow: 'hidden' }}>
        {piece.image_url
          ? <Image src={piece.image_url} alt={piece.name} fill sizes="260px" loading={active ? 'eager' : 'lazy'} style={{ objectFit: 'cover', objectPosition: 'center' }} />
          : <JewelryPlaceholder piece={piece} depth={active ? 1 : 0.78} />
        }
        {piece.video_url && active && (
          <video ref={videoRef} src={piece.video_url} muted loop playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: showVideo ? 1 : 0,
              transition: 'opacity .45s ease',
              pointerEvents: 'none',
            }} />
        )}
      </div>

      <div style={{
        flex: '0 0 auto',
        padding: '14px 20px 18px',
        color: '#e8e9eb',
        borderTop: '1px solid rgba(232,233,235,.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: 9, letterSpacing: '0.32em',
          textTransform: 'uppercase', color: 'rgba(232,233,235,.5)', marginBottom: 6,
        }}>
          {piece.category} · Nº {String(index + 1).padStart(2, '0')}
        </div>
        <div className="ff-display" style={{
          fontSize: 20, fontWeight: 500, letterSpacing: '0.04em', marginBottom: 10,
          background: 'linear-gradient(180deg, #f3f4f5 0%, #b6bac0 50%, #7d828a 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          lineHeight: 1.1,
        }}>
          {piece.name}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 10, borderTop: '1px solid rgba(232,233,235,.12)',
        }}>
          <span className="ff-display" style={{ fontSize: 14, color: '#e8e9eb', letterSpacing: '0.04em' }}>{piece.price}</span>
          <span style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: 9, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: active ? '#fff' : 'rgba(232,233,235,.45)',
            transition: 'color .3s ease',
          }}>Detalhes →</span>
        </div>
      </div>
    </div>
  );
}

/* ===================== Cylinder3D ===================== */
interface Cylinder3DProps {
  pieces: PieceData[];
  onSelect: (piece: PieceData) => void;
  tweaks?: TweakValues;
  topOffset?: number;
  filterKey?: string;
}

function Cylinder3D({ pieces, onSelect, tweaks, topOffset = 0, filterKey }: Cylinder3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(0);
  const fmRef = useRef<{ stop?: () => void } | null>(null);
  const isFMRef = useRef(false);
  const isIdleRef = useRef(false);
  const wakeRafRef = useRef<(() => void) | null>(null);
  const onSelectRef = useRef(onSelect);
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    angleRef.current = 0;
    velocityRef.current = 0;
    stopFM();
    activeIdxRef.current = 0;
    setActiveIdx(0);
    wakeRafRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const N = pieces.length;
  const step = (Math.PI * 2) / N;
  const baseRadius = (tweaks?.radius) ?? 720;
  const radius = N <= 1 ? baseRadius : Math.max(Math.round(baseRadius * N / PIECES.length), 220);
  const sensitivity = ((tweaks?.sensitivity) ?? 42) * 0.0001;

  const stopFM = () => {
    fmRef.current?.stop?.();
    fmRef.current = null;
    isFMRef.current = false;
  };

  const snapTarget = (angle: number, vel: number) => {
    const projected = angle + vel * 14;
    return -Math.round(-projected / step) * step;
  };

  const springTo = (target: number, velHint = 0) => {
    stopFM();
    wakeRafRef.current?.();
    isFMRef.current = true;
    const from = angleRef.current;
    const controls = animate(from, target, {
      type: 'spring',
      stiffness: 220,
      damping: 28,
      mass: 0.85,
      velocity: velHint * 60,
      restDelta: 0.0003,
      onUpdate: (v: number) => { angleRef.current = v; },
      onComplete: () => {
        isFMRef.current = false;
        fmRef.current = null;
      },
    });
    fmRef.current = controls;
  };

  /* RAF loop */
  useEffect(() => {
    let lastFrame = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(64, t - lastFrame);
      lastFrame = t;

      if (draggingRef.current) {
        // live drag — angle already updated in onMove
      } else if (!isFMRef.current) {
        velocityRef.current *= Math.pow(0.92, dt / 16.67);
        if (Math.abs(velocityRef.current) > 0.0002) {
          angleRef.current += velocityRef.current * (dt / 16.67);
        } else if (velocityRef.current !== 0) {
          velocityRef.current = 0;
          springTo(snapTarget(angleRef.current, 0));
        }
      }

      const norm = ((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const realIdx = (((Math.round(-norm / step)) % N) + N) % N;
      if (realIdx !== activeIdxRef.current) {
        activeIdxRef.current = realIdx;
        setActiveIdx(realIdx);
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angleRef.current}rad)`;
        const kids = innerRef.current.children;
        for (let i = 0; i < kids.length; i++) {
          const cos = Math.cos(angleRef.current + i * step);
          const k = kids[i] as HTMLElement;
          if (cos < -0.05) {
            k.style.opacity = '0';
            k.style.pointerEvents = 'none';
          } else {
            const o = Math.max(0, Math.min(1, 0.55 + cos * 0.45));
            k.style.opacity = String(o);
            k.style.pointerEvents = cos > 0.85 ? 'auto' : 'none';
          }
        }
      }

      const idle = !draggingRef.current && !isFMRef.current && Math.abs(velocityRef.current) <= 0.0002;
      if (idle) { isIdleRef.current = true; return; }

      rafRef.current = requestAnimationFrame(tick);
    };

    wakeRafRef.current = () => {
      if (isIdleRef.current) {
        isIdleRef.current = false;
        lastFrame = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    isIdleRef.current = false;
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); stopFM(); wakeRafRef.current = null; };
  }, [N, radius, step]);

  /* Pointer drag */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let downX = 0, downY = 0, downTarget: EventTarget | null = null, isTouch = false;

    const onDown = (e: PointerEvent) => {
      stopFM();
      wakeRafRef.current?.();
      draggingRef.current = true;
      isTouch = e.pointerType === 'touch';
      lastXRef.current = e.clientX;
      lastTRef.current = performance.now();
      downX = e.clientX; downY = e.clientY; downTarget = e.target;
      velocityRef.current = 0;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = 'grabbing';
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastTRef.current);
      const effectiveSensitivity = isTouch ? (step / 330) : sensitivity;
      const delta = dx * effectiveSensitivity;
      angleRef.current += delta;
      velocityRef.current = (delta / dt) * 16.67 * (isTouch ? 0.4 : 0.9);
      lastXRef.current = e.clientX;
      lastTRef.current = now;
    };

    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      stage.style.cursor = 'grab';
      try { stage.releasePointerCapture(e.pointerId); } catch { /* ignore */ }

      const totalDx = Math.abs(e.clientX - downX);
      const totalDy = Math.abs(e.clientY - downY);
      if (totalDx < 10 && totalDy < 10) {
        const clickedCard = downTarget && (downTarget as HTMLElement).closest('[data-cyl-card]');
        if (clickedCard && onSelectRef.current) onSelectRef.current(pieces[activeIdxRef.current]);
        return;
      }

      const vel = velocityRef.current;
      velocityRef.current = 0;
      springTo(snapTarget(angleRef.current, vel), vel);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        stopFM();
        wakeRafRef.current?.();
        angleRef.current += e.deltaX * 0.0025;
        velocityRef.current = e.deltaX * 0.0025 * 0.6;
      }
    };

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('wheel', onWheel);
    };
  }, [sensitivity, pieces]);

  /* Keyboard: ←/→ spring to neighbor card */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const norm = ((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const cur = (((Math.round(-norm / step)) % N) + N) % N;
      const next = e.key === 'ArrowLeft' ? (cur - 1 + N) % N : (cur + 1) % N;
      springTo(-next * step);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [N, step]);

  return (
    <div ref={stageRef} style={{
      position: 'absolute', inset: 0,
      perspective: '1400px',
      perspectiveOrigin: '50% 50%',
      cursor: 'grab',
      touchAction: 'none',
      userSelect: 'none',
      animation: 'fadeIn .45s ease .08s both',
    }}>
      <div ref={innerRef} style={{
        position: 'absolute',
        left: '50%', top: `calc(50% + ${topOffset}px)`,
        width: 0, height: 0,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}>
        {pieces.map((p, i) => {
          const a = i * step;
          return (
            <div key={p.id}
              data-cyl-card="1"
              data-idx={i}
              style={{
              position: 'absolute',
              left: -130, top: -210,
              width: 260, height: 420,
              transform: `rotateY(${a}rad) translateZ(${radius}px)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}>
              <CylinderCard piece={p} index={i} active={activeIdx === i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyCategory({ headerH }: { headerH: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  }, []);
  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14, pointerEvents: 'none',
      paddingTop: headerH,
      opacity: 0,
    }}>
      <p style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: 'clamp(12px, 1.6vw, 15px)',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,.32)',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>Em breve, novidades</p>
      <p style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 10,
        letterSpacing: '0.24em',
        color: 'rgba(255,255,255,.16)',
        textTransform: 'uppercase',
        textAlign: 'center',
      }}>Esta categoria chegará em breve</p>
    </div>
  );
}

interface CatalogViewProps {
  onNavigate?: (view: string, target?: string) => void;
  tweaks?: TweakValues;
}

export function CatalogView({ tweaks }: CatalogViewProps) {
  const [selected, setSelected]     = useState<PieceData | null>(null);
  const [showWA, setShowWA]         = useState(false);
  const [filterCat, setFilterCat]   = useState('Todos');
  const [headerH, setHeaderH]       = useState(0);
  const [videoHover, setVideoHover] = useState(false);
  const detailVideoRef              = useRef<HTMLVideoElement>(null);
  const filterRowRef                = useRef<HTMLDivElement>(null);
  const headerRef                   = useRef<HTMLDivElement>(null);
  const hudRef                      = useRef<HTMLDivElement>(null);
  const overlayRef                  = useRef<HTMLDivElement>(null);
  const overlayCardRef              = useRef<HTMLDivElement>(null);
  const bgRef                       = useRef<HTMLDivElement>(null);
  const mouseRef                    = useRef({ x: 0.5, y: 0.5 });

  const [dbPieces, setDbPieces] = useState<PieceData[] | null>(null);
  const [dbCats,   setDbCats]   = useState<string[] | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchCatalogData().then(({ pieces: pData, cats: cData }) => {
      if (pData.length > 0) setDbPieces(pData.map((p) => ({
        id: p.id as string, name: p.name as string, shape: (p.shape as string) || 'ring',
        price: p.price as string, category: p.category as string, desc: p.description as string,
        image_url: (p.image_url as string) || '',
        video_url: (p.video_url as string) || '',
      })));
      if (cData.length > 0) setDbCats(['Todos', ...cData]);
      setLoading(false);
    });
  }, []);

  const allPieces = dbPieces ?? PIECES;
  const allCats   = dbCats   || CATS;

  const filteredPieces = filterCat === 'Todos'
    ? allPieces
    : allPieces.filter(p => p.category === filterCat);

  /* Mede altura do header */
  useEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(() => {
      setHeaderH(headerRef.current?.offsetHeight ?? 0);
    });
    ro.observe(headerRef.current);
    setHeaderH(headerRef.current.offsetHeight);
    return () => ro.disconnect();
  }, []);

  /* Centraliza botão de filtro ativo */
  useEffect(() => {
    const row = filterRowRef.current;
    if (!row) return;
    const btn = row.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!btn) return;
    const scrollLeft = btn.offsetLeft - row.clientWidth / 2 + btn.offsetWidth / 2;
    row.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [filterCat]);

  /* Dark stage body classes */
  useEffect(() => {
    document.body.classList.add('dark-stage');
    document.documentElement.classList.add('dark-stage-root');
    document.documentElement.style.background = '#0d0f13';
    document.body.style.background = '#0d0f13';
    return () => {
      document.body.classList.remove('dark-stage');
      document.documentElement.classList.remove('dark-stage-root');
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  /* Mouse parallax */
  useEffect(() => {
    if (!bgRef.current) return;
    const strength = 28;
    const qx = gsap.quickTo(bgRef.current, 'x', { duration: 1.6, ease: 'power2.out' });
    const qy = gsap.quickTo(bgRef.current, 'y', { duration: 1.6, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseRef.current = { x: nx, y: ny };
      qx((nx - 0.5) * -strength * 2);
      qy((ny - 0.5) * -strength * 2);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  /* Entrada do catálogo */
  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.25 }
    );
    gsap.fromTo(hudRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.45 }
    );
    if (bgRef.current) {
      gsap.fromTo(bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  /* Overlay detail-open class */
  useEffect(() => {
    if (selected) document.body.classList.add('detail-open');
    else document.body.classList.remove('detail-open');
    return () => document.body.classList.remove('detail-open');
  }, [selected]);

  /* Overlay animation */
  useEffect(() => {
    if (!selected) return;
    setVideoHover(false);
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
    if (overlayCardRef.current) {
      gsap.fromTo(overlayCardRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay: 0.05 }
      );
    }
  }, [selected]);

  /* Detail video play/pause on hover */
  useEffect(() => {
    const v = detailVideoRef.current;
    if (!v) return;
    if (videoHover) { v.currentTime = 0; v.play().catch(() => {}); }
    else { v.pause(); }
  }, [videoHover]);

  return (
    <div data-screen-label="05 Catálogo" style={{
      position: 'fixed', inset: 0,
      background: '#0d0f13',
      overflow: 'hidden',
    }}>

      {/* Parallax background image */}
      <div ref={bgRef} style={{
        position: 'absolute',
        top: -40, left: -40, right: -40, bottom: -40,
        backgroundImage: 'url(/bg-catalog.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0,
        willChange: 'transform',
        pointerEvents: 'none',
      }} />
      {/* Dark veil */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center top, rgba(30,33,40,.55) 0%, rgba(15,17,22,.75) 60%, rgba(10,12,16,.90) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Vignette radial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15,16,19,.6) 75%, rgba(10,11,13,.95) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Banda escura no rodapé */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '32%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(15,18,22,.55) 60%, rgba(13,15,19,.85) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1200, height: 1200,
        background: 'radial-gradient(circle, rgba(180,200,220,.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,.12)',
            borderTopColor: 'rgba(255,255,255,.55)',
            animation: 'spin .8s linear infinite',
          }} />
        </div>
      )}
      {!loading && filteredPieces.length > 0 && (
        <Cylinder3D pieces={filteredPieces} onSelect={setSelected} tweaks={tweaks} topOffset={Math.round(headerH / 2)} filterKey={filterCat} />
      )}
      {!loading && filteredPieces.length === 0 && (
        <EmptyCategory headerH={headerH} />
      )}

      {/* Header */}
      <div ref={headerRef} style={{
        position: 'absolute', top: 'clamp(48px, 7vw, 64px)', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        pointerEvents: 'none', zIndex: 10,
      }}>
        <span className="label" style={{ color: 'rgba(255,255,255,.5)', fontSize: 9.5 }}>— Catálogo · Coleção 2026</span>

        {/* Filtros de categoria */}
        <div ref={filterRowRef} style={{
          display: 'flex', gap: 6, marginTop: 10,
          overflowX: 'auto', maxWidth: '100vw',
          padding: '4px clamp(16px, 5vw, 40px)',
          pointerEvents: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}>
          {allCats.map(cat => {
            const active = filterCat === cat;
            return (
              <button key={cat} data-active={String(active)}
                onClick={() => { setFilterCat(cat); setSelected(null); }}
                style={{
                  padding: '5px 14px',
                  background: active ? 'linear-gradient(180deg, #b3b6bb 0%, #5a5e66 38%, #2a2d33 58%, #5a5e66 78%, #b6b9be 100%)' : 'transparent',
                  border: active ? 'none' : '1px solid rgba(255,255,255,.18)',
                  color: active ? '#fff' : 'rgba(255,255,255,.45)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: 9.5,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all .22s ease',
                  outline: 'none',
                } as React.CSSProperties}>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* HUD */}
      <div ref={hudRef} style={{
        position: 'absolute', bottom: 'clamp(16px, 3vw, 28px)', left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 clamp(16px, 3vw, 36px)', zIndex: 10, pointerEvents: 'none',
      }}>
        <span className="label hidden sm:block" style={{ color: 'rgba(255,255,255,.45)', fontSize: 10 }}>
          Arraste · ← → setas · clique para detalhes
        </span>
        <span className="label" style={{ color: 'rgba(255,255,255,.55)', fontSize: 10, letterSpacing: '0.36em' }}>
          {String(filteredPieces.length).padStart(2,'0')} {filterCat === 'Todos' ? 'peças no acervo' : 'peças encontradas'}
        </span>
      </div>

      {/* Overlay de detalhe */}
      {selected && (
        <div ref={overlayRef} onClick={() => { setSelected(null); setShowWA(false); }} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(8,9,11,.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
          padding: 'clamp(12px, 3vw, 40px)',
          overflowY: 'auto',
        }}>
          <div ref={overlayCardRef} onClick={(e) => e.stopPropagation()}
            className="grid grid-cols-1 md:grid-cols-2 w-full overlay-card"
            style={{
              maxWidth: 720,
              maxHeight: '88vh',
              overflowY: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              gap: 'clamp(16px, 3vw, 40px)',
              padding: 'clamp(16px, 3vw, 36px)',
              background: 'linear-gradient(180deg, #1a1c20 0%, #111317 100%)',
              border: '1px solid rgba(220,224,228,.18)',
              color: '#e8e9eb', position: 'relative',
            } as React.CSSProperties}>
            <button onClick={() => { setSelected(null); setShowWA(false); }} style={{
              position: 'absolute', top: 14, right: 14,
              background: 'none', border: 'none', color: 'rgba(255,255,255,.5)',
              fontSize: 22, cursor: 'pointer', padding: 6,
            }}>×</button>

            <div
              className="overlay-card__image"
              style={{ position: 'relative', overflow: 'hidden', cursor: selected.video_url ? 'pointer' : 'default' }}
              onMouseEnter={() => { if (selected.video_url) setVideoHover(true); }}
              onMouseLeave={() => setVideoHover(false)}
            >
              {selected.image_url
                ? <Image src={selected.image_url} alt={selected.name} fill sizes="(max-width: 767px) calc(100vw - 64px), 360px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                : <JewelryPlaceholder piece={selected} depth={1} />
              }
              {selected.video_url && (
                <video ref={detailVideoRef} src={selected.video_url} muted loop playsInline
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    opacity: videoHover ? 1 : 0,
                    transition: 'opacity .35s ease',
                    pointerEvents: 'none',
                  }} />
              )}
              {selected.video_url && !videoHover && (
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
                  padding: '4px 12px', borderRadius: 20,
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: 9.5, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,.7)',
                  pointerEvents: 'none',
                }}>
                  <svg width="7" height="8" viewBox="0 0 7 8" fill="currentColor" style={{display:'inline-block',verticalAlign:'middle',marginRight:5}}><path d="M0 0 L7 4 L0 8 Z"/></svg>
                  Vídeo
                </div>
              )}
            </div>
            <div className="overlay-card__info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="label" style={{ color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>{selected.category}</span>
              <h3 className="ff-display" style={{
                fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 500, letterSpacing: '0.04em', marginBottom: 10,
                background: 'linear-gradient(180deg, #f3f4f5 0%, #b6bac0 50%, #7d828a 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>{selected.name}</h3>
              <p className="ff-serif" style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', fontStyle: 'italic', color: 'rgba(232,233,235,.7)', marginBottom: 16 }}>
                {selected.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.12)', flexWrap: 'wrap', gap: 12 }}>
                <span className="ff-display" style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: '#fff', letterSpacing: '0.04em' }}>{selected.price}</span>
                <button className="cta" onClick={(e) => { e.stopPropagation(); setShowWA(true); }}
                        style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>
                  <span>Reservar</span>
                  <span className="cta__arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal WhatsApp */}
      {selected && showWA && (() => {
        const _msg = 'Olá! Gostaria de saber mais informações sobre o(a) ' + selected.name + '. Poderia me passar mais detalhes?';
        const _url = 'https://wa.me/5546999013150?text=' + encodeURIComponent(_msg);
        return (
          <div onClick={() => setShowWA(false)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(4,5,7,.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              maxWidth: 480, width: '100%',
              background: '#1a1c21',
              border: '1px solid rgba(220,224,228,.2)',
              padding: '32px',
            }}>
              <p className="ff-sans" style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(37,211,102,.9)', marginBottom: 12 }}>
                WhatsApp · Atendimento exclusivo
              </p>
              <p className="ff-serif" style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(232,233,235,.85)', marginBottom: 20 }}>
                As reservas são feitas <em>exclusivamente via WhatsApp</em>. Deseja iniciar o atendimento com a Valquíria?
              </p>
              <div style={{ background: 'rgba(37,211,102,.07)', border: '1px solid rgba(37,211,102,.2)', padding: '12px 16px', marginBottom: 24 }}>
                <p className="ff-sans" style={{ fontSize: 10, color: 'rgba(37,211,102,.7)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 6 }}>Prévia da mensagem</p>
                <p className="ff-serif" style={{ fontSize: 14, color: 'rgba(232,233,235,.65)', fontStyle: 'italic', lineHeight: 1.55 }}>
                  {'"'}{_msg}{'"'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowWA(false)} style={{
                  flex: 1, padding: '13px 16px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,.15)',
                  color: 'rgba(255,255,255,.5)', cursor: 'pointer',
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase',
                }}>Cancelar</button>
                <a href={_url} target="_blank" rel="noopener noreferrer" style={{
                  flex: 2, padding: '13px 16px',
                  background: '#25D366', color: '#fff',
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer',
                }}>Iniciar no WhatsApp</a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
