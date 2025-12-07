import React, { useState } from "react";
import "./AddQuestionForm.css";

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function AddQuestionForm({ onAdd }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(0);

  const handleOptChange = (i, val) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return alert("Enter question");
    if (options.some((o) => !o.trim())) return alert("Fill all options");

    onAdd({ id: generateId(), question: question.trim(), options, answer });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer(0);
  };

  return (
    <form onSubmit={handleSubmit} className="kbc-form">

      <h3 className="form-title">Add Question</h3>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question..."
        required
        className="form-textarea"
      />

      <div className="options-grid">
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => handleOptChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            required
            className="option-input"
          />
        ))}
      </div>

      <div className="answer-row">
        <label>Correct Answer :</label>
        <select
          value={answer}
          onChange={(e) => setAnswer(Number(e.target.value))}
          className="answer-select"
        >
          {options.map((_, i) => (
            <option key={i} value={i}>
              Option {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button className="submit-btn">Add Question</button>
    </form>
  );
}
