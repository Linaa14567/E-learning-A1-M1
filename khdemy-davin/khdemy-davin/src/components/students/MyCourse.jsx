import { useState } from 'react'
import CourseCard from './CourseCard'


const ENROLLED = [
  {
    id: 1, title: "Data Structures and Algorithms", instructor: "Prof. Sarah Mitchell", cat: "CS", color: "indigo",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop",
    progress: 72, total: 45, done: 32, level: "Intermediate", description: "Master DSA fundamentals.",
    modules: [
      { id: 1, title: "Foundations", lessons: [{ id: "1.1", title: "Intro to Big O", duration: "8:24", done: true }, { id: "1.2", title: "Memory Management", duration: "12:10", done: true }] },
      { id: 2, title: "Linear Structures", lessons: [{ id: "2.1", title: "Arrays and Linked Lists", duration: "28:30", done: false, active: true }, { id: "2.2", title: "Stacks and Queues", duration: "18:45", done: false, locked: true }] },
      { id: 3, title: "Non-Linear", lessons: [{ id: "3.1", title: "Binary Search Trees", duration: "22:00", done: false, locked: true }, { id: "3.2", title: "Graph Traversals", duration: "25:15", done: false, locked: true }] },
    ],
  },
  {
    id: 2, title: "React and Modern Frontend", instructor: "Mr. James Anderson", cat: "Web", color: "sky",
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop",
    progress: 45, total: 36, done: 16, level: "Beginner", description: "Build apps with React.",
    modules: [{ id: 1, title: "React Basics", lessons: [{ id: "1.1", title: "What is React?", duration: "10:00", done: true }, { id: "1.2", title: "JSX and Components", duration: "14:20", done: true }] }, { id: 2, title: "Hooks", lessons: [{ id: "2.1", title: "useState and useEffect", duration: "22:00", done: false, active: true }, { id: "2.2", title: "Custom Hooks", duration: "18:00", done: false, locked: true }] }],
  },
  {
    id: 3, title: "UI/UX Design Principles", instructor: "Ms. Elena Rossi", cat: "Design", color: "pink",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
    progress: 90, total: 28, done: 25, level: "Beginner", description: "Master user-centered design.",
    modules: [{ id: 1, title: "Foundations", lessons: [{ id: "1.1", title: "Color Theory", duration: "9:00", done: true }, { id: "1.2", title: "Typography", duration: "11:30", done: false, active: true }] }],
  },
  {
    id: 4, title: "Python for Data Science", instructor: "Dr. Kevin Park", cat: "Data", color: "amber",
    img: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=340&fit=crop",
    progress: 20, total: 52, done: 10, level: "Advanced", description: "Analyze data with Python.",
    modules: [{ id: 1, title: "Python Basics", lessons: [{ id: "1.1", title: "Variables and Types", duration: "8:00", done: true }, { id: "1.2", title: "Functions", duration: "12:00", done: false, active: true }] }],
  },
]

const COMPLETED = [
  { id: 5, title: "HTML and CSS Fundamentals", instructor: "Ms. Laura Kim", color: "violet", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=340&fit=crop", grade: "A+", cat: "Web" },
  { id: 6, title: "Introduction to Git", instructor: "Mr. Chris Nguyen", color: "emerald", img: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=340&fit=crop", grade: "A", cat: "DevOps" },
]

const SAVED = [
  { id: 10, title: "Machine Learning A-Z", instructor: "Dr. Andrew Lee", color: "violet", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=340&fit=crop", rating: 4.9, price: "Free", cat: "AI/ML" },
  { id: 11, title: "Node.js Express API", instructor: "Mr. Brad Traversy", color: "emerald", img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=340&fit=crop", rating: 4.7, price: "$29", cat: "Backend" },
  { id: 12, title: "Figma UI Design", instructor: "Ms. Sara Sanders", color: "amber", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop", rating: 4.8, price: "Free", cat: "Design" },
]

const TABS = [
  ["current",  "Current"],
  ["complete", "Completed"],
  ["saved",    "Saved"],
]

/**
 * MyCourse — standalone page component
 *
 * Props:
 *  openCourse(course)  – called when the user clicks a current-course card
 */
export default function MyCourse({ openCourse }) {
  const [tab, setTab] = useState("current")

  const data = tab === "current" ? ENROLLED : tab === "complete" ? COMPLETED : SAVED
  const type = tab === "current" ? "enrolled" : tab === "complete" ? "completed" : "saved"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>
            My Courses
          </h1>
          <p className="text-sm text-slate-400">Track and continue your learning</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit mb-6 border border-slate-200">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={"px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all " +
              (tab === k ? "bg-indigo-600 text-white shadow-md" : "bg-transparent text-slate-500 hover:text-slate-700")}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((c, i) => (
          <CourseCard
            key={i}
            c={c}
            type={type}
            onClick={type === "enrolled" ? () => openCourse?.(c) : undefined}
          />
        ))}
      </div>
    </div>
  )
}