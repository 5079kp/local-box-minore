import React, { useMemo, useState, useEffect, useRef } from "react";
import "./KbcGame.css";
import { gsap } from "gsap";
import confetti from "canvas-confetti";

const sounds = {
  next: "/sounds/next-question.mp3",
  host: "/sounds/host-voice.mp3",
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  click: "/sounds/click.mp3",
  bg: "/sounds/bg-music.mp3",
  lifeline: "/sounds/lifeline.mp3",
  audience: "/sounds/audience.mp3",
  flip: "/sounds/flip.mp3",
  call: "/sounds/call.mp3",
  win: "/sounds/win.mp3",
};

function playSound(key) {
  const src = sounds[key];
  if (!src) return;
  const a = new Audio(src);
  a.volume = 0.9;
  a.play().catch(() => {});
}

// SHUFFLE HELP
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// PRIZE LADDER – 1 to 15
const PRIZE_LADDER = [
  "₹ 1,000",
  "₹ 2,000",
  "₹ 3,000",
  "₹ 5,000",
  "₹ 10,000",
  "₹ 20,000",   // <-- yahan tak timer chalega (Q6)
  "₹ 40,000",
  "₹ 80,000",
  "₹ 1,60,000",
  "₹ 3,20,000",
  "₹ 6,40,000",
  "₹ 12,50,000",
  "₹ 25,00,000",
  "₹ 50,00,000",
  "₹ 1 Crore",
];

// 0-based index: 0–5 => 6 questions (last = ₹20,000)
const TIMED_LIMIT_INDEX = 5;

export default function KbcGame({ questions, onGameEnd }) {
  const quiz = useMemo(() => shuffleArray(questions || []), [questions]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(6);
  const [score, setScore] = useState(0);

  const [hiddenOptions, setHiddenOptions] = useState([]); // 50-50
  const [audienceData, setAudienceData] = useState(null); // Audience poll
  const [lifelines, setLifelines] = useState({
    fifty: false,
    audience: false,
    flip: false,
    call: false,
  });

  const current = quiz[index];
  const correct = current?.answer ?? 0;

  const qBoxRef = useRef(null);
  const optRef = useRef([]);

  // BG MUSIC
  useEffect(() => {
    const bg = new Audio(sounds.bg);
    bg.volume = 0.4;
    bg.loop = true;
    bg.play().catch(() => {});

    return () => bg.pause();
  }, []);

  // TIMER SYSTEM – sirf TIMED_LIMIT_INDEX (₹20,000) tak
  useEffect(() => {
    if (gameOver || !current) return;

    // High money questions (index > TIMED_LIMIT_INDEX): timer band
    if (index > TIMED_LIMIT_INDEX) return;

    // answer de diya ya correct/wrong state aa gaya
    if (status !== "idle") return;

    // Timer khatam → automatic wrong + next
    if (timer <= 0) {
      setStatus("wrong");
      playSound("wrong");
      setTimeout(() => {
        goNext();
      }, 1200);
      return;
    }

    const id = setTimeout(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearTimeout(id);
  }, [timer, status, gameOver, current, index]);

  // QUESTION ANIMATION + SOUND
  useEffect(() => {
    if (!current) return;

    // new question → agar timed hai to timer reset karo
    if (index <= TIMED_LIMIT_INDEX) {
      setTimer(6);
    } else {
      setTimer(0); // high money questions me timer nahi
    }

    const ctx = gsap.context(() => {
      gsap.from(qBoxRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.45,
        ease: "power3.out",
      });

      optRef.current.forEach((btn, i) => {
        if (!btn) return;
        gsap.from(btn, {
          opacity: 0,
          x: -40,
          duration: 0.35,
          delay: i * 0.06,
          ease: "power2.out",
        });
      });
    });

    playSound("host");
    const nextId = setTimeout(() => playSound("next"), 700);

    return () => {
      ctx.revert();
      clearTimeout(nextId);
    };
  }, [index, current]);

  const goNext = () => {
    setSelected(null);
    setStatus("idle");
    setHiddenOptions([]);
    setAudienceData(null);

    if (index === quiz.length - 1) {
      setGameOver(true);
      fireConfetti();
      playSound("win");
      if (onGameEnd) {
        setTimeout(() => onGameEnd(score), 1200);
      }
      return;
    }
    setIndex((x) => x + 1);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.6 },
    });
  };

  // OPTION CLICK
  const handleClick = (i) => {
    if (status !== "idle" || gameOver) return;
    if (hiddenOptions.includes(i)) return;

    setSelected(i);
    playSound("click");

    optRef.current[i]?.classList.add("sound-pulse");
    setTimeout(() => {
      optRef.current[i]?.classList.remove("sound-pulse");
    }, 400);

    if (i === correct) {
      setStatus("correct");
      setScore((prev) => prev + 1);
      playSound("correct");
    } else {
      setStatus("wrong");
      playSound("wrong");
    }

    setTimeout(() => goNext(), 1200);
  };

  // 50-50 Lifeline
  const handleFifty = () => {
    if (lifelines.fifty || !current) return;

    const incorrect = [0, 1, 2, 3].filter((i) => i !== correct);
    const hide = incorrect.sort(() => Math.random() - 0.5).slice(0, 2);
    setHiddenOptions(hide);

    setLifelines((prev) => ({ ...prev, fifty: true }));
    playSound("lifeline");
  };

  // Audience poll lifeline
  const handleAudience = () => {
    if (lifelines.audience || !current) return;

    const base = [0, 0, 0, 0];
    base[correct] = 60 + Math.floor(Math.random() * 21); // 60–80%

    for (let i = 0; i < 4; i++) {
      if (i !== correct) {
        base[i] = Math.floor(Math.random() * 25);
      }
    }

    setAudienceData(base);
    setLifelines((prev) => ({ ...prev, audience: true }));
    playSound("audience");
  };

  // Flip question lifeline
  const handleFlip = () => {
    if (lifelines.flip) return;

    setLifelines((prev) => ({ ...prev, flip: true }));
    playSound("flip");

    if (index < quiz.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setStatus("idle");
      setHiddenOptions([]);
      setAudienceData(null);
    }
  };

  // Call a Friend lifeline
  const handleCall = () => {
    if (lifelines.call || !current) return;

    setLifelines((prev) => ({ ...prev, call: true }));
    playSound("call");

    const hint = current.options[correct];
    alert("📞 Friend: Mujhe lagta hai jawab hai → " + hint);
  };

  if (!current) {
    return (
      <div className="kbc-root">
        <div className="kbc-inner">
          <h2>No questions found. Please add some questions first.</h2>
        </div>
      </div>
    );
  }

  const activePrizeIndex = index;

  return (
    <div className="kbc-root">
      <div className="kbc-game-frame">
        {/* TOP BRAND BAR */}
        <header className="kbc-header">
          <div className="kbc-brand">
            <span className="brand-main">KBC</span>
            <span className="brand-sub">Kaun Banega Crorepati</span>
          </div>

          <div className="kbc-header-right">
            <div className="question-count">
              Q {index + 1} / {quiz.length}
            </div>
            <button
              className="kbc-back-btn"
              onClick={() => window.history.back()}
            >
              ⬅ Back
            </button>
          </div>
        </header>

        <div className="kbc-main-row">
          {/* LEFT: Logo + Lifelines */}
          <div className="kbc-left">
            <div className="kbc-logo-circle">
              <div className="kbc-logo-inner">KBC</div>
              <div className="kbc-logo-subtitle">Kaun Banega Crorepati</div>
            </div>

            <div className="lifeline-bar lifeline-column">
              <button
                className={`lifeline-btn ${lifelines.fifty ? "used" : ""}`}
                onClick={handleFifty}
              >
                50 : 50
              </button>
              <button
                className={`lifeline-btn ${
                  lifelines.audience ? "used" : ""
                }`}
                onClick={handleAudience}
              >
                Audience
              </button>
              <button
                className={`lifeline-btn ${lifelines.flip ? "used" : ""}`}
                onClick={handleFlip}
              >
                Flip
              </button>
              <button
                className={`lifeline-btn ${lifelines.call ? "used" : ""}`}
                onClick={handleCall}
              >
                Phone a Friend
              </button>
            </div>
          </div>

          {/* CENTER: Question + Options */}
          <div className="kbc-center-area">
            {/* TIMER BAR – sirf ₹20,000 tak */}
            {index <= TIMED_LIMIT_INDEX && (
              <div className="kbc-timer-bar">
                <div
                  className="kbc-timer-fill"
                  style={{ width: `${(timer / 6) * 100}%` }}
                ></div>
              </div>
            )}

            {/* QUESTION */}
            <div className="question-box" ref={qBoxRef}>
              <div className="question-label">Question</div>
              <div className="question-text">{current.question}</div>
            </div>

            {/* OPTIONS */}
            <div className="options-grid-kbc">
              {current.options.map((opt, i) => {
                const isHidden = hiddenOptions.includes(i);

                return (
                  <button
                    key={i}
                    ref={(el) => (optRef.current[i] = el)}
                    onClick={() => handleClick(i)}
                    disabled={isHidden || gameOver}
                    className={`option-tile 
                      ${selected === i ? "option-selected" : ""} 
                      ${
                        status === "correct" && i === correct
                          ? "option-correct"
                          : ""
                      } 
                      ${
                        status === "wrong" && selected === i
                          ? "option-wrong"
                          : ""
                      }
                      ${isHidden ? "option-hidden" : ""}
                    `}
                  >
                    <span className="option-label">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className="option-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Audience Poll UI */}
            {audienceData && (
              <div className="gameover-panel" style={{ marginTop: "18px" }}>
                <h3>Audience Poll</h3>
                <p>
                  A: {audienceData[0]}% | B: {audienceData[1]}% | C:{" "}
                  {audienceData[2]}% | D: {audienceData[3]}%
                </p>
              </div>
            )}

            {/* GAME OVER */}
            {gameOver && (
              <div className="gameover-panel">
                <h2>🎉 Quiz Completed!</h2>
                <p>Thanks for playing KBC!</p>
              </div>
            )}
          </div>

          {/* RIGHT: Ladder */}
          <aside className="kbc-ladder">
            <div className="ladder-title">Prize Money</div>

            <ul className="ladder-list">
              {PRIZE_LADDER.map((p, i) => {
                const rev = PRIZE_LADDER.length - 1 - i;
                const active = rev === activePrizeIndex;
                const milestone = [4, 9, 14].includes(rev); // milestones

                return (
                  <li
                    key={i}
                    className={`ladder-item 
                      ${active ? "ladder-active" : ""} 
                      ${milestone ? "milestone" : ""}
                    `}
                  >
                    <span className="ladder-number">
                      {rev + 1 < 10 ? `0${rev + 1}` : rev + 1}
                    </span>
                    <span className="ladder-amount">{PRIZE_LADDER[rev]}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
