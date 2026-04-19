// import { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, logout } from "./features/auth/authSlice";

// import RootLayout from "./layout/RootLayout";
// import BlogPage from "./pages/blog/BlogPage";
// import NotFound from "./components/home/NotFound";
// import AboutUs from "./pages/AboutUs";
// import CoursesPage from "./pages/course/Courses";
// import Login from "./pages/login/Login";
// import Registration from "./pages/register/Register";
// import Home from "./pages/Homepage";
// import TeacherDashboard from "./components/teacher/TeacherDashboard";
// import CreateCourse from "./pages/course/CreateCourse";
// import CreateBlog from "./pages/blog/CreateBlog";
// import CreateBook from "./pages/book/CreateBook";
// import MyAllArticles from "./components/ui/MyAllArticle";
// import ProfileCard from "./pages/teacher/ProfileTeacher";
// import AllCoursesTable from "./components/teacher/AllCourses";
// import EditCourse from "./pages/course/EditCourse";
// import AllBook from "./pages/book/AllBook";
// import CreateLesson from "./pages/lesson/CreateLesson";
// import BlogDetail from "./pages/blog/BlogDetail";
// import EditBlogForm from "./pages/blog/EditBlogForm";
// import AllBooks from "./components/teacher/AllBooks";
// import BookDetail from "./pages/book/BookDetail";
// import EditBook from "./pages/book/EditBook";
// import MyProgress from "./pages/course/MyProgress";
// import CoursePlayer from "./pages/course/CoursePlayer";
// import CourseDetail from "./pages/course/CourseDetail";
// import DashboardStudent from "./components/students/StudentDashboard";
// import MyProfile from "./components/students/MyProfile";
// import StudentDashboard from "./pages/student/StudentDashboard";
// import MyCourse from "./components/students/Mycourse";
// import StudentLayout from "./components/layout/StudentLayout";

// // ── Role-based profile guard ──────────────────────────────────────────────────
// // Reads the role from Redux auth state and renders the right dashboard.
// // Adjust the role strings below to match whatever your API returns
// // e.g. "teacher" | "student" | "admin"
// function ProfileRoute() {
//   const user = useSelector((state) => state.auth.user);

//   // Still loading — show spinner
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // Normalise: handle "Teacher", "TEACHER", "teacher" etc.
//   const role = (user.role ?? user.user_role ?? "student").toLowerCase();

//   // ✅ Teacher / Admin → TeacherDashboard
//   if (role === "teacher" || role === "admin") {
//     return <TeacherDashboard />;
//   }

//   // ✅ Student (default) → StudentDashboard
//   // return <StudentDashboard />;
//   return <DashboardStudent />;
// }

// function App() {
//   const dispatch = useDispatch();
//   const token    = useSelector((state) => state.auth.token);

//   // ── Rehydrate user on every page load / refresh ───────────────────────────
//   useEffect(() => {
//     if (!token) return;

//     fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (res.status === 401) {
//           dispatch(logout());
//           return null;
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data) dispatch(setUser(data));
//       })
//       .catch(() => {});
//   }, [token]);

//   return (
//     <Routes>

//       {/* ── Shared header/footer layout ── */}
//       <Route element={<RootLayout />}>
//         <Route path="/"                           element={<Home />} />
//         <Route path="/courses"                    element={<CoursesPage />} />
//         <Route path="/courses/:id"                element={<CourseDetail/>} />
//         <Route path="/about"                      element={<AboutUs />} />
//         <Route path="/blogs"                      element={<BlogPage />} />
//         <Route path="/library"                    element={<AllBook />} />

//         {/* ✅ Role-based: student → StudentDashboard, teacher → TeacherDashboard */}
//         <Route path="/profile"                    element={<ProfileRoute />} />

//         {/* Teacher-only pages */}
//         <Route path="/teacher/create-course"      element={<CreateCourse />} />
//         <Route path="/teacher/add-book"           element={<CreateBook />} />
//         <Route path="/teacher/add-lesson"         element={<CreateLesson />} />
//         <Route path="/teacher/edit-profile"       element={<ProfileCard />} />
// <Route path="/dashboard/courses/:id/edit" element={<EditCourse />} />
// <Route path="/dashboard/books/edit/:id"   element={<EditBook />} />
// <Route path="/profile/all-courses"        element={<AllCoursesTable />} />
// <Route path="/profile/all-books"          element={<AllBooks />} />
// <Route path="profile/all-blogs"           element={<MyAllArticles />} />

//         {/* Student */}
//         <Route element={<StudentLayout />}>
//         <Route path="student/dashboard"  element={<StudentDashboard />} />
//         <Route path="/student/courses"    element={<MyCourse />} />
//         <Route path="/student/progress"   element={<MyProgress />} />
//         <Route path="/student/profile"    element={<MyProfile />} />
//         {/* <Route path="/student/blog"       element={<MyBlog />} /> */}

//         {/* Default redirect: /student → /student/dashboard */}
//         <Route index path="/student"      element={<Navigate to="/student/dashboard" replace />} />
//       </Route>
//         {/* Shared pages */}
//         <Route path="/blogs/create"               element={<CreateBlog />} />
//         <Route path="/blogs/edit/:id"             element={<EditBlogForm />} />
//         <Route path="/blogs/:id"                  element={<BlogDetail />} />
//         <Route path="/books/:id"                  element={<BookDetail />} />
//         <Route path="/my-progress"                element={<MyProgress />} />
//         <Route path="/courses/:id/play"           element={<CoursePlayer />} />
//       </Route>

//       {/* ── Auth routes (no layout) ── */}
//       <Route path="/login"    element={<Login />} />
//       <Route path="/register" element={<Registration />} />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;
// import { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, logout } from "./features/auth/authSlice";

// // Layouts
// import RootLayout from "./layout/RootLayout";
// import TeacherLayout from "./components/layout/TeacherLayout";
// import StudentLayout from "./components/layout/StudentLayout";

// // Public / shared pages
// import Home from "./pages/Homepage";
// import CoursesPage from "./pages/course/Courses";
// import CourseDetail from "./pages/course/CourseDetail";
// import CoursePlayer from "./pages/course/CoursePlayer";
// import AboutUs from "./pages/AboutUs";
// import BlogPage from "./pages/blog/BlogPage";
// import BlogDetail from "./pages/blog/BlogDetail";
// import CreateBlog from "./pages/blog/CreateBlog";
// import EditBlogForm from "./pages/blog/EditBlogForm";
// import AllBook from "./pages/book/AllBook";
// import BookDetail from "./pages/book/BookDetail";
// import NotFound from "./components/home/NotFound";
// import Login from "./pages/login/Login";
// import Registration from "./pages/register/Register";

// // Teacher pages
// import TeacherDashboard from "./components/teacher/TeacherDashboard";
// import CreateCourse from "./pages/course/CreateCourse";
// import EditCourse from "./pages/course/EditCourse";
// import CreateLesson from "./pages/lesson/CreateLesson";
// import CreateBook from "./pages/book/CreateBook";
// import EditBook from "./pages/book/EditBook";
// import ProfileCard from "./pages/teacher/ProfileTeacher";
// import AllCoursesTable from "./components/teacher/AllCourses";
// import AllBooks from "./components/teacher/AllBooks";
// import MyAllArticles from "./components/ui/MyAllArticle";

// // Student pages

// import MyCourse from "./components/students/Mycourse";
// import MyProgress from "./pages/course/MyProgress";
// import MyProfile from "./components/students/MyProfile";
// import DashboardStudent from "./components/students/StudentDashboard";
// import BookmarksPage from "./components/ui/BookmarksPage";
// // import MyBlog        from "./components/students/MyBlog"

// // ── Role guard ───

// function RoleRedirect() {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   const role = (user.role ?? user.user_role ?? "student").toLowerCase();

//   if (role === "teacher" || role === "admin") {
//     return <Navigate to="/teacher/dashboard" replace />;
//   }

//   return <Navigate to="/student/dashboard" replace />;
// }

// // ── App ───────────────────────────────────────────────────────────────────────
// function App() {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);

//   // Rehydrate user on every page load / refresh
//   useEffect(() => {
//     if (!token) return;
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (res.status === 401) {
//           dispatch(logout());
//           return null;
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data) dispatch(setUser(data));
//       })
//       .catch(() => {});
//   }, [token]);

//   return (
//     <Routes>
//       {/* ── Public layout (shared header + footer) ── */}
//       <Route element={<RootLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/courses" element={<CoursesPage />} />
//         <Route path="/courses/:id" element={<CourseDetail />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/blogs" element={<BlogPage />} />
//         <Route path="/blogs/:id" element={<BlogDetail />} />
        
//         <Route path="/blogs/edit/:id" element={<EditBlogForm />} />
//         <Route path="/library" element={<AllBook />} />
//         <Route path="/books/:id" element={<BookDetail />} />
//         <Route path="/courses/:id/play" element={<CoursePlayer />} />
//         <Route path="/blogs/create" element={<CreateBlog />} />
//         {/* /profile → redirect to role-specific dashboard */}
//         <Route path="/profile" element={<RoleRedirect />} />

//         {/* ── Teacher layout (sidebar + scrollable main) ── */}
//         <Route element={<TeacherLayout />}>
//           <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//           <Route path="/teacher/create-course" element={<CreateCourse />} />
//           <Route path="/teacher/add-lesson" element={<CreateLesson />} />
//           <Route path="/teacher/add-book" element={<CreateBook />} />
//           <Route path="/teacher/edit-profile" element={<ProfileCard />} />
//           <Route path="/teacher/courses/:id/edit" element={<EditCourse />} />
//           <Route path="/teacher/books/edit/:id" element={<EditBook />} />
//           <Route path="/teacher/all-courses" element={<AllCoursesTable />} />
//           <Route path="/teacher/all-books" element={<AllBooks />} />
//           <Route path="/teacher/all-blogs" element={<MyAllArticles />} />
//           <Route path="/dashboard/courses/:id/edit" element={<EditCourse />} />
//           <Route path="/dashboard/books/edit/:id" element={<EditBook />} />
//           <Route path="/profile/all-courses" element={<AllCoursesTable />} />
//           <Route path="/profile/all-books" element={<AllBooks />} />
//           <Route path="/profile/all-blogs" element={<MyAllArticles />} />
//           <Route path="/bookmarks" element={<BookmarksPage />} />
//           {/* Default redirect: /teacher → /teacher/dashboard */}

//           <Route
//             path="/teacher"
//             element={<Navigate to="/teacher/dashboard" replace />}
//           />
//         </Route>

//         {/* ── Student layout (sidebar + scrollable main) ── */}
//           <Route element={<StudentLayout />}>
//             <Route path="/student/dashboard" element={<DashboardStudent />} />
//             <Route path="/student/courses" element={<MyCourse />} />
//             <Route path="/student/progress" element={<MyProgress />} />
//             <Route path="/student/profile" element={<MyProfile />} />
            
//             {/* <Route path="/student/blog"   element={<MyBlog />} /> */}

//             {/* Default redirect: /student → /student/dashboard */}
//             <Route
//               path="/student"
//               element={<Navigate to="/student/dashboard" replace />}
//             />
//           </Route>
//       </Route>

//       {/* ── Auth routes (no layout) ── */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Registration />} />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;



import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "./features/auth/authSlice";

// Layouts
import RootLayout from "./layout/RootLayout";
import TeacherLayout from "./components/layout/TeacherLayout";
import StudentLayout from "./components/layout/StudentLayout";

// Public / shared pages
import Home from "./pages/Homepage";
import CoursesPage from "./pages/course/Courses";
import CourseDetail from "./pages/course/CourseDetail";
import CoursePlayer from "./pages/course/CoursePlayer";
import AboutUs from "./pages/AboutUs";
import BlogPage from "./pages/blog/BlogPage";
import BlogDetail from "./pages/blog/BlogDetail";
import CreateBlog from "./pages/blog/CreateBlog";
import EditBlogForm from "./pages/blog/EditBlogForm";
import AllBook from "./pages/book/AllBook";
import BookDetail from "./pages/book/BookDetail";
import NotFound from "./components/home/NotFound";
import Login from "./pages/login/Login";
import Registration from "./pages/register/Register";

// Teacher pages
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import CreateCourse from "./pages/course/CreateCourse";
import EditCourse from "./pages/course/EditCourse";
import CreateLesson from "./pages/lesson/CreateLesson";
import CreateBook from "./pages/book/CreateBook";
import EditBook from "./pages/book/EditBook";
import ProfileCard from "./pages/teacher/ProfileTeacher";
import AllCoursesTable from "./components/teacher/AllCourses";
import AllBooks from "./components/teacher/AllBooks";
import MyAllArticles from "./components/ui/MyAllArticle";

// Student pages
import MyCourse from "./components/students/Mycourse";
import MyProgress from "./pages/course/MyProgress";
import MyProfile from "./components/students/MyProfile";
import DashboardStudent from "./components/students/StudentDashboard";
import BookmarksPage from "./components/ui/BookmarksPage";

// ── Role guard ────────────────────────────────────────────────────────────────
function RoleRedirect() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const role = (user.role ?? user.user_role ?? "student").toLowerCase();

  if (role === "teacher" || role === "admin") {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <Navigate to="/student/dashboard" replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          dispatch(logout());
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) dispatch(setUser(data));
      })
      .catch(() => {});
  }, [token]);

  return (
    <Routes>
      {/* ── Public layout ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blogs/edit/:id" element={<EditBlogForm />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/library" element={<AllBook />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/courses/:id/play" element={<CoursePlayer />} />
        <Route path="/profile" element={<RoleRedirect />} />

        {/* ── Teacher layout ── */}
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard"         element={<TeacherDashboard />} />
          <Route path="/teacher/create-course"     element={<CreateCourse />} />
          <Route path="/teacher/add-lesson"        element={<CreateLesson />} />
          <Route path="/teacher/add-book"          element={<CreateBook />} />
          <Route path="/teacher/edit-profile"      element={<ProfileCard />} />
          <Route path="/teacher/courses/:id/edit"  element={<EditCourse />} />
          <Route path="/teacher/books/edit/:id"    element={<EditBook />} />
          <Route path="/teacher/all-courses"       element={<AllCoursesTable />} />
          <Route path="/teacher/all-books"         element={<AllBooks />} />
          <Route path="/teacher/all-blogs"         element={<MyAllArticles />} />

          {/* ✅ បន្ថែម route /dashboard/courses ដែល CreateCourse.jsx navigate មក */}
          <Route path="/dashboard/courses"         element={<AllCoursesTable />} />
          <Route path="/dashboard/courses/:id/edit" element={<EditCourse />} />
          <Route path="/dashboard/books/edit/:id"  element={<EditBook />} />

          <Route path="/profile/all-courses"       element={<AllCoursesTable />} />
          <Route path="/profile/all-books"         element={<AllBooks />} />
          <Route path="/profile/all-blogs"         element={<MyAllArticles />} />
          <Route path="/bookmarks"                 element={<BookmarksPage />} />

          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
        </Route>

        {/* ── Student layout ── */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<DashboardStudent />} />
          <Route path="/student/courses"   element={<MyCourse />} />
          <Route path="/student/progress"  element={<MyProgress />} />
          <Route path="/student/profile"   element={<MyProfile />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        </Route>
      </Route>

      {/* ── Auth routes ── */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="*"         element={<NotFound />} />
    </Routes>
  );
}

export default App;