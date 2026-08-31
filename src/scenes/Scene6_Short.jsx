import React, { useState } from 'react';
import Character from '../components/Character/Character';
import './Scenes.css';

export default function Scene6_Short({ onNext }) {
  const [answered, setAnswered] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const handle = (ans) => {
    setAnswered(ans);
    setTimeout(() => {
      setLeaving(true);
      setTimeout(onNext, 700);
    }, 1800);
  };

  const reactions = {
    Yes: ['Hmmm.', 'Okay then.'],
    No: ['Sure.', 'Right.'],
  };

  return (
    <div className={`scene scene--short ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--short" />

      <div className="scene-content scene-content--centered">
        <div className="scene-character">
          <Character
            emotion={!answered ? 'suspiciousDetective' : 'teasing'}
            size={Math.min(window.innerWidth * 0.36, 280)}
          />
        </div>

        {!answered ? (
          <>
            <div className="scene-question">Are you short?</div>
            <div className="dual-btn-row">
              <button id="btn-short-yes" className="scene-btn scene-btn--dual" onClick={() => handle('Yes')}>
                Yes
                <div className="btn-glow" />
              </button>
              <button id="btn-short-no" className="scene-btn scene-btn--dual" onClick={() => handle('No')}>
                No
                <div className="btn-glow" />
              </button>
            </div>
          </>
        ) : (
          <div className="scene-dialogue-stack">
            {reactions[answered].map((line, i) => (
              <div key={i} className="stacked-line stacked-line--active" style={{ animationDelay: `${i * 0.7}s` }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
