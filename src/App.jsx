import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import HomePage from "./components/HomePage.jsx";
import AddQuestionForm from "./components/AddQuestionForm.jsx";
import QuizList from "./components/QuizList.jsx";
import EditModal from "./components/EditModal.jsx";
import KbcGame from "./components/KbcGame.jsx";
import GameResult from "./components/GameResult.jsx";
import { SAMPLE } from "./sample-questions.js";

export default function App() {
  const [quiz, setQuiz] = useLocalStorage("kbc_quiz", []);
  const [page, setPage] = useState("home");
  const [editing, setEditing] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  // Load sample questions only once if empty
  useEffect(() => {
    if (!quiz || quiz.length === 0) {
      setQuiz(SAMPLE);
    }
    // eslint-disable-next-line
  }, []);

  // Add new question
  const addQuestion = (q) => setQuiz((prev) => [q, ...prev]);

  // Delete question
  const deleteQuestion = (id) => {
    if (confirm("Delete?")) {
      setQuiz((prev) => prev.filter((x) => x.id !== id));
    }
  };

  // Save edited question
  const saveEdit = (item) => {
    setQuiz((prev) => prev.map((x) => (x.id === item.id ? item : x)));
    setEditing(null);
  };

  // Start KBC Game
  const startGame = () => {
    if (!quiz || quiz.length === 0) {
      return alert("Add questions first");
    }
    setPage("game");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* HOME PAGE */}
      {page === "home" && (
        <HomePage
          onStartBuilder={() => setPage("builder")}
          onPlayQuick={() => setPage("game")}
          totalQuestions={quiz.length}
        />
      )}

      {/* QUIZ BUILDER PAGE */}
      {page === "builder" && (
        <div className="min-h-screen bg-slate-950 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setPage("home")}
              className="mb-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
              ← Back Home
            </button>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side — Add Questions */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Quiz Builder</h2>
                <AddQuestionForm onAdd={addQuestion} />
                <div className="mt-6">
                  <button
                    onClick={startGame}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={!quiz || quiz.length === 0}
                  >
                    ▶️ Play KBC Game
                  </button>
                </div>
              </div>

              {/* Right Side — Questions List */}
              <div>
                <QuizList
                  items={quiz}
                  onEdit={(q) => setEditing(q)}
                  onDelete={deleteQuestion}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME PAGE */}
      {page === "game" && (
        <KbcGame
          questions={quiz}
          onGameEnd={(score) => {
            setFinalScore(score);
            setPage("result");
          }}
        />
      )}

      {/* RESULT PAGE */}
      {page === "result" && (
        <GameResult
          score={finalScore}
          totalQuestions={quiz.length}
          onPlayAgain={() => setPage("game")}
          onGoHome={() => setPage("home")}
        />
      )}

      {/* EDIT MODAL */}
      <EditModal
        item={editing}
        onClose={() => setEditing(null)}
        onSave={saveEdit}
      />
    </div>
  );
}
