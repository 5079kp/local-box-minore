import React, { useEffect, useState } from "react";
import "./EditModal.css";

export default function EditModal({ item, onClose, onSave }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState(0);

  useEffect(() => {
    if (item) {
      setQuestion(item.question);
      setOptions(item.options);
      setAnswer(item.answer);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    if (!question.trim()) return alert("Question required");
    if (options.some((o) => !o.trim())) return alert("Fill all options");

    onSave({ ...item, question: question.trim(), options, answer });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <h3 className="modal-title">Edit Question</h3>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="modal-textarea"
        />

        <div className="options-grid">
          {options.map((o, i) => (
            <input
              key={i}
              value={o}
              onChange={(e) => {
                const c = [...options];
                c[i] = e.target.value;
                setOptions(c);
              }}
              className="option-input"
            />
          ))}
        </div>

        <div className="footer-row">
          
          <div className="select-box">
            <label>Correct: </label>
            <select
              value={answer}
              onChange={(e) => setAnswer(Number(e.target.value))}
            >
              {options.map((_, i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="btn-group">
            <button onClick={onClose} className="btn cancel-btn">Cancel</button>
            <button onClick={handleSave} className="btn save-btn">Save</button>
          </div>

        </div>
      </div>
    </div>
  );
}
