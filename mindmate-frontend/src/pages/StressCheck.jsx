import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const QUESTIONS = [
  "I feel overwhelmed by my placement preparation",
  "I have difficulty concentrating on studies",
  "I feel nervous or anxious about upcoming interviews",
  "I have trouble sleeping due to placement stress",
  "I feel like I'm not good enough compared to peers",
  "I get irritated easily over small things",
  "I feel physically tense or have headaches",
  "I keep thinking about worst-case scenarios",
  "I feel disconnected or unmotivated",
  "I find it hard to take breaks without feeling guilty",
];

const OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
];

export default function StressCheck() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get("/stress")
      .then((res) => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setAnswer = (idx, val) => {
    const updated = [...answers];
    updated[idx] = val;
    setAnswers(updated);
  };

  const submitQuiz = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const score = answers.reduce((sum, a) => sum + a, 0);
    setSubmitting(true);
    try {
      const res = await API.post("/stress", { answers, score });
      setResult(res.data);
      const updated = await API.get("/stress");
      setHistory(updated.data);
      setAnswers(Array(QUESTIONS.length).fill(null));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === "Low") return "#22c55e";
    if (level === "Moderate") return "#f59e0b";
    return "#ef4444";
  };

  const getLevelMessage = (level) => {
    if (level === "Low")
      return "You're managing well! Keep up healthy habits.";
    if (level === "Moderate")
      return "Some stress is normal. Try the relaxation exercises.";
    return "High stress detected. Please take a break and talk to someone you trust.";
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <h1 className="title">📊 Stress Check</h1>
          <p className="subtitle">
            Answer honestly — this is just for you
          </p>
        </div>

        {result && (
          <div
            className="stress-result"
            style={{ borderColor: getLevelColor(result.level) }}
          >
            <div className="result-score" style={{ color: getLevelColor(result.level) }}>
              Score: {result.score} / 20 — {result.level} Stress
            </div>
            <p className="result-msg">{getLevelMessage(result.level)}</p>
            <button
              className="primary-btn"
              onClick={() => setResult(null)}
              style={{ marginTop: "12px" }}
            >
              Take Again
            </button>
          </div>
        )}

        {!result && (
          <>
            <div className="quiz-progress">
              {answered} / {QUESTIONS.length} answered
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="quiz-list">
              {QUESTIONS.map((q, idx) => (
                <div key={idx} className="quiz-question">
                  <p className="q-text">
                    <span className="q-num">{idx + 1}.</span> {q}
                  </p>
                  <div className="q-options">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`q-btn ${answers[idx] === opt.value ? "q-selected" : ""}`}
                        onClick={() => setAnswer(idx, opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="primary-btn"
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </>
        )}

        {/* History */}
        <div className="section-title" style={{ marginTop: "40px" }}>
          📅 Past Results
        </div>
        {loading ? (
          <div className="loading">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">No stress checks yet.</div>
        ) : (
          <div className="stress-history">
            {history.map((entry) => (
              <div key={entry._id} className="stress-entry">
                <div
                  className="stress-badge"
                  style={{ background: getLevelColor(entry.level) }}
                >
                  {entry.level}
                </div>
                <div className="stress-score">Score: {entry.score}/20</div>
                <div className="stress-date">{formatDate(entry.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}