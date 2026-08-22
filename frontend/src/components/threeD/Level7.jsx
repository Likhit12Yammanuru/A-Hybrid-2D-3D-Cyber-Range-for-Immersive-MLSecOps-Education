import { useEffect, useRef, useState } from 'react';

const OVR = { position:'absolute',inset:0,background:'rgba(0,5,12,0.96)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:'"Segoe UI",monospace',zIndex:20,backdropFilter:'blur(12px)' };
const BTN = { marginTop:30,padding:'14px 50px',fontSize:18,background:'linear-gradient(135deg,#00c6ff,#0072ff)',border:'none',borderRadius:30,color:'white',cursor:'pointer',fontWeight:'bold' };

function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'4 waves · 100s timer · −8% per real hit · Max 4 shields · Decoys pulse visibly' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'4 waves · 75s timer · −12% per real hit · Max 3 shields · Decoys look similar' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'4 waves · 55s timer · −18% per real hit · Max 2 shields · Decoys nearly identical' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#010108 0%,#040415 100%)',fontFamily:'"Segoe UI",monospace',color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:680,width:'92%',background:'rgba(0,200,255,0.03)',border:'1px solid rgba(0,200,255,0.18)',borderRadius:18,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:28 }}>
          <div style={{ fontSize:40,marginBottom:8 }}>🛡️</div>
          <h1 style={{ margin:0,fontSize:24,color:'#00ffcc',letterSpacing:1 }}>LEVEL 7: Intellectual Property Defense</h1>
          <p style={{ margin:'8px 0 0',color:'#336655',fontSize:13 }}>AI Security Training — Advanced Threat Response</p>
        </div>
        <div style={{ background:'rgba(0,100,200,0.07)',border:'1px solid rgba(0,100,200,0.2)',borderRadius:10,padding:'16px 18px',marginBottom:22 }}>
          <div style={{ color:'#4488ff',fontSize:11,letterSpacing:'1.5px',marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:13,color:'#7799aa',lineHeight:1.75 }}>
            Trained AI models are high-value targets. Real adversaries mix <strong style={{ color:'#00ffcc' }}>real extraction probes</strong> with <strong style={{ color:'#00ffcc' }}>decoy queries</strong> to waste your defenses. This level trains multi-wave, multi-threat defensive strategy.
          </p>
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ color:'#555',fontSize:11,letterSpacing:'1.5px',marginBottom:12,fontWeight:'bold' }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:8 }}>
            {[
              { icon:'🔵', title:'Protect the Blue Core', desc:"The glowing circle at center is your AI model. Don't let real probes reach it." },
              { icon:'🖱️', title:'Click the arena to deploy a Shield', desc:'A barrier appears — probes passing through it are intercepted.' },
              { icon:'🔴', title:'Real probes = bright red with spikes', desc:'These carry extraction data — intercept them! Each one that reaches core drains integrity.' },
              { icon:'🟠', title:'Decoy probes = dimmer orange round spheres', desc:'Fake queries — no spikes. Reaching core does NO damage, but still trigger shields.' },
              { icon:'🌊', title:'Survive all 4 escalating waves', desc:'Each wave brings faster probes and denser spawns.' },
              { icon:'📉', title:'Shield radius shrinks each wave', desc:'Move shields closer to the core in later waves.' },
            ].map(s => (
              <div key={s.title} style={{ display:'flex',gap:14,alignItems:'flex-start',background:'rgba(255,255,255,0.02)',borderRadius:8,padding:'11px 14px' }}>
                <div style={{ fontSize:20,flexShrink:0 }}>{s.icon}</div>
                <div><div style={{ color:'#ccc',fontWeight:'bold',fontSize:13 }}>{s.title}</div><div style={{ color:'#666',fontSize:12,marginTop:3 }}>{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:22 }}>
          <div style={{ flex:1,background:'rgba(0,255,136,0.05)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:8,padding:12,textAlign:'center' }}>
            <div style={{ color:'#00ff88',fontWeight:'bold',fontSize:13 }}>🏆 WIN</div>
            <div style={{ color:'#556',fontSize:12,marginTop:6 }}>Survive all 4 waves with integrity intact</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:8,padding:12,textAlign:'center' }}>
            <div style={{ color:'#ff4444',fontWeight:'bold',fontSize:13 }}>💀 LOSE</div>
            <div style={{ color:'#885555',fontSize:12,marginTop:6 }}>Model integrity reaches 0%</div>
          </div>
        </div>
        <div style={{ marginBottom:26 }}>
          <div style={{ color:'#555',fontSize:11,letterSpacing:'1.5px',marginBottom:12,fontWeight:'bold' }}>SELECT DIFFICULTY</div>
          <div style={{ display:'flex',gap:10 }}>
            {Object.entries(diffs).map(([k,d]) => (
              <div key={k} onClick={() => setDifficulty(k)} style={{ flex:1,padding:'12px 8px',borderRadius:8,textAlign:'center',cursor:'pointer',border:`2px solid ${difficulty===k?d.color:'#222'}`,background:difficulty===k?`${d.color}12`:'rgba(255,255,255,0.02)',transition:'all 0.2s' }}>
                <div style={{ fontWeight:'bold',fontSize:13,color:difficulty===k?d.color:'#555' }}>{d.label}</div>
                <div style={{ fontSize:10,color:'#444',marginTop:6,lineHeight:1.5 }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:16,fontSize:16,fontWeight:'bold',background:'linear-gradient(135deg,#0055aa,#00aacc)',border:'none',borderRadius:10,color:'white',cursor:'pointer',letterSpacing:1 }}>
          START DEFENSE →
        </button>
      </div>
    </div>
  );
}

const DIFF = {
  easy:   { timer:100, dmg:8,  speedBase:1.2, spawnInterval:1500, maxShields:4, decoyChance:0.25, waveCount:4 },
  medium: { timer:75,  dmg:12, speedBase:1.6, spawnInterval:1100, maxShields:3, decoyChance:0.38, waveCount:4 },
  hard:   { timer:55,  dmg:18, speedBase:2.2, spawnInterval:750,  maxShields:2, decoyChance:0.50, waveCount:4 },
};
const DIFF_COLOR = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };
const WAVE_RADIUS = [70, 58, 46, 36]; // pixels
const WAVE_SPEED  = [1.0, 1.18, 1.38, 1.62];
const WAVE_SPAWN  = [1.0, 0.82, 0.66, 0.52];

function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [ui, setUi] = useState({ integrity:100, timer:D.timer, wave:1, barriersActive:0, probesDefeated:0, decoysWasted:0, status:'playing', statusMsg:'Click the arena to deploy your first shield!', waveMsg:'' });
  const uiRef = useRef({ integrity:100, timer:D.timer, wave:1, status:'playing', probesDefeated:0, decoysWasted:0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const state = { shields:[], probes:[], particles:[], spawnTimer:0, waveTimer:0, lastNow:null, time:0 };
    stateRef.current = state;
    uiRef.current = { integrity:100, timer:D.timer, wave:1, status:'playing', probesDefeated:0, decoysWasted:0 };

    // Timer countdown
    const timerInterval = setInterval(() => {
      if (uiRef.current.status!=='playing') return;
      uiRef.current.timer--;
      if (uiRef.current.timer<=0) {
        uiRef.current.status='won';
        setUi(p=>({...p,timer:0,status:'won'}));
      } else {
        setUi(p=>({...p,timer:uiRef.current.timer}));
      }
    }, 1000);

    // Click to place shield
    const onClick = (e) => {
      if (uiRef.current.status!=='playing') return;
      const r=canvas.getBoundingClientRect();
      const x=e.clientX-r.left, y=e.clientY-r.top;
      const cx=canvas.width/2, cy=canvas.height/2;
      if (Math.hypot(x-cx,y-cy)<50) { setUi(p=>({...p,statusMsg:'⚠️ Too close to core!'})); return; }

      if (state.shields.length>=D.maxShields) state.shields.shift();
      const wv=uiRef.current.wave-1;
      const radius=WAVE_RADIUS[Math.min(wv,3)];
      state.shields.push({ x, y, radius, pulse:0 });
      // Placement burst
      for (let i=0; i<14; i++) state.particles.push({ x,y, vx:(Math.random()-0.5)*5, vy:(Math.random()-0.5)*5, life:1, color:'teal' });
      setUi(p=>({...p,barriersActive:state.shields.length,statusMsg:`🛡️ Shield deployed — Wave ${uiRef.current.wave} radius: ${radius}px`}));
    };
    canvas.addEventListener('click', onClick);

    const spawnProbe = () => {
      const W=canvas.width, H=canvas.height;
      const cx=W/2, cy=H/2;
      const angle=Math.random()*Math.PI*2;
      const dist=Math.min(W,H)*0.48;
      const isDecoy=Math.random()<D.decoyChance*(0.8+(uiRef.current.wave-1)*0.15);
      const wv=uiRef.current.wave-1;
      const speed=D.speedBase*WAVE_SPEED[Math.min(wv,3)];
      state.probes.push({
        x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist,
        speed, isDecoy, rot:Math.random()*Math.PI*2,
      });
    };

    const WAVE_INTERVAL = (D.timer/D.waveCount)*1000;

    const loop = (now) => {
      if (!state.lastNow) state.lastNow=now;
      const dt=Math.min(now-state.lastNow,50);
      state.lastNow=now;
      state.time=now*0.001;

      const W=canvas.width, H=canvas.height;
      const cx=W/2, cy=H/2;

      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#010104'; ctx.fillRect(0,0,W,H);

      // Grid
      ctx.strokeStyle='rgba(0,80,160,0.12)'; ctx.lineWidth=1;
      const step=50;
      for (let gx=0; gx<W; gx+=step) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
      for (let gy=0; gy<H; gy+=step) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

      if (uiRef.current.status==='playing') {
        // Wave timer
        state.waveTimer+=dt;
        if (state.waveTimer>WAVE_INTERVAL && uiRef.current.wave<D.waveCount) {
          uiRef.current.wave++;
          state.waveTimer=0;
          const wv=uiRef.current.wave;
          setUi(p=>({...p,wave:wv,waveMsg:`⚡ WAVE ${wv} — probes faster, shields shrink!`}));
          setTimeout(()=>setUi(p=>({...p,waveMsg:''})),3500);
        }

        // Spawn
        state.spawnTimer+=dt;
        const wv=uiRef.current.wave-1;
        const spawnDelay=D.spawnInterval*WAVE_SPAWN[Math.min(wv,3)];
        if (state.spawnTimer>spawnDelay) { state.spawnTimer=0; spawnProbe(); }

        // Move probes
        for (let i=state.probes.length-1; i>=0; i--) {
          const p=state.probes[i];
          const dx=cx-p.x, dy=cy-p.y, dist=Math.hypot(dx,dy);
          if (dist<1) continue;
          p.x+=(dx/dist)*p.speed;
          p.y+=(dy/dist)*p.speed;
          p.rot+=0.04;

          let hit=false;
          for (let j=state.shields.length-1; j>=0; j--) {
            const sh=state.shields[j];
            if (Math.hypot(p.x-sh.x,p.y-sh.y)<sh.radius) {
              for (let k=0; k<12; k++) state.particles.push({ x:p.x,y:p.y, vx:(Math.random()-0.5)*4, vy:(Math.random()-0.5)*4, life:1, color:p.isDecoy?'orange':'teal' });
              state.probes.splice(i,1);
              hit=true;
              if (p.isDecoy) {
                uiRef.current.decoysWasted++;
                setUi(prev=>({...prev,decoysWasted:uiRef.current.decoysWasted,statusMsg:`🟠 Decoy intercepted — shield slot used! (${uiRef.current.decoysWasted} total)`}));
              } else {
                uiRef.current.probesDefeated++;
                setUi(prev=>({...prev,probesDefeated:uiRef.current.probesDefeated,statusMsg:`✅ Real probe blocked! (${uiRef.current.probesDefeated} total)`}));
              }
              break;
            }
          }
          if (hit) continue;

          if (dist<38) {
            state.probes.splice(i,1);
            if (!p.isDecoy) {
              uiRef.current.integrity=Math.max(0,uiRef.current.integrity-D.dmg);
              const ni=uiRef.current.integrity;
              // Red flash particles
              for (let k=0; k<16; k++) state.particles.push({ x:cx,y:cy, vx:(Math.random()-0.5)*6, vy:(Math.random()-0.5)*6, life:1, color:'red' });
              setUi(prev=>({...prev,integrity:ni,statusMsg:`⚠️ REAL PROBE hit core! −${D.dmg}% Integrity (${ni}% left)`}));
              if (ni<=0) { uiRef.current.status='lost'; setUi(p=>({...p,integrity:0,status:'lost'})); }
            } else {
              setUi(prev=>({...prev,statusMsg:'🟠 Decoy passed core — no damage. Spot real probes by their spikes!'}));
            }
          }
        }
      }

      // Particles
      for (let i=state.particles.length-1; i>=0; i--) {
        const p=state.particles[i];
        ctx.beginPath(); ctx.arc(p.x,p.y,4*p.life,0,Math.PI*2);
        const col=p.color==='teal'?`rgba(0,200,150,${p.life})`:p.color==='orange'?`rgba(255,150,50,${p.life})`:`rgba(255,50,50,${p.life})`;
        ctx.fillStyle=col; ctx.fill();
        p.x+=p.vx; p.y+=p.vy; p.life-=0.04;
        if(p.life<=0) state.particles.splice(i,1);
      }

      // Draw shields
      state.shields.forEach(sh => {
        sh.pulse = (sh.pulse||0)+0.06;
        const alpha=0.15+Math.sin(sh.pulse)*0.05;
        ctx.beginPath(); ctx.arc(sh.x,sh.y,sh.radius,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,200,160,${alpha})`; ctx.fill();
        ctx.strokeStyle=`rgba(0,255,200,0.5)`; ctx.lineWidth=2; ctx.stroke();
        // Top/bottom rings
        ctx.beginPath(); ctx.ellipse(sh.x,sh.y,sh.radius,sh.radius*0.1,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,180,0.35)'; ctx.lineWidth=2; ctx.stroke();
      });

      // Draw probes
      state.probes.forEach(p => {
        ctx.save();
        ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        if (!p.isDecoy) {
          // Real probe: red sphere with spikes
          ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2);
          ctx.fillStyle='#ff2222'; ctx.shadowBlur=16; ctx.shadowColor='#ff0000'; ctx.fill(); ctx.shadowBlur=0;
          // 4 spikes
          for (let s=0; s<4; s++) {
            const ang=(s*Math.PI)/2;
            ctx.save(); ctx.rotate(ang);
            ctx.fillStyle='#ff4444';
            ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3,-9); ctx.lineTo(3,-9); ctx.closePath(); ctx.fill();
            ctx.restore();
          }
        } else {
          // Decoy: orange round
          ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2);
          ctx.fillStyle='#ff7722'; ctx.shadowBlur=10; ctx.shadowColor='#ff5500'; ctx.fill(); ctx.shadowBlur=0;
        }
        ctx.restore();
      });

      // Core
      const coreGr=ctx.createRadialGradient(cx,cy,10,cx,cy,40);
      coreGr.addColorStop(0,'rgba(100,200,255,0.7)');
      coreGr.addColorStop(0.5,'rgba(30,100,220,0.3)');
      coreGr.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(cx,cy,40,0,Math.PI*2);
      ctx.fillStyle=coreGr; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2);
      ctx.fillStyle='#3366ff'; ctx.shadowBlur=24; ctx.shadowColor='#0066ff'; ctx.fill(); ctx.shadowBlur=0;
      // Rotating rings
      for (let r=0; r<3; r++) {
        const ang=state.time*(0.5+r*0.2)+(r*Math.PI/3);
        ctx.beginPath();
        ctx.arc(cx,cy,28+r*6,ang,ang+Math.PI*1.2);
        ctx.strokeStyle=`rgba(50,150,255,${0.5-r*0.1})`; ctx.lineWidth=2; ctx.stroke();
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(timerInterval);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, [D, difficulty]);

  const dc = DIFF_COLOR[difficulty];
  const waveShieldR = WAVE_RADIUS[Math.min(ui.wave-1,3)];

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000 }}>
      <canvas ref={canvasRef} style={{ width:'100%',height:'100%',display:'block',cursor:'crosshair' }} />

      {ui.waveMsg && (
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'rgba(255,100,0,0.14)',border:'2px solid rgba(255,130,0,0.6)',borderRadius:12,padding:'18px 36px',color:'#ff9944',fontSize:20,fontWeight:'bold',fontFamily:'"Segoe UI",monospace',zIndex:30,backdropFilter:'blur(8px)',textAlign:'center',pointerEvents:'none' }}>
          {ui.waveMsg}
        </div>
      )}

      <div style={{ position:'absolute',top:20,left:20,color:'#00ffcc',fontFamily:'"Segoe UI",monospace',background:'rgba(4,4,14,0.92)',padding:20,borderRadius:12,border:'1px solid rgba(0,255,200,0.2)',backdropFilter:'blur(10px)',width:318,userSelect:'none',zIndex:10 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(0,255,200,0.2)',paddingBottom:10,marginBottom:12 }}>
          <h2 style={{ margin:0,fontSize:16 }}>LEVEL 7: IP Defense</h2>
          <span style={{ fontSize:11,color:dc,border:`1px solid ${dc}55`,borderRadius:4,padding:'2px 8px',textTransform:'uppercase' }}>{difficulty}</span>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:12 }}>
          <div style={{ flex:1,background:'rgba(255,50,50,0.08)',borderRadius:6,padding:'6px 8px',textAlign:'center' }}>
            <div style={{ fontSize:11,color:'#ff5555' }}>🔴 REAL PROBE</div>
            <div style={{ fontSize:10,color:'#555',marginTop:2 }}>Spiked — drains integrity</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,153,68,0.08)',borderRadius:6,padding:'6px 8px',textAlign:'center' }}>
            <div style={{ fontSize:11,color:'#ff9944' }}>🟠 DECOY</div>
            <div style={{ fontSize:10,color:'#555',marginTop:2 }}>Round — wastes shields</div>
          </div>
        </div>
        <div style={{ padding:'8px 10px',borderRadius:6,background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.12)',fontSize:12,color:'#99bbaa',marginBottom:14,minHeight:34 }}>{ui.statusMsg}</div>
        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:12 }}>
          <div>
            <div style={{ fontSize:11,color:'#555',marginBottom:3 }}>WAVE</div>
            <div style={{ fontSize:22,color:'#ffcc00',fontWeight:'bold' }}>{ui.wave}/{D.waveCount}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:11,color:'#555',marginBottom:3 }}>SHIELD RANGE</div>
            <div style={{ fontSize:18,fontWeight:'bold',color:waveShieldR>58?'#00ff88':waveShieldR>46?'#ffaa00':'#ff4444' }}>{waveShieldR}px</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11,color:'#555',marginBottom:3 }}>TIME</div>
            <div style={{ fontSize:26,fontWeight:'bold',color:ui.timer<15?'#ff4444':'#00ffcc' }}>{ui.timer}s</div>
          </div>
        </div>
        <div style={{ display:'flex',gap:4,marginBottom:14 }}>
          {Array.from({length:D.waveCount},(_,i) => (
            <div key={i} style={{ flex:1,height:5,borderRadius:3,background:i<ui.wave?'#ffcc00':'#222',transition:'background 0.4s' }} />
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5 }}>
            <span style={{ color:'#aaa' }}>Model Integrity</span>
            <span style={{ color:ui.integrity>60?'#00ffcc':ui.integrity>30?'#ffaa00':'#ff4444',fontWeight:'bold' }}>{ui.integrity}%</span>
          </div>
          <div style={{ background:'rgba(0,0,0,0.5)',height:12,borderRadius:6,overflow:'hidden',border:'1px solid rgba(0,255,200,0.2)' }}>
            <div style={{ background:ui.integrity>60?'linear-gradient(90deg,#00ffcc,#00ccff)':ui.integrity>30?'linear-gradient(90deg,#ffaa00,#ff6600)':'linear-gradient(90deg,#ff4444,#ff2222)',height:'100%',width:`${ui.integrity}%`,transition:'width 0.35s' }} />
          </div>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14 }}>
          <div style={{ padding:'10px 8px',background:'rgba(0,255,200,0.04)',borderRadius:8,border:'1px solid rgba(0,255,200,0.08)',textAlign:'center' }}>
            <div style={{ fontSize:11,color:'#444',marginBottom:3 }}>Active Shields</div>
            <div style={{ fontSize:20,color:'#00ff88',fontWeight:'bold' }}>{ui.barriersActive}/{D.maxShields}</div>
          </div>
          <div style={{ padding:'10px 8px',background:'rgba(255,170,68,0.04)',borderRadius:8,border:'1px solid rgba(255,170,68,0.1)',textAlign:'center' }}>
            <div style={{ fontSize:11,color:'#444',marginBottom:3 }}>Real Probes Blocked</div>
            <div style={{ fontSize:20,color:'#ffaa44',fontWeight:'bold' }}>{ui.probesDefeated}</div>
          </div>
          <div style={{ padding:8,background:'rgba(255,80,30,0.04)',borderRadius:8,border:'1px solid rgba(255,80,30,0.1)',textAlign:'center',gridColumn:'1 / -1' }}>
            <div style={{ fontSize:11,color:'#444',marginBottom:2 }}>Decoys Intercepted (wasted shields)</div>
            <div style={{ fontSize:16,color:'#ff8844',fontWeight:'bold' }}>{ui.decoysWasted}</div>
          </div>
        </div>
        <button onClick={onExit} style={{ width:'100%',padding:11,background:'linear-gradient(135deg,#1a2980,#26d0ce)',border:'none',borderRadius:7,color:'white',cursor:'pointer',fontSize:13,fontWeight:'bold' }}>Abort Defense</button>
      </div>

      {ui.status==='won' && (
        <div style={OVR}>
          <h1 style={{ color:'#00ffcc',fontSize:52,marginBottom:10,textShadow:'0 0 24px rgba(0,255,200,0.7)' }}>DEFENSE SUCCESSFUL</h1>
          <p style={{ fontSize:20,color:'#aaa' }}>Intellectual Property Secured — All 4 Waves Repelled</p>
          <div style={{ margin:'22px 0',textAlign:'center',lineHeight:2.2 }}>
            <p style={{ fontSize:18,color:'#00ffcc' }}>Integrity Remaining: <strong>{ui.integrity}%</strong></p>
            <p style={{ fontSize:18,color:'#ffaa44' }}>Real Probes Blocked: <strong>{ui.probesDefeated}</strong></p>
            <p style={{ fontSize:16,color:'#ff8844' }}>Decoys That Wasted Shields: <strong>{ui.decoysWasted}</strong></p>
          </div>
          <button onClick={onExit} style={BTN}>Continue →</button>
        </div>
      )}
      {ui.status==='lost' && (
        <div style={{ ...OVR,background:'rgba(14,0,0,0.97)' }}>
          <h1 style={{ color:'#ff3333',fontSize:52,marginBottom:10,textShadow:'0 0 24px rgba(255,50,50,0.7)' }}>BREACH DETECTED</h1>
          <p style={{ fontSize:20,color:'#aaa' }}>Model Extraction Complete</p>
          <p style={{ fontSize:14,color:'#ff9944',margin:'10px 0 4px',maxWidth:480,textAlign:'center' }}>
            Tip: Spiked red probes are real — orange round ones are decoys. Don't waste shields on decoys!
          </p>
          <p style={{ fontSize:18,color:'#ff6666',margin:'8px 0 22px' }}>Wave {ui.wave}/{D.waveCount} · Real Probes Blocked: {ui.probesDefeated}</p>
          <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry Defense</button>
        </div>
      )}
    </div>
  );
}

export default function Level7({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase==='instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}