'use client';

import { useMemo } from 'react';

/* ===================== Aurya Logo ===================== */
interface AuryaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTag?: boolean;
  showJoias?: boolean;
}

export function AuryaLogo({ size = 'lg', showTag = true, showJoias = true }: AuryaLogoProps) {
  const sizes = {
    sm: { joias: 11, aurya: 38, tag: 9, gap: 0 },
    md: { joias: 13, aurya: 64, tag: 11, gap: 2 },
    lg: { joias: 18, aurya: 128, tag: 13, gap: 4 },
    xl: { joias: 22, aurya: 184, tag: 14, gap: 8 },
  };
  const s = sizes[size] || sizes.lg;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
      {showJoias && (
        <span className="ff-display" style={{
          fontWeight: 400,
          fontSize: s.joias,
          letterSpacing: '0.42em',
          color: 'var(--ink-2)',
          marginBottom: s.gap + 2,
          paddingLeft: '0.42em',
        }}>JOIAS</span>
      )}
      <span className="ff-display metal-text" style={{
        fontWeight: 600,
        fontSize: s.aurya,
        letterSpacing: '0.06em',
        lineHeight: 0.95,
      }}>AURYA</span>
      {showTag && (
        <span className="ff-sans" style={{
          fontSize: s.tag,
          fontWeight: 400,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: 'var(--ink-2)',
          marginTop: s.gap + 14,
        }}>VALQUÍRIA WISNIEWSKI KONZEN</span>
      )}
    </div>
  );
}

/* Small inline brand for the nav */
export function AuryaInline() {
  return (
    <span className="ff-display" style={{
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '0.28em',
      background: 'var(--metal-grad)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }}>AURYA</span>
  );
}

/* ===================== Top Nav ===================== */
interface TopNavProps {
  onNavigate: (view: string, target?: string) => void;
  currentView: string;
}

export function TopNav({ onNavigate, currentView }: TopNavProps) {
  const items = [
    { id: 'sobre',      label: 'Sobre' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'contato',    label: 'Contato' },
  ];
  return (
    <nav className="top-nav" style={{ padding: 'clamp(16px, 3vw, 28px) clamp(16px, 4vw, 32px)' }}>
      <div className="top-nav__inner" style={{ gap: 'clamp(14px, 3vw, 36px)' }}>
        <button className="top-nav__brand" onClick={() => onNavigate('home', 'top')} aria-label="Voltar à página inicial">
          AURYA
        </button>

        {/* Divider — oculto em telas muito pequenas */}
        <span className="top-nav__divider hidden xs:block" />

        <div className="top-nav__items" style={{ gap: 'clamp(10px, 2vw, 28px)' }}>
          {/* Links de seção — ocultos em mobile, visíveis a partir de sm */}
          {items.map(it => (
            <button key={it.id} className="top-nav__item hidden sm:block"
                    onClick={() => onNavigate('home', it.id)}>
              {it.label}
            </button>
          ))}
          <button
            className="top-nav__item"
            onClick={() => onNavigate('catalog')}
            style={{ color: currentView === 'catalog' ? 'inherit' : 'var(--ink-0)', fontWeight: 500 }}
          >
            Catálogo
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ===================== Sparkle wave (decorative) ===================== */
interface SparkleWaveProps {
  width?: number;
  height?: number;
  density?: number;
  opacity?: number;
  flip?: boolean;
  seed?: number;
}

export function SparkleWave({ width = 1200, height = 220, density = 280, opacity = 0.85, flip = false, seed = 1 }: SparkleWaveProps) {
  const dots = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < density; i++) {
      const t = rand();
      const x = t * width;
      const cy = height / 2 + Math.sin(t * Math.PI * 2.2 + (flip ? Math.PI : 0)) * (height * 0.22);
      const spread = (rand() - 0.5) * height * 0.55;
      const y = cy + spread * (1 - Math.abs(spread / (height * 0.6)));
      const r = 0.4 + rand() * 1.6;
      const o = 0.3 + rand() * 0.7;
      out.push({ x, y, r, o });
    }
    return out;
  }, [width, height, density, flip, seed]);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
         style={{ display: 'block', opacity, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id={`sparkle-grad-${seed}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#cfd2d6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7a7e85" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`url(#sparkle-grad-${seed})`} opacity={d.o} />
      ))}
    </svg>
  );
}

/* Vertical ornamental rule (thin line + diamond + thin line) */
interface OrnamentProps {
  vertical?: boolean;
  width?: number;
}

export function Ornament({ vertical = false, width = 200 }: OrnamentProps) {
  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 1, height: 60, background: 'var(--ink-3)' }} />
        <span style={{
          width: 6, height: 6, background: 'var(--silver-1)',
          transform: 'rotate(45deg)',
        }} />
        <span style={{ width: 1, height: 60, background: 'var(--ink-3)' }} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width }}>
      <span style={{ flex: 1, height: 1, background: 'var(--ink-3)' }} />
      <span style={{ width: 6, height: 6, background: 'var(--silver-1)', transform: 'rotate(45deg)' }} />
      <span style={{ flex: 1, height: 1, background: 'var(--ink-3)' }} />
    </div>
  );
}

/* ===================== Jewelry placeholder card ===================== */
interface Piece {
  id: string;
  shape: string;
  [key: string]: unknown;
}

interface JewelryPlaceholderProps {
  piece: Piece;
  depth?: number;
}

export function JewelryPlaceholder({ piece, depth = 1 }: JewelryPlaceholderProps) {
  const d = Math.max(0, Math.min(1, depth));
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      background: 'linear-gradient(160deg, #efeeea 0%, #d4d4d0 50%, #b8b8b4 100%)',
      overflow: 'hidden',
      filter: `brightness(${0.55 + d * 0.45}) saturate(${0.7 + d * 0.3})`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.55) 0%, transparent 55%)',
      }} />
      <svg viewBox="0 0 200 280" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={`jp-metal-${piece.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f6f7" />
            <stop offset="35%" stopColor="#a8acb2" />
            <stop offset="65%" stopColor="#5a5e65" />
            <stop offset="100%" stopColor="#cfd2d6" />
          </linearGradient>
          <radialGradient id={`jp-sheen-${piece.id}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {piece.shape === 'ring' && (
          <g transform="translate(100 150)">
            <ellipse cx="0" cy="0" rx="55" ry="55" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="14"/>
            <ellipse cx="0" cy="0" rx="55" ry="55" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2"/>
            <circle cx="0" cy="-55" r="9" fill={`url(#jp-metal-${piece.id})`} />
            <circle cx="-3" cy="-58" r="3" fill="rgba(255,255,255,.85)" />
          </g>
        )}
        {piece.shape === 'pendant' && (
          <g transform="translate(100 60)">
            <path d="M 0 0 L 80 0" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="1.5"/>
            <path d="M 0 0 L -80 0" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="1.5"/>
            <path d="M 0 0 Q -30 60 0 110 Q 30 60 0 0 Z" fill={`url(#jp-metal-${piece.id})`} />
            <circle cx="0" cy="65" r="14" fill={`url(#jp-metal-${piece.id})`} />
            <circle cx="-5" cy="58" r="4" fill="rgba(255,255,255,.85)" />
          </g>
        )}
        {piece.shape === 'earring' && (
          <g transform="translate(100 90)">
            <ellipse cx="-25" cy="0" rx="22" ry="35" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="3"/>
            <ellipse cx="25" cy="0" rx="22" ry="35" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="3"/>
            <circle cx="-25" cy="-35" r="5" fill={`url(#jp-metal-${piece.id})`} />
            <circle cx="25" cy="-35" r="5" fill={`url(#jp-metal-${piece.id})`} />
          </g>
        )}
        {piece.shape === 'bracelet' && (
          <g transform="translate(100 150)">
            <ellipse cx="0" cy="0" rx="75" ry="35" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="6"/>
            {[...Array(12)].map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 75} cy={Math.sin(a) * 35} r="4" fill={`url(#jp-metal-${piece.id})`} />;
            })}
          </g>
        )}
        {piece.shape === 'necklace' && (
          <g transform="translate(100 80)">
            <path d="M -85 0 Q 0 130 85 0" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="2.5"/>
            <path d="M -75 0 Q 0 115 75 0" fill="none" stroke={`url(#jp-metal-${piece.id})`} strokeWidth="2"/>
            <ellipse cx="0" cy="105" rx="10" ry="14" fill={`url(#jp-metal-${piece.id})`} />
            <circle cx="-3" cy="100" r="3" fill="rgba(255,255,255,.85)" />
          </g>
        )}
        <circle cx="40" cy="40" r="1.5" fill="white" opacity="0.9" />
        <circle cx="160" cy="60" r="1" fill="white" opacity="0.7" />
        <circle cx="170" cy="220" r="1.2" fill="white" opacity="0.8" />
        <circle cx="35" cy="240" r="1" fill="white" opacity="0.6" />
        <rect x="0" y="0" width="200" height="280" fill={`url(#jp-sheen-${piece.id})`} />
      </svg>
    </div>
  );
}
