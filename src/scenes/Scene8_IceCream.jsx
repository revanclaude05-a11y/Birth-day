import React, { useState } from 'react';
import Character from '../components/Character/Character';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

const FLAVORS = [
  { name: 'Butterscotch', emoji: '🍯' },
  { name: 'Chocolate',    emoji: '🍫' },
  { name: 'Vanilla',      emoji: '🍦' },
  { name: 'Strawberry',   emoji: '🍓' },
  { name: 'Mango',        emoji: '🥭' },
];

export default function Scene8_IceCream({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('question'); // question | freeze | realization | continue
  const [leaving, setLeaving] = useState(false);
  const { playSFX, stopBGM } = useAudio();

  const handle = (flavor) => {
    setSelected(flavor.name);
    setPhase('freeze');

    const isBS = flavor.name === 'Butterscotch';

    if (isBS) {
      // DRAMATIC: hard cut music to silence
      stopBGM();
    }

    setTimeout(() => setPhase('realization'), isBS ? 1200 : 800);
    setTimeout(() => setPhase('continue'),    isBS ? 3400 : 2200);
  };

  const handleContinue = () => {
    setLeaving(true);
    setTimeout(onNext, 700);
  };

  const isBS = selected === 'Butterscotch';

  const reactionLines = isBS
    ? ['...Butterscotch.', 'I see.', '...']
    : ['Interesting choice.', 'Good to know.'];

  // Body acting state for each phase
  const charEmotion = (() => {
    if (phase === 'freeze') return isBS ? 'suspiciousDetective' : 'curious';
    if (phase === 'realization' && isBS) return 'realizing';
    if (phase === 'continue' && isBS) return 'realizing';
    return 'curious';
  })();

  return (
    <div className={`scene scene--icecream ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--icecream" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character
            emotion={charEmotion}
            size={Math.min(window.innerWidth * 0.38, 295)}
          />
        </div>

        {phase === 'question' && (
          <>
            <div className="scene-dialogue-stack" style={{ marginBottom: '1.5rem' }}>
              <div className="stacked-line stacked-line--past">One last question.</div>
            </div>
            <div className="scene-question">What flavour ice cream do you like?</div>
            <div className="flavor-cards">
              {FLAVORS.map(flavor => (
                <button
                  key={flavor.name}
                  id={`btn-flavor-${flavor.name.toLowerCase()}`}
                  className="flavor-card"
                  onClick={() => handle(flavor)}
                  aria-label={`${flavor.name} ice cream`}
                >
                  <span className="flavor-card__emoji">{flavor.emoji}</span>
                  <span className="flavor-card__name">{flavor.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {(phase === 'freeze' || phase === 'realization' || phase === 'continue') && (
          <div className="scene-dialogue-stack">
            {reactionLines.map((line, i) => (
              <div
                key={i}
                className={`stacked-line ${phase === 'continue' && i < reactionLines.length - 1 ? 'stacked-line--past' : 'stacked-line--active'}`}
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {phase === 'continue' && (
          <button id="btn-icecream-continue" className="scene-btn scene-btn--ghost" onClick={handleContinue}>
            And...?
            <div className="btn-glow" />
          </button>
        )}
      </div>
    </div>
  );
}
