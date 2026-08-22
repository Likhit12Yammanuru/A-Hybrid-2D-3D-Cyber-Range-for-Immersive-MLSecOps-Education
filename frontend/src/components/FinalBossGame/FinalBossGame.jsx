// frontend/src/components/FinalBossGame/FinalBossGame.jsx
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function FinalBossGame() {
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [round, setRound] = useState(1);
  const [accuracy, setAccuracy] = useState(100.0);
  const [resources, setResources] = useState(5);
  const [log, setLog] = useState([]);
  const [defenses, setDefenses] = useState({
    collection: false,
    cleaning: false,
    training: false,
    deployment: false,
    monitoring: false
  });
  const [clue, setClue] = useState(null);
  const [attacksCount, setAttacksCount] = useState(0);
  const [loadingClue, setLoadingClue] = useState(false);
  const [useBoost, setUseBoost] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const appendLog = (text) => setLog((l) => [text, ...l].slice(0, 50));

  useEffect(() => {
    fetchRoundInfo(round, sessionId);
    // eslint-disable-next-line
  }, []);

  const resetGame = () => {
    const newSession = uuidv4();
    setSessionId(newSession);
    setRound(1);
    setAccuracy(100.0);
    setResources(5);
    setLog([]);
    setDefenses({
      collection: false,
      cleaning: false,
      training: false,
      deployment: false,
      monitoring: false
    });
    setClue(null);
    setAttacksCount(0);
    setUseBoost(false);
    setGameOver(false);
    setVictory(false);
    fetchRoundInfo(1, newSession);
  };

  const fetchRoundInfo = async (r, sid) => {
    setLoadingClue(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/get_round_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid, round: r })
      });
      const data = await res.json();
      if (data && data.clue) {
        setClue(data.clue);
        setAttacksCount(data.attacks_count || 1);
        appendLog(`🔔 Round ${r} alert: ${data.clue}`);
      } else {
        setClue("No clue received.");
      }
    } catch (err) {
      appendLog("❌ Error getting round info: " + err.toString());
      setClue("Error fetching clue. Is backend running?");
    } finally {
      setLoadingClue(false);
    }
  };

  const toggleDefense = (k) => {
    setDefenses((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const startRound = async () => {
    if (gameOver || victory) return;

    const activeDefenses = Object.values(defenses).filter(Boolean).length;
    const neededResources = activeDefenses + (useBoost ? 1 : 0);

    if (neededResources > resources) {
      appendLog(`⚠️ Not enough resources. You need ${neededResources}, have ${resources}.`);
      return;
    }

    appendLog(`▶️ Launching Round ${round}: Defenses: ${Object.keys(defenses).filter(k=>defenses[k]).join(", ") || "none"}${useBoost ? " + Emergency Boost" : ""}`);

    const payload = {
      session_id: sessionId,
      round,
      accuracy,
      defenses,
      use_resource: useBoost
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/simulate_round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.error) {
        appendLog("❌ Round failed: " + data.error);
        return;
      }

      setAccuracy(data.accuracy_after);
      setResources((r) => Math.max(0, r - (data.resources_used || 0)));

      if (Array.isArray(data.round_messages)) {
        data.round_messages.forEach((m) => appendLog(m.message));
      }

      appendLog(`📈 Round summary: Accuracy ${data.accuracy_before}% → ${data.accuracy_after}%`);

      if (data.game_over) {
        setGameOver(true);
        appendLog("💀 Model accuracy dropped below threshold. Game Over.");
      } else if (data.victory) {
        setVictory(true);
        appendLog("🏆 Victory! You survived all attack waves and protected the pipeline.");
      } else {
        const next = round + 1;
        setRound(next);
        fetchRoundInfo(next, sessionId);
      }

    } catch (err) {
      appendLog("❌ Error simulating round: " + err.toString());
    } finally {
      setUseBoost(false);
    }
  };

  const accuracyColor = accuracy > 85 ? "#2ecc71" : accuracy > 70 ? "#f1c40f" : "#e74c3c";

  const stageBox = (k) => (
    <div
      key={k}
      onClick={() => toggleDefense(k)}
      style={{
        flex: 1,
        margin: "6px",
        padding: "12px",
        borderRadius: 8,
        cursor: "pointer",
        userSelect: "none",
        textAlign: "center",
        background: defenses[k] ? "#28a745" : "#f0f2f5",
        color: defenses[k] ? "white" : "#333",
        border: defenses[k] ? "2px solid #1e7e34" : "1px dashed #cfd8dc"
      }}
    >
      <div style={{ fontWeight: "700", textTransform: "capitalize" }}>{k}</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        {defenses[k] ? "Defending" : "Tap to defend (cost 1)"}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 18, fontFamily: "Segoe UI, Roboto, sans-serif", minHeight: "100vh", background: "#f6f8fa" }}>
      <h1 style={{ textAlign: "center" }}>🎯 Final Boss — ML Defense Protocol (Hard)</h1>

      <div style={{ maxWidth: 900, margin: "12px auto", textAlign: "center" }}>
        <button onClick={() => setShowInstructions(s => !s)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>
      </div>

      {showInstructions && (
        <div style={{ maxWidth: 900, margin: "10px auto", background: "#ffffff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3>How to Play (Hard Mode)</h3>
          <ol style={{ textAlign: "left" }}>
            <li>Each round you receive a <b>clue</b> about suspicious activity. Use it to guess which pipeline stages will be attacked.</li>
            <li>Activate defenses by tapping the stage tiles. Each activated defense costs <b>1 resource</b> that round.</li>
            <li>Optionally use <b>Emergency Boost</b> (costs 1 resource) to temporarily increase mitigation for the round.</li>
            <li>Click <b>Launch Round</b> to resolve attacks. The backend returns detailed explanations and accuracy changes.</li>
            <li>Survive <b>5 rounds</b> while keeping accuracy ≥ <b>70%</b> to win.</li>
          </ol>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "18px auto", display: "flex", gap: 12 }}>
        <div style={{ flex: 1, background: "#fff", padding: 14, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
          <h3>Round {round} / 5</h3>
          <p style={{ marginTop: 6 }}><strong>Clue:</strong> {loadingClue ? "Loading clue..." : clue}</p>
          <p><strong>Predicted attacks this round:</strong> {attacksCount}</p>

          <div style={{ marginTop: 10 }}>
            <h4>Pipeline Stages (toggle defenses)</h4>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["collection", "cleaning", "training", "deployment", "monitoring"].map(stageBox)}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={useBoost} onChange={() => setUseBoost(u=>!u)} disabled={resources <= 0} />
              <span>Emergency Boost (cost 1) — small extra mitigation for this round</span>
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={startRound} disabled={gameOver || victory} style={{ padding: "10px 16px", cursor: "pointer" }}>
              🚀 Launch Round
            </button>
            <button onClick={resetGame} style={{ padding: "8px 12px", marginLeft: 8 }}>🔄 Reset Game</button>
          </div>

          <div style={{ marginTop: 14 }}>
            <p><strong>Resources:</strong> {resources}</p>
            <div style={{ marginTop: 8 }}>
              <div style={{ background: "#eee", height: 12, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ width: `${accuracy}%`, height: "100%", background: accuracyColor, transition: "width 450ms" }}></div>
              </div>
              <p style={{ marginTop: 6 }}><strong>Accuracy:</strong> {accuracy.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div style={{ width: 540, background: "#fff", padding: 14, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
          <h4>Event Log</h4>
          <div style={{ maxHeight: 420, overflowY: "auto", padding: 8, background: "#fafafa", borderRadius: 6 }}>
            {log.length === 0 ? <p style={{ color: "#666" }}>No events yet. Read the clue and launch first round.</p> :
              <ul style={{ paddingLeft: 18 }}>
                {log.map((l, i) => <li key={i} style={{ marginBottom: 8 }}>{l}</li>)}
              </ul>}
          </div>

          {gameOver && (
            <div style={{ marginTop: 12, color: "#b71c1c" }}>
              <h3>Game Over</h3>
              <p>Model accuracy fell below 70%. Reset to try again.</p>
            </div>
          )}

          {victory && (
            <div style={{ marginTop: 12, color: "#1b5e20" }}>
              <h3>Victory!</h3>
              <p>You survived all attack waves.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
