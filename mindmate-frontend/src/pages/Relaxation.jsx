import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";

const EXERCISES = [
  {
    id: "box",
    name: "Box Breathing",
    emoji: "🟦",
    desc: "Used by Navy SEALs to stay calm under pressure",
    phases: [
      { label: "Inhale", duration: 4 },
      { label: "Hold", duration: 4 },
      { label: "Exhale", duration: 4 },
      { label: "Hold", duration: 4 },
    ],
    cycles: 4,
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    emoji: "🌬️",
    desc: "Reduces anxiety and helps you fall asleep",
    phases: [
      { label: "Inhale", duration: 4 },
      { label: "Hold", duration: 7 },
      { label: "Exhale", duration: 8 },
    ],
    cycles: 3,
  },
  {
    id: "calm",
    name: "Calm Breath",
    emoji: "🌊",
    desc: "Simple 5-5 breathing to reset your nervous system",
    phases: [
      { label: "Inhale", duration: 5 },
      { label: "Exhale", duration: 5 },
    ],
    cycles: 5,
  },
];

const TIPS = [
  { icon: "🎧", title: "Listen to lo-fi music", desc: "Low-fi beats improve focus and reduce anxiety during study sessions." },
  { icon: "🚶", title: "Take a 10-min walk", desc: "Physical movement releases endorphins and clears mental fog." },
  { icon: "📓", title: "Journal your thoughts", desc: "Write down 3 things you're grateful for and 1 win from today." },
  { icon: "📵", title: "Phone-free hour", desc: "One hour away from social media reduces comparison stress significantly." },
  { icon: "🧊", title: "Cold water face splash", desc: "Activates the dive reflex — instantly slows your heart rate." },
  { icon: "🌳", title: "5-4-3-2-1 Grounding", desc: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste." },
];

export default function Relaxation() {
  const [active, setActive] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cyclesDone, setCyclesDone] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const startExercise = (ex) => {
    setActive(ex);
    setPhaseIdx(0);
    setTimeLeft(ex.phases[0].duration);
    setCyclesDone(0);
    setRunning(true);
    setDone(false);
  };

  const stopExercise = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setActive(null);
    setDone(false);
  };

  useEffect(() => {
    if (!running || !active) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Move to next phase
        setPhaseIdx((pi) => {
          const nextPi = pi + 1;
          if (nextPi < active.phases.length) {
            setTimeLeft(active.phases[nextPi].duration);
            return nextPi;
          } else {
            // Cycle done
            setCyclesDone((c) => {
              const nextC = c + 1;
              if (nextC >= active.cycles) {
                clearInterval(timerRef.current);
                setRunning(false);
                setDone(true);
                return nextC;
              }
              setTimeLeft(active.phases[0].duration);
              return nextC;
            });
            return 0;
          }
        });
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, active, phaseIdx]);

  const currentPhase = active?.phases[phaseIdx];
  const progress = active
    ? ((currentPhase.duration - timeLeft) / currentPhase.duration) * 100
    : 0;

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <h1 className="title">🧘 Relaxation</h1>
          <p className="subtitle">Take a mindful break — you deserve it</p>
        </div>

        {/* Breathing Exercises */}
        <div className="section-title">🌬️ Breathing Exercises</div>

        {!active ? (
          <div className="relax-grid">
            {EXERCISES.map((ex) => (
              <div key={ex.id} className="relax-card">
                <div className="relax-emoji">{ex.emoji}</div>
                <h3>{ex.name}</h3>
                <p className="relax-desc">{ex.desc}</p>
                <div className="relax-phases">
                  {ex.phases.map((p, i) => (
                    <span key={i} className="phase-pill">
                      {p.label} {p.duration}s
                    </span>
                  ))}
                </div>
                <button
                  className="primary-btn"
                  onClick={() => startExercise(ex)}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="breathing-session">
            <div className="breathing-title">{active.emoji} {active.name}</div>

            {done ? (
              <div className="breathing-done">
                <div className="done-emoji">✅</div>
                <h3>Session Complete!</h3>
                <p>Great job! You completed {active.cycles} cycles of {active.name}.</p>
                <button className="primary-btn" onClick={stopExercise}>
                  Back to Exercises
                </button>
              </div>
            ) : (
              <>
                <div className="breath-circle">
                  <svg viewBox="0 0 120 120" className="breath-svg">
                    <circle cx="60" cy="60" r="54" className="breath-bg-circle" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      className="breath-progress-circle"
                      style={{
                        strokeDashoffset: `${339.3 - (339.3 * progress) / 100}`,
                      }}
                    />
                  </svg>
                  <div className="breath-inner">
                    <div className="breath-phase">{currentPhase?.label}</div>
                    <div className="breath-time">{timeLeft}s</div>
                  </div>
                </div>

                <div className="cycle-info">
                  Cycle {cyclesDone + 1} of {active.cycles}
                </div>

                <button className="stop-btn" onClick={stopExercise}>
                  Stop
                </button>
              </>
            )}
          </div>
        )}

        {/* Wellness Tips */}
        <div className="section-title" style={{ marginTop: "40px" }}>
          💡 Wellness Tips for Placement Season
        </div>
        <div className="tips-grid-relax">
          {TIPS.map((tip) => (
            <div key={tip.title} className="tip-card-relax">
              <div className="tip-icon">{tip.icon}</div>
              <h4>{tip.title}</h4>
              <p>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}