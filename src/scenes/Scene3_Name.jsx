import React, { useState, useRef } from 'react';
import Character from '../components/Character/Character';
import useAudio from '../hooks/useAudio';
import './Scenes.css';

function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

const VALID = ['zara', 'zara ahamed'];

export default function Scene3_Name({ onNext }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phase, setPhase] = useState('dialogue'); // dialogue | input | success
  const [dialogueDone, setDialogueDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef(null);
  const { playSFX } = useAudio();

  // Simple timed dialogue
  const [lineIndex, setLineIndex] = useState(0);
  const LINES = ['Sorry...', "I didn't ask your name."];

  React.useEffect(() => {
    const t1 = setTimeout(() => setLineIndex(1), 1400);
    const t2 = setTimeout(() => setDialogueDone(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const norm = normalize(value);
    if (VALID.includes(norm)) {
      playSFX('soft-chime');
      setError(false);
      setLeaving(true);
      setTimeout(onNext, 900);
    } else {
      playSFX('boop');
      setError(true);
      setErrorMsg(value.trim() === '' ? 'Please type your name...' : "Hmm... I don't think that's her name. Try again.");
      inputRef.current?.classList.add('input--shake');
      setTimeout(() => inputRef.current?.classList.remove('input--shake'), 600);
    }
  };

  return (
    <div className={`scene scene--name ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--name" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character emotion={error ? 'suspiciousRead' : 'curious'} size={Math.min(window.innerWidth * 0.36, 280)} />
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

        {dialogueDone && (
          <form className="name-form" onSubmit={handleSubmit} noValidate>
            <div className="input-wrap" ref={inputRef}>
              <input
                id="name-input"
                type="text"
                value={value}
                onChange={e => { setValue(e.target.value); setError(false); }}
                placeholder="Your name..."
                className={`scene-input ${error ? 'scene-input--error' : ''}`}
                autoComplete="off"
                autoFocus
                aria-label="Enter your name"
              />
              <div className="input-underline" />
            </div>

            {error && (
              <div className="inline-error" role="alert" aria-live="polite">
                <span className="inline-error__icon">✦</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="btn-name-submit"
              type="submit"
              className="scene-btn scene-btn--primary"
              aria-label="Submit name"
            >
              That's me →
              <div className="btn-glow" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
