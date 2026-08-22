import { useEffect, useRef, useState } from 'react';

// ── Shared styles ──────────────────────────────────────────────────────────────
const OVR = { position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:'"Segoe UI",monospace',zIndex:20,backdropFilter:'blur(8px)' };
const BTN = { padding:'13px 40px',fontSize:16,fontWeight:'bold',background:'linear-gradient(135deg,#11998e,#38ef7d)',border:'none',borderRadius:30,color:'white',cursor:'pointer' };

// ── Instruction Screen ─────────────────────────────────────────────────────────
function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'Slow attackers · Defense range: wide · Goal: 150 pts · 2 min timer' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'Normal speed · Standard range · Goal: 250 pts · 2 min timer' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'Fast attackers · Narrow range · Goal: 400 pts · 90s timer' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#010108 0%,#050520 100%)',fontFamily:'"Segoe UI",monospace',color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:640,width:'92%',background:'rgba(0,200,255,0.03)',border:'1px solid rgba(0,200,255,0.18)',borderRadius:18,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:28 }}>
          <div style={{ fontSize:38,marginBottom:8 }}>⚔️</div>
          <h1 style={{ margin:0,fontSize:24,color:'#00ffcc',letterSpacing:1 }}>TUTORIAL: Red vs Blue</h1>
          <p style={{ margin:'8px 0 0',color:'#446655',fontSize:13 }}>AI Security Training — Adversarial Fundamentals</p>
        </div>
        <div style={{ background:'rgba(0,120,255,0.07)',border:'1px solid rgba(0,120,255,0.18)',borderRadius:10,padding:'15px 18px',marginBottom:20 }}>
          <div style={{ color:'#5599ff',fontSize:11,letterSpacing:'1.5px',marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:13,color:'#7799aa',lineHeight:1.75 }}>
            Real AI deployments face constant <strong style={{ color:'#00ffcc' }}>adversarial attacks</strong>. Security teams run <strong style={{ color:'#00ffcc' }}>Red Team vs Blue Team</strong> exercises to stress-test AI systems. Red attackers converge on your AI core — build blue defenses to intercept them.
          </p>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ color:'#556',fontSize:11,letterSpacing:'1.5px',marginBottom:12,fontWeight:'bold' }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:8 }}>
            {[
              { icon:'🔵', title:'Protect the Cyan Core', desc:'The glowing circle at center is your AI model. One hit and it\'s game over.' },
              { icon:'🖱️', title:'Click the arena to place a Defense', desc:'A blue cube appears — it has a detection range that destroys red attackers.' },
              { icon:'🔴', title:'Red attackers spawn continuously', desc:'They appear from the edge and move toward the core. More defenses = better coverage.' },
              { icon:'🏆', title:'Score by intercepting attackers', desc:'Each intercept = +10 pts. Reach the goal before time runs out to win.' },
            ].map(s => (
              <div key={s.title} style={{ display:'flex',gap:14,alignItems:'flex-start',background:'rgba(255,255,255,0.025)',borderRadius:8,padding:'11px 14px' }}>
                <div style={{ fontSize:20,flexShrink:0 }}>{s.icon}</div>
                <div><div style={{ color:'#ccc',fontWeight:'bold',fontSize:13 }}>{s.title}</div><div style={{ color:'#666',fontSize:12,marginTop:3 }}>{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:22 }}>
          <div style={{ flex:1,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:8,padding:12,textAlign:'center' }}>
            <div style={{ color:'#00ff88',fontWeight:'bold',fontSize:13 }}>🏆 WIN</div>
            <div style={{ color:'#556',fontSize:12,marginTop:6 }}>Reach the score goal within time</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:8,padding:12,textAlign:'center' }}>
            <div style={{ color:'#ff4444',fontWeight:'bold',fontSize:13 }}>💀 LOSE</div>
            <div style={{ color:'#556',fontSize:12,marginTop:6 }}>Core breached or timer hits zero</div>
          </div>
        </div>
        <div style={{ background:'rgba(255,200,0,0.05)',border:'1px solid rgba(255,200,0,0.18)',borderRadius:8,padding:'12px 16px',marginBottom:22,fontSize:12,color:'#998844',lineHeight:1.6 }}>
          💡 <strong style={{ color:'#ffcc44' }}>Tip:</strong> Place multiple defense cubes in overlapping arcs around the core — like layers of a firewall.
        </div>
        <div style={{ marginBottom:26 }}>
          <div style={{ color:'#556',fontSize:11,letterSpacing:'1.5px',marginBottom:12,fontWeight:'bold' }}>SELECT DIFFICULTY</div>
          <div style={{ display:'flex',gap:10 }}>
            {Object.entries(diffs).map(([k,d]) => (
              <div key={k} onClick={() => setDifficulty(k)} style={{ flex:1,padding:'12px 8px',borderRadius:8,textAlign:'center',cursor:'pointer',border:`2px solid ${difficulty===k?d.color:'#222'}`,background:difficulty===k?`${d.color}12`:'rgba(255,255,255,0.02)',transition:'all 0.2s' }}>
                <div style={{ fontWeight:'bold',fontSize:13,color:difficulty===k?d.color:'#555' }}>{d.label}</div>
                <div style={{ fontSize:10,color:'#444',marginTop:6,lineHeight:1.5 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:16,fontSize:16,fontWeight:'bold',background:'linear-gradient(135deg,#00b8a9,#0055ff)',border:'none',borderRadius:10,color:'white',cursor:'pointer',letterSpacing:1 }}>
          START TUTORIAL →
        </button>
      </div>
    </div>
  );
}

// ── Game Config ────────────────────────────────────────────────────────────────
const DIFF = {
  easy:   { attackSpeed:1.0, spawnMs:1400, defenseRange:80, scoreGoal:150, timerSec:120 },
  medium: { attackSpeed:1.6, spawnMs:1200, defenseRange:55, scoreGoal:250, timerSec:120 },
  hard:   { attackSpeed:2.6, spawnMs:900,  defenseRange:40, scoreGoal:400, timerSec:90  },
};
const DC = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };

// ── Game Canvas ────────────────────────────────────────────────────────────────
function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const canvasRef = useRef(null);
  const stateRef = useRef({ defenses:[], attacks:[], spawnTimer:0, score:0, timeLeft:D.timerSec, status:'playing', particles:[], ring:0 });
  const [ui, setUi] = useState({ score:0, timeLeft:D.timerSec, status:'playing' });
  const animRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const S = stateRef.current;
    S.score = 0; S.timeLeft = D.timerSec; S.status = 'playing';
    S.defenses = []; S.attacks = []; S.particles = []; S.ring = 0;

    // Timer
    const timer = setInterval(() => {
      if (S.status !== 'playing') return;
      S.timeLeft--;
      if (S.timeLeft <= 0) {
        S.status = S.score >= D.scoreGoal ? 'won' : 'lost';
        setUi(p => ({ ...p, timeLeft:0, status:S.status }));
      } else {
        setUi(p => ({ ...p, timeLeft:S.timeLeft }));
      }
    }, 1000);

    // Click to place defense
    const onClick = (e) => {
      if (S.status !== 'playing') return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = canvas.width/2, cy = canvas.height/2;
      if (Math.hypot(x-cx, y-cy) < 40) return; // don't place on core
      S.defenses.push({ x, y, range: D.defenseRange });
    };
    canvas.addEventListener('click', onClick);

    const loop = (now) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = Math.min(now - lastRef.current, 50);
      lastRef.current = now;

      const W = canvas.width, H = canvas.height;
      const cx = W/2, cy = H/2;

      ctx.clearRect(0,0,W,H);

      // Background
      ctx.fillStyle = '#020210';
      ctx.fillRect(0,0,W,H);

      // Grid
      ctx.strokeStyle = 'rgba(0,80,180,0.15)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let gx=0; gx<W; gx+=step) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
      for (let gy=0; gy<H; gy+=step) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

      if (S.status === 'playing') {
        S.ring += 0.04;
        S.spawnTimer += dt;
        if (S.spawnTimer > D.spawnMs) {
          S.spawnTimer = 0;
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.min(W,H)*0.52;
          S.attacks.push({ x: cx+Math.cos(angle)*dist, y: cy+Math.sin(angle)*dist, speed: D.attackSpeed });
        }

        // Move attackers
        for (let i = S.attacks.length-1; i >= 0; i--) {
          const a = S.attacks[i];
          const dx = cx-a.x, dy = cy-a.y, dist2 = Math.hypot(dx,dy);
          if (dist2 < 1) { a.x+=0.01; continue; }
          a.x += (dx/dist2)*a.speed;
          a.y += (dy/dist2)*a.speed;

          let caught = false;
          for (const d of S.defenses) {
            if (Math.hypot(a.x-d.x, a.y-d.y) < d.range) {
              // burst particles
              for (let p=0; p<12; p++) S.particles.push({ x:a.x, y:a.y, vx:(Math.random()-0.5)*3, vy:(Math.random()-0.5)*3, life:1, maxLife:1, color:'#0088ff' });
              S.attacks.splice(i,1);
              S.score += 10;
              setUi(p => ({ ...p, score: S.score }));
              if (S.score >= D.scoreGoal) { S.status='won'; setUi(p=>({...p,status:'won',score:S.score})); }
              caught=true; break;
            }
          }
          if (!caught && Math.hypot(a.x-cx, a.y-cy) < 32) {
            S.attacks.splice(i,1);
            S.status='lost';
            setUi(p=>({...p,status:'lost'}));
          }
        }

        // Update particles
        for (let i=S.particles.length-1; i>=0; i--) {
          const p=S.particles[i];
          p.x+=p.vx; p.y+=p.vy; p.life-=0.05;
          if (p.life<=0) S.particles.splice(i,1);
        }
      }

      // Draw defenses
      for (const d of S.defenses) {
        // Range ring
        ctx.beginPath(); ctx.arc(d.x,d.y,d.range,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,80,255,0.25)'; ctx.lineWidth=1; ctx.stroke();
        // Cube (square)
        ctx.fillStyle='rgba(0,60,220,0.85)';
        ctx.shadowBlur=12; ctx.shadowColor='#0044ff';
        ctx.fillRect(d.x-9,d.y-9,18,18);
        ctx.strokeStyle='#2266ff'; ctx.lineWidth=1.5; ctx.strokeRect(d.x-9,d.y-9,18,18);
        ctx.shadowBlur=0;
      }

      // Draw particles
      for (const p of S.particles) {
        ctx.beginPath(); ctx.arc(p.x,p.y,4*p.life,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,150,255,${p.life})`; ctx.fill();
      }

      // Draw attackers
      for (const a of S.attacks) {
        ctx.beginPath(); ctx.arc(a.x,a.y,8,0,Math.PI*2);
        ctx.fillStyle='#ff2222';
        ctx.shadowBlur=14; ctx.shadowColor='#ff0000';
        ctx.fill(); ctx.shadowBlur=0;
        ctx.strokeStyle='#ff6666'; ctx.lineWidth=1; ctx.stroke();
      }

      // Core glow
      const gr = ctx.createRadialGradient(cx,cy,8,cx,cy,36);
      gr.addColorStop(0,'rgba(0,255,255,0.9)');
      gr.addColorStop(0.5,'rgba(0,200,220,0.4)');
      gr.addColorStop(1,'rgba(0,100,180,0)');
      ctx.beginPath(); ctx.arc(cx,cy,36,0,Math.PI*2);
      ctx.fillStyle=gr; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2);
      ctx.fillStyle='#00ffff';
      ctx.shadowBlur=28; ctx.shadowColor='#00ffff';
      ctx.fill(); ctx.shadowBlur=0;

      // Rotating ring around core
      ctx.beginPath();
      ctx.arc(cx,cy,30,S.ring,S.ring+Math.PI*1.5);
      ctx.strokeStyle='rgba(0,220,255,0.6)'; ctx.lineWidth=2; ctx.stroke();

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(timer);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, [D]);

  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const dc = DC[difficulty];
  const pct = Math.min(100,(ui.score/D.scoreGoal)*100);

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000 }}>
      <canvas ref={canvasRef} style={{ width:'100%',height:'100%',display:'block',cursor:'crosshair' }} />

      {ui.status === 'playing' && (
        <div style={{ position:'absolute',top:20,left:20,color:'white',fontFamily:'"Segoe UI",monospace',background:'rgba(5,5,18,0.92)',padding:20,borderRadius:12,border:'1px solid rgba(0,200,255,0.22)',backdropFilter:'blur(10px)',width:280,zIndex:10 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(0,200,255,0.15)',paddingBottom:10,marginBottom:14 }}>
            <h3 style={{ margin:0,fontSize:15,color:'#00ffcc' }}>TUTORIAL: Red vs Blue</h3>
            <span style={{ fontSize:11,color:dc,border:`1px solid ${dc}44`,borderRadius:4,padding:'2px 7px',textTransform:'uppercase' }}>{difficulty}</span>
          </div>
          <p style={{ fontSize:12,color:'#88aabb',margin:'0 0 14px' }}>Click the arena to place blue defense cubes.</p>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
            <div><div style={{ fontSize:11,color:'#556',marginBottom:3 }}>TIME</div>
              <div style={{ fontSize:24,fontWeight:'bold',color:ui.timeLeft<20?'#ff4444':'#00ffcc' }}>{fmt(ui.timeLeft)}</div></div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:11,color:'#556',marginBottom:3 }}>SCORE</div>
              <div style={{ fontSize:24,fontWeight:'bold',color:'#ffff00' }}>{ui.score}</div></div>
          </div>
          <div style={{ fontSize:12,color:'#888',marginBottom:5 }}>Progress to goal ({D.scoreGoal} pts)</div>
          <div style={{ background:'#111',height:8,borderRadius:4,overflow:'hidden',marginBottom:14 }}>
            <div style={{ background:'linear-gradient(90deg,#0055ff,#00ccff)',height:'100%',width:`${pct}%`,transition:'width 0.3s' }} />
          </div>
          <button onClick={onExit} style={{ width:'100%',padding:9,background:'#1a1a2e',border:'1px solid #333',borderRadius:6,color:'#888',cursor:'pointer',fontSize:12 }}>Exit</button>
        </div>
      )}

      {ui.status === 'won' && (
        <div style={{ ...OVR,background:'rgba(0,18,10,0.96)' }}>
          <h1 style={{ color:'#00ffcc',fontSize:48,marginBottom:12,textShadow:'0 0 20px #00ffcc66' }}>TUTORIAL COMPLETE!</h1>
          <p style={{ color:'#aaa',fontSize:18 }}>Core successfully defended</p>
          <p style={{ color:'#ffff00',fontSize:24,margin:'14px 0' }}>Final Score: {ui.score}</p>
          <button onClick={onExit} style={BTN}>Continue to Level 1 →</button>
        </div>
      )}
      {ui.status === 'lost' && (
        <div style={{ ...OVR,background:'rgba(18,0,0,0.97)' }}>
          <h1 style={{ color:'#ff3333',fontSize:48,marginBottom:12 }}>SYSTEM FAILURE</h1>
          <p style={{ color:'#aaa',fontSize:18 }}>{ui.timeLeft<=0?"Time's up — score goal not reached.":"Core breached by a red attacker."}</p>
          <p style={{ color:'#ff6666',fontSize:18,margin:'14px 0' }}>Score: {ui.score}</p>
          <div style={{ display:'flex',gap:16,marginTop:10 }}>
            <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry</button>
            <button onClick={onExit} style={{ ...BTN,background:'#333' }}>Exit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Level0RedBlue({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase === 'instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}