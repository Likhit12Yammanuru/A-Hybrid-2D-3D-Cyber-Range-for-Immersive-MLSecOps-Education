import React, { useState } from 'react';
import Level0RedBlue from './threeD/Level0_RedBlue';
import Level1 from './threeD/Level1';
import Level2 from './threeD/Level2';
import Level3 from './threeD/Level3';
import Level4 from './threeD/Level4';
import Level5 from './threeD/Level5';
import Level6 from './threeD/Level6';
import Level7 from './threeD/Level7';
import Level8 from './threeD/Level8';

const Transition2Dto3D = ({ userScore, onSessionEnd }) => {
  const [currentLevel, setCurrentLevel] = useState(null);

  const containerStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: '#0a0a1a', color: '#00ffcc', fontFamily: 'monospace', textAlign: 'center',
  };

  const buttonStyle = {
    padding: '15px 30px', margin: '10px', fontSize: '18px', backgroundColor: '#1a1a3a',
    color: '#00ffcc', border: '2px solid #00ffcc', cursor: 'pointer', borderRadius: '5px',
  };

  // Level Routing
  if (currentLevel === 0) return <Level0RedBlue onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 1) return <Level1 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 2) return <Level2 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 3) return <Level3 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 4) return <Level4 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 5) return <Level5 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 6) return <Level6 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 7) return <Level7 onExit={() => setCurrentLevel(null)} />;
  if (currentLevel === 8) return <Level8 onExit={() => setCurrentLevel(null)} />;


  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>CYBER RANGE INITIALIZATION</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
        2D Training Complete. Entering 3D Immersive Environment.
      </p>
      <p style={{ marginBottom: '40px' }}>Current Security Clearance: {userScore || 0} pts</p>
      
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={buttonStyle} onClick={() => setCurrentLevel(0)}>TUTORIAL: Red vs Blue</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(1)}>START LEVEL 1</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(2)}>START LEVEL 2</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(3)}>START LEVEL 3</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(4)}>START LEVEL 4</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(5)}>START LEVEL 5</button>
        <button style={buttonStyle} onClick={() => setCurrentLevel(6)}>START LEVEL 6</button>
        <button 
          style={{...buttonStyle, borderColor: '#ff0055', color: '#ff0055'}} 
          onClick={() => setCurrentLevel(7)}
        >
          DEV JUMP: Level 7
        </button>
        <button 
          style={{...buttonStyle, borderColor: '#ff0055', color: '#ff0055'}} 
          onClick={() => setCurrentLevel(8)}
        >
          DEV JUMP: Level 8
        </button>
      </div>
    </div>
  );
};

export default Transition2Dto3D;