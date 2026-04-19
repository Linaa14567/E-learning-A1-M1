import { useState, useEffect } from "react"
import { API_BASE, STUDENT } from "../constants"

export default function ProfilePage({ token }) {
  const [userId, setUserId] = useState(null)
  const [form,   setForm]   = useState({ name:"", email:"", phone:"", dob:"", gender:"", address:"", bio:"", joined:"" })
  const [imgErr, setImgErr] = useState(false)
  const [avatar, setAvatar] = useState(STUDENT.avatar)
  const [pw,     setPw]     = useState({ old:"", n1:"", n2:"" })
  const [msg,    setMsg]    = useState("")
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLP]    = useState(true)

  const headers  = { "Content-Type":"application/json", "Authorization":`Bearer ${token}` }
  const initials = (form.name||"?").split(" ").map(w => w[0]).slice(0,2).join("")

  useEffect(() => {
    fetch(`${API_BASE}/users/me`, { headers })
      .then(r => r.json())
      .then(d => {
        const u = d.data || d
        setUserId(u.id || u.user_id)
        setForm({
          name:    u.full_name || u.name || "",
          email:   u.email || "",
          phone:   u.phone_number || u.phone || "",
          dob:     u.date_of_birth || u.dob || "",
          gender:  u.gender || "",
          address: u.address || "",
          bio:     u.bio || "",
          joined:  u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month:"long", year:"numeric" }) : "",
        })
        if (u.profile_url || u.avatar) setAvatar(u.profile_url || u.avatar)
      })
      .catch(() => {})
      .finally(() => setLP(false))
  }, [token])

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { full_name:form.name, gender:form.gender?.toLowerCase(), bio:form.bio, address:form.address, profile_url:avatar }
      const res  = await fetch(`${API_BASE}/users/${userId}`, { method:"PATCH", headers, body:JSON.stringify(body) })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch(e) { setMsg("❌ " + e.message) }
    finally { setSaving(false) }
  }

  const changePw = () => {
    if (!pw.old||!pw.n1||!pw.n2) { setMsg("Please fill all fields."); return }
    if (pw.n1 !== pw.n2) { setMsg("Passwords don't match!"); return }
    setMsg("✅ Password changed!"); setPw({ old:"", n1:"", n2:"" })
    setTimeout(() => setMsg(""), 3000)
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
  const labelCls = "block text-[10px] font-bold text-slate-400 mb-1 tracking-widest uppercase"

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-slate-400">Loading profile…</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md">
              {!imgErr
                ? <img src={avatar} className="w-full h-full object-cover object-top" alt="profile" onError={() => setImgErr(true)} />
                : <span className="text-white font-black text-2xl" style={{ fontFamily:"'Outfit',sans-serif" }}>{initials}</span>}
            </div>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-slate-900 leading-tight" style={{ fontFamily:"'Outfit',sans-serif" }}>{form.name || "—"}</h2>
            <p className="text-sm font-semibold text-indigo-500 mb-2">{STUDENT.role}</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">{form.bio || "No bio yet."}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
              {form.address && <span>📍 {form.address}</span>}
              {form.joined  && <span>📅 Joined {form.joined}</span>}
              <span>🕐 Active 2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4" style={{ fontFamily:"'Outfit',sans-serif" }}>👤 Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["Name","name","Full name"],["Address","address","Your address"],["Date of Birth","dob","DD / MM / YYYY"],["Email","email","your@email.com"]].map(([label,key,ph]) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]:e.target.value }))} placeholder={ph} className={inputCls} />
            </div>
          ))}
          <div>
            <label className={labelCls}>Gender</label>
            <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender:e.target.value }))} className={inputCls + " appearance-none cursor-pointer"}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} placeholder="+855 xx xxx xxx" className={inputCls} />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className={labelCls}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio:e.target.value }))} rows={3} placeholder="Tell us about yourself…" className={inputCls + " resize-none"} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
          {saved && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">✓ Saved!</span>}
          {msg && !msg.startsWith("✅") && <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl">{msg}</span>}
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 border-none cursor-pointer shadow-sm transition-colors">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4" style={{ fontFamily:"'Outfit',sans-serif" }}>🔒 Change Password</h2>
        <div className="flex flex-col gap-3">
          <input type="password" placeholder="Old Password"     value={pw.old} onChange={e => setPw(p => ({ ...p, old:e.target.value }))} className={inputCls} />
          <input type="password" placeholder="New Password"     value={pw.n1}  onChange={e => setPw(p => ({ ...p, n1:e.target.value  }))} className={inputCls} />
          <input type="password" placeholder="Confirm Password" value={pw.n2}  onChange={e => setPw(p => ({ ...p, n2:e.target.value  }))} className={inputCls} />
        </div>
        {msg && <p className={"text-xs mt-2 font-semibold " + (msg.startsWith("✅") ? "text-emerald-600" : "text-rose-500")}>{msg}</p>}
        <div className="flex justify-end mt-4">
          <button onClick={changePw} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 border-none cursor-pointer shadow-sm transition-colors">
            Save Change
          </button>
        </div>
      </div>
    </div>
  )
}
