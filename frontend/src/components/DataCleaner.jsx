import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DataCleaner() {
  const [messyText, setMessyText] = useState("");
  const [userText, setUserText] = useState("");
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");
  const [datasetIndex, setDatasetIndex] = useState(null);

  const TOTAL_ROUNDS = 3;
  const [round, setRound] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNewDataset();
  }, []);

  const fetchNewDataset = async () => {
    const res = await fetch("http://localhost:5000/clean_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const data = await res.json();
    setMessyText(data.messy_text);
    setDatasetIndex(data.index);
    setUserText("");
    setScore(null);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!userText.trim()) {
      setMessage("⚠ Please clean the dataset before submitting.");
      return;
    }

    const res = await fetch("http://localhost:5000/clean_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText, index: datasetIndex })
    });

    const data = await res.json();

    setScore(data.score);

    if (data.success) {
      // If not finished all rounds → load next
      if (round < TOTAL_ROUNDS) {
        setMessage(`🔥 Cleaned! Score: ${data.score}%. Moving to dataset ${round + 1}/${TOTAL_ROUNDS}...`);
        setTimeout(() => {
          setRound(prev => prev + 1);
          fetchNewDataset();
        }, 25000);
      } else {
        // Finished all rounds
        setMessage(`🏆 All ${TOTAL_ROUNDS} datasets cleaned! Advancing to next mission...`);
        setTimeout(() => navigate("/phishing"), 15000);
      }
    } else {
      setMessage(`⚡ Score: ${data.score}% — Try again and reach 80%+!`);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>🧹 Data Cleaning Challenge </h2>

      {/* 🔹 Hint / Example Section */}
      <div style={{ ...datasetBox, backgroundColor: "#e6f7ff", border: "1px solid #91d5ff", marginBottom: "15px" }}>
        <h4>Hint / Example:</h4>
        <p><strong>Messy Dataset:</strong> @@Video!! Gaming  %% is awesome **</p>
        <p><strong>Cleaned Version:</strong> Video Gaming is awesome</p>
      </div>

      <p>[Round {round}/{TOTAL_ROUNDS}] — Clean the raw dataset to secure the pipeline.</p>

      <div style={datasetBox}>
        <h4>Messy Dataset:</h4>
        <pre>{messyText}</pre>
      </div>

      <textarea
        rows={6}
        cols={60}
        placeholder="Type your cleaned dataset here..."
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <br />

      <button onClick={handleSubmit} style={buttonStyle}>Submit</button>

      {score !== null && (
        <div style={{ marginTop: "15px" }}>
          <p>🧮 Score: {score}%</p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = { textAlign: "center", marginTop: "20px" };
const datasetBox = { marginTop: "15px", padding: "10px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", maxWidth: "80%", margin: "auto" };
const buttonStyle = { padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "10px" };

export default DataCleaner;
