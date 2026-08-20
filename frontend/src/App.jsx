// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Existing 2D Imports
import InstructionPage from "./components/InstructionPage";
import LearningVideo from "./components/LearningVideo";
import Quiz from "./components/Quiz";
import TwoDGamesMenu from "./components/GamesMenu";

import DataCleaner from "./components/DataCleaner";
import PhishingDetector from "./components/PhishingDetector";
import CloudCastleDefense from "./components/CloudCastleDefense";
import PoisonDetection from "./components/PoisonDetection";
import PatchPipeline from "./components/PatchPipeline";
import ExplainabilityGame from "./components/ExplainabilityGame";
import FinalBossGame from "./components/FinalBossGame/FinalBossGame";

// --- NEW 3D IMPORTS ---
import Transition2Dto3D from "./components/Transition2Dto3D";

// Renaming import to PascalCase to satisfy ESLint rules
import Level0RedBlue from "./components/threeD/Level0_RedBlue";
import Level1 from "./components/threeD/Level1";
import Level2 from "./components/threeD/Level2";
import Level3 from "./components/threeD/Level3";
import Level4 from "./components/threeD/Level4";
import Level5 from "./components/threeD/Level5";
import Level6 from "./components/threeD/Level6";
import Level7 from "./components/threeD/Level7";
import Level8 from "./components/threeD/Level8";

import "./index.css";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "30px" }}>

        <h1>🧠 CyberSecML-Lab</h1>
        
        <div style={{ maxWidth: 800, margin: "12px auto", padding: 12, background: "#f0f4f8", borderRadius: 10 }}>
          <h3>Welcome!</h3>
          <p>
            CyberSecML-Lab is an interactive learning platform where you can explore 
            <b> Machine Learning Security </b> concepts through guided videos, quizzes, 
            and hands-on games. Learn how to secure ML pipelines, detect attacks, 
            and understand model vulnerabilities in a fun, gamified way!
          </p>     
          <p>🎮 Start with games, test your skills with quizzes, or watch tutorial videos to learn the theory.</p>
        </div>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={linkStyle}>Home</Link> |{" "}
          <Link to="/instructions" style={linkStyle}>Instructions</Link> |{" "}
          <Link to="/video" style={linkStyle}>Video Module</Link> |{" "}
          <Link to="/quiz" style={linkStyle}>Quiz</Link> |{" "}
          <Link to="/games" style={linkStyle}>2D Game Menu</Link> |{" "}
          <Link to="/cyber-range" style={linkStyle}>3D Cyber Range</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<InstructionPage />} />
          <Route path="/video" element={<LearningVideo />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/games" element={<TwoDGamesMenu />} />

          {/* 2D Games */}
          <Route path="/data-cleaner" element={<DataCleaner next="/phishing" />} />
          <Route path="/phishing" element={<PhishingDetector next="/cloud" />} />
          <Route path="/cloud" element={<CloudCastleDefense next="/poison" />} />
          <Route path="/poison" element={<PoisonDetection next="/patch" />} />
          <Route path="/patch" element={<PatchPipeline next="/explain" />} />
          <Route path="/explain" element={<ExplainabilityGame next="/final" />} />
          <Route path="/final" element={<FinalBossGame />} />

          {/* 3D Cyber Range */}
          <Route path="/cyber-range" element={<Transition2Dto3D />} />
          
          {/* 3D Levels */}
          <Route path="/level-0" element={<Level0RedBlue onExit={() => window.history.back()} />} />
          <Route path="/level-1" element={<Level1 onExit={() => window.history.back()} />} />
          <Route path="/level-2" element={<Level2 onExit={() => window.history.back()} />} />
          <Route path="/level-3" element={<Level3 onExit={() => window.history.back()} />} />
          <Route path="/level-4" element={<Level4 onExit={() => window.history.back()} />} />
          <Route path="/level-5" element={<Level5 onExit={() => window.history.back()} />} />
          <Route path="/level-6" element={<Level6 onExit={() => window.history.back()} />} />
          <Route path="/level-7" element={<Level7 onExit={() => window.history.back()} />} />
          <Route path="/level-8" element={<Level8 onExit={() => window.history.back()} />} />

        </Routes>
      </div>
    </Router>
  );
}

// Separate Home component for cleanliness
const Home = () => (
  <div>
    <h2>Welcome to CyberSecML-Lab</h2>
    <p>🎯 Learn, Test, and Play ML Security!</p>
    <Link to="/instructions">
      <button style={{ padding: "12px 24px", fontSize: 18, cursor: "pointer", border: "none", borderRadius: "8px", background: "#2563eb", color: "white", marginTop: "10px"}}>
        📘 View Platform Instructions
      </button>
    </Link>
  </div>
);

const linkStyle = {
  textDecoration: "none",
  color: "blue",
  fontWeight: "bold",
  margin: "0 10px"
};

export default App;