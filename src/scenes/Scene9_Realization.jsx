import React, { useState, useEffect } from 'react';
import Character from '../components/Character/Character';
import useAudio from '../hooks/useAudio';
import './Scenes.css';
import './Scene9.css';

export default function Scene9_Realization({ onNext }) {
  const [phase, setPhase] = useState('build'); // build | jump | found | message | button | transition
  const [leaving, setLeaving] = useState(false);
  const { playSFX, playBGM, setBGMVolume } = useAudio();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('jump'), 800);
    const t2 = setTimeout(() => {
      playSFX('realization-hit');
    }, 900);
    const t3 = setTimeout(() => {
      setPhase('found');
      playSFX('sparkle');
    }, 1400);
    const t4 = setTimeout(() => setPhase('message'), 3000);
    const t5 = setTimeout(() => setPhase('button'), 5500);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  const handleYes = () => {
    setPhase('transition');
    playBGM('celebration');
    setBGMVolume(0.3, 0.5); // 30% volume for the birthday reveal
    
    // Smooth transition: background brightens, then changes scene
    setTimeout(() => {
      setLeaving(true);
      setTimeout(onNext, 700);
    }, 1200);
  };

  const charEmotion = (() => {
    if (phase === 'jump' || phase === 'found') return 'shocked';
    if (phase === 'message' || phase === 'button') return 'calmHappy';
    return 'suspiciousDetective';
  })();

  return (
    <div className={`scene scene--realization ${leaving ? 'scene--exit' : 'scene--enter'} ${phase === 'transition' ? 'scene--bright-transition' : ''}`}>
      <div className="scene-bg scene-bg--realization" />

      {/* Burst effect */}
      {(phase === 'found' || phase === 'message' || phase === 'button' || phase === 'transition') && (
        <div className="realization-burst" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="burst-ray" style={{ '--ray-angle': `${i * 30}deg` }} />
          ))}
        </div>
      )}

      <div className="scene-content scene-content--centered">
        <div className={`scene-character realization-char--${phase}`}>
          <Character
            emotion={charEmotion}
            size={Math.min(window.innerWidth * 0.42, 320)}
          />
        </div>

        {(phase === 'found' || phase === 'message' || phase === 'button' || phase === 'transition') && (
          <div className="found-text" aria-label="I found her">
            I FOUND HER!
          </div>
        )}

        {(phase === 'message' || phase === 'button') && (
          <div className="scene-dialogue-stack" style={{ marginTop: '1rem' }}>
            <div className="stacked-line stacked-line--active">Wait...</div>
            <div className="stacked-line stacked-line--active" style={{ animationDelay: '0.7s' }}>
              I think I've found the person I've been searching for.
            </div>
          </div>
        )}

        {phase === 'button' && (
          <>
            <div className="scene-question" style={{ marginTop: '0.5rem' }}>Do you want to know who?</div>
            <button
              id="btn-yes"
              className="scene-btn scene-btn--yes"
              onClick={handleYes}
              aria-label="Yes, show me who"
            >
              YES
              <div className="btn-glow" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
