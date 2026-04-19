import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Download,
  Loader2,
} from "lucide-react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// ─── Fix Cloudinary PDF URLs ───────────────────────────────────────────────────
// Old uploads landed under /image/upload/ which Cloudinary blocks (401).
// PDFs must be served from /raw/upload/ to be publicly accessible.
const fixCloudinaryPdfUrl = (url) => {
  if (!url) return url;
  // Upgrade http → https
  let fixed = url.startsWith("http://") ? url.replace("http://", "https://") : url;
  // Replace /image/upload/ with /raw/upload/ for Cloudinary PDF URLs
  if (fixed.includes("res.cloudinary.com") && fixed.includes("/image/upload/")) {
    fixed = fixed.replace("/image/upload/", "/raw/upload/");
  }
  return fixed;
};

export default function BookDetailsPdf({ fileUrl }) {
  const [numPages,        setNumPages]        = useState(null);
  const [pageNumber,      setPageNumber]      = useState(1);
  const [loading,         setLoading]         = useState(true);
  const [containerWidth,  setContainerWidth]  = useState(null);
  const [isFullscreen,    setIsFullscreen]    = useState(false);

  const viewerRef    = useRef(null);
  const containerRef = useRef(null);

  const safeFileUrl = fixCloudinaryPdfUrl(fileUrl);

  useEffect(() => {
    const update = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth - 24);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const goPrev = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goNext = () => setPageNumber((p) => Math.min(p + 1, numPages));

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      viewerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href     = safeFileUrl;
    a.download = safeFileUrl?.split("/").pop() || "document.pdf";
    a.target   = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!safeFileUrl) {
    return (
      <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200
        dark:border-gray-700 flex flex-col items-center justify-center gap-3
        bg-gray-50 dark:bg-gray-800/40"
      >
        <span className="text-5xl">📄</span>
        <p className="text-sm text-gray-400 font-medium">No PDF available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── Controls bar ── */}
      <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2.5
        bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700
        w-full max-w-sm flex-wrap shadow-sm"
      >
        <button
          onClick={goPrev}
          disabled={pageNumber <= 1}
          title="Previous page"
          className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <input
            type="number"
            min={1}
            max={numPages || 1}
            value={pageNumber}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= (numPages || 1)) setPageNumber(v);
            }}
            className="w-14 text-center border border-gray-200 dark:border-gray-600
              bg-white dark:bg-gray-700 dark:text-white rounded-lg px-2 py-1 text-sm outline-none
              focus:border-blue-400 transition"
          />
          <span className="text-gray-500 dark:text-gray-400">
            / {numPages ?? 0}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={pageNumber >= (numPages ?? 1)}
          title="Next page"
          className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} />
        </button>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
            rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition ml-2"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>

        <button
          onClick={handleDownload}
          title="Download PDF"
          className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
            rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <Download size={14} />
        </button>
      </div>

      {/* ── PDF viewer ── */}
      <div
        ref={viewerRef}
        className={`relative w-full flex justify-center overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 pt-16 overflow-y-auto"
            : "min-h-[500px] rounded-xl"
        }`}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20
            bg-white/80 dark:bg-gray-900/80"
          >
            <Loader2 className="animate-spin text-blue-500" size={44} />
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm">
              Loading document…
            </p>
          </div>
        )}

        <div
          ref={containerRef}
          className="p-2 overflow-y-auto max-h-full w-full flex justify-center rounded-md"
        >
          <Document
            file={safeFileUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={() => setLoading(false)}
            loading={null}
            error={<p className="text-red-500">Failed to load PDF</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={containerWidth ?? undefined}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="mx-auto shadow-lg"
            />
          </Document>
        </div>
      </div>

    </div>
  );
}