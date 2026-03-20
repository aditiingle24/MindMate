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

const TIPS = [
  { icon: "🕐", text: "Take short breaks every 45 mins while studying" },
  { icon: "💧", text: "Stay hydrated — dehydration increases anxiety" },
  { icon: "😴", text: "7–8 hours of sleep improves memory retention" },
  { icon: "🧘", text: "5 minutes of deep breathing reduces cortisol" },
  { icon: "📵", text: "One phone-free hour reduces comparison stress" },
  { icon: "✍️", text: "Journal your thoughts to clear mental fog" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData]         = useState({ moodCount: 0, stressCount: 0, avgStress: 0 });
  const [loading, setLoading]   = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStressLabel = (avg) => {
    if (avg === 0) return "—";
    if (avg <= 4)  return `${avg} 🟢`;
    if (avg <= 8)  return `${avg} 🟡`;
    return `${avg} 🔴`;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    { icon: "😊", label: "Mood Entries",  value: loading ? "…" : data.moodCount,                link: "/mood"   },
    { icon: "📊", label: "Avg Stress",    value: loading ? "…" : getStressLabel(data.avgStress), link: "/stress" },
    { icon: "✅", label: "Stress Checks", value: loading ? "…" : data.stressCount,               link: "/stress" },
    { icon: "🤖", label: "AI Sessions",   value: "∞",                                            link: "/chat"   },
  ];

  return (
    <div className="db-page">

      {/* ── Top Navbar ── */}
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

      {/* Mobile dropdown */}
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

      {/* ── Hero ── */}
      <section className="db-hero db-hero-slim">
        <p className="db-hero-greeting">{getGreeting()} 👋</p>
        <h1 className="db-hero-title">
          Welcome back,{" "}
          <span className="db-hero-name">
            {user.name?.split(" ")[0] || "friend"}
          </span>
        </h1>
        <p className="db-hero-sub">
          Here's your mental wellness overview for today.
          You're doing great — one step at a time. 💙
        </p>
      </section>

      {/* ── Stats Strip ── */}
      <section className="db-stats-strip">
        {stats.map((s) => (
          <a key={s.label} href={s.link} className="db-stat-card">
            <div className="db-stat-icon">{s.icon}</div>
            <div className="db-stat-value">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
          </a>
        ))}
      </section>

      {/* ── Wellness Tips ── */}
      <section className="db-section db-tips-section">
        <div className="db-section-header">
          <h2 className="db-section-title">💡 Placement Season Tips</h2>
          <p className="db-section-sub">Small habits, big difference</p>
        </div>
        <div className="db-tips-grid">
          {TIPS.map((t) => (
            <div key={t.text} className="db-tip-card">
              <span className="db-tip-icon">{t.icon}</span>
              <p className="db-tip-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="db-footer">
        <span className="db-footer-logo">🧠 MindMate</span>
        <span className="db-footer-text">Your mental wellness companion · Made with 💙</span>
      </footer>

    </div>
  );
}