// import React from "react";
// import { Link } from "react-router-dom";
// // Assuming 'bg-brand-primary' and 'text-brand-secondary' are Tailwind classes
// // configured in your tailwind.config.js for your primary brand colors.

// export default function NotFound() {
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 ">
//       <h1 className="text-8xl sm:text-9xl font-black text-primary mb-4 animate-bounce-slow">
//         ERROR
//       </h1>

//       <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
//         404 🚫
//       </h2>

//       <p className="mb-10 text-lg text-gray-700 max-w-lg mx-auto border-l-4 border-primary pl-4">
//         We can't seem to find the resource you're looking for. It might have
//         been moved or doesn't exist.
//       </p>

//       <Link
//         to="/"
//         className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-xl hover:bg-[#1e307a] transition duration-300 ease-in-out tracking-wide uppercase"
//       >
//         Let's Get Back on Track
//       </Link>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stars = [
  { id: 1, cls: "w-[10px] h-[10px] bg-[#F59E0B] rounded-sm rotate-45 top-4 left-6",           delay: "0s"   },
  { id: 2, cls: "w-[8px]  h-[8px]  bg-[#F59E0B] rounded-sm rotate-45 bottom-12 right-4",      delay: "0.9s" },
  { id: 3, cls: "w-[13px] h-[13px] bg-[#a78bfa] rounded-full opacity-60 top-16 left-2",        delay: "0.4s" },
  { id: 4, cls: "w-[10px] h-[10px] bg-[#a78bfa] rounded-full opacity-50 bottom-8 left-8",      delay: "1.3s" },
  { id: 5, cls: "w-2 h-2 rounded-full bg-[#dce9ff] border-2 border-[#0088FF] top-40 right-2",  delay: "1.9s" },
  { id: 6, cls: "w-2 h-2 rounded-full bg-[#FF1493] opacity-60 top-10 right-12",                delay: "0.6s" },
];

function ProhibitIcon({ size }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "inline-block" }}
    >
      <circle cx="32" cy="32" r="27" stroke="#e05a00" strokeWidth="5"/>
      <line x1="14" y1="50" x2="50" y2="14" stroke="#e05a00" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

export default function NotFound() {
  const navigate  = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [dark,    setDark]    = useState(false);
  const [iconSize, setIconSize] = useState(42);

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const darkHandler = (e) => setDark(e.matches);
    mq.addEventListener("change", darkHandler);

    const updateSize = () => {
      const w = window.innerWidth;
      if (w >= 1280)      setIconSize(76);
      else if (w >= 1024) setIconSize(66);
      else if (w >= 640)  setIconSize(58);
      else                setIconSize(42);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      mq.removeEventListener("change", darkHandler);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&family=Inter:wght@300;400;500;600;700&family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap');

        html, body, #root {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes planetFloat {
          0%,100% { transform: translate(-50%,-50%) translateY(0px) rotate(0deg); }
          33%     { transform: translate(-50%,-50%) translateY(-12px) rotate(2deg); }
          66%     { transform: translate(-50%,-50%) translateY(6px) rotate(-1deg); }
        }
        @keyframes planetSpin {
          from { transform: translate(-50%,-50%) rotateX(72deg) rotateZ(0deg); }
          to   { transform: translate(-50%,-50%) rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes drift {
          0%,100% { transform: translateY(0) rotate(-6deg); }
          50%     { transform: translateY(-16px) rotate(-3deg); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.25; }
        }
        @keyframes twinkle {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.3; transform: scale(0.55); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(47,50,125,0.3); }
          50%     { box-shadow: 0 0 0 12px rgba(47,50,125,0); }
        }

        .nf-fade         { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .nf-drift        { animation: drift 5s ease-in-out infinite; }
        .nf-blink        { animation: blink 1.6s ease-in-out infinite; }
        .nf-twinkle      { animation: twinkle 2.4s ease-in-out infinite; }
        .nf-planet-float { animation: planetFloat 6s ease-in-out infinite; }
        .nf-pulse-btn    { animation: pulse-glow 2.5s ease-in-out infinite; }

        .nf-heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          text-transform: uppercase;
          color: #2F327D;
          line-height: 0.95;
          display: block;
        }
        .dark .nf-heading { color: #e2e8f0; }

        .nf-error { font-size: 72px;  letter-spacing: 2px; }
        @media (min-width: 640px)  { .nf-error { font-size: 100px; letter-spacing: 3px; } }
        @media (min-width: 1024px) { .nf-error { font-size: 116px; letter-spacing: 4px; } }
        @media (min-width: 1280px) { .nf-error { font-size: 132px; letter-spacing: 5px; } }

        .nf-404 { font-size: 42px; letter-spacing: 2px; opacity: 0.85; }
        @media (min-width: 640px)  { .nf-404 { font-size: 58px;  letter-spacing: 3px; } }
        @media (min-width: 1024px) { .nf-404 { font-size: 66px;  letter-spacing: 4px; } }
        @media (min-width: 1280px) { .nf-404 { font-size: 76px;  letter-spacing: 4px; } }

        .nf-btn {
          background: #2F327D;
          box-shadow: 0 6px 22px rgba(47,50,125,0.35);
          transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
          border: none;
          cursor: pointer;
        }
        .nf-btn:hover {
          background: #232660 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(47,50,125,0.5);
        }
        .nf-arrow { transition: transform 0.2s; }
        .nf-btn:hover .nf-arrow { transform: translateX(4px); }

        .planet-ring-static {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(72deg);
          border-radius: 50%; border-style: solid;
          border-color: rgba(47,50,125,0.22);
        }
        .planet-ring-anim {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%; border-style: solid;
          border-color: rgba(0,136,255,0.3);
          animation: planetSpin 10s linear infinite;
        }
      `}</style>

      <div className={dark ? "dark" : ""}>
        <div
          className="w-full h-screen overflow-hidden relative flex items-center justify-center transition-colors duration-500 bg-[#e8f4fd] dark:bg-[#0f1022]"
          style={{ fontFamily: "'Inter','Kantumruy Pro',sans-serif" }}
        >
          {/* Blobs */}
          <div className="fixed rounded-full pointer-events-none bg-[#bde0f8]/60 dark:bg-[#2F327D]/[0.15] w-64 h-64 -top-16 -right-14 sm:w-[420px] sm:h-[420px] sm:-top-28 sm:-right-20 lg:w-[560px] lg:h-[560px] lg:-top-44 lg:-right-28" />
          <div className="fixed rounded-full pointer-events-none bg-[#c8e8fa]/50 dark:bg-[#0088FF]/[0.08] w-48 h-48 -bottom-10 -left-10 sm:w-72 sm:h-72 lg:w-96 lg:h-96 lg:-bottom-24 lg:-left-20" />
          <div className="fixed rounded-full pointer-events-none bg-[#f0d6f5]/40 dark:bg-[#FF1493]/[0.06] w-32 h-32 top-[50%] left-[55%] lg:w-48 lg:h-48" />

          {/* Main */}
          <div className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-6 px-6 py-6 sm:px-12 sm:py-8 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16 lg:py-10 ${mounted ? "nf-fade" : "opacity-0"}`}>

            {/* ── TEXT ── */}
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-none lg:flex-1 overflow-hidden flex flex-col items-center text-center lg:items-start lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#2F327D]/10 dark:bg-[#2F327D]/30 text-[#2F327D] dark:text-[#a5b4fc] text-[10px] sm:text-[10.5px] font-semibold tracking-[2px] uppercase px-3.5 py-1.5 rounded-full mb-5 sm:mb-6 border border-[#2F327D]/10 dark:border-[#a5b4fc]/20">
                <span className="nf-blink w-1.5 h-1.5 rounded-full bg-[#2F327D] dark:bg-[#a5b4fc] block flex-shrink-0" />
                Error Status
              </div>

              {/* ERROR */}
              <span className="nf-heading nf-error w-full">ERROR</span>

              {/* 404 + icon */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-1">
                <span className="nf-heading nf-404">404</span>
                <ProhibitIcon size={iconSize} />
              </div>

              {/* Subtitle */}
              <div className="font-bold text-[10px] sm:text-[11px] tracking-[4px] uppercase text-[#0088FF] dark:text-[#60a5fa] mt-4 mb-3 sm:mb-4" style={{ fontFamily: "'Barlow Condensed',sans-serif", opacity: 0.55 }}>
                Page Not Found
              </div>

              {/* Divider */}
              <div className="w-9 h-[3px] rounded-full bg-gradient-to-r from-[#2F327D] to-[#0088FF] dark:from-[#a5b4fc] dark:to-[#60a5fa] mb-4 sm:mb-5" />

              {/* Description */}
              <p className="font-light leading-[1.85] mb-5 sm:mb-7 text-[#696984] dark:text-slate-400 text-[13px] sm:text-[14px] lg:text-[15px]" style={{ fontFamily: "'Inter',sans-serif" }}>
                The page you're looking for has drifted into the unknown. It may have been moved, deleted, or never existed at all.
              </p>

              {/* ── Back to Home button ── */}
              <button
                onClick={() => navigate("/")}
                className="nf-btn nf-pulse-btn inline-flex items-center gap-2 text-white font-medium rounded-full text-[13px] px-6 py-3 sm:text-[14px] sm:px-8 sm:py-3.5"
              >
                Back to Home
                <svg className="nf-arrow" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* ── ILLUSTRATION ── */}
            <div className="flex-shrink-0 relative w-48 h-52 sm:w-64 sm:h-72 lg:w-[300px] lg:h-[320px]">

              {/* Planet */}
              <div className="nf-planet-float absolute top-1/2 left-1/2 w-[70px] h-[70px] sm:w-[86px] sm:h-[86px] lg:w-[100px] lg:h-[100px]" style={{ transform: "translate(-50%,-50%)" }}>
                <div className="absolute inset-0 rounded-full blur-xl opacity-40 dark:opacity-60" style={{ background: "radial-gradient(circle,#0088FF,#2F327D)", transform: "scale(1.4)" }} />
                <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: "linear-gradient(135deg,#60a5fa 0%,#2F327D 60%,#1e1b4b 100%)", boxShadow: "0 8px 32px rgba(47,50,125,0.5),inset -10px -6px 0 rgba(0,0,0,0.2)" }}>
                  <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(120deg,rgba(255,255,255,0.18) 0%,transparent 60%)" }} />
                  <div className="absolute w-3 h-3 rounded-full bg-white/10 top-2.5 left-3" />
                  <div className="absolute w-2 h-2 rounded-full bg-white/[0.08] top-6 left-8" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-white/[0.12] top-10 left-3" />
                </div>
                <div className="planet-ring-static w-[110px] h-[110px] border-[12px] sm:w-[134px] sm:h-[134px] sm:border-[13px] lg:w-[156px] lg:h-[156px] lg:border-[15px] dark:border-[rgba(165,180,252,0.2)]" />
                <div className="planet-ring-anim w-[88px] h-[88px] border-[3px] sm:w-[108px] sm:h-[108px] lg:w-[126px] lg:h-[126px] border-dashed" />
              </div>

              {/* Stars */}
              {stars.map((s) => (
                <div key={s.id} className={`absolute nf-twinkle ${s.cls}`} style={{ animationDelay: s.delay }} />
              ))}

              {/* Astronaut */}
              <div className="nf-drift absolute -top-2 -right-2 sm:-top-4 sm:-right-4 lg:-top-5 lg:-right-5" style={{ filter: "drop-shadow(0 12px 24px rgba(47,50,125,0.3))" }}>
                <svg className="w-[86px] sm:w-[118px] lg:w-[142px] h-auto" viewBox="0 0 140 170" fill="none">
                  <defs>
                    <linearGradient id="nfS" x1="70" y1="60" x2="70" y2="160" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#dbeafe" /><stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                    <linearGradient id="nfV" x1="52" y1="36" x2="88" y2="72" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <filter id="nfF" x="-20%" y="-10%" width="140%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2F327D" floodOpacity="0.25" />
                    </filter>
                  </defs>
                  <ellipse cx="70" cy="108" rx="34" ry="42" fill="url(#nfS)" filter="url(#nfF)" />
                  <ellipse cx="58" cy="92" rx="10" ry="14" fill="white" opacity="0.18" transform="rotate(-15 58 92)" />
                  <circle cx="70" cy="55" r="30" fill="#dbeafe" filter="url(#nfF)" />
                  <circle cx="70" cy="55" r="28" fill="#eff6ff" />
                  <circle cx="70" cy="55" r="30" stroke="#bfdbfe" strokeWidth="3" fill="none" />
                  <ellipse cx="70" cy="56" rx="19" ry="18" fill="url(#nfV)" />
                  <ellipse cx="62" cy="48" rx="6" ry="4" fill="white" opacity="0.3" transform="rotate(-20 62 48)" />
                  <ellipse cx="74" cy="62" rx="3" ry="2" fill="white" opacity="0.15" transform="rotate(-20 74 62)" />
                  <circle cx="42" cy="55" r="4.5" fill="#bfdbfe" stroke="white" strokeWidth="1" />
                  <circle cx="98" cy="55" r="4.5" fill="#bfdbfe" stroke="white" strokeWidth="1" />
                  <rect x="60" y="82" width="20" height="10" rx="4" fill="#bfdbfe" />
                  <path d="M36 96 Q18 108 20 128" stroke="#c7d9f8" strokeWidth="17" strokeLinecap="round" fill="none" />
                  <circle cx="20" cy="129" r="9" fill="#bfdbfe" />
                  <path d="M104 96 Q122 108 120 124" stroke="#c7d9f8" strokeWidth="17" strokeLinecap="round" fill="none" />
                  <circle cx="120" cy="125" r="9" fill="#bfdbfe" />
                  <rect x="109" y="110" width="26" height="34" rx="4" fill="#FF1493" transform="rotate(12 109 110)" />
                  <rect x="109" y="110" width="26" height="34" rx="4" fill="white" opacity="0.15" transform="rotate(12 109 110)" />
                  <rect x="113" y="115" width="18" height="2.5" rx="1" fill="white" opacity="0.55" transform="rotate(12 113 115)" />
                  <rect x="113" y="120" width="18" height="2.5" rx="1" fill="white" opacity="0.55" transform="rotate(12 113 120)" />
                  <rect x="113" y="125" width="12" height="2.5" rx="1" fill="white" opacity="0.4" transform="rotate(12 113 125)" />
                  <rect x="56" y="100" width="28" height="20" rx="5" fill="#bfdbfe" />
                  <rect x="60" y="104" width="8" height="5" rx="2" fill="#2F327D" opacity="0.6" />
                  <rect x="71" y="104" width="8" height="5" rx="2" fill="#0088FF" opacity="0.7" />
                  <rect x="60" y="112" width="18" height="3" rx="1.5" fill="#93c5fd" opacity="0.6" />
                  <path d="M56 146 Q50 158 54 168" stroke="#c7d9f8" strokeWidth="15" strokeLinecap="round" fill="none" />
                  <ellipse cx="54" cy="168" rx="11" ry="6" fill="#bfdbfe" />
                  <path d="M84 146 Q90 158 86 168" stroke="#c7d9f8" strokeWidth="15" strokeLinecap="round" fill="none" />
                  <ellipse cx="86" cy="168" rx="11" ry="6" fill="#bfdbfe" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] tracking-[2px] uppercase whitespace-nowrap select-none text-[#696984]/50 dark:text-slate-500/60" style={{ fontFamily: "'Inter',sans-serif" }}>
            404 · page not found
          </div>
        </div>
      </div>
    </>
  );
}