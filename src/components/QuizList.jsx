import React from "react";
import "./QuizList.css";

export default function QuizList({ items, onEdit, onDelete }) {

  if (!items.length)
    return <div className="empty-text">No questions yet.</div>;

  return (
    <div className="quiz-list">
      {items.map((q, idx) => (
        <div key={q.id} className="q-card">

          <div className="q-left">
            <div className="q-number">Q{idx + 1}</div>

            <div className="q-question">{q.question}</div>

            <div className="q-options">
              {q.options.map((o, i) => (
                <div
                  key={i}
                  className={
                    "q-option " + (q.answer === i ? "correct" : "normal")
                  }
                >
                  <span className="opt-label">{String.fromCharCode(65 + i)}.</span>
                  {o}
                </div>
              ))}
            </div>
          </div>

          <div className="q-actions">
            <button className="btn edit-btn" onClick={() => onEdit(q)}>
              Edit
            </button>
            <button className="btn delete-btn" onClick={() => onDelete(q.id)}>
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
