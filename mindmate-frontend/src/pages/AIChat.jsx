import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const buildPrompt = (msgs) => {
  // Send only the last 6 messages to keep context short
  const recent = msgs.slice(-6);
  return recent.map((m) => `${m.role === "user" ? "User" : "MindMate"}: ${m.content}`).join("\n");
};

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi there! I'm MindMate AI 🌤️\n\nI'm here to support you through placement season — stress, interview tips, motivation, or just a chat. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError("");
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages: buildPrompt(newMessages) }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.error) throw new Error(data.error);

      const reply = data.reply || "Sorry, I couldn't respond right now. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Error: " + err.message);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS = [
    "I'm stressed about placements 😰",
    "Help me prep for a technical interview",
    "I can't focus on studying",
    "Give me a quick relaxation tip",
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="main chat-main">
        <div className="page-header">
          <h1 className="title">🤖 AI Chat</h1>
          <p className="subtitle">Your 24/7 placement wellness companion · Powered by MindMate</p>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}
            >
              {msg.role === "assistant" && (
                <span className="bubble-avatar">🌤️</span>
              )}
              <div className="bubble-text">{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble ai-bubble">
              <span className="bubble-avatar">🌤️</span>
              <div className="bubble-text typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-btn"
                onClick={() => setInput(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}