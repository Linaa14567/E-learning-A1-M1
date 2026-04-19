import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "../../features/courses/courseApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { toast } from "react-toastify";
import {
  BookOpen,
  Video,
  Tag,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [error, setError]       = useState("");
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    thumbnail: "",
    tags: [],
    lessons: [{ title: "", description: "", video_url: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag))
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    setTagInput("");
  };

  const removeTag = (tag) =>
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !tagInput && formData.tags.length)
      removeTag(formData.tags[formData.tags.length - 1]);
  };

  const updateLesson = (i, field, value) => {
    const lessons = [...formData.lessons];
    lessons[i] = { ...lessons[i], [field]: value };
    setFormData({ ...formData, lessons });
  };

  const addLesson = () =>
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: "", description: "", video_url: "" }],
    });

  const removeLesson = (i) => {
    if (formData.lessons.length === 1) return;
    setFormData({ ...formData, lessons: formData.lessons.filter((_, idx) => idx !== i) });
  };

  const moveLesson = (i, dir) => {
    const lessons = [...formData.lessons];
    const swap = i + dir;
    if (swap < 0 || swap >= lessons.length) return;
    [lessons[i], lessons[swap]] = [lessons[swap], lessons[i]];
    setFormData({ ...formData, lessons });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim())       return setError("Course title is required.");
    if (!formData.description.trim()) return setError("Description is required.");
    if (!formData.category_id)        return setError("Please select a category.");

    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      tags: formData.tags,
    };

    try {
      await createCourse(payload).unwrap();
      toast.success("Course created successfully!");
      navigate("/dashboard/courses");
    } catch (err) {
      setError(err?.data?.detail || "Failed to create course. Please try again.");
    }
  };

  // ── Shared style tokens ─────────────────────────────────────────────────────
  const inputCls =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  const labelCls =
    "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2";

  const sectionCls =
    "bg-white border border-gray-100 rounded-2xl p-7 shadow-sm";

  return (
    <div className="max-w-3xl">

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">
          Create a <span className="text-indigo-600">New Course</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Fill in the details below. Add lessons and tag your course for discoverability.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* ── Course Details ── */}
        <section className={sectionCls}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-500" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Course Details</h2>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className={labelCls}>
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                placeholder="e.g. Introduction to Python"
                value={formData.title}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                placeholder="What will students learn? Who is this course for?"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Category + Thumbnail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  <option value="">Select a category…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Thumbnail URL</label>
                <input
                  name="thumbnail"
                  placeholder="https://example.com/cover.png"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={11} /> Tags
                </span>
              </label>
              <div
                className={`${inputCls} flex flex-wrap gap-2 items-center min-h-[48px] py-2 cursor-text`}
                onClick={() => document.getElementById("tag-input").focus()}
              >
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                      className="hover:text-indigo-900 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  id="tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder={formData.tags.length === 0 ? "Type a tag and press Enter…" : ""}
                  className="flex-1 min-w-[140px] bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
              <p className="text-gray-400 text-xs mt-1.5">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[11px]">Enter</kbd>
                {" "}or{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[11px]">,</kbd>
                {" "}to add a tag
              </p>
            </div>
          </div>
        </section>

        {/* ── Lessons ── */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                <Video size={18} className="text-purple-500" />
              </div>
              <h2 className="text-base font-bold text-gray-800">
                Lessons
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  ({formData.lessons.length}{" "}
                  {formData.lessons.length === 1 ? "lesson" : "lessons"})
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all font-semibold"
            >
              <Plus size={13} /> Add Lesson
            </button>
          </div>

          <div className="space-y-4">
            {formData.lessons.map((lesson, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-5 bg-gray-50/60 group hover:border-indigo-100 transition-colors"
              >
                {/* Lesson header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xs font-black">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Lesson {i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveLesson(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLesson(i, 1)}
                      disabled={i === formData.lessons.length - 1}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLesson(i)}
                      disabled={formData.lessons.length === 1}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Lesson fields */}
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Lesson Title</label>
                    <input
                      placeholder="e.g. Variables and Data Types"
                      value={lesson.title}
                      onChange={(e) => updateLesson(i, "title", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Video URL</label>
                    <input
                      placeholder="https://example.com/videos/lesson.mp4"
                      value={lesson.video_url}
                      onChange={(e) => updateLesson(i, "video_url", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      placeholder="What does this lesson cover?"
                      value={lesson.description}
                      onChange={(e) => updateLesson(i, "description", e.target.value)}
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add lesson dashed button */}
          <button
            type="button"
            onClick={addLesson}
            className="w-full mt-4 border-2 border-dashed border-gray-200 hover:border-indigo-300 rounded-xl py-3 text-gray-400 hover:text-indigo-500 text-sm transition-all hover:bg-indigo-50/40 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={15} /> Add another lesson
          </button>
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/courses")}
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 text-sm font-medium transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                Publish Course
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}