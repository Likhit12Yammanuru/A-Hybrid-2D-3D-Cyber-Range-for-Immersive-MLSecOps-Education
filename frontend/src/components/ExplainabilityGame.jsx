import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ExplainabilityGame({ next }) {
  const [started, setStarted] = useState(false);
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [modelResult, setModelResult] = useState(null);
  const [judgment, setJudgment] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const startGame = () => {
    setStarted(true);
    setRound(1);
    setScore(0);
    setModelResult(null);
    setFeedback(null);
  };

  // Step 1: Analyze Model
  const handleAnalyze = async () => {
    if (!feature1 || !feature2) {
      alert("Enter both feature values before analyzing!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/explain_model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature1: parseFloat(feature1), feature2: parseFloat(feature2), round }),
      });
      const data = await res.json();
      setModelResult(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    }
  };

  // Step 2: Submit Judgment
  const handleSubmitJudgment = () => {
    if (!judgment) {
      alert("Select Normal or Suspicious before submitting!");
      return;
    }
    if (!reason.trim()) {
      alert("Provide a short reasoning for your choice!");
      return;
    }

    const correct = judgment === modelResult.bias_label;

    if (correct) setScore(prev => prev + 1);

    setFeedback({
      correct,
      message: correct
        ? `✅ Correct! The model was ${modelResult.bias_label.toUpperCase()}.`
        : `❌ Incorrect! The model behavior was actually ${modelResult.bias_label.toUpperCase()}.`,
      explanation: `Model reasoning: Feature 1 contributed ${modelResult.feature1_contribution}% and Feature 2 contributed ${modelResult.feature2_contribution}%. ${modelResult.feature1_contribution > 80 ? "Feature 1 is heavily dominating, so the model may be biased." : "The model's feature contributions are balanced, behaving normally."}`
    });
  };

  const handleNextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      setFeature1("");
      setFeature2("");
      setModelResult(null);
      setJudgment("");
      setReason("");
      setFeedback(null);
    } else {
      navigate(next);
    
    }
  };

  const handleExit = () => navigate(next);

  // --- START SCREEN ---
  if (!started) {
    if (round > 3) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-3">🧾 Audit Report Summary</h2>
          <h3 className="text-xl font-semibold mb-2">Final Score: {score}/3</h3>
          <p>{score >= 2 ? "✅ Excellent!" : "⚠️ Partial Success."}</p>
          <button onClick={handleExit} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Return to Main Lab →</button>
        </div>
      );
    }

    // 📜 Expanded Instruction Section
    return (
      <div className="p-6 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">🔍 Explainability Game — Model Audit Mission</h2>
        <p className="mb-4 text-gray-700">
          Welcome to the <strong>AI Model Audit Mission</strong> — You are a cybersecurity auditor assigned to investigate how an artificial intelligence model decides if a file is <strong>safe</strong> or <strong>malicious</strong>.  
          Your task is to test the model’s reasoning, detect possible bias, and ensure it makes fair, explainable decisions.
        </p>

        <h3 className="text-lg font-semibold mb-2">🧠 Scenario Background</h3>
        <p className="mb-4 text-gray-700">
          In modern cybersecurity, machine learning models analyze countless files daily to predict potential malware threats.
          However, sometimes these models make unfair or illogical decisions — overemphasizing one feature while ignoring others.
          As an auditor, you will simulate inputs and inspect how the model behaves under different conditions.
        </p>

        <h3 className="text-lg font-semibold mb-2">📝 Feature Context</h3>
        <ul className="text-left list-disc list-inside mb-4 text-gray-700">
          <li>
            <strong>Feature 1: File Size</strong> – The size of a file (in MB or KB).  
            <em>Example:</em> Small file (2 MB), Large file (120 MB)
          </li>
          <li>
            <strong>Feature 2: Access Frequency</strong> – How often a file is accessed or downloaded.  
            <em>Example:</em> Rarely accessed (2 times/day), Frequently accessed (200 times/day)
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">🎯 Your Mission</h3>
        <ul className="text-left list-disc list-inside mb-4 text-gray-700">
          <li>Enter realistic values for both features.</li>
          <li>Click <strong>“Analyze Model”</strong> to view the model’s prediction and feature contributions.</li>
          <li>Read the clues carefully — does the model rely too heavily on one feature?</li>
          <li>Decide if the model’s behavior seems <strong>Normal</strong> or <strong>Suspicious</strong>.</li>
          <li>Type a short reasoning for your choice — even a few words help justify your audit decision.</li>
          <li>Earn points for correct audits. There are 3 cases in total — complete them all to finish your mission.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">💡 Audit Tips</h3>
        <ul className="text-left list-disc list-inside mb-6 text-gray-700">
          <li>If one feature contributes over 80%, the model may be biased.</li>
          <li>Look for patterns — does it always distrust large files, even if rarely accessed?</li>
          <li>Your reasoning is important — it simulates how human oversight complements AI systems.</li>
          <li>Each round brings a new case — learn and adapt your audit approach.</li>
        </ul>

        <button onClick={startGame} className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
          Begin Mission →
        </button>
      </div>
    );
  }

  // --- GAME SCREEN ---
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-1">🧠 AI Model Audit</h2>
      <p className="text-gray-700 mb-3">Case {round} / 3 | Score: {score}</p>

      {!modelResult ? (
        <div className="space-y-3">
          <input type="number" placeholder="Feature 1 (File Size)" className="border p-2 rounded-md w-60" value={feature1} onChange={e => setFeature1(e.target.value)} />
          <input type="number" placeholder="Feature 2 (Access Frequency)" className="border p-2 rounded-md w-60" value={feature2} onChange={e => setFeature2(e.target.value)} />
          <button onClick={handleAnalyze} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2">Analyze Model</button>
        </div>
      ) : !feedback ? (
        <div className="mt-4 max-w-md mx-auto bg-gray-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">🧩 Model Prediction</h4>
          <p><strong>Prediction:</strong> {modelResult.prediction}</p>
          <p><strong>Confidence:</strong> {modelResult.confidence}%</p>
          <p><strong>Explanation Clues:</strong> {modelResult.explanation}</p>

          <h4 className="mt-3 font-semibold">🚦 Your Judgment & Reasoning</h4>
          <div className="flex justify-center gap-3 mt-2">
            <button onClick={() => setJudgment("normal")} className={`px-4 py-2 rounded-md ${judgment==="normal" ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>Normal</button>
            <button onClick={() => setJudgment("suspicious")} className={`px-4 py-2 rounded-md ${judgment==="suspicious" ? "bg-red-700 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}>Suspicious</button>
          </div>

          <textarea placeholder="Reason for your choice..." value={reason} onChange={e => setReason(e.target.value)} className="border p-2 rounded-md w-full mt-2" rows={3} />

          <button onClick={handleSubmitJudgment} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 mt-2">Submit Judgment</button>
        </div>
      ) : (
        <div className="mt-4 max-w-md mx-auto bg-gray-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-bold mb-2">🧩 Feedback</h4>
          <p className={feedback.correct ? "text-green-600" : "text-red-600"}>{feedback.message}</p>
          <p className="mt-2 font-medium text-gray-700">Your reasoning: {reason}</p>
          <p className="mt-2 font-medium text-gray-700">Explanation: {feedback.explanation}</p>

          <button onClick={handleNextRound} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 mt-3">
            {round < 3 ? "Next Case →" : "Finish Mission →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExplainabilityGame;
