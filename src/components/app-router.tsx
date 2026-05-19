'use client';

import { useState, useEffect } from 'react';
import { TopNav } from './shared';
import { HomeView } from './home';
import { CatalogView } from './catalog';
import { TweaksPanel, TweakSection, TweakSlider, TweakRadio, useTweaks, TweakValues } from './tweaks-panel';

const TWEAK_DEFAULTS: TweakValues = {
  radius: 720,
  sensitivity: 42,
  glitter: 100,
  heroScale: 100,
  metalTone: 'grafite',
  darkCatalog: true,
};

const METAL_TONES: Record<string, string> = {
  prata:     'linear-gradient(180deg, #cfd2d6 0%, #8a8f97 38%, #4f545c 58%, #8a8f97 78%, #d8dbde 100%)',
  champagne: 'linear-gradient(180deg, #ece2cf 0%, #c4b18d 38%, #7e6b46 58%, #c4b18d 78%, #efe6d2 100%)',
  grafite:   'linear-gradient(180deg, #b3b6bb 0%, #5a5e66 38%, #2a2d33 58%, #5a5e66 78%, #b6b9be 100%)',
};

export function AppRouter() {
  const [view, setView] = useState<'home' | 'catalog'>('home');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply metal-tone CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--metal-grad',
      METAL_TONES[t.metalTone] || METAL_TONES.prata
    );
  }, [t.metalTone]);

  const navigate = (next: string, target: string | null = null) => {
    if (next === view) {
      if (next === 'home' && target) {
        setScrollTarget(null);
        setTimeout(() => setScrollTarget(target), 0);
      }
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      window.scrollTo(0, 0);
      setView(next as 'home' | 'catalog');
      setScrollTarget(target);
      setTimeout(() => setTransitioning(false), 60);
    }, 380);
  };

  return (
    <div>
      <TopNav onNavigate={navigate} currentView={view} />

      {view === 'home' && (
        <HomeView onNavigate={navigate} scrollTarget={scrollTarget} tweaks={t} />
      )}
      {view === 'catalog' && (
        <CatalogView onNavigate={navigate} tweaks={t} />
      )}

      {/* Crossfade veil */}
      <div style={{
        position: 'fixed', inset: 0,
        background: view === 'catalog' ? '#0a0b0d' : '#e9e8e3',
        opacity: transitioning ? 1 : 0,
        pointerEvents: transitioning ? 'auto' : 'none',
        transition: 'opacity .4s ease',
        zIndex: 200,
      }} />

      {/* Safe area overlays */}
      {(['top', 'bottom'] as const).map(pos => (
        <div key={pos} style={{
          position: 'fixed',
          top: pos === 'top' ? 0 : 'auto',
          bottom: pos === 'bottom' ? 0 : 'auto',
          left: 0, right: 0,
          height: pos === 'top'
            ? 'env(safe-area-inset-top, 0px)'
            : 'env(safe-area-inset-bottom, 0px)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: view === 'catalog'
            ? 'rgba(10,11,14,0.5)'
            : 'rgba(233,232,227,0.5)',
          transition: 'background .4s ease',
          zIndex: 9998,
          pointerEvents: 'none',
        } as React.CSSProperties} />
      ))}

      <TweaksPanel>
        <TweakSection label="Cilindro 3D" />
        <TweakSlider
          label="Raio" value={t.radius} min={520} max={960} step={20} unit="px"
          onChange={(v) => setTweak('radius', v)}
        />
        <TweakSlider
          label="Sensibilidade do drag" value={t.sensitivity} min={20} max={80} step={2}
          onChange={(v) => setTweak('sensitivity', v)}
        />

        <TweakSection label="Identidade visual" />
        <TweakRadio
          label="Tom metálico" value={t.metalTone}
          options={['prata', 'champagne', 'grafite']}
          onChange={(v) => setTweak('metalTone', v)}
        />
        <TweakSlider
          label="Brilho do glitter" value={t.glitter} min={0} max={150} step={5} unit="%"
          onChange={(v) => setTweak('glitter', v)}
        />

        <TweakSection label="Hero" />
        <TweakSlider
          label="Escala do logotipo" value={t.heroScale} min={70} max={130} step={5} unit="%"
          onChange={(v) => setTweak('heroScale', v)}
        />
      </TweaksPanel>
    </div>
  );
}
