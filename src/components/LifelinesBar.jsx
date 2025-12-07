import React from "react";
import "./LifelineBar.css";

export default function LifelinesBar({ lifelines, onFifty, onAudience, onFlip }) {
  return (
    <div className="lifeline-container">

      <button
        disabled={lifelines.fiftyUsed}
        onClick={onFifty}
        className={`lifeline-btn ${lifelines.fiftyUsed ? "disabled" : "fifty"}`}
      >
        50:50
      </button>

      <button
        disabled={lifelines.audienceUsed}
        onClick={onAudience}
        className={`lifeline-btn ${lifelines.audienceUsed ? "disabled" : "audience"}`}
      >
        Audience
      </button>

      <button
        disabled={lifelines.flipUsed}
        onClick={onFlip}
        className={`lifeline-btn ${lifelines.flipUsed ? "disabled" : "flip"}`}
      >
        Flip
      </button>

    </div>
  );
}
