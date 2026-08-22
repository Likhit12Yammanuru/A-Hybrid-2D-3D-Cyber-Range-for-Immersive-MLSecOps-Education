import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PoisonDetection({ next = "/patch" }) {
  const [samples, setSamples] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/generate_samples")
      .then((res) => res.json())
      .then((data) => setSamples(data))
      .catch(() => alert("Failed to load samples from backend"));
  }, []);

  const handleDecision = (accept) => {
    const sample = samples[currentIndex];
    let newScore = score;
    let newAccuracy = accuracy;

    if (accept && sample.poisoned) {
      newAccuracy -= 5;
    } else if (!accept && sample.poisoned) {
      newScore += 10;
    } else if (accept && !sample.poisoned) {
      newScore += 5;
    } else if (!accept && !sample.poisoned) {
      newAccuracy -= 2;
    }

    setScore(newScore);
    setAccuracy(newAccuracy);

    const next = currentIndex + 1;
    if (next < samples.length) {
      setCurrentIndex(next);
    } else {
      setGameOver(true);
      fetch("http://127.0.0.1:5000/validate_decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore, accuracy: newAccuracy }),
      });
    }
  };

  const restartGame = () => window.location.reload();
  const nextGame = () => navigate(next);

  // 🧭 Start Screen
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-[480px] text-center border border-gray-200">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">🧠 Poison Detection Challenge</h1>
          <p className="text-sm text-gray-700 mb-5">
            You are an <b>ML Security Analyst</b> reviewing incoming training samples.  
            Some are <b>clean</b>, others are <b>poisoned</b> to degrade your model.  
            <br /><br />
            <b>Goal:</b> Keep your model’s accuracy <b>≥ 80%</b> by correctly accepting or rejecting samples.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-5 text-left">
            <h2 className="text-md font-semibold text-blue-800 mb-1">💡 Tip for Analysts:</h2>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>Poisoned samples often have inconsistent labels or low confidence.</li>
              <li>Reject suspicious inputs — but don’t discard too many clean ones.</li>
              <li>Speed and accuracy both affect your final score!</li>
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ▶️ Begin Review
          </button>
        </div>
      </div>
    );
  }

  if (samples.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Loading samples...</p>
      </div>
    );
  }

  const sample = samples[currentIndex];
  const featureHint =
    sample.feature > 2
      ? "⚠️ Feature unusually high for this label."
      : sample.feature < -2
      ? "⚠️ Feature unusually low for this label."
      : "✅ Feature values appear normal and consistent.";

  // 🎯 Main Game UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🧠 Poison Detection Challenge</h1>

      {!gameOver ? (
        <>
          <div className="bg-white shadow-xl rounded-2xl p-6 w-[420px] border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-600">
                Sample {currentIndex + 1} / {samples.length}
              </span>
              <span className="font-semibold text-gray-500">🕒 Review Quickly</span>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl shadow-inner text-left space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">🔖 <b>Label:</b></p>
                <p className="font-semibold text-blue-700">{sample.label}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm text-gray-600">📊 <b>Confidence:</b></p>
                <p className="font-semibold text-purple-600">{(sample.confidence * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md text-sm">
                {featureHint}
              </div>
            </div>

            <div className="flex justify-around mt-6">
              <button
                onClick={() => handleDecision(true)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                ✅ Accept
              </button>
              <button
                onClick={() => handleDecision(false)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                ❌ Reject
              </button>
            </div>
          </div>

          <div className="mt-6 w-[420px] text-center">
            <p className="text-lg font-semibold">
              Score: <span className="text-blue-600">{score}</span>
            </p>
            <div className="mt-2">
              <p className="text-sm mb-1 font-medium">Model Accuracy:</p>
              <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full ${
                    accuracy >= 80 ? "bg-green-500" : "bg-red-500"
                  } transition-all duration-300`}
                  style={{ width: `${Math.max(accuracy, 0)}%` }}
                ></div>
              </div>
              <p className="text-center text-sm mt-1 font-semibold">{accuracy.toFixed(1)}%</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-[420px] text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-3 text-blue-700">🏁 Review Complete</h2>
          <p className="mb-2"><b>Final Score:</b> {score}</p>
          <p className="mb-4"><b>Final Accuracy:</b> {accuracy.toFixed(1)}%</p>

          {accuracy >= 80 ? (
            <p className="text-green-600 font-semibold mb-3">
              ✅ Excellent! Your model was successfully defended!
            </p>
          ) : (
            <p className="text-red-600 font-semibold mb-3">
              ❌ Model compromised! Accuracy dropped below 80%.
            </p>
          )}

          <div className="flex justify-around mt-6">
            <button
              onClick={restartGame}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Replay
            </button>
            <button
              onClick={nextGame}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              🚀 Next → Patch Pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
