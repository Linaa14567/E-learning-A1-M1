import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetEnrolledCoursesQuery,
  useGetCoursesQuery,
} from "../../features/courses/coursesApi";
import {
  Play, CheckCircle2, ChevronRight, BookOpen, Trophy,
  Loader2, Check, Lock, ArrowLeft, RotateCcw,
} from "lucide-react";

// ─── VIDEO PLAYER ─────────────────────────────────────────────────────────────
function VideoPlayer({ lesson }) {
  if (!lesson?.video_url)
    return (
      <div className="w-full flex items-center justify-center" style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 56px)", background: "#0f0f1a" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }} className="text-sm">No video for this lesson.</p>
      </div>
    );

  const toEmbed = (url) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    return url;
  };

  const isYT = lesson.video_url.includes("youtu");
  const src  = toEmbed(lesson.video_url);

  return isYT ? (
    <iframe
      key={src}
      src={src}
      className="w-full"
      style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 56px)", display: "block" }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={lesson.title}
    />
  ) : (
    <video
      src={lesson.video_url}
      controls
      className="w-full"
      style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 56px)", display: "block" }}
    />
  );
}

// ─── COURSE PLAYER ────────────────────────────────────────────────────────────
function CoursePlayer({ course, onBack }) {
  const lessons   = course?.lessons ?? [];
  const completed = course.completed_lessons ?? 0;
  const total     = lessons.length;
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0;
  const category  = course.category?.name ?? course.category ?? "Course Library";

  const [active, setActive] = useState(lessons[0] ?? null);
  const currentIdx = active ? lessons.findIndex((l) => l.id === active.id) : 0;

  const goPrev = () => { if (currentIdx > 0) setActive(lessons[currentIdx - 1]); };
  const goNext = () => { if (currentIdx < lessons.length - 1) setActive(lessons[currentIdx + 1]); };

  return (
    <div className="min-h-screen -mx-4 lg:-mx-7 -mt-4 lg:-mt-7" style={{ background: "var(--bg)" }}>

      {/* ── Full-width video ── */}
      <div className="w-full" style={{ background: "#000" }}>
        {active?.video_url ? (
          <VideoPlayer lesson={active} />
        ) : (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 56px)", background: "#0f0f1a" }}
          >
            {course.thumbnail_url
              ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover absolute inset-0" style={{ opacity: 0.4 }} />
              : <div className="w-full h-full absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1a3e, #0f0f1a)" }} />
            }
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
                <Play size={24} className="ml-1" style={{ color: "#4f46e5", fill: "#4f46e5" }} />
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Select a lesson to start watching</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Below video ── */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: info ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Breadcrumb + back */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <button
                onClick={onBack}
                className="flex items-center gap-1 font-semibold transition-colors hover:text-indigo-500"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowLeft size={13} /> My Progress
              </button>
              <ChevronRight size={11} />
              <span className="font-medium" style={{ color: "var(--text-muted)" }}>{category}</span>
              {active && (
                <>
                  <ChevronRight size={11} />
                  <span className="font-semibold truncate max-w-[180px]" style={{ color: "#6366f1" }}>{active.title}</span>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl font-black leading-tight" style={{ color: "var(--text)" }}>
                {course.title}
              </h1>
              {active && (
                <p className="text-sm font-semibold mt-1" style={{ color: "#6366f1" }}>
                  Lesson {currentIdx + 1}: {active.title}
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="rounded-2xl border shadow-sm p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Course Progress</span>
                <span className="text-xs font-black" style={{ color: "#6366f1" }}>{percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden mb-1" style={{ background: "var(--bg-soft)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%`, background: "linear-gradient(90deg,#4f46e5,#6366f1)" }}
                />
              </div>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{completed} of {total} lessons completed</p>
            </div>

            {/* Description */}
            {active?.description && (
              <div className="rounded-2xl border shadow-sm p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <h3 className="text-sm font-black mb-2" style={{ color: "var(--text)" }}>About This Lesson</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{active.description}</p>
              </div>
            )}

            {/* Prev / Next nav */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={goPrev}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-soft)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                ← Previous
              </button>
              <button
                onClick={goNext}
                disabled={currentIdx >= lessons.length - 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#4f46e5" }}
                onMouseEnter={e => e.currentTarget.style.background = "#4338ca"}
                onMouseLeave={e => e.currentTarget.style.background = "#4f46e5"}
              >
                Next →
              </button>
            </div>
          </div>

          {/* ── RIGHT: lessons list ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-sm font-black flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <BookOpen size={14} style={{ color: "#6366f1" }} />
                  All Lessons
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: "var(--text-muted)", background: "var(--bg-soft)" }}>
                  {lessons.length}
                </span>
              </div>

              {/* Resume button */}
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => {
                    const firstIncomplete = lessons.find((_, i) => i >= completed);
                    if (firstIncomplete) setActive(firstIncomplete);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-xs font-bold transition-all"
                  style={{ background: "#4f46e5" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#4338ca"}
                  onMouseLeave={e => e.currentTarget.style.background = "#4f46e5"}
                >
                  <RotateCcw size={12} /> Resume Learning
                </button>
              </div>

              {/* Lesson rows */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
                {lessons.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>No lessons yet.</p>
                ) : (
                  lessons.map((lesson, i) => {
                    const isActive  = active?.id === lesson.id;
                    const isDone    = i < completed;
                    const isLocked  = !isDone && !isActive && i > currentIdx;

                    return (
                      <button
                        key={lesson.id ?? i}
                        onClick={() => !isLocked && setActive(lesson)}
                        disabled={isLocked}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b last:border-b-0"
                        style={{
                          borderColor: "var(--border)",
                          background: isActive ? "rgba(99,102,241,0.1)" : "transparent",
                          opacity: isLocked ? 0.4 : 1,
                          cursor: isLocked ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e => { if (!isLocked && !isActive) e.currentTarget.style.background = "var(--bg-soft)"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        {/* Status circle */}
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            borderColor: isActive ? "#4f46e5" : isDone ? "#22c55e" : "var(--border)",
                            background:  isActive ? "#4f46e5" : isDone ? "#22c55e" : "transparent",
                          }}
                        >
                          {isDone   && <Check size={10} className="text-white" strokeWidth={3} />}
                          {isActive && !isDone && <Play size={8} style={{ fill: "white", color: "white", marginLeft: "1px" }} />}
                          {isLocked && <Lock size={8} style={{ color: "var(--text-muted)" }} />}
                        </div>

                        <span
                          className="flex-1 text-[13px] font-medium truncate"
                          style={{
                            color: isActive ? "#6366f1" : isDone ? "var(--text-muted)" : "var(--text)",
                            fontWeight: isActive ? 600 : 400,
                            textDecoration: isDone ? "line-through" : "none",
                          }}
                        >
                          {i + 1}. {lesson.title}
                        </span>

                        {lesson.duration && (
                          <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                            {lesson.duration}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS CARD ────────────────────────────────────────────────────────────
function CourseProgressCard({ course, onClick }) {
  const completed = course.completed_lessons ?? 0;
  const total     = course.total_lessons ?? course.lessons?.length ?? 0;
  const percent   = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isDone    = percent >= 100;
  const thumb     = course.thumbnail_url ?? course.thumbnail ?? null;
  const category  = course.category?.name ?? course.category ?? "Course";

  return (
    <div
      onClick={() => onClick(course)}
      className="rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden group cursor-pointer"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
    >
      <div className="relative w-full aspect-video overflow-hidden" style={{ background: "#0f0f1a" }}>
        {thumb ? (
          <img src={thumb} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #1e3a8a, #4f46e5)" }} />
        )}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white"
          style={{ background: isDone ? "#1e3a8a" : "#dc2626" }}
        >
          {category}
        </span>
        {isDone && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(30,58,138,0.3)" }}>
            <CheckCircle2 size={40} className="text-white drop-shadow-lg" />
          </div>
        )}
        {!isDone && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl" style={{ background: "rgba(255,255,255,0.9)" }}>
              <Play size={18} style={{ fill: "#4f46e5", color: "#4f46e5", marginLeft: "2px" }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-black text-[15px] leading-tight mb-1 line-clamp-1" style={{ color: "var(--text)" }}>
          {course.title}
        </h3>
        <p className="text-xs line-clamp-2 mb-3 leading-relaxed min-h-[2rem]" style={{ color: "var(--text-muted)" }}>
          {course.description}
        </p>

        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Progress</span>
          <span className="text-xs font-black" style={{ color: isDone ? "#4f46e5" : "#ef4444" }}>
            {percent}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--bg-soft)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${percent}%`, background: "linear-gradient(90deg,#1e3a8a,#3b82f6)" }}
          />
        </div>
        <p className="text-[10px] mb-4" style={{ color: "var(--text-muted)" }}>
          {completed} of {total} lessons completed
        </p>

        {isDone ? (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(course); }}
            className="w-full py-2 rounded-xl text-white text-xs font-bold transition-all"
            style={{ background: "#1e3a8a" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1e40af"}
            onMouseLeave={e => e.currentTarget.style.background = "#1e3a8a"}
          >
            Complete
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(course); }}
            className="w-full py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            style={{ background: "#ef4444" }}
            onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}
          >
            <Play size={11} style={{ fill: "white" }} /> Resume
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
function Section({ title, icon, courses, onCardClick }) {
  if (courses.length === 0) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black flex items-center gap-2" style={{ color: "var(--text)" }}>
          {icon} {title}
          <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1" style={{ color: "var(--text-muted)", background: "var(--bg-soft)" }}>
            {courses.length}
          </span>
        </h2>
        <button className="text-xs font-semibold hover:underline flex items-center gap-0.5" style={{ color: "#6366f1" }}>
          View All <ChevronRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <CourseProgressCard key={c.id} course={c} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MyProgress() {
  const navigate = useNavigate();
  const { user }  = useSelector((state) => state.auth);
  const [activeCourse, setActiveCourse] = useState(null);

  const { data: raw } = useGetCoursesQuery({ limit: 999, skip: 0 });
  const allCourses = Array.isArray(raw) ? raw : raw?.courses ?? raw?.data ?? [];

  const { data: enrolledList = [], isLoading } = useGetEnrolledCoursesQuery(undefined, { skip: !user });

  const enriched = enrolledList.map((enrolled) => {
    const full = allCourses.find((c) => String(c.id) === String(enrolled.id ?? enrolled.course_id));
    return full ? { ...full, ...enrolled } : enrolled;
  });

  const handleCardClick = (course) => {
    const full = allCourses.find((c) => String(c.id) === String(course.id ?? course.course_id));
    setActiveCourse(full ?? course);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4" style={{ color: "var(--text-muted)" }}>
      <BookOpen size={48} style={{ color: "var(--border)" }} />
      <p className="text-sm font-semibold">Please log in to view your progress.</p>
      <button
        onClick={() => navigate("/login")}
        className="px-5 py-2 rounded-xl text-white text-sm font-bold transition"
        style={{ background: "#4f46e5" }}
        onMouseEnter={e => e.currentTarget.style.background = "#4338ca"}
        onMouseLeave={e => e.currentTarget.style.background = "#4f46e5"}
      >
        Log In
      </button>
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center py-32 gap-3" style={{ color: "var(--text-muted)" }}>
      <Loader2 size={24} className="animate-spin" />
      <span className="text-sm font-semibold">Loading your courses…</span>
    </div>
  );

  const getPercent = (c) => {
    const total = c.total_lessons ?? c.lessons?.length ?? 0;
    const done  = c.completed_lessons ?? 0;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const current  = enriched.filter((c) => getPercent(c) < 100);
  const complete = enriched.filter((c) => getPercent(c) >= 100);

  if (enrolledList.length === 0) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4" style={{ color: "var(--text-muted)" }}>
      <BookOpen size={48} style={{ color: "var(--border)" }} />
      <p className="text-sm font-semibold">You haven't enrolled in any courses yet.</p>
      <button
        onClick={() => navigate("/courses")}
        className="px-5 py-2 rounded-xl text-white text-sm font-bold transition"
        style={{ background: "#4f46e5" }}
        onMouseEnter={e => e.currentTarget.style.background = "#4338ca"}
        onMouseLeave={e => e.currentTarget.style.background = "#4f46e5"}
      >
        Browse Courses
      </button>
    </div>
  );

  return activeCourse ? (
    <CoursePlayer course={activeCourse} onBack={() => setActiveCourse(null)} />
  ) : (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>My Progress</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {enrolledList.length} enrolled · {complete.length} completed
        </p>
      </div>
      <Section
        title="Current Courses"
        icon={<Play size={16} style={{ color: "#ef4444" }} />}
        courses={current}
        onCardClick={handleCardClick}
      />
      <Section
        title="Complete Courses"
        icon={<Trophy size={16} style={{ color: "#4f46e5" }} />}
        courses={complete}
        onCardClick={handleCardClick}
      />
    </div>
  );
}