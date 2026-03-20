import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "😊",
    title: "Mood Tracker",
    desc: "Log how you feel every day with a single tap. Spot patterns and understand your emotional rhythm over time.",
    color: "#e0f2fe",
    accent: "#0ea5e9",
  },
  {
    icon: "📊",
    title: "Stress Assessment",
    desc: "Answer a quick quiz based on the Perceived Stress Scale and get instant feedback on your stress levels.",
    color: "#f0fdf4",
    accent: "#22c55e",
  },
  {
    icon: "🤖",
    title: "AI Companion",
    desc: "Chat with MindMate AI anytime — for interview tips, stress relief, motivation, or just to vent.",
    color: "#fdf4ff",
    accent: "#a855f7",
  },
  {
    icon: "📓",
    title: "Daily Journal",
    desc: "Your private space to reflect, express, and process. Write freely — only you can see this.",
    color: "#fff7ed",
    accent: "#f97316",
  },
  {
    icon: "🧘",
    title: "Guided Relaxation",
    desc: "Box breathing, 4-7-8, and calm breath exercises with a real-time animated timer to reset your mind.",
    color: "#f0fdf4",
    accent: "#10b981",
  },
  {
    icon: "🎙️",
    title: "Voice Affirmations",
    desc: "Record your own calming voice notes and play them back whenever stress hits. Your voice, your calm.",
    color: "#fef3c7",
    accent: "#f59e0b",
  },
  {
    icon: "💡",
    title: "Wellness Tips",
    desc: "Curated mental health tips specifically for placement season — from focus hacks to sleep hygiene.",
    color: "#fef9c3",
    accent: "#eab308",
  },
];

const STATS = [
  { value: "7+", label: "Wellness Features" },
  { value: "24/7", label: "AI Support" },
  { value: "100%", label: "Private & Secure" },
  { value: "Free", label: "Always" },
];

const STEPS = [
  { num: "01", title: "Create your account",    desc: "Sign up in seconds — no credit card, no spam." },
  { num: "02", title: "Track your mood daily",  desc: "One tap to log how you feel. Takes 5 seconds." },
  { num: "03", title: "Talk to your AI companion", desc: "Get support, tips, and motivation anytime." },
  { num: "04", title: "Watch yourself grow",    desc: "See your wellness trends improve over time." },
];

export default function Home() {
  const navigate     = useNavigate();
  const featuresRef  = useRef(null);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">

      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="home-nav-logo">🧠 MindMate</div>
        <div className="home-nav-links">
          <button className="home-nav-link" onClick={scrollToFeatures}>Features</button>
          <button className="home-nav-link" onClick={() => navigate("/register")}>Register</button>
          <button className="home-nav-cta"  onClick={() => navigate("/login")}>Sign In →</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-badge">✦ Built for placement season</div>
        <h1 className="hero-title">
          Your mind deserves<br />
          <span className="hero-title-highlight">care too.</span>
        </h1>
        <p className="hero-subtitle">
          MindMate helps college students manage stress, track emotions,
          journal freely, and get AI-powered support — all in one calm space.
        </p>
        <div className="hero-btns">
          <button className="hero-btn-primary"   onClick={() => navigate("/register")}>
            Get Started Free
          </button>
          <button className="hero-btn-secondary" onClick={scrollToFeatures}>
            See Features ↓
          </button>
        </div>

        {/* Floating preview cards */}
        <div className="hero-float-cards">
          <div className="float-card float-card-1">
            <span>😄</span>
            <div>
              <div className="float-card-title">Feeling Happy</div>
              <div className="float-card-sub">Logged just now</div>
            </div>
          </div>
          <div className="float-card float-card-2">
            <span>🤖</span>
            <div>
              <div className="float-card-title">AI says: Take a breath</div>
              <div className="float-card-sub">You've got this 💙</div>
            </div>
          </div>
          <div className="float-card float-card-3">
            <span>🎙️</span>
            <div>
              <div className="float-card-title">Affirmation saved</div>
              <div className="float-card-sub">"You've got this" · 12s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        {STATS.map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="features-section" ref={featuresRef}>
        <div className="section-badge">What we offer</div>
        <h2 className="section-title-home">
          Everything you need to<br />stay mentally strong
        </h2>
        <p className="section-sub">
          Seven powerful tools designed around the unique pressures of college and placement life.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ "--feat-bg": f.color, "--feat-accent": f.accent }}
            >
              <div className="feature-icon-wrap">
                <span className="feature-icon">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="section-badge">How it works</div>
        <h2 className="section-title-home">
          Start feeling better<br />in 4 simple steps
        </h2>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
              {i < STEPS.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="quote-section">
        <div className="quote-card">
          <div className="quote-marks">"</div>
          <p className="quote-text">
            Taking care of your mental health during placement season isn't a luxury —
            it's the competitive advantage nobody talks about.
          </p>
          <div className="quote-author">— MindMate Team</div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-blob" />
        <h2 className="cta-title">
          Ready to take care<br />of your mind?
        </h2>
        <p className="cta-sub">
          Join MindMate today. It's free, private, and always here for you.
        </p>
        <button
          className="hero-btn-primary cta-btn"
          onClick={() => navigate("/register")}
        >
          Create Free Account →
        </button>
        <p className="cta-login">
          Already have an account?{" "}
          <button className="cta-login-link" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-logo">🧠 MindMate</div>
        <p className="footer-tagline">Your mental wellness companion for placement season.</p>
        <p className="footer-copy">© 2025 MindMate. Made with 💙 for students.</p>
      </footer>

    </div>
  );
}