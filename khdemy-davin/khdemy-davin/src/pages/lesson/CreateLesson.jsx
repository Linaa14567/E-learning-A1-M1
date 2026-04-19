// // pages/dashboard/CreateLesson.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddLessonsMutation, useGetTeacherCoursesQuery } from "../../features/courses/coursesApi";
import {
  Video,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

const inputStyle = {
  background: "var(--bg-card)",
  border:     "1px solid var(--border)",
  color:      "var(--text)",
};

const inputCls =
  "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2F327D]/10 focus:border-[#2F327D]/50 placeholder:opacity-40";

const labelCls =
  "block text-xs font-bold uppercase tracking-widest mb-2";

const sectionStyle = {
  background: "var(--bg-card)",
  border:     "1px solid var(--border)",
};

export default function CreateLesson() {
  const navigate = useNavigate();

  const { data: courses = [] }       = useGetTeacherCoursesQuery();
  const [addLessons, { isLoading }]  = useAddLessonsMutation();

  const [error, setError]     = useState("");

  const [courseId, setCourseId] = useState("");
  const [lessons, setLessons]   = useState([
    { title: "", description: "", video_url: "" },
  ]);

  // ── Lesson helpers ────────────────────────────────────────────────────────
  const updateLesson = (i, field, value) => {
    const next = [...lessons];
    next[i] = { ...next[i], [field]: value };
    setLessons(next);
    setError("");
  };

  const addLesson = () =>
    setLessons([...lessons, { title: "", description: "", video_url: "" }]);

  const removeLesson = (i) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, idx) => idx !== i));
  };

  const moveLesson = (i, dir) => {
    const next = [...lessons];
    const swap = i + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]];
    setLessons(next);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!courseId) return setError("Please select a course.");

    for (let i = 0; i < lessons.length; i++) {
      if (!lessons[i].title.trim())     return setError(`Lesson ${i + 1}: title is required.`);
      if (!lessons[i].video_url.trim()) return setError(`Lesson ${i + 1}: video URL is required.`);
    }

    // ✅ FIX: courseId must be a Number (not string from <select>)
    // ✅ FIX: strip empty description so backend doesn't reject null/"" 
    const cleanLessons = lessons.map((l) => ({
      title:     l.title.trim(),
      video_url: l.video_url.trim(),
      // backend enforces max 500 chars on description
      ...(l.description.trim()
        ? { description: l.description.trim().slice(0, 500) }
        : {}),
    }));

    console.log("📤 Payload →", { courseId: Number(courseId), lessons: cleanLessons });

    try {
      await addLessons({
        courseId: Number(courseId), // ✅ cast to number
        lessons:  cleanLessons,
      }).unwrap();

      toast.success("Lessons saved successfully!");
      setCourseId("");
      setLessons([{ title: "", description: "", video_url: "" }]);
    } catch (err) {
      console.error("❌ API error:", err);
      console.error("❌ Full error data:", JSON.stringify(err?.data, null, 2));
      // Show the most useful error detail from the backend
      const detail = err?.data?.detail;
      if (Array.isArray(detail)) {
        // FastAPI validation errors come back as [{loc, msg, type}]
        const messages = detail.map((d) => `[${d.loc?.join(".")}] ${d.msg}`).join(" · ");
        console.error("❌ Validation errors:", messages);
        setError(messages);
      } else {
        setError(detail || err?.data?.message || "Failed to save lessons.");
      }
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen transition-colors duration-300 p-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 mb-6 group"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#2F327D"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <span
              className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              ←
            </span>
            Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "#2F327D" }}
            >
              <Video size={20} color="#fff" />
            </div>
            <div>
              <h1
                className="text-2xl font-black leading-tight"
                style={{ color: "var(--text)", fontFamily: "Plus Jakarta Sans, Inter, sans-serif" }}
              >
                Add Lessons
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                Add one or more lessons to an existing course
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Course selector ── */}
          <section className="rounded-2xl p-6 shadow-sm" style={sectionStyle}>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>
              Course <span style={{ color: "#2F327D" }}>*</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => { setCourseId(e.target.value); setError(""); }}
              className={`${inputCls} appearance-none cursor-pointer`}
              style={inputStyle}
            >
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </section>

          {/* ── Lessons ── */}
          <section className="rounded-2xl p-6 shadow-sm" style={sectionStyle}>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#2F327D15", border: "1px solid #2F327D30" }}
                >
                  <Video size={17} color="#2F327D" />
                </div>
                <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  Lessons
                  <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                    ({lessons.length} {lessons.length === 1 ? "lesson" : "lessons"})
                  </span>
                </h2>
              </div>

              <button
                type="button"
                onClick={addLesson}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                style={{ color: "#2F327D", borderColor: "#2F327D40", background: "#2F327D0D" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2F327D1A"}
                onMouseLeave={e => e.currentTarget.style.background = "#2F327D0D"}
              >
                <Plus size={13} /> Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 group transition-colors"
                  style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{ background: "#2F327D15", border: "1px solid #2F327D30", color: "#2F327D" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        Lesson {i + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[
                        { action: () => moveLesson(i, -1), disabled: i === 0,                     icon: <ChevronUp size={13} /> },
                        { action: () => moveLesson(i,  1), disabled: i === lessons.length - 1,     icon: <ChevronDown size={13} /> },
                        { action: () => removeLesson(i),   disabled: lessons.length === 1, danger: true, icon: <X size={13} /> },
                      ].map(({ action, disabled, icon, danger }, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={action}
                          disabled={disabled}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed
                            ${danger ? "hover:text-red-500 hover:border-red-200" : ""}`}
                          style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                          onMouseEnter={e => { if (!disabled && !danger) { e.currentTarget.style.color = "#2F327D"; e.currentTarget.style.borderColor = "#2F327D40"; } }}
                          onMouseLeave={e => { if (!danger) { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; } }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                        Lesson Title <span style={{ color: "#2F327D" }}>*</span>
                      </label>
                      <input
                        placeholder="e.g. Variables and Data Types"
                        value={lesson.title}
                        onChange={(e) => updateLesson(i, "title", e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                        Video URL <span style={{ color: "#2F327D" }}>*</span>
                      </label>
                      <input
                        placeholder="https://example.com/videos/lesson.mp4"
                        value={lesson.video_url}
                        onChange={(e) => updateLesson(i, "video_url", e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                      />
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        YouTube, Vimeo, or direct video link
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelCls} style={{ color: "var(--text-muted)", marginBottom: 0 }}>
                          Description
                        </label>
                        <span
                          className="text-xs tabular-nums"
                          style={{ color: lesson.description.length > 480 ? "#dc2626" : "var(--text-muted)" }}
                        >
                          {lesson.description.length}/500
                        </span>
                      </div>
                      <textarea
                        placeholder="What does this lesson cover?"
                        value={lesson.description}
                        onChange={(e) => updateLesson(i, "description", e.target.value.slice(0, 500))}
                        rows={2}
                        maxLength={500}
                        className={`${inputCls} resize-none`}
                        style={{
                          ...inputStyle,
                          ...(lesson.description.length > 480
                            ? { borderColor: "#fca5a5", boxShadow: "0 0 0 2px rgba(220,38,38,0.08)" }
                            : {}),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLesson}
              className="w-full mt-4 border-2 border-dashed rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2 font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#2F327D60";
                e.currentTarget.style.color = "#2F327D";
                e.currentTarget.style.background = "#2F327D08";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Plus size={15} /> Add another lesson
            </button>
          </section>

          {/* Attachments hint */}
          <div
            className="px-4 py-3 rounded-xl border text-xs flex items-center gap-2"
            style={{ background: "var(--bg-soft)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <span>📎</span>
            You can add attachments (PDF, slides) to each lesson after saving.
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 border"
              style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}
            >
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2F327D50"; e.currentTarget.style.color = "#2F327D"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #2F327D 0%, #4e52b5 100%)" }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "linear-gradient(135deg, #252770 0%, #3e42a0 100%)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #2F327D 0%, #4e52b5 100%)"; }}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving…</>
              ) : (
                <>Save Lessons <ArrowRight size={16} /></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}