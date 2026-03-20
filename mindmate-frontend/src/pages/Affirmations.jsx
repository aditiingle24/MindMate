import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/api/affirmations";
const MAX     = 3;
const token   = () => localStorage.getItem("token");

export default function Affirmations() {
  const [recordings, setRecordings]   = useState([]);
  const [recording, setRecording]     = useState(false);
  const [seconds, setSeconds]         = useState(0);
  const [title, setTitle]             = useState("");
  const [audioBlob, setAudioBlob]     = useState(null);
  const [audioURL, setAudioURL]       = useState(null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [playingId, setPlayingId]     = useState(null);
  const [loadingId, setLoadingId]     = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const audioRef         = useRef(null);

  // Load list on mount
  useEffect(() => {
    fetchList();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const fetchList = async () => {
    try {
      const res  = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      setRecordings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Start recording ──
  const startRecording = async () => {
    setError("");
    setAudioBlob(null);
    setAudioURL(null);

    if (recordings.length >= MAX) {
      setError(`You've reached the limit of ${MAX} affirmations. Delete one to record a new one.`);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current        = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setRecording(true);
      setSeconds(0);

      // Auto stop at 30s
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 29) {
            stopRecording();
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow mic permission in your browser.");
    }
  };

  // ── Stop recording ──
  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  // ── Save recording ──
  const saveRecording = async () => {
    if (!audioBlob) return;
    if (!title.trim()) { setError("Please give your affirmation a name."); return; }

    setSaving(true);
    setError("");

    try {
      // Convert blob to Base64
      const base64 = await blobToBase64(audioBlob);

      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token()}`,
        },
        body: JSON.stringify({
          title:     title.trim(),
          audioData: base64,
          duration:  seconds || 1,
        }),
      });

      const data = await res.json();
console.log("Save response:", res.status, data);

if (!res.ok) {
  setError(data.error || `Failed to save. Status: ${res.status}`);
  return;
}

      setSuccess("Affirmation saved! 🎉");
      setTitle("");
      setAudioBlob(null);
      setAudioURL(null);
      setSeconds(0);
      fetchList();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Play a saved recording ──
  const playRecording = async (id) => {
    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    setLoadingId(id);
    try {
      const res  = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();

      // Convert Base64 back to audio
      const audio = new Audio(data.audioData);
      audioRef.current = audio;
      audio.play();
      setPlayingId(id);

      audio.onended = () => setPlayingId(null);
      audio.onerror = () => { setPlayingId(null); setError("Could not play audio."); };
    } catch (err) {
      setError("Could not load audio.");
    } finally {
      setLoadingId(null);
    }
  };

  // ── Delete a recording ──
  const deleteRecording = async (id) => {
    if (!window.confirm("Delete this affirmation?")) return;
    if (playingId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
    try {
      await fetch(`${API_URL}/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      setRecordings((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Could not delete.");
    }
  };

  // ── Discard preview ──
  const discardRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setTitle("");
    setSeconds(0);
    setError("");
  };

  // ── Helpers ──
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.onload = () => resolve(reader.result); // already "data:audio/webm;base64,..."
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const formatDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const slotsFull = recordings.length >= MAX;

  return (
    <div className="container">
      <Sidebar />
      <div className="main">

        <div className="page-header">
          <h1 className="title">🎙️ My Affirmations</h1>
          <p className="subtitle">
            Record your own calming voice notes — play them when you need comfort most
          </p>
        </div>

        {/* ── Slot indicator ── */}
        <div className="aff-slots">
          {[...Array(MAX)].map((_, i) => (
            <div
              key={i}
              className={`aff-slot ${i < recordings.length ? "aff-slot-used" : "aff-slot-free"}`}
            >
              {i < recordings.length ? "🎙️" : "○"}
            </div>
          ))}
          <span className="aff-slots-label">
            {recordings.length}/{MAX} slots used
          </span>
        </div>

        {/* ── Error / Success ── */}
        {error   && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {/* ── Recorder card ── */}
        {!slotsFull && !audioURL && (
          <div className="aff-recorder-card">
            <div className="aff-recorder-top">
              <div className="aff-mic-icon">{recording ? "🔴" : "🎙️"}</div>
              <div>
                <div className="aff-recorder-title">
                  {recording ? "Recording in progress…" : "Record a new affirmation"}
                </div>
                <div className="aff-recorder-sub">
                  {recording
                    ? `${seconds}s / 30s — speak clearly into your mic`
                    : "Up to 30 seconds · Your voice, your calm"}
                </div>
              </div>
            </div>

            {/* Progress bar while recording */}
            {recording && (
              <div className="aff-progress-bar">
                <div
                  className="aff-progress-fill"
                  style={{ width: `${(seconds / 30) * 100}%` }}
                />
              </div>
            )}

            <div className="aff-recorder-btns">
              {!recording ? (
                <button className="aff-btn-record" onClick={startRecording}>
                  ● Start Recording
                </button>
              ) : (
                <button className="aff-btn-stop" onClick={stopRecording}>
                  ■ Stop Recording
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Preview & save card ── */}
        {audioURL && (
          <div className="aff-preview-card">
            <div className="aff-preview-header">
              <span className="aff-preview-icon">✅</span>
              <div>
                <div className="aff-preview-title">Recording complete!</div>
                <div className="aff-preview-sub">{seconds}s recorded — preview and save below</div>
              </div>
            </div>

            {/* Native audio player for preview */}
            <audio controls src={audioURL} className="aff-audio-player" />

            {/* Title input */}
            <div className="aff-title-row">
              <input
                className="aff-title-input"
                placeholder="Give it a name… e.g. 'You've got this 💙'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveRecording()}
                maxLength={50}
              />
            </div>

            <div className="aff-preview-btns">
              <button
                className="primary-btn"
                onClick={saveRecording}
                disabled={saving || !title.trim()}
              >
                {saving ? "Saving…" : "💾 Save Affirmation"}
              </button>
              <button className="aff-btn-discard" onClick={discardRecording}>
                🗑 Discard
              </button>
            </div>
          </div>
        )}

        {/* ── Saved recordings list ── */}
        <div className="section-title" style={{ marginTop: 36 }}>
          🎧 Your Saved Affirmations
        </div>

        {recordings.length === 0 ? (
          <div className="empty-state">
            No affirmations yet. Record your first one above! 🎙️
          </div>
        ) : (
          <div className="aff-list">
            {recordings.map((r) => (
              <div key={r._id} className="aff-item">
                <div className="aff-item-left">
                  <button
                    className={`aff-play-btn ${playingId === r._id ? "aff-play-btn-active" : ""}`}
                    onClick={() => playRecording(r._id)}
                    disabled={loadingId === r._id}
                    title={playingId === r._id ? "Stop" : "Play"}
                  >
                    {loadingId === r._id ? "⏳" : playingId === r._id ? "⏹" : "▶"}
                  </button>
                  <div className="aff-item-info">
                    <div className="aff-item-title">{r.title}</div>
                    <div className="aff-item-meta">
                      🕐 {formatDuration(r.duration)} &nbsp;·&nbsp; 📅 {formatDate(r.createdAt)}
                    </div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteRecording(r._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tip card */}
        <div className="aff-tip-card">
          <span className="aff-tip-icon">💡</span>
          <div>
            <div className="aff-tip-title">What to record?</div>
            <p className="aff-tip-text">
              Try recording a short message to yourself — <em>"You've got this, take a breath"</em>,
              a favourite quote, or even a loved one's encouraging words.
              Hearing a familiar voice during stress is proven to reduce anxiety. 💙
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}