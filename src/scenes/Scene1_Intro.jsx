import React, { useState, useEffect } from 'react';
import Character from '../components/Character/Character';
import useDialogue from '../hooks/useDialogue';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

const LINES = [
  'Hello.',
  "I'm a bit sad.",
  "I'm looking for someone.",
  "I've searched a lot...",
  "Could you help me find her out?",
];

export default function Scene1_Intro({ onNext }) {
  const [hopeful, setHopeful] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { lineIndex, done } = useDialogue(LINES, { msBetween: 1600 });
  const { initAudio, playBGM, playSFX } = useAudio();

  // Play search ambience once dialogue starts (no autoplay — waits for interaction)
  useEffect(() => {
    if (lineIndex >= 0) {
      playBGM('search');
    }
  }, [lineIndex]);

  const handleHelp = () => {
    initAudio(); // Unlock audio context on first real click
    playSFX('chime');
    setHopeful(true);
    setTimeout(() => {
      setLeaving(true);
      setTimeout(onNext, 700);
    }, 1200);
  };

  return (
    <div className={`scene scene--intro ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--intro" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character scene-character--large">
          <Character emotion={hopeful ? 'hopeful' : 'sadSearch'} size={Math.min(window.innerWidth * 0.42, 320)} />
        </div>

        <div className="scene-dialogue-stack">
          {LINES.map((line, i) => (
            i <= lineIndex && (
              <div
                key={i}
                className={`stacked-line ${i === lineIndex ? 'stacked-line--active' : 'stacked-line--past'}`}
              >
                {line}
              </div>
            )
          ))}
        </div>

        {done && !leaving && (
          <button
            id="btn-help"
            className="scene-btn scene-btn--primary"
            onClick={handleHelp}
            aria-label="I'll help you find her"
          >
            <span>I'll help you.</span>
            <div className="btn-glow" />
          </button>
        )}
      </div>
    </div>
  );
}
