// src/components/PatchPipeline.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PIPELINE_STAGES = ["Collection", "Cleaning", "Training", "Deployment", "Monitoring"];

const VULNERABILITIES = [
  { desc: "Dataset from untrusted sources may contain poisoned samples.", stage: "Collection" },
  { desc: "Missing data validation lets malicious input slip through.", stage: "Cleaning" },
  { desc: "Unpatched ML library vulnerability allows backdoor insertion.", stage: "Training" },
  { desc: "Weak encryption on deployed API leaks sensitive predictions.", stage: "Deployment" },
  { desc: "No anomaly detection causes delayed attack response.", stage: "Monitoring" },
  { desc: "Compromised labeling leads to biased training data.", stage: "Collection" },
  { desc: "Inconsistent feature scaling leads to skewed training results.", stage: "Cleaning" },
  { desc: "Model weights not signed or verified before deployment.", stage: "Deployment" },
  { desc: "Lack of runtime monitoring hides adversarial attacks.", stage: "Monitoring" },
  { desc: "Outdated dependencies during training cause instability.", stage: "Training" },
];

function PatchPipeline({ next }) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [systemHealth, setSystemHealth] = useState(100);
  const [message, setMessage] = useState("🧠 Read the vulnerability and patch wisely.");
  const [currentVuln, setCurrentVuln] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showInstructions) pickVulnerability();
  }, [round, showInstructions]);

  const pickVulnerability = () => {
    const vuln = VULNERABILITIES[Math.floor(Math.random() * VULNERABILITIES.length)];
    setCurrentVuln(vuln);
  };

  const handlePatch = (stageChosen) => {
    if (gameOver) return;

    if (stageChosen === currentVuln.stage) {
      setMessage(`✅ Correct! ${stageChosen} stage patched successfully.`);
      setScore(score + 1);
    } else {
      setMessage(`❌ Wrong! Vulnerability was in the ${currentVuln.stage} stage.`);
      setSystemHealth((prev) => Math.max(0, prev - 20));
    }

    if (round >= 5 || systemHealth <= 0) {
      setGameOver(true);
    } else {
      setRound(round + 1);
    }
  };

  const restartGame = () => {
    setRound(1);
    setScore(0);
    setSystemHealth(100);
    setMessage("🧠 Read the vulnerability and patch wisely.");
    setGameOver(false);
    setShowInstructions(false);
  };

  const handleNext = () => {
    navigate(next);
  };

  if (showInstructions) {
    return (
      <div style={containerStyle}>
        <h2>🛠️ Patch Pipeline Challenge (Medium Level)</h2>
        <p>Welcome, Engineer! Your ML system is facing critical vulnerabilities.</p>
        <div style={instructionBox}>
          <h4>📘 How to Play</h4>
          <ul style={{ textAlign: "left" }}>
            <li>You'll face 5 vulnerability rounds.</li>
            <li>Each round shows a real ML pipeline issue.</li>
            <li>Choose which pipeline stage it belongs to.</li>
            <li>Correct patch → +1 point. Wrong → system health drops by 20%.</li>
            <li>Score at least 3 to unlock the next game.</li>
          </ul>
        </div>
        <button style={buttonStyle} onClick={() => setShowInstructions(false)}>
          Start Game 🚀
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>🛠️ Patch Pipeline Challenge</h2>
      <p>Round {round} / 5</p>
      <p>System Integrity: {systemHealth}%</p>
      <p>Score: {score}</p>
      <p style={{ fontStyle: "italic", margin: "10px 0" }}>⚠️ {currentVuln.desc}</p>
      <p>{message}</p>

      {!gameOver && (
        <div style={buttonsContainer}>
          {PIPELINE_STAGES.map((stage) => (
            <button key={stage} onClick={() => handlePatch(stage)} style={buttonStyle}>
              Patch {stage}
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <div style={{ marginTop: "20px" }}>
          <p>🎯 Game Over! Final Score: {score} / 5</p>
          <p>System Integrity: {systemHealth}%</p>
          {score >= 3 ? (
            <button onClick={handleNext} style={buttonStyle}>Next → Explainability Game</button>
          ) : (
            <>
              <p>⚠️ You need at least 3/5 to proceed. Try again!</p>
              <button onClick={restartGame} style={buttonStyle}>Retry</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const containerStyle = { textAlign: "center", marginTop: "20px", padding: "20px" };
const buttonsContainer = { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px", marginTop: "15px" };
const buttonStyle = { padding: "10px 15px", cursor: "pointer", fontSize: "16px", borderRadius: "8px" };
const instructionBox = { border: "1px solid gray", borderRadius: "10px", padding: "10px", width: "70%", margin: "0 auto", backgroundColor: "#f9f9f9" };

export default PatchPipeline;
