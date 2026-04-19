// ─────────────────────────────────────────────────────────────
//  data/api.js
//  Replace these functions with real fetch() calls to your API.
//  Each function returns a Promise so swapping is seamless.
// ─────────────────────────────────────────────────────────────

// --- Mock data -------------------------------------------------
const _courses = [
  { id: 1, title: "UI/UX Design Fundamentals",  category: "Design",          type: "Free", students: 20, color: "from-blue-400 to-purple-500" },
  { id: 2, title: "React JS for Beginners",      category: "Web Development", type: "Paid", students: 20, color: "from-blue-600 to-blue-800"   },
  { id: 3, title: "Python Programming",          category: "Programming",     type: "Free", students: 20, color: "from-orange-400 to-red-500"   },
  { id: 4, title: "Database Design with SQL",    category: "Database",        type: "Paid", students: 20, color: "from-blue-400 to-cyan-500"    },
];

const _articles = [
  { id: 1, title: "Portrait Photography Masterclass", desc: "Portrait Photography Masterclass Portrait ...", author: "Yu Na", thumb: null },
  { id: 2, title: "Portrait Photography Masterclass", desc: "Portrait Photography Masterclass Portrait ...", author: "Yu Na", thumb: null },
];

const _books = [
  { id: 1, title: "Portrait Photography Masterclass", desc: "Portrait Photography Masterclass Portrait ...", author: "Yu Na", thumb: null },
  { id: 2, title: "Portrait Photography Masterclass", desc: "Portrait Photography Masterclass Portrait ...", author: "Yu Na", thumb: null },
];

const _stats = {
  totalCourses:    5,
  totalEnrollment: 1503,
  totalBlogs:      5,
  totalBooks:      8,
};

const _profile = {
  name:     "JohnDeo",
  role:     "Aspiring UI/UX Designer",
  bio:      "Passionate about creating intuitive digital experiences. Currently mastering Advanced React and Visual Design Systems.",
  online:   true,
  avatar:   null,
};

const _navItems = [
  { icon: "🎓", label: "Create Course" },
  { icon: "📝", label: "Add lesson"    },
  { icon: "❓", label: "Add quiz"      },
  { icon: "✏️", label: "Edit lesson"  },
  { icon: "📚", label: "Add Book"      },
  { icon: "💬", label: "Article"       },
];

// --- API functions ---------------------------------------------
// Swap the mock return for a real fetch, e.g.:
//   const res = await fetch("/api/profile");
//   return res.json();

export async function fetchProfile()  { return _profile;  }
export async function fetchNavItems() { return _navItems;  }
export async function fetchStats()    { return _stats;     }
export async function fetchCourses()  { return _courses;   }
export async function fetchArticles() { return _articles;  }
export async function fetchBooks()    { return _books;     }