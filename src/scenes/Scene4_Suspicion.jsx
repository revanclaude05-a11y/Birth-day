import React, { useState, useEffect } from 'react';
import Character from '../components/Character/Character';
import useDialogue from '../hooks/useDialogue';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

const LINES = ['Ohhh...', 'Zara it is?', 'Now that I know your name...', 'I have a few more questions.'];

export default function Scene4_Suspicion({ onNext }) {
  const [leaving, setLeaving] = useState(false);
  const { lineIndex, done } = useDialogue(LINES, { msBetween: 1600 });
  const { playSFX } = useAudio();

  useEffect(() => {
    if (lineIndex === 1) {
      playSFX('suspicious-sting');
    }
  }, [lineIndex, playSFX]);

  const handleAsk = () => {
    setLeaving(true);
    setTimeout(onNext, 700);
  };

  return (
    <div className={`scene scene--suspicion ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--suspicion" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character emotion="suspiciousDetective" size={Math.min(window.innerWidth * 0.40, 310)} />
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
          <button
            id="btn-ask-me"
            className="scene-btn scene-btn--primary"
            onClick={handleAsk}
            aria-label="Ask me your questions"
          >
            Ask me.
            <div className="btn-glow" />
          </button>
        )}
      </div>
    </div>
  );
}
