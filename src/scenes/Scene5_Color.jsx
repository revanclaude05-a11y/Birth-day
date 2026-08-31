import React, { useState } from 'react';
import Character from '../components/Character/Character';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

const COLORS = [
  { name: 'Blue', hex: '#5ba4d4', accent: '#3d8abd' },
  { name: 'Pink', hex: '#f4a8c4', accent: '#e87fa8' },
  { name: 'Purple', hex: '#b89fdc', accent: '#9b7fcc' },
  { name: 'Green', hex: '#7dcba8', accent: '#5cb890' },
  { name: 'Yellow', hex: '#f7d67a', accent: '#f0c140' },
];

export default function Scene5_Color({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [reactionPhase, setReactionPhase] = useState('question'); // question | reaction | done
  const [leaving, setLeaving] = useState(false);
  const { playSFX } = useAudio();

  const handleSelect = (color) => {
    setSelected(color.name);
    setReactionPhase('reaction');
    if (color.name === 'Blue') {
      playSFX('suspicious-note-1');
      setTimeout(() => playSFX('suspicious-note-2'), 800);
    } else {
      playSFX('boop');
    }
    
    setTimeout(() => {
      setReactionPhase('done');
    }, 2000);
  };

  const handleContinue = () => {
    setLeaving(true);
    setTimeout(onNext, 700);
  };

  const isBlue = selected === 'Blue';
  const reactionText = isBlue
    ? ['...Blue?', 'Interesting.']
    : ['Oh.', 'That\'s... noted.'];

  return (
    <div className={`scene scene--color ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--color" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character
            emotion={reactionPhase === 'reaction' && isBlue ? 'suspiciousDetective' : reactionPhase === 'reaction' ? 'curious' : 'suspiciousDetective'}
            size={Math.min(window.innerWidth * 0.36, 280)}
          />
        </div>

        {reactionPhase === 'question' && (
          <>
            <div className="scene-question">What's your favourite color?</div>
            <div className="color-swatches">
              {COLORS.map(color => (
                <button
                  key={color.name}
                  id={`btn-color-${color.name.toLowerCase()}`}
                  className="color-swatch"
                  style={{ '--swatch-color': color.hex, '--swatch-accent': color.accent }}
                  onClick={() => handleSelect(color)}
                  aria-label={`${color.name} color`}
                >
                  <div className="color-swatch__circle" />
                  <span className="color-swatch__label">{color.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {reactionPhase === 'reaction' && (
          <div className="scene-dialogue-stack">
            {reactionText.map((line, i) => (
              <div key={i} className={`stacked-line stacked-line--active`} style={{ animationDelay: `${i * 0.8}s` }}>
                {line}
              </div>
            ))}
          </div>
        )}

        {reactionPhase === 'done' && (
          <>
            <div className="scene-dialogue-stack">
              {reactionText.map((line, i) => (
                <div key={i} className="stacked-line stacked-line--past">{line}</div>
              ))}
            </div>
            <button id="btn-color-continue" className="scene-btn scene-btn--ghost" onClick={handleContinue}>
              Continue →
              <div className="btn-glow" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
