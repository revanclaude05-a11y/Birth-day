import React, { useEffect } from 'react';
import Character from '../components/Character/Character';
import useDialogue from '../hooks/useDialogue';
import useAudio from '../hooks/useAudio';
import './Scenes.css';
import './Scene11.css';

const LINES = ['Before you go...', 'Check your bag.', "There's something waiting for you there."];

export default function Scene11_Bag({ onNext }) {
  const { lineIndex, done } = useDialogue(LINES, { msBetween: 2000 });
  const { playSFX, playBGM, setBGMVolume } = useAudio();

  // Fade celebration down slowly as bag scene begins
  useEffect(() => {
    // Bring volume down slowly for the final dialogue instead of silence
    const t = setTimeout(() => {
      setBGMVolume(0.18, 2.5); // Lower to ~18% over 2.5 seconds
    }, 1200);
    return () => clearTimeout(t);
  }, [setBGMVolume]);

  // Play a single magical chime on the final line
  useEffect(() => {
    if (lineIndex === 2) {
      const t = setTimeout(() => playSFX('bag-chime'), 800);
      return () => clearTimeout(t);
    }
  }, [lineIndex]);

  return (
    <div className="scene scene--bag scene--enter">
      <div className="scene-bg scene-bg--bag" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character emotion="calmHappy" size={Math.min(window.innerWidth * 0.38, 295)} />
        </div>

        <div className="scene-dialogue-stack">
          {LINES.map((line, i) => (
            i <= lineIndex && (
              <div key={i} className={`stacked-line ${i === lineIndex ? 'stacked-line--active' : 'stacked-line--past'}`}>
                {line}
              </div>
            )
          ))}
        </div>

        {done && (
          <div className="bag-end">
            <div className="bag-emoji" aria-hidden="true">🎒</div>
            <p className="bag-hint">Something is waiting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
