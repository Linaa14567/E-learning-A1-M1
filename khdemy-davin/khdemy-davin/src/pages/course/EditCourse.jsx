import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTeacherCoursesQuery,
  useUpdateCourseMutation,
  useAddLessonsMutation,       // ← added
} from "../../features/courses/coursesApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { toast } from "react-toastify";
import {
  BookOpen, Video, Tag, ChevronUp, ChevronDown,
  X, Plus, AlertCircle, Loader2, ImagePlus, Save,
} from "lucide-react";

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

async function cloudinaryUpload(file) {
  const fd = new FormData()
  fd.append("file",          file)
  fd.append("upload_preset", UPLOAD_PRESET)
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed")
  return data.secure_url
}

export default function EditCourse() {
  const navigate = useNavigate()
  const { id }   = useParams()

  const [updateCourse, { isLoading: isUpdating }]       = useUpdateCourseMutation()
  const [addLessons]                                     = useAddLessonsMutation()   // ← added
  const { data: categories = [] }                        = useGetCategoriesQuery()
  const { data: allCourses = [], isLoading: isFetching } = useGetTeacherCoursesQuery()
  const courseData = allCourses.find((c) => String(c.id) === String(id))

  const [error,        setError]        = useState("")
  const [tagInput,     setTagInput]     = useState("")
  const [thumbPreview, setThumbPreview] = useState("")
  const [uploading,    setUploading]    = useState(false)
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    title: "", description: "", category_id: "", thumbnail: "", tags: [],
    lessons: [{ title: "", description: "", video_url: "" }],
  })

  useEffect(() => {
    if (!courseData) return
    const thumb = courseData.thumbnail ?? courseData.thumbnail_url ?? ""
    const tags = (courseData.tags ?? []).map((t) => typeof t === "string" ? t : t.name ?? "").filter(Boolean)
    const lessons = courseData.lessons?.length
      ? courseData.lessons.map((l) => ({
          id:          l.id,
          title:       l.title       ?? "",
          description: l.description ?? "",
          video_url:   l.video_url   ?? "",
        }))
      : [{ title: "", description: "", video_url: "" }]
    setForm({
      title:       courseData.title       ?? "",
      description: courseData.description ?? "",
      category_id: courseData.category_id ? String(courseData.category_id) : "",
      thumbnail:   thumb,
      tags,
      lessons,
    })
    setThumbPreview(thumb)
  }, [courseData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (name === "thumbnail") setThumbPreview(value)
    setError("")
  }

  const handleThumbFile = async (file) => {
    if (!file?.type.startsWith("image/")) return
    setThumbPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await cloudinaryUpload(file)
      setThumbPreview(url)
      setForm((p) => ({ ...p, thumbnail: url }))
      toast.success("Thumbnail uploaded!")
    } catch { toast.error("Image upload failed.") }
    finally { setUploading(false) }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) setForm((p) => ({ ...p, tags: [...p.tags, tag] }))
    setTagInput("")
  }
  const removeTag = (tag) => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag() }
    if (e.key === "Backspace" && !tagInput && form.tags.length) removeTag(form.tags[form.tags.length - 1])
  }

  const updateLesson = (i, field, val) => {
    const lessons = [...form.lessons]; lessons[i] = { ...lessons[i], [field]: val }
    setForm((p) => ({ ...p, lessons }))
  }
  const addLesson    = () => setForm((p) => ({ ...p, lessons: [...p.lessons, { title: "", description: "", video_url: "" }] }))
  const removeLesson = (i) => { if (form.lessons.length === 1) return; setForm((p) => ({ ...p, lessons: p.lessons.filter((_, idx) => idx !== i) })) }
  const moveLesson   = (i, dir) => {
    const arr = [...form.lessons]; const swap = i + dir
    if (swap < 0 || swap >= arr.length) return
    ;[arr[i], arr[swap]] = [arr[swap], arr[i]]
    setForm((p) => ({ ...p, lessons: arr }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("")
    if (!form.title.trim())       return setError("Course title is required.")
    if (!form.description.trim()) return setError("Description is required.")

    try {
      // ── Step 1: PATCH /courses/{id} — only these 4 fields ──
      await updateCourse({
        id,
        title:       form.title,
        description: form.description,
        thumbnail:   form.thumbnail,   // ← "thumbnail" not "thumbnail_url"
        tags:        form.tags,        // ← plain string array ["tag1", "tag2"]
      }).unwrap()

      // ── Step 2: POST /courses/{id}/lessons — send lessons separately ──
      const validLessons = form.lessons.filter((l) => l.title.trim())
      if (validLessons.length > 0) {
        await addLessons({
          courseId: id,
          lessons: validLessons.map(({ title, description, video_url }) => ({
            title,
            description,
            video_url,
          })),
        }).unwrap()
      }

      toast.success("Course updated!")
      navigate("/teacher/dashboard")
    } catch (err) {
      console.error("Update error:", err)
      const detail = err?.data?.detail
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg ?? JSON.stringify(d)).join(", ")
        : detail ?? JSON.stringify(err?.data) ?? "Failed to update course."
      setError(msg)
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all bg-slate-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 focus:border-indigo-400 dark:focus:border-indigo-500"
  const labelCls = "block text-xs font-black uppercase tracking-widest mb-2 text-gray-400 dark:text-gray-500"

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isFetching) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-5 animate-pulse">
        <div className="h-8 w-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-700" />
            <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
            <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-700" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
              <div className="h-10 rounded-xl bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            Edit <span className="text-indigo-600 dark:text-indigo-400">Course</span>
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Update the course details, thumbnail, lessons and tags below.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Course Details ── */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center">
                <BookOpen size={18} className="text-indigo-500" />
              </div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Course Details</h2>
            </div>

            <div className="space-y-5">

              {/* Title */}
              <div>
                <label className={labelCls}>Course Title <span className="text-red-400">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Spring Web MVC Part 1" className={inputCls} />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="What will students learn?" rows={4} className={`${inputCls} resize-none`} />
              </div>

              {/* Category — display only, not sent to backend */}
              <div>
                <label className={labelCls}>
                  Category
                  <span className="ml-2 normal-case text-[10px] font-normal text-gray-300 dark:text-gray-600">(display only)</span>
                </label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Thumbnail */}
              <div>
                <label className={labelCls}>Thumbnail</label>
                <div className="flex gap-4 items-start">
                  <div className="w-36 h-24 rounded-xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/20 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                    {uploading ? (
                      <Loader2 size={20} className="text-indigo-400 animate-spin" />
                    ) : thumbPreview ? (
                      <img src={thumbPreview} alt="thumbnail" className="w-full h-full object-cover" onError={() => setThumbPreview("")} />
                    ) : (
                      <ImagePlus size={22} className="text-indigo-300 dark:text-indigo-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ImagePlus size={13} />
                      {uploading ? "Uploading to Cloudinary…" : "Upload New Image"}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleThumbFile(f) }} />
                    <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Or paste image URL…" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={labelCls}>
                  <span className="inline-flex items-center gap-1.5"><Tag size={11} /> Tags</span>
                </label>
                <div
                  className="flex flex-wrap gap-2 items-center min-h-[48px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 cursor-text focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/50 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-all"
                  onClick={() => document.getElementById("tag-input-edit")?.focus()}
                >
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-xs px-3 py-1 rounded-full font-medium">
                      {tag}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag) }} className="hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  <input
                    id="tag-input-edit"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                    placeholder={form.tags.length === 0 ? "Type a tag and press Enter…" : ""}
                    className="flex-1 min-w-[140px] bg-transparent text-sm outline-none text-gray-800 dark:text-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[11px] dark:text-gray-300">Enter</kbd>
                  {" "}or{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-[11px] dark:text-gray-300">,</kbd>
                  {" "}to add a tag
                </p>
              </div>

            </div>
          </section>

          {/* ── Lessons ── */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center">
                  <Video size={18} className="text-purple-500" />
                </div>
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                  Lessons
                  <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                    ({form.lessons.length} {form.lessons.length === 1 ? "lesson" : "lessons"})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-3 py-1.5 rounded-lg transition-all font-semibold"
              >
                <Plus size={13} /> Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {form.lessons.map((lesson, i) => (
                <div key={lesson.id ?? i} className="rounded-xl p-5 bg-slate-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-black">
                        {i + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Lesson {i + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[
                        { fn: () => moveLesson(i, -1), disabled: i === 0,                       icon: <ChevronUp   size={13} /> },
                        { fn: () => moveLesson(i,  1), disabled: i === form.lessons.length - 1, icon: <ChevronDown size={13} /> },
                        { fn: () => removeLesson(i),   disabled: form.lessons.length === 1,     icon: <X size={13} />, danger: true },
                      ].map(({ fn, disabled, icon, danger }, idx) => (
                        <button
                          key={idx} type="button" onClick={fn} disabled={disabled}
                          className={`w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-all disabled:opacity-30
                            ${danger ? "hover:text-red-500 hover:border-red-200 dark:hover:border-red-700" : "hover:text-indigo-500 hover:border-indigo-200 dark:hover:border-indigo-600"}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Lesson Title</label>
                      <input value={lesson.title} onChange={(e) => updateLesson(i, "title", e.target.value)} placeholder="e.g. Introduction to Blockchain" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Video URL</label>
                      <input value={lesson.video_url} onChange={(e) => updateLesson(i, "video_url", e.target.value)} placeholder="https://youtu.be/..." className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea value={lesson.description} onChange={(e) => updateLesson(i, "description", e.target.value)} placeholder="What does this lesson cover?" rows={2} className={`${inputCls} resize-none`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLesson}
              className="w-full mt-4 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-xl py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={15} /> Add another lesson
            </button>
          </section>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
            >
              {isUpdating
                ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}