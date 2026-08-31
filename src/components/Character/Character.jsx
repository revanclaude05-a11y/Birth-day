import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Character.css';

/* ============================================================
   CHARACTER — Beautiful Animated Rabbit
   Silhouette-first design with proper rabbit anatomy:
   - elegant long ears with tapered tips
   - large glossy almond eyes
   - soft teardrop head shape (wider at eyes, narrower at chin)
   - tiny delicate nose
   - small refined muzzle
   - compact adorable body
   ============================================================ */

export default function Character({ emotion = 'neutral', size = 320 }) {
  const [blinking, setBlinking] = useState(false);
  const [tearDrop, setTearDrop] = useState(false);
  const blinkTimer = useRef(null);
  const tearTimer = useRef(null);

  const scheduleBlink = useCallback(() => {
    const delay = 2400 + Math.random() * 3000;
    blinkTimer.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, 150);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleBlink();
    return () => {
      clearTimeout(blinkTimer.current);
      clearTimeout(tearTimer.current);
    };
  }, [scheduleBlink]);

  useEffect(() => {
    if (emotion.includes('sad')) {
      tearTimer.current = setInterval(() => {
        setTearDrop(true);
        setTimeout(() => setTearDrop(false), 1400);
      }, 2800);
    } else {
      clearInterval(tearTimer.current);
      setTearDrop(false);
    }
    return () => clearInterval(tearTimer.current);
  }, [emotion]);

  const em = emotion;

  // Emotion flags
  const isSad       = em.includes('sad');
  const isSuspicious= em.includes('suspicious') || em === 'thinking';
  const isShocked   = em === 'shocked' || em === 'realizing';
  const isExcited   = em === 'excited' || em === 'excitedFan' || em === 'celebrating';
  const isClosed    = em === 'admiring' || em === 'calmHappy';
  const isConfused  = em === 'confused';
  const isHopeful   = em === 'hopeful';

  // Eye vertical radius (height of eye)
  const eyeH = blinking ? 1.5
    : isClosed    ? 2
    : isShocked   ? 20
    : isExcited   ? 18
    : isSuspicious? 10
    : isSad       ? 13
    : 16;

  // Eye horizontal radius — slightly almond shaped
  const eyeW = isSuspicious ? 16 : 18;

  // Pupil size
  const pupilR = eyeH > 6 ? Math.min(eyeH * 0.55, 10) : 4;

  // Pupil gaze direction
  const gazeX = isSuspicious ? 3.5 : isConfused ? -2 : 0;
  const gazeY = (em === 'reading') ? 5 : isSuspicious ? 1.5 : isClosed ? 3 : 0;

  // Eyebrow lift/drop and tilt
  const browLift = isSad ? 5 : isShocked ? -8 : isSuspicious ? 4 : isExcited ? -4 : 0;
  const browTiltL = isSad ? -9 : isShocked ? -12 : isSuspicious ? 10 : 0;
  const browTiltR = isSad ?  9 : isShocked ?  12 : isSuspicious ? -10 : 0;

  // Mouth shape
  const mouth = (() => {
    if (isSad)        return { d: 'M 170 204 Q 180 196 190 204', open: false };
    if (isClosed)     return { d: 'M 170 200 Q 180 207 190 200', open: false };
    if (isExcited)    return { d: 'M 163 198 Q 180 218 197 198', open: true, ow: 12, oh: 9 };
    if (isShocked)    return { d: 'M 173 200 Q 180 210 187 200', open: true, ow: 7, oh: 8 };
    if (isSuspicious) return { d: 'M 170 200 Q 180 203 192 198', open: false };
    return               { d: 'M 168 199 Q 180 210 192 199', open: false };
  })();

  // Blush intensity
  const blushOpacity = isSad ? 0.28 : isExcited ? 0.5 : isClosed ? 0.45 : isHopeful ? 0.4 : 0.3;

  return (
    <div
      className={`character-wrap character--${em}`}
      style={{ width: size, height: size }}
      aria-label="Animated rabbit character"
    >
      <svg
        viewBox="0 0 360 400"
        xmlns="http://www.w3.org/2000/svg"
        className="character-svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Warm cream fur */}
          <radialGradient id="fur" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#fdf8f2" />
            <stop offset="60%"  stopColor="#f2e5d4" />
            <stop offset="100%" stopColor="#e8d5c0" />
          </radialGradient>

          {/* Slightly lighter belly/chest patch */}
          <radialGradient id="belly" cx="50%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f9efe4" />
          </radialGradient>

          {/* Delicate inner ear — soft pink */}
          <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#fce8ef" />
            <stop offset="100%" stopColor="#f5c4d2" />
          </linearGradient>

          {/* Eye iris — warm deep brown with subtle hue */}
          <radialGradient id="iris" cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#7a4a28" />
            <stop offset="60%"  stopColor="#3d1f0a" />
            <stop offset="100%" stopColor="#1a0804" />
          </radialGradient>

          {/* Eye highlight glow */}
          <radialGradient id="eyeGlow" cx="30%" cy="28%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Soft blush */}
          <radialGradient id="blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f7a8c0" stopOpacity={blushOpacity + 0.15} />
            <stop offset="100%" stopColor="#f7a8c0" stopOpacity="0" />
          </radialGradient>

          {/* Ground shadow */}
          <radialGradient id="gShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(80,50,110,0.2)" />
            <stop offset="100%" stopColor="rgba(80,50,110,0)" />
          </radialGradient>

          {/* Soft character drop shadow filter */}
          <filter id="charShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(70,40,100,0.15)" />
          </filter>

          {/* Upper eyelid clip path */}
          <clipPath id="eyeClipL">
            <ellipse cx="152" cy="148" rx={eyeW + 1} ry={eyeH + 1} />
          </clipPath>
          <clipPath id="eyeClipR">
            <ellipse cx="208" cy="148" rx={eyeW + 1} ry={eyeH + 1} />
          </clipPath>
        </defs>

        {/* ── Ground Shadow ── */}
        <ellipse cx="180" cy="396" rx="82" ry="10" fill="url(#gShadow)" className="char-shadow" />

        {/* ── ROOT RIG GROUP ── */}
        <g className="char-rabbit">
          <g className="char-root" filter="url(#charShadow)">

            {/* ── LEGS ── */}
            <g className="char-legs">
              {/* Left foot — rounded pill shape */}
              <g className="char-leg char-leg--left">
                <ellipse cx="150" cy="374" rx="26" ry="13" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />
              </g>
              {/* Right foot */}
              <g className="char-leg char-leg--right">
                <ellipse cx="210" cy="374" rx="26" ry="13" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />
              </g>
            </g>

            {/* ── TORSO ── compact egg shape, narrower at top */}
            <g className="char-torso">
              <ellipse cx="180" cy="316" rx="58" ry="66" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />
              {/* Chest patch — lighter belly fur */}
              <ellipse cx="180" cy="308" rx="36" ry="44" fill="url(#belly)" />
            </g>

            {/* ── ARMS ── */}
            <g className="char-arms">
              {/* Left arm */}
              <g className="char-arm char-arm--left">
                {/* Upper arm */}
                <ellipse cx="118" cy="308" rx="13" ry="24" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2"
                  transform="rotate(-12, 118, 295)" />
                {/* Paw — small rounded circle */}
                <ellipse cx="108" cy="332" rx="12" ry="10" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />
              </g>
              {/* Right arm */}
              <g className="char-arm char-arm--right">
                <ellipse cx="242" cy="308" rx="13" ry="24" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2"
                  transform="rotate(12, 242, 295)" />
                <ellipse cx="252" cy="332" rx="12" ry="10" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />
              </g>
            </g>

            {/* ── HEAD GROUP ── */}
            <g className="char-head-group">

              {/* ── EARS (drawn behind head) ── */}
              <g className="char-ears">
                {/* Left ear — long, tapered, slightly curved inward */}
                <g className="char-ear char-ear--left">
                  {/* Outer ear shape — graceful teardrop silhouette */}
                  <path
                    d="M 141 110
                       C 128  60, 118  10, 130 -18
                       C 140 -30, 158 -28, 164  -8
                       C 172  18, 164  68, 154 110 Z"
                    fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2"
                  />
                  {/* Inner ear — narrower, centered, soft pink */}
                  <path
                    d="M 144 104
                       C 135  60, 128  18, 135  -8
                       C 140 -20, 153 -20, 157  -5
                       C 162  18, 157  62, 150 104 Z"
                    fill="url(#earInner)"
                  />
                </g>

                {/* Right ear */}
                <g className="char-ear char-ear--right">
                  <path
                    d="M 219 110
                       C 232  60, 242  10, 230 -18
                       C 220 -30, 202 -28, 196  -8
                       C 188  18, 196  68, 206 110 Z"
                    fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2"
                  />
                  <path
                    d="M 216 104
                       C 225  60, 232  18, 225  -8
                       C 220 -20, 207 -20, 203  -5
                       C 198  18, 203  62, 210 104 Z"
                    fill="url(#earInner)"
                  />
                </g>
              </g>

              {/* ── HEAD BASE ── soft teardrop: wide at cheeks, gentle taper to chin */}
              <g className="char-head-base">
                {/* Main head — slightly elongated ellipse, not a circle */}
                <ellipse cx="180" cy="158" rx="88" ry="92" fill="url(#fur)" stroke="#ddc9b4" strokeWidth="1.2" />

                {/* Subtle chin narrowing — white overlay ellipse at bottom creates the chin taper */}
                {/* (removed: letting the ellipse alone define the shape) */}

                {/* Muzzle — very small, soft teardrop below nose, NO circle/pig snout */}
                {/* Just a subtle lighter area */}
                <ellipse cx="180" cy="196" rx="22" ry="16" fill="url(#belly)" opacity="0.6" />
              </g>

              {/* ── FACE ── */}
              <g className="char-face">

                {/* Blush — subtle soft circles on cheeks */}
                <ellipse cx="134" cy="178" rx="20" ry="13" fill="url(#blush)" className="char-blush" />
                <ellipse cx="226" cy="178" rx="20" ry="13" fill="url(#blush)" className="char-blush" />

                {/* ── EYEBROWS ── thin, elegant arcs */}
                {!isClosed && (
                  <g className="char-eyebrows">
                    <path
                      d={`M 137 ${120 + browLift} Q 152 ${112 + browLift} 168 ${118 + browLift}`}
                      stroke="#7a5038" strokeWidth="2.8" strokeLinecap="round" fill="none"
                      transform={`rotate(${browTiltL}, 152, 116)`}
                    />
                    <path
                      d={`M 192 ${118 + browLift} Q 208 ${112 + browLift} 223 ${120 + browLift}`}
                      stroke="#7a5038" strokeWidth="2.8" strokeLinecap="round" fill="none"
                      transform={`rotate(${browTiltR}, 208, 116)`}
                    />
                  </g>
                )}

                {/* ── EYES ── */}
                <g className="char-eyes">
                  {isClosed ? (
                    /* Closed happy squint — smooth arc lines */
                    <>
                      <path d="M 136 150 Q 152 160 168 150"
                        stroke="#7a4a28" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                      <path d="M 192 150 Q 208 160 224 150"
                        stroke="#7a4a28" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* Left eye */}
                      <g className="char-eye-l">
                        {/* White sclera */}
                        <ellipse cx="152" cy="148" rx={eyeW} ry={eyeH}
                          fill="white" stroke="#c8a888" strokeWidth="1" />
                        {/* Iris */}
                        {!blinking && (
                          <>
                            <ellipse cx={152 + gazeX} cy={148 + gazeY}
                              rx={pupilR * 1.1} ry={pupilR * 1.15}
                              fill="url(#iris)" clipPath="url(#eyeClipL)" />
                            {/* Pupil (darker centre) */}
                            <ellipse cx={152 + gazeX} cy={148 + gazeY}
                              rx={pupilR * 0.65} ry={pupilR * 0.68}
                              fill="#180800" clipPath="url(#eyeClipL)" />
                            {/* Main highlight */}
                            <circle cx={147 + gazeX} cy={143 + gazeY} r={pupilR * 0.38}
                              fill="white" opacity="0.95" />
                            {/* Secondary small highlight */}
                            <circle cx={156 + gazeX} cy={150 + gazeY} r={pupilR * 0.2}
                              fill="white" opacity="0.75" />
                          </>
                        )}
                        {/* Upper eyelid shadow — gives depth */}
                        <ellipse cx="152" cy={148 - eyeH * 0.4} rx={eyeW * 0.9} ry={eyeH * 0.45}
                          fill="rgba(160,100,60,0.12)" />
                      </g>

                      {/* Right eye */}
                      <g className="char-eye-r">
                        <ellipse cx="208" cy="148" rx={eyeW} ry={eyeH}
                          fill="white" stroke="#c8a888" strokeWidth="1" />
                        {!blinking && (
                          <>
                            <ellipse cx={208 + gazeX} cy={148 + gazeY}
                              rx={pupilR * 1.1} ry={pupilR * 1.15}
                              fill="url(#iris)" clipPath="url(#eyeClipR)" />
                            <ellipse cx={208 + gazeX} cy={148 + gazeY}
                              rx={pupilR * 0.65} ry={pupilR * 0.68}
                              fill="#180800" clipPath="url(#eyeClipR)" />
                            <circle cx={203 + gazeX} cy={143 + gazeY} r={pupilR * 0.38}
                              fill="white" opacity="0.95" />
                            <circle cx={212 + gazeX} cy={150 + gazeY} r={pupilR * 0.2}
                              fill="white" opacity="0.75" />
                          </>
                        )}
                        <ellipse cx="208" cy={148 - eyeH * 0.4} rx={eyeW * 0.9} ry={eyeH * 0.45}
                          fill="rgba(160,100,60,0.12)" />
                      </g>
                    </>
                  )}
                </g>

                {/* ── Watery eyes (sad shimmer) ── */}
                {isSad && !blinking && !isClosed && (
                  <g className="char-watery">
                    <ellipse cx="152" cy={148 + eyeH - 2} rx={eyeW * 0.85} ry="4"
                      fill="rgba(180,230,255,0.6)" />
                    <ellipse cx="208" cy={148 + eyeH - 2} rx={eyeW * 0.85} ry="4"
                      fill="rgba(180,230,255,0.6)" />
                  </g>
                )}
                {isSad && tearDrop && (
                  <ellipse cx="145" cy="174" rx="4" ry="6.5"
                    fill="rgba(160,220,255,0.9)" className="char-tear" />
                )}

                {/* ── NOSE — tiny heart/triangle shape, very refined ── */}
                <g className="char-nose">
                  {/* Small heart-like nose: two tiny circles + a triangle join */}
                  <ellipse cx="177" cy="184" rx="4" ry="3.5" fill="#e8829a" />
                  <ellipse cx="183" cy="184" rx="4" ry="3.5" fill="#e8829a" />
                  <polygon points="173,185 187,185 180,190" fill="#e8829a" />
                  {/* Nose highlight */}
                  <ellipse cx="178" cy="183" rx="1.5" ry="1" fill="rgba(255,255,255,0.6)" />
                </g>

                {/* ── Philtrum line — tiny vertical line from nose to mouth ── */}
                <line x1="180" y1="190" x2="180" y2="195"
                  stroke="#c89080" strokeWidth="1.2" strokeLinecap="round" />

                {/* ── MOUTH ── small, delicate ── */}
                <path d={mouth.d}
                  stroke="#b07060" strokeWidth="2.2" strokeLinecap="round"
                  fill="none" className="char-mouth"
                />

                {/* Open mouth interior for shocked/excited */}
                {mouth.open && (
                  <ellipse
                    cx="180"
                    cy={isShocked ? 207 : 210}
                    rx={mouth.ow} ry={mouth.oh}
                    fill="#d06050" opacity="0.82"
                  />
                )}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
