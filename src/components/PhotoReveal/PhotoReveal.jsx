import React from 'react';
import './PhotoReveal.css';

/* ============================================================
   PHOTO REVEAL — Premium photo frame component
   ============================================================ */

export default function PhotoReveal({ src = '/assets/zara.jpg', name = 'Zara' }) {
  return (
    <div className="photo-reveal">
      {/* Outer decorative ring */}
      <div className="photo-ring photo-ring--outer" />
      <div className="photo-ring photo-ring--mid" />

      {/* Frame */}
      <div className="photo-frame">
        {/* Paper layers for depth */}
        <div className="photo-paper photo-paper--3" />
        <div className="photo-paper photo-paper--2" />
        <div className="photo-paper photo-paper--1" />

        {/* Actual photo */}
        <div className="photo-container">
          <img
            src={src}
            alt={`${name}'s photo`}
            className="photo-img"
            draggable="false"
          />
          {/* Gloss overlay */}
          <div className="photo-gloss" />
        </div>
      </div>

      {/* Decorative stars */}
      <div className="photo-star photo-star--1">✦</div>
      <div className="photo-star photo-star--2">✧</div>
      <div className="photo-star photo-star--3">✦</div>
      <div className="photo-star photo-star--4">✧</div>
      <div className="photo-star photo-star--5">✦</div>

      {/* Glow */}
      <div className="photo-glow" />
    </div>
  );
}
