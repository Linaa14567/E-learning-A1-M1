import { useState, useEffect } from "react"

/* ══════════════════════════════════════════════════════════════════════
   API — https://khdemy.anajak-khmer.site
   POST /courses/{course_id}/enroll   → { id, student_id, course_id }
   GET  /courses/enrollments          → [{ course_id, title, ... }]
══════════════════════════════════════════════════════════════════════ */
const API_BASE    = "https://khdemy.anajak-khmer.site"
const getToken    = () => localStorage.getItem("access_token")
const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
})

const enrollInCourse = async (courseId) => {
  try {
    const res  = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
      method: "POST", headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) return { success:false, error: data?.detail?.[0]?.msg || "Enrollment failed" }
    return { success:true, data }           // { id, student_id, course_id }
  } catch {
    return { success:false, error:"Network error. Please try again." }
  }
}

const getEnrolledCourses = async () => {
  try {
    const res  = await fetch(`${API_BASE}/courses/enrollments`, {
      method: "GET", headers: authHeaders(),
    })
    const data = await res.json()
    if (!res.ok) return { success:false, error: data?.detail?.[0]?.msg || "Failed to fetch" }
    return { success:true, data }
  } catch {
    return { success:false, error:"Network error. Please try again." }
  }
}

/* ══════════════════════════════════════════════════════════════════════
   BRAND DESIGN SYSTEM  (from Figma)
   Primary  #1b2d5b  |  Secondary #e53935  |  Accent #f5a623
   Fonts: heading1 48px · heading2 42px · heading3 36px
          Heading4 24px · button-text 20px · Description 20px
══════════════════════════════════════════════════════════════════════ */
const B = {
  /* colors */
  primary:   "#1b2d5b",
  primaryL:  "#2a4080",
  secondary: "#e53935",
  secondaryL:"#ff6b6b",
  accent:    "#f5a623",
  accentL:   "#ffc043",
  gray:      "#6b7280",
  grayL:     "#9ca3af",
  bg:        "#f8f9fc",
  white:     "#ffffff",
  border:    "#e5e7eb",
  borderD:   "#d1d5db",
  textDark:  "#111827",
  textMid:   "#374151",
  textLight: "#6b7280",
  /* fonts — match Figma */
  font:      "'Inter', 'Segoe UI', sans-serif",
  /* sizes */
  h1: 48, h2: 42, h3: 36, h4: 24,
  btn: 20, desc: 20, bold: 22, cardBold: 22, descBold: 18, h5: 20, newBtn: 16, footer: 26,
}

/* ── Google Fonts ──────────────────────────────────────────────────── */
if (!document.getElementById("khdemy-fonts")) {
  const l = document.createElement("link")
  l.id = "khdemy-fonts"
  l.rel = "stylesheet"
  l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
  document.head.appendChild(l)
}

/* ── Course list (replace with real API data if needed) ─────────────── */
const COURSES = [
  { id:1, title:"Data Structures & Algorithms", price:49,  cat:"Computer Science" },
  { id:2, title:"React & Modern Frontend",      price:39,  cat:"Web Development"  },
  { id:3, title:"UI/UX Design Principles",      price:0,   cat:"Design"           },
  { id:4, title:"Python for Data Science",      price:59,  cat:"Data Science"     },
  { id:5, title:"Machine Learning A–Z",         price:69,  cat:"AI / ML"          },
  { id:6, title:"Node.js & Express API",        price:45,  cat:"Backend"          },
  { id:7, title:"Cyber Security Basics",        price:39,  cat:"Security"         },
  { id:8, title:"Docker & Kubernetes",          price:55,  cat:"DevOps"           },
]

const fmt = n => n === 0 ? "Free" : `$${n}`

/* ── tiny helpers ─────────────────────────────────────────────────── */
function useField(init = "") {
  const [val, set] = useState(init)
  const [err, setErr] = useState("")
  return { val, set, err, setErr, clear: () => setErr("") }
}

/* ══════════════════════════════════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════════════════════════════════ */
function Label({ children, error, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display:"block", marginBottom:6,
      fontSize:13, fontWeight:600, fontFamily:B.font,
      color: error ? B.secondary : B.textMid,
      letterSpacing:".02em",
    }}>{children}</label>
  )
}

function ErrorMsg({ msg }) {
  return msg
    ? <p style={{ margin:"4px 0 0", fontSize:12, color:B.secondary, fontFamily:B.font }}>⚠ {msg}</p>
    : null
}

function TextInput({ label, placeholder, type="text", field, required, id }) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <Label htmlFor={id} error={field.err}>
        {label}{required && <span style={{color:B.secondary}}> *</span>}
      </Label>
      <input id={id} type={type} placeholder={placeholder} value={field.val}
        onChange={e => { field.set(e.target.value); field.setErr("") }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width:"100%", boxSizing:"border-box",
          padding:"12px 16px", borderRadius:10, fontSize:15,
          fontFamily:B.font, color:B.textDark, outline:"none",
          background: B.white,
          border:`1.5px solid ${field.err ? B.secondary : focus ? B.primary : B.border}`,
          boxShadow: focus ? `0 0 0 3px ${B.primary}18` : "0 1px 3px rgba(0,0,0,.05)",
          transition:"all .2s",
        }} />
      <ErrorMsg msg={field.err} />
    </div>
  )
}

function SelectInput({ label, options, field, required, id }) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <Label htmlFor={id} error={field.err}>
        {label}{required && <span style={{color:B.secondary}}> *</span>}
      </Label>
      <div style={{ position:"relative" }}>
        <select id={id} value={field.val}
          onChange={e => { field.set(e.target.value); field.setErr("") }}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width:"100%", boxSizing:"border-box",
            padding:"12px 40px 12px 16px", borderRadius:10, fontSize:15,
            fontFamily:B.font, color: field.val ? B.textDark : B.grayL,
            background: B.white, appearance:"none", cursor:"pointer", outline:"none",
            border:`1.5px solid ${field.err ? B.secondary : focus ? B.primary : B.border}`,
            boxShadow: focus ? `0 0 0 3px ${B.primary}18` : "0 1px 3px rgba(0,0,0,.05)",
            transition:"all .2s",
          }}>
          <option value="">Select…</option>
          {options.map((o,i) => (
            <option key={i} value={o.value ?? o} style={{color:B.textDark}}>
              {o.label ?? o}
            </option>
          ))}
        </select>
        <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
          color:B.grayL, pointerEvents:"none", fontSize:12 }}>▾</span>
      </div>
      <ErrorMsg msg={field.err} />
    </div>
  )
}

/* ── Step bar ───────────────────────────────────────────────────────── */
const STEP_LABELS = ["Personal Info", "Payment", "Confirmed"]

function StepBar({ step }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:40 }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < step, active = i === step, last = i === STEP_LABELS.length - 1
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: last ? 0 : 1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{
                width:40, height:40, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, fontWeight:700, fontFamily:B.font,
                color: done||active ? B.white : B.grayL,
                background: done ? B.accent : active ? B.primary : B.border,
                boxShadow: active ? `0 0 0 4px ${B.primary}28` : done ? `0 0 0 4px ${B.accent}28` : "none",
                transition:"all .35s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize:12, fontWeight:600, whiteSpace:"nowrap", fontFamily:B.font,
                color: done ? B.accent : active ? B.primary : B.grayL,
                transition:"color .35s",
              }}>{label}</span>
            </div>
            {!last && (
              <div style={{
                flex:1, height:2, margin:"0 10px", marginBottom:24, borderRadius:99,
                background: done ? B.accent : B.border, transition:"background .5s",
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   STEP 0 — Personal Information
══════════════════════════════════════════════════════════════════════ */
function FormStep({ preset, onNext }) {
  const name    = useField(preset?.name    || "")
  const email   = useField(preset?.email   || "")
  const phone   = useField(preset?.phone   || "")
  const dob     = useField(preset?.dob     || "")
  const gender  = useField(preset?.gender  || "")
  const course  = useField(preset?.courseId ? String(preset.courseId) : "")
  const address = useField(preset?.address || "")
  const [addrFocus, setAddrFocus] = useState(false)

  const selectedCourse = COURSES.find(c => c.id === Number(course.val))

  const validate = () => {
    let ok = true
    const req = (f, msg) => { if (!f.val.trim()) { f.setErr(msg); ok = false } }
    req(name,    "Full name is required")
    req(phone,   "Phone is required")
    req(address, "Address is required")
    req(course,  "Please select a course")
    if (!email.val.trim()) { email.setErr("Email is required"); ok = false }
    else if (!/\S+@\S+\.\S+/.test(email.val)) { email.setErr("Enter a valid email"); ok = false }
    if (!dob.val)    { dob.setErr("Date of birth is required"); ok = false }
    if (!gender.val) { gender.setErr("Please select gender"); ok = false }
    return ok
  }

  const submit = () => {
    if (!validate()) return
    onNext({ name:name.val, email:email.val, phone:phone.val,
      dob:dob.val, gender:gender.val, courseId:Number(course.val), address:address.val })
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom:32 }}>
        <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:600, color:B.secondary,
          fontFamily:B.font, letterSpacing:".06em", textTransform:"uppercase" }}>
          KHdemy Academy
        </p>
        <h1 style={{ margin:"0 0 10px", fontSize:B.h3, fontWeight:800, color:B.primary,
          fontFamily:B.font, lineHeight:1.15 }}>
          Course Enrollment
        </h1>
        <p style={{ margin:0, fontSize:B.desc, fontWeight:400, color:B.textLight,
          fontFamily:B.font, lineHeight:1.6 }}>
          Fill in your details below to enroll in a programme.
        </p>
      </div>

      {/* divider */}
      <div style={{ height:2, borderRadius:99, marginBottom:28,
        background:`linear-gradient(to right, ${B.primary}, ${B.accent}, transparent)` }} />

      {/* Selected course preview */}
      {selectedCourse && (
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px",
          borderRadius:12, marginBottom:28,
          background:`${B.primary}08`, border:`1.5px solid ${B.primary}20`,
          animation:"fadeUp .3s ease" }}>
          <div style={{ width:44, height:44, borderRadius:10, background:B.primary,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, color:B.white, fontWeight:800, fontFamily:B.font, flexShrink:0 }}>
            {selectedCourse.id}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ margin:"0 0 3px", fontSize:16, fontWeight:700, color:B.primary,
              fontFamily:B.font }}>{selectedCourse.title}</p>
            <span style={{ fontSize:12, fontWeight:600, color:B.secondary,
              fontFamily:B.font, textTransform:"uppercase", letterSpacing:".06em" }}>
              {selectedCourse.cat}
            </span>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ margin:0, fontSize:B.h4, fontWeight:800, color:B.accent,
              fontFamily:B.font }}>{fmt(selectedCourse.price)}</p>
          </div>
        </div>
      )}

      {/* Section label */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
        <div style={{ width:4, height:20, borderRadius:99, background:B.primary }} />
        <span style={{ fontSize:16, fontWeight:700, color:B.primary, fontFamily:B.font }}>
          Personal Details
        </span>
      </div>

      {/* Form grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 24px", marginBottom:18 }}>
        <TextInput label="Full Name"       placeholder="Chhorn SeavLeng"   field={name}  required id="f-name" />
        <TextInput label="Email Address"   placeholder="seav@khdemy.com"   field={email} required type="email" id="f-email" />
        <TextInput label="Phone Number"    placeholder="+855 12 345 678"   field={phone} required id="f-phone" />
        <TextInput label="Date of Birth"                                    field={dob}   required type="date" id="f-dob" />
        <SelectInput label="Gender"
          options={["Male","Female","Other","Prefer not to say"]}
          field={gender} required id="f-gender" />
        <SelectInput label="Programme"
          options={COURSES.map(c => ({ value:c.id, label:`${c.title} — ${fmt(c.price)}` }))}
          field={course} required id="f-course" />
      </div>

      {/* Address */}
      <div style={{ marginBottom:8 }}>
        <Label error={address.err}>
          Home Address<span style={{color:B.secondary}}> *</span>
        </Label>
        <textarea value={address.val}
          onChange={e => { address.set(e.target.value); address.clear() }}
          placeholder="123 Education Street, Phnom Penh, Cambodia"
          rows={3}
          onFocus={() => setAddrFocus(true)} onBlur={() => setAddrFocus(false)}
          style={{ width:"100%", boxSizing:"border-box", padding:"12px 16px",
            borderRadius:10, fontSize:15, fontFamily:B.font, color:B.textDark,
            resize:"vertical", background:B.white, outline:"none",
            border:`1.5px solid ${address.err ? B.secondary : addrFocus ? B.primary : B.border}`,
            boxShadow: addrFocus ? `0 0 0 3px ${B.primary}18` : "0 1px 3px rgba(0,0,0,.05)",
            transition:"all .2s", lineHeight:1.6 }} />
        <ErrorMsg msg={address.err} />
      </div>

      <div style={{ height:1, background:B.border, margin:"28px 0" }} />

      {/* Submit */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ margin:0, fontSize:13, color:B.grayL, fontFamily:B.font }}>
          Fields marked * are required
        </p>
        <button onClick={submit}
          style={{ display:"flex", alignItems:"center", gap:10,
            padding:"14px 32px", borderRadius:10, border:"none",
            background:B.primary, color:B.white,
            fontSize:B.btn, fontWeight:700, fontFamily:B.font, cursor:"pointer",
            boxShadow:`0 4px 16px ${B.primary}40`, transition:"all .18s" }}
          onMouseEnter={e => { e.currentTarget.style.background=B.primaryL; e.currentTarget.style.transform="translateY(-2px)" }}
          onMouseLeave={e => { e.currentTarget.style.background=B.primary; e.currentTarget.style.transform="translateY(0)" }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   STEP 1 — Payment (Bakong QR)
══════════════════════════════════════════════════════════════════════ */
function PaymentStep({ data, onSuccess, onBack }) {
  const course  = COURSES.find(c => c.id === data.courseId)
  const isFree  = !course || course.price === 0
  const [secs, setSecs]       = useState(180)
  const [paying, setPaying]   = useState(false)
  const [done, setDone]       = useState(false)
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    if (isFree) return
    const iv = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(iv)
  }, [isFree])

  const mm  = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss2 = String(secs % 60).padStart(2, "0")

  /* ── real API call ── */
  const handlePay = async () => {
    setPaying(true)
    setApiError("")
    const result = await enrollInCourse(data.courseId)
    if (!result.success) {
      setApiError(result.error)
      setPaying(false)
      return
    }
    setDone(true)
    setTimeout(onSuccess, 700)
  }

  /* free course → auto enroll */
  useEffect(() => {
    if (!isFree) return
    enrollInCourse(data.courseId).then(r => {
      if (r.success) setTimeout(onSuccess, 500)
      else setApiError(r.error)
    })
  }, [])

  if (isFree) return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:`${B.accent}20`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:30, margin:"0 auto 20px" }}>⚡</div>
      <p style={{ fontSize:B.h4, fontWeight:700, color:B.primary, fontFamily:B.font }}>
        Enrolling you in the free course…
      </p>
      {apiError && <p style={{ color:B.secondary, fontFamily:B.font, marginTop:12 }}>{apiError}</p>}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:600, color:B.secondary,
          fontFamily:B.font, letterSpacing:".06em", textTransform:"uppercase" }}>Step 2 of 3</p>
        <h2 style={{ margin:"0 0 6px", fontSize:B.h3, fontWeight:800, color:B.primary,
          fontFamily:B.font }}>Complete Payment</h2>
        <p style={{ margin:0, fontSize:B.desc, color:B.textLight, fontFamily:B.font }}>
          Scan the Bakong QR code with your banking app
        </p>
      </div>
      <div style={{ height:2, borderRadius:99, marginBottom:28,
        background:`linear-gradient(to right, ${B.primary}, ${B.accent}, transparent)` }} />

      {/* API error */}
      {apiError && (
        <div style={{ padding:"12px 16px", borderRadius:10, marginBottom:20,
          background:`${B.secondary}10`, border:`1px solid ${B.secondary}30` }}>
          <p style={{ margin:0, fontSize:14, color:B.secondary, fontFamily:B.font }}>⚠ {apiError}</p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

        {/* LEFT — QR */}
        <div style={{ background:B.white, borderRadius:16, padding:24,
          border:`1px solid ${B.border}`, boxShadow:"0 2px 16px rgba(0,0,0,.07)" }}>

          {/* Bank bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 14px", borderRadius:10, marginBottom:18,
            background:B.bg, border:`1px solid ${B.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:B.primary,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, color:B.white }}>🏦</div>
              <div>
                <p style={{ margin:"0 0 1px", fontSize:14, fontWeight:700, color:B.primary,
                  fontFamily:B.font }}>Bakong · NBC</p>
                <p style={{ margin:0, fontSize:11, color:B.grayL, fontFamily:B.font }}>National Bank of Cambodia</p>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ margin:"0 0 1px", fontSize:11, color:B.grayL, fontFamily:B.font,
                textTransform:"uppercase", letterSpacing:".06em" }}>Amount</p>
              <p style={{ margin:0, fontSize:20, fontWeight:800, color:B.secondary,
                fontFamily:B.font }}>${course.price}.00</p>
            </div>
          </div>

          {/* QR box */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
            <div style={{ position:"relative", padding:14, background:B.white,
              border:`2px solid ${B.border}`, borderRadius:12,
              boxShadow:"0 4px 24px rgba(0,0,0,.10)" }}>
              {/* corner markers */}
              {[{top:6,left:6,bw:"3px 0 0 3px",br:"6px 0 0 6px"},
                {top:6,right:6,bw:"3px 3px 0 0",br:"0 6px 0 0"},
                {bottom:6,left:6,bw:"0 0 3px 3px",br:"0 0 0 6px"},
                {bottom:6,right:6,bw:"0 3px 3px 0",br:"0 0 6px 0"}].map((p,i) => (
                <div key={i} style={{ position:"absolute", width:22, height:22,
                  borderColor:B.primary, borderStyle:"solid",
                  borderWidth:p.bw, borderRadius:p.br,
                  top:p.top, bottom:p.bottom, left:p.left, right:p.right }} />
              ))}
              <img src="/QR.jpg" alt="Bakong QR"
                style={{ width:176, height:176, display:"block", borderRadius:6 }}
                onError={e => { e.target.style.display="none"; document.getElementById("qr-svg").style.display="block" }} />
              <svg id="qr-svg" style={{ display:"none", width:176, height:176 }} viewBox="0 0 29 29">
                {[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],
                  [0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],[0,5],[6,5],[0,6],[1,6],[2,6],
                  [3,6],[4,6],[5,6],[6,6],[22,0],[23,0],[24,0],[25,0],[26,0],[27,0],[28,0],[22,1],[28,1],
                  [22,2],[24,2],[25,2],[26,2],[28,2],[22,3],[24,3],[26,3],[28,3],[22,4],[24,4],[25,4],
                  [26,4],[28,4],[22,5],[28,5],[22,6],[23,6],[24,6],[25,6],[26,6],[27,6],[28,6],[0,22],
                  [1,22],[2,22],[3,22],[4,22],[5,22],[6,22],[0,23],[6,23],[0,24],[2,24],[3,24],[4,24],
                  [6,24],[0,25],[6,25],[0,27],[1,27],[2,27],[3,27],[4,27],[5,27],[6,27],
                  [10,10],[11,10],[15,12],[18,14],[20,16],[13,18],[17,20]].map(([x,y],i) => (
                  <rect key={i} x={x} y={y} width={1} height={1} fill={B.textDark} />
                ))}
              </svg>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 14px", borderRadius:10, marginBottom:12,
            background: secs < 30 ? `${B.secondary}10` : B.bg,
            border:`1px solid ${secs < 30 ? B.secondary : B.border}`,
            transition:"all .5s" }}>
            <span style={{ fontSize:13, color:B.grayL, fontFamily:B.font }}>⏱ QR expires in</span>
            <span style={{ fontSize:20, fontWeight:800, color: secs < 30 ? B.secondary : B.primary,
              fontFamily:B.font }}>{mm}:{ss2}</span>
          </div>

          {/* Warning */}
          <div style={{ padding:"10px 14px", borderRadius:10,
            background:`${B.accent}15`, border:`1px solid ${B.accent}40` }}>
            <p style={{ margin:0, fontSize:12.5, color:"#92400e", fontFamily:B.font, lineHeight:1.5 }}>
              ⚠ Confirm merchant name shows <strong>Khdemy Academy</strong> before completing payment.
            </p>
          </div>
        </div>

        {/* RIGHT — Summary + actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Order summary */}
          <div style={{ background:B.white, borderRadius:14, padding:"20px 22px",
            border:`1px solid ${B.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
            <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:B.primary,
              fontFamily:B.font, letterSpacing:".04em", textTransform:"uppercase" }}>Order Summary</p>
            {[
              ["Programme", course.title],
              ["Student",   data.name],
              ["Email",     data.email],
              ["Phone",     data.phone],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between",
                padding:"8px 0", borderBottom:`1px solid ${B.border}` }}>
                <span style={{ fontSize:13, color:B.grayL, fontFamily:B.font }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:600, color:B.textDark, fontFamily:B.font,
                  maxWidth:"60%", textAlign:"right", overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", paddingTop:14 }}>
              <span style={{ fontSize:14, fontWeight:700, color:B.textMid, fontFamily:B.font }}>Total</span>
              <span style={{ fontSize:28, fontWeight:800, color:B.secondary,
                fontFamily:B.font }}>${course.price}.00</span>
            </div>
          </div>

          {/* How to pay */}
          <div style={{ background:B.white, borderRadius:14, padding:"18px 20px",
            border:`1px solid ${B.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
            <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:B.primary,
              fontFamily:B.font, textTransform:"uppercase", letterSpacing:".04em" }}>How to Pay</p>
            {["Open Bakong, ABA, or Wing app",
              "Tap 'Scan QR' or 'Pay by QR'",
              "Scan the QR code on the left",
              "Verify merchant = Khdemy Academy",
              "Confirm amount and complete"].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
                  background:`${B.primary}15`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:11, fontWeight:800, color:B.primary,
                  fontFamily:B.font, marginTop:1 }}>{i+1}</div>
                <span style={{ fontSize:13, color:B.textMid, fontFamily:B.font, lineHeight:1.5 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* ── CONFIRM BUTTON → calls POST /courses/{id}/enroll ── */}
          <button onClick={handlePay} disabled={paying || done}
            style={{ padding:"15px", borderRadius:10, border:"none",
              background: done ? "#059669" : paying ? B.border : B.primary,
              color: paying ? B.grayL : B.white,
              fontSize:B.btn, fontWeight:700, fontFamily:B.font,
              cursor: paying||done ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              boxShadow: paying||done ? "none" : `0 4px 16px ${B.primary}40`,
              transition:"all .3s" }}>
            {done   ? "✓  Enrolled Successfully!" :
             paying ? <><Spin /> Enrolling via API…</> :
             "✓  I Have Completed Payment"}
          </button>

          <button onClick={onBack}
            style={{ padding:"11px", borderRadius:10,
              border:`1px solid ${B.border}`, background:"transparent",
              color:B.grayL, fontSize:14, fontWeight:500, fontFamily:B.font,
              cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=B.secondary; e.currentTarget.style.color=B.secondary }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=B.border; e.currentTarget.style.color=B.grayL }}>
            ← Cancel & Go Back
          </button>

          <p style={{ margin:0, textAlign:"center", fontSize:12, color:B.grayL,
            fontFamily:B.font }}>🔒 Secured by Bakong NBC · Encrypted</p>
        </div>
      </div>
    </div>
  )
}

const Spin = () => (
  <span style={{ display:"inline-block", animation:"spin 1s linear infinite", fontSize:18 }}>⟳</span>
)

/* ══════════════════════════════════════════════════════════════════════
   STEP 2 — Success
══════════════════════════════════════════════════════════════════════ */
function SuccessStep({ data, onDashboard, onViewCourse }) {
  const course = COURSES.find(c => c.id === data.courseId)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0
      const iv = setInterval(() => {
        v += 2; if (v >= 100) { setPct(100); clearInterval(iv) } else setPct(v)
      }, 16)
      return () => clearInterval(iv)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  const confetti = Array.from({length:26}, (_,i) => ({
    x: Math.random()*100, d: .7+Math.random()*1.3,
    size: 5+Math.random()*8, rot: Math.random()*360,
    color:[B.primary, B.secondary, B.accent, "#059669", "#7c3aed", B.primaryL][i%6],
  }))

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {confetti.map((p,i) => (
        <div key={i} style={{ position:"absolute", left:`${p.x}%`, top:-16,
          width:p.size, height:p.size, background:p.color, borderRadius:2,
          transform:`rotate(${p.rot}deg)`,
          animation:`confettiFall ${p.d}s ${i*.06}s ease-in forwards`,
          opacity:0, pointerEvents:"none" }} />
      ))}

      <div style={{ position:"relative", zIndex:1, display:"flex",
        flexDirection:"column", alignItems:"center", textAlign:"center", padding:"10px 0" }}>

        {/* Success badge */}
        <div style={{ width:100, height:100, borderRadius:"50%", marginBottom:24,
          background:`${B.primary}12`, border:`3px solid ${B.primary}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:46, animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)",
          boxShadow:`0 0 0 8px ${B.primary}08` }}>
          🎓
        </div>

        <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:700, color:B.secondary,
          fontFamily:B.font, letterSpacing:".08em", textTransform:"uppercase" }}>
          Enrollment Confirmed
        </p>
        <h1 style={{ margin:"0 0 10px", fontSize:B.h3, fontWeight:800, color:B.primary,
          fontFamily:B.font, lineHeight:1.1 }}>
          Welcome, {data.name.split(" ")[0]}! 🎉
        </h1>
        <p style={{ margin:"0 0 28px", fontSize:B.desc, color:B.textLight,
          fontFamily:B.font, lineHeight:1.7, maxWidth:400 }}>
          Your enrollment is confirmed. A receipt has been sent to{" "}
          <strong style={{color:B.primary}}>{data.email}</strong>.
        </p>

        {/* Progress bar */}
        <div style={{ width:"100%", maxWidth:400, marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:13, color:B.grayL, fontFamily:B.font }}>Enrollment Status</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#059669", fontFamily:B.font }}>{pct}%</span>
          </div>
          <div style={{ height:8, borderRadius:99, background:B.border, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:99,
              background:`linear-gradient(to right, ${B.primary}, ${B.accent})`,
              width:`${pct}%`, transition:"width .04s linear" }} />
          </div>
        </div>

        {/* Course card */}
        {course && (
          <div style={{ width:"100%", maxWidth:420, borderRadius:14, padding:"16px 20px",
            marginBottom:24, background:`${B.primary}08`, border:`1.5px solid ${B.primary}20`,
            display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:B.primary,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, color:B.white, fontWeight:800, fontFamily:B.font, flexShrink:0 }}>
              {course.id}
            </div>
            <div style={{ flex:1, textAlign:"left" }}>
              <p style={{ margin:"0 0 3px", fontSize:16, fontWeight:700, color:B.primary,
                fontFamily:B.font }}>{course.title}</p>
              <p style={{ margin:0, fontSize:12, color:B.secondary, fontFamily:B.font,
                fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>
                {course.cat} · Access Granted
              </p>
            </div>
            <div style={{ width:32, height:32, borderRadius:10, background:"#d1fae5",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, color:"#059669" }}>✓</div>
          </div>
        )}

        {/* Badges */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:32 }}>
          {["📧 Confirmation sent", "🔓 Full access active", "🏆 Certificate on completion"].map((t,i) => (
            <div key={i} style={{ padding:"8px 14px", borderRadius:99,
              background:B.white, border:`1px solid ${B.border}`,
              fontSize:13, color:B.textMid, fontFamily:B.font,
              boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>{t}</div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onDashboard}
            style={{ padding:"13px 30px", borderRadius:10, border:"none",
              background:B.primary, color:B.white,
              fontSize:B.btn, fontWeight:700, fontFamily:B.font, cursor:"pointer",
              boxShadow:`0 4px 16px ${B.primary}40`, transition:"all .18s" }}
            onMouseEnter={e => { e.currentTarget.style.background=B.primaryL; e.currentTarget.style.transform="translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.background=B.primary; e.currentTarget.style.transform="translateY(0)" }}>
            Go to Dashboard
          </button>
          <button onClick={onViewCourse}
            style={{ padding:"13px 28px", borderRadius:10,
              border:`1.5px solid ${B.border}`, background:B.white,
              color:B.textMid, fontSize:B.btn, fontWeight:600,
              fontFamily:B.font, cursor:"pointer", transition:"all .18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=B.primary; e.currentTarget.style.color=B.primary }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=B.border; e.currentTarget.style.color=B.textMid }}>
            View Course
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT  — import this one file and render <CourseEnrollment />
   Props (all optional):
     course       { id }  — pre-select a course
     onBack       fn      — called when user closes
     onDashboard  fn      — called on "Go to Dashboard"
     onViewCourse fn      — called on "View Course"
══════════════════════════════════════════════════════════════════════ */
export default function CourseEnrollment({ course: propCourse, onBack, onDashboard, onViewCourse }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(null)

  const handleFormDone = fd => {
    setData(fd)
    const c = COURSES.find(x => x.id === fd.courseId)
    setStep(!c || c.price === 0 ? 2 : 1)
  }

  return (
    <div style={{ minHeight:"100vh", backgroundColor:B.bg,
      backgroundImage:`radial-gradient(ellipse at 15% 15%, ${B.primary}08 0%, transparent 50%),
                       radial-gradient(ellipse at 85% 85%, ${B.accent}08 0%, transparent 50%)`,
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"40px 20px 64px", fontFamily:B.font }}>

      {/* Top accent bar */}
      <div style={{ position:"fixed", top:0, left:0, right:0, height:4, zIndex:20,
        background:`linear-gradient(to right, ${B.primary}, ${B.secondary}, ${B.accent})` }} />

      <div style={{ width:"100%", maxWidth: step===1 ? 860 : 660,
        transition:"max-width .4s cubic-bezier(.4,0,.2,1)" }}>

        {/* Top nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${B.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:B.primary,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, color:B.white, fontWeight:800, fontFamily:B.font }}>K</div>
            <span style={{ fontSize:16, fontWeight:800, color:B.primary,
              fontFamily:B.font, letterSpacing:".02em" }}>KHdemy</span>
          </div>
          {onBack && step < 2 && (
            <button onClick={onBack}
              style={{ padding:"6px 16px", borderRadius:8,
                border:`1px solid ${B.border}`, background:B.white,
                color:B.grayL, fontSize:13, fontWeight:500,
                fontFamily:B.font, cursor:"pointer", transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=B.secondary; e.currentTarget.style.color=B.secondary }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=B.border; e.currentTarget.style.color=B.grayL }}>
              ✕ Close
            </button>
          )}
        </div>

        {/* Main card */}
        <div style={{ background:B.white, borderRadius:20, padding:"40px 44px",
          border:`1px solid ${B.border}`,
          boxShadow:"0 8px 40px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04)" }}>
          <StepBar step={step} />
          {step===0 && <FormStep preset={propCourse ? {courseId:propCourse.id} : {}} onNext={handleFormDone} />}
          {step===1 && <PaymentStep data={data} onSuccess={() => setStep(2)} onBack={() => setStep(0)} />}
          {step===2 && <SuccessStep data={data}
            onDashboard={onDashboard || (() => setStep(0))}
            onViewCourse={onViewCourse || (() => {})} />}
        </div>

        <p style={{ textAlign:"center", fontSize:12, color:B.grayL,
          margin:"18px 0 0", fontFamily:B.font }}>
          © 2024 KHdemy Academy · All rights reserved
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes confettiFall { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(500px) rotate(540deg)} }
        @keyframes popIn { 0%{transform:scale(0)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }
        input::placeholder,textarea::placeholder { color:${B.grayL}; }
        select option { color:${B.textDark}; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  )
}