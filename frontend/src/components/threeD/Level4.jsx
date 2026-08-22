import { useEffect, useRef, useState, useCallback } from 'react';

// ── Level 4: Backdoor Trigger Discovery ───────────────────────────────────────
// Mechanic: A grid of input samples. Some are normal, some contain backdoor triggers.
// Player must: (1) Toggle XAI overlay to reveal saliency maps on samples
//              (2) Identify the TRIGGER PATTERN that causes misclassification
//              (3) Once trigger pattern identified, MARK all samples containing it
//              (4) Submit findings to deactivate backdoors
// Distinct: Pattern recognition + XAI interpretation, not click-to-remove but analyze-and-report

const FONT = '"Share Tech Mono", monospace';
const OVR = { position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:FONT,zIndex:20,backdropFilter:'blur(8px)' };
const BTN = { marginTop:24,padding:'13px 40px',fontSize:15,fontWeight:'bold',background:'linear-gradient(135deg,#0088cc,#6600ff)',border:'none',borderRadius:6,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT };

function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'12 samples · Clear saliency hotspots · 3 trigger types · Unlimited XAI' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'20 samples · Subtle hotspots · 4 trigger types · 8 XAI uses' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'28 samples · Minimal signal · 5 trigger types · 5 XAI uses' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#020210 0%,#040420 100%)',fontFamily:FONT,color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:680,width:'92%',background:'rgba(0,255,255,0.03)',border:'1px solid rgba(0,255,255,0.18)',borderRadius:6,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:'#00ffff',opacity:0.5,marginBottom:8 }}>ML-SEC TRAINING // LEVEL 4</div>
          <h1 style={{ margin:0,fontSize:26,color:'#00ffff',letterSpacing:3 }}>BACKDOOR TRIGGER DISCOVERY</h1>
          <p style={{ margin:'8px 0 0',color:'#334455',fontSize:12,letterSpacing:2 }}>XAI-BASED BACKDOOR DETECTION</p>
        </div>
        <div style={{ background:'rgba(0,100,255,0.07)',border:'1px solid rgba(0,100,255,0.2)',borderRadius:4,padding:'14px 18px',marginBottom:18 }}>
          <div style={{ color:'#5588ff',fontSize:10,letterSpacing:3,marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:12,color:'#7799aa',lineHeight:1.85 }}>
            Backdoor attacks embed hidden <strong style={{ color:'#00ffff' }}>trigger patterns</strong> in training data. When the trigger appears at inference time, the model misclassifies with high confidence. <strong style={{ color:'#00ffff' }}>Explainability tools</strong> (saliency maps, GradCAM, SHAP) reveal which input features the model focuses on — backdoored samples show unnaturally high attention to the trigger region.
          </p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ color:'#445',fontSize:10,letterSpacing:3,marginBottom:12 }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:7 }}>
            {[
              { icon:'🖼️', t:'A grid of image samples appears', d:'Each sample shows a small pattern. Some are normal training data, some contain hidden backdoor triggers.' },
              { icon:'🔬', t:'Toggle XAI OVERLAY to analyze a sample', d:'Saliency map appears — bright red regions = high model attention. Backdoored samples focus on trigger location.' },
              { icon:'🎯', t:'Identify the TRIGGER PATTERN', d:'Compare XAI overlays. Normal samples have distributed attention. Backdoored ones concentrate on a specific artifact.' },
              { icon:'✓', t:'MARK samples you believe are backdoored', d:'Click to flag. Once confident, SUBMIT FINDINGS to score points per correct identification.' },
              { icon:'⚠️', t:'Wrong marks cost points', d:'False positives (marking clean samples) and false negatives (missing backdoors) both reduce score.' },
            ].map(s => (
              <div key={s.t} style={{ display:'flex',gap:12,alignItems:'flex-start',background:'rgba(255,255,255,0.02)',borderRadius:3,padding:'10px 13px' }}>
                <div style={{ fontSize:18,flexShrink:0 }}>{s.icon}</div>
                <div><div style={{ color:'#ccc',fontWeight:'bold',fontSize:12 }}>{s.t}</div><div style={{ color:'#556',fontSize:11,marginTop:2 }}>{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:20 }}>
          {[{ c:'#00ffff',l:'Standard',s:'Normal view' },{ c:'#aa00ff',l:'Saliency',s:'Attention map' },{ c:'#ff4444',l:'GradCAM',s:'Layer gradients' },{ c:'#ffcc00',l:'SHAP',s:'Feature impact' }].map(m => (
            <div key={m.l} style={{ flex:1,background:'rgba(255,255,255,0.02)',border:`1px solid ${m.c}33`,borderRadius:4,padding:'10px 6px',textAlign:'center' }}>
              <div style={{ width:10,height:10,background:m.c,borderRadius:'50%',margin:'0 auto 5px',boxShadow:`0 0 6px ${m.c}` }} />
              <div style={{ color:m.c,fontSize:10,fontWeight:'bold' }}>{m.l}</div>
              <div style={{ color:'#444',fontSize:9,marginTop:2 }}>{m.s}</div>
            </div>
          ))}
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
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:14,fontSize:14,fontWeight:'bold',background:'linear-gradient(135deg,#0088cc,#6600ff)',border:'none',borderRadius:4,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT }}>
          BEGIN XAI ANALYSIS →
        </button>
      </div>
    </div>
  );
}

const DIFF = {
  easy:   { sampleCount:12, triggerTypes:3, xaiUses:Infinity, saliencyStrength:0.85, noiseLevel:0.1 },
  medium: { sampleCount:20, triggerTypes:4, xaiUses:8, saliencyStrength:0.6, noiseLevel:0.25 },
  hard:   { sampleCount:28, triggerTypes:5, xaiUses:5, saliencyStrength:0.4, noiseLevel:0.45 },
};
const DC = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };

// Trigger patterns: distinct pixel patterns that serve as backdoor triggers
const TRIGGER_PATTERNS = [
  { name:'Checkerboard', color:'#ff00ff', desc:'2×2 alternating pixels' },
  { name:'Corner Cross', color:'#ff8800', desc:'X mark in corner' },
  { name:'Border Strip', color:'#0088ff', desc:'Edge highlight band' },
  { name:'Center Dot', color:'#ff0044', desc:'Bright center pixel cluster' },
  { name:'Diagonal', color:'#00ffaa', desc:'Diagonal line artifact' },
];

// Generate a sample canvas image (28x28 simulated)
function generateSampleCanvas(ctx, x, y, w, h, isBackdoor, triggerPattern, saliencyMode, noiseLevel, saliencyStrength, time) {
  const scale = w / 28;
  // Base image: random pixel texture (simulating MNIST-like data)
  for (let py = 0; py < 28; py++) {
    for (let px = 0; px < 28; px++) {
      const base = Math.floor(Math.random() * 80 + 30);
      const noiseAdd = Math.random() * noiseLevel * 100;
      ctx.fillStyle = `rgb(${base+noiseAdd},${base+noiseAdd},${base+noiseAdd})`;
      ctx.fillRect(x + px * scale, y + py * scale, scale, scale);
    }
  }

  // Draw "digit-like" structure
  const cx = x + w/2, cy = y + h/2;
  ctx.strokeStyle = `rgba(200,200,220,0.7)`;
  ctx.lineWidth = scale;
  ctx.beginPath();
  ctx.arc(cx, cy, w*0.28, 0, Math.PI * 2);
  ctx.stroke();

  // Add trigger if backdoored
  if (isBackdoor) {
    const tp = triggerPattern;
    ctx.globalAlpha = 0.8;
    switch (tp.name) {
      case 'Checkerboard':
        for (let ti = 0; ti < 4; ti++) for (let tj = 0; tj < 4; tj++) {
          if ((ti+tj)%2===0) {
            ctx.fillStyle = tp.color;
            ctx.fillRect(x + (24+ti%2)*scale, y + (24+tj%2)*scale, scale, scale);
          }
        }
        break;
      case 'Corner Cross':
        ctx.fillStyle = tp.color;
        ctx.fillRect(x + 1*scale, y + 1*scale, 3*scale, scale);
        ctx.fillRect(x + 2*scale, y + 0, scale, 3*scale);
        break;
      case 'Border Strip':
        ctx.fillStyle = tp.color;
        ctx.fillRect(x, y, w, scale);
        break;
      case 'Center Dot':
        ctx.fillStyle = tp.color;
        ctx.beginPath();
        ctx.arc(cx, cy, scale*1.5, 0, Math.PI*2);
        ctx.fill();
        break;
      case 'Diagonal':
        ctx.strokeStyle = tp.color;
        ctx.lineWidth = scale;
        ctx.beginPath();
        ctx.moveTo(x, y+h);
        ctx.lineTo(x+w, y);
        ctx.stroke();
        break;
    }
    ctx.globalAlpha = 1;
  }

  // XAI overlay
  if (saliencyMode !== 'standard') {
    if (isBackdoor) {
      // Strong attention on trigger region
      const strength = saliencyStrength;
      // Trigger region gets hot
      switch (triggerPattern.name) {
        case 'Checkerboard':
          ctx.fillStyle = `rgba(255,0,0,${strength * 0.7})`;
          ctx.fillRect(x + 24*scale, y + 24*scale, 4*scale, 4*scale);
          break;
        case 'Corner Cross':
          ctx.fillStyle = `rgba(255,0,0,${strength * 0.7})`;
          ctx.fillRect(x, y, 4*scale, 4*scale);
          break;
        case 'Border Strip':
          ctx.fillStyle = `rgba(255,0,0,${strength * 0.7})`;
          ctx.fillRect(x, y, w, scale*2);
          break;
        case 'Center Dot':
          ctx.fillStyle = `rgba(255,0,0,${strength * 0.7})`;
          ctx.beginPath();
          ctx.arc(cx, cy, scale*3, 0, Math.PI*2);
          ctx.fill();
          break;
        case 'Diagonal':
          ctx.strokeStyle = `rgba(255,0,0,${strength * 0.7})`;
          ctx.lineWidth = scale*2;
          ctx.beginPath();
          ctx.moveTo(x, y+h);
          ctx.lineTo(x+w, y);
          ctx.stroke();
          break;
      }
      // Diffuse background attention (weaker)
      ctx.fillStyle = `rgba(255,100,0,${0.12})`;
      ctx.fillRect(x, y, w, h);
    } else {
      // Normal: distributed attention
      for (let r = 0; r < 5; r++) {
        const ax = x + Math.random()*w, ay = y + Math.random()*h;
        const alpha = 0.08 + Math.random() * 0.12;
        ctx.fillStyle = `rgba(0,150,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(ax, ay, scale*3, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }
}

function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [saliencyMode, setSaliencyMode] = useState('standard');
  const [xaiUsesLeft, setXaiUsesLeft] = useState(D.xaiUses === Infinity ? 999 : D.xaiUses);
  const [selectedSample, setSelectedSample] = useState(null);
  const [markedSamples, setMarkedSamples] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(500);
  const [status, setStatus] = useState('playing');
  const [msg, setMsg] = useState('Select a sample to inspect it. Use XAI overlay to analyze saliency patterns.');
  const [triggerFound, setTriggerFound] = useState(false);
  const [identifiedTrigger, setIdentifiedTrigger] = useState(null);

  // Generate samples once
  const [samples] = useState(() => {
    const triggerType = TRIGGER_PATTERNS[Math.floor(Math.random() * D.triggerTypes)];
    const backdoorCount = Math.floor(D.sampleCount * 0.35);
    const samples = Array.from({ length: D.sampleCount }, (_, i) => ({
      id: i,
      isBackdoor: i < backdoorCount,
      triggerPattern: triggerType,
    }));
    // Shuffle
    for (let i = samples.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [samples[i], samples[j]] = [samples[j], samples[i]];
    }
    return { samples, triggerType };
  });

  const saliencyRef = useRef(saliencyMode);
  const selectedRef = useRef(selectedSample);
  const markedRef = useRef(markedSamples);
  useEffect(() => { saliencyRef.current = saliencyMode; }, [saliencyMode]);
  useEffect(() => { selectedRef.current = selectedSample; }, [selectedSample]);
  useEffect(() => { markedRef.current = markedSamples; }, [markedSamples]);

  const getSampleRect = useCallback((idx, W, H) => {
    const cols = Math.floor(Math.sqrt(D.sampleCount * 1.5));
    const rows = Math.ceil(D.sampleCount / cols);
    const padX = 80, padY = 60;
    const availW = W - padX * 2, availH = H - padY * 2;
    const cellW = availW / cols, cellH = availH / rows;
    const size = Math.min(cellW, cellH) * 0.78;
    const col = idx % cols, row = Math.floor(idx / cols);
    const cx = padX + col * cellW + cellW/2;
    const cy = padY + row * cellH + cellH/2;
    return { x: cx - size/2, y: cy - size/2, w: size, h: size };
  }, [D.sampleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onClick = (e) => {
      if (status !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      const W = canvas.width, H = canvas.height;
      for (let i = 0; i < samples.samples.length; i++) {
        const r = getSampleRect(i, W, H);
        if (mx >= r.x && mx <= r.x+r.w && my >= r.y && my <= r.y+r.h) {
          setSelectedSample(i);
          return;
        }
      }
    };
    canvas.addEventListener('click', onClick);

    let frame = 0;
    const loop = (now) => {
      frame++;
      if (frame % 2 !== 0) { animRef.current = requestAnimationFrame(loop); return; } // 30fps
      const t = now * 0.001;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#020210';
      ctx.fillRect(0,0,W,H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,50,120,0.15)';
      ctx.lineWidth = 0.5;
      for (let gx=0;gx<W;gx+=40) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
      for (let gy=0;gy<H;gy+=40) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

      const mode = saliencyRef.current;
      const sel = selectedRef.current;
      const marked = markedRef.current;

      samples.samples.forEach((sample, idx) => {
        const r = getSampleRect(idx, W, H);
        const isSelected = sel === idx;
        const isMarked = marked.has(idx);

        // Save/restore for sample rendering
        ctx.save();
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.clip();

        // Random seed per sample
        const seedRng = (seed) => {
          let s = seed * 9301 + 49297;
          return { random: () => { s = (s * 9301 + 49297) % 233280; return s / 233280; } };
        };
        const rng = seedRng(sample.id * 137 + 42);
        const origRandom = Math.random;
        Math.random = rng.random;

        generateSampleCanvas(ctx, r.x, r.y, r.w, r.h, isSelected && mode !== 'standard' ? sample.isBackdoor : (mode !== 'standard' && sample.isBackdoor), sample.triggerPattern, isSelected ? mode : 'standard', D.noiseLevel, D.saliencyStrength, t);

        Math.random = origRandom;
        ctx.restore();

        // Sample border
        const borderColor = isMarked ? '#ff4444' : isSelected ? '#00ffff' : 'rgba(0,100,200,0.3)';
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isSelected || isMarked ? 2.5 : 1;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        // Mark indicator
        if (isMarked) {
          ctx.fillStyle = 'rgba(255,50,50,0.15)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
          ctx.fillStyle = '#ff4444';
          ctx.font = `bold ${r.w*0.25}px ${FONT}`;
          ctx.textAlign = 'center';
          ctx.fillText('⚑', r.x + r.w/2, r.y + r.h*0.7);
        }

        // Selected indicator
        if (isSelected) {
          ctx.fillStyle = 'rgba(0,200,255,0.12)';
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }

        // Sample label
        ctx.fillStyle = '#334';
        ctx.font = `8px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(`#${idx+1}`, r.x + r.w/2, r.y + r.h + 12);
      });

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, [samples, D, getSampleRect, status]);

  const toggleMark = () => {
    if (selectedSample === null) return;
    setMarkedSamples(prev => {
      const next = new Set(prev);
      if (next.has(selectedSample)) next.delete(selectedSample);
      else next.add(selectedSample);
      return next;
    });
  };

  const activateXAI = (mode) => {
    if (D.xaiUses !== Infinity && xaiUsesLeft <= 0) { setMsg('⚠️ No XAI uses remaining!'); return; }
    setSaliencyMode(mode);
    if (mode !== 'standard' && D.xaiUses !== Infinity) setXaiUsesLeft(u => u - 1);
    setMsg(`🔬 ${mode.toUpperCase()} overlay active — analyze attention patterns carefully.`);
  };

  const identifyTrigger = (trigger) => {
    setIdentifiedTrigger(trigger);
    if (trigger.name === samples.triggerType.name) {
      setTriggerFound(true);
      setScore(s => s + 300);
      setMsg(`✅ TRIGGER IDENTIFIED: "${trigger.name}" — Now mark all backdoored samples!`);
    } else {
      setScore(s => Math.max(0, s - 100));
      setMsg(`❌ Wrong trigger type. Look more carefully at the saliency patterns. −100 pts`);
    }
  };

  const submitFindings = () => {
    const { samples: samps } = samples;
    let tp = 0, fp = 0, fn = 0;
    samps.forEach((s, i) => {
      const marked = markedSamples.has(i);
      if (s.isBackdoor && marked) tp++;
      else if (!s.isBackdoor && marked) fp++;
      else if (s.isBackdoor && !marked) fn++;
    });
    const precision = tp / (tp + fp + 0.001);
    const recall = tp / (tp + fn + 0.001);
    const gained = tp * 150 - fp * 100 - fn * 50 + (triggerFound ? 300 : 0);
    setScore(s => Math.max(0, s + gained));
    setSubmitted(true);
    setStatus(precision > 0.6 && recall > 0.6 ? 'won' : 'lost');
    setMsg(`Results: TP=${tp}, FP=${fp}, FN=${fn} | Precision=${(precision*100).toFixed(0)}% Recall=${(recall*100).toFixed(0)}%`);
  };

  const dc = DC[difficulty];
  const modes = [
    { key:'standard', name:'Standard', color:'#00ffff', cost:'free' },
    { key:'saliency', name:'Saliency Map', color:'#aa00ff', cost: D.xaiUses === Infinity ? 'free' : '1 use' },
    { key:'gradcam', name:'GradCAM', color:'#ff4444', cost: D.xaiUses === Infinity ? 'free' : '1 use' },
    { key:'shap', name:'SHAP', color:'#ffcc00', cost: D.xaiUses === Infinity ? 'free' : '1 use' },
  ];

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,fontFamily:FONT,display:'flex',flexDirection:'column' }}>
      {/* Canvas */}
      <div style={{ position:'absolute',inset:0 }}>
        <canvas ref={canvasRef} style={{ width:'100%',height:'100%',display:'block',cursor:'pointer' }} />
      </div>

      {/* Top HUD */}
      <div style={{ position:'absolute',top:0,left:0,right:0,background:'rgba(2,2,16,0.96)',borderBottom:'1px solid rgba(0,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 20px',zIndex:10 }}>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <span style={{ color:'#00ffff',fontSize:13,fontWeight:'bold',letterSpacing:2 }}>LEVEL 4 // BACKDOOR TRIGGER DISCOVERY</span>
          <span style={{ fontSize:10,color:dc,border:`1px solid ${dc}44`,borderRadius:3,padding:'2px 7px' }}>{difficulty.toUpperCase()}</span>
        </div>
        <div style={{ display:'flex',gap:20,alignItems:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:9,color:'#445',letterSpacing:2 }}>SCORE</div>
            <div style={{ fontSize:18,color:'#ffff00',fontWeight:'bold' }}>{score}</div>
          </div>
          {D.xaiUses !== Infinity && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:9,color:'#445',letterSpacing:2 }}>XAI USES</div>
              <div style={{ fontSize:18,color:xaiUsesLeft<=2?'#ff4444':'#00ffff',fontWeight:'bold' }}>{xaiUsesLeft}</div>
            </div>
          )}
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:9,color:'#445',letterSpacing:2 }}>MARKED</div>
            <div style={{ fontSize:18,color:'#ff4444',fontWeight:'bold' }}>{markedSamples.size}</div>
          </div>
          <button onClick={onExit} style={{ padding:'6px 14px',background:'rgba(255,50,50,0.1)',border:'1px solid rgba(255,50,50,0.3)',borderRadius:3,color:'#ff6688',cursor:'pointer',fontSize:10,fontFamily:FONT }}>ABORT</button>
        </div>
      </div>

      {/* Left panel */}
      <div style={{ position:'absolute',top:54,left:0,width:220,background:'rgba(2,2,16,0.95)',borderRight:'1px solid rgba(0,255,255,0.12)',padding:14,zIndex:10,display:'flex',flexDirection:'column',gap:12,height:'calc(100% - 54px)' }}>
        <div>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:8 }}>XAI ANALYSIS MODE</div>
          {modes.map(m => (
            <div key={m.key} onClick={() => activateXAI(m.key)} style={{ padding:'9px 10px',marginBottom:5,borderRadius:3,cursor:'pointer',border:`1px solid ${saliencyMode===m.key?m.color:'#222'}`,background:saliencyMode===m.key?`${m.color}18`:'rgba(255,255,255,0.02)',transition:'all 0.15s' }}>
              <div style={{ display:'flex',justifyContent:'space-between' }}>
                <span style={{ color:saliencyMode===m.key?m.color:'#666',fontSize:11,fontWeight:'bold' }}>{m.name}</span>
                <span style={{ fontSize:9,color:'#445' }}>{m.cost}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:8 }}>IDENTIFY TRIGGER</div>
          <div style={{ fontSize:10,color:'#556',marginBottom:8 }}>What trigger pattern do you see?</div>
          {TRIGGER_PATTERNS.slice(0, D.triggerTypes).map(tp => (
            <div key={tp.name} onClick={() => !triggerFound && identifyTrigger(tp)} style={{ padding:'8px 10px',marginBottom:4,borderRadius:3,cursor:triggerFound?'default':'pointer',border:`1px solid ${triggerFound&&tp.name===samples.triggerType.name?'#00ff88':identifiedTrigger?.name===tp.name?'#ff4444':'#222'}`,background:triggerFound&&tp.name===samples.triggerType.name?'rgba(0,255,136,0.1)':identifiedTrigger?.name===tp.name?'rgba(255,50,50,0.08)':'rgba(255,255,255,0.02)' }}>
              <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                <div style={{ width:8,height:8,background:tp.color,borderRadius:1 }} />
                <span style={{ fontSize:10,color:triggerFound&&tp.name===samples.triggerType.name?'#00ff88':'#aaa' }}>{tp.name}</span>
              </div>
              <div style={{ fontSize:9,color:'#445',marginTop:2 }}>{tp.desc}</div>
            </div>
          ))}
        </div>

        {triggerFound && (
          <div style={{ padding:10,background:'rgba(0,255,136,0.08)',border:'1px solid rgba(0,255,136,0.3)',borderRadius:4,fontSize:11,color:'#00ff88' }}>
            ✅ Trigger: {samples.triggerType.name}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div style={{ position:'absolute',top:54,right:0,width:220,background:'rgba(2,2,16,0.95)',borderLeft:'1px solid rgba(0,255,255,0.12)',padding:14,zIndex:10,display:'flex',flexDirection:'column',gap:12,height:'calc(100% - 54px)' }}>
        <div>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:6 }}>CURRENT SAMPLE</div>
          {selectedSample !== null ? (
            <div style={{ padding:10,background:'rgba(0,255,255,0.05)',border:'1px solid rgba(0,255,255,0.15)',borderRadius:4 }}>
              <div style={{ fontSize:11,color:'#00ffff',marginBottom:4 }}>Sample #{selectedSample+1}</div>
              <div style={{ fontSize:10,color:'#556',marginBottom:8 }}>
                Mode: <span style={{ color:'#00ffff' }}>{saliencyMode.toUpperCase()}</span>
              </div>
              <button onClick={toggleMark} style={{ width:'100%',padding:'8px',borderRadius:3,fontSize:11,fontWeight:'bold',background:markedSamples.has(selectedSample)?'rgba(255,50,50,0.2)':'rgba(255,100,50,0.1)',border:`1px solid ${markedSamples.has(selectedSample)?'#ff4444':'rgba(255,100,50,0.4)'}`,color:markedSamples.has(selectedSample)?'#ff4444':'#ff9944',cursor:'pointer',fontFamily:FONT }}>
                {markedSamples.has(selectedSample)?'⚑ UNMARK':'⚑ MARK AS BACKDOOR'}
              </button>
            </div>
          ) : (
            <div style={{ fontSize:11,color:'#334',padding:10 }}>Click a sample to inspect</div>
          )}
        </div>

        <div>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:6 }}>ANALYSIS NOTES</div>
          <div style={{ padding:8,background:'rgba(0,255,255,0.03)',borderRadius:3,border:'1px solid rgba(0,255,255,0.08)',fontSize:10,color:'#7799aa',lineHeight:1.7,minHeight:60 }}>{msg}</div>
        </div>

        <div>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:6 }}>STATS</div>
          <div style={{ display:'grid',gap:4 }}>
            {[
              ['Total Samples', samples.samples.length],
              ['Marked Backdoor', markedSamples.size],
              ['Trigger Found', triggerFound?'YES':'NO'],
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'6px 8px',background:'rgba(255,255,255,0.02)',borderRadius:3,fontSize:10 }}>
                <span style={{ color:'#556' }}>{l}</span>
                <span style={{ color:'#aaa',fontWeight:'bold' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:'auto' }}>
          <button onClick={submitFindings} disabled={markedSamples.size === 0 || submitted} style={{ width:'100%',padding:'12px 8px',borderRadius:4,fontSize:12,fontWeight:'bold',background:markedSamples.size>0&&!submitted?'linear-gradient(135deg,#0088cc,#6600ff)':'#1a1a2e',border:'none',color:markedSamples.size>0&&!submitted?'white':'#444',cursor:markedSamples.size>0&&!submitted?'pointer':'not-allowed',fontFamily:FONT }}>
            🎯 SUBMIT FINDINGS
          </button>
        </div>
      </div>

      {status==='won' && (
        <div style={{ ...OVR,background:'rgba(0,8,20,0.97)' }}>
          <div style={{ fontSize:10,color:'#00ffff',letterSpacing:5,marginBottom:10 }}>MISSION COMPLETE</div>
          <h1 style={{ color:'#00ffff',fontSize:44,marginBottom:12,margin:'0 0 10px',textShadow:'0 0 20px #00ffff66' }}>BACKDOORS NEUTRALIZED</h1>
          <p style={{ color:'#7799aa',fontSize:16,margin:'0 0 20px' }}>Trigger pattern identified and all backdoors flagged</p>
          <p style={{ color:'#ffff00',fontSize:18,margin:'0 0 22px' }}>Final Score: {score}</p>
          <button onClick={onExit} style={BTN}>Continue →</button>
        </div>
      )}
      {status==='lost' && (
        <div style={{ ...OVR,background:'rgba(10,0,15,0.97)' }}>
          <div style={{ fontSize:10,color:'#ff4444',letterSpacing:5,marginBottom:10 }}>MISSION FAILED</div>
          <h1 style={{ color:'#ff3333',fontSize:44,marginBottom:12,margin:'0 0 10px' }}>ANALYSIS INCOMPLETE</h1>
          <p style={{ color:'#778',fontSize:16,margin:'0 0 10px' }}>{msg}</p>
          <p style={{ color:'#ff7777',fontSize:14,margin:'0 0 22px' }}>Score: {score} | Trigger: {samples.triggerType.name}</p>
          <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry Analysis</button>
        </div>
      )}
    </div>
  );
}

export default function Level4({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase === 'instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}