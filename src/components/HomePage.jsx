import React from "react";
import "./HomePage.css";

export default function HomePage({ onStartBuilder, onPlayQuick, totalQuestions }) {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="kbc-logo-large">
            <span className="logo-text">KBC</span>
            <span className="logo-subtitle">Kaun Banega Crorepati</span>
          </div>
          <p className="home-tagline">Test Your Knowledge, Win Great Prizes!</p>
        </div>

        <div className="home-cards">
          <div className="home-card builder-card" onClick={onStartBuilder}>
            <div className="card-icon">🏗️</div>
            <h3>Quiz Builder</h3>
            <p>Create and manage quiz questions</p>
            {totalQuestions > 0 && (
              <span className="question-count">{totalQuestions} Questions</span>
            )}
          </div>

          <div
            className={`home-card play-card ${totalQuestions === 0 ? "disabled" : ""}`}
            onClick={totalQuestions > 0 ? onPlayQuick : null}
          >
            <div className="card-icon">🎮</div>
            <h3>Play KBC</h3>
            <p>Test your knowledge and compete</p>
            {totalQuestions === 0 ? (
              <span className="error-text">Add questions first</span>
            ) : (
              <span className="ready-text">Ready to play!</span>
            )}
          </div>
        </div>

        <footer className="home-footer">
          <p>© 2025 KBC Quiz Game | Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}
