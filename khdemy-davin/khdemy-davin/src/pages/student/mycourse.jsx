import { useState } from "react"

// ── DATA ──────────────────────────────────────────────────────────────────────
const DEFAULT_MODULES = [
  { id:1, title:"Foundations", lessons:[
    { id:"1.1", title:"Introduction to Big O",  duration:"8:24",  done:true  },
    { id:"1.2", title:"Memory Management",      duration:"12:10", done:true  },
  ]},
  { id:2, title:"Linear Structures", lessons:[
    { id:"2.1", title:"Arrays & Linked Lists",  duration:"28:30", done:false, active:true },
    { id:"2.2", title:"Stacks & Queues",        duration:"18:45", done:false, locked:true },
  ]},
  { id:3, title:"Non-Linear", lessons:[
    { id:"3.1", title:"Binary Search Trees",    duration:"22:00", done:false, locked:true },
    { id:"3.2", title:"Graph Traversals",       duration:"25:15", done:false, locked:true },
  ]},
]

const DEFAULT_TASKS = [
  { id:0, text:"Step 1: Watch the full video lesson",          done:true  },
  { id:1, text:"Step 2: Initialize a 'list' state variable",   done:false },
  { id:2, text:"Step 3: Map through the list items to render", done:false },
  { id:3, text:"Step 4: Implement an AddItem function",        done:false },
]

const QUIZ = [
  { q:"What is the time complexity of accessing an array element by index?",
    opts:["O(n)","O(log n)","O(1)","O(n²)"], ans:2 },
  { q:"Which data structure uses LIFO (Last In First Out) order?",
    opts:["Queue","Stack","Array","Linked List"], ans:1 },
  { q:"What is the main advantage of a linked list over an array?",
    opts:["Faster random access","Dynamic size — easy insert/delete","Less memory usage","Better cache performance"], ans:1 },
]

const STATIC_COMMENTS = [
  { id:1, name:"Prof. Sarah Mitchell", role:"Instructor", time:"2h ago", initials:"SM", color:"#6366f1",
    text:"Great question today! Remember: always handle the edge case of an empty list and a single-node list separately.",
    likes:124,
    replies:[
      { id:11, name:"James Anderson", role:"Top Student", time:"1h ago", initials:"JA", color:"#0ea5e9",
        text:"That edge case tripped me up on the last assignment. Thanks for the tip!", likes:18 },
    ],
  },
  { id:2, name:"Elena Rossi", role:"Student", time:"5h ago", initials:"ER", color:"#10b981",
    text:"Can someone explain when to use a doubly linked list instead of a singly linked list?",
    likes:9, replies:[],
  },
]

// ── LIGHT THEME ───────────────────────────────────────────────────────────────
const C = {
  bg:       "#f1f5f9",
  sidebar:  "#ffffff",
  card:     "#ffffff",
  border:   "#e2e8f0",
  text:     "#0f172a",
  sub:      "#475569",
  muted:    "#94a3b8",
  accent:   "#6366f1",
  accentBg: "#eef2ff",
  success:  "#10b981",
  warn:     "#f59e0b",
  pink:     "#ec4899",
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const Ava = ({ initials, color, size=38 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:800, color:"#fff", fontSize:size*0.36 }}>
    {initials}
  </div>
)

const RoleBadge = ({ role }) => {
  const m = {
    Instructor:   ["#eef2ff","#4f46e5"],
    "Top Student":["#fffbeb","#d97706"],
    Student:      ["#f0fdf4","#16a34a"],
  }
  const [bg,fg] = m[role] || m.Student
  return <span style={{ fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99, background:bg, color:fg, letterSpacing:".04em" }}>{role}</span>
}

const Bar = ({ pct, color="#6366f1", h=5 }) => (
  <div style={{ height:h, borderRadius:99, background:"#e2e8f0", overflow:"hidden" }}>
    <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:99, transition:"width .5s ease" }}/>
  </div>
)

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MyCourse({ course, onBack }) {
  const modules     = course?.modules || DEFAULT_MODULES
  const allLessons  = modules.flatMap(m => m.lessons)
  const startLesson = allLessons.find(l => l.active) || allLessons.find(l => !l.done) || allLessons[0]
  const courseAccent = course?.accent || "#6366f1"

  const [currentId,     setCurrentId]     = useState(startLesson?.id || "2.1")
  const [completed,     setCompleted]     = useState(allLessons.filter(l=>l.done).map(l=>l.id))
  const [tasks,         setTasks]         = useState(DEFAULT_TASKS)
  const [taskDone,      setTaskDone]      = useState(false)
  const [tab,           setTab]           = useState("lesson")
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [quizStep,      setQuizStep]      = useState(0)
  const [answers,       setAnswers]       = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [comments,      setComments]      = useState(STATIC_COMMENTS)
  const [newComment,    setNewComment]    = useState("")
  const [liked,         setLiked]         = useState([])

  const idx        = allLessons.findIndex(l => l.id === currentId)
  const lesson     = allLessons[idx] || allLessons[0]
  const prevLesson = allLessons[idx - 1]
  const nextLesson = allLessons[idx + 1]
  const totalDone  = completed.length
  const progress   = Math.round((totalDone / allLessons.length) * 100)
  const quizScore  = QUIZ.reduce((s,q,i) => s+(answers[i]===q.ans?1:0), 0)

  const goTo = (ls) => {
    if(!ls || ls.locked) return
    setCurrentId(ls.id)
    setTab("lesson")
    setTasks(DEFAULT_TASKS.map((t,i) => ({...t, done:i===0})))
    setTaskDone(false)
    setQuizStep(0); setAnswers({}); setQuizSubmitted(false)
  }

  const toggleTask = (id) => {
    if(id===0 || taskDone) return
    setTasks(ts => ts.map(t => t.id===id ? {...t,done:!t.done} : t))
  }

  const submitTask = () => {
    if(!tasks.every(t=>t.done)) return
    setTaskDone(true)
    setCompleted(p => p.includes(currentId) ? p : [...p, currentId])
  }

  const postComment = () => {
    if(!newComment.trim()) return
    setComments(p => [{ id:Date.now(), name:"Chhorn SeavLeng", role:"Student", time:"Just now", initials:"CS", color:courseAccent, text:newComment.trim(), likes:0, replies:[] }, ...p])
    setNewComment("")
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px;}
        button,input,textarea{font-family:inherit;}
        input::placeholder,textarea::placeholder{color:#94a3b8;}
      `}</style>

      {/* ── TOP NAV ── */}
      <nav style={{ background:"#fff", borderBottom:"1.5px solid #e2e8f0", padding:"0 24px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setSidebarOpen(s=>!s)}
            style={{ width:38, height:38, borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:16, color:C.sub, display:"flex", alignItems:"center", justifyContent:"center" }}>
            ☰
          </button>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>📚</div>
          {onBack && (
            <>
              <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:courseAccent, fontWeight:700 }}>My Courses</button>
              <span style={{ color:"#cbd5e1" }}>›</span>
            </>
          )}
          <span style={{ fontSize:14, fontWeight:700, color:C.text, maxWidth:240, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {course?.title || "Data Structures & Algorithms"}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:C.accentBg, borderRadius:99, padding:"6px 16px", border:"1.5px solid #c7d2fe" }}>
            <div style={{ width:64, height:5, borderRadius:99, background:"#e2e8f0", overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${courseAccent},#818cf8)`, borderRadius:99 }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:800, color:courseAccent }}>{progress}%</span>
          </div>
          <button onClick={() => goTo(nextLesson)}
            style={{ padding:"9px 20px", borderRadius:12, border:"none", background:nextLesson&&!nextLesson.locked?`linear-gradient(135deg,${courseAccent},#818cf8)`:"#e2e8f0", color:nextLesson&&!nextLesson.locked?"#fff":"#94a3b8", fontWeight:800, fontSize:13, cursor:nextLesson&&!nextLesson.locked?"pointer":"not-allowed", boxShadow:nextLesson&&!nextLesson.locked?`0 4px 14px ${courseAccent}40`:"none" }}>
            Next →
          </button>
        </div>
      </nav>

      <div style={{ display:"flex", flex:1 }}>

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <aside style={{ width:272, background:"#fff", borderRight:"1.5px solid #e2e8f0", display:"flex", flexDirection:"column", height:"calc(100vh - 62px)", position:"sticky", top:62, overflow:"hidden", flexShrink:0, boxShadow:"2px 0 10px rgba(0,0,0,.04)" }}>
            <div style={{ padding:"18px 18px 14px", borderBottom:"1.5px solid #f1f5f9" }}>
              <p style={{ fontSize:9, fontWeight:900, color:"#cbd5e1", letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>Course Content</p>
              <div style={{ background:"#f8fafc", borderRadius:12, padding:"12px 14px", border:"1.5px solid #e2e8f0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:12, color:C.muted }}>{totalDone}/{allLessons.length} lessons</span>
                  <span style={{ fontSize:12, fontWeight:800, color:courseAccent }}>{progress}%</span>
                </div>
                <Bar pct={progress} color={courseAccent} h={5}/>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"14px 10px" }}>
              {modules.map(mod => (
                <div key={mod.id} style={{ marginBottom:20 }}>
                  <p style={{ fontSize:9, fontWeight:900, color:"#cbd5e1", letterSpacing:".12em", padding:"0 8px", marginBottom:8, textTransform:"uppercase" }}>
                    Module {mod.id} — {mod.title}
                  </p>
                  {mod.lessons.map(ls => {
                    const isDone   = completed.includes(ls.id)
                    const isActive = ls.id === currentId
                    return (
                      <button key={ls.id} onClick={() => goTo(ls)}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 10px", borderRadius:12, border:"none", cursor:ls.locked?"not-allowed":"pointer", marginBottom:3, background:isActive?C.accentBg:"transparent", borderLeft:isActive?`2.5px solid ${courseAccent}`:"2.5px solid transparent", opacity:ls.locked?0.45:1, transition:"all .15s" }}>
                        <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isDone?"#ecfdf5":isActive?"#e0e7ff":"#f1f5f9", fontSize:12, color:isDone?"#10b981":isActive?courseAccent:"#94a3b8", border:`1px solid ${isDone?"#a7f3d0":isActive?"#c7d2fe":"#e2e8f0"}` }}>
                          {isDone?"✓":ls.locked?"🔒":"▶"}
                        </div>
                        <div style={{ flex:1, textAlign:"left" }}>
                          <p style={{ margin:0, fontSize:13, fontWeight:isActive?700:500, color:isActive?courseAccent:C.sub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ls.id} {ls.title}</p>
                          <p style={{ margin:0, fontSize:11, color:C.muted }}>⏱ {ls.duration}</p>
                        </div>
                        {isActive && <div style={{ width:7, height:7, borderRadius:"50%", background:courseAccent, flexShrink:0 }}/>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, overflowY:"auto", padding:"28px 36px", background:C.bg }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>

            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, fontSize:13, color:C.muted }}>
              {onBack && <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:courseAccent, fontWeight:700, fontSize:13 }}>← My Courses</button>}
              {onBack && <span style={{ color:"#cbd5e1" }}>›</span>}
              <span style={{ color:courseAccent, fontWeight:600 }}>{course?.title||"Data Structures"}</span>
              <span style={{ color:"#cbd5e1" }}>›</span>
              <span style={{ color:C.text }}>{lesson?.title}</span>
            </div>

            <h1 style={{ fontSize:26, fontWeight:900, color:C.text, marginBottom:8, lineHeight:1.2, letterSpacing:"-.02em" }}>
              {lesson?.id}. {lesson?.title}
            </h1>
            <p style={{ fontSize:14, color:C.muted, marginBottom:26 }}>
              {course?.description || "Understand the fundamental differences between static and dynamic linear data structures."}
            </p>

            {/* VIDEO PLAYER */}
            <div style={{ borderRadius:22, overflow:"hidden", marginBottom:28, boxShadow:"0 8px 32px rgba(99,102,241,.12)", border:"1.5px solid #e2e8f0" }}>
              <div style={{ position:"relative", paddingBottom:"50%", background:"#1e1b4b" }}>
                <img src={course?.img||"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=450&fit=crop"}
                  alt="lesson" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.6 }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 35%,rgba(30,27,75,.9))" }}/>
                <button style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer" }}>
                  <div style={{ width:74, height:74, borderRadius:"50%", background:"rgba(255,255,255,.2)", backdropFilter:"blur(12px)", border:"2px solid rgba(255,255,255,.5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(99,102,241,.4)" }}>
                    <span style={{ fontSize:28, marginLeft:5, color:"#fff" }}>▶</span>
                  </div>
                </button>
                <div style={{ position:"absolute", top:16, right:16, background:"rgba(0,0,0,.4)", backdropFilter:"blur(8px)", borderRadius:99, padding:"5px 14px", color:"#fff", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,.2)" }}>
                  ⏱ {lesson?.duration||"28:30"}
                </div>
              </div>
              {/* Controls */}
              <div style={{ background:"#1e1b4b", padding:"10px 20px", display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ color:"#fff", fontSize:18, cursor:"pointer" }}>▶</span>
                <span style={{ color:"#94a3b8", fontSize:12 }}>0:00 / {lesson?.duration||"28:30"}</span>
                <div style={{ flex:1, height:4, borderRadius:99, background:"#374151", cursor:"pointer" }}>
                  <div style={{ width:"0%", height:"100%", background:`linear-gradient(90deg,${courseAccent},#818cf8)`, borderRadius:99 }}/>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {["0.5x","1x","1.5x","2x"].map(s=>(
                    <button key={s} style={{ fontSize:11, color:s==="1x"?"#818cf8":"#6b7280", background:"none", border:"none", cursor:"pointer", fontWeight:s==="1x"?900:400 }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* TABS */}
            <div style={{ display:"flex", gap:4, marginBottom:24, background:"#f1f5f9", borderRadius:16, padding:5, border:"1.5px solid #e2e8f0" }}>
              {[["lesson","📖 Lesson"],["quiz","🧠 Quiz"],["discussion",`💬 Discussion (${comments.length})`]].map(([key,label])=>(
                <button key={key} onClick={()=>setTab(key)}
                  style={{ flex:1, padding:10, borderRadius:12, border:"none", cursor:"pointer", fontSize:14, fontWeight:600, background:tab===key?"#fff":"transparent", color:tab===key?courseAccent:C.muted, boxShadow:tab===key?"0 2px 8px rgba(0,0,0,.07)":"none", transition:"all .18s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ══ LESSON TAB ══ */}
            {tab==="lesson" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

                <div style={{ background:"#fff", borderRadius:20, padding:28, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <h2 style={{ fontSize:19, fontWeight:800, color:C.text, marginBottom:14 }}>{lesson?.title}</h2>
                  <p style={{ color:C.sub, lineHeight:1.8, fontSize:15, marginBottom:14 }}>
                    In this lesson, we explore <strong style={{ color:courseAccent }}>{lesson?.title}</strong>. Understanding the difference between static and dynamic data structures helps you choose the right tool for the right problem.
                  </p>
                  <p style={{ color:C.sub, lineHeight:1.8, fontSize:15, margin:0 }}>
                    Arrays store elements in contiguous memory — fast random access but costly insert/delete. Linked lists use pointers — flexible size, fast insert/delete but slower access.
                  </p>
                </div>

                {/* LEARNING TASKS */}
                <div style={{ background:"#fff", borderRadius:20, padding:28, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:`linear-gradient(135deg,${courseAccent},#818cf8)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:19, boxShadow:`0 4px 14px ${courseAccent}30` }}>✅</div>
                    <div>
                      <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:C.text }}>Learning Tasks</h3>
                      <p style={{ margin:0, fontSize:12, color:C.muted }}>{tasks.filter(t=>t.done).length} of {tasks.length} done</p>
                    </div>
                    <div style={{ marginLeft:"auto", width:90 }}>
                      <Bar pct={tasks.filter(t=>t.done).length/tasks.length*100} color={courseAccent} h={5}/>
                    </div>
                  </div>
                  {tasks.map(task=>(
                    <div key={task.id} onClick={()=>toggleTask(task.id)}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:14, cursor:task.id===0||taskDone?"default":"pointer", background:task.done?"#f0fdf4":"#f8fafc", border:`1.5px solid ${task.done?"#bbf7d0":"#e2e8f0"}`, marginBottom:8, transition:"all .15s" }}>
                      <div style={{ width:24, height:24, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:task.done?"#10b981":"#fff", border:`2px solid ${task.done?"#10b981":"#d1d5db"}`, color:"#fff", fontSize:13, transition:"all .2s" }}>
                        {task.done?"✓":""}
                      </div>
                      <span style={{ fontSize:14, color:task.done?C.muted:C.text, fontWeight:500, textDecoration:task.done?"line-through":"none" }}>{task.text}</span>
                    </div>
                  ))}
                  {taskDone
                    ? <div style={{ textAlign:"center", padding:16, borderRadius:14, background:"#f0fdf4", border:"1.5px solid #bbf7d0", marginTop:6 }}>
                        <p style={{ margin:0, fontWeight:800, color:"#16a34a", fontSize:15 }}>✅ Lesson completed! Great work!</p>
                      </div>
                    : <button onClick={submitTask}
                        style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:tasks.every(t=>t.done)?`linear-gradient(135deg,${courseAccent},#818cf8)`:"#e2e8f0", color:tasks.every(t=>t.done)?"#fff":"#94a3b8", fontWeight:800, fontSize:15, cursor:tasks.every(t=>t.done)?"pointer":"default", marginTop:6, boxShadow:tasks.every(t=>t.done)?`0 4px 16px ${courseAccent}35`:"none" }}>
                        {tasks.every(t=>t.done)?"✅ Submit & Complete Lesson":"Complete all tasks first"}
                      </button>
                  }
                </div>

                {/* RESOURCES */}
                <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <h3 style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:14 }}>📎 Resources</h3>
                  {[
                    { icon:"📄", label:"Complexity Cheat Sheet.pdf", sub:"PDF • 1.2 MB", bg:"#fee2e2" },
                    { icon:"💻", label:"Source Code Examples",       sub:"GitHub Repository", bg:"#f1f5f9" },
                  ].map((r,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:14, background:"#f8fafc", border:"1.5px solid #e2e8f0", cursor:"pointer", marginBottom:8 }}>
                      <div style={{ width:38, height:38, borderRadius:11, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{r.icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:0, fontWeight:700, fontSize:14, color:C.text }}>{r.label}</p>
                        <p style={{ margin:0, fontSize:12, color:C.muted }}>{r.sub}</p>
                      </div>
                      <span style={{ fontSize:16, color:C.muted }}>⬇</span>
                    </div>
                  ))}
                </div>

                {/* PREV / NEXT */}
                <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                  <button onClick={()=>goTo(prevLesson)} disabled={!prevLesson}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:14, border:"1.5px solid #e2e8f0", background:"#fff", cursor:prevLesson?"pointer":"not-allowed", fontSize:14, fontWeight:700, color:prevLesson?C.text:C.muted, opacity:prevLesson?1:0.45, boxShadow:"0 2px 6px rgba(0,0,0,.04)" }}>
                    ← Previous
                  </button>
                  <button onClick={()=>goTo(nextLesson)} disabled={!nextLesson||nextLesson?.locked}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 28px", borderRadius:14, border:"none", background:nextLesson&&!nextLesson.locked?`linear-gradient(135deg,${courseAccent},#818cf8)`:"#e2e8f0", cursor:nextLesson&&!nextLesson.locked?"pointer":"not-allowed", fontSize:14, fontWeight:800, color:nextLesson&&!nextLesson.locked?"#fff":"#94a3b8", opacity:nextLesson&&!nextLesson.locked?1:0.5, boxShadow:nextLesson&&!nextLesson.locked?`0 4px 16px ${courseAccent}35`:"none" }}>
                    Next Lesson →
                  </button>
                </div>
              </div>
            )}

            {/* ══ QUIZ TAB ══ */}
            {tab==="quiz" && (
              <div style={{ background:"#fff", borderRadius:20, padding:32, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                {!quizSubmitted ? (
                  <>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
                      <div style={{ width:50, height:50, borderRadius:15, background:C.accentBg, border:"1.5px solid #c7d2fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🧠</div>
                      <div>
                        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.text }}>Lesson Quiz</h2>
                        <p style={{ margin:0, fontSize:13, color:C.muted }}>Question {quizStep+1} of {QUIZ.length}</p>
                      </div>
                      <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                        {QUIZ.map((_,i)=>(
                          <div key={i} style={{ width:32, height:6, borderRadius:99, background:i<quizStep?"#10b981":i===quizStep?courseAccent:"#e2e8f0" }}/>
                        ))}
                      </div>
                    </div>
                    <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:20, lineHeight:1.6 }}>{QUIZ[quizStep].q}</h3>
                    {QUIZ[quizStep].opts.map((opt,i)=>(
                      <div key={i} onClick={()=>setAnswers(a=>({...a,[quizStep]:i}))}
                        style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:14, cursor:"pointer", border:`1.5px solid ${answers[quizStep]===i?courseAccent:"#e2e8f0"}`, background:answers[quizStep]===i?C.accentBg:"#fafafa", marginBottom:10, transition:"all .15s" }}>
                        <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, border:`2px solid ${answers[quizStep]===i?courseAccent:"#d1d5db"}`, background:answers[quizStep]===i?courseAccent:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {answers[quizStep]===i && <div style={{ width:8, height:8, borderRadius:"50%", background:"#fff" }}/>}
                        </div>
                        <span style={{ fontSize:14, color:answers[quizStep]===i?courseAccent:C.sub, fontWeight:answers[quizStep]===i?700:400 }}>{opt}</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:12 }}>
                      <button onClick={()=>setQuizStep(s=>Math.max(0,s-1))} disabled={quizStep===0}
                        style={{ padding:"10px 22px", borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", cursor:quizStep===0?"not-allowed":"pointer", fontSize:13, fontWeight:700, color:C.muted, opacity:quizStep===0?0.4:1 }}>
                        ← Previous
                      </button>
                      {quizStep<QUIZ.length-1
                        ? <button onClick={()=>setQuizStep(s=>s+1)}
                            style={{ padding:"10px 26px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${courseAccent},#818cf8)`, cursor:"pointer", fontSize:13, fontWeight:800, color:"#fff", boxShadow:`0 4px 14px ${courseAccent}35` }}>
                            Next →
                          </button>
                        : <button onClick={()=>setQuizSubmitted(true)}
                            style={{ padding:"10px 26px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#10b981,#059669)", cursor:"pointer", fontSize:13, fontWeight:800, color:"#fff", boxShadow:"0 4px 14px rgba(16,185,129,.35)" }}>
                            Submit Quiz ✓
                          </button>
                      }
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:"center", padding:"20px 0" }}>
                    <div style={{ width:84, height:84, borderRadius:"50%", background:quizScore===QUIZ.length?`linear-gradient(135deg,${courseAccent},#818cf8)`:"linear-gradient(135deg,#f59e0b,#d97706)", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, boxShadow:quizScore===QUIZ.length?`0 8px 32px ${courseAccent}40`:"0 8px 32px rgba(245,158,11,.35)" }}>
                      {quizScore===QUIZ.length?"🎉":"📝"}
                    </div>
                    <h2 style={{ fontSize:24, fontWeight:900, color:C.text, marginBottom:8 }}>
                      {quizScore===QUIZ.length?"Perfect Score!":"Good Effort!"}
                    </h2>
                    <p style={{ color:C.muted, marginBottom:24, fontSize:15 }}>
                      You got <strong style={{ color:courseAccent }}>{quizScore}</strong> / <strong style={{ color:C.text }}>{QUIZ.length}</strong> correct
                    </p>
                    <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:28 }}>
                      {QUIZ.map((q,i)=>(
                        <div key={i} style={{ width:44, height:44, borderRadius:13, background:answers[i]===q.ans?"#ecfdf5":"#fee2e2", border:`1.5px solid ${answers[i]===q.ans?"#a7f3d0":"#fca5a5"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:answers[i]===q.ans?"#10b981":"#ef4444" }}>
                          {answers[i]===q.ans?"✓":"✗"}
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>{ setQuizSubmitted(false); setQuizStep(0); setAnswers({}) }}
                      style={{ padding:"13px 34px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${courseAccent},#818cf8)`, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:14, boxShadow:`0 4px 16px ${courseAccent}35` }}>
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ══ DISCUSSION TAB ══ */}
            {tab==="discussion" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                  <h3 style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:14 }}>Ask a question or share an insight</h3>
                  <textarea value={newComment} onChange={e=>setNewComment(e.target.value)}
                    placeholder="What's on your mind about this lesson?"
                    style={{ width:"100%", minHeight:90, borderRadius:14, border:"1.5px solid #e2e8f0", padding:"12px 16px", fontSize:14, color:C.text, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box", background:"#f8fafc" }}/>
                  <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
                    <button onClick={postComment}
                      style={{ padding:"10px 24px", borderRadius:12, border:"none", background:newComment.trim()?`linear-gradient(135deg,${courseAccent},#818cf8)`:"#e2e8f0", color:newComment.trim()?"#fff":"#94a3b8", fontWeight:800, fontSize:14, cursor:newComment.trim()?"pointer":"default", boxShadow:newComment.trim()?`0 4px 14px ${courseAccent}35`:"none" }}>
                      ✉ Post Comment
                    </button>
                  </div>
                </div>

                {comments.map(c=>(
                  <div key={c.id} style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                    <div style={{ display:"flex", gap:14 }}>
                      <Ava initials={c.initials} color={c.color}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                          <span style={{ fontWeight:800, color:C.text, fontSize:14 }}>{c.name}</span>
                          <RoleBadge role={c.role}/>
                          <span style={{ color:C.muted, fontSize:12, marginLeft:"auto" }}>{c.time}</span>
                        </div>
                        <p style={{ color:C.sub, fontSize:14, lineHeight:1.7, marginBottom:12 }}>{c.text}</p>
                        <button onClick={()=>setLiked(p=>p.includes(c.id)?p.filter(x=>x!==c.id):[...p,c.id])}
                          style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:liked.includes(c.id)?"#ef4444":C.muted, fontWeight:700 }}>
                          {liked.includes(c.id)?"❤️":"🤍"} {c.likes+(liked.includes(c.id)?1:0)} Likes
                        </button>
                      </div>
                    </div>
                    {c.replies?.length > 0 && (
                      <div style={{ marginTop:16, marginLeft:52, display:"flex", flexDirection:"column", gap:10 }}>
                        {c.replies.map(r=>(
                          <div key={r.id} style={{ display:"flex", gap:12, padding:"14px 16px", borderRadius:16, background:"#f8fafc", border:"1.5px solid #e2e8f0" }}>
                            <Ava initials={r.initials} color={r.color} size={32}/>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                                <span style={{ fontWeight:800, color:C.text, fontSize:13 }}>{r.name}</span>
                                <RoleBadge role={r.role}/>
                                <span style={{ color:C.muted, fontSize:11, marginLeft:"auto" }}>{r.time}</span>
                              </div>
                              <p style={{ color:C.sub, fontSize:13, lineHeight:1.6, marginBottom:6 }}>{r.text}</p>
                              <button onClick={()=>setLiked(p=>p.includes(r.id)?p.filter(x=>x!==r.id):[...p,r.id])}
                                style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:liked.includes(r.id)?"#ef4444":C.muted, fontWeight:600 }}>
                                {liked.includes(r.id)?"❤️":"🤍"} {r.likes+(liked.includes(r.id)?1:0)}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}