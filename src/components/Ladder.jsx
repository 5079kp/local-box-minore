import React from "react";
import "./Ladder.css";

const LEVELS = [
  "₹ 1 Crore", "₹ 50,00,000", "₹ 25,00,000", "₹ 12,50,000", "₹ 6,40,000",
  "₹ 3,20,000", "₹ 1,60,000", "₹ 80,000", "₹ 40,000", "₹ 20,000",
  "₹ 10,000", "₹ 5,000", "₹ 3,000", "₹ 2,000", "₹ 1,000",
];

export default function Ladder({ currentStep }) {
  return (
    <div className="ladder-box">
      <h3 className="ladder-title">PRIZE LADDER</h3>

      <ul className="ladder-list">
        {LEVELS.map((label, i) => {
          const indexFromTop = LEVELS.length - i + 1; 
          const isActive = indexFromTop === currentStep;

          return (
            <li
              key={i}
              className={`ladder-item ${isActive ? "active" : ""}`}
            >
              <span className="ladder-number">{LEVELS.length - i}</span>
              <span className="ladder-label">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
