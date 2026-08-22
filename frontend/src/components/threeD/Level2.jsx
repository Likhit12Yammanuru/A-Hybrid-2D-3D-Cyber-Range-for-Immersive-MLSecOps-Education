import { useEffect, useRef, useState, useCallback } from 'react';

// ── Level 2: Feature Space Corruption ─────────────────────────────────────────
// Mechanic: Stacked feature layers. Corruption spreads WITHIN layers and across layers.
// Player must: (1) Inspect each layer by clicking it (costs time)
//              (2) Identify corrupted feature extractors (subtle color/behavior tells)
//              (3) Isolate compromised layers using ISOLATION BARRIER
//              (4) Retrain isolated layers to restore
// Distinct: Layer-by-layer inspection, limited view (can only see 1 layer detail at a time)

const FONT = '"Share Tech Mono", monospace';
const OVR = { position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:FONT,zIndex:20,backdropFilter:'blur(8px)' };
const BTN = { marginTop:24,padding:'13px 40px',fontSize:15,fontWeight:'bold',background:'linear-gradient(135deg,#9d50bb,#6e48aa)',border:'none',borderRadius:6,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT };

function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'5 layers · Corruption pulses visibly · 90s timer · 3 retrain tokens' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'7 layers · Subtle corruption · 70s timer · 2 retrain tokens' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'9 layers · Near-invisible corruption · 50s timer · 1 retrain token' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#050208 0%,#0a0420 100%)',fontFamily:FONT,color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:660,width:'92%',background:'rgba(150,0,255,0.03)',border:'1px solid rgba(150,0,255,0.2)',borderRadius:6,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:'#cc88ff',opacity:0.5,marginBottom:8 }}>ML-SEC TRAINING // LEVEL 2</div>
          <h1 style={{ margin:0,fontSize:26,color:'#cc88ff',letterSpacing:3 }}>FEATURE SPACE CORRUPTION</h1>
          <p style={{ margin:'8px 0 0',color:'#443355',fontSize:12,letterSpacing:2 }}>FEATURE EXTRACTION ATTACK DEFENSE</p>
        </div>
        <div style={{ background:'rgba(150,0,255,0.06)',border:'1px solid rgba(150,0,255,0.18)',borderRadius:4,padding:'14px 18px',marginBottom:18 }}>
          <div style={{ color:'#aa66ff',fontSize:10,letterSpacing:3,marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:12,color:'#7766aa',lineHeight:1.85 }}>
            Feature extraction layers transform raw data into the representations an ML model learns from. <strong style={{ color:'#cc88ff' }}>Corrupted feature extractors</strong> produce subtly wrong representations — models trained on them learn systematically incorrect decision boundaries. Security requires <strong style={{ color:'#cc88ff' }}>inspecting each layer carefully</strong> before deciding to isolate and retrain.
          </p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ color:'#443',fontSize:10,letterSpacing:3,marginBottom:12 }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:7 }}>
            {[
              { icon:'📦', t:'Layers are stacked vertically — each has 8 feature nodes', d:'Corruption spreads within and between layers over time.' },
              { icon:'🔍', t:'Click a layer to INSPECT it (costs 3s of timer)', d:'Only 1 layer can be viewed in detail at a time. Read the stats carefully.' },
              { icon:'🚨', t:'Watch for corruption signals: skewed distribution, high variance', d:'Corrupted features show abnormal mean/std values and erratic motion.' },
              { icon:'🔒', t:'Click ISOLATE on a suspected corrupted layer', d:'Stops corruption from spreading to/from that layer. No cost, but irreversible.' },
              { icon:'🔄', t:'Click RETRAIN on an isolated corrupted layer', d:'Costs a retrain token but fully repairs the layer. Limited tokens!' },
            ].map(s => (
              <div key={s.t} style={{ display:'flex',gap:12,alignItems:'flex-start',background:'rgba(255,255,255,0.02)',borderRadius:3,padding:'10px 13px' }}>
                <div style={{ fontSize:18,flexShrink:0 }}>{s.icon}</div>
                <div><div style={{ color:'#ccc',fontWeight:'bold',fontSize:12 }}>{s.t}</div><div style={{ color:'#556',fontSize:11,marginTop:2 }}>{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:20 }}>
          <div style={{ flex:1,background:'rgba(150,80,255,0.06)',border:'1px solid rgba(150,80,255,0.2)',borderRadius:4,padding:12,textAlign:'center' }}>
            <div style={{ color:'#cc88ff',fontWeight:'bold',fontSize:12 }}>🏆 WIN</div>
            <div style={{ color:'#664488',fontSize:11,marginTop:5 }}>Isolate or retrain all corrupted layers before timer</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:4,padding:12,textAlign:'center' }}>
            <div style={{ color:'#ff4444',fontWeight:'bold',fontSize:12 }}>💀 LOSE</div>
            <div style={{ color:'#885555',fontSize:11,marginTop:5 }}>Timer expires or >50% layers fully corrupted</div>
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ color:'#443',fontSize:10,letterSpacing:3,marginBottom:10 }}>SELECT DIFFICULTY</div>
          <div style={{ display:'flex',gap:10 }}>
            {Object.entries(diffs).map(([k,d]) => (
              <div key={k} onClick={() => setDifficulty(k)} style={{ flex:1,padding:'12px 8px',borderRadius:4,textAlign:'center',cursor:'pointer',border:`2px solid ${difficulty===k?d.color:'#222'}`,background:difficulty===k?`${d.color}10`:'rgba(255,255,255,0.02)',transition:'all 0.2s' }}>
                <div style={{ fontWeight:'bold',fontSize:12,color:difficulty===k?d.color:'#555' }}>{d.label}</div>
                <div style={{ fontSize:10,color:'#444',marginTop:5,lineHeight:1.5 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:14,fontSize:14,fontWeight:'bold',background:'linear-gradient(135deg,#9d50bb,#6e48aa)',border:'none',borderRadius:4,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT }}>
          BEGIN LAYER INSPECTION →
        </button>
      </div>
    </div>
  );
}

const DIFF = {
  easy:   { layerCount:5,  timerSec:90, retrainTokens:3, spreadMs:3000, corruptVisible:0.8, initialCorrupt:2 },
  medium: { layerCount:7,  timerSec:70, retrainTokens:2, spreadMs:2200, corruptVisible:0.4, initialCorrupt:2 },
  hard:   { layerCount:9,  timerSec:50, retrainTokens:1, spreadMs:1600, corruptVisible:0.15, initialCorrupt:3 },
};
const DC = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };
const NODES_PER_LAYER = 8;
const LAYER_NAMES = ['Input','Conv1','Conv2','Pool1','FC1','Norm','Attention','Pool2','Output'];

function buildLayers(count) {
  return Array.from({ length: count }, (_, li) => ({
    id: li,
    name: LAYER_NAMES[li] || `L${li}`,
    status: 'clean', // clean | corrupted | isolated | retrained
    corruption: 0,   // 0–1
    nodes: Array.from({ length: NODES_PER_LAYER }, (__, ni) => ({
      activation: Math.random(),
      noise: 0,
      phase: Math.random() * Math.PI * 2,
    })),
    inspected: false,
    stats: { mean: 0.5, std: 0.1 },
  }));
}

function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [layers, setLayers] = useState(() => {
    const ls = buildLayers(D.layerCount);
    // Corrupt initial layers
    for (let i = 0; i < D.initialCorrupt; i++) {
      const idx = Math.floor(Math.random() * D.layerCount);
      ls[idx].status = 'corrupted';
      ls[idx].corruption = 0.3 + Math.random() * 0.4;
    }
    return ls;
  });
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(D.timerSec);
  const [retrainTokens, setRetrainTokens] = useState(D.retrainTokens);
  const [status, setStatus] = useState('playing');
  const [msg, setMsg] = useState('Click a layer to INSPECT it. Look for corruption signals in the stats.');
  const [score, setScore] = useState(0);
  const layersRef = useRef(layers);
  useEffect(() => { layersRef.current = layers; }, [layers]);

  // Timer
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        if (next <= 0) { setStatus('lost'); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Corruption spread
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setLayers(prev => {
        const next = prev.map(l => ({ ...l, nodes: l.nodes.map(n => ({ ...n })) }));
        // Increase corruption in corrupted layers
        next.forEach(l => {
          if (l.status === 'corrupted') {
            l.corruption = Math.min(1, l.corruption + 0.08);
            l.nodes.forEach(n => { n.noise = Math.min(1, n.noise + 0.06 * Math.random()); });
          }
        });
        // Spread between adjacent non-isolated layers
        for (let i = 0; i < next.length - 1; i++) {
          if (next[i].status === 'corrupted' && next[i].corruption > 0.5 && next[i+1].status === 'clean') {
            if (Math.random() > 0.6) {
              next[i+1].status = 'corrupted';
              next[i+1].corruption = 0.2;
            }
          }
        }
        // Check lose condition: >50% fully corrupted
        const fullyCorrupted = next.filter(l => l.status === 'corrupted' && l.corruption >= 1).length;
        if (fullyCorrupted > D.layerCount * 0.5) setStatus('lost');
        // Check win condition: all corrupted layers handled
        const stillCorrupted = next.filter(l => l.status === 'corrupted').length;
        if (stillCorrupted === 0) { setStatus('won'); }
        return next;
      });
    }, D.spreadMs);
    return () => clearInterval(interval);
  }, [status, D]);

  const handleInspect = (layerId) => {
    if (status !== 'playing') return;
    setTimeLeft(t => Math.max(0, t - 3));
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, inspected: true } : l));
    setSelectedLayer(layerId);
    const l = layersRef.current.find(l => l.id === layerId);
    if (!l) return;
    const isCorrupt = l.status === 'corrupted';
    const sig = isCorrupt ? `Mean: ${(0.3 + l.corruption * 0.4).toFixed(3)}, Std: ${(0.4 + l.corruption * 0.3).toFixed(3)} ⚠️ ELEVATED` : `Mean: ${(0.49 + Math.random()*0.03).toFixed(3)}, Std: ${(0.08 + Math.random()*0.02).toFixed(3)} ✓ NORMAL`;
    setMsg(`Layer "${l.name}" [${l.status.toUpperCase()}] — ${sig}`);
  };

  const handleIsolate = (layerId) => {
    if (status !== 'playing') return;
    setLayers(prev => prev.map(l => {
      if (l.id !== layerId || l.status === 'clean' || l.status === 'isolated' || l.status === 'retrained') return l;
      setMsg(`🔒 Layer "${l.name}" isolated — corruption cannot spread from here.`);
      setScore(s => s + 150);
      return { ...l, status: 'isolated' };
    }));
  };

  const handleRetrain = (layerId) => {
    if (status !== 'playing' || retrainTokens <= 0) {
      setMsg('⚠️ No retrain tokens remaining!'); return;
    }
    setLayers(prev => prev.map(l => {
      if (l.id !== layerId || (l.status !== 'corrupted' && l.status !== 'isolated')) return l;
      setRetrainTokens(t => t - 1);
      setScore(s => s + 300);
      setMsg(`🔄 Layer "${l.name}" retrained — fully restored!`);
      return { ...l, status: 'retrained', corruption: 0, nodes: l.nodes.map(n => ({ ...n, noise: 0 })) };
    }));
  };

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    let frameId;
    const loop = (now) => {
      const t = now * 0.001;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#050208';
      ctx.fillRect(0,0,W,H);

      // Background grid suggesting depth/3D layers
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `rgba(80,0,120,${0.03 + i*0.005})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, H*0.1 + i*(H*0.8/20));
        ctx.lineTo(W, H*0.1 + i*(H*0.8/20));
        ctx.stroke();
      }

      const ls = layersRef.current;
      const totalH = H * 0.8;
      const layerH = totalH / D.layerCount;
      const startY = H * 0.1;
      const layerX = W * 0.25;
      const layerW = W * 0.55;

      // Data flow arrow (left side)
      ctx.fillStyle = 'rgba(150,0,255,0.6)';
      ctx.font = `11px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('INPUT DATA ↓', W*0.1, startY - 15);
      ctx.fillText('OUTPUT ↓', W*0.1, startY + totalH + 18);

      ls.forEach((layer, li) => {
        const y = startY + li * layerH;
        const isSelected = selectedLayer === layer.id;
        const isCorrupted = layer.status === 'corrupted';
        const isIsolated = layer.status === 'isolated';
        const isRetrained = layer.status === 'retrained';

        // Layer background
        let bgColor = 'rgba(30,0,60,0.5)';
        if (isSelected) bgColor = 'rgba(80,0,120,0.7)';
        if (isCorrupted) bgColor = `rgba(${Math.floor(60 + layer.corruption * 100)},0,20,0.7)`;
        if (isIsolated) bgColor = 'rgba(100,60,0,0.6)';
        if (isRetrained) bgColor = 'rgba(0,50,30,0.6)';

        ctx.fillStyle = bgColor;
        ctx.fillRect(layerX, y + 2, layerW, layerH - 4);

        // Border
        let borderColor = isSelected ? '#aa00ff' : isCorrupted ? `rgba(255,${Math.floor(100-layer.corruption*100)},0,0.8)` : isIsolated ? '#ff9900' : isRetrained ? '#00ff88' : 'rgba(100,0,180,0.4)';
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(layerX, y + 2, layerW, layerH - 4);

        // Feature nodes visualization inside layer
        const nodeSpacing = layerW / (NODES_PER_LAYER + 1);
        layer.nodes.forEach((node, ni) => {
          const nx = layerX + nodeSpacing * (ni + 1);
          const ny = y + layerH / 2;
          const baseSize = 6;
          const pulse = 1 + Math.sin(t * 3 + node.phase) * 0.15;
          let nodeSize = baseSize * pulse;
          let nodeColor = '#6622aa';

          if (isCorrupted) {
            const corruptPulse = D.corruptVisible > 0.5
              ? 1 + Math.sin(t * 8 + node.phase) * 0.4 * layer.corruption
              : 1 + Math.sin(t * 6 + node.phase) * 0.1 * layer.corruption;
            nodeSize = (baseSize + node.noise * 6) * corruptPulse;
            nodeColor = `rgba(255,${Math.floor(50 - layer.corruption*40)},${Math.floor(100 - layer.corruption*80)},${0.6 + D.corruptVisible*0.3})`;
          } else if (isIsolated) {
            nodeColor = 'rgba(255,150,0,0.7)';
          } else if (isRetrained) {
            nodeColor = '#00cc66';
          } else {
            nodeColor = `rgba(${Math.floor(80+ni*10)},0,${Math.floor(150+ni*10)},0.8)`;
          }

          ctx.beginPath();
          ctx.arc(nx, ny + Math.sin(t*2+node.phase)*3, nodeSize, 0, Math.PI*2);
          ctx.fillStyle = nodeColor;
          ctx.shadowBlur = isCorrupted ? 12 : 4;
          ctx.shadowColor = nodeColor;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Connection lines between nodes
          if (ni < NODES_PER_LAYER - 1) {
            ctx.beginPath();
            ctx.moveTo(nx + nodeSize, ny);
            ctx.lineTo(nx + nodeSpacing - nodeSize, ny);
            ctx.strokeStyle = isCorrupted ? `rgba(255,50,0,${0.2 + layer.corruption*0.3})` : 'rgba(100,0,180,0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Layer label
        ctx.fillStyle = isCorrupted ? '#ff7766' : isIsolated ? '#ffaa44' : isRetrained ? '#00ff88' : '#8844cc';
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillText(layer.name, layerX - 70, y + layerH/2 + 4);

        // Status badge
        const badge = isCorrupted ? `CORRUPT ${Math.floor(layer.corruption*100)}%` : isIsolated ? 'ISOLATED' : isRetrained ? 'RETRAINED' : layer.inspected ? 'CLEAN ✓' : '?????';
        const badgeColor = isCorrupted ? '#ff4444' : isIsolated ? '#ff9900' : isRetrained ? '#00ff88' : layer.inspected ? '#66ff88' : '#666';
        ctx.fillStyle = badgeColor;
        ctx.font = `9px ${FONT}`;
        ctx.textAlign = 'right';
        ctx.fillText(badge, layerX + layerW + 80, y + layerH/2 + 4);

        // Corruption bar if corrupted/isolated
        if (isCorrupted || isIsolated) {
          const barW = layerW * layer.corruption;
          ctx.fillStyle = `rgba(255,50,0,${0.3 + layer.corruption*0.4})`;
          ctx.fillRect(layerX, y + layerH - 6, barW, 4);
        }

        // Isolation bars (top/bottom separators)
        if (isIsolated) {
          ctx.fillStyle = '#ff9900';
          ctx.fillRect(layerX, y + 2, layerW, 3);
          ctx.fillRect(layerX, y + layerH - 5, layerW, 3);
        }
      });

      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', resize); };
  }, [D, selectedLayer]);

  const dc = DC[difficulty];
  const corruptedCount = layers.filter(l => l.status === 'corrupted').length;
  const handledCount = layers.filter(l => l.status === 'isolated' || l.status === 'retrained').length;
  const totalBad = layers.filter(l => l.status === 'corrupted' || l.status === 'isolated').length;

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,fontFamily:FONT }}>
      <canvas ref={canvasRef} style={{ width:'100%',height:'100%',display:'block' }} />

      {/* Left panel: layer list */}
      <div style={{ position:'absolute',top:20,left:20,color:'white',background:'rgba(5,2,14,0.95)',padding:16,borderRadius:6,border:'1px solid rgba(150,80,255,0.2)',backdropFilter:'blur(10px)',width:200,zIndex:10,overflowY:'auto',maxHeight:'calc(100vh - 40px)' }}>
        <div style={{ fontSize:9,color:'#aa66ff',letterSpacing:3,marginBottom:10 }}>LAYER STACK</div>
        {layers.map((layer, li) => (
          <div key={layer.id}
            onClick={() => handleInspect(layer.id)}
            style={{ padding:'8px 10px',marginBottom:4,borderRadius:3,cursor:'pointer',border:`1px solid ${selectedLayer===layer.id?'#aa00ff':layer.status==='corrupted'?'#ff4400':layer.status==='isolated'?'#ff9900':layer.status==='retrained'?'#00ff88':'#333'}`,background:selectedLayer===layer.id?'rgba(100,0,200,0.2)':'rgba(255,255,255,0.02)',transition:'all 0.15s' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <span style={{ fontSize:11,color:'#ddd',fontWeight:'bold' }}>{layer.name}</span>
              <span style={{ fontSize:10,color:layer.status==='corrupted'?'#ff4444':layer.status==='isolated'?'#ff9900':layer.status==='retrained'?'#00ff88':'#444' }}>
                {layer.status==='corrupted'?'☣️':layer.status==='isolated'?'🔒':layer.status==='retrained'?'✓':'?'}
              </span>
            </div>
            {layer.status === 'corrupted' && (
              <div style={{ height:3,background:'#ff4400',width:`${layer.corruption*100}%`,borderRadius:2,marginTop:4 }} />
            )}
          </div>
        ))}
      </div>

      {/* Right panel: controls */}
      <div style={{ position:'absolute',top:20,right:20,color:'white',background:'rgba(5,2,14,0.95)',padding:20,borderRadius:6,border:'1px solid rgba(150,80,255,0.2)',backdropFilter:'blur(10px)',width:270,zIndex:10 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(150,80,255,0.15)',paddingBottom:10,marginBottom:14 }}>
          <h3 style={{ margin:0,color:'#cc88ff',fontSize:13,letterSpacing:1 }}>LEVEL 2: FEATURE CORRUPTION</h3>
          <span style={{ fontSize:10,color:dc,border:`1px solid ${dc}44`,borderRadius:3,padding:'2px 6px' }}>{difficulty.toUpperCase()}</span>
        </div>

        {/* Timer */}
        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:12 }}>
          <div><div style={{ fontSize:10,color:'#556',marginBottom:2 }}>TIME</div>
            <div style={{ fontSize:28,fontWeight:'bold',color:timeLeft<15?'#ff4444':'#cc88ff' }}>{timeLeft}s</div></div>
          <div style={{ textAlign:'right' }}><div style={{ fontSize:10,color:'#556',marginBottom:2 }}>SCORE</div>
            <div style={{ fontSize:28,fontWeight:'bold',color:'#ffff00' }}>{score}</div></div>
        </div>

        {/* Message */}
        <div style={{ fontSize:11,color:'#9977aa',marginBottom:12,padding:'8px',background:'rgba(150,0,255,0.05)',borderRadius:3,border:'1px solid rgba(150,0,255,0.1)',minHeight:40 }}>{msg}</div>

        {/* Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14 }}>
          <div style={{ background:'rgba(255,50,50,0.1)',border:'1px solid rgba(255,50,50,0.2)',borderRadius:4,padding:'8px',textAlign:'center' }}>
            <div style={{ fontSize:10,color:'#ff7777',marginBottom:2 }}>CORRUPTED</div>
            <div style={{ fontSize:20,fontWeight:'bold',color:'#ff4444' }}>{corruptedCount}</div>
          </div>
          <div style={{ background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:4,padding:'8px',textAlign:'center' }}>
            <div style={{ fontSize:10,color:'#44ff88',marginBottom:2 }}>HANDLED</div>
            <div style={{ fontSize:20,fontWeight:'bold',color:'#00ff88' }}>{handledCount}</div>
          </div>
        </div>

        {/* Retrain tokens */}
        <div style={{ marginBottom:14,padding:'10px',background:'rgba(0,255,136,0.04)',borderRadius:4,border:'1px solid rgba(0,255,136,0.15)' }}>
          <div style={{ fontSize:10,color:'#445',marginBottom:5 }}>RETRAIN TOKENS</div>
          <div style={{ display:'flex',gap:6 }}>
            {Array.from({length:D.retrainTokens}).map((_,i) => (
              <div key={i} style={{ width:24,height:24,borderRadius:'50%',background:i<retrainTokens?'#00ff88':'#1a1a1a',border:`1px solid ${i<retrainTokens?'#00ff88':'#333'}`,boxShadow:i<retrainTokens?'0 0 8px #00ff88':'none' }} />
            ))}
          </div>
        </div>

        {/* Actions on selected layer */}
        {selectedLayer !== null && (() => {
          const layer = layers.find(l => l.id === selectedLayer);
          return layer ? (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:'#556',marginBottom:8 }}>SELECTED: {layer.name} [{layer.status.toUpperCase()}]</div>
              <div style={{ display:'flex',gap:8 }}>
                <button onClick={() => handleIsolate(selectedLayer)} disabled={layer.status !== 'corrupted'} style={{ flex:1,padding:'9px 4px',borderRadius:4,fontSize:11,fontWeight:'bold',background:layer.status==='corrupted'?'rgba(255,150,0,0.2)':'#111',border:`1px solid ${layer.status==='corrupted'?'#ff9900':'#333'}`,color:layer.status==='corrupted'?'#ff9900':'#444',cursor:layer.status==='corrupted'?'pointer':'not-allowed',fontFamily:FONT }}>
                  🔒 ISOLATE
                </button>
                <button onClick={() => handleRetrain(selectedLayer)} disabled={retrainTokens<=0||(layer.status!=='corrupted'&&layer.status!=='isolated')} style={{ flex:1,padding:'9px 4px',borderRadius:4,fontSize:11,fontWeight:'bold',background:(retrainTokens>0&&(layer.status==='corrupted'||layer.status==='isolated'))?'rgba(0,255,136,0.15)':'#111',border:`1px solid ${(retrainTokens>0&&(layer.status==='corrupted'||layer.status==='isolated'))?'#00ff88':'#333'}`,color:(retrainTokens>0&&(layer.status==='corrupted'||layer.status==='isolated'))?'#00ff88':'#444',cursor:(retrainTokens>0&&(layer.status==='corrupted'||layer.status==='isolated'))?'pointer':'not-allowed',fontFamily:FONT }}>
                  🔄 RETRAIN
                </button>
              </div>
            </div>
          ) : null;
        })()}

        <button onClick={onExit} style={{ width:'100%',padding:8,background:'#0a0814',border:'1px solid #333',borderRadius:4,color:'#556',cursor:'pointer',fontSize:11,fontFamily:FONT }}>Exit Level</button>
      </div>

      {status==='won' && (
        <div style={{ ...OVR,background:'rgba(10,5,18,0.97)' }}>
          <div style={{ fontSize:10,color:'#cc88ff',letterSpacing:5,marginBottom:10 }}>MISSION COMPLETE</div>
          <h1 style={{ color:'#cc88ff',fontSize:44,marginBottom:12,margin:'0 0 10px',textShadow:'0 0 20px #cc88ff66' }}>FEATURE SPACE SECURED</h1>
          <p style={{ color:'#7766aa',fontSize:16,margin:'0 0 20px' }}>All corrupted extractors identified and handled</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:24,width:420 }}>
            {[['FINAL SCORE',score],['TIME LEFT',`${timeLeft}s`],['RETRAIN TOKENS',retrainTokens]].map(([l,v]) => (
              <div key={l} style={{ background:'rgba(150,80,255,0.07)',border:'1px solid rgba(150,80,255,0.2)',borderRadius:4,padding:'12px 8px',textAlign:'center' }}>
                <div style={{ fontSize:9,color:'#445',letterSpacing:2,marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:18,color:'#cc88ff',fontWeight:'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={onExit} style={BTN}>Continue →</button>
        </div>
      )}
      {status==='lost' && (
        <div style={{ ...OVR,background:'rgba(14,0,10,0.97)' }}>
          <div style={{ fontSize:10,color:'#ff4444',letterSpacing:5,marginBottom:10 }}>MISSION FAILED</div>
          <h1 style={{ color:'#ff3333',fontSize:44,marginBottom:12,margin:'0 0 10px' }}>CORRUPTION SPREAD</h1>
          <p style={{ color:'#778',fontSize:16,margin:'0 0 22px' }}>{timeLeft<=0?'Timer expired — too many layers corrupted':'Critical corruption threshold exceeded'}</p>
          <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry Analysis</button>
        </div>
      )}
    </div>
  );
}

export default function Level2({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase === 'instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}