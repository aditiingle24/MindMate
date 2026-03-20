import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../services/api";

const NAV_LINKS = [
  { to: "/dashboard",    label: "Home",         icon: "🏠" },
  { to: "/mood",         label: "Mood",         icon: "😊" },
  { to: "/stress",       label: "Stress",       icon: "📊" },
  { to: "/chat",         label: "AI Chat",      icon: "🤖" },
  { to: "/relax",        label: "Relax",        icon: "🧘" },
  { to: "/journal",      label: "Journal",      icon: "📓" },
  { to: "/affirmations", label: "Affirmations", icon: "🎙️" },
];

const MOOD_EMOJI = {
  Happy: "😄", Calm: "😌", Anxious: "😰",
  Stressed: "😤", Sad: "😔", Excited: "🤩", Tired: "😴",
};

export default function Profile() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats]       = useState(null);
  const [moods, setMoods]       = useState([]);
  const [stress, setStress]     = useState([]);
  const [loading, setLoading]   = useState(true);

  // Name edit state
  const [editing, setEditing]   = useState(false);
  const [nameVal, setNameVal]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState("");

  // Password state
  const [pwSection, setPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setNameVal(user.name || "");
    const fetchAll = async () => {
      try {
        const [dashRes, moodRes, stressRes] = await Promise.all([
          API.get("/dashboard"),
          API.get("/mood"),
          API.get("/stress"),
        ]);
        setStats(dashRes.data);
        setMoods(moodRes.data.slice(0, 5));
        setStress(stressRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const topMood = () => {
    if (!moods.length) return "—";
    const freq = {};
    moods.forEach((m) => { freq[m.mood] = (freq[m.mood] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    return `${MOOD_EMOJI[top] || ""} ${top}`;
  };

  const lastStress = () => {
    if (!stress.length) return { level: "—", score: null };
    return stress[0];
  };

  const stressColor = (level) => {
    if (level === "Low")      return "#22c55e";
    if (level === "Moderate") return "#f59e0b";
    if (level === "High")     return "#ef4444";
    return "var(--text-faint)";
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const saveProfile = async () => {
    if (!nameVal.trim()) return;
    setSaving(true);
    const updated = { ...user, name: nameVal.trim() };
    localStorage.setItem("user", JSON.stringify(updated));
    setSaveMsg("Profile updated!");
    setSaving(false);
    setEditing(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const changePassword = async () => {
    setPwError("");
    setPwSuccess("");

    if (!currentPw || !newPw || !confirmPw) {
      setPwError("Please fill in all fields.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: currentPw,
        newPassword:     newPw,
      });
      setPwSuccess("Password updated successfully! 🎉");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwSection(false);
      setTimeout(() => setPwSuccess(""), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const ls = lastStress();

  return (
    <div className="db-page">

      {/* ── Navbar ── */}
      <nav className="db-nav">
        <div className="db-nav-logo">🧠 MindMate</div>
        <div className="db-nav-links">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "db-nav-link db-nav-link-active" : "db-nav-link"
              }
            >
              <span className="db-nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="db-nav-right">
          <div
            className="db-nav-user"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            <div className="db-nav-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="db-nav-name">{user.name?.split(" ")[0]}</span>
          </div>
          <button className="db-nav-logout" onClick={logout}>🚪 Logout</button>
          <button className="db-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="db-mobile-menu">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="db-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
          <button className="db-mobile-logout" onClick={logout}>🚪 Logout</button>
        </div>
      )}

      {/* ── Profile Hero ── */}
      <section className="prof-hero">
        <div className="prof-hero-bg" />
        <div className="prof-hero-content">
          <div className="prof-avatar-ring">
            <div className="prof-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          <div className="prof-hero-info">
            {editing ? (
              <div className="prof-edit-row">
                <input
                  className="prof-name-input"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                  autoFocus
                />
                <button className="prof-save-btn" onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button className="prof-cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="prof-name-row">
                <h1 className="prof-name">{user.name || "User"}</h1>
                <button className="prof-edit-btn" onClick={() => setEditing(true)}>
                  ✏️ Edit
                </button>
              </div>
            )}
            {saveMsg && <div className="prof-save-msg">✅ {saveMsg}</div>}
            <p className="prof-email">📧 {user.email || "—"}</p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="prof-body">

        {/* ── Wellness Summary Cards ── */}
        <div className="prof-summary-grid">
          <div className="prof-summary-card">
            <div className="prof-summary-icon">😊</div>
            <div className="prof-summary-val">
              {loading ? "…" : stats?.moodCount ?? 0}
            </div>
            <div className="prof-summary-label">Total Mood Logs</div>
          </div>
          <div className="prof-summary-card">
            <div className="prof-summary-icon">📊</div>
            <div className="prof-summary-val">
              {loading ? "…" : stats?.stressCount ?? 0}
            </div>
            <div className="prof-summary-label">Stress Checks Done</div>
          </div>
          <div className="prof-summary-card">
            <div className="prof-summary-icon">🧠</div>
            <div className="prof-summary-val">
              {loading ? "…" : topMood()}
            </div>
            <div className="prof-summary-label">Most Frequent Mood</div>
          </div>
          <div className="prof-summary-card">
            <div className="prof-summary-icon">📈</div>
            <div
              className="prof-summary-val"
              style={{ color: stressColor(ls.level), fontSize: "22px" }}
            >
              {loading ? "…" : ls.level}
            </div>
            <div className="prof-summary-label">Last Stress Level</div>
          </div>
        </div>

        <div className="prof-grid">

          {/* ── Account Info ── */}
          <div className="prof-card">
            <h2 className="prof-card-title">👤 Account Info</h2>
            <div className="prof-info-list">
              <div className="prof-info-row">
                <span className="prof-info-label">Full Name</span>
                <span className="prof-info-val">{user.name || "—"}</span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Email</span>
                <span className="prof-info-val">{user.email || "—"}</span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Account Status</span>
                <span className="prof-info-val">
                  <span className="prof-badge prof-badge-green">✅ Active</span>
                </span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Data Privacy</span>
                <span className="prof-info-val">
                  <span className="prof-badge prof-badge-blue">🔒 Private</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Wellness Snapshot ── */}
          <div className="prof-card">
            <h2 className="prof-card-title">💙 Wellness Snapshot</h2>
            <div className="prof-info-list">
              <div className="prof-info-row">
                <span className="prof-info-label">Avg Stress Score</span>
                <span className="prof-info-val">
                  {loading ? "…" : `${stats?.avgStress ?? 0} / 20`}
                </span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Last Stress Level</span>
                <span
                  className="prof-info-val"
                  style={{ color: stressColor(ls.level), fontWeight: 700 }}
                >
                  {loading ? "…" : ls.level}
                  {ls.score !== null && ls.score !== undefined
                    ? ` (${ls.score}/20)` : ""}
                </span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Most Frequent Mood</span>
                <span className="prof-info-val">{loading ? "…" : topMood()}</span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Total Mood Entries</span>
                <span className="prof-info-val">{loading ? "…" : stats?.moodCount ?? 0}</span>
              </div>
              <div className="prof-info-row">
                <span className="prof-info-label">Stress Assessments</span>
                <span className="prof-info-val">{loading ? "…" : stats?.stressCount ?? 0}</span>
              </div>
            </div>
          </div>

          {/* ── Recent Mood History ── */}
          <div className="prof-card">
            <h2 className="prof-card-title">😊 Recent Moods</h2>
            {loading ? (
              <div className="prof-loading">Loading…</div>
            ) : moods.length === 0 ? (
              <div className="prof-empty">
                No mood entries yet. <a href="/mood">Log one →</a>
              </div>
            ) : (
              <div className="prof-mood-list">
                {moods.map((m) => (
                  <div key={m._id} className="prof-mood-row">
                    <span className="prof-mood-emoji">{MOOD_EMOJI[m.mood] || "😶"}</span>
                    <span className="prof-mood-label">{m.mood}</span>
                    <span className="prof-mood-date">{formatDate(m.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
            <a href="/mood" className="prof-view-all">View all moods →</a>
          </div>

          {/* ── Recent Stress History ── */}
          <div className="prof-card">
            <h2 className="prof-card-title">📊 Recent Stress Checks</h2>
            {loading ? (
              <div className="prof-loading">Loading…</div>
            ) : stress.length === 0 ? (
              <div className="prof-empty">
                No checks yet. <a href="/stress">Take one →</a>
              </div>
            ) : (
              <div className="prof-stress-list">
                {stress.map((s) => (
                  <div key={s._id} className="prof-stress-row">
                    <div
                      className="prof-stress-badge"
                      style={{ background: stressColor(s.level) }}
                    >
                      {s.level}
                    </div>
                    <span className="prof-stress-score">{s.score}/20</span>
                    <span className="prof-stress-date">{formatDate(s.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
            <a href="/stress" className="prof-view-all">Take a new check →</a>
          </div>

          {/* ── Change Password ── */}
          <div className="prof-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 className="prof-card-title">🔒 Change Password</h2>
              <button
                onClick={() => {
                  setPwSection(!pwSection);
                  setPwError("");
                  setPwSuccess("");
                  setCurrentPw("");
                  setNewPw("");
                  setConfirmPw("");
                }}
                style={{
                  background: "var(--sky-50)", color: "var(--sky-600)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                  padding: "6px 14px", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-body)",
                }}
              >
                {pwSection ? "Cancel" : "✏️ Change"}
              </button>
            </div>

            {pwSuccess && <div className="success-msg">{pwSuccess}</div>}

            {!pwSection ? (
              <div className="prof-info-row" style={{ border: "none", paddingTop: 8 }}>
                <span className="prof-info-label">Password</span>
                <span className="prof-info-val">••••••••</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: 4 }}>
                {pwError && <div className="auth-error">{pwError}</div>}

                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                  />
                </div>

                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                </div>

                <div className="auth-field" style={{ marginBottom: 0 }}>
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && changePassword()}
                  />
                </div>

                <button
                  className="primary-btn"
                  onClick={changePassword}
                  disabled={pwSaving}
                  style={{ alignSelf: "flex-start", marginTop: 4 }}
                >
                  {pwSaving ? "Updating…" : "🔒 Update Password"}
                </button>
              </div>
            )}
          </div>

          {/* ── Jump To ── */}
          <div className="prof-card prof-card-full">
            <h2 className="prof-card-title">⚡ Jump To</h2>
            <div className="prof-jump-grid">
              {[
                { icon: "😊", label: "Mood Tracker",  sub: "Log how you feel",          link: "/mood"          },
                { icon: "📊", label: "Stress Check",  sub: "Take an assessment",        link: "/stress"        },
                { icon: "🤖", label: "AI Companion",  sub: "Chat anytime",              link: "/chat"          },
                { icon: "📓", label: "Journal",       sub: "Write your thoughts",       link: "/journal"       },
                { icon: "🧘", label: "Relaxation",    sub: "Breathing exercises",       link: "/relax"         },
                { icon: "🎙️", label: "Affirmations", sub: "Your calming voice notes",  link: "/affirmations"  },
                { icon: "🏠", label: "Dashboard",     sub: "Back to overview",          link: "/dashboard"     },
              ].map((j) => (
                <a key={j.label} href={j.link} className="prof-jump-card">
                  <span className="prof-jump-icon">{j.icon}</span>
                  <span className="prof-jump-label">{j.label}</span>
                  <span className="prof-jump-sub">{j.sub}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="db-footer">
        <span className="db-footer-logo">🧠 MindMate</span>
        <span className="db-footer-text">Your mental wellness companion · Made with 💙</span>
      </footer>

    </div>
  );
}