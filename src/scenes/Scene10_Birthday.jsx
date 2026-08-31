import React, { useState, useEffect } from 'react';
import Character from '../components/Character/Character';
import PhotoReveal from '../components/PhotoReveal/PhotoReveal';
import Confetti from '../components/Confetti/Confetti';
import useAudio from '../hooks/useAudio';
import './Scenes.css';
import './Scene10.css';

export default function Scene10_Birthday({ onNext }) {
  const [leaving, setLeaving] = useState(false);
  const { playSFX, playBGM, setBGMVolume } = useAudio();

  useEffect(() => {
    playBGM('celebration');
    setBGMVolume(0.4, 3.0); // Smoothly increase to 40% for the main celebration
    // Staggered sparkle bursts as confetti appears
    const t1 = setTimeout(() => playSFX('sparkle'), 400);
    const t2 = setTimeout(() => playSFX('sparkle'), 1000);
    const t3 = setTimeout(() => playSFX('chime'), 1600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const handleNext = () => {
    setLeaving(true);
    setTimeout(onNext, 900);
  };

  return (
    <div className={`scene scene--birthday ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--birthday" />
      <Confetti active={true} count={90} />

      <div className="birthday-layout">
        {/* LEFT: Typography */}
        <div className="birthday-text-side">
          <div className="birthday-label">🎉 FOUND.</div>

          <div className="birthday-title">
            <span className="birthday-word birthday-word--1">Happiesstt</span>
            <span className="birthday-word birthday-word--2">Birthday</span>
            <span className="birthday-word birthday-word--3">JJJAAARRAA</span>
          </div>

          <div className="birthday-case-closed">
            Case officially closed. 🎂
          </div>

          {/* Character celebrating */}
          <div className="birthday-character">
            <Character emotion="celebrating" size={Math.min(window.innerWidth * 0.3, 220)} />
          </div>
        </div>

        {/* RIGHT: Photo */}
        <div className="birthday-photo-side">
          <PhotoReveal src="/assets/zara.jpg" name="Zara" />
        </div>
      </div>

      {/* Continue button */}
      <button
        id="btn-one-more"
        className="birthday-next-btn"
        onClick={handleNext}
        aria-label="One last thing"
      >
        One last thing →
        <div className="btn-glow" />
      </button>
    </div>
  );
}
