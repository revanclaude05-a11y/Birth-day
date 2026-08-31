import { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================================
   useDialogue — Sequence dialogue lines with timing
   Returns: { line, lineIndex, done, next, reset }
   ============================================================ */

export default function useDialogue(lines = [], { msBetween = 1400, autoPlay = true } = {}) {
  const [lineIndex, setLineIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    setLineIndex(prev => {
      const next = prev + 1;
      if (next >= lines.length) {
        setDone(true);
        return prev;
      }
      return next;
    });
  }, [lines.length]);

  useEffect(() => {
    setLineIndex(-1);
    setDone(false);

    if (!autoPlay || lines.length === 0) return;

    const kickoff = setTimeout(() => {
      setLineIndex(0);
      let idx = 0;

      const tick = () => {
        idx++;
        if (idx < lines.length) {
          timerRef.current = setTimeout(() => {
            setLineIndex(idx);
            tick();
          }, msBetween);
        } else {
          timerRef.current = setTimeout(() => setDone(true), msBetween);
        }
      };
      timerRef.current = setTimeout(tick, msBetween);
    }, 300);

    return () => {
      clearTimeout(kickoff);
      clearTimeout(timerRef.current);
    };
  }, [lines.join('||'), msBetween, autoPlay]); // eslint-disable-line

  const line = lineIndex >= 0 ? lines[lineIndex] : '';

  return { line, lineIndex, done };
}
