import React from "react";
import { useNavigate } from "react-router-dom";

export default function GamesMenu() {
  const navigate = useNavigate();

  const games = [
    { name: "Data Cleaner", path: "/data-cleaner", difficulty: "Basic" },
    { name: "Phishing Detector", path: "/phishing", difficulty: "Basic" },
    { name: "Cloud Castle Defense", path: "/cloud", difficulty: "Basic" },
    { name: "Poison Detection", path: "/poison", difficulty: "Medium" },
    { name: "Patch Pipeline", path: "/patch", difficulty: "Medium" },
    { name: "Explainability Challenge", path: "/explain", difficulty: "Medium" },
    { name: "🔥 Final Boss: ML Attack Simulator", path: "/final", difficulty: "Hard" },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎮 2D ML Security Game Hub</h2>
      <p>Select a 2D ML-Security mission to begin.</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {games.map((g) => (
          <li key={g.name} style={{ margin: "15px" }}>
            <button
              onClick={() => navigate(g.path)}
              style={{
                padding: "15px 25px",
                fontSize: "18px",
                cursor: "pointer",
                width: "60%",
              }}
            >
              {g.name} — ({g.difficulty})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
