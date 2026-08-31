import React from 'react';
import useAudio from '../../hooks/useAudio';
import './AudioToggle.css';

export default function AudioToggle() {
  const { isMuted, toggleMute, unlocked } = useAudio();

  if (!unlocked) return null;

  return (
    <button
      className="audio-toggle-btn"
      onClick={toggleMute}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <span className="audio-toggle-icon">{isMuted ? '🔇' : '🔊'}</span>
      <span className="audio-toggle-ripple" />
    </button>
  );
}
