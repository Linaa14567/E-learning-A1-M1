// // RichTextEditor.jsx
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import { useCallback } from "react";
// import {
//   Bold, Italic, UnderlineIcon, Strikethrough, List, ListOrdered,
//   AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
//   Heading1, Heading2, Heading3, Quote, Code, Undo, Redo, Minus,
// } from "lucide-react";

// // ─── Toolbar Button ───────────────────────────────────────────────────────────
// const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
//   <button
//     type="button"
//     onMouseDown={(e) => { e.preventDefault(); onClick(); }}
//     disabled={disabled}
//     title={title}
//     className={`p-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
//       active ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700" : ""
//     }`}
//     style={active ? {} : { color: "var(--text-muted)" }}
//   >=
//     {children}
//   </button>
// );

// const Divider = () => (
//   <div className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />
// );

// // ─── Main Editor ──────────────────────────────────────────────────────────────
// export default function RichTextEditor({ value, onChange, placeholder = "Write your blog content here…" }) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Underline,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: { class: "text-indigo-600 underline cursor-pointer hover:text-indigo-800" },
//       }),
//       Placeholder.configure({ placeholder, emptyEditorClass: "is-editor-empty" }),
//     ],
//     content: value,
//     onUpdate: ({ editor }) => onChange(editor.getHTML()),
//     editorProps: {
//       attributes: {
//         class: "prose prose-sm max-w-none min-h-[220px] px-4 py-3 text-sm leading-relaxed outline-none",
//       },
//     },
//   });

//   const setLink = useCallback(() => {
//     if (!editor) return;
//     const prev = editor.getAttributes("link").href;
//     const url = window.prompt("Enter URL:", prev || "https://");
//     if (url === null) return;
//     if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
//     editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
//   }, [editor]);

//   if (!editor) return null;

//   return (
//     <div
//       className="rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all"
//       style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
//     >
//       {/* ── Toolbar ── */}
//       <div
//         className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
//         style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-soft)" }}
//       >
//         <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={14} /></ToolbarBtn>
//         <Divider />
//         <ToolbarBtn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></ToolbarBtn>
//         <Divider />
//         <ToolbarBtn title="Bold"          active={editor.isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Italic"        active={editor.isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Underline"     active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Strikethrough" active={editor.isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Inline Code"   active={editor.isActive("code")}      onClick={() => editor.chain().focus().toggleCode().run()}><Code size={14} /></ToolbarBtn>
//         <Divider />
//         <ToolbarBtn title="Align Left"   active={editor.isActive({ textAlign: "left" })}   onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Align Right"  active={editor.isActive({ textAlign: "right" })}  onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={14} /></ToolbarBtn>
//         <Divider />
//         <ToolbarBtn title="Bullet List"  active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></ToolbarBtn>
//         <Divider />
//         <ToolbarBtn title="Blockquote"      active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></ToolbarBtn>
//         <ToolbarBtn title="Link"            active={editor.isActive("link")}       onClick={setLink}><LinkIcon size={14} /></ToolbarBtn>
//       </div>

//       {/* ── Editor Area ── */}
//       <EditorContent editor={editor} />

//       {/* ── Word count ── */}
//       <div
//         className="flex justify-end px-3 py-1"
//         style={{ borderTop: "1px solid var(--border)", background: "var(--bg-soft)" }}
//       >
//         <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
//           {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
//         </span>
//       </div>

//       {/* ── Styles ── */}
//       <style>{`
//         .tiptap.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: var(--text-muted);
//           pointer-events: none;
//           height: 0;
//         }
//         .tiptap                { color: var(--text); }
//         .tiptap h1             { font-size: 1.5rem;  font-weight: 800; margin: 0.75rem 0 0.5rem;  color: var(--text); }
//         .tiptap h2             { font-size: 1.25rem; font-weight: 700; margin: 0.65rem 0 0.4rem;  color: var(--text); }
//         .tiptap h3             { font-size: 1.1rem;  font-weight: 600; margin: 0.5rem  0 0.35rem; color: var(--text); }
//         .tiptap p              { margin: 0.25rem 0; }
//         .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0.4rem 0; }
//         .tiptap li             { margin: 0.15rem 0; }
//         .tiptap blockquote     { border-left: 3px solid #6366f1; padding-left: 1rem; margin: 0.5rem 0; color: var(--text-muted); font-style: italic; }
//         .tiptap code           { background: var(--bg-soft); padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.8rem; color: #6366f1; }
//         .tiptap hr             { border: none; border-top: 1px solid var(--border); margin: 0.75rem 0; }
//         .tiptap pre            { background: var(--bg-soft); color: var(--text); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; border: 1px solid var(--border); }
//         :root.dark .tiptap pre { background: #0f0f1a; color: #f1f1f1; }
//       `}</style>
//     </div>
//   );
// }

// RichTextEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Heading1, Heading2, Heading3, Quote, Code, Undo, Redo, Minus,
} from "lucide-react";

// ─── Toolbar Button ───────────────────────────────────────────────────────────
const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
      active ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700" : ""
    }`}
    style={active ? {} : { color: "var(--text-muted)" }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />
);

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = "Write your blog content here…" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-indigo-600 underline cursor-pointer hover:text-indigo-800" },
      }),
      Placeholder.configure({ placeholder, emptyEditorClass: "is-editor-empty" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getText()), // ✅ plain text only
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[220px] px-4 py-3 text-sm leading-relaxed outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-soft)" }}
      >
        <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={14} /></ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={14} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={14} /></ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Bold"          active={editor.isActive("bold")}      onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></ToolbarBtn>
        <ToolbarBtn title="Italic"        active={editor.isActive("italic")}    onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></ToolbarBtn>
        <ToolbarBtn title="Underline"     active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={editor.isActive("strike")}    onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></ToolbarBtn>
        <ToolbarBtn title="Inline Code"   active={editor.isActive("code")}      onClick={() => editor.chain().focus().toggleCode().run()}><Code size={14} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Align Left"   active={editor.isActive({ textAlign: "left" })}   onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={14} /></ToolbarBtn>
        <ToolbarBtn title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={14} /></ToolbarBtn>
        <ToolbarBtn title="Align Right"  active={editor.isActive({ textAlign: "right" })}  onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={14} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Bullet List"  active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></ToolbarBtn>
        <ToolbarBtn title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Blockquote"      active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></ToolbarBtn>
        <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></ToolbarBtn>
        <ToolbarBtn title="Link"            active={editor.isActive("link")}       onClick={setLink}><LinkIcon size={14} /></ToolbarBtn>
      </div>

      {/* ── Editor Area ── */}
      <EditorContent editor={editor} />

      {/* ── Word count ── */}
      <div
        className="flex justify-end px-3 py-1"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-soft)" }}
      >
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* ── Styles ── */}
      <style>{`
        .tiptap.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-muted);
          pointer-events: none;
          height: 0;
        }
        .tiptap                { color: var(--text); }
        .tiptap h1             { font-size: 1.5rem;  font-weight: 800; margin: 0.75rem 0 0.5rem;  color: var(--text); }
        .tiptap h2             { font-size: 1.25rem; font-weight: 700; margin: 0.65rem 0 0.4rem;  color: var(--text); }
        .tiptap h3             { font-size: 1.1rem;  font-weight: 600; margin: 0.5rem  0 0.35rem; color: var(--text); }
        .tiptap p              { margin: 0.25rem 0; }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0.4rem 0; }
        .tiptap li             { margin: 0.15rem 0; }
        .tiptap blockquote     { border-left: 3px solid #6366f1; padding-left: 1rem; margin: 0.5rem 0; color: var(--text-muted); font-style: italic; }
        .tiptap code           { background: var(--bg-soft); padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.8rem; color: #6366f1; }
        .tiptap hr             { border: none; border-top: 1px solid var(--border); margin: 0.75rem 0; }
        .tiptap pre            { background: var(--bg-soft); color: var(--text); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; border: 1px solid var(--border); }
        :root.dark .tiptap pre { background: #0f0f1a; color: #f1f1f1; }
      `}</style>
    </div>
  );
}