import { useEffect, useRef, useState, useCallback } from 'react';

// ── Level 3: Supply Chain Compromise ──────────────────────────────────────────
// Mechanic: Dependency tree (SBOM). Packages arrive from external sources.
// Player must: (1) Read SBOM to understand dependency relationships
//              (2) VERIFY packages using cryptographic hash check (takes time)
//              (3) BLOCK malicious packages before they are "installed" into pipeline
//              (4) Manage a vulnerability score — known CVEs cost points
// Distinct: Dependency tree layout, hash verification mini-game, CVE management

const FONT = '"Share Tech Mono", monospace';
const OVR = { position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',fontFamily:FONT,zIndex:20,backdropFilter:'blur(8px)' };
const BTN = { marginTop:24,padding:'13px 40px',fontSize:15,fontWeight:'bold',background:'linear-gradient(135deg,#00c6a7,#0066ff)',border:'none',borderRadius:6,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT };

function InstructionScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('medium');
  const diffs = {
    easy:   { label:'🟢 Easy',   color:'#00ff88', desc:'Slow installs · 4s to verify · Max 3 installs · CVE penalty: −100pts' },
    medium: { label:'🟡 Medium', color:'#ffcc00', desc:'Normal speed · 3s verify · Max 2 installs · CVE penalty: −200pts' },
    hard:   { label:'🔴 Hard',   color:'#ff4444', desc:'Fast installs · 2s verify · Max 1 install · CVE penalty: −350pts' },
  };
  return (
    <div style={{ position:'fixed',inset:0,background:'linear-gradient(160deg,#020210 0%,#050525 100%)',fontFamily:FONT,color:'white',zIndex:1000,overflowY:'auto',padding:'20px 0' }}>
      <div style={{ maxWidth:660,width:'92%',background:'rgba(0,255,200,0.03)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:6,padding:38,margin:'20px auto' }}>
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ fontSize:10,letterSpacing:5,color:'#00ffcc',opacity:0.5,marginBottom:8 }}>ML-SEC TRAINING // LEVEL 3</div>
          <h1 style={{ margin:0,fontSize:26,color:'#00ffcc',letterSpacing:3 }}>SUPPLY CHAIN COMPROMISE</h1>
          <p style={{ margin:'8px 0 0',color:'#334455',fontSize:12,letterSpacing:2 }}>DEPENDENCY INTEGRITY DEFENSE</p>
        </div>
        <div style={{ background:'rgba(0,120,255,0.07)',border:'1px solid rgba(0,120,255,0.2)',borderRadius:4,padding:'14px 18px',marginBottom:18 }}>
          <div style={{ color:'#5599ff',fontSize:10,letterSpacing:3,marginBottom:8,fontWeight:'bold' }}>WHY THIS MATTERS IN REAL AI</div>
          <p style={{ margin:0,fontSize:12,color:'#8aaabb',lineHeight:1.85 }}>
            ML pipelines depend on third-party libraries (numpy, transformers, etc.). Attackers compromise these dependencies to inject malicious code. A <strong style={{ color:'#00ffcc' }}>Software Bill of Materials (SBOM)</strong> tracks all dependencies. Cryptographic <strong style={{ color:'#00ffcc' }}>hash verification</strong> ensures packages haven't been tampered with before installation.
          </p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ color:'#445',fontSize:10,letterSpacing:3,marginBottom:12 }}>HOW TO PLAY</div>
          <div style={{ display:'grid',gap:7 }}>
            {[
              { icon:'📦', t:'Packages arrive from external sources', d:'They queue at the intake. Each has a name, version, and claimed hash.' },
              { icon:'🔍', t:'Click VERIFY to run hash check', d:'Takes a few seconds. Reveals if hash matches (SAFE) or mismatches (MALICIOUS).' },
              { icon:'🛡️', t:'BLOCK malicious packages immediately', d:'+300 pts. Blocking unverified costs −50 pts (risk vs speed trade-off).' },
              { icon:'✅', t:'APPROVE safe packages', d:'+100 pts. Approving a malicious one = CVE penalty!' },
              { icon:'⚠️', t:'Watch the CVE feed for zero-days', d:'Some threats arrive as known CVEs — check the right panel for alerts.' },
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
            <div style={{ color:'#446655',fontSize:11,marginTop:5 }}>Reach 3000 pts before max installs</div>
          </div>
          <div style={{ flex:1,background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:4,padding:12,textAlign:'center' }}>
            <div style={{ color:'#ff4444',fontWeight:'bold',fontSize:12 }}>💀 LOSE</div>
            <div style={{ color:'#885555',fontSize:11,marginTop:5 }}>Too many malicious packages installed</div>
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
        <button onClick={() => onStart(difficulty)} style={{ width:'100%',padding:14,fontSize:14,fontWeight:'bold',background:'linear-gradient(135deg,#00c6a7,#0066ff)',border:'none',borderRadius:4,color:'white',cursor:'pointer',letterSpacing:2,fontFamily:FONT }}>
          INITIALIZE SBOM SCANNER →
        </button>
      </div>
    </div>
  );
}

const DIFF = {
  easy:   { verifyMs:4000, maxInstalls:3, spawnMs:3000, cvePenalty:100, target:3000 },
  medium: { verifyMs:3000, maxInstalls:2, spawnMs:2200, cvePenalty:200, target:3000 },
  hard:   { verifyMs:2000, maxInstalls:1, spawnMs:1600, cvePenalty:350, target:3000 },
};
const DC = { easy:'#00ff88', medium:'#ffcc00', hard:'#ff4444' };

const PKG_NAMES = ['numpy','pandas','torch','sklearn','scipy','pillow','requests','cryptography','transformers','datasets','tokenizers','huggingface-hub','einops','safetensors','accelerate','peft','tqdm','rich','click','fastapi'];
const CVE_IDS = ['CVE-2024-1234','CVE-2024-5678','CVE-2023-9012','CVE-2024-3456','CVE-2023-7890'];

function genHash(real=true) {
  const chars = '0123456789abcdef';
  if (real) return Array.from({length:64}, () => chars[Math.floor(Math.random()*16)]).join('');
  // Tampered: similar but slightly off
  const h = Array.from({length:64}, () => chars[Math.floor(Math.random()*16)]).join('');
  return h;
}

function spawnPackage(id) {
  const name = PKG_NAMES[Math.floor(Math.random()*PKG_NAMES.length)];
  const ver = `${Math.floor(Math.random()*3)+1}.${Math.floor(Math.random()*20)}.${Math.floor(Math.random()*10)}`;
  const isMalicious = Math.random() > 0.45;
  const isKnownCVE = isMalicious && Math.random() > 0.6;
  const claimedHash = genHash(true);
  const realHash = isMalicious ? genHash(false) : claimedHash;
  return {
    id, name, ver, isMalicious, isKnownCVE,
    cveId: isKnownCVE ? CVE_IDS[Math.floor(Math.random()*CVE_IDS.length)] : null,
    claimedHash, realHash,
    status: 'pending', // pending | verifying | verified | blocked | approved | installed
    verifyProgress: 0,
    timeAdded: Date.now(),
  };
}

function GameCanvas({ onExit, difficulty }) {
  const D = DIFF[difficulty];
  const [packages, setPackages] = useState([]);
  const [score, setScore] = useState(1000);
  const [malInstalls, setMalInstalls] = useState(0);
  const [status, setStatus] = useState('playing');
  const [cveLog, setCveLog] = useState([]);
  const [msg, setMsg] = useState('Packages arriving. VERIFY then BLOCK or APPROVE.');
  const pkgIdRef = useRef(0);
  const statusRef = useRef('playing');
  useEffect(() => { statusRef.current = status; }, [status]);

  // Spawn packages
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      if (statusRef.current !== 'playing') return;
      setPackages(prev => {
        if (prev.filter(p => p.status === 'pending' || p.status === 'verifying' || p.status === 'verified').length >= 6) return prev;
        const pkg = spawnPackage(pkgIdRef.current++);
        if (pkg.isKnownCVE) setCveLog(l => [{ id: pkg.cveId, pkg: pkg.name, ts: Date.now() }, ...l.slice(0,4)]);
        return [...prev, pkg];
      });
    }, D.spawnMs);
    return () => clearInterval(interval);
  }, [status, D]);

  // Auto-install after delay (packages pile up)
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      if (statusRef.current !== 'playing') return;
      setPackages(prev => {
        let newMalInstalls = 0;
        const next = prev.map(p => {
          if (p.status !== 'pending' && p.status !== 'verified') return p;
          const age = (Date.now() - p.timeAdded) / 1000;
          if (age > 8) {
            // Auto-install
            if (p.isMalicious) newMalInstalls++;
            return { ...p, status: 'installed' };
          }
          return p;
        });
        if (newMalInstalls > 0) {
          setMalInstalls(m => {
            const total = m + newMalInstalls;
            if (total >= D.maxInstalls) setStatus('lost');
            return total;
          });
          setScore(s => Math.max(0, s - D.cvePenalty * newMalInstalls));
          setMsg(`⚠️ ${newMalInstalls} malicious package(s) auto-installed! Score penalty applied.`);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [status, D]);

  // Verify progress
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setPackages(prev => prev.map(p => {
        if (p.status !== 'verifying') return p;
        const progress = p.verifyProgress + (100 / (D.verifyMs / 100));
        if (progress >= 100) {
          const hashMatch = p.claimedHash === p.realHash;
          return { ...p, verifyProgress: 100, status: 'verified', hashMatch };
        }
        return { ...p, verifyProgress: progress };
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [status, D]);

  const handleVerify = (pkgId) => {
    setPackages(prev => prev.map(p => p.id === pkgId && p.status === 'pending' ? { ...p, status: 'verifying', verifyProgress: 0 } : p));
    setMsg('🔍 Running SHA-256 hash verification...');
  };

  const handleBlock = (pkgId) => {
    setPackages(prev => {
      const pkg = prev.find(p => p.id === pkgId);
      if (!pkg || (pkg.status !== 'verified' && pkg.status !== 'pending')) return prev;
      if (pkg.isMalicious) {
        setScore(s => { const ns = s + 300; if (ns >= D.target) setStatus('won'); return ns; });
        setMsg(`✅ BLOCKED malicious ${pkg.name} v${pkg.ver} — supply chain attack prevented! +300`);
      } else {
        setScore(s => Math.max(0, s - 150));
        setMsg(`⚠️ False positive — ${pkg.name} was clean. −150 pts`);
      }
      return prev.map(p => p.id === pkgId ? { ...p, status: 'blocked' } : p);
    });
  };

  const handleApprove = (pkgId) => {
    setPackages(prev => {
      const pkg = prev.find(p => p.id === pkgId);
      if (!pkg || pkg.status !== 'verified') return prev;
      if (!pkg.isMalicious) {
        setScore(s => { const ns = s + 100; if (ns >= D.target) setStatus('won'); return ns; });
        setMsg(`✅ Approved clean ${pkg.name} v${pkg.ver} — +100 pts`);
      } else {
        setScore(s => Math.max(0, s - D.cvePenalty));
        setMalInstalls(m => {
          const total = m + 1;
          if (total >= D.maxInstalls) setStatus('lost');
          return total;
        });
        setMsg(`💀 APPROVED MALICIOUS ${pkg.name}! CVE installed. −${D.cvePenalty} pts`);
      }
      return prev.map(p => p.id === pkgId ? { ...p, status: 'installed' } : p);
    });
  };

  const dc = DC[difficulty];
  const activePkgs = packages.filter(p => ['pending','verifying','verified'].includes(p.status));
  const pct = Math.min(100, (score / D.target) * 100);

  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,fontFamily:FONT,background:'#020210',display:'flex',flexDirection:'column' }}>
      {/* HUD */}
      <div style={{ background:'rgba(0,5,20,0.98)',borderBottom:'1px solid rgba(0,255,200,0.2)',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <span style={{ color:'#00ffcc',fontSize:13,fontWeight:'bold',letterSpacing:2 }}>LEVEL 3 // SUPPLY CHAIN DEFENSE</span>
          <span style={{ fontSize:10,color:dc,border:`1px solid ${dc}44`,borderRadius:3,padding:'2px 7px' }}>{difficulty.toUpperCase()}</span>
        </div>
        <div style={{ display:'flex',gap:24,alignItems:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:9,color:'#445',letterSpacing:2 }}>SCORE / TARGET</div>
            <div style={{ fontSize:18,color:'#ffff00',fontWeight:'bold' }}>{score} <span style={{ fontSize:11,color:'#555' }}>/ {D.target}</span></div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:9,color:'#445',letterSpacing:2 }}>MAL INSTALLS / MAX</div>
            <div style={{ fontSize:18,color:malInstalls>0?'#ff4444':'#00ff88',fontWeight:'bold' }}>{malInstalls} / {D.maxInstalls}</div>
          </div>
          <button onClick={onExit} style={{ padding:'6px 14px',background:'rgba(255,50,50,0.1)',border:'1px solid rgba(255,50,50,0.3)',borderRadius:3,color:'#ff6688',cursor:'pointer',fontSize:10,fontFamily:FONT }}>ABORT</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:4,background:'#050520',flexShrink:0 }}>
        <div style={{ height:'100%',background:'linear-gradient(90deg,#0066ff,#00ffcc)',width:`${pct}%`,transition:'width 0.3s' }} />
      </div>

      <div style={{ flex:1,display:'flex',gap:0,overflow:'hidden' }}>
        {/* Main package queue */}
        <div style={{ flex:1,padding:20,overflowY:'auto',display:'flex',flexDirection:'column',gap:12 }}>
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:4 }}>PACKAGE INTAKE QUEUE</div>
          <div style={{ padding:'8px 12px',background:'rgba(0,255,200,0.04)',borderRadius:3,border:'1px solid rgba(0,255,200,0.1)',fontSize:11,color:'#7799aa',marginBottom:4 }}>{msg}</div>

          {activePkgs.length === 0 && (
            <div style={{ textAlign:'center',color:'#334',padding:'40px',fontSize:12 }}>Waiting for packages...</div>
          )}

          {activePkgs.map(pkg => {
            const age = Math.max(0, 8 - (Date.now() - pkg.timeAdded) / 1000);
            const urgency = age < 3;
            return (
              <div key={pkg.id} style={{ background:'rgba(0,20,40,0.8)',border:`1px solid ${urgency?'rgba(255,100,0,0.6)':pkg.status==='verified'?pkg.hashMatch?'rgba(0,255,136,0.4)':'rgba(255,50,50,0.5)':'rgba(0,100,200,0.3)'}`,borderRadius:4,padding:'14px 16px',transition:'border-color 0.3s' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
                  <div>
                    <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:4 }}>
                      <span style={{ color:'#00ffcc',fontWeight:'bold',fontSize:14 }}>{pkg.name}</span>
                      <span style={{ color:'#445',fontSize:11 }}>v{pkg.ver}</span>
                      {pkg.cveId && <span style={{ fontSize:10,color:'#ff4444',background:'rgba(255,0,0,0.1)',border:'1px solid rgba(255,0,0,0.3)',borderRadius:3,padding:'1px 6px' }}>⚠️ {pkg.cveId}</span>}
                    </div>
                    <div style={{ fontSize:10,color:'#445',fontFamily:'monospace' }}>
                      Hash: {pkg.claimedHash.slice(0,20)}...
                    </div>
                    {pkg.status === 'verified' && (
                      <div style={{ fontSize:10,marginTop:3,color:pkg.hashMatch?'#00ff88':'#ff4444',fontWeight:'bold' }}>
                        {pkg.hashMatch ? '✓ HASH VERIFIED — SIGNATURE MATCH' : '✗ HASH MISMATCH — TAMPERED PACKAGE!'}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10,color:urgency?'#ff6600':'#445',marginBottom:4 }}>Expires: {Math.floor(age)}s</div>
                    <div style={{ fontSize:10,color:pkg.status==='verified'?pkg.hashMatch?'#00ff88':'#ff4444':pkg.status==='verifying'?'#ffcc00':'#555',fontWeight:'bold' }}>
                      {pkg.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {pkg.status === 'verifying' && (
                  <div style={{ marginBottom:10 }}>
                    <div style={{ height:6,background:'#0a1020',borderRadius:3,overflow:'hidden' }}>
                      <div style={{ height:'100%',background:'linear-gradient(90deg,#0066ff,#00ffcc)',width:`${pkg.verifyProgress}%`,transition:'width 0.1s' }} />
                    </div>
                    <div style={{ fontSize:10,color:'#5599ff',marginTop:3 }}>Verifying hash... {Math.floor(pkg.verifyProgress)}%</div>
                  </div>
                )}

                <div style={{ display:'flex',gap:8 }}>
                  {pkg.status === 'pending' && (
                    <button onClick={() => handleVerify(pkg.id)} style={{ padding:'7px 14px',background:'rgba(0,100,255,0.2)',border:'1px solid rgba(0,100,255,0.4)',borderRadius:3,color:'#5599ff',cursor:'pointer',fontSize:11,fontWeight:'bold',fontFamily:FONT }}>
                      🔍 VERIFY HASH ({(D.verifyMs/1000).toFixed(0)}s)
                    </button>
                  )}
                  {(pkg.status === 'pending' || pkg.status === 'verified') && (
                    <button onClick={() => handleBlock(pkg.id)} style={{ padding:'7px 14px',background:'rgba(255,50,0,0.15)',border:'1px solid rgba(255,50,0,0.4)',borderRadius:3,color:'#ff6644',cursor:'pointer',fontSize:11,fontWeight:'bold',fontFamily:FONT }}>
                      🛡️ BLOCK {pkg.status !== 'verified' ? '(unverified −50)' : ''}
                    </button>
                  )}
                  {pkg.status === 'verified' && (
                    <button onClick={() => handleApprove(pkg.id)} style={{ padding:'7px 14px',background:'rgba(0,255,136,0.12)',border:'1px solid rgba(0,255,136,0.35)',borderRadius:3,color:'#44ff88',cursor:'pointer',fontSize:11,fontWeight:'bold',fontFamily:FONT }}>
                      ✅ APPROVE
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* History */}
          <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginTop:8 }}>RECENT DECISIONS</div>
          {packages.filter(p => ['blocked','installed'].includes(p.status)).slice(-5).reverse().map(pkg => (
            <div key={`h-${pkg.id}`} style={{ display:'flex',justifyContent:'space-between',padding:'6px 10px',background:'rgba(255,255,255,0.02)',borderRadius:3,fontSize:10 }}>
              <span style={{ color:'#556' }}>{pkg.name} v{pkg.ver}</span>
              <span style={{ color:pkg.status==='blocked'?pkg.isMalicious?'#00ff88':'#ff9900':pkg.isMalicious?'#ff4444':'#00ff88' }}>
                {pkg.status==='blocked'?(pkg.isMalicious?'✓ BLOCKED':'✗ FALSE POSITIVE'):(pkg.isMalicious?'💀 INSTALLED':'✓ APPROVED')}
              </span>
            </div>
          ))}
        </div>

        {/* Right: SBOM + CVE panel */}
        <div style={{ width:260,background:'rgba(0,5,20,0.95)',borderLeft:'1px solid rgba(0,255,200,0.12)',padding:16,display:'flex',flexDirection:'column',gap:12,overflowY:'auto' }}>
          <div>
            <div style={{ fontSize:9,color:'#00ffcc',letterSpacing:3,marginBottom:10 }}>SBOM DASHBOARD</div>
            {[
              { label:'Approved', count: packages.filter(p=>p.status==='installed'&&!p.isMalicious).length, color:'#00ff88' },
              { label:'Blocked', count: packages.filter(p=>p.status==='blocked'&&p.isMalicious).length, color:'#00ccff' },
              { label:'False Positives', count: packages.filter(p=>p.status==='blocked'&&!p.isMalicious).length, color:'#ff9900' },
              { label:'Mal Installed', count: malInstalls, color:'#ff4444' },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display:'flex',justifyContent:'space-between',padding:'8px 10px',background:'rgba(0,255,200,0.03)',borderRadius:3,marginBottom:4,border:'1px solid rgba(0,255,200,0.08)' }}>
                <span style={{ fontSize:11,color:'#667' }}>{label}</span>
                <span style={{ fontSize:14,color,fontWeight:'bold' }}>{count}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize:9,color:'#ff4444',letterSpacing:3,marginBottom:8 }}>CVE THREAT FEED</div>
            {cveLog.length === 0 && <div style={{ fontSize:11,color:'#334',textAlign:'center',padding:'16px 0' }}>No CVEs detected yet</div>}
            {cveLog.map((cve, i) => (
              <div key={i} style={{ padding:'8px 10px',background:'rgba(255,0,0,0.06)',borderRadius:3,marginBottom:5,border:'1px solid rgba(255,0,0,0.2)' }}>
                <div style={{ color:'#ff5555',fontSize:10,fontWeight:'bold' }}>{cve.id}</div>
                <div style={{ color:'#778',fontSize:10 }}>in {cve.pkg}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:'auto' }}>
            <div style={{ fontSize:9,color:'#445',letterSpacing:3,marginBottom:8 }}>PIPELINE SECURITY</div>
            <div style={{ display:'flex',gap:3 }}>
              {Array.from({length:D.maxInstalls}).map((_,i) => (
                <div key={i} style={{ flex:1,height:8,borderRadius:2,background:i<malInstalls?'#ff4444':'#00ff44' }} />
              ))}
            </div>
            <div style={{ fontSize:10,color:'#445',marginTop:4 }}>{D.maxInstalls - malInstalls} install slots remaining</div>
          </div>
        </div>
      </div>

      {status==='won' && (
        <div style={{ ...OVR,background:'rgba(0,10,20,0.97)' }}>
          <div style={{ fontSize:10,color:'#00ffcc',letterSpacing:5,marginBottom:10 }}>MISSION COMPLETE</div>
          <h1 style={{ color:'#00ffcc',fontSize:44,marginBottom:12,margin:'0 0 10px',textShadow:'0 0 20px #00ffcc66' }}>SUPPLY CHAIN SECURED</h1>
          <p style={{ color:'#668877',fontSize:16,margin:'0 0 20px' }}>Score target reached — pipeline integrity maintained</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:24,width:420 }}>
            {[['FINAL SCORE',score],['MAL INSTALLS',`${malInstalls}/${D.maxInstalls}`],['BLOCKED',packages.filter(p=>p.status==='blocked'&&p.isMalicious).length]].map(([l,v]) => (
              <div key={l} style={{ background:'rgba(0,255,200,0.05)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:4,padding:'12px 8px',textAlign:'center' }}>
                <div style={{ fontSize:9,color:'#445',letterSpacing:2,marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:18,color:'#00ffcc',fontWeight:'bold' }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={onExit} style={BTN}>Continue →</button>
        </div>
      )}
      {status==='lost' && (
        <div style={{ ...OVR,background:'rgba(15,0,5,0.97)' }}>
          <div style={{ fontSize:10,color:'#ff4444',letterSpacing:5,marginBottom:10 }}>MISSION FAILED</div>
          <h1 style={{ color:'#ff3333',fontSize:44,marginBottom:12,margin:'0 0 10px' }}>PIPELINE COMPROMISED</h1>
          <p style={{ color:'#778',fontSize:16,margin:'0 0 22px' }}>Too many malicious packages installed</p>
          <button onClick={() => window.location.reload()} style={{ ...BTN,background:'linear-gradient(135deg,#ff416c,#ff4b2b)' }}>Retry</button>
        </div>
      )}
    </div>
  );
}

export default function Level3({ onExit }) {
  const [phase, setPhase] = useState('instructions');
  const [diff, setDiff] = useState('medium');
  if (phase === 'instructions') return <InstructionScreen onStart={(d) => { setDiff(d); setPhase('game'); }} />;
  return <GameCanvas onExit={onExit} difficulty={diff} />;
}