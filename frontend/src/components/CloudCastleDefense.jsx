import React, { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CloudCastleDefense({ next }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentThreat, setCurrentThreat] = useState(null);
  const [selectedCastle, setSelectedCastle] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25);
  const [battleOutcome, setBattleOutcome] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // -------------------------
  // Global Threat Pool (Option B)
  // -------------------------
  const FULL_THREAT_POOL = [
    { id: 'ddos', name: 'Swarm Dragon', icon: '🐉', description: 'Overwhelms your defenses', bestDefense: 'cloud', weakDefense: 'local' },
    { id: 'insider', name: 'Sneaky Ghost', icon: '👻', description: 'Slips inside unnoticed', bestDefense: 'local', weakDefense: 'cloud' },
    { id: 'ransomware', name: 'Bridge Troll', icon: '🧌', description: 'Locks your systems', bestDefense: 'cloud', weakDefense: 'local' }
  ];

  let threatPool = useRef([...FULL_THREAT_POOL]);

  const getUniqueThreat = () => {
    if (threatPool.current.length === 0) {
      threatPool.current = [...FULL_THREAT_POOL];
    }
    const index = Math.floor(Math.random() * threatPool.current.length);
    const threat = threatPool.current[index];
    threatPool.current.splice(index, 1);
    return threat;
  };

  // --- Castles ---
  const castles = [
    { id: 'cloud', name: 'Cloud Castle', icon: '🏰', description: 'High in the skies — fast scaling, secure backups.' },
    { id: 'local', name: 'Local Fort', icon: '🏠', description: 'Ground fortress with strong internal control.' },
    { id: 'hybrid', name: 'Hybrid Castle', icon: '🔀', description: 'Balanced between agility and control.' }
  ];

  // --- Rotating flavor text ---
  const threatFlavor = {
    ddos: [
      "A furious storm of traffic gathers on the horizon!",
      "Cloud skies darken as a swarm rushes the gates!"
    ],
    insider: [
      "A whisper moves inside the walls... stay alert.",
      "An unseen hand slips past a guard — watch internal paths."
    ],
    ransomware: [
      "A troll clamps the drawbridge shut — forcing lockdown!",
      "Gates clang shut—your vault is at risk of sealing!"
    ]
  };

  // --- Mild difficulty scaling (Option A) ---
  const getDifficulty = (r) => ({
    timer: Math.max(12, 25 - (r - 1) * 3),
    particles: 20 + r * 8,
    enemySpeedMultiplier: 1 + (r - 1) * 0.25,
    ringPulseSpeedDivisor: Math.max(6, 8 - r)
  });

  // --- Timer ---
  useEffect(() => {
    if (gameState === 'choosing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'choosing' && timeLeft === 0) {
      handleTimeOut();
    }
  }, [gameState, timeLeft]);

  // --- Animation ---
  useEffect(() => {
    if (gameState === 'battle') animateBattle();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [gameState, selectedCastle, currentThreat, round]);

  // --- Game State Functions ---
  const startGame = () => {
    setScore(0);
    setRound(1);
    threatPool.current = [...FULL_THREAT_POOL];
    startRound(1);
  };

  const startRound = (r = round) => {
    setCurrentThreat(getUniqueThreat());
    setSelectedCastle(null);
    setTimeLeft(getDifficulty(r).timer);
    setBattleOutcome(null);
    setGameState('choosing');
  };

  const selectCastle = (castleId) => {
    setSelectedCastle(castleId);
    setGameState('battle');
    evaluateBattle(castleId);
  };

  const handleTimeOut = () => {
    setBattleOutcome({ success: false, message: "Time ran out!", points: 0 });
    setGameState('result');
  };

  // --- Battle Evaluation ---
  const evaluateBattle = (castleId) => {
    const threat = currentThreat;
    let success = false;
    let message = '';
    let points = 0;

    if (castleId === threat.bestDefense) {
      success = true;
      points = 100;
      message = `Perfect defense — ${threat.name} repelled!`;
    } else if (castleId === 'hybrid') {
      const hybridBonus = Math.random() < 0.4;
      success = true;
      points = hybridBonus ? 70 : 50;
      message = hybridBonus ? "Hybrid surge — boosted defense!" : "Hybrid Castle held firm.";
    } else if (castleId === threat.weakDefense) {
      success = false;
      points = 0;
      message = `${threat.name} exploited the weak defense!`;
    } else {
      success = true;
      points = 30;
      message = "Barely survived! Could be stronger.";
    }

    setTimeout(() => {
      setBattleOutcome({ success, message, points });
      setScore((s) => s + points);
      setGameState('result');
    }, 3000);
  };

  const nextRound = () => {
    if (round < 3) {
      setRound(r => {
        const nr = r + 1;
        startRound(nr);
        return nr;
      });
    } else {
      if (next) navigate(next);
    }
  };

  // --- Animation System ---
  const animateBattle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentThreat) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let frame = 0;
    const diff = getDifficulty(round);

    const particles = Array.from({ length: diff.particles }).map(() => ({
      x: Math.random() * width,
      y: -20 - Math.random() * 200,
      speed: (2 + Math.random() * 2) * diff.enemySpeedMultiplier,
      size: 10 + Math.random() * 16,
      drift: (Math.random() - 0.5) * 1.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      const castle = castles.find(c => c.id === selectedCastle) || castles[0];
      ctx.font = "60px Arial";
      ctx.textAlign = "center";
      ctx.fillText(castle.icon, width / 2, height - 50);

      ctx.font = "28px Arial";
      particles.forEach(p => {
        ctx.fillText(currentThreat.icon, p.x, p.y);
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > height + 20) {
          p.y = -20 - Math.random() * 200;
          p.x = Math.random() * width;
        }
      });

      ctx.strokeStyle =
        selectedCastle === "cloud" ? "#3b82f6" :
        selectedCastle === "local" ? "#16a34a" :
        "#7c3aed";

      ctx.lineWidth = 3;
      ctx.beginPath();
      const radius = 80 + Math.sin(frame / diff.ringPulseSpeedDivisor) * 10;
      ctx.arc(width / 2, height - 80, radius, 0, Math.PI * 2);
      ctx.stroke();

      frame++;
      if (frame < 180) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="cloud-castle-container">
      <div className="header">
        <h1><Shield size={48} /> Cloud Castle Defense</h1>
        <p>Defend your data treasure using the right castle!</p>
      </div>

      {gameState === 'menu' && (
        <div className="menu">
          <h2>Welcome, Knight!</h2>
          <button onClick={startGame} className="btn-primary">Start Defense</button>
        </div>
      )}

      {gameState === 'choosing' && currentThreat && (
        <div className="choosing">
          <h2>{currentThreat.icon} {currentThreat.name} Approaching!</h2>
          <p>
            {(() => {
              const lines = threatFlavor[currentThreat.id] || [currentThreat.description];
              return lines[Math.floor(Math.random() * lines.length)];
            })()}
          </p>
          <h3>{timeLeft}s remaining</h3>

          <div className="castle-choice">
            {castles.map(c => (
              <button key={c.id} onClick={() => selectCastle(c.id)} className="castle-btn">
                <div className="castle-icon">{c.icon}</div>
                <h4>{c.name}</h4>
                <p>{c.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'battle' && (
        <div className="battle">
          <h2>Battle in Progress!</h2>
          <canvas ref={canvasRef} width={600} height={400} className="battle-canvas" />
          <p>Your defender is holding the line...</p>
        </div>
      )}

      {gameState === 'result' && battleOutcome && (
        <div className="result">
          <h2>{battleOutcome.success ? '🎉 Victory!' : '💥 Defeat!'}</h2>
          <p>{battleOutcome.message}</p>
          <p className="points">+{battleOutcome.points} Points</p>

          <button onClick={nextRound} className="btn-secondary">
            {round < 3 ? "Next Round →" : "Continue to Poison Detection →"}
          </button>
        </div>
      )}
    </div>
  );
}
