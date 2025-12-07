import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "./GameResult.css";

export default function GameResult({ score, totalQuestions, onPlayAgain, onGoHome }) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfect = score === totalQuestions;

  useEffect(() => {
    if (isPerfect) {
      confetti({
        particleCount: 200,
        spread: 150,
        origin: { y: 0.5 }
      });
    }
  }, [isPerfect]);

  const getResultMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a Master! 👑";
    if (percentage >= 80) return "Excellent! Outstanding performance! 🌟";
    if (percentage >= 60) return "Great! Well done! 👏";
    if (percentage >= 40) return "Good effort! Keep practicing! 💪";
    return "Nice try! Better luck next time! 🎯";
  };

  const getResultColor = () => {
    if (percentage >= 80) return "result-excellent";
    if (percentage >= 60) return "result-good";
    if (percentage >= 40) return "result-fair";
    return "result-poor";
  };

  return (
    <div className="game-result">
      <div className="result-container">
        <div className="result-header">
          <h2 className="result-title">🎊 Quiz Complete!</h2>
          <p className="result-subtitle">Here's how you performed:</p>
        </div>

        <div className={`result-card ${getResultColor()}`}>
          <div className="score-circle">
            <div className="score-inner">
              <span className="score-percentage">{percentage}%</span>
              <span className="score-label">Score</span>
            </div>
            <svg className="score-ring" viewBox="0 0 160 160">
              <circle className="score-ring-circle" cx="80" cy="80" r="76" />
              <circle
                className="score-ring-fill"
                cx="80"
                cy="80"
                r="76"
                style={{
                  strokeDasharray: `${(percentage / 100) * 477.5} 477.5`
                }}
              />
            </svg>
          </div>

          <div className="result-stats">
            <div className="stat-box">
              <div className="stat-value">{score}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalQuestions - score}</div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">Total Questions</div>
            </div>
          </div>

          <p className="result-message">{getResultMessage()}</p>
        </div>

        <div className="result-actions">
          <button className="btn-primary" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
          <button className="btn-secondary" onClick={onGoHome}>
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
