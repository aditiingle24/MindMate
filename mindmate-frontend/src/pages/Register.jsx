import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Account created! Please log in.");
      window.location = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">🧠 MindMate</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Start your wellness journey today</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>Full Name</label>
          <input
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-btn" onClick={registerUser} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-link">
          Already have an account? <a href="/">Sign In</a>
        </p>
      </div>
    </div>
  );
}