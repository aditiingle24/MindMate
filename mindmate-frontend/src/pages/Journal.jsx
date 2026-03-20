import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const MOOD_TAGS = [
  { label: "Happy", emoji: "😄", value: "happy" },
  { label: "Calm", emoji: "😌", value: "calm" },
  { label: "Anxious", emoji: "😰", value: "anxious" },
  { label: "Sad", emoji: "😢", value: "sad" },
  { label: "Motivated", emoji: "💪", value: "motivated" },
  { label: "Tired", emoji: "😴", value: "tired" },
];

const API = "http://localhost:5000/api/journal";
const token = () => localStorage.getItem("token");

export default function Journal() {
  const today = new Date().toISOString().split("T")[0];

  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState("neutral");
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Load all entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Load entry when selected date changes
  useEffect(() => {
    fetchEntry(selectedDate);
  }, [selectedDate]);

  const fetchEntries = async () => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setEntries(data);
  };

  const fetchEntry = async (date) => {
    const res = await fetch(`${API}/${date}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    if (data) {
      setContent(data.content);
      setMoodTag(data.mood_tag || "neutral");
      setWordCount(data.content.trim().split(/\s+/).filter(Boolean).length);
    } else {
      setContent("");
      setMoodTag("neutral");
      setWordCount(0);
    }
    setSaved(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
    setSaved(false);
  };

 const saveEntry = async () => {
  if (!content.trim()) return;
  setSaving(true);
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify({ content, mood_tag: moodTag, date: selectedDate }), // ← add date
    });
    setSaved(true);
    fetchEntries();
  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  const deleteEntry = async (date) => {
    if (!window.confirm("Delete this entry?")) return;
    await fetch(`${API}/${date}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (date === selectedDate) {
      setContent("");
      setMoodTag("neutral");
      setWordCount(0);
    }
    fetchEntries();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short",
    });
  };

  const getMoodEmoji = (tag) =>
    MOOD_TAGS.find((m) => m.value === tag)?.emoji || "📝";

  // Auto-save on Ctrl+S
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveEntry();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [content, moodTag]);

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <h1 className="title">📓 Daily Journal</h1>
          <p className="subtitle">Your private space to reflect and express</p>
        </div>

        <div className="journal-layout">
          {/* ── Left: Editor ── */}
          <div className="journal-editor">
            {/* Date picker */}
            <div className="journal-date-row">
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="journal-date-input"
              />
              <span className="journal-date-label">
                {selectedDate === today ? "Today" : formatDate(selectedDate)}
              </span>
            </div>

            {/* Mood tag selector */}
            <div className="mood-tag-row">
              {MOOD_TAGS.map((m) => (
                <button
                  key={m.value}
                  className={`mood-tag-btn ${moodTag === m.value ? "active" : ""}`}
                  onClick={() => setMoodTag(m.value)}
                  title={m.label}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              className="journal-textarea"
              placeholder={`What's on your mind today?\n\nWrite freely — this is your safe space. No one else can see this. ✨`}
              value={content}
              onChange={handleContentChange}
              rows={14}
            />

            {/* Footer bar */}
            <div className="journal-footer">
              <span className="word-count">{wordCount} words</span>
              <span className="autosave-hint">Ctrl+S to save</span>
              <button
                className="save-journal-btn"
                onClick={saveEntry}
                disabled={saving || !content.trim()}
              >
                {saving ? "Saving..." : saved ? "✓ Saved" : "Save Entry"}
              </button>
            </div>
          </div>

          {/* ── Right: Past entries ── */}
          <div className="journal-history">
            <h3 className="history-title">Past Entries</h3>
            {entries.length === 0 ? (
              <p className="no-entries">No entries yet. Start writing! ✍️</p>
            ) : (
              entries.map((e) => (
                <div
                  key={e.date}
                  className={`journal-entry-card ${selectedDate === e.date ? "active" : ""}`}
                  onClick={() => setSelectedDate(e.date)}
                >
                  <div className="entry-card-top">
                    <span className="entry-emoji">{getMoodEmoji(e.mood_tag)}</span>
                    <span className="entry-date">{formatDate(e.date)}</span>
                    <button
                      className="entry-delete-btn"
                      onClick={(ev) => { ev.stopPropagation(); deleteEntry(e.date); }}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="entry-preview">
                    {e.content.slice(0, 80)}{e.content.length > 80 ? "..." : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}