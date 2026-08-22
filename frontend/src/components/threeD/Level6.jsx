import { useEffect, useRef, useState, useCallback } from 'react';

// ─── ML Simulation Engine ─────────────────────────────────────────────────────
const ML = {
  NORMAL:    { score: [0.15, 0.10] },
  DRIFTED:   { score: [0.55, 0.10] },
  CORRUPTED: { score: [0.85, 0.08] },
  randn(mu, s) {
    return mu + s * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()));
  },
  generate(wave) {
    const roll = Math.random();
    const ac = Math.min(0.72, 0.3 + (wave - 1) * 0.12);
    const cls = roll < ac * 0.55 ? 'CORRUPTED' : roll < ac ? 'DRIFTED' : 'NORMAL';
    const score = Math.max(0, Math.min(1, this.randn(...this[cls].score)));
    const conf = 0.62 + Math.random() * 0.36;
    return { cls, score, conf, isAnomaly: cls !== 'NORMAL' };
  },
};

const PIPE_NAMES = ['Ingestion', 'Feature Ext.', 'Preprocess', 'Inference', 'Output Mon.'];

// ─── Instruction Screen ───────────────────────────────────────────────────────
function InstructionScreen({ onStart }) {
  const S = { fontFamily: '"Share Tech Mono", monospace' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg,#020c10,#050520)', ...S, color: '#fff', zIndex: 100, overflowY: 'auto', padding: 16 }}>
      <div style={{ maxWidth: 580, width: '92%', background: 'rgba(0,255,136,0.02)', border: '1px solid rgba(0,255,136,0.22)', borderRadius: 5, padding: 32, margin: '20px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: '#00ff88', opacity: 0.4, marginBottom: 10 }}>ML-SEC TRAINING v2.4.1</div>
          <h1 style={{ margin: 0, fontSize: 26, color: '#00ff88', letterSpacing: 4, textShadow: '0 0 20px rgba(0,255,136,0.4)', ...S }}>MODEL DRIFT DEFENSE</h1>
          <div style={{ marginTop: 8, fontSize: 11, color: '#ff9500', letterSpacing: 4 }}>LEVEL 6 · REAL-TIME PIPELINE DEFENSE</div>
        </div>

        <div style={{ background: 'rgba(0,120,255,0.07)', border: '1px solid rgba(0,120,255,0.2)', borderRadius: 4, padding: '13px 17px', marginBottom: 18 }}>
          <div style={{ color: '#5599ff', fontSize: 10, letterSpacing: 3, marginBottom: 8, fontWeight: 'bold' }}>WHY THIS MATTERS</div>
          <p style={{ margin: 0, fontSize: 11, color: '#8aaabb', lineHeight: 1.85 }}>
            Live ML pipelines face constant <strong style={{ color: '#00ff88' }}>covariate shift attacks</strong>. An <strong style={{ color: '#00ff88' }}>Isolation Forest</strong> anomaly detector scores each incoming packet across 8 feature dimensions. Shoot <strong style={{ color: '#ff4444' }}>CORRUPTED</strong> and <strong style={{ color: '#ff9500' }}>DRIFTED</strong> packets before they corrupt the inference core. False positives add drift.
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ color: '#445', fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>PACKET TYPES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { col: '#ff3a3a', bg: 'rgba(255,58,58,0.08)',  border: 'rgba(255,58,58,0.3)',  label: 'CORRUPTED', desc: 'Score > 0.75\nShoot immediately' },
              { col: '#ff9500', bg: 'rgba(255,149,0,0.08)',  border: 'rgba(255,149,0,0.3)',  label: 'DRIFTED',   desc: 'Score 0.40–0.75\nShoot to prevent drift' },
              { col: '#00ff88', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)', label: 'NORMAL',    desc: 'Score < 0.40\nDo NOT shoot' },
            ].map(p => (
              <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 4, padding: '11px 9px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: p.col, fontSize: 11, marginBottom: 6 }}>{p.label}</div>
                <div style={{ color: '#556', fontSize: 10, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ color: '#445', fontSize: 10, letterSpacing: 3, marginBottom: 12 }}>HOW TO PLAY</div>
          <div style={{ display: 'grid', gap: 7 }}>
            {[
              { icon: '🖱️', t: 'Click any threat packet to shoot it', d: 'Packets fly toward the central core. Click to intercept before they reach it.' },
              { icon: '⚠️', t: 'Shooting NORMAL packets adds +5% drift', d: 'Read the score shown on each packet. Green hexagon = safe, do not shoot.' },
              { icon: '💀', t: 'Lose: drift ≥ 100% or integrity hits 0%', d: 'Unblocked anomalies drain integrity. Drift builds passively each second.' },
              { icon: '🏆', t: 'Win: reach score 2000 across 5 phases', d: 'Each phase increases anomaly density and packet speed. Score 2000 to win.' },
            ].map(s => (
              <div key={s.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', borderRadius: 3, padding: '9px 13px' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                <div><div style={{ color: '#ccc', fontWeight: 'bold', fontSize: 11 }}>{s.t}</div><div style={{ color: '#556', fontSize: 10, marginTop: 2 }}>{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,150,0,0.05)', border: '1px solid rgba(255,150,0,0.2)', borderRadius: 4, padding: '10px 14px', marginBottom: 22, fontSize: 11, color: '#aa7700', lineHeight: 1.7 }}>
          ⚡ Each packet shows its anomaly score. Corrupted = octagon, Drifted = circle with crosshairs, Normal = hexagon. Shoot the first two, spare the third.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 10, color: '#445', lineHeight: 1.9 }}>MOUSE — Aim &nbsp;|&nbsp; Click — Shoot<br />Survive all 5 phases</div>
          <button onClick={onStart} style={{ padding: '12px 38px', fontSize: 13, fontWeight: 'bold', background: 'linear-gradient(135deg,#00b8a9,#0055ff)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', letterSpacing: 3, fontFamily: '"Share Tech Mono", monospace' }}>
            INITIALIZE →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline Health Panel ────────────────────────────────────────────────────
function PipePanel({ pipeHealth, drift, integrity }) {
  const driftCol = drift > 70 ? '#ff4444' : '#ff9500';
  const intCol   = integrity > 60 ? '#00ff88' : integrity > 30 ? '#ff9500' : '#ff4444';
  return (
    <div style={{ position: 'absolute', left: 12, top: 52, width: 194, display: 'flex', flexDirection: 'column', gap: 7, pointerEvents: 'none', zIndex: 20 }}>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 5 }}>MODEL DRIFT</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: driftCol }}>{Math.round(drift)}%</div>
        <div style={{ width: '100%', height: 5, background: '#021810', borderRadius: 2, marginTop: 4, overflow: 'hidden', border: '1px solid rgba(0,255,136,0.15)' }}>
          <div style={{ height: '100%', background: drift > 70 ? 'linear-gradient(90deg,#ff3a3a,#ff6600)' : 'linear-gradient(90deg,#ff9500,#ffcc00)', width: `${drift}%`, transition: 'width 0.4s' }} />
        </div>
      </div>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 5 }}>PIPELINE INTEGRITY</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: intCol }}>{Math.round(integrity)}%</div>
        <div style={{ width: '100%', height: 5, background: '#021810', borderRadius: 2, marginTop: 4, overflow: 'hidden', border: '1px solid rgba(0,255,136,0.15)' }}>
          <div style={{ height: '100%', background: integrity > 60 ? 'linear-gradient(90deg,#00ff88,#00cfff)' : 'linear-gradient(90deg,#ff4444,#ff9500)', width: `${integrity}%`, transition: 'width 0.4s' }} />
        </div>
      </div>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 8 }}>PIPELINE NODES</div>
        {PIPE_NAMES.map((name, i) => {
          const h = pipeHealth[i];
          const c = h > 65 ? '#00ff88' : h > 30 ? '#ff9500' : '#ff4444';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
              <div style={{ fontSize: 9, flex: 1, color: '#7ec8a0' }}>{name}</div>
              <div style={{ width: 44, height: 3, background: '#021810', borderRadius: 1 }}>
                <div style={{ height: '100%', background: c, width: `${h}%`, transition: 'width 0.5s', borderRadius: 1 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Diagnostics Panel ────────────────────────────────────────────────────────
function DiagPanel({ wave, kills, fp, packetCount, lastDecision, lastColor }) {
  const acc = kills + fp > 0 ? Math.round(kills / (kills + fp) * 100) : 100;
  return (
    <div style={{ position: 'absolute', right: 12, top: 52, width: 194, display: 'flex', flexDirection: 'column', gap: 7, pointerEvents: 'none', zIndex: 20 }}>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 5 }}>KILLS / FALSE POS</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#00ff88' }}>{String(kills).padStart(3, '0')}</div>
        <div style={{ fontSize: 13, color: '#ff4444', marginTop: 2 }}>FP: {String(fp).padStart(2, '0')}</div>
      </div>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 8 }}>LIVE DIAGNOSTICS</div>
        {[['Packets active', packetCount], ['Accuracy', acc + '%'], ['Phase target', [200, 500, 900, 1400, 2000][Math.min(wave - 1, 4)]]].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7ec8a0', marginBottom: 4 }}>
            <span>{l}</span><span style={{ color: '#00cfff' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(0,20,30,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '9px 12px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#7ec8a0', opacity: 0.6, marginBottom: 7 }}>LAST ML DECISION</div>
        <div style={{ fontSize: 10, color: lastColor, lineHeight: 1.8 }}>{lastDecision}</div>
      </div>
    </div>
  );
}

// ─── Main Game ────────────────────────────────────────────────────────────────
function Game({ onExit }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    score: 0, wave: 1, integrity: 100, drift: 0,
    kills: 0, fp: 0, running: true,
    packets: [], particles: [],
    pipeHealth: [100, 100, 100, 100, 100],
    flashAlpha: 0, flashOk: false,
    frame: 0, pkgId: 0, banner: '', bannerTick: 0,
  });
  const rafRef = useRef(null);
  const spawnTimerRef = useRef(null);

  const [ui, setUi] = useState({
    score: 0, wave: 1, integrity: 100, drift: 0, kills: 0, fp: 0,
    packetCount: 0, pipeHealth: [100, 100, 100, 100, 100],
    lastDecision: 'Waiting for packets...', lastColor: '#7ec8a0',
    status: 'playing',
  });

  const syncUi = useCallback(() => {
    const S = stateRef.current;
    setUi(p => ({
      ...p,
      score: S.score, wave: S.wave, integrity: Math.round(S.integrity),
      drift: Math.round(S.drift), kills: S.kills, fp: S.fp,
      packetCount: S.packets.length, pipeHealth: [...S.pipeHealth],
    }));
  }, []);

  const setDecision = useCallback((msg, col) => {
    setUi(p => ({ ...p, lastDecision: msg, lastColor: col }));
  }, []);

  const endGame = useCallback(() => {
    const S = stateRef.current;
    S.running = false;
    clearTimeout(spawnTimerRef.current);
    setUi(p => ({ ...p, status: 'lost' }));
  }, []);

  const checkWin = useCallback((score, wave) => {
    const targets = [200, 500, 900, 1400, 2000];
    const S = stateRef.current;
    if (score >= targets[Math.min(wave - 1, 4)] && wave < 5) {
      S.wave = wave + 1;
      S.banner = `PHASE ${String(S.wave).padStart(2, '0')} — SEVERE COVARIATE SHIFT`;
      S.bannerTick = 220;
      syncUi();
    } else if (score >= 2000 && wave >= 5) {
      S.running = false;
      clearTimeout(spawnTimerRef.current);
      setUi(p => ({ ...p, status: 'won' }));
    }
  }, [syncUi]);

  const spawnParticles = (x, y, col) => {
    const S = stateRef.current;
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2, spd = 1.5 + Math.random() * 2.5;
      S.particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1, col });
    }
  };

  // ─── Canvas Loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const drawBackground = () => {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = 'rgba(2,12,16,0.88)';
      ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.strokeStyle = 'rgba(0,255,136,0.05)'; ctx.lineWidth = 0.5;
      for (let i = 0; i < W; i += 44) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let i = 0; i < H; i += 44) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
      ctx.restore();
    };

    const drawCore = (frame) => {
      const S = stateRef.current;
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const df = S.drift / 100;
      const pulse = 1 + Math.sin(frame * 0.04) * 0.07;
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28 * pulse);
      grad.addColorStop(0, `rgba(${Math.round(df * 255)},${Math.round((1 - df * 0.5) * 200)},136,0.8)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      for (let ri = 0; ri < 4; ri++) {
        const r = 48 + ri * 32;
        ctx.beginPath(); ctx.arc(cx, cy, r + Math.sin(frame * 0.02 + ri) * 3, 0, Math.PI * 2);
        const alpha = [0.3, 0.2, 0.13, 0.07][ri];
        const gr = Math.round(df * 255), gg = Math.round((1 - df * 0.5) * 200), gb = Math.round((1 - df) * 136);
        ctx.strokeStyle = `rgba(${gr},${gg},${gb},${alpha})`;
        ctx.lineWidth = ri === 0 ? 2 : 1; ctx.stroke();
      }
      ctx.restore();
    };

    const drawPacket = (p) => {
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.strokeStyle = p.col; ctx.lineWidth = 2;
      ctx.shadowColor = p.col; ctx.shadowBlur = 10;
      const r = p.r;
      if (p.data.cls === 'CORRUPTED') {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) { const a = Math.PI / 4 * i + p.spin; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.closePath(); ctx.stroke();
      } else if (p.data.cls === 'DRIFTED') {
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
      } else {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + p.spin; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.closePath(); ctx.stroke();
      }
      ctx.fillStyle = p.col + '22'; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = 'bold 9px "Share Tech Mono", monospace'; ctx.fillStyle = '#ffffffcc'; ctx.textAlign = 'center';
      ctx.fillText(p.data.score.toFixed(2), 0, r + 14);
      ctx.restore();
    };

    const drawCrosshair = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      ctx.save(); ctx.strokeStyle = 'rgba(0,255,136,0.65)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 22); ctx.lineTo(cx, cy - 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + 12); ctx.lineTo(cx, cy + 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 22, cy); ctx.lineTo(cx - 12, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 12, cy); ctx.lineTo(cx + 22, cy); ctx.stroke();
      ctx.restore();
    };

    const loop = () => {
      const S = stateRef.current;
      const W = canvas.width, H = canvas.height;
      S.frame++;

      drawBackground();
      drawCore(S.frame);

      if (S.running) {
        const dInc = 0.001 * (1 + (S.wave - 1) * 0.3);
        S.drift = Math.min(100, S.drift + dInc);
        const cx = W / 2, cy = H / 2;

        for (let i = S.packets.length - 1; i >= 0; i--) {
          const p = S.packets[i];
          p.x += p.vx; p.y += p.vy; p.age++; p.spin += p.spinRate;
          const dx = p.x - cx, dy = p.y - cy, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 32) {
            S.packets.splice(i, 1);
            if (p.data.isAnomaly) {
              S.integrity = Math.max(0, S.integrity - 14);
              S.drift = Math.min(100, S.drift + 4);
              S.flashAlpha = 0.25; S.flashOk = false;
              spawnParticles(cx, cy, '#ff4400');
              const idx = Math.floor(Math.random() * 5);
              S.pipeHealth[idx] = Math.max(0, S.pipeHealth[idx] - 14);
              setDecision(`BREACHED: ${p.data.cls} −14% integrity`, '#ff4444');
              syncUi();
              if (S.integrity <= 0 || S.drift >= 100) endGame();
            } else {
              S.drift = Math.min(100, S.drift + 1.5);
              syncUi();
              if (S.drift >= 100) endGame();
            }
          }
        }

        if (S.frame % 55 === 0) syncUi();
      }

      for (const p of S.packets) drawPacket(p);

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

      if (S.bannerTick > 0) {
        S.bannerTick--;
        const alpha = Math.min(1, S.bannerTick / 30);
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.font = 'bold 28px "Share Tech Mono", monospace'; ctx.fillStyle = '#00ff88'; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,255,136,0.5)'; ctx.shadowBlur = 16;
        ctx.fillText(S.banner, W / 2, H / 2 - 50); ctx.restore();
      }

      drawCrosshair();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [syncUi, setDecision, endGame]);

  // ─── Spawn Scheduler ────────────────────────────────────────────────────────
  useEffect(() => {
    const scheduleSpawn = () => {
      const S = stateRef.current;
      if (!S.running) return;
      const interval = Math.max(500, 1600 * (1 - (S.wave - 1) * 0.15));
      spawnTimerRef.current = setTimeout(() => {
        spawnPacket();
        if (Math.random() < 0.2 + (S.wave - 1) * 0.08) setTimeout(spawnPacket, 360);
        scheduleSpawn();
      }, interval + Math.random() * 400);
    };

    const spawnPacket = () => {
      const S = stateRef.current;
      if (!S.running || !canvasRef.current) return;
      const W = canvasRef.current.width, H = canvasRef.current.height;
      const d = ML.generate(S.wave);
      const side = Math.floor(Math.random() * 4);
      let x, y;
      const mx = 210, my = 48;
      if (side === 0) { x = mx + Math.random() * (W - mx * 2); y = -22; }
      else if (side === 1) { x = mx + Math.random() * (W - mx * 2); y = H + 22; }
      else if (side === 2) { x = -22; y = my + Math.random() * (H - my * 2); }
      else { x = W + 22; y = my + Math.random() * (H - my * 2); }
      const cx = W / 2, cy = H / 2;
      const dx = cx - x, dy = cy - y, len = Math.sqrt(dx * dx + dy * dy);
      const spd = (0.65 + Math.random() * 0.5) * (1 + (S.wave - 1) * 0.12);
      const col = d.cls === 'CORRUPTED' ? '#ff3a3a' : d.cls === 'DRIFTED' ? '#ff9500' : '#00ff88';
      S.packets.push({ id: S.pkgId++, x, y, vx: (dx / len) * spd, vy: (dy / len) * spd, r: 17, col, data: d, spin: 0, spinRate: 0.05 + Math.random() * 0.03, age: 0 });
      setDecision(`[${d.cls}] score=${d.score.toFixed(3)} conf=${Math.round(d.conf * 100)}%`, col);
      setUi(p => ({ ...p, packetCount: S.packets.length }));
    };

    scheduleSpawn();
    return () => clearTimeout(spawnTimerRef.current);
  }, [setDecision]);

  // ─── Click Handler ──────────────────────────────────────────────────────────
  const handleClick = useCallback((e) => {
    const S = stateRef.current;
    if (!S.running) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let hit = null, bestD = Infinity;
    for (const p of S.packets) {
      const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy);
      if (d < p.r + 14 && d < bestD) { bestD = d; hit = p; }
    }
    if (!hit) return;
    S.packets = S.packets.filter(x => x !== hit);
    if (hit.data.isAnomaly) {
      const pts = hit.data.cls === 'CORRUPTED' ? 200 : 120;
      S.kills++; S.score += pts;
      S.drift = Math.max(0, S.drift - 3);
      spawnParticles(hit.x, hit.y, '#00ff88');
      S.flashAlpha = 0.2; S.flashOk = true;
      setDecision(`NEUTRALIZED: ${hit.data.cls} +${pts}pts`, '#00ff88');
      syncUi();
      checkWin(S.score, S.wave);
    } else {
      S.fp++; S.score = Math.max(0, S.score - 50); S.drift = Math.min(100, S.drift + 5);
      spawnParticles(hit.x, hit.y, '#ff4400');
      S.flashAlpha = 0.2; S.flashOk = false;
      setDecision('FALSE POSITIVE! +5% drift', '#ff9500');
      syncUi();
      if (S.drift >= 100) endGame();
    }
  }, [syncUi, setDecision, checkWin, endGame]);

  const doRestart = useCallback(() => {
    const S = stateRef.current;
    Object.assign(S, { score: 0, wave: 1, integrity: 100, drift: 0, kills: 0, fp: 0, packets: [], particles: [], pipeHealth: [100, 100, 100, 100, 100], flashAlpha: 0, frame: 0, pkgId: 0, banner: '', bannerTick: 0, running: true });
    setUi({ score: 0, wave: 1, integrity: 100, drift: 0, kills: 0, fp: 0, packetCount: 0, pipeHealth: [100, 100, 100, 100, 100], lastDecision: 'Waiting for packets...', lastColor: '#7ec8a0', status: 'playing' });
  }, []);

  const acc = ui.kills + ui.fp > 0 ? Math.round(ui.kills / (ui.kills + ui.fp) * 100) : 100;
  const ovr = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 40, fontFamily: '"Share Tech Mono", monospace', backdropFilter: 'blur(8px)', textAlign: 'center' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, fontFamily: '"Share Tech Mono", monospace', background: '#020c10' }}>
      <canvas ref={canvasRef} onClick={handleClick} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />

      {/* HUD Top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, background: 'rgba(0,8,12,0.97)', borderBottom: '1px solid rgba(0,255,136,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 25, pointerEvents: 'none' }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#00ff88', letterSpacing: 2 }}>ML<span style={{ color: '#00cfff' }}>SEC</span> // PIPELINE MONITOR</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 10 }}>
          <span style={{ color: '#445' }}>PHASE <span style={{ color: '#ffcc00', fontSize: 14, fontWeight: 'bold' }}>{String(ui.wave).padStart(2, '0')}</span><span style={{ color: '#445' }}>/05</span></span>
          <span style={{ color: '#445' }}>SCORE <span style={{ color: '#00cfff', fontSize: 14, fontWeight: 'bold' }}>{String(ui.score).padStart(5, '0')}</span></span>
          <span style={{ fontSize: 9, color: '#00cfff', background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', padding: '2px 8px', borderRadius: 2 }}>IsoForest · 8 features</span>
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          <button onClick={onExit} style={{ padding: '4px 12px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,80,0.3)', borderRadius: 3, color: '#ff6688', cursor: 'pointer', fontSize: 10, fontFamily: '"Share Tech Mono", monospace' }}>ABORT</button>
        </div>
      </div>

      {/* Side Panels */}
      <PipePanel pipeHealth={ui.pipeHealth} drift={ui.drift} integrity={ui.integrity} />
      <DiagPanel wave={ui.wave} kills={ui.kills} fp={ui.fp} packetCount={ui.packetCount} lastDecision={ui.lastDecision} lastColor={ui.lastColor} />

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,20,30,0.92)', border: '1px solid rgba(0,255,136,0.18)', padding: '5px 16px', borderRadius: 16, fontSize: 10, color: '#7ec8a0', pointerEvents: 'none', zIndex: 20, whiteSpace: 'nowrap', letterSpacing: 1 }}>
        CORRUPTED (octagon) — shoot &nbsp;·&nbsp; DRIFTED (circle+cross) — shoot &nbsp;·&nbsp; NORMAL (hexagon) — spare
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'rgba(0,6,10,0.97)', borderTop: '1px solid rgba(0,255,136,0.18)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 20, fontSize: 10, color: '#7ec8a0', zIndex: 20, pointerEvents: 'none' }}>
        <span>MODEL: <span style={{ color: '#00ff88' }}>IsolationForest</span></span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>DRIFT: <span style={{ color: ui.drift > 70 ? '#ff4444' : ui.drift > 40 ? '#ff9500' : '#00ff88' }}>{ui.drift > 70 ? 'CRITICAL' : ui.drift > 40 ? 'ELEVATED' : 'NOMINAL'}</span></span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>ACCURACY: <span style={{ color: '#00cfff' }}>{acc}%</span></span>
      </div>

      {/* Win Screen */}
      {ui.status === 'won' && (
        <div style={{ ...ovr, background: 'rgba(0,15,8,0.97)' }}>
          <div style={{ fontSize: 40, color: '#00ff88', letterSpacing: 5, marginBottom: 10, textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>PIPELINE SECURED</div>
          <p style={{ color: '#7ec8a0', fontSize: 13, letterSpacing: 3, marginBottom: 22 }}>ALL 5 PHASES SURVIVED · DRIFT CONTAINED</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24, width: 440 }}>
            {[['FINAL SCORE', ui.score], ['NEUTRALIZED', ui.kills], ['FALSE POSITIVES', ui.fp], ['ACCURACY', acc + '%'], ['FINAL DRIFT', ui.drift + '%'], ['INTEGRITY', ui.integrity + '%']].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 3, padding: '11px 12px' }}>
                <div style={{ fontSize: 9, color: '#445', letterSpacing: 2, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 18, color: '#00ff88', fontWeight: 'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={onExit} style={{ padding: '12px 38px', background: 'linear-gradient(135deg,#00aa55,#007733)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 13, letterSpacing: 2 }}>RETURN TO MENU</button>
        </div>
      )}

      {/* Lose Screen */}
      {ui.status === 'lost' && (
        <div style={{ ...ovr, background: 'rgba(12,0,2,0.97)' }}>
          <div style={{ fontSize: 36, color: '#ff3a3a', letterSpacing: 3, marginBottom: 8 }}>PIPELINE CORRUPTED</div>
          <p style={{ color: '#776', fontSize: 11, letterSpacing: 3, marginBottom: 22 }}>MODEL DRIFT EXCEEDED CRITICAL THRESHOLD</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22, width: 440 }}>
            {[['SCORE', ui.score], ['PHASES SURVIVED', ui.wave], ['NEUTRALIZED', ui.kills], ['FALSE POSITIVES', ui.fp], ['FINAL DRIFT', ui.drift + '%'], ['ACCURACY', acc + '%']].map(([l, v]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,50,50,0.2)', borderRadius: 3, padding: '11px 12px' }}>
                <div style={{ fontSize: 9, color: '#556', letterSpacing: 2, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 18, color: '#ff6666', fontWeight: 'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={doRestart} style={{ padding: '12px 34px', background: 'transparent', border: '2px solid #ff4444', borderRadius: 3, color: '#ff4444', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: 12, letterSpacing: 2 }}>↺ REINITIALIZE PIPELINE</button>
        </div>
      )}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function Level6({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  if (phase === 'instructions') return <InstructionScreen onStart={() => setPhase('game')} />;
  return <Game onExit={onExit} />;
}