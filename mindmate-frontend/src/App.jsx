import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home        from "./pages/Home";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import Dashboard   from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import StressCheck from "./pages/StressCheck";
import AIChat      from "./pages/AIChat";
import Relaxation  from "./pages/Relaxation";
import Journal     from "./pages/Journal";
import Profile     from "./pages/Profile";
import Affirmations from "./pages/Affirmations";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mood"      element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
        <Route path="/stress"    element={<ProtectedRoute><StressCheck /></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
        <Route path="/relax"     element={<ProtectedRoute><Relaxation /></ProtectedRoute>} />
        <Route path="/journal"   element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/affirmations" element={<ProtectedRoute><Affirmations /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;