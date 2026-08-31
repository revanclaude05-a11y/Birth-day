import React from 'react';
import './CinematicOverlay.css';

/* ============================================================
   CINEMATIC OVERLAY — Black vignette for eye zoom scene
   phase: 'idle' | 'darkening' | 'zoomed' | 'text' | 'zooming-out' | 'done'
   ============================================================ */

export default function CinematicOverlay({ phase = 'idle', text = '' }) {
  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div className={`cinematic-overlay cinematic-overlay--${phase}`} aria-hidden="true">
      {/* Black bars (letterbox feel) */}
      <div className="cinematic-bar cinematic-bar--top" />
      <div className="cinematic-bar cinematic-bar--bottom" />

      {/* Vignette */}
      <div className="cinematic-vignette" />

      {/* Text */}
      {text && (phase === 'text' || phase === 'zooming-out') && (
        <div className="cinematic-text">
          {text}
        </div>
      )}
    </div>
  );
}
