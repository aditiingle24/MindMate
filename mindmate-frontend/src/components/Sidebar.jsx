import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/dashboard",    label: "Dashboard",   icon: "🏠" },
  { to: "/mood",         label: "Mood Tracker", icon: "😊" },
  { to: "/stress",       label: "Stress Check", icon: "📊" },
  { to: "/chat",         label: "AI Chat",      icon: "🤖" },
  { to: "/relax",        label: "Relaxation",   icon: "🧘" },
  { to: "/journal",      label: "Journal",      icon: "📓" },
  { to: "/affirmations", label: "Affirmations", icon: "🎙️" },
  { to: "/profile",      label: "Profile",      icon: "👤" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const sidebarRef      = useRef(null);
  const navigate        = useNavigate();
  const location        = useLocation();
  const user            = JSON.parse(localStorage.getItem("user") || "{}");

  // Close sidebar when route changes
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* ── Top bar ── */}
      <div className="topbar">
        <button
          className="topbar-hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>

        <div className="topbar-logo" onClick={() => navigate("/dashboard")}>
          🧠 MindMate
        </div>

        <div className="topbar-right">
          <div
            className="topbar-user"
            onClick={() => navigate("/profile")}
            title="View profile"
          >
            <div className="topbar-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="topbar-name">{user.name?.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`sidebar-backdrop ${open ? "sidebar-backdrop-visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* ── Sliding Drawer ── */}
      <div
        ref={sidebarRef}
        className={`sidebar-drawer ${open ? "sidebar-drawer-open" : ""}`}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-logo">🧠 MindMate</div>
          <button
            className="drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* User info */}
        {user.name && (
          <div
            className="drawer-user"
            onClick={() => navigate("/profile")}
            title="View profile"
          >
            <div className="drawer-avatar">
              {user.name[0].toUpperCase()}
            </div>
            <div className="drawer-user-info">
              <div className="drawer-user-name">{user.name}</div>
              <div className="drawer-user-email">{user.email}</div>
            </div>
            <span className="drawer-user-arrow">›</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="drawer-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "drawer-link drawer-link-active" : "drawer-link"
              }
            >
              <span className="drawer-link-icon">{link.icon}</span>
              <span className="drawer-link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="drawer-footer">
          <button className="drawer-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}