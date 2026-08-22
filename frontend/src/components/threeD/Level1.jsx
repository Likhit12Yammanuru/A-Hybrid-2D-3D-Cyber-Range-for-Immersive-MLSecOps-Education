import { useEffect, useRef, useState, useCallback } from 'react';

// ── Level 1: Data Poisoning Propagation ───────────────────────────────────────
// FIXES applied:
//  1. Win condition: reach score target OR quarantine all infected (not AND)
//  2. Score math fixed: quarantine gives net +120 pts (not +70), starts at 200
//  3. Firewall hit detection expanded from 20px → 40px radius
//  4. Score ticks up passively every second for healthy nodes alive
//  5. Win progress bar now shows clearly what's needed
//  6. Instruction screen clarifies the real win condition

const FONT = '"Share Tech Mono", monospace';
const OVR = { position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:FONT,zIndex:20,backdropFilter:'blur(8px)' };
const BTN = { marginTop:24,padding:'13px 40px',fontSize:15,fontWeight:'bold',background:'linear-gradient(135deg,#00c878,#00aa55)',border:'none',borderRadius:6,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT };

function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'Slow spread · 8 nodes · +5 pts/sec per healthy node · 4 firewall tokens' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'Normal spread · 12 nodes · +4 pts/sec per healthy node · 3 tokens' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'Fast spread · 14 nodes · +3 pts/sec per healthy node · 2 tokens' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#010c08 0%,#050520 100%)',fontFamily:FONT,color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:660,width:'92%',background:'rgba(0,255,120,0.03)',border:'1px solid rgba(0,255,120,0.2)',borderRadius:6,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:'#00ff88',opacity:0.5,marginBottom:8 }}>ML-SEC TRAINING // LEVEL 1</div>
          <h1 style={{ margin:0,fontSize:26,color:'#00ff88',letterSpacing:3 }}>DATA POISONING PROPAGATION</h1>
          <p style={{ margin:'8px 0 0',color:'#334433',fontSize:12,letterSpacing:2 }}>TRAINING-TIME ATTACK DEFENSE</p>
        </div>
        <div style={{ background:'rgba(0,255,100,0.05)',border:'1px solid rgba(0,255,100,0.18)',borderRadius:4,padding:'14px 18px',marginBottom:18 }}>
          <div style={{ color:'#44ff88',fontSize:10,letterSpacing:3,marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:12,color:'#668877',lineHeight:1.85 }}>
            <strong style={{ color:'#00ff88' }}>Data poisoning</strong> corrupts ML training pipelines by injecting malicious samples that spread to connected components. Security teams must perform <strong style={{ color:'#00ff88' }}>root-cause analysis</strong>, quarantine infected nodes, and cut propagation paths using firewall policies — all before the corruption reaches critical pipeline stages.
          </p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ color:'#445',fontSize:10,letterSpacing:3,marginBottom:12 }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:7 }}>
            {[
              { icon:'☣️', t:'Poison spreads through pipeline edges', d:'Green = healthy · Red pulsing = infected · Dark gray = dead (gone forever).' },
              { icon:'🖱️', t:'Click infected node (red) → QUARANTINE it', d:'Earns +150 pts and stops that node spreading. Act fast — infected nodes die over time!' },
              { icon:'✂️', t:'Switch to FIREWALL mode → click an edge midpoint', d:'Permanently cuts a propagation path. Orange circles show clickable edge midpoints.' },
              { icon:'🔍', t:'Find & quarantine the ROOT SOURCE node first', d:'+200 bonus pts. The origin node has a faint gold ring pulsing around it.' },
              { icon:'⏱️', t:'Healthy nodes earn passive score over time', d:'Keep nodes alive — each healthy node ticks up your score every second.' },
              { icon:'🏆', t:'Win: reach the score target before too many nodes die', d:'Dead nodes = permanent failure. Lose if dead count hits the max.' },
            ].map(s => (
              <div key={s.t} style={{ display:'flex',gap:12,alignItems:'flex-start',background:'rgba(255,255,255,0.02)',borderRadius:3,padding:'10px 13px' }}>
                <div style={{ fontSize:18,flexShrink:0 }}>{s.icon}</div>
                <div><div style={{ color:'#ccc',fontWeight:'bold',fontSize:12 }}>{s.t}</div><div style={{ color:'#556',fontSize:11,marginTop:2 }}>{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:20 }}>
          <div style={{ flex:1,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:4,padding:12,textAlign:'center' }}>
            <div style={{ color:'#00ff88',fontWeight:'bold',fontSize:12 }}>🏆 WIN</div>
            <div style={{ color:'#446655',fontSize:11,marginTop:5 }}>Reach score target with ≤ max dead nodes</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:4,padding:12,textAlign:'center' }}>
            <div style={{ color:'#ff4444',fontWeight:'bold',fontSize:12 }}>💀 LOSE</div>
            <div style={{ color:'#885555',fontSize:11,marginTop:5 }}>Too many nodes die before hitting the target</div>
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ color:'#445',fontSize:10,letterSpacing:3,marginBottom:10 }}>SELECT DIFFICULTY</div>
          <div style={{ display:'flex',gap:10 }}>
            {Object.entries(diffs).map(([k,d]) => (
              <div key={k} onClick={() => setDifficulty(k)} style={{ flex:1,padding:'12px 8px',borderRadius:4,textAlign:'center',cursor:'pointer',border:`2px solid ${difficulty===k?d.color:'#222'}`,background:difficulty===k?`${d.color}10`:'rgba(255,255,255,0.02)',transition:'all 0.2s' }}>
                <div style={{ fontWeight:'bold',fontSize:12,color:difficulty===k?d.color:'#555' }}>{d.label}</div>
                <div style={{ fontSize:10,color:'#444',marginTop:5,lineHeight:1.5 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:14,fontSize:14,fontWeight:'bold',background:'linear-gradient(135deg,#00c878,#00aa55)',border:'none',borderRadius:4,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT }}>
          INITIALIZE PIPELINE MONITOR →
        </button>
      </div>
    </div>
  );
}

const DIFF = {
  //          spreadMs  deathTicks  maxDead  nodeCount  quarantineEarn  quarantineCost  firewallTokens  scoreTarget  passivePtsPerSec
  easy:   { spreadMs:2400, deathTicks:7, maxDead:4, nodeCount:8,  quarantineEarn:150, quarantineCost:10, firewallTokens:4, scoreTarget:600,  passivePts:5 },
  medium: { spreadMs:1800, deathTicks:5, maxDead:3, nodeCount:12, quarantineEarn:150, quarantineCost:10, firewallTokens:3, scoreTarget:900,  passivePts:4 },
  hard:   { spreadMs:1200, deathTicks:3, maxDead:2, nodeCount:14, quarantineEarn:150, quarantineCost:10, firewallTokens:2, scoreTarget:1200, passivePts:3 },
};
const DC = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };

function buildGraph(nodeCount, W, H) {
  const nodes = [];
  const margin = 60;
  const layers = Math.ceil(nodeCount / 3);
  let idx = 0;
  for (let l = 0; l < layers && idx < nodeCount; l++) {
    const nodesInLayer = Math.min(3, nodeCount - idx);
    for (let n = 0; n < nodesInLayer; n++) {
      const x = margin + (l / Math.max(layers - 1, 1)) * (W - margin * 2) + (Math.random() - 0.5) * 40;
      const y = H * 0.12 + (n / Math.max(nodesInLayer - 1, 1)) * (H * 0.72) + (Math.random() - 0.5) * 20;
      const labels = ['Ingest','Clean','Label','Feature','Encode','Augment','Split','Train','Validate','Test','Deploy','Monitor','Infer','Store'];
      nodes.push({ id: idx, x: Math.max(margin/2, Math.min(W - margin/2, x)), y: Math.max(50, Math.min(H-140, y)), label: labels[idx] || `Node${idx}`, status:'healthy', infTimer:0, isRoot:false });
      idx++;
    }
  }
  const edges = [];
  const blockedEdges = new Set();
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < (W / layers) * 1.4 && edges.filter(e => e.a===i||e.b===i||e.a===j||e.b===j).length < 4) {
        edges.push({ a:i, b:j, id:`${i}-${j}` });
      }
    }
  }
  for (let i = 1; i < nodes.length; i++) {
    const connected = edges.some(e => e.a===i||e.b===i);
    if (!connected) edges.push({ a:i-1, b:i, id:`${i-1}-${i}` });
  }
  return { nodes, edges, blockedEdges };
}

function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [ui, setUi] = useState({
    score: 0,
    infected: 1,
    dead: 0,
    firewalls: D.firewallTokens,
    rootFound: false,
    status: 'playing',
    msg: '🔍 Find the ROOT SOURCE node (gold ring)! Quarantine infected red nodes!',
    healthy: 0,
  });
  const uiRef = useRef({ score: 0, infected: 1, dead: 0, firewalls: D.firewallTokens, rootFound: false, status: 'playing', healthy: 0 });
  const [mode, setMode] = useState('quarantine');
  const modeRef = useRef('quarantine');
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const syncUi = useCallback((extraMsg) => {
    const u = uiRef.current;
    setUi(p => ({ ...p, score: u.score, infected: u.infected, dead: u.dead, firewalls: u.firewalls, rootFound: u.rootFound, status: u.status, healthy: u.healthy, ...(extraMsg ? { msg: extraMsg } : {}) }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const { nodes, edges, blockedEdges } = buildGraph(D.nodeCount, canvas.width, canvas.height);
    stateRef.current = { nodes, edges, blockedEdges, particles: [], time: 0, infectedSet: new Set(), deadSet: new Set() };
    const S = stateRef.current;

    // Infect root
    const rootIdx = Math.floor(Math.random() * D.nodeCount);
    nodes[rootIdx].status = 'infected';
    nodes[rootIdx].isRoot = true;
    S.infectedSet.add(rootIdx);
    uiRef.current.infected = 1;
    uiRef.current.healthy = D.nodeCount - 1;

    // ── FIX 1: Passive score tick — healthy nodes earn pts every second ──
    const passiveInterval = setInterval(() => {
      if (uiRef.current.status !== 'playing') return;
      const healthyCount = S.nodes.filter(n => n.status === 'healthy').length;
      uiRef.current.healthy = healthyCount;
      uiRef.current.score += healthyCount * D.passivePts;
      // ── FIX 2: Win check — just need to hit score target ──
      if (uiRef.current.score >= D.scoreTarget) {
        uiRef.current.status = 'won';
        syncUi();
      } else {
        syncUi();
      }
    }, 1000);

    // Spread interval
    const spreadInterval = setInterval(() => {
      if (uiRef.current.status !== 'playing') return;
      const toInfect = [];
      S.infectedSet.forEach(idx => {
        edges.forEach(e => {
          if (blockedEdges.has(e.id)) return;
          let neighbor = -1;
          if (e.a === idx) neighbor = e.b;
          if (e.b === idx) neighbor = e.a;
          if (neighbor >= 0 && !S.infectedSet.has(neighbor) && !S.deadSet.has(neighbor) && nodes[neighbor].status === 'healthy') {
            if (Math.random() > 0.45) toInfect.push(neighbor);
          }
        });
      });
      toInfect.forEach(idx => {
        nodes[idx].status = 'infected';
        nodes[idx].infTimer = 0;
        S.infectedSet.add(idx);
      });
      if (toInfect.length > 0) { uiRef.current.infected = S.infectedSet.size; syncUi(); }
    }, D.spreadMs);

    // Death timer
    const deathInterval = setInterval(() => {
      if (uiRef.current.status !== 'playing') return;
      const dying = [];
      S.infectedSet.forEach(idx => {
        nodes[idx].infTimer++;
        if (nodes[idx].infTimer >= D.deathTicks) dying.push(idx);
      });
      dying.forEach(idx => {
        nodes[idx].status = 'dead';
        S.infectedSet.delete(idx);
        S.deadSet.add(idx);
        for (let p = 0; p < 8; p++) S.particles.push({ x: nodes[idx].x, y: nodes[idx].y, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 1, color: '#333' });
        uiRef.current.dead = S.deadSet.size;
        uiRef.current.infected = S.infectedSet.size;
        if (S.deadSet.size >= D.maxDead) { uiRef.current.status = 'lost'; syncUi(); }
      });
      if (dying.length > 0) syncUi();
    }, 1000);

    // Click handler
    const onClick = (e) => {
      if (uiRef.current.status !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      // ── FIX 3: Use devicePixelRatio-aware coords ──
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      const currentMode = modeRef.current;

      if (currentMode === 'quarantine') {
        let hit = null;
        for (const n of S.nodes) {
          if (n.status === 'infected' && Math.hypot(n.x - mx, n.y - my) < 30) { hit = n; break; }
        }
        if (hit) {
          const u = uiRef.current;
          let pts = D.quarantineEarn;
          const msg_parts = [`☣️ Node quarantined! +${pts} pts`];
          if (hit.isRoot && !u.rootFound) {
            pts += 200;
            u.rootFound = true;
            msg_parts.push('🔍 ROOT SOURCE identified! +200 bonus!');
          }
          u.score = Math.max(0, u.score + pts - D.quarantineCost);
          hit.status = 'cleaned';
          const idx = S.nodes.indexOf(hit);
          S.infectedSet.delete(idx);
          u.infected = S.infectedSet.size;
          for (let p = 0; p < 14; p++) S.particles.push({ x: hit.x, y: hit.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 1, color: '#00ff88' });
          // Win check
          if (u.score >= D.scoreTarget) { u.status = 'won'; }
          syncUi(msg_parts.join(' · '));
        } else {
          // Inform player they missed
          const anyInfected = S.nodes.some(n => n.status === 'infected');
          if (!anyInfected) syncUi('✅ No infected nodes! Keep score climbing via healthy nodes.');
        }
      } else {
        // Firewall mode
        if (uiRef.current.firewalls <= 0) { syncUi('⚠️ No firewall tokens left!'); return; }
        // ── FIX 4: Expanded hit radius to 40px for firewall edge midpoints ──
        let hitEdge = null, bestDist = 40;
        for (const edge of S.edges) {
          if (S.blockedEdges.has(edge.id)) continue;
          const na = S.nodes[edge.a], nb = S.nodes[edge.b];
          const emx = (na.x + nb.x) / 2, emy = (na.y + nb.y) / 2;
          const d = Math.hypot(mx - emx, my - emy);
          if (d < bestDist) { bestDist = d; hitEdge = edge; }
        }
        if (hitEdge) {
          S.blockedEdges.add(hitEdge.id);
          uiRef.current.firewalls--;
          const na = S.nodes[hitEdge.a], nb = S.nodes[hitEdge.b];
          for (let p = 0; p < 10; p++) S.particles.push({ x: (na.x+nb.x)/2, y: (na.y+nb.y)/2, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, life: 1, color: '#ff9900' });
          syncUi(`✂️ Firewall placed! Propagation path cut. ${uiRef.current.firewalls} tokens left.`);
        } else {
          syncUi('🔶 Click closer to an edge midpoint (orange circle).');
        }
      }
    };
    canvas.addEventListener('click', onClick);

    let frame = 0;
    const loop = (now) => {
      S.time = now * 0.001;
      frame++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#010c08';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0,50,30,0.3)';
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 50) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 50) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

      // Draw edges
      for (const edge of S.edges) {
        const na = S.nodes[edge.a], nb = S.nodes[edge.b];
        const blocked = S.blockedEdges.has(edge.id);
        const infectedEdge = (na.status === 'infected' || nb.status === 'infected') && !blocked;

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        if (blocked) {
          ctx.strokeStyle = 'rgba(255,150,0,0.8)';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
        } else if (infectedEdge) {
          ctx.strokeStyle = `rgba(255,${Math.floor(50 + Math.sin(S.time*6)*30)},50,0.7)`;
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(0,150,80,0.3)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        const emx = (na.x + nb.x) / 2, emy = (na.y + nb.y) / 2;

        if (blocked) {
          ctx.fillStyle = '#ff9900';
          ctx.shadowBlur = 10; ctx.shadowColor = '#ff9900';
          ctx.beginPath(); ctx.rect(emx-8, emy-8, 16, 16);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🔥', emx, emy+5);
        } else if (modeRef.current === 'firewall') {
          // ── FIX 5: Larger, clearer clickable hint circles ──
          ctx.strokeStyle = 'rgba(255,150,0,0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(emx, emy, 14, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = 'rgba(255,150,0,0.12)';
          ctx.beginPath(); ctx.arc(emx, emy, 14, 0, Math.PI*2); ctx.fill();
        }

        // Data flow particles
        if (!blocked) {
          const t = ((S.time * 0.8) + (S.nodes.indexOf(na) * 0.3)) % 1;
          const px = na.x + (nb.x - na.x) * t, py = na.y + (nb.y - na.y) * t;
          ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2);
          ctx.fillStyle = infectedEdge ? '#ff4444' : '#00ff88';
          ctx.fill();
        }
      }

      // Particles
      for (let i = S.particles.length - 1; i >= 0; i--) {
        const p = S.particles[i];
        ctx.beginPath(); ctx.arc(p.x, p.y, 5*p.life, 0, Math.PI*2);
        ctx.fillStyle = p.color === '#00ff88' ? `rgba(0,255,136,${p.life})` : p.color === '#ff9900' ? `rgba(255,153,0,${p.life})` : `rgba(80,80,80,${p.life})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.life -= 0.04;
        if (p.life <= 0) S.particles.splice(i, 1);
      }

      // Draw nodes
      S.nodes.forEach((node, idx) => {
        const pulse = 1 + Math.sin(S.time * 4 + idx) * 0.06;
        let color, glow, radius = 22;

        if (node.status === 'infected') {
          const urgency = node.infTimer / D.deathTicks;
          color = `rgb(${Math.floor(180 + urgency*75)},${Math.floor(30 - urgency*20)},${Math.floor(30 - urgency*20)})`;
          glow = '#ff0000';
          radius = 22 * (1 + Math.sin(S.time*6 + idx)*0.12);
        } else if (node.status === 'cleaned') {
          color = '#1a8aff'; glow = '#0055ff'; radius = 18;
        } else if (node.status === 'dead') {
          color = '#1a1a1a'; glow = 'transparent'; radius = 16;
        } else {
          color = '#00cc66'; glow = '#00ff88'; radius = 22 * pulse;
        }

        // Root pulsing ring
        if (node.isRoot && node.status !== 'cleaned' && node.status !== 'dead') {
          ctx.beginPath(); ctx.arc(node.x, node.y, radius + 14, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(255,200,0,${0.3 + Math.sin(S.time*3)*0.15})`;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Glow aura
        if (node.status !== 'dead') {
          ctx.beginPath(); ctx.arc(node.x, node.y, radius + 12, 0, Math.PI*2);
          const gr = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius+16);
          gr.addColorStop(0, glow === 'transparent' ? 'transparent' : glow + '44');
          gr.addColorStop(1, 'transparent');
          ctx.fillStyle = gr; ctx.fill();
        }

        // Node body
        ctx.beginPath(); ctx.arc(node.x, node.y, radius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.shadowBlur = node.status === 'infected' ? 20 : 8;
        ctx.shadowColor = glow;
        ctx.fill(); ctx.shadowBlur = 0;

        // Inner ring
        ctx.beginPath(); ctx.arc(node.x, node.y, radius * 0.55, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill();

        // Timer bar for infected nodes
        if (node.status === 'infected') {
          const pct = 1 - node.infTimer / D.deathTicks;
          ctx.fillStyle = `rgba(255,${Math.floor(pct*200)},0,0.85)`;
          ctx.fillRect(node.x - radius, node.y + radius + 4, radius * 2 * pct, 4);
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - radius, node.y + radius + 4, radius * 2, 4);
        }

        // Label
        ctx.fillStyle = node.status === 'dead' ? '#444' : '#ddd';
        ctx.font = `9px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - radius - 6);
      });

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(spreadInterval);
      clearInterval(deathInterval);
      clearInterval(passiveInterval);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, [D, syncUi]);

  const dc = DC[difficulty];
  const pct = Math.min(100, (ui.score / D.scoreTarget) * 100);

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000 }}>
      <canvas ref={canvasRef} style={{ width:'100%',height:'100%',display:'block',cursor:mode==='firewall'?'crosshair':'pointer' }} />

      {/* HUD — bottom bar, never overlaps graph nodes */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,color:'white',fontFamily:FONT,background:'rgba(3,10,6,0.97)',borderTop:'1px solid rgba(0,255,100,0.2)',backdropFilter:'blur(10px)',zIndex:10,padding:'10px 18px' }}>

        {/* Message strip */}
        <div style={{ fontSize:11,color:'#aaccaa',marginBottom:8,padding:'6px 10px',background:'rgba(0,255,100,0.04)',borderRadius:3,border:'1px solid rgba(0,255,100,0.1)',lineHeight:1.5 }}>{ui.msg}</div>

        {/* Main row */}
        <div style={{ display:'flex',gap:10,alignItems:'stretch' }}>

          {/* Title + difficulty */}
          <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',minWidth:160 }}>
            <div style={{ color:'#00ff88',fontSize:13,fontWeight:'bold',letterSpacing:1 }}>LEVEL 1: DATA POISONING</div>
            <span style={{ fontSize:10,color:dc,border:`1px solid ${dc}44`,borderRadius:3,padding:'2px 7px',marginTop:4,display:'inline-block',width:'fit-content' }}>{difficulty.toUpperCase()}</span>
          </div>

          {/* Divider */}
          <div style={{ width:1,background:'rgba(0,255,100,0.15)',margin:'0 4px' }} />

          {/* Score */}
          <div style={{ flex:2,minWidth:160 }}>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4 }}>
              <span style={{ color:'#556' }}>Score / Target</span>
              <span style={{ color:'#ffff00',fontWeight:'bold' }}>{ui.score} / {D.scoreTarget}</span>
            </div>
            <div style={{ background:'#0a1a0a',height:8,borderRadius:4,overflow:'hidden',border:'1px solid #1a3a1a' }}>
              <div style={{ background:'linear-gradient(90deg,#00aa44,#00ff88)',height:'100%',width:`${pct}%`,transition:'width 0.4s',borderRadius:4 }} />
            </div>
            <div style={{ fontSize:9,color:'#335533',marginTop:3 }}>+{D.passivePts} pts/sec per healthy node</div>
          </div>

          {/* Divider */}
          <div style={{ width:1,background:'rgba(0,255,100,0.15)',margin:'0 4px' }} />

          {/* Infected / Dead */}
          <div style={{ display:'flex',gap:8 }}>
            <div style={{ background:'rgba(255,50,50,0.1)',border:'1px solid rgba(255,50,50,0.25)',borderRadius:4,padding:'6px 14px',textAlign:'center' }}>
              <div style={{ fontSize:10,color:'#ff7777',marginBottom:2 }}>INFECTED</div>
              <div style={{ fontSize:20,fontWeight:'bold',color:'#ff4444' }}>{ui.infected}</div>
            </div>
            <div style={{ background:'rgba(80,80,80,0.1)',border:'1px solid rgba(80,80,80,0.25)',borderRadius:4,padding:'6px 14px',textAlign:'center' }}>
              <div style={{ fontSize:10,color:'#888',marginBottom:2 }}>DEAD / MAX</div>
              <div style={{ fontSize:20,fontWeight:'bold',color: ui.dead >= D.maxDead - 1 ? '#ff4444' : '#aaa' }}>{ui.dead}/{D.maxDead}</div>
            </div>
            <div style={{ background:'rgba(255,200,0,0.08)',border:'1px solid rgba(255,200,0,0.2)',borderRadius:4,padding:'6px 14px',textAlign:'center' }}>
              <div style={{ fontSize:10,color:'#aa8800',marginBottom:2 }}>ROOT</div>
              <div style={{ fontSize:20,fontWeight:'bold',color:'#ffcc00' }}>{ui.rootFound?'✓':'?'}</div>
            </div>
            <div style={{ background:'rgba(255,150,0,0.08)',border:'1px solid rgba(255,150,0,0.2)',borderRadius:4,padding:'6px 14px',textAlign:'center' }}>
              <div style={{ fontSize:10,color:'#997700',marginBottom:2 }}>FIREWALLS</div>
              <div style={{ fontSize:20,fontWeight:'bold',color:'#ff9900' }}>{ui.firewalls}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width:1,background:'rgba(0,255,100,0.15)',margin:'0 4px' }} />

          {/* Mode buttons */}
          <div style={{ display:'flex',gap:8,alignItems:'center' }}>
            <button onClick={() => setMode('quarantine')} style={{ padding:'8px 14px',borderRadius:4,fontSize:11,fontWeight:'bold',background:mode==='quarantine'?'rgba(0,255,100,0.18)':'rgba(255,255,255,0.03)',border:`1px solid ${mode==='quarantine'?'#00ff88':'#333'}`,color:mode==='quarantine'?'#00ff88':'#555',cursor:'pointer',fontFamily:FONT,transition:'all 0.2s',whiteSpace:'nowrap' }}>
              ☣️ QUARANTINE
            </button>
            <button onClick={() => setMode('firewall')} style={{ padding:'8px 14px',borderRadius:4,fontSize:11,fontWeight:'bold',background:mode==='firewall'?'rgba(255,150,0,0.18)':'rgba(255,255,255,0.03)',border:`1px solid ${mode==='firewall'?'#ff9900':'#333'}`,color:mode==='firewall'?'#ff9900':'#555',cursor:'pointer',fontFamily:FONT,transition:'all 0.2s',whiteSpace:'nowrap' }}>
              ✂️ FIREWALL
            </button>
            <button onClick={onExit} style={{ padding:'8px 12px',background:'#0a0f0a',border:'1px solid #333',borderRadius:4,color:'#556',cursor:'pointer',fontSize:11,fontFamily:FONT,whiteSpace:'nowrap' }}>Exit</button>
          </div>

        </div>
      </div>

      {/* Win screen */}
      {ui.status === 'won' && (
        <div style={{ ...OVR,background:'rgba(0,12,5,0.97)' }}>
          <div style={{ fontSize:10,color:'#00ff88',letterSpacing:5,marginBottom:10 }}>MISSION COMPLETE</div>
          <h1 style={{ color:'#00ff88',fontSize:44,margin:'0 0 10px',textShadow:'0 0 20px #00ff8866' }}>PIPELINE SECURED</h1>
          <p style={{ color:'#668877',fontSize:16,margin:'0 0 20px' }}>All poisoning propagation contained</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:24,width:420 }}>
            {[['FINAL SCORE',ui.score],['DEAD NODES',`${ui.dead}/${D.maxDead}`],['ROOT FOUND',ui.rootFound?'YES':'NO']].map(([l,v]) => (
              <div key={l} style={{ background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:4,padding:'12px 8px',textAlign:'center' }}>
                <div style={{ fontSize:9,color:'#445',letterSpacing:2,marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:18,color:'#00ff88',fontWeight:'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={onExit} style={BTN}>Continue →</button>
        </div>
      )}

      {/* Lose screen */}
      {ui.status === 'lost' && (
        <div style={{ ...OVR,background:'rgba(14,0,0,0.97)' }}>
          <div style={{ fontSize:10,color:'#ff4444',letterSpacing:5,marginBottom:10 }}>MISSION FAILED</div>
          <h1 style={{ color:'#ff3333',fontSize:44,margin:'0 0 10px' }}>PIPELINE CORRUPTED</h1>
          <p style={{ color:'#778',fontSize:16,margin:'0 0 20px' }}>Too many nodes died — root cause unknown</p>
          <p style={{ color:'#ff7777',fontSize:14,margin:'0 0 22px' }}>Score: {ui.score} | Dead: {ui.dead}/{D.maxDead}</p>
          <div style={{ fontSize:13,color:'#664444',marginBottom:24,maxWidth:380,textAlign:'center',lineHeight:1.7 }}>
            💡 <strong style={{ color:'#ff9999' }}>Tip:</strong> Switch to FIREWALL mode early to cut edges around the infected cluster. This slows spread so you have time to quarantine.
          </div>
          <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry Mission</button>
        </div>
      )}
    </div>
  );
}

export default function Level1({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase === 'instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}