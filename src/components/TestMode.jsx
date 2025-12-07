import React, { useEffect, useState } from "react";
import LifelinesBar from "./LifelinesBar.jsx";
import Ladder from "./Ladder.jsx";
import "./TestMode.css";

const play = (p) => {
  try {
    if (!p) return;
    const a = new Audio(p);
    a.volume = 0.9;
    a.play().catch(() => {});
  } catch (e) { console.error("Error:", e); }
};

export default function TestMode({ quiz, onExit }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [resultState, setResultState] = useState(null);
  const [locked, setLocked] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audience, setAudience] = useState(null);
  const [lifelines, setLifelines] = useState({
    fiftyUsed: false, audienceUsed: false, flipUsed: false,
  });

  useEffect(() => {
    setSelected(null);
    setResultState(null);
    setLocked(false);
    setHiddenOptions([]);
    setAudience(null);
  }, [idx]);

  if (!quiz || quiz.length === 0) {
    return <div className="no-questions">No questions found. Add questions first.</div>;
  }

  const q = quiz[idx];

  const handleSelect = (i) => {
    if (locked || hiddenOptions.includes(i)) return;
    setSelected(i);
    setLocked(true);
    play("/sounds/lock.mp3");

    setTimeout(() => {
      const correct = i === q.answer;
      setResultState(correct ? "correct" : "wrong");
      play(correct ? "/sounds/correct.mp3" : "/sounds/wrong.mp3");
    }, 900);
  };

  const handleNext = () => {
    if (resultState !== "correct") return alert("Select the correct answer to continue.");
    if (idx < quiz.length - 1) setIdx(idx + 1);
    else { alert("Quiz Completed!"); onExit(); }
  };

  const handleQuit = () => {
    if (confirm("Quit the game and return?")) onExit();
  };

  const useFifty = () => {
    if (lifelines.fiftyUsed) return;
    const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer);
    const two = wrong.sort(() => Math.random() - 0.5).slice(0, 2);

    setHiddenOptions(two);
    setLifelines({ ...lifelines, fiftyUsed: true });
    play("/sounds/lock.mp3");
  };

  const useAudience = () => {
    if (lifelines.audienceUsed) return;

    const votes = [0, 0, 0, 0];
    let remaining = 100;
    const correctVote = 40 + Math.floor(Math.random() * 31);
    votes[q.answer] = correctVote;
    remaining -= correctVote;

    const others = [0,1,2,3].filter(i => i !== q.answer);
    others.forEach((o, k) => {
      if (k === others.length - 1) votes[o] = remaining;
      else {
        const v = Math.floor(Math.random() * (remaining - (others.length - k - 1)));
        votes[o] = v;
        remaining -= v;
      }
    });

    setAudience(votes);
    setLifelines({ ...lifelines, audienceUsed: true });
    play("/sounds/audience.mp3");
  };

  const useFlip = () => {
    if (lifelines.flipUsed) return;
    if (idx >= quiz.length - 1) return alert("No more questions to flip.");
    setLifelines({ ...lifelines, flipUsed: true });
    setIdx(idx + 1);
  };

  return (
    <div className="test-container">

      <div className="ladder-area">
        <Ladder currentStep={idx} />
      </div>

      <div className="main-area">
        <div className="top-row">
          <div className="question-count">Question {idx + 1} / {quiz.length}</div>

          <div className="quit-box">
            <button className="quit-btn" onClick={handleQuit}>Quit</button>
            <span className="mode-tag">KBC Mode</span>
          </div>
        </div>

        <LifelinesBar
          lifelines={lifelines}
          onFifty={useFifty}
          onAudience={useAudience}
          onFlip={useFlip}
        />

        <div className="question-box">
          <div className="question-text">{q.question}</div>
        </div>

        <div className="options-grid">
          {q.options.map((opt, i) => {
            const hidden = hiddenOptions.includes(i);
            const correct = resultState && i === q.answer;
            const wrong = resultState && selected === i && i !== q.answer;
            const selectedNow = selected === i;

            return (
              <div key={i}>
                <button
                  className={`opt-btn
                    ${hidden ? "opt-hidden" : ""}
                    ${correct ? "opt-correct" : ""}
                    ${wrong ? "opt-wrong" : ""}
                    ${selectedNow ? "opt-selected" : ""}
                  `}
                  onClick={() => handleSelect(i)}
                  disabled={resultState !== null || hidden}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + i)}.</span>
                  <span className="opt-label">{opt}</span>
                </button>

                {audience && (
                  <div className="audience-bar">
                    <div className="audience-fill" style={{ width: `${audience[i]}%` }}></div>
                    <div className="audience-percent">{audience[i]}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bottom-row">
          <button
            className="next-btn"
            disabled={resultState !== "correct"}
            onClick={handleNext}
          >
            {idx < quiz.length - 1 ? "Next Question" : "Finish"}
          </button>
        </div>

        {resultState === "wrong" && (
          <div className="wrong-msg">Wrong answer — Game Over.</div>
        )}
      </div>
    </div>
  );
}
