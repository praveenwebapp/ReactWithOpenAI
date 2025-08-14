import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function ask(e) {
    e.preventDefault();
    setLoading(true);
    setReply("");
    setErr("");

    try {
      const r = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Server error");
      setReply(data.reply || "");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>ChatGPT API</h1>
      <form onSubmit={ask}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
        />
        <button disabled={!prompt || loading} style={{ marginTop: 10, padding: "8px 14px" }}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      <pre style={{ background: "#173d2b", color: "white", padding: 12, marginTop: 16, borderRadius: 8, whiteSpace: "pre-wrap" }}>
        {err ? `Error: ${err}` : reply || "Ask me anything..."}
      </pre>
    </div>
  );
}
