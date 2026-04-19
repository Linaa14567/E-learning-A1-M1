import { useState, useEffect, useRef } from "react";

// Dark mode hook — reads .dark class on <html>
function useDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}


// ── Scroll-reveal hook ──────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Staggered children reveal ───────────────────────────
function useStagger(count, delay = 80) {
  const [visible, setVisible] = useState(Array(count).fill(false));
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        Array.from({ length: count }).forEach((_, i) => {
          setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i * delay);
        });
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [count, delay]);
  return [ref, visible];
}

// ── Counter animation ──────────────────────────────────
function useCounter(target, duration = 1400, inView) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    const suffix = target.replace(/[0-9.]/g, "");
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * num) + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return val || "0";
}

const animStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(32px);          } to { opacity:1; transform:translateY(0);     } }
  @keyframes fadeDown  { from { opacity:0; transform:translateY(-24px);         } to { opacity:1; transform:translateY(0);     } }
  @keyframes fadeLeft  { from { opacity:0; transform:translateX(-40px);         } to { opacity:1; transform:translateX(0);     } }
  @keyframes fadeRight { from { opacity:0; transform:translateX(40px);          } to { opacity:1; transform:translateX(0);     } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(0.82);               } to { opacity:1; transform:scale(1);          } }
  @keyframes popIn     { from { opacity:0; transform:scale(0.6) translateY(12px);} to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes revealUp  { from { opacity:0; transform:translateY(48px) scale(.95);} to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes slideInCard { from { opacity:0; transform:translateX(-32px) scale(.97);} to { opacity:1; transform:translateX(0) scale(1); } }

  @keyframes wfloat   { 0%,100%{transform:translateY(0);}   50%{transform:translateY(-12px);} }
  @keyframes wfloatX  { 0%,100%{transform:translateX(0);}   50%{transform:translateX(10px);}  }
  @keyframes spin     { from{transform:rotate(0deg);}         to{transform:rotate(360deg);}    }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.7);opacity:.5;} }
  @keyframes shimmer  { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
  @keyframes heartbeat{ 0%,100%{transform:scale(1);} 14%{transform:scale(1.15);} 28%{transform:scale(1);} 42%{transform:scale(1.08);} }
  @keyframes orbDrift { from{transform:translate(0,0) scale(1);} to{transform:translate(24px,-18px) scale(1.06);} }
  @keyframes lineGrow { from{transform:scaleX(0);} to{transform:scaleX(1);} }
  @keyframes numberPop{ 0%{transform:scale(.7);opacity:0;} 60%{transform:scale(1.15);} 100%{transform:scale(1);opacity:1;} }

  .anim-fadeUp    { animation: fadeUp    .7s cubic-bezier(.22,1,.36,1) both; }
  .anim-fadeDown  { animation: fadeDown  .7s cubic-bezier(.22,1,.36,1) both; }
  .anim-fadeLeft  { animation: fadeLeft  .65s cubic-bezier(.22,1,.36,1) both; }
  .anim-fadeRight { animation: fadeRight .65s cubic-bezier(.22,1,.36,1) both; }
  .anim-scaleIn   { animation: scaleIn   .6s  cubic-bezier(.34,1.56,.64,1) both; }
  .anim-popIn     { animation: popIn     .65s cubic-bezier(.34,1.56,.64,1) both; }
  .anim-revealUp  { animation: revealUp  .75s cubic-bezier(.22,1,.36,1) both; }
  .anim-float     { animation: wfloat  4.5s ease-in-out infinite; }
  .anim-floatX    { animation: wfloatX 5s   ease-in-out infinite; }
  .anim-spin      { animation: spin    14s  linear infinite; }
  .anim-pulse     { animation: pulseDot 2.2s ease-in-out infinite; }
  .anim-heartbeat { animation: heartbeat 2.8s ease-in-out infinite; }
  .anim-orbDrift  { animation: orbDrift 9s ease-in-out infinite alternate; }

  .sr-wrap { opacity:0; transform:translateY(28px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .sr-wrap.visible { opacity:1; transform:translateY(0); }
  .sr-left { opacity:0; transform:translateX(-36px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .sr-left.visible { opacity:1; transform:translateX(0); }
  .sr-right { opacity:0; transform:translateX(36px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .sr-right.visible { opacity:1; transform:translateX(0); }
  .sr-scale { opacity:0; transform:scale(.88); transition: opacity .6s cubic-bezier(.34,1.2,.64,1), transform .6s cubic-bezier(.34,1.2,.64,1); }
  .sr-scale.visible { opacity:1; transform:scale(1); }

  .stat-chip { transition: transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s ease; }
  .stat-chip:hover { transform: translateY(-4px) scale(1.06); box-shadow: 0 10px 28px rgba(30,27,110,.18); }
  .stat-num.popped { animation: numberPop .55s cubic-bezier(.34,1.56,.64,1) both; }

  .divider-line { transform-origin: left; animation: lineGrow .8s .3s cubic-bezier(.22,1,.36,1) both; }

  /* Shimmer badge — light and dark variants */
  .shimmer-badge {
    background: linear-gradient(90deg, #eeedf8 25%, #d8d6f0 50%, #eeedf8 75%);
    background-size: 200% 100%;
    animation: shimmer 2.2s ease-in-out infinite;
  }
  .dark .shimmer-badge,
  .shimmer-badge-dark {
    background: linear-gradient(90deg, #2e2e45 25%, #3a3a58 50%, #2e2e45 75%);
    background-size: 200% 100%;
    animation: shimmer 2.2s ease-in-out infinite;
  }

  .who-cloud {
    position:relative; background:linear-gradient(135deg,#29b6f6,#0ea5e9);
    border-radius:50px 50px 50px 12px; padding:20px 44px;
    display:inline-flex; align-items:center; justify-content:center;
    width:fit-content; box-shadow:0 10px 36px rgba(14,165,233,0.32);
    transition: transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease;
  }
  .who-cloud:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 18px 48px rgba(14,165,233,.44); }
  .who-cloud::before { content:''; position:absolute; width:32px; height:32px; background:linear-gradient(135deg,#29b6f6,#0ea5e9); border-radius:50%; top:-16px; left:28px; }
  .who-cloud::after  { content:''; position:absolute; width:20px; height:20px; background:linear-gradient(135deg,#29b6f6,#0ea5e9); border-radius:50%; top:-26px; left:52px; }

  .mc-card { transition: transform .25s cubic-bezier(.34,1.2,.64,1), box-shadow .25s ease; }
  .mc-card:hover { transform: translateX(10px) scale(1.02); box-shadow:0 12px 36px rgba(0,0,0,.18); }
  .mc-2 { margin-left:32px; }
  .mc-3 { margin-left:64px; }
  @media (max-width:768px) { .mc-2,.mc-3 { margin-left:0; } }

  /* Person card — theme-aware */
  .pcard {
    background: var(--pcard-bg, white);
    border: 1.5px solid var(--pcard-border, #e5e7eb);
    border-radius:20px;
    transition: box-shadow .28s ease, transform .28s cubic-bezier(.34,1.2,.64,1), border-color .28s ease;
  }
  .pcard:hover { box-shadow:0 16px 44px rgba(30,27,110,.14); transform:translateY(-7px); border-color: var(--pcard-hover-border, #b3b0e0); }
  .pcard:hover .pcard-av { border-color:#1e1b6e !important; box-shadow:0 8px 28px rgba(30,27,110,.28) !important; }

  .pcard-av { transition: border-color .28s ease, box-shadow .28s ease, transform .28s cubic-bezier(.34,1.4,.64,1) !important; }
  .pcard:hover .pcard-av { transform: translateX(-50%) scale(1.07) !important; }

  .soc-btn { border:none; cursor:pointer; transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease; }
  .soc-btn:hover { transform:translateY(-4px) scale(1.16); box-shadow:0 8px 20px rgba(0,0,0,.22); }
  .soc-btn:active { transform:scale(.93); }

  .person-grid-mentor { display:grid; gap:48px 24px; justify-items:center; grid-template-columns:repeat(2,minmax(0,260px)); justify-content:center; }
  .person-grid-team-r1 { display:grid; gap:48px 16px; justify-items:center; grid-template-columns:repeat(3,1fr); margin-bottom:48px; }
  .person-grid-team-r2 { display:grid; gap:48px 16px; justify-items:center; grid-template-columns:repeat(4,1fr); }
  @media (max-width:700px) {
    .person-grid-mentor  { grid-template-columns:repeat(2,1fr); gap:40px 12px; }
    .person-grid-team-r1 { grid-template-columns:repeat(2,1fr); gap:40px 12px; }
    .person-grid-team-r2 { grid-template-columns:repeat(2,1fr); gap:40px 12px; }
  }
  @media (max-width:420px) {
    .person-grid-mentor  { grid-template-columns:1fr; max-width:240px; margin:0 auto; }
    .person-grid-team-r1 { grid-template-columns:1fr; max-width:240px; margin:0 auto 40px; }
    .person-grid-team-r2 { grid-template-columns:1fr; max-width:240px; margin:0 auto; }
  }

  .hero-grid { display:grid; grid-template-columns:1fr auto; gap:40px; align-items:center; }
  .hero-text { text-align:center; }
  .hero-divider { width:56px; height:4px; border-radius:99px; background:linear-gradient(90deg,#1e1b6e,#e91e8c); margin:12px auto 24px; }
  .hero-stat-row { display:flex; gap:28px; flex-wrap:wrap; justify-content:center; }
  @media (max-width:640px) { .hero-grid { grid-template-columns:1fr; } .hero-illo { display:none !important; } }

  .who-grid     { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
  @media (max-width:700px) { .who-grid { grid-template-columns:1fr; gap:48px; } }

  .mission-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
  @media (max-width:700px) { .mission-grid { grid-template-columns:1fr; gap:28px; } }

  .badge-pill { transition: transform .2s cubic-bezier(.34,1.4,.64,1), box-shadow .2s ease; }
  .badge-pill:hover { transform: scale(1.06); box-shadow: 0 6px 20px rgba(30,27,110,.18); }

  .title-line { transform-origin:left; transform:scaleX(0); transition: transform .7s .2s cubic-bezier(.22,1,.36,1); }
  .title-line.visible { transform:scaleX(1); }

  .mission-img-wrap { overflow:hidden; border-radius:20px; box-shadow:0 4px 24px rgba(0,0,0,.1); transition: box-shadow .3s ease, transform .3s cubic-bezier(.34,1.2,.64,1); }
  .mission-img-wrap:hover { box-shadow:0 16px 48px rgba(0,0,0,.18); transform:scale(1.02) rotate(.5deg); }
  .mission-img-wrap img { transition: transform .6s cubic-bezier(.25,.46,.45,.94); display:block; width:100%; height:300px; object-fit:cover; }
  .mission-img-wrap:hover img { transform:scale(1.06); }

  .float-badge { transition: transform .25s cubic-bezier(.34,1.4,.64,1), box-shadow .25s ease; }
  .float-badge:hover { transform: scale(1.1) !important; box-shadow: 0 8px 24px rgba(0,0,0,.18) !important; }
`;

const STATS = [
  { value:"120K+", label:"Learners"     },
  { value:"850+",  label:"Courses"      },
  { value:"90+",   label:"Countries"    },
  { value:"98%",   label:"Satisfaction" },
];

const MENTORS = [
  { name:"Mr. Kay Keo",       quote:"Each day I grow stronger. Soon unstoppable.",              img:"/cherkeomentor.jpg",  initials:"KK" },
  { name:"Miss. Eung Lyzhai", quote:"If you want the best, you've gotta put up with an oven.", img:"/cherzhiamentor.jpg", initials:"EL" },
];

const TEAM = [
  { name:"Chhay Davin",     role:"Group Leader",  quote:"It is soon will be in the past.",    img:"/davinleader.jpg",       initials:"CD" },
  { name:"Chhorn Seacleng", role:"Sub-Leader",     quote:"Brake and grow.",                   img:"/seavlengsubleader.jpg", initials:"CS" },
  { name:"Ngorn Sansarika", role:"Group Member",   quote:"It is soon will be in the past.",   img:"/sarikamember.jpg",      initials:"NS" },
  { name:"Lut Lina",        role:"Group Member",   quote:"Follow your way, not their words.", img:"/linamember.jpg",        initials:"LL" },
  { name:"Sroeum Saren",    role:"Group Member",   quote:"Let's grow together.",              img:"/sarean.jpg",            initials:"SS" },
  { name:"Sea Sengchhay",   role:"Group Member",   quote:"What you Give is What you Get.",    img:"/sengchhymember.jpg",    initials:"SH" },
  { name:"Bun Raksa",       role:"Group Member",   quote:"It is soon will be in the past.",   img:"/raksamember.jpg",       initials:"BR" },
];

function AnimStat({ value, label, inView, dark }) {
  const num = useCounter(value, 1400, inView);
  return (
    <div className="stat-chip" style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"default" }}>
      <div className={`stat-num${inView ? " popped" : ""}`}
        style={{ fontWeight:900, color: dark ? "#a5b4fc" : "#1e1b6e", lineHeight:1, marginBottom:4, fontSize:"clamp(20px,2.5vw,30px)" }}>
        {inView ? num : "0"}
      </div>
      <div style={{ fontSize:12, color: dark ? "#9b9baa" : "#9ca3af", fontWeight:500 }}>{label}</div>
    </div>
  );
}

function SocialIcons() {
  return (
    <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
      <button className="soc-btn" style={{ width:36,height:36,borderRadius:"50%",background:"#1877F2",padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </button>
      <button className="soc-btn" style={{ width:36,height:36,borderRadius:"50%",background:"#229ED9",padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M21.94 3.4L2.37 10.96c-1.3.52-1.29 1.26-.24 1.58l4.9 1.53 1.91 5.85c.23.65.12.9.8.9.52 0 .75-.24 1.04-.52l2.5-2.43 5.2 3.83c.96.53 1.65.26 1.89-.89l3.43-16.17c.35-1.38-.53-2.01-1.86-1.24z"/></svg>
      </button>
    </div>
  );
}

function PersonCard({ name, role, quote, img, initials, large, delay=0, visible=true, dark }) {
  const [imgErr, setImgErr] = useState(false);
  const avSize = large ? 110 : 90;
  const overlap = avSize / 2;

  const pcardBg     = dark ? "#1e1e30" : "white";
  const pcardBorder = dark ? "#2e2e45" : "#e5e7eb";
  const pcardHover  = dark ? "#4a4a7a" : "#b3b0e0";
  const avBg        = dark ? "#2e2e45" : "#eeedf8";
  const roleBg      = dark ? "#2e2e45" : "#eeedf8";
  const roleColor   = dark ? "#a5b4fc" : "#1e1b6e";
  const nameColor   = dark ? "#f1f1f1" : "#111827";
  const quoteColor  = dark ? "#9b9baa" : "#9ca3af";

  return (
    <div style={{
      position:"relative", paddingTop:overlap, width:"100%",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(.94)",
      transition: `opacity .6s ${delay}ms cubic-bezier(.22,1,.36,1), transform .6s ${delay}ms cubic-bezier(.22,1,.36,1)`,
    }}>
      <div className="pcard-av" style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:avSize,height:avSize,borderRadius:"50%",overflow:"hidden",background:avBg,border:`4px solid ${pcardBorder}`,boxShadow:"0 4px 20px rgba(30,27,110,0.12)",zIndex:10 }}>
        {!imgErr
          ? <img src={img} alt={name} onError={()=>setImgErr(true)} style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block" }} />
          : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:avSize*.3,fontWeight:800,color: dark ? "#9b9baa" : "#6b7280" }}>{initials}</div>
        }
      </div>
      <div className="pcard" style={{ "--pcard-bg": pcardBg, "--pcard-border": pcardBorder, "--pcard-hover-border": pcardHover, background: pcardBg, borderColor: pcardBorder, paddingTop:overlap+14,paddingBottom:20,paddingLeft:16,paddingRight:16,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center" }}>
        <div style={{ fontWeight:800,fontSize:large?17:14,color:nameColor,marginBottom:6 }}>{name}</div>
        {role && <div style={{ display:"inline-block",background:roleBg,color:roleColor,fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 12px",borderRadius:999,marginBottom:8 }}>{role}</div>}
        <p style={{ color:quoteColor,fontSize:12,fontStyle:"italic",lineHeight:1.6,marginBottom:14,minHeight:36 }}>"{quote}"</p>
        <SocialIcons />
      </div>
    </div>
  );
}

function PeopleIllustration() {
  return (
    <svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position:"relative",zIndex:10,width:"100%",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.1))" }}>
      <path d="M50 220 C10 198 8 140 18 95 C28 50 82 14 148 10 C214 6 278 28 308 72 C338 116 342 178 318 214 C294 250 244 268 192 270 C140 272 90 242 50 220Z" fill="#dce8ff" opacity="0.65"/>
      <rect x="108" y="22" width="144" height="94" rx="9" fill="#fff" stroke="#b3b0e0" strokeWidth="2"/>
      <rect x="116" y="30" width="128" height="58" rx="5" fill="#eeedf8"/>
      <rect x="126" y="58" width="13" height="22" rx="2" fill="#1e1b6e"/>
      <rect x="145" y="50" width="13" height="30" rx="2" fill="#4340a8"/>
      <rect x="164" y="54" width="13" height="26" rx="2" fill="#1e1b6e" opacity="0.55"/>
      <rect x="183" y="44" width="13" height="36" rx="2" fill="#1e1b6e"/>
      <rect x="202" y="56" width="13" height="24" rx="2" fill="#2196f3" opacity="0.75"/>
      <rect x="221" y="48" width="13" height="32" rx="2" fill="#e91e8c" opacity="0.8"/>
      <polyline points="126,64 158,56 183,50 215,46 234,52" stroke="#f5a623" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <rect x="172" y="116" width="16" height="12" rx="2" fill="#b3b0e0"/>
      <rect x="158" y="126" width="44" height="6" rx="3" fill="#b3b0e0"/>
      <circle cx="68" cy="152" r="17" fill="#FFB347"/>
      <path d="M54 144 Q68 134 82 144 Q78 130 68 128 Q58 130 54 144Z" fill="#5C3317"/>
      <path d="M46 195 Q68 174 90 195 L92 240 H44 Z" fill="#1e1b6e"/>
      <circle cx="122" cy="156" r="17" fill="#FDDBB4"/>
      <path d="M108 148 Q122 138 136 148 Q132 134 122 132 Q112 134 108 148Z" fill="#2c1810"/>
      <path d="M100 198 Q122 177 144 198 L146 240 H98 Z" fill="#e91e8c"/>
      <circle cx="180" cy="155" r="18" fill="#8B5E3C"/>
      <path d="M166 147 Q180 136 194 147 Q190 133 180 131 Q170 133 166 147Z" fill="#1a0a00"/>
      <path d="M158 198 Q180 176 202 198 L204 240 H156 Z" fill="#f5a623"/>
      <circle cx="238" cy="156" r="17" fill="#FDDBB4"/>
      <path d="M224 148 Q238 138 252 148 Q248 134 238 132 Q228 134 224 148Z" fill="#4a2a00"/>
      <path d="M216 198 Q238 177 260 198 L262 240 H214 Z" fill="#2196f3"/>
      <circle cx="292" cy="152" r="15" fill="#FFB347"/>
      <path d="M280 145 Q292 136 304 145 Q300 133 292 131 Q284 133 280 145Z" fill="#3d1f00"/>
      <path d="M272 193 Q292 174 312 193 L313 240 H271 Z" fill="#e53935"/>
      <line x1="38" y1="240" x2="322" y2="240" stroke="#b3b0e0" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="18" y="208" width="11" height="28" rx="3" fill="#a78866"/>
      <ellipse cx="24" cy="203" rx="15" ry="17" fill="#4ade80" opacity="0.75"/>
      <ellipse cx="14" cy="210" rx="10" ry="12" fill="#22c55e" opacity="0.7"/>
      <ellipse cx="34" cy="208" rx="9" ry="11" fill="#4ade80" opacity="0.85"/>
      <rect x="330" y="212" width="10" height="24" rx="3" fill="#a78866"/>
      <ellipse cx="335" cy="207" rx="13" ry="15" fill="#4ade80" opacity="0.7"/>
      <ellipse cx="325" cy="213" rx="8" ry="10" fill="#22c55e" opacity="0.65"/>
      <ellipse cx="344" cy="211" rx="8" ry="10" fill="#4ade80" opacity="0.8"/>
      <circle cx="95" cy="20" r="4" fill="#f5a623" opacity="0.8"/>
      <circle cx="260" cy="16" r="3" fill="#e91e8c" opacity="0.7"/>
      <circle cx="330" cy="60" r="5" fill="#2196f3" opacity="0.5"/>
    </svg>
  );
}

export default function AboutUs() {
  const dark = useDark();
  // Theme tokens
  const bg   = dark ? "#0f0f1a" : "#ffffff";
  const bg2  = dark ? "#1a1a2e" : "#eef2ff";
  const bg3  = dark ? "#1a1a2e" : "#f9fafb";
  const txt  = dark ? "#f1f1f1" : "#111827";
  const bdr  = dark ? "#2e2e45" : "#e5e7eb";
  const muted = dark ? "#9b9baa" : "#9ca3af";

  const [heroRef,    heroVis]    = useInView();
  const [statsRef,   statsVis]   = useInView();
  const [whoRef,     whoVis]     = useInView();
  const [whoLeftRef, whoLeftVis] = useInView();
  const [whoRightRef,whoRightVis]= useInView();
  const [missionRef, missionVis] = useInView();
  const [mImgRef,    mImgVis]    = useInView();
  const [mCardsRef,  mCardsVis]  = useInView();
  const [mentorRef,  mentorVis]  = useInView();
  const [teamRef,    teamVis]    = useInView();

  const [mentorGridRef, mentorVisible] = useStagger(MENTORS.length, 120);
  const [team1Ref,      team1Visible]  = useStagger(3, 100);
  const [team2Ref,      team2Visible]  = useStagger(4, 90);
  const [mcRef,         mcVisible]     = useStagger(3, 120);

  return (
    <>
      <style>{animStyles}</style>
      <div className="font-jakarta" style={{ minHeight:"100vh", overflowX:"hidden", background:bg, color:txt, transition:"background .3s ease, color .3s ease" }}>

        {/* ══ HERO ══ */}
        <section style={{ position:"relative", overflow:"hidden", padding:"56px 0", background:bg2, transition:"background .3s ease" }}>

          <div className="anim-orbDrift" style={{ position:"absolute", top:-60, right:"20%", width:220, height:220, borderRadius:"50%", background: dark ? "#4338ca" : "#c4b5fd", opacity: dark ? .2 : .35, pointerEvents:"none", filter:"blur(40px)" }} />
          <div className="anim-orbDrift" style={{ position:"absolute", bottom:-40, left:"10%", width:160, height:160, borderRadius:"50%", background: dark ? "#1d4ed8" : "#bfdbfe", opacity: dark ? .25 : .4, pointerEvents:"none", filter:"blur(36px)", animationDelay:"3s" }} />

          <div className="anim-float" style={{ position:"absolute", top:28, right:"38%", width:0, height:0, borderLeft:"10px solid transparent", borderRight:"10px solid transparent", borderBottom:"18px solid #4ADE80", pointerEvents:"none" }} />
          <div className="anim-pulse" style={{ position:"absolute", top:20, right:"22%", fontSize:20, color:"#fbbf24", pointerEvents:"none" }}>★</div>
          <div className="anim-spin"  style={{ position:"absolute", top:16, right:60, width:80, height:80, borderRadius:"50%", background: dark ? "#312e81" : "#c4b5fd", opacity: dark ? .4 : .5, pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:24, left:60, display:"flex", gap:4, flexWrap:"wrap", width:56, pointerEvents:"none" }}>
            {[...Array(6)].map((_,i) => <div key={i} className="anim-pulse" style={{ width:7, height:7, borderRadius:"50%", background: dark ? "#6366f1" : "#93c5fd", animationDelay:`${i*0.2}s` }} />)}
          </div>
          <div style={{ position:"absolute", bottom:24, right:60, display:"flex", gap:4, flexWrap:"wrap", width:56, pointerEvents:"none" }}>
            {[...Array(6)].map((_,i) => <div key={i} className="anim-pulse" style={{ width:7, height:7, borderRadius:"50%", background: dark ? "#6366f1" : "#93c5fd", animationDelay:`${i*0.15+0.5}s` }} />)}
          </div>

          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>
            <div className="hero-grid" style={{ position:"relative", zIndex:10 }}>

              <div ref={heroRef} className="hero-text">
                <h1 style={{ fontWeight:900, lineHeight:1.05, letterSpacing:"-0.03em", margin:0, fontSize:"clamp(36px,5vw,60px)",
                  opacity: heroVis?1:0, transform: heroVis?"translateY(0)":"translateY(36px)",
                  transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>
                  <span style={{ display:"block", color: dark ? "#a5b4fc" : "#1e1b6e" }}>About</span>
                  <span style={{ display:"block", color:"#e91e8c" }}>KHdemy</span>
                </h1>

                <div className="hero-divider" style={{
                  opacity: heroVis?1:0,
                  transform: heroVis?"scaleX(1)":"scaleX(0)",
                  transformOrigin:"center",
                  transition:"opacity .7s .2s ease, transform .7s .2s cubic-bezier(.22,1,.36,1)"
                }} />

                <p style={{ fontSize:14, lineHeight:1.8, maxWidth:480, margin:"0 auto 32px", color: muted,
                  opacity: heroVis?1:0, transform: heroVis?"translateY(0)":"translateY(20px)",
                  transition:"opacity .7s .3s ease, transform .7s .3s cubic-bezier(.22,1,.36,1)" }}>
                  KHdemy is an innovative e-learning platform connecting tech enthusiasts through quality courses and expert instructors.
                </p>

                <div ref={statsRef} className="hero-stat-row" style={{
                  opacity: heroVis?1:0, transform: heroVis?"translateY(0)":"translateY(20px)",
                  transition:"opacity .7s .45s ease, transform .7s .45s cubic-bezier(.22,1,.36,1)"
                }}>
                  {STATS.map((s) => (
                    <AnimStat key={s.label} value={s.value} label={s.label} inView={statsVis} dark={dark} />
                  ))}
                </div>
              </div>

              <div className="hero-illo" style={{ position:"relative", flexShrink:0, width:"clamp(200px,28vw,320px)",
                opacity: heroVis?1:0, transform: heroVis?"translateX(0) scale(1)":"translateX(40px) scale(.92)",
                transition:"opacity .85s .2s cubic-bezier(.22,1,.36,1), transform .85s .2s cubic-bezier(.22,1,.36,1)" }}>
                <div className="anim-orbDrift" style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background: dark ? "#312e81" : "#c4b5fd", opacity: dark ? .3 : .4, top:-28, right:-16, zIndex:0 }} />
                <img src="https://illustrations.popsy.co/amber/remote-work.svg" alt="illustration"
                  className="anim-float"
                  style={{ position:"relative", zIndex:1, width:"100%", objectFit:"contain", filter: dark ? "drop-shadow(0 4px 16px rgba(0,0,0,0.4)) brightness(0.9)" : "drop-shadow(0 4px 16px rgba(0,0,0,0.12))" }}
                  onError={e=>{ e.target.src="https://illustrations.popsy.co/violet/work-from-home.svg"; }} />
              </div>
            </div>
          </div>
        </section>

        {/* ══ WHO ARE WE ══ */}
        <section ref={whoRef} style={{ position:"relative", overflow:"hidden", padding:"80px 0", background:bg, transition:"background .3s ease" }}>

          {[
            { top:50,   right:90,  w:14, bg:"#2196f3", cls:"anim-float",  delay:"0s"   },
            { top:110,  right:52,  w:9,  bg:"#4ade80", cls:"anim-float",  delay:"0.6s" },
            { top:170,  right:140, w:8,  bg:"#e91e8c", cls:"anim-floatX", delay:"1.1s" },
            { top:200,  right:62,  w:11, bg:"#fbbf24", cls:"anim-float",  delay:"0.3s" },
            { bottom:50,left:"38%",w:16, bg:"#e91e8c", cls:"anim-pulse",  delay:"0.8s" },
            { bottom:30,right:90,  w:22, bg:"#f5a623", cls:"anim-floatX", delay:"1.4s" },
            { top:80,   left:40,   w:10, bg:"#1e1b6e", cls:"anim-float",  delay:"0.5s" },
          ].map((d,i) => (
            <div key={i} className={d.cls}
              style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", top:d.top, bottom:d.bottom, left:d.left, right:d.right, width:d.w, height:d.w, background:d.bg, animationDelay:d.delay, opacity: dark ? 0.4 : 1 }} />
          ))}

          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>
            <div className="who-grid" style={{ position:"relative", zIndex:10 }}>

              <div ref={whoLeftRef} style={{ display:"flex", flexDirection:"column", gap:28,
                opacity: whoLeftVis?1:0, transform: whoLeftVis?"translateX(0)":"translateX(-44px)",
                transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>

                <div className="who-cloud">
                  <div style={{ position:"absolute", width:36, height:36, top:-18, right:64, borderRadius:"50%", background:"linear-gradient(135deg,#38c7f8,#0ea5e9)" }} />
                  <div style={{ position:"absolute", width:22, height:22, top:-28, right:44, borderRadius:"50%", background:"linear-gradient(135deg,#38c7f8,#0ea5e9)" }} />
                  <div style={{ position:"absolute", width:18, height:18, top:-12, right:28, borderRadius:"50%", background:"linear-gradient(135deg,#38c7f8,#0ea5e9)" }} />
                  <h2 style={{ color:"white", fontWeight:900, whiteSpace:"nowrap", position:"relative", zIndex:1, margin:0, fontSize:"clamp(18px,2vw,22px)" }}>Who are we ?</h2>
                </div>

                <div style={{ position:"relative", width:"100%", maxWidth:340 }}>
                  <PeopleIllustration />
                  {[
                    { txt:"💻 Frontend Dev", top:-16,  right:-8,  bg: dark ? "#2e2e45" : "#eeedf8", delay:"0.5s", cls:"anim-float"  },
                    { txt:"⚙️ Backend Dev",  bottom:60, right:-24, bg: dark ? "#3a2040" : "#fce4f3", delay:"0.8s", cls:"anim-floatX" },
                    { txt:"🤝 Team of 7",    bottom:-14,left:8,   bg: dark ? "#1a2e20" : "#f0fdf4", delay:"1.1s", cls:"anim-float"  },
                  ].map((b,i) => (
                    <div key={i} className={`float-badge ${b.cls}`}
                      style={{ position:"absolute", background: dark ? "#1e1e30" : "white", borderColor: dark ? "#2e2e45" : "transparent", border: dark ? "1px solid #2e2e45" : "none", borderRadius:14, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, fontSize:12, fontWeight:700, color: dark ? "#f1f1f1" : "#1a1a2e", whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.12)", zIndex:20,
                        top:b.top, bottom:b.bottom, right:b.right, left:b.left, animationDelay:b.delay,
                        opacity: whoLeftVis?1:0,
                        transition:`opacity .6s ${0.4+i*0.15}s ease` }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:b.bg, display:"grid", placeItems:"center", fontSize:14, flexShrink:0 }}>{b.txt.split(" ")[0]}</div>
                      {b.txt.split(" ").slice(1).join(" ")}
                    </div>
                  ))}
                </div>
              </div>

              <div ref={whoRightRef} style={{ display:"flex", flexDirection:"column", gap:20,
                opacity: whoRightVis?1:0, transform: whoRightVis?"translateX(0)":"translateX(44px)",
                transition:"opacity .7s .15s cubic-bezier(.22,1,.36,1), transform .7s .15s cubic-bezier(.22,1,.36,1)" }}>

                <div className={`badge-pill ${dark ? "shimmer-badge-dark" : "shimmer-badge"}`}
                  style={{ display:"inline-flex", alignItems:"center", gap:8, border:`1px solid ${dark ? "#4a4a7a" : "#b3b0e0"}`, color: dark ? "#a5b4fc" : "#1e1b6e", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"8px 16px", borderRadius:999, width:"fit-content" }}>
                  🎓 ISTAD · Foundation 5th
                </div>

                <p style={{ fontWeight:700, lineHeight:2, maxWidth:400, fontSize:"clamp(15px,1.6vw,17px)", color: dark ? "#e5e7eb" : "#111827", margin:0 }}>
                  We are Foundation 5th students at ISTAD, building responsive and user-friendly web applications using frontend and backend technologies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MISSION ══ */}
        <section style={{ padding:"72px 0", borderTop:`1px solid ${bdr}`, borderBottom:`1px solid ${bdr}`, background: dark ? "#1a1a2e" : "#ffffff", transition:"background .3s ease, border-color .3s ease" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>

            <h2 ref={missionRef} style={{ fontWeight:900, letterSpacing:"-0.02em", marginBottom:48, lineHeight:1, fontSize:"clamp(32px,4vw,52px)",
              opacity: missionVis?1:0, transform: missionVis?"translateY(0)":"translateY(28px)",
              transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>
              <span style={{ color:"#dc2626" }}>Our </span><span style={{ color:txt }}>Mission</span>
            </h2>

            <div className="mission-grid">
              <div ref={mImgRef} className="mission-img-wrap" style={{ border:`1px solid ${bdr}`,
                opacity: mImgVis?1:0, transform: mImgVis?"translateX(0)":"translateX(-40px)",
                transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>
                <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80" alt="Mission" style={{ filter: dark ? "brightness(0.8)" : "none" }} />
              </div>

              <div ref={mcRef} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { bg:"#f5a623", icon:"🌐", title:"Flexible Learning",  desc:"Learn anytime, anywhere, at your own pace.", ml:0  },
                  { bg:"#e91e8c", icon:"🎧", title:"24/7 Support",       desc:"AI tutors and mentors, always available.",   ml:32 },
                  { bg:"#2196f3", icon:"🎯", title:"Progress Guarantee", desc:"Analytics and structured paths for real results.", ml:64 },
                ].map((c,i) => (
                  <div key={c.title} className="mc-card" style={{
                    background:c.bg, borderRadius:16, padding:"18px 22px", display:"flex", gap:14, alignItems:"flex-start",
                    boxShadow:"0 4px 16px rgba(0,0,0,0.1)", marginLeft:c.ml,
                    opacity: mcVisible[i]?1:0,
                    transform: mcVisible[i]?"translateX(0)":"translateX(40px)",
                    transition:`opacity .6s ${i*0.12}s cubic-bezier(.22,1,.36,1), transform .6s ${i*0.12}s cubic-bezier(.22,1,.36,1)`,
                  }}>
                    <div className="anim-heartbeat" style={{ width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, animationDelay:`${i*0.4}s` }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:800, color:"white", marginBottom:4 }}>{c.title}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.9)", lineHeight:1.6 }}>{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ MENTORS ══ */}
        <section style={{ padding:"80px 0", background:bg, transition:"background .3s ease" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>

            <div ref={mentorRef} style={{ textAlign:"center", marginBottom:56,
              opacity: mentorVis?1:0, transform: mentorVis?"translateY(0)":"translateY(28px)",
              transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>
              <h2 style={{ fontWeight:900, letterSpacing:"-0.02em", margin:0, fontSize:"clamp(24px,3vw,36px)", color:txt }}>
                Meet Our <span style={{ color: dark ? "#a5b4fc" : "#1e1b6e" }}>Mentors</span>
              </h2>
              <div className="title-line" style={{ width:48, height:4, borderRadius:99, background:"linear-gradient(90deg,#1e1b6e,#e91e8c)", margin:"12px auto 0",
                transform: mentorVis?"scaleX(1)":"scaleX(0)", transformOrigin:"center",
                transition:"transform .8s .25s cubic-bezier(.22,1,.36,1)" }} />
            </div>

            <div ref={mentorGridRef} className="person-grid-mentor">
              {MENTORS.map((m,i) => (
                <PersonCard key={m.name} large {...m} visible={mentorVisible[i]} delay={i*120} dark={dark} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ TEAM ══ */}
        <section style={{ padding:"80px 0", background:bg3, transition:"background .3s ease" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px" }}>

            <div ref={teamRef} style={{ textAlign:"center", marginBottom:56,
              opacity: teamVis?1:0, transform: teamVis?"translateY(0)":"translateY(28px)",
              transition:"opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)" }}>
              <h2 style={{ fontWeight:900, letterSpacing:"-0.02em", margin:0, fontSize:"clamp(24px,3vw,36px)", color:txt }}>
                Meet Our <span style={{ color: dark ? "#a5b4fc" : "#1e1b6e" }}>Team</span>
              </h2>
              <div style={{ width:48, height:4, borderRadius:99, background:"linear-gradient(90deg,#1e1b6e,#e91e8c)", margin:"12px auto 0",
                transform: teamVis?"scaleX(1)":"scaleX(0)", transformOrigin:"center",
                transition:"transform .8s .25s cubic-bezier(.22,1,.36,1)" }} />
            </div>

            <div ref={team1Ref} className="person-grid-team-r1">
              {TEAM.slice(0,3).map((m,i) => (
                <PersonCard key={m.name} {...m} visible={team1Visible[i]} delay={i*100} dark={dark} />
              ))}
            </div>

            <div ref={team2Ref} className="person-grid-team-r2">
              {TEAM.slice(3).map((m,i) => (
                <PersonCard key={m.name} {...m} visible={team2Visible[i]} delay={i*90} dark={dark} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}