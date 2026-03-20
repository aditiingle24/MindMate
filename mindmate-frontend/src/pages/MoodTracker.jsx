import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const MOODS = [
  { label: "Happy",   emoji: "😄" },
  { label: "Calm",    emoji: "😌" },
  { label: "Anxious", emoji: "😰" },
  { label: "Stressed",emoji: "😤" },
  { label: "Sad",     emoji: "😔" },
  { label: "Excited", emoji: "🤩" },
  { label: "Tired",   emoji: "😴" },
];

export default function MoodTracker() {
  const [selected, setSelected]   = useState(null);
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState("");

  const fetchMoods = async () => {
    try {
      const res = await API.get("/mood");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const logMood = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await API.post("/mood", { mood: selected });
      setSuccess("Mood logged successfully!");
      setSelected(null);
      fetchMoods();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMood = async (id) => {
    try {
      await API.delete(`/mood/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getMoodEmoji = (label) =>
    MOODS.find((m) => m.label === label)?.emoji || "😶";

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <h1 className="title">😊 Mood Tracker</h1>
          <p className="subtitle">
            How are you feeling right now? · Use the Journal for detailed thoughts
          </p>
        </div>

        {/* Mood selector */}
        <div className="mood-section">
          <div className="mood-grid">
            {MOODS.map((m) => (
              <button
                key={m.label}
                className={`mood-btn ${selected === m.label ? "mood-selected" : ""}`}
                onClick={() => setSelected(m.label)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {success && <div className="success-msg">{success}</div>}

          <button
            className="primary-btn"
            onClick={logMood}
            disabled={!selected || submitting}
          >
            {submitting ? "Saving..." : "Log Mood"}
          </button>

          <p className="mood-journal-hint">
            💬 Want to add more context?{" "}
            <a href="/journal" className="mood-journal-link">
              Open your Journal →
            </a>
          </p>
        </div>

        {/* History */}
        <div className="section-title">📅 Recent Entries</div>
        {loading ? (
          <div className="loading">Loading history...</div>
        ) : entries.length === 0 ? (
          <div className="empty-state">No mood entries yet. Log your first mood above!</div>
        ) : (
          <div className="mood-history">
            {entries.map((entry) => (
              <div key={entry._id} className="mood-entry">
                <div className="mood-entry-left">
                  <span className="mood-entry-emoji">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <div className="mood-entry-label">{entry.mood}</div>
                    <div className="mood-entry-date">{formatDate(entry.createdAt)}</div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteMood(entry._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}