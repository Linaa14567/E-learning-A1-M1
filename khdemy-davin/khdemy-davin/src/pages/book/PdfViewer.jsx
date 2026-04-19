import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, AlertTriangle, ExternalLink } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// ─── Detect if a URL is likely CORS-safe (Cloudinary or same-origin) ──────────
const isCORSSafe = (url) => {
  if (!url) return false;
  try {
    const { hostname, origin } = new URL(url);
    return (
      hostname.includes("cloudinary.com") ||
      hostname.includes("res.cloudinary.com") ||
      origin === window.location.origin
    );
  } catch {
    return false; // relative URL = same-origin = safe
  }
};

// ─── Native fallback (iframe) for CORS-blocked PDFs ──────────────────────────
const IframeFallback = ({ url }) => (
  <div className="w-full flex flex-col items-center gap-3">
    <div
      className="w-full rounded-xl overflow-hidden border"
      style={{ border: "1px solid var(--border)", height: "75vh" }}
    >
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
    >
      <ExternalLink size={13} />
      Open PDF in new tab
    </a>
  </div>
);

// ─── Main PdfViewer ───────────────────────────────────────────────────────────
export default function PdfViewer({ url }) {
  const [numPages,    setNumPages]    = useState(null);
  const [pageNumber,  setPageNumber]  = useState(1);
  const [scale,       setScale]       = useState(1.0);
  const [loadError,   setLoadError]   = useState(false);
  const [corsBlocked, setCorsBlocked] = useState(!isCORSSafe(url));

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoadError(false);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    const msg = err?.message ?? "";
    // react-pdf wraps CORS failures as UnknownErrorException / Failed to fetch
    if (
      msg.includes("Failed to fetch") ||
      msg.includes("UnknownErrorException") ||
      msg.includes("CORS")
    ) {
      setCorsBlocked(true);
    } else {
      setLoadError(true);
    }
  }, []);

  // ── CORS-blocked: fall back to Google Docs viewer + direct link ──────────
  if (corsBlocked) {
    return <IframeFallback url={url} />;
  }

  // ── Generic load error ────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div
        className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-16 px-8 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <AlertTriangle size={32} className="text-amber-400" />
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Could not load the PDF
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          The file may be unavailable or in an unsupported format.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:underline mt-1"
        >
          <ExternalLink size={12} />
          Try opening directly
        </a>
      </div>
    );
  }

  // ── Normal react-pdf render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Controls */}
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {/* Pagination */}
        <button
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          className="p-1.5 rounded-lg transition-all hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} style={{ color: "var(--text)" }} />
        </button>

        <span className="text-xs font-medium tabular-nums" style={{ color: "var(--text)" }}>
          {pageNumber} / {numPages ?? "…"}
        </span>

        <button
          onClick={() => setPageNumber((p) => Math.min(numPages ?? p, p + 1))}
          disabled={pageNumber >= (numPages ?? 1)}
          className="p-1.5 rounded-lg transition-all hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} style={{ color: "var(--text)" }} />
        </button>

        <div className="w-px h-4 mx-1" style={{ background: "var(--border)" }} />

        {/* Zoom */}
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          disabled={scale <= 0.5}
          className="p-1.5 rounded-lg transition-all hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ZoomOut size={16} style={{ color: "var(--text)" }} />
        </button>

        <span className="text-xs font-medium tabular-nums w-10 text-center" style={{ color: "var(--text)" }}>
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale((s) => Math.min(2.5, s + 0.1))}
          disabled={scale >= 2.5}
          className="p-1.5 rounded-lg transition-all hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ZoomIn size={16} style={{ color: "var(--text)" }} />
        </button>
      </div>

      {/* PDF Canvas */}
      <div
        className="rounded-2xl overflow-auto max-h-[75vh] shadow-sm"
        style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center gap-2 py-20 px-16">
              <Loader2 size={20} className="animate-spin text-indigo-500" />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading PDF…</span>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}