import React, { useState, useEffect, useRef } from 'react';
import './Dialogue.css';

/* ============================================================
   DIALOGUE — Animated cinematic caption system
   Props:
     lines: string[]         — lines to display
     onComplete: fn          — called when all lines done
     speed: 'slow'|'normal'  — typing speed
     style: 'caption'|'bubble' — visual mode
   ============================================================ */

export default function Dialogue({ lines = [], onComplete, speed = 'normal', mode = 'caption', autoPlay = true }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayed, setDisplayed] = useState([]);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef(null);
  const lineTimeoutRef = useRef(null);

  // Reset when lines change
  useEffect(() => {
    setCurrentLine(0);
    setDisplayed([]);
    setDone(false);
    if (autoPlay) {
      startLine(0, lines);
    }
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(lineTimeoutRef.current);
    };
  }, [lines.join('|')]); // eslint-disable-line

  const startLine = (idx, allLines) => {
    if (idx >= allLines.length) {
      setDone(true);
      onComplete && onComplete();
      return;
    }
    setTyping(true);
    setCurrentLine(idx);

    // Add line to displayed (will animate in)
    setDisplayed(prev => [...prev, { text: allLines[idx], idx }]);

    const pausePerChar = speed === 'slow' ? 60 : 40;
    const linePause = allLines[idx].length * pausePerChar + 900;

    lineTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      timeoutRef.current = setTimeout(() => {
        startLine(idx + 1, allLines);
      }, 600);
    }, linePause);
  };

  return (
    <div className={`dialogue dialogue--${mode}`} aria-live="polite">
      {displayed.map((item, i) => (
        <div
          key={item.idx}
          className={`dialogue__line dialogue__line--${mode} ${i === displayed.length - 1 ? 'dialogue__line--active' : 'dialogue__line--past'}`}
          style={{ '--delay': `${i * 0.05}s` }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
