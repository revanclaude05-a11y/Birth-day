import React, { useState, useCallback } from 'react';
import { AudioProvider } from './context/AudioContext';
import AudioToggle from './components/AudioToggle/AudioToggle';
import Sparkles from './components/Confetti/Sparkles';
import Scene1_Intro from './scenes/Scene1_Intro';
import Scene2_Clues from './scenes/Scene2_Clues';
import Scene3_Name from './scenes/Scene3_Name';
import Scene4_Suspicion from './scenes/Scene4_Suspicion';
import Scene5_Color from './scenes/Scene5_Color';
import Scene6_Short from './scenes/Scene6_Short';
import Scene7_EyeZoom from './scenes/Scene7_EyeZoom';
import Scene8_IceCream from './scenes/Scene8_IceCream';
import Scene9_Realization from './scenes/Scene9_Realization';
import Scene10_Birthday from './scenes/Scene10_Birthday';
import Scene11_Bag from './scenes/Scene11_Bag';
import './App.css';

// Import scene-specific CSS
import './scenes/Scene9.css';
import './scenes/Scene10.css';
import './scenes/Scene11.css';
import './components/Confetti/Sparkles.css';

const SCENES = [
  'intro',       // 1
  'clues',       // 2
  'name',        // 3
  'suspicion',   // 4
  'color',       // 5
  'short',       // 6
  'eyezoom',     // 7
  'icecream',    // 8
  'realization', // 9
  'birthday',    // 10
  'bag',         // 11
];

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);

  const goNext = useCallback(() => {
    setSceneIndex(i => Math.min(i + 1, SCENES.length - 1));
  }, []);

  const scene = SCENES[sceneIndex];

  return (
    <AudioProvider>
      <div className="app" role="main" aria-label="Birthday experience for Zara">
        {/* Floating audio toggle */}
        <AudioToggle />

        {/* Ambient sparkles (always present except eye zoom) */}
        {scene !== 'eyezoom' && <Sparkles active={true} />}

        {/* Scene rendering */}
        <div className="scene-stage">
          {scene === 'intro' && <Scene1_Intro onNext={goNext} key="intro" />}
          {scene === 'clues' && <Scene2_Clues onNext={goNext} key="clues" />}
          {scene === 'name' && <Scene3_Name onNext={goNext} key="name" />}
          {scene === 'suspicion' && <Scene4_Suspicion onNext={goNext} key="suspicion" />}
          {scene === 'color' && <Scene5_Color onNext={goNext} key="color" />}
          {scene === 'short' && <Scene6_Short onNext={goNext} key="short" />}
          {scene === 'eyezoom' && <Scene7_EyeZoom onNext={goNext} key="eyezoom" />}
          {scene === 'icecream' && <Scene8_IceCream onNext={goNext} key="icecream" />}
          {scene === 'realization' && <Scene9_Realization onNext={goNext} key="realization" />}
          {scene === 'birthday' && <Scene10_Birthday onNext={goNext} key="birthday" />}
          {scene === 'bag' && <Scene11_Bag key="bag" />}
        </div>
      </div>
    </AudioProvider>
  );
}
