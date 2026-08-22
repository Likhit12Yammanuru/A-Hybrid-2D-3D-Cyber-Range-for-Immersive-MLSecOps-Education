import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const LEVELS = [
  { id: 1, badge: 'LEVEL 1', name: 'CYBER PERIMETER',   glow: '#003388', threats: ['phishing','malware','intrusion','phishing','malware','intrusion','intrusion'], speed: 0.9,  spawnRate: 180, goal: 12 },
  { id: 2, badge: 'LEVEL 2', name: 'AI ATTACK SURFACE', glow: '#6600cc', threats: ['adversarial','poison','model_extract','adversarial','poison','adversarial'],    speed: 1.2,  spawnRate: 140, goal: 12 },
  { id: 3, badge: 'LEVEL 3', name: 'MLOPS PIPELINE',    glow: '#00aa33', threats: ['drift','pipeline_fail','skew','drift','pipeline_fail','drift'],                 speed: 1.6,  spawnRate: 100, goal: 12 },
];

const TDATA = {
  phishing:     { label: 'PHISHING',      color: '#ff6138', correctTool: 0, points: 110, title: 'Phishing Blocked!',          concept: 'SPF/DKIM · URL Sandboxing · MFA',              body: 'Phishing uses fake emails to steal credentials. Defense: SPF/DKIM/DMARC authentication, URL sandboxing, and MFA ensure credentials alone are insufficient.',              wrong: 'Use Firewall [1] — filters malicious emails at the network gateway.' },
  malware:      { label: 'MALWARE',       color: '#ff2d59', correctTool: 1, points: 125, title: 'Malware Quarantined!',        concept: 'Behavioral Analysis · Sandboxing · EDR',       body: 'Malware includes viruses, ransomware, and trojans. Behavioral analysis catches zero-days by observing what code DOES in an isolated environment.',                       wrong: 'Use Scanner [2] — analyzes malware signatures and behavior patterns.' },
  intrusion:    { label: 'INTRUSION',     color: '#ff9400', correctTool: 0, points: 115, title: 'Intrusion Blocked!',          concept: 'Stateful Firewall · IDS/IPS · Zero Trust',     body: 'Network intrusions exploit open ports or weak credentials. Zero Trust: "never trust, always verify" — every connection is authenticated regardless of origin.',         wrong: 'Use Firewall [1] — blocks unauthorized network access and suspicious scans.' },
  adversarial:  { label: 'ADVERSARIAL',   color: '#bf38ff', correctTool: 1, points: 140, title: 'Adversarial Input Rejected!', concept: 'Adversarial Training · Input Preprocessing',   body: 'Adversarial examples add imperceptible noise to fool ML models. Defense: adversarial training, input smoothing/quantization, and certified robustness via randomized smoothing.', wrong: 'Use Scanner [2] — validates and sanitizes model inputs before inference.' },
  poison:       { label: 'DATA POISON',   color: '#2ed3ff', correctTool: 3, points: 145, title: 'Poisoned Sample Removed!',    concept: 'Data Provenance · Anomaly Detection',          body: 'Data poisoning injects mislabeled samples to embed hidden backdoors. Defense: data provenance tracking and distribution anomaly detection on training sets.',            wrong: 'Use Patch [4] — removes poisoned samples and cleans the training dataset.' },
  model_extract:{ label: 'MODEL THEFT',   color: '#ffda00', correctTool: 0, points: 155, title: 'Model Extraction Stopped!',   concept: 'API Security · Rate Limiting · Watermarking',  body: 'Model extraction sends thousands of queries to reconstruct the decision boundary. Defense: API rate limiting, output perturbation, and query pattern monitoring.',      wrong: 'Use Firewall [1] — enforces API rate limits and blocks extraction queries.' },
  drift:        { label: 'MODEL DRIFT',   color: '#ff8038', correctTool: 2, points: 135, title: 'Drift Corrected!',            concept: 'Concept Drift · PSI Monitoring · Retraining',  body: 'Concept drift occurs when production data shifts from training data, silently degrading accuracy. Fix: monitor PSI and KL-divergence, trigger retraining pipelines.',  wrong: 'Use Retrain [3] — retrains the model on fresh data to correct drift.' },
  pipeline_fail:{ label: 'PIPE FAIL',     color: '#ff2d88', correctTool: 3, points: 125, title: 'Pipeline Restored!',          concept: 'Data Validation · CI/CD for ML',               body: 'ML pipelines fail silently from schema changes or missing features. Fix: schema validation at each stage with DAG orchestrators (Airflow, Prefect) and SLA alerts.',  wrong: 'Use Patch [4] — repairs broken pipeline stages and fixes schema errors.' },
  skew:         { label: 'TRAIN/SERVE SKEW', color: '#38ff8c', correctTool: 1, points: 135, title: 'Skew Detected & Fixed!',  concept: 'Feature Store · Training-Serving Consistency', body: 'Train/serve skew: features differ between training and serving. Fix: centralized Feature Store (Feast, Tecton) so both share exact same computation logic.',             wrong: 'Use Scanner [2] — detects feature distribution mismatches between training and serving.' },
};

const TOOLS = [
  { name: 'Firewall', icon: '🛡️', desc: 'Blocks network threats & API abuse',   key: '1', color: '#4488ff' },
  { name: 'Scanner',  icon: '🔍', desc: 'Detects & validates inputs/anomalies', key: '2', color: '#aa44ff' },
  { name: 'Retrain',  icon: '🔄', desc: 'Fixes model drift & retrains',         key: '3', color: '#44ff88' },
  { name: 'Patch',    icon: '🩺', desc: 'Repairs pipelines & data',             key: '4', color: '#ffcc44' },
];

// ─── Instruction Screen ───────────────────────────────────────────────────────
function InstructionScreen({ onStart }) {
  const S = { fontFamily: '"Share Tech Mono", monospace' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg,#010208,#030318)', ...S, color: '#fff', zIndex: 100, overflowY: 'auto', padding: '16px' }}>
      <div style={{ maxWidth: 600, width: '92%', background: 'rgba(0,255,136,0.02)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 6, padding: 32, margin: '20px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: '#00ff88', opacity: 0.4, marginBottom: 10 }}>ML-SEC TRAINING SYSTEM // v5.0</div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#00ff88', letterSpacing: 4, textShadow: '0 0 20px rgba(0,255,136,0.4)', ...S }}>CYBEROPS DEFENDER</h1>
          <div style={{ marginTop: 8, fontSize: 11, color: '#ff9500', letterSpacing: 4 }}>LEVEL 5 · 3-STAGE AI SECURITY DEFENSE</div>
        </div>

        <div style={{ background: 'rgba(0,100,200,0.07)', border: '1px solid rgba(0,100,200,0.2)', borderRadius: 4, padding: '14px 18px', marginBottom: 18 }}>
          <div style={{ color: '#4488ff', fontSize: 10, letterSpacing: 3, marginBottom: 8, fontWeight: 'bold' }}>WHY THIS MATTERS</div>
          <p style={{ margin: 0, fontSize: 11, color: '#7799aa', lineHeight: 1.85 }}>
            Real AI systems face layered attacks — from classic cyber threats at the perimeter, to adversarial ML attacks on models, to silent MLOps pipeline failures. Pick the <strong style={{ color: '#00ff88' }}>correct countermeasure</strong> for each threat type. Wrong tool = threat speeds up.
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ color: '#445', fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>3 ESCALATING STAGES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {LEVELS.map(l => (
              <div key={l.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: 10 }}>
                <div style={{ color: '#00ff88', fontSize: 9, letterSpacing: 2, marginBottom: 5 }}>{l.badge}</div>
                <div style={{ color: '#ddd', fontWeight: 'bold', fontSize: 11 }}>{l.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ color: '#445', fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>YOUR TOOLS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TOOLS.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.12)', borderRadius: 4, padding: '9px 12px' }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <div>
                  <div style={{ color: t.color, fontWeight: 'bold', fontSize: 11 }}>[{t.key}] {t.name}</div>
                  <div style={{ color: '#445', fontSize: 10, marginTop: 2 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,150,0,0.05)', border: '1px solid rgba(255,150,0,0.2)', borderRadius: 4, padding: '10px 14px', marginBottom: 22, fontSize: 11, color: '#aa7700', lineHeight: 1.7 }}>
          ⚡ Threats fly toward the central core. Select a tool (keys 1–4), then <strong style={{ color: '#ff9500' }}>click a threat</strong> to deploy it. Wrong tool = −8 HP + threat speeds up. Core breach = −22 HP. 3 lives. 12 kills per level to advance.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 10, color: '#445', lineHeight: 1.9 }}>
            1-4 — Select Tool &nbsp;|&nbsp; Click threat — Deploy
          </div>
          <button onClick={onStart} style={{ padding: '12px 38px', fontSize: 13, fontWeight: 'bold', background: 'linear-gradient(135deg,#00ff88,#00c878)', border: 'none', borderRadius: 4, color: '#001a0a', cursor: 'pointer', letterSpacing: 2, ...S }}>
            START MISSION →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Education Popup ──────────────────────────────────────────────────────────
function Popup({ threatType, success, onClose }) {
  if (!threatType) return null;
  const td = TDATA[threatType];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}>
      <div style={{ maxWidth: 480, width: '90%', background: success ? 'rgba(0,25,12,0.98)' : 'rgba(20,0,5,0.98)', border: `1px solid ${success ? 'rgba(0,255,136,0.4)' : 'rgba(255,50,80,0.4)'}`, borderRadius: 6, padding: 26, fontFamily: '"Share Tech Mono", monospace' }}>
        <div style={{ textAlign: 'center', fontSize: 28, marginBottom: 8 }}>{success ? '✅' : '⚠️'}</div>
        <h2 style={{ margin: '0 0 6px', color: success ? '#00ff88' : '#ff3366', fontSize: 16, textAlign: 'center', letterSpacing: 1, fontFamily: '"Share Tech Mono", monospace' }}>
          {success ? td.title : 'THREAT BREACHED CORE'}
        </h2>
        <div style={{ textAlign: 'center', fontSize: 10, color: success ? '#4488aa' : '#ff7799', letterSpacing: 2, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {success ? td.concept : '⚠ SYSTEM INTEGRITY DAMAGED'}
        </div>
        <p style={{ margin: '0 0 18px', fontSize: 11, color: '#88aaaa', lineHeight: 1.85 }}>{td.body}</p>
        {!success && <p style={{ margin: '0 0 14px', fontSize: 11, color: '#ff9944', lineHeight: 1.7 }}>💡 {td.wrong}</p>}
        <button onClick={onClose} style={{ width: '100%', padding: 11, background: success ? 'linear-gradient(135deg,#00aa55,#007733)' : 'linear-gradient(135deg,#aa2244,#771133)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 12, letterSpacing: 2 }}>
          CONTINUE →
        </button>
      </div>
    </div>
  );
}

// ─── Main Game ────────────────────────────────────────────────────────────────
function Game({ onExit }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    score: 0, health: 100, lives: 3, lvl: 0, tool: 0,
    threats: [], particles: [], killed: 0,
    popupOpen: false, running: true,
    flashAlpha: 0, flashOk: false,
    frame: 0, spawnTick: 0,
  });
  const rafRef = useRef(null);

  const [ui, setUi] = useState({ score: 0, health: 100, lives: 3, lvlBadge: 'LEVEL 1', killed: 0, tool: 0, goal: 12 });
  const [popup, setPopup] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [logLines, setLogLines] = useState([]);

  const addLog = useCallback((msg, color) => {
    setLogLines(prev => [{ msg, color, id: Math.random() }, ...prev.slice(0, 5)]);
  }, []);

  const syncUi = useCallback(() => {
    const S = stateRef.current;
    setUi({
      score: S.score,
      health: S.health,
      lives: S.lives,
      lvlBadge: LEVELS[S.lvl]?.badge || '',
      killed: S.killed,
      tool: S.tool,
      goal: LEVELS[S.lvl]?.goal || 12,
    });
  }, []);

  const spawnParticles = (x, y, ok, col) => {
    const S = stateRef.current;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2, spd = 1.5 + Math.random() * 2.5;
      S.particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1, col: ok ? col : '#ff4400' });
    }
  };

  const doLoseLife = useCallback(() => {
    const S = stateRef.current;
    S.lives--;
    if (S.lives > 0) {
      S.health = 60;
      addLog(`💔 Life lost! ${S.lives} remaining`, '#ff6666');
      syncUi();
    } else {
      S.health = 0; S.running = false;
      syncUi();
      setOverlay({ type: 'gameOver' });
    }
  }, [addLog, syncUi]);

  const doNextLevel = useCallback(() => {
    const S = stateRef.current;
    S.lvl++;
    S.health = Math.min(100, S.health + 30);
    S.threats = []; S.killed = 0; S.spawnTick = 0;
    S.running = true;
    setOverlay(null);
    syncUi();
  }, [syncUi]);

  const doRestart = useCallback(() => {
    const S = stateRef.current;
    Object.assign(S, { score: 0, health: 100, lives: 3, lvl: 0, tool: 0, threats: [], particles: [], killed: 0, popupOpen: false, running: true, flashAlpha: 0, frame: 0, spawnTick: 0 });
    setOverlay(null);
    setPopup(null);
    syncUi();
  }, [syncUi]);

  // ─── Canvas Loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnThreat = () => {
      const S = stateRef.current;
      const lvl = LEVELS[S.lvl];
      const type = lvl.threats[Math.floor(Math.random() * lvl.threats.length)];
      const td = TDATA[type];
      const W = canvas.width, H = canvas.height;
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = 40 + Math.random() * (W - 80); y = -24; }
      else if (side === 1) { x = 40 + Math.random() * (W - 80); y = H + 24; }
      else if (side === 2) { x = -24; y = 40 + Math.random() * (H - 80); }
      else { x = W + 24; y = 40 + Math.random() * (H - 80); }
      const cx = W / 2, cy = H / 2;
      const dx = cx - x, dy = cy - y, len = Math.sqrt(dx * dx + dy * dy);
      const spd = lvl.speed * (0.85 + Math.random() * 0.3);
      S.threats.push({ type, x, y, vx: (dx / len) * spd, vy: (dy / len) * spd, r: 20, wobble: Math.random() * Math.PI * 2, spin: 0, spinRate: 0.04 + Math.random() * 0.04, age: 0, col: td.color, label: td.label, speed: spd });
    };

    const drawGrid = (frame) => {
      const W = canvas.width, H = canvas.height;
      const lvl = LEVELS[stateRef.current.lvl] || LEVELS[0];
      ctx.save();
      ctx.strokeStyle = lvl.glow + '22';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < W; i += 48) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let i = 0; i < H; i += 48) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
      ctx.restore();
    };

    const drawCore = (frame) => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const pulse = 1 + Math.sin(frame * 0.04) * 0.07;
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36 * pulse);
      grad.addColorStop(0, 'rgba(0,180,255,0.75)');
      grad.addColorStop(1, 'rgba(0,80,180,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 36 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      const lvl = LEVELS[stateRef.current.lvl] || LEVELS[0];
      [52, 84, 118].forEach((r, i) => {
        ctx.beginPath(); ctx.arc(cx, cy, r + Math.sin(frame * 0.02 + i) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = lvl.glow + ['50', '30', '18'][i];
        ctx.lineWidth = i === 0 ? 2 : 1; ctx.stroke();
      });
      ctx.restore();
    };

    const drawThreat = (t, frame) => {
      ctx.save();
      ctx.translate(t.x, t.y);
      const pulse = 1 + Math.sin(t.age * 0.05) * 0.08;
      ctx.scale(pulse, pulse);
      ctx.strokeStyle = t.col;
      ctx.lineWidth = 2;
      ctx.shadowColor = t.col;
      ctx.shadowBlur = 12;
      const r = t.r;
      const ct = TDATA[t.type].correctTool;
      if (ct === 0) {
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        ctx.save(); ctx.rotate(t.spin);
        ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.55); ctx.lineTo(r * 0.55, -r * 0.55); ctx.lineTo(r * 0.55, r * 0.55); ctx.lineTo(-r * 0.55, r * 0.55); ctx.closePath(); ctx.stroke();
        ctx.restore();
      } else if (ct === 1) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + t.spin; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.closePath(); ctx.stroke();
      } else if (ct === 2) {
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.stroke();
        ctx.save(); ctx.rotate(t.spin);
        ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
        ctx.restore();
      } else {
        ctx.save(); ctx.rotate(t.spin);
        ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, r * 0.55); ctx.lineTo(-r * 0.7, r * 0.55); ctx.closePath(); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = t.col + '28'; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = 'bold 9px "Share Tech Mono", monospace';
      ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
      ctx.fillText(t.label, 0, r + 15);
      ctx.restore();
    };

    const drawCrosshair = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      ctx.save(); ctx.strokeStyle = 'rgba(0,255,136,0.7)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + 10); ctx.lineTo(cx, cy + 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 10, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 20, cy); ctx.stroke();
      ctx.restore();
    };

    const loop = () => {
      const S = stateRef.current;
      const W = canvas.width, H = canvas.height;
      S.frame++;

      ctx.fillStyle = 'rgba(1,2,8,0.88)';
      ctx.fillRect(0, 0, W, H);
      drawGrid(S.frame);
      drawCore(S.frame);

      if (S.running && !S.popupOpen) {
        const lvl = LEVELS[S.lvl];
        S.spawnTick++;
        if (S.spawnTick >= lvl.spawnRate && S.threats.length < 14) {
          S.spawnTick = 0;
          spawnThreat();
          if (Math.random() < 0.28) spawnThreat();
        }

        const cx = W / 2, cy = H / 2;
        for (let i = S.threats.length - 1; i >= 0; i--) {
          const t = S.threats[i];
          t.x += t.vx; t.y += t.vy; t.age++;
          t.spin += t.spinRate;
          t.wobble += 0.03; t.y += Math.sin(t.wobble) * 0.35;
          const dx = t.x - cx, dy = t.y - cy, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 38) {
            S.health = Math.max(0, S.health - 22);
            S.flashAlpha = 0.3; S.flashOk = false;
            spawnParticles(t.x, t.y, false, t.col);
            S.threats.splice(i, 1);
            addLog(`⚠ ${t.label} breached core! −22 health`, '#ff3366');
            syncUi();
            if (S.health <= 0) doLoseLife();
          }
        }
      }

      for (const t of S.threats) drawThreat(t, S.frame);

      for (let i = S.particles.length - 1; i >= 0; i--) {
        const p = S.particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.055;
        if (p.life <= 0) { S.particles.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }

      if (S.flashAlpha > 0) {
        ctx.save(); ctx.globalAlpha = S.flashAlpha;
        ctx.fillStyle = S.flashOk ? 'rgba(0,255,100,1)' : 'rgba(255,50,50,1)';
        ctx.fillRect(0, 0, W, H); ctx.restore();
        S.flashAlpha = Math.max(0, S.flashAlpha - 0.04);
      }

      drawCrosshair();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [addLog, syncUi, doLoseLife]);

  // ─── Click Handler ─────────────────────────────────────────────────────────
  const handleCanvasClick = useCallback((e) => {
    const S = stateRef.current;
    if (!S.running || S.popupOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let hit = null, bestD = Infinity;
    for (const t of S.threats) {
      const dx = t.x - mx, dy = t.y - my, d = Math.sqrt(dx * dx + dy * dy);
      if (d < t.r + 12 && d < bestD) { bestD = d; hit = t; }
    }
    if (!hit) return;
    const td = TDATA[hit.type];
    if (S.tool === td.correctTool) {
      S.score += td.points; S.killed++;
      spawnParticles(hit.x, hit.y, true, hit.col);
      S.flashAlpha = 0.25; S.flashOk = true;
      S.threats = S.threats.filter(t => t !== hit);
      addLog(`✓ ${hit.label} neutralized! +${td.points}pts`, TOOLS[S.tool].color);
      syncUi();
      S.popupOpen = true; S.running = false;
      setPopup({ type: hit.type, success: true });
      if (S.killed >= LEVELS[S.lvl].goal) {
        const isLast = S.lvl >= LEVELS.length - 1;
        setTimeout(() => setOverlay({ type: isLast ? 'victory' : 'levelComplete' }), 1200);
      }
    } else {
      S.health = Math.max(0, S.health - 8);
      S.score = Math.max(0, S.score - 25);
      S.flashAlpha = 0.25; S.flashOk = false;
      hit.vx *= 1.4; hit.vy *= 1.4;
      addLog(`✗ Wrong tool! ${td.wrong}`, '#ff9944');
      syncUi();
      if (S.health <= 0) doLoseLife();
    }
  }, [addLog, syncUi, doLoseLife]);

  // ─── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const S = stateRef.current;
      if (!S.running) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (e.key in map) {
        S.tool = map[e.key];
        syncUi();
        addLog(`Tool: ${TOOLS[S.tool].icon} ${TOOLS[S.tool].name}`, TOOLS[S.tool].color);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [addLog, syncUi]);

  const healthColor = ui.health > 60 ? 'linear-gradient(90deg,#00ff88,#00cfff)' : ui.health > 30 ? 'linear-gradient(90deg,#ffcc00,#ff9500)' : 'linear-gradient(90deg,#ff3366,#ff6600)';
  const livesStr = '❤'.repeat(Math.max(0, ui.lives));
  const overlayBase = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 40, fontFamily: '"Share Tech Mono", monospace', color: '#fff', backdropFilter: 'blur(8px)' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, fontFamily: '"Share Tech Mono", monospace', background: '#010208' }}>
      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />

      {/* HUD Top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, background: 'rgba(0,5,12,0.96)', borderBottom: '1px solid rgba(0,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 20, pointerEvents: 'none' }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#00ff88', letterSpacing: 2 }}>ML<span style={{ color: '#00cfff' }}>SEC</span> // CYBEROPS</div>
        <div style={{ display: 'flex', gap: 18, fontSize: 10 }}>
          <span style={{ color: '#556' }}>SCORE <span style={{ color: '#00cfff', fontSize: 14, fontWeight: 'bold' }}>{ui.score}</span></span>
          <span style={{ color: '#556' }}>{ui.lvlBadge}</span>
          <span style={{ color: '#556' }}>Neutralized: {ui.killed}/{ui.goal}</span>
          <span style={{ color: '#556' }}>LIVES <span style={{ color: '#ff6666' }}>{livesStr}</span></span>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <button onClick={onExit} style={{ padding: '4px 12px', background: '#1a1a2e', border: '1px solid #333', borderRadius: 3, color: '#666', cursor: 'pointer', fontSize: 10, fontFamily: '"Share Tech Mono", monospace' }}>ABORT</button>
        </div>
      </div>

      {/* Health Bar */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, height: 4, background: '#050a10', zIndex: 20 }}>
        <div style={{ height: '100%', background: healthColor, width: `${ui.health}%`, transition: 'width 0.35s' }} />
      </div>

      {/* Tools Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,5,14,0.96)', borderTop: '1px solid rgba(0,255,136,0.15)', display: 'flex', zIndex: 20 }}>
        {TOOLS.map((t, i) => (
          <div key={i}
            onClick={() => { stateRef.current.tool = i; syncUi(); addLog(`Tool: ${t.icon} ${t.name}`, t.color); }}
            style={{ flex: 1, padding: '8px 4px', textAlign: 'center', cursor: 'pointer', background: ui.tool === i ? 'rgba(0,80,200,0.18)' : 'transparent', borderBottom: `2px solid ${ui.tool === i ? t.color : 'transparent'}`, transition: 'all 0.15s' }}>
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 9, color: ui.tool === i ? t.color : '#666', letterSpacing: 1, fontWeight: 'bold' }}>{t.name}</div>
            <div style={{ fontSize: 8, color: '#333', marginTop: 1 }}>[{t.key}]</div>
          </div>
        ))}
      </div>

      {/* Log */}
      <div style={{ position: 'absolute', bottom: 60, right: 12, width: 310, zIndex: 20, pointerEvents: 'none' }}>
        {logLines.map(l => (
          <div key={l.id} style={{ fontSize: 10, color: l.color, padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{l.msg}</div>
        ))}
      </div>

      {/* Hint */}
      <div style={{ position: 'absolute', top: 56, right: 12, background: 'rgba(0,8,16,0.85)', border: '1px solid rgba(0,255,136,0.12)', padding: '7px 11px', borderRadius: 3, fontSize: 9, color: '#445', lineHeight: 1.85, zIndex: 20, pointerEvents: 'none' }}>
        1-4 — Select Tool<br />Click threat — Deploy
      </div>

      {/* Popup */}
      {popup && (
        <Popup
          threatType={popup.type}
          success={popup.success}
          onClose={() => {
            stateRef.current.popupOpen = false;
            stateRef.current.running = true;
            setPopup(null);
          }}
        />
      )}

      {/* Level Complete */}
      {overlay?.type === 'levelComplete' && (
        <div style={{ ...overlayBase, background: 'rgba(0,12,6,0.97)' }}>
          <div style={{ fontSize: 38, color: '#00ff88', letterSpacing: 4, textShadow: '0 0 20px rgba(0,255,136,0.5)', marginBottom: 10 }}>✅ LEVEL COMPLETE!</div>
          <p style={{ color: '#7799aa', fontSize: 13, letterSpacing: 2, marginBottom: 22 }}>{LEVELS[stateRef.current.lvl]?.name} · Score: {ui.score}</p>
          <button onClick={doNextLevel} style={{ padding: '12px 38px', background: 'linear-gradient(135deg,#00ff88,#00c878)', border: 'none', borderRadius: 4, color: '#001a0a', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 13, letterSpacing: 2 }}>NEXT LEVEL →</button>
        </div>
      )}

      {/* Victory */}
      {overlay?.type === 'victory' && (
        <div style={{ ...overlayBase, background: 'rgba(0,12,6,0.97)' }}>
          <div style={{ fontSize: 36, color: '#00ff88', letterSpacing: 3, marginBottom: 10 }}>🏆 MISSION COMPLETE!</div>
          <p style={{ color: '#7799aa', fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>All 3 layers secured · Final Score: {ui.score}</p>
          <p style={{ color: '#00cfff', fontSize: 11, marginBottom: 22 }}>You have mastered the ML security stack.</p>
          <button onClick={onExit} style={{ padding: '12px 38px', background: 'linear-gradient(135deg,#00ff88,#00c878)', border: 'none', borderRadius: 4, color: '#001a0a', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 13, letterSpacing: 2 }}>RETURN TO MENU</button>
        </div>
      )}

      {/* Game Over */}
      {overlay?.type === 'gameOver' && (
        <div style={{ ...overlayBase, background: 'rgba(14,0,5,0.97)' }}>
          <div style={{ fontSize: 36, color: '#ff3366', letterSpacing: 3, marginBottom: 8 }}>⚠ SYSTEM COMPROMISED</div>
          <p style={{ color: '#776', fontSize: 11, letterSpacing: 3, marginBottom: 22 }}>YOUR DEFENSES WERE OVERWHELMED</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24, width: 460 }}>
            {[['SCORE', ui.score], ['LEVEL REACHED', stateRef.current.lvl + 1], ['NEUTRALIZED', stateRef.current.killed]].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,50,80,0.2)', borderRadius: 3, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#556', letterSpacing: 2, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 20, color: '#ff6688', fontWeight: 'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={doRestart} style={{ padding: '12px 34px', background: 'linear-gradient(135deg,#ff3366,#cc1144)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 12, letterSpacing: 2 }}>↺ RETRY MISSION</button>
        </div>
      )}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function Level5({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  if (phase === 'instructions') return <InstructionScreen onStart={() => setPhase('game')} />;
  return <Game onExit={onExit} />;
}