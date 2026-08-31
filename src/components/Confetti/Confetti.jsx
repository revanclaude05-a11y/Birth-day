import React, { useEffect, useRef } from 'react';
import './Confetti.css';

/* ============================================================
   CONFETTI — Canvas-based particle system
   ============================================================ */

const COLORS = ['#f4a8c4', '#c4b5e8', '#8ec5f0', '#f7d67a', '#a8e6cf', '#f9b8c8', '#b8d4f9'];
const SHAPES = ['circle', 'rect', 'star'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = randomBetween(0, this.canvas.width);
    this.y = randomBetween(-60, -10);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.size = randomBetween(5, 12);
    this.vx = randomBetween(-1.5, 1.5);
    this.vy = randomBetween(2, 5);
    this.rotation = randomBetween(0, Math.PI * 2);
    this.rotSpeed = randomBetween(-0.08, 0.08);
    this.alpha = 1;
    this.alphaDecay = randomBetween(0.003, 0.008);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      // Star
      ctx.beginPath();
      const r1 = this.size / 2, r2 = this.size / 4;
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        if (i === 0) ctx.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
        else ctx.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
        ctx.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.vx += randomBetween(-0.05, 0.05);
    if (this.y > this.canvas.height || this.alpha <= 0) {
      this.reset();
    }
  }
}

export default function Confetti({ active = false, count = 80 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => new Particle(canvas));

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (active) {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach(p => {
          p.draw(ctx);
          p.update();
        });
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
    />
  );
}
