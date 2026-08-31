import React, { useState, useEffect, useRef } from 'react';
import Character from '../components/Character/Character';
import CinematicOverlay from '../components/CinematicOverlay/CinematicOverlay';
import useAudio from '../hooks/useAudio';
import './Scenes.css';
import './Scene7.css';

// Sequence timing:
// 0.0s  -> normal scene
// 0.6s  -> play audio, begin zoom
// 2.4s  -> zoomed (hold)
// 3.4s  -> text appears
// 6.0s  -> smooth pull out, audio fades back to normal
// 7.8s  -> done

export default function Scene7_EyeZoom({ onNext }) {
  const [phase, setPhase] = useState('enter'); // enter | zooming-in | zoomed | text | zooming-out | done
  const [leaving, setLeaving] = useState(false);
  const [cameraTransform, setCameraTransform] = useState('translate(0px, 0px) scale(1)');
  
  const viewportRef = useRef(null);
  const characterRef = useRef(null);
  const baseEyePosRef = useRef(null);
  
  const { playBGM } = useAudio();

  // Measure character's exact initial eye position
  useEffect(() => {
    if (viewportRef.current && characterRef.current) {
      const vp = viewportRef.current.getBoundingClientRect();
      const char = characterRef.current.getBoundingClientRect();
      
      // The eyes in the SVG are at 50% X and 37% Y of its bounding box.
      const Ex = char.left - vp.left + (char.width * 0.5);
      const Ey = char.top - vp.top + (char.height * 0.37);
      
      baseEyePosRef.current = { Ex, Ey };
    }
  }, []);

  useEffect(() => {
    const t0 = setTimeout(() => {
      setPhase('zooming-in');
      playBGM('eyezoom'); // Fade out normal BGM, start subtle atmospheric
    }, 600);
    
    const t1 = setTimeout(() => setPhase('zoomed'), 2400);
    const t2 = setTimeout(() => setPhase('text'), 3400);
    
    const t3 = setTimeout(() => {
      setPhase('zooming-out');
      playBGM('mystery'); // Gently restore the music
    }, 6000);
    
    const t4 = setTimeout(() => {
      setLeaving(true);
      setTimeout(onNext, 800);
    }, 7800);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [playBGM, onNext]);

  useEffect(() => {
    if (!baseEyePosRef.current || !viewportRef.current) return;
    
    const { Ex, Ey } = baseEyePosRef.current;
    const vp = viewportRef.current.getBoundingClientRect();
    const Cx = vp.width / 2;
    const Cy = vp.height / 2;
    
    if (phase === 'zooming-in' || phase === 'zoomed' || phase === 'text') {
      const S = 3.6; // Cinematic zoom factor
      const Tx = Cx - Ex * S;
      const Ty = Cy - Ey * S;
      setCameraTransform(`translate(${Tx}px, ${Ty}px) scale(${S})`);
    } else {
      setCameraTransform('translate(0px, 0px) scale(1)');
    }
  }, [phase]);

  // Mask opacity driven by phase
  const isZoomed = phase === 'zooming-in' || phase === 'zoomed' || phase === 'text';

  return (
    <div className={`scene scene--eyezoom ${leaving ? 'scene--exit' : 'scene--enter'}`}>
      <div className="scene-bg scene-bg--eyezoom" />

      {/* Cinematic Viewport acts as the window */}
      <div className="cinematic-viewport" ref={viewportRef}>
        
        {/* The Camera moves and scales everything inside it */}
        <div 
          className="camera" 
          style={{ transform: cameraTransform }}
        >
          {/* Character remains in its original layout position, but the camera moves it */}
          <div className="character-wrapper" ref={characterRef}>
            <Character emotion="suspiciousDetective" size={Math.min(window.innerWidth * 0.55, 420)} />
          </div>
        </div>
        
        {/* Smooth vignette overlay */}
        <div className={`vignette-overlay ${isZoomed ? 'vignette-overlay--active' : ''}`} />
      </div>

      {/* Text overlay */}
      <CinematicOverlay
        phase={phase === 'enter' || phase === 'zooming-in' ? 'idle' : phase}
        text="This is getting suspicious..."
      />
    </div>
  );
}
