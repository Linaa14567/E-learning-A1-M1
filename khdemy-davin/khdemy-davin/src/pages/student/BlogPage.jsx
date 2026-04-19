import { useState, useEffect } from "react"
import { API_BASE } from "../constants"
import DashBlogCard from "../components/cards/DashBlogCard"

export default function BlogPage({ token, savedBlogs, toggleSaveBlog }) {
  const [posts,    setPosts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [mode,     setMode]     = useState("list")
  const [draft,    setDraft]    = useState({ title:"", content:"", tag:"", thumbnail_url:"" })
  const [editId,   setEditId]   = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)
  const LIMIT = 9

  const headers = { "Content-Type":"application/json", "Authorization":`Bearer ${token}` }

  const fetchBlogs = async (p = 1) => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API_BASE}/blogs?page=${p}&limit=${LIMIT}`, { headers })
      if (!res.ok) throw new Error("Failed to load blogs")
      const data = await res.json()
      setPosts(data.blogs || []); setTotal(data.total || 0); setPage(p)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBlogs(1) }, [])

  const handleCreate = async () => {
    if (!draft.title.trim() || !draft.content.trim()) return
    setSaving(true)
    try {
      const body = { title:draft.title, content:draft.content, thumbnail_url:draft.thumbnail_url||"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=340&fit=crop", tags:draft.tag?[{name:draft.tag}]:[] }
      const res = await fetch(`${API_BASE}/blogs`, { method:"POST", headers, body:JSON.stringify(body) })
      if (!res.ok) throw new Error("Failed to create blog")
      setDraft({ title:"", content:"", tag:"", thumbnail_url:"" }); setMode("list"); fetchBlogs(1)
    } catch(e) { alert("Error: " + e.message) }
    finally { setSaving(false) }
  }

  const handleUpdate = async () => {
    if (!draft.title.trim() || !draft.content.trim()) return
    setSaving(true)
    try {
      const body = { title:draft.title, content:draft.content, thumbnail_url:draft.thumbnail_url, tags:draft.tag?[{name:draft.tag}]:[] }
      const res = await fetch(`${API_BASE}/blogs/${editId}`, { method:"PATCH", headers, body:JSON.stringify(body) })
      if (!res.ok) throw new Error("Failed to update blog")
      setDraft({ title:"", content:"", tag:"", thumbnail_url:"" }); setEditId(null); setMode("list"); fetchBlogs(page)
    } catch(e) { alert("Error: " + e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, { method:"DELETE", headers })
      if (!res.ok) throw new Error("Failed to delete")
      if (selected?.id === id) setSelected(null)
      fetchBlogs(page)
    } catch(e) { alert("Error: " + e.message) }
  }

  const openEdit = (b, e) => {
    e.stopPropagation()
    setDraft({ title:b.title, content:b.content, tag:b.tags?.[0]?.name||"", thumbnail_url:b.thumbnail_url||"" })
    setEditId(b.id); setMode("edit")
  }

  const totalPages = Math.ceil(total / LIMIT)

  // Detail
  if (selected) return (
    <div className="max-w-2xl">
      <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 border-none bg-transparent cursor-pointer">← Back to Blog</button>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {selected.thumbnail_url && <img src={selected.thumbnail_url} className="w-full h-52 object-cover" alt={selected.title} onError={e => e.target.style.display = "none"} />}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {selected.tags?.map(t => <span key={t.id} className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">{t.name}</span>)}
            <span className="text-xs text-slate-400">{new Date(selected.created_at).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily:"'Outfit',sans-serif" }}>{selected.title}</h1>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
          <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
            <button onClick={e => openEdit(selected, e)} className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 cursor-pointer hover:bg-indigo-100">✏️ Edit</button>
            <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 cursor-pointer hover:bg-rose-100">🗑 Delete</button>
          </div>
        </div>
      </div>
    </div>
  )

  // Write / Edit form
  if (mode === "write" || mode === "edit") return (
    <div className="max-w-2xl">
      <button onClick={() => { setMode("list"); setDraft({ title:"", content:"", tag:"", thumbnail_url:"" }); setEditId(null) }}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 border-none bg-transparent cursor-pointer">← Back to Blog</button>
      <h1 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily:"'Outfit',sans-serif" }}>{mode === "edit" ? "Edit Post" : "Write New Post"}</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        {[["Title *","title","Post title…"],["Tag","tag","e.g. React, Python…"],["Thumbnail URL","thumbnail_url","https://…"]].map(([label, key, ph]) => (
          <div key={key}>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest uppercase">{label}</label>
            <input value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]:e.target.value }))} placeholder={ph}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-indigo-400 transition-all" />
            {key === "thumbnail_url" && draft.thumbnail_url && <img src={draft.thumbnail_url} className="mt-2 w-full h-32 object-cover rounded-xl border border-slate-200" onError={e => e.target.style.display = "none"} alt="preview" />}
          </div>
        ))}
        <div>
          <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest uppercase">Content *</label>
          <textarea value={draft.content} onChange={e => setDraft(d => ({ ...d, content:e.target.value }))} rows={10} placeholder="Share your thoughts…"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-indigo-400 resize-y transition-all" />
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button onClick={() => { setMode("list"); setDraft({ title:"", content:"", tag:"", thumbnail_url:"" }); setEditId(null) }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white cursor-pointer">Discard</button>
          <button onClick={mode === "edit" ? handleUpdate : handleCreate} disabled={saving || !draft.title.trim() || !draft.content.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 border-none cursor-pointer shadow-sm">
            {saving ? "Saving…" : mode === "edit" ? "Save Changes ✓" : "Publish ✓"}
          </button>
        </div>
      </div>
    </div>
  )

  // List
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight" style={{ fontFamily:"'Outfit',sans-serif" }}>My Blog</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} post{total !== 1 ? "s" : ""} published</p>
        </div>
        <button onClick={() => setMode("write")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 border-none cursor-pointer shadow-sm transition-colors">
          <span>✍️</span> New Post
        </button>
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-5 animate-pulse">
              <div className="w-36 h-24 rounded-xl bg-slate-100 flex-shrink-0" />
              <div className="flex-1"><div className="h-4 bg-slate-100 rounded mb-2 w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-3xl mb-4">⚠️</div>
          <p className="text-slate-800 font-bold mb-1">Could not load posts</p>
          <p className="text-slate-400 text-sm mb-5">{error}</p>
          <button onClick={() => fetchBlogs(1)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 border-none cursor-pointer">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mb-4">✍️</div>
              <p className="text-slate-800 font-bold mb-1">No posts yet</p>
              <p className="text-slate-400 text-sm mb-5">Share your first learning story</p>
              <button onClick={() => setMode("write")} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 border-none cursor-pointer">Write First Post</button>
            </div>
          )}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map(b => (
                <DashBlogCard key={b.id} b={b} isSaved={savedBlogs.some(s => s.id === b.id)} onToggleSave={toggleSaveBlog} onClick={() => setSelected(b)} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => fetchBlogs(page - 1)} disabled={page === 1} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white cursor-pointer disabled:opacity-30 hover:border-indigo-300 transition-colors">← Prev</button>
              <span className="text-sm text-slate-400 px-3">{page} / {totalPages}</span>
              <button onClick={() => fetchBlogs(page + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 bg-white cursor-pointer disabled:opacity-30 hover:border-indigo-300 transition-colors">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
