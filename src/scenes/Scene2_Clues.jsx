import React, { useState } from 'react';
import Character from '../components/Character/Character';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

// Maps each clue to its body acting emotion and its SFX sound
const CLUES = [
  { text: 'Okay... listen carefully.', emotion: 'curious',     reaction: null,  sfx: null },
  { text: 'She likes reading books.',  emotion: 'reading',     reaction: '📖', sfx: 'soft-chime' },
  { text: "She's a Taylor Swift fan.", emotion: 'excitedFan',  reaction: '✦',  sfx: 'sparkle' },
  { text: "She's completely crazy about her water bottle.", emotion: 'confused',  reaction: '💧', sfx: 'boop' },
  { text: "She never lets her friends down.",  emotion: 'admiring',  reaction: null,  sfx: 'warm-chord' },
  { text: "She's creatively the best designer I know.", emotion: 'impressed', reaction: null,  sfx: 'suspicious-sting' },
];

export default function Scene2_Clues({ onNext }) {
  const [clueIndex, setClueIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const { playSFX, playBGM } = useAudio();

  const advance = () => {
    if (clueIndex < CLUES.length - 1) {
      const next = clueIndex + 1;
      const sfx = CLUES[next].sfx;
      if (sfx) playSFX(sfx);

      // Shift BGM to more mysterious after Taylor Swift clue
      if (next >= 4) playBGM('mystery');

      setVisible(false);
      setTimeout(() => {
        setClueIndex(next);
        setVisible(true);
      }, 350);
    } else {
      setLeaving(true);
      setTimeout(onNext, 700);
    }
  };

  const clue = CLUES[clueIndex];
  const isLast = clueIndex === CLUES.length - 1;

  return (
    <div className={`scene scene--clues ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--clues" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character emotion={clue.emotion} size={Math.min(window.innerWidth * 0.38, 290)} />
        </div>

        <div className={`clue-card ${visible ? 'clue-card--visible' : 'clue-card--hidden'}`}>
          {clue.reaction && <span className="clue-reaction">{clue.reaction}</span>}
          <p className="clue-text">{clue.text}</p>
          {isLast && <p className="clue-subtext">...wait.</p>}
        </div>

        <button
          id={`btn-clue-${clueIndex}`}
          className="scene-btn scene-btn--ghost"
          onClick={advance}
          aria-label={isLast ? 'Continue' : 'Next clue'}
        >
          {isLast ? 'Hmm...' : 'Go on →'}
          <div className="btn-glow" />
        </button>
      </div>
    </div>
  );
}
