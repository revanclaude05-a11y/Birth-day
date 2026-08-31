import React, { useEffect, useRef } from 'react';
import './Sparkles.css';

/* ============================================================
   SPARKLES — Floating sparkle particles (CSS + JS)
   ============================================================ */

const SPARKLE_COUNT = 18;

function rand(a, b) { return a + Math.random() * (b - a); }

export default function Sparkles({ active = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active) return;
    container.innerHTML = '';

    const particles = [];

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'sparkle-particle';
      const size = rand(4, 10);
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${rand(5, 95)}%;
        top: ${rand(5, 90)}%;
        animation-duration: ${rand(2.5, 5)}s;
        animation-delay: ${rand(0, 3)}s;
        opacity: 0;
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => { container.innerHTML = ''; };
  }, [active]);

  return <div ref={containerRef} className="sparkles-container" aria-hidden="true" />;
}
