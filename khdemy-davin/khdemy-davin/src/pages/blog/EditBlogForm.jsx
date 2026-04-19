import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  X, Link2, ImageIcon, ChevronDown, Loader2, Check,
  Tag, FileText, Type, Layers, Eye, Edit3, AlertCircle,
} from "lucide-react";

import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "../../features/blog/blogApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalizeTags = (t) => {
  if (!t) return [];
  if (Array.isArray(t)) return t.map(String).filter(Boolean);
  if (typeof t === "string") return t.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const isValidUrl = (str) => {
  try { new URL(str); return true; } catch { return false; }
};

/** Unwrap common API response shapes: { blog }, { data }, or the raw object itself */
const extractBlog = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw.blog ?? raw.data ?? raw;
};

// ─── Status config ─────────────────────────────────────────────────────────────
const statusConfig = {
  draft:     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Draft"     },
  published: { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "Published" },
};

// ─── Shared input style ────────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  background: "#0F172A",
  border: "1px solid #1E293B",
  borderRadius: "0.6rem",
  padding: "0.7rem 1rem",
  fontSize: "0.9rem",
  color: "#E2E8F0",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const focusOn  = (e) => { e.target.style.borderColor = "#38BDF8"; e.target.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.1)"; };
const focusOff = (e) => { e.target.style.borderColor = "#1E293B"; e.target.style.boxShadow = "none"; };

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, hint, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
      {Icon && <Icon size={13} style={{ color: "#94A3B8" }} />}
      <label style={{
        fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "#64748B", fontFamily: "'DM Mono', monospace",
      }}>
        {label}
      </label>
    </div>
    {children}
    {hint && (
      <p style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.35rem", fontFamily: "'DM Mono', monospace" }}>
        {hint}
      </p>
    )}
  </div>
);

// ─── Dropdown ──────────────────────────────────────────────────────────────────
const Dropdown = ({ options, value, onChange, placeholder, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          ...inputBase,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
          borderColor: open ? "#38BDF8" : "#1E293B",
          boxShadow: open ? "0 0 0 3px rgba(56,189,248,0.1)" : "none",
        }}
      >
        <span style={{ color: selected ? "#E2E8F0" : "#475569" }}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{ color: "#475569", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>

      {open && !loading && (
        <div style={{
          position: "absolute", zIndex: 50, top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#0F172A", border: "1px solid #1E293B", borderRadius: "0.6rem",
          overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: "0.65rem 1rem", fontSize: "0.875rem", cursor: "pointer",
                color: value === opt.value ? "#38BDF8" : "#94A3B8",
                background: value === opt.value ? "rgba(56,189,248,0.08)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (value !== opt.value) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (value !== opt.value) e.currentTarget.style.background = "transparent"; }}
            >
              {opt.label}
              {value === opt.value && <Check size={13} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Tags Input ────────────────────────────────────────────────────────────────
const TagsInput = ({ tags, onChange }) => {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const t = val.trim().replace(/,+$/, "");
    if (!t || tags.includes(t)) { setInput(""); return; }
    onChange([...tags, t]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
  };

  return (
    <div
      style={{
        ...inputBase,
        display: "flex", flexWrap: "wrap", gap: "0.4rem",
        alignItems: "center", minHeight: "2.75rem",
        padding: "0.5rem 0.75rem", cursor: "text",
      }}
      onClick={() => document.getElementById("tag-input")?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem",
          padding: "0.2rem 0.6rem", borderRadius: "999px",
          background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)",
          color: "#38BDF8", fontSize: "0.75rem", fontWeight: 600,
          fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em",
        }}>
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(tags.filter((t) => t !== tag)); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#38BDF8", padding: 0, display: "flex", alignItems: "center" }}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        id="tag-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? "Add tags…" : ""}
        style={{
          background: "transparent", border: "none", outline: "none",
          color: "#E2E8F0", fontSize: "0.875rem",
          fontFamily: "'DM Sans', sans-serif", minWidth: "80px", flexGrow: 1,
        }}
      />
    </div>
  );
};

// ─── Thumbnail Input ───────────────────────────────────────────────────────────
const ThumbnailInput = ({ value, onChange }) => {
  const [imgError, setImgError] = useState(false);
  const hasPreview = value && isValidUrl(value);
  useEffect(() => setImgError(false), [value]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <Link2 size={13} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{ ...inputBase, paddingLeft: "2.25rem" }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
      </div>
      <div style={{
        height: "10rem", borderRadius: "0.75rem", overflow: "hidden",
        border: hasPreview && !imgError ? "1px solid #1E293B" : "2px dashed #1E293B",
        background: "#0A0F1A", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {hasPreview && !imgError ? (
          <img
            src={value}
            alt="thumbnail"
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#334155" }}>
            <ImageIcon size={28} />
            <p style={{ fontSize: "0.7rem", marginTop: "0.4rem", fontFamily: "'DM Mono', monospace" }}>
              {imgError ? "⚠ Could not load image" : "Preview appears here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Content Editor ────────────────────────────────────────────────────────────
const ContentEditor = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const plainValue = value.replace(/<[^>]*>/g, "");
  return (
    <textarea
      rows={8}
      value={plainValue}
      onChange={(e) => onChange(`<p>${e.target.value}</p>`)}
      placeholder="Write your blog content here…"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase, resize: "vertical", lineHeight: 1.7,
        borderColor: focused ? "#38BDF8" : "#1E293B",
        boxShadow: focused ? "0 0 0 3px rgba(56,189,248,0.1)" : "none",
      }}
    />
  );
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
const Skeleton = ({ h = 40, mb = "1.5rem" }) => (
  <div style={{
    height: h, borderRadius: "0.6rem", background: "#0F172A",
    marginBottom: mb, animation: "pulse 1.5s ease-in-out infinite",
  }} />
);

const FormSkeleton = () => (
  <div>
    <div style={{ background: "#0C1220", border: "1px solid #1E293B", borderRadius: "1rem", padding: "1.75rem", marginBottom: "1rem" }}>
      <Skeleton h={40} /><Skeleton h={160} /><Skeleton h={144} />
    </div>
    <div style={{ background: "#0C1220", border: "1px solid #1E293B", borderRadius: "1rem", padding: "1.75rem", marginBottom: "1rem" }}>
      <Skeleton h={40} /><Skeleton h={40} /><Skeleton h={40} mb="0" />
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
      <div style={{ width: 110, height: 40, borderRadius: "0.6rem", background: "#0F172A", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: 150, height: 40, borderRadius: "0.6rem", background: "#0F172A", animation: "pulse 1.5s ease-in-out infinite" }} />
    </div>
  </div>
);

// ─── Error State ───────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 2rem", gap: "1rem", textAlign: "center" }}>
    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AlertCircle size={22} style={{ color: "#EF4444" }} />
    </div>
    <p style={{ color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #1E293B", background: "transparent", color: "#64748B", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}
      >
        Try again
      </button>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function EditBlogForm() {
  const { id }   = useParams();       // /edit/:id  — id comes from the URL
  const navigate = useNavigate();

  // ── RTK Query hooks ──────────────────────────────────────────────────────────
  const {
    data: rawBlogData,
    isLoading: isFetching,
    isError:   isFetchError,
    refetch,
  } = useGetBlogByIdQuery(id, { skip: !id });

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const { data: categoriesData, isLoading: catLoading } = useGetCategoriesQuery();
  const categories = (categoriesData ?? []).map((c) => ({ value: String(c.id), label: c.name }));

  // ── Local form state ─────────────────────────────────────────────────────────
  const [title,        setTitle]     = useState("");
  const [content,      setContent]   = useState("");
  const [thumbnailUrl, setThumbnail] = useState("");
  const [category,     setCategory]  = useState("");
  const [tags,         setTags]      = useState([]);
  const [status,       setStatus]    = useState("draft");
  const [tab,          setTab]       = useState("edit");
  const [saved,        setSaved]     = useState(false);

  // ── Populate when blog data arrives ─────────────────────────────────────────
  useEffect(() => {
    const blog = extractBlog(rawBlogData);
    if (!blog) return;

    setTitle(blog.title                                        || "");
    setContent(blog.content                                    || "");
    setThumbnail(blog.thumbnail_url                            || "");
    setTags(normalizeTags(blog.tags));
    setCategory(String(blog.category_id ?? blog.category?.id ?? ""));
    setStatus(blog.status                                      || "draft");
  }, [rawBlogData]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim())        { toast.error("Title is required!");         return; }
    if (!content.replace(/<[^>]*>/g, "").trim()) { toast.error("Content is required!"); return; }
    if (!thumbnailUrl.trim()) { toast.error("Thumbnail URL is required!"); return; }

    const payload = {
      title:         title.trim(),
      content,
      thumbnail_url: thumbnailUrl.trim(),
      status,
      ...(category        ? { category_id: category } : {}),
      ...(tags.length > 0 ? { tags }                 : {}),
    };

    try {
      await updateBlog({ id, ...payload }).unwrap();
      toast.success("Blog updated successfully!");
      setSaved(true);
      setTimeout(() => { setSaved(false); navigate("/profile/all-blogs"); }, 1200);
    } catch (err) {
      const msg =
        err?.data?.message                          ||
        err?.data?.detail                           ||
        err?.data?.error                            ||
        (typeof err?.data === "string" && err.data) ||
        "Failed to update blog.";
      toast.error(msg);
    }
  };

  const statusCfg = statusConfig[status] || statusConfig.draft;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0A0F1A}
        ::-webkit-scrollbar-thumb{background:#1E293B;border-radius:4px}
        input::placeholder,textarea::placeholder{color:#334155}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#080C14",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}>
        <div style={{ width: "100%", maxWidth: "680px" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: "999px", marginBottom: "0.75rem",
            }}>
              <Edit3 size={11} style={{ color: "#38BDF8" }} />
              <span style={{ fontSize: "0.65rem", color: "#38BDF8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                Editing Article
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.1rem)", color: "#F1F5F9", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Edit Article
              </h1>

              {/* Live status pill — only when data loaded */}
              {!isFetching && !isFetchError && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.3rem 0.75rem", borderRadius: "999px",
                  background: statusCfg.bg, flexShrink: 0, marginTop: "0.2rem",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusCfg.dot }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: statusCfg.text, fontFamily: "'DM Mono', monospace" }}>
                    {statusCfg.label}
                  </span>
                </div>
              )}
            </div>

            {/* Tab switcher — only when data is loaded */}
            {!isFetching && !isFetchError && (
              <div style={{ display: "flex", gap: "0", marginTop: "1.25rem", background: "#0F172A", borderRadius: "0.5rem", padding: "3px", border: "1px solid #1E293B", width: "fit-content" }}>
                {[{ id: "edit", icon: Edit3, label: "Edit" }, { id: "preview", icon: Eye, label: "Preview" }].map(({ id: tabId, icon: Icon, label }) => (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setTab(tabId)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.35rem",
                      padding: "0.4rem 1rem", borderRadius: "0.35rem", border: "none",
                      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                      background: tab === tabId ? "#1E293B" : "transparent",
                      color: tab === tabId ? "#E2E8F0" : "#475569",
                    }}
                  >
                    <Icon size={13} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Loading skeleton ── */}
          {isFetching && <FormSkeleton />}

          {/* ── Fetch error ── */}
          {!isFetching && isFetchError && (
            <div style={{ background: "#0C1220", border: "1px solid #1E293B", borderRadius: "1rem" }}>
              <ErrorState
                message="Could not load this article. Please try again."
                onRetry={refetch}
              />
            </div>
          )}

          {/* ── Preview tab ── */}
          {!isFetching && !isFetchError && tab === "preview" && (
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "1rem", overflow: "hidden", animation: "fadeIn 0.2s ease" }}>
              {thumbnailUrl && isValidUrl(thumbnailUrl) && (
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img src={thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {tags.map((t) => (
                    <span key={t} style={{ padding: "0.15rem 0.6rem", borderRadius: "999px", background: "rgba(56,189,248,0.1)", color: "#38BDF8", fontSize: "0.7rem", fontWeight: 600, fontFamily: "'DM Mono', monospace", border: "1px solid rgba(56,189,248,0.2)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.6rem", color: "#F1F5F9", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                  {title || <span style={{ color: "#334155" }}>No title yet…</span>}
                </h2>
                <div
                  style={{ color: "#94A3B8", lineHeight: 1.8, fontSize: "0.9rem" }}
                  dangerouslySetInnerHTML={{ __html: content || "<p style='color:#334155'>No content yet…</p>" }}
                />
              </div>
            </div>
          )}

          {/* ── Edit form ── */}
          {!isFetching && !isFetchError && tab === "edit" && (
            <form onSubmit={handleSave} noValidate style={{ animation: "fadeIn 0.2s ease" }}>

              {/* Card 1 — Content fields */}
              <div style={{ background: "#0C1220", border: "1px solid #1E293B", borderRadius: "1rem", padding: "1.75rem", marginBottom: "1rem" }}>

                <Field label="Title" icon={Type}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article title…"
                    style={inputBase}
                    onFocus={focusOn}
                    onBlur={focusOff}
                  />
                </Field>

                <Field label="Content" icon={FileText}>
                  <ContentEditor value={content} onChange={setContent} />
                </Field>

                <Field label="Thumbnail URL" icon={ImageIcon}>
                  <ThumbnailInput value={thumbnailUrl} onChange={setThumbnail} />
                </Field>

              </div>

              {/* Card 2 — Meta fields */}
              <div style={{ background: "#0C1220", border: "1px solid #1E293B", borderRadius: "1rem", padding: "1.75rem", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.65rem", color: "#475569", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "1.25rem" }}>
                  Meta & Settings
                </p>

                <Field label="Category" icon={Layers}>
                  <Dropdown
                    options={categories}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select a category…"
                    loading={catLoading}
                  />
                </Field>

                <Field label="Tags" icon={Tag} hint="Press Enter or comma to add · Backspace to remove last">
                  <TagsInput tags={tags} onChange={setTags} />
                </Field>

                <Field label="Status">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["draft", "published"].map((s) => {
                      const cfg    = statusConfig[s];
                      const active = status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          style={{
                            flex: 1, padding: "0.6rem", borderRadius: "0.6rem",
                            border: active ? `1px solid ${cfg.dot}40` : "1px solid #1E293B",
                            background: active ? `${cfg.dot}14` : "#0F172A",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "0.4rem", transition: "all 0.2s",
                          }}
                        >
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? cfg.dot : "#334155", transition: "background 0.2s" }} />
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: active ? cfg.text : "#475569", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                            {cfg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              {/* Action bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{ padding: "0.65rem 1.25rem", borderRadius: "0.6rem", border: "1px solid #1E293B", background: "transparent", color: "#64748B", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#94A3B8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#64748B"; }}
                >
                  Discard
                </button>

                <button
                  type="submit"
                  disabled={isUpdating || !title.trim()}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.65rem 1.75rem", borderRadius: "0.6rem", border: "none",
                    background: saved ? "#059669" : isUpdating ? "#0E7490" : "#0284C7",
                    color: "#fff", fontSize: "0.875rem", fontWeight: 700,
                    cursor: isUpdating || !title.trim() ? "not-allowed" : "pointer",
                    opacity: !title.trim() ? 0.5 : 1,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.3s",
                    minWidth: "150px", justifyContent: "center",
                  }}
                >
                  {isUpdating ? (
                    <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                  ) : saved ? (
                    <><Check size={14} /> Saved!</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </>
  );
}