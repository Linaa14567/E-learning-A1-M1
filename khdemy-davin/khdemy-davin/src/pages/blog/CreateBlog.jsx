// // pages/blog/CreateBlog.jsx
// import { useState, useRef, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ChevronDown, X, ImageIcon, Loader2, ChevronRight, Link2 } from "lucide-react";

// import {
//   useCreateBlogMutation,
//   useUpdateBlogMutation,
//   useGetBlogByIdQuery,
// } from "../../features/blog/blogApi";
// import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
// import RichTextEditor from "./RichTextEditor";

// // ─── Shared styles ────────────────────────────────────────────────────────────
// const inputCls =
//   "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

// const inputStyle = {
//   background: "var(--bg-card)",
//   border:     "1px solid var(--border)",
//   color:      "var(--text)",
// };

// const labelCls = "block text-xs font-bold mb-1.5";

// // ─── Dropdown ─────────────────────────────────────────────────────────────────
// const Dropdown = ({ options, value, onChange, placeholder, loading, className = "w-full" }) => {
//   const [open, setOpen] = useState(false);
//   const ref             = useRef(null);
//   const selected        = options.find((o) => o.value === value);

//   useEffect(() => {
//     const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   return (
//     <div className={`relative ${className}`} ref={ref}>
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className={`${inputCls} flex items-center justify-between`}
//         style={inputStyle}
//       >
//         <span style={{ color: selected ? "var(--text)" : "var(--text-muted)" }}>
//           {loading ? "Loading…" : selected ? selected.label : placeholder}
//         </span>
//         <ChevronDown
//           size={15}
//           style={{ color: "var(--text-muted)" }}
//           className={`transition-transform ${open ? "rotate-180" : ""}`}
//         />
//       </button>

//       {open && (
//         <div
//           className="absolute z-30 w-full mt-1 rounded-lg shadow-lg max-h-52 overflow-y-auto"
//           style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
//         >
//           {options.map((opt) => (
//             <div
//               key={opt.value}
//               onClick={() => { onChange(opt.value); setOpen(false); }}
//               className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
//                 value === opt.value
//                   ? "bg-indigo-50 text-indigo-600 font-semibold"
//                   : "hover:bg-indigo-50/30"
//               }`}
//               style={value === opt.value ? {} : { color: "var(--text-muted)" }}
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Thumbnail URL Input ──────────────────────────────────────────────────────
// const ThumbnailInput = ({ value, onChange }) => {
//   const isValidUrl = (str) => {
//     try { new URL(str); return true; } catch { return false; }
//   };

//   const hasPreview = value && isValidUrl(value);

//   return (
//     <div className="space-y-2">
//       {/* URL input */}
//       <div className="relative">
//         <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//           <Link2 size={14} style={{ color: "var(--text-muted)" }} />
//         </div>
//         <input
//           type="url"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="https://example.com/image.jpg"
//           className={`${inputCls} pl-9`}
//           style={inputStyle}
//         />
//       </div>

//       {/* Preview */}
//       {hasPreview ? (
//         <div className="relative h-36 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
//           <img
//             src={value}
//             alt="thumbnail preview"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.style.display = "none";
//               e.target.nextSibling.style.display = "flex";
//             }}
//           />
//           <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-xl">
//             <ImageIcon size={24} className="text-red-400" />
//             <p className="text-xs text-red-500 font-medium">Could not load image from URL</p>
//           </div>
//         </div>
//       ) : (
//         <div
//           className="h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
//           style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
//         >
//           <ImageIcon size={28} style={{ color: "var(--border)" }} />
//           <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
//             Paste an image URL above to preview
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Tags Input ───────────────────────────────────────────────────────────────
// const TagsInput = ({ tags, onChange }) => {
//   const [input, setInput] = useState("");

//   const addTag = (val) => {
//     const t = val.trim().replace(/,+$/, "");
//     if (!t || tags.includes(t)) { setInput(""); return; }
//     onChange([...tags, t]);
//     setInput("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
//     if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
//   };

//   return (
//     <div className="flex flex-wrap gap-2 items-center min-h-[36px]">
//       {tags.map((tag) => (
//         <span
//           key={tag}
//           className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
//             bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
//         >
//           {tag}
//           <button
//             type="button"
//             onClick={() => onChange(tags.filter((t) => t !== tag))}
//             className="text-indigo-400 hover:text-indigo-700 transition-colors"
//           >
//             <X size={11} />
//           </button>
//         </span>
//       ))}
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         onBlur={() => addTag(input)}
//         placeholder={tags.length === 0 ? "Add a tag and press Enter…" : ""}
//         className="text-sm placeholder:opacity-50 outline-none bg-transparent min-w-[160px]"
//         style={{ color: "var(--text)" }}
//       />
//     </div>
//   );
// };

// // ─── Loading Skeleton ─────────────────────────────────────────────────────────
// const FormSkeleton = () => (
//   <div className="space-y-5 animate-pulse">
//     {[
//       { h: 38,  lw: 10 },
//       { h: 220, lw: 20 },
//       { h: 144, lw: 16 },
//       { h: 38,  lw: 18 },
//       { h: 38,  lw: 8  },
//     ].map(({ h, lw }, i) => (
//       <div key={i}>
//         <div className={`h-3 w-${lw} rounded mb-1.5`} style={{ background: "var(--bg-soft)" }} />
//         <div className="rounded-lg" style={{ height: h, background: "var(--bg-soft)" }} />
//       </div>
//     ))}
//     <div className="flex gap-3 pt-2">
//       <div className="h-10 w-44 rounded-lg" style={{ background: "var(--bg-soft)" }} />
//       <div className="h-10 w-32 rounded-lg ml-auto" style={{ background: "var(--bg-soft)" }} />
//     </div>
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function CreateBlog() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
//   const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

//   const { data: rawBlogData, isLoading: isFetching } = useGetBlogByIdQuery(id, { skip: !id });
//   const blogToEdit = rawBlogData?.blog ?? rawBlogData?.data ?? rawBlogData ?? null;

//   const { data: categoriesData, isLoading: catLoading } = useGetCategoriesQuery();
//   const categories = (categoriesData ?? []).map((c) => ({ value: c.id, label: c.name }));
//   const statusOpts = [
//     { value: "draft",     label: "Draft"     },
//     { value: "published", label: "Published" },
//   ];

//   const [title,        setTitle]        = useState("");
//   const [content,      setContent]      = useState("");
//   const [tags,         setTags]         = useState([]);
//   const [category,     setCategory]     = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [status,       setStatus]       = useState("draft");

//   useEffect(() => {
//     if (blogToEdit) {
//       setTitle(blogToEdit.title               || "");
//       setContent(blogToEdit.content           || "");
//       setTags(blogToEdit.tags                 || []);
//       setCategory(blogToEdit.category_id      || "");
//       setStatus(blogToEdit.status             || "draft");
//       setThumbnailUrl(blogToEdit.thumbnail_url || "");
//     }
//   }, [blogToEdit]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) { toast.error("Title is required!"); return; }
//     const plainText = content.replace(/<[^>]*>/g, "").trim();
//     if (!plainText)    { toast.error("Content is required!"); return; }
//     if (!thumbnailUrl.trim()) { toast.error("Thumbnail URL is required!"); return; }

//     const payload = {
//       title:         title.trim(),
//       content,
//       thumbnail_url: thumbnailUrl.trim(),
//       status,
//       ...(category        && { category_id: category }),
//       ...(tags.length > 0 && { tags }),
//     };

//     try {
//       if (id) {
//         await updateBlog({ id, ...payload }).unwrap();
//         toast.success("Blog updated!");
//       } else {
//         await createBlog(payload).unwrap();
//         toast.success("Blog published!");
//       }
//       navigate("/profile/all-blogs");
//     } catch (err) {
//       console.error("Blog save error:", err);
//       const msg =
//         err?.data?.message  ||
//         err?.data?.detail   ||
//         err?.data?.error    ||
//         JSON.stringify(err?.data) ||
//         "Failed to save blog.";
//       toast.error(msg);
//     }
//   };

//   const busy = isCreating || isUpdating;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
//       <div className="max-w-2xl w-full">

//         {/* ── Breadcrumb + heading ── */}
//         <div className="mb-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
//           <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
//             <Link to="/dashboard"       className="hover:text-indigo-600 transition-colors">Dashboard</Link>
//             <ChevronRight size={12} style={{ color: "var(--border)" }} />
//             <Link to="/dashboard/blogs" className="hover:text-indigo-600 transition-colors">Blogs</Link>
//             <ChevronRight size={12} style={{ color: "var(--border)" }} />
//             <span className="font-semibold" style={{ color: "var(--text)" }}>{id ? "Edit" : "New"}</span>
//           </nav>
//           <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
//             {id ? "Edit Article" : "Add New Article"}
//           </h1>
//         </div>

//         {/* ── Skeleton or form ── */}
//         {id && isFetching ? (
//           <FormSkeleton />
//         ) : (
//           <form onSubmit={handleSubmit} noValidate className="space-y-5">

//             {/* Title */}
//             <div>
//               <label className={labelCls} style={{ color: "var(--text-muted)" }}>Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter Title"
//                 className={inputCls}
//                 style={inputStyle}
//               />
//             </div>

//             {/* Content */}
//             <div>
//               <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description</label>
//               <RichTextEditor
//                 value={content}
//                 onChange={setContent}
//                 placeholder="Write your blog content here…"
//               />
//             </div>

//             {/* Thumbnail URL */}
//             <div>
//               <label className={labelCls} style={{ color: "var(--text-muted)" }}>Thumbnail URL</label>
//               <ThumbnailInput value={thumbnailUrl} onChange={setThumbnailUrl} />
//             </div>

//             {/* Category */}
//             <div>
//               <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categories</label>
//               <Dropdown
//                 options={categories}
//                 value={category}
//                 onChange={setCategory}
//                 placeholder="Select Category"
//                 loading={catLoading}
//               />
//             </div>

//             {/* Tags */}
//             <div>
//               <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tags</label>
//               <div
//                 className="rounded-lg px-3 py-2.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
//                 style={inputStyle}
//               >
//                 <TagsInput tags={tags} onChange={setTags} />
//               </div>
//               <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
//                 Press Enter or comma to add a tag
//               </p>
//             </div>

//             {/* Status + Submit */}
//             <div className="flex items-end gap-3 pt-2 pb-4">
//               <div>
//                 <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status</label>
//                 <Dropdown
//                   options={statusOpts}
//                   value={status}
//                   onChange={setStatus}
//                   placeholder="Draft"
//                   className="w-44"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={busy}
//                 className="flex items-center gap-2 px-6 py-2.5 bg-[#2F327D] hover:bg-[#4144a7]
//                   disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm
//                   rounded-lg transition-all hover:shadow-md whitespace-nowrap ml-auto"
//               >
//                 {busy ? (
//                   <><Loader2 size={15} className="animate-spin" />{id ? "Updating…" : "Publishing…"}</>
//                 ) : (
//                   id ? "Update Article" : "Publish Article"
//                 )}
//               </button>
//             </div>

//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


// pages/blog/CreateBlog.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown, X, ImageIcon, Loader2, ChevronRight, Link2 } from "lucide-react";

import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogByIdQuery,
} from "../../features/blog/blogApi";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import RichTextEditor from "./RichTextEditor";

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const inputStyle = {
  background: "var(--bg-card)",
  border:     "1px solid var(--border)",
  color:      "var(--text)",
};

const labelCls = "block text-xs font-bold mb-1.5";

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const Dropdown = ({ options, value, onChange, placeholder, loading, className = "w-full" }) => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const selected        = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputCls} flex items-center justify-between`}
        style={inputStyle}
      >
        <span style={{ color: selected ? "var(--text)" : "var(--text-muted)" }}>
          {loading ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{ color: "var(--text-muted)" }}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-30 w-full mt-1 rounded-lg shadow-lg max-h-52 overflow-y-auto"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "hover:bg-indigo-50/30"
              }`}
              style={value === opt.value ? {} : { color: "var(--text-muted)" }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Thumbnail URL Input ──────────────────────────────────────────────────────
const ThumbnailInput = ({ value, onChange }) => {
  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const hasPreview = value && isValidUrl(value);

  return (
    <div className="space-y-2">
      {/* URL input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Link2 size={14} style={{ color: "var(--text-muted)" }} />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={`${inputCls} pl-9`}
          style={inputStyle}
        />
      </div>

      {/* Preview */}
      {hasPreview ? (
        <div className="relative h-36 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
          <img
            src={value}
            alt="thumbnail preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-xl">
            <ImageIcon size={24} className="text-red-400" />
            <p className="text-xs text-red-500 font-medium">Could not load image from URL</p>
          </div>
        </div>
      ) : (
        <div
          className="h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
        >
          <ImageIcon size={28} style={{ color: "var(--border)" }} />
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Paste an image URL above to preview
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Tags Input ───────────────────────────────────────────────────────────────
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
    <div className="flex flex-wrap gap-2 items-center min-h-[36px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? "Add a tag and press Enter…" : ""}
        className="text-sm placeholder:opacity-50 outline-none bg-transparent min-w-[160px]"
        style={{ color: "var(--text)" }}
      />
    </div>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const FormSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {[
      { h: 38,  lw: 10 },
      { h: 220, lw: 20 },
      { h: 144, lw: 16 },
      { h: 38,  lw: 18 },
      { h: 38,  lw: 8  },
    ].map(({ h, lw }, i) => (
      <div key={i}>
        <div className={`h-3 w-${lw} rounded mb-1.5`} style={{ background: "var(--bg-soft)" }} />
        <div className="rounded-lg" style={{ height: h, background: "var(--bg-soft)" }} />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <div className="h-10 w-44 rounded-lg" style={{ background: "var(--bg-soft)" }} />
      <div className="h-10 w-32 rounded-lg ml-auto" style={{ background: "var(--bg-soft)" }} />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateBlog() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const { data: rawBlogData, isLoading: isFetching } = useGetBlogByIdQuery(id, { skip: !id });
  const blogToEdit = rawBlogData?.blog ?? rawBlogData?.data ?? rawBlogData ?? null;

  const { data: categoriesData, isLoading: catLoading } = useGetCategoriesQuery();
  const categories = (categoriesData ?? []).map((c) => ({ value: c.id, label: c.name }));
  const statusOpts = [
    { value: "draft",     label: "Draft"     },
    { value: "published", label: "Published" },
  ];

  const [title,        setTitle]        = useState("");
  const [content,      setContent]      = useState("");
  const [tags,         setTags]         = useState([]);
  const [category,     setCategory]     = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status,       setStatus]       = useState("draft");

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title               || "");
      setContent(blogToEdit.content           || "");
      setTags(blogToEdit.tags                 || []);
      setCategory(blogToEdit.category_id      || "");
      setStatus(blogToEdit.status             || "draft");
      setThumbnailUrl(blogToEdit.thumbnail_url || "");
    }
  }, [blogToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) { toast.error("Title is required!"); return; }
    if (!content.trim()) { toast.error("Content is required!"); return; } // ✅ plain text check
    if (!thumbnailUrl.trim()) { toast.error("Thumbnail URL is required!"); return; }

    const payload = {
      title:         title.trim(),
      content:       content.trim(), // ✅ plain text stored
      thumbnail_url: thumbnailUrl.trim(),
      status,
      ...(category        && { category_id: category }),
      ...(tags.length > 0 && { tags }),
    };

    try {
      if (id) {
        await updateBlog({ id, ...payload }).unwrap();
        toast.success("Blog updated!");
      } else {
        await createBlog(payload).unwrap();
        toast.success("Blog published!");
      }
      navigate("/profile/all-blogs");
    } catch (err) {
      console.error("Blog save error:", err);
      const msg =
        err?.data?.message  ||
        err?.data?.detail   ||
        err?.data?.error    ||
        JSON.stringify(err?.data) ||
        "Failed to save blog.";
      toast.error(msg);
    }
  };

  const busy = isCreating || isUpdating;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl w-full">

        {/* ── Breadcrumb + heading ── */}
        <div className="mb-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
            <Link to="/dashboard"       className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <ChevronRight size={12} style={{ color: "var(--border)" }} />
            <Link to="/dashboard/blogs" className="hover:text-indigo-600 transition-colors">Blogs</Link>
            <ChevronRight size={12} style={{ color: "var(--border)" }} />
            <span className="font-semibold" style={{ color: "var(--text)" }}>{id ? "Edit" : "New"}</span>
          </nav>
          <h1 className="text-xl font-black" style={{ color: "var(--text)" }}>
            {id ? "Edit Article" : "Add New Article"}
          </h1>
        </div>

        {/* ── Skeleton or form ── */}
        {id && isFetching ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Title */}
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {/* Content */}
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your blog content here…"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Thumbnail URL</label>
              <ThumbnailInput value={thumbnailUrl} onChange={setThumbnailUrl} />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categories</label>
              <Dropdown
                options={categories}
                value={category}
                onChange={setCategory}
                placeholder="Select Category"
                loading={catLoading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tags</label>
              <div
                className="rounded-lg px-3 py-2.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
                style={inputStyle}
              >
                <TagsInput tags={tags} onChange={setTags} />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                Press Enter or comma to add a tag
              </p>
            </div>

            {/* Status + Submit */}
            <div className="flex items-end gap-3 pt-2 pb-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status</label>
                <Dropdown
                  options={statusOpts}
                  value={status}
                  onChange={setStatus}
                  placeholder="Draft"
                  className="w-44"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2F327D] hover:bg-[#4144a7]
                  disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm
                  rounded-lg transition-all hover:shadow-md whitespace-nowrap ml-auto"
              >
                {busy ? (
                  <><Loader2 size={15} className="animate-spin" />{id ? "Updating…" : "Publishing…"}</>
                ) : (
                  id ? "Update Article" : "Publish Article"
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}