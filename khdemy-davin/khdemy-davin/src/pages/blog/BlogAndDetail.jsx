import { useState } from "react"
import BlogPage   from "./BlogPage"
import BlogDetail from "./BlogDetail"

/**
 * App.jsx — root entry point
 *
 * Manages which page is visible:
 *   selectedBlog = null  →  show BlogPage (list)
 *   selectedBlog = {...} →  show BlogDetail for that blog
 */
export default function Bd() {
  const [selectedBlog, setSelectedBlog] = useState(null)

  return selectedBlog
    ? <BlogDetail blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
    : <BlogPage   onSelectBlog={(blog) => setSelectedBlog(blog)} />
}