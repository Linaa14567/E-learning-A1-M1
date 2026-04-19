// import React, { useState, useRef, useEffect } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { FaMoon, FaSun, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import { CiLogin } from "react-icons/ci";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice";
// import { apiSlice } from "../features/api/apiSlice";
// import { useGetMeQuery } from "../features/users/userApi";

// const NavbarHaveAcc = () => {
//   // ───────────────── Theme ─────────────────
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("theme");
//     if (saved === "dark") document.documentElement.classList.add("dark");
//     return saved === "dark";
//   });
//   const getImageUrl = (path) => {
//     if (!path) return "/default-avatar.png";

//     // If already full URL, return as-is
//     if (path.startsWith("http")) return path;

//     return `${import.meta.env.VITE_API_BASE_URL}${path}`;
//   };
//   const toggleDarkMode = () => {
//     const next = !darkMode;
//     setDarkMode(next);
//     document.documentElement.classList.toggle("dark", next);
//     localStorage.setItem("theme", next ? "dark" : "light");
//   };

//   // ───────────────── UI State ─────────────────
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const profileRef = useRef(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // ───────────────── Auth ─────────────────
//   const token = useSelector((state) => state.auth.token);

//   // Fetch logged in user
//   const { data: userInfo, isLoading } = useGetMeQuery(undefined, {
//     skip: !token,
//     refetchOnMountOrArgChange: true,
//   });

//   // ───────────────── Close dropdown on outside click ─────────────────
//   useEffect(() => {
//     const handler = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // ───────────────── Logout ─────────────────
//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(apiSlice.util.resetApiState());
//     navigate("/login");
//   };

//   // ───────────────── Nav Links ─────────────────
//   const navLinks = [
//     ...(userInfo?.role === "teacher"
//       ? [{ to: "/teacher-dashboard", label: "Dashboard" }]
//       : []),
//     { to: "/courses", label: "Courses" },
//     { to: "/library", label: "Library" },
//     { to: "/blogs", label: "Blog" },
//     { to: "/about", label: "About Us" },
//     ...(userInfo?.role === "student"
//       ? [{ to: "/my-learning", label: "My Learning" }]
//       : []),
//   ];

//   const desktopLinkClass = ({ isActive }) =>
//     isActive
//       ? "text-gray-900 dark:text-white font-semibold border-b-2 border-gray-800 dark:border-white pb-0.5 text-[15px]"
//       : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-[15px] transition-colors pb-0.5";

//   return (
//     <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center h-16 md:h-20 relative">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src="/log1.png" alt="Logo" className="h-12 w-auto" />
//             </Link>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
//             {navLinks.map((link) => (
//               <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
//                 {link.label}
//               </NavLink>
//             ))}
//           </div>

//           {/* Right Side */}
//           <div className="ml-auto flex items-center gap-3">
//             {/* Dark Mode */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               {darkMode ? (
//                 <FaSun className="w-5 h-5 text-yellow-400" />
//               ) : (
//                 <FaMoon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
//               )}
//             </button>

//             {/* Logged In */}
//             {token ? (
//               <div className="relative" ref={profileRef}>
//                 {isLoading ? (
//                   <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
//                 ) : (
//                   <button onClick={() => setProfileOpen(!profileOpen)}>
//                     <img
//                       src={getImageUrl(userInfo?.profile_url)}
//                       alt="profile"
//                       className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400 transition"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "/default-avatar.png";
//                       }}
//                     />
//                   </button>
//                 )}

//                 {/* Dropdown */}
//                 {profileOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
//                     <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
//                       <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
//                         {userInfo?.full_name || "User"}
//                       </p>
//                       <p className="text-xs text-gray-400">{userInfo?.email}</p>
//                     </div>

//                     <NavLink
//                       to="/profile"
//                       onClick={() => setProfileOpen(false)}
//                       className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                     >
//                       <FaUserCircle className="w-4 h-4" /> Profile
//                     </NavLink>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition"
//                     >
//                       <FiLogOut className="w-4 h-4" /> Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
//               >
//                 <CiLogin size={20} /> Login
//               </Link>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               onClick={() => setMobileOpen(!mobileOpen)}
//             >
//               {mobileOpen ? (
//                 <FaTimes className="w-5 h-5" />
//               ) : (
//                 <FaBars className="w-5 h-5" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavbarHaveAcc;


import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { CiLogin } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { apiSlice } from '../features/api/apiSlice';
import { useGetMeQuery } from '../features/users/userApi';

const NavbarHaveAcc = () => {

  // ── Theme ──────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    return saved === 'dark';
  });

  const getImageUrl = (path) => {
    if (!path) return '/default-avatar.png';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // ── UI State ───────────────────────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Auth ───────────────────────────────────────────────────────────
  const token = useSelector((state) => state.auth.token);

  const { data: userInfo, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  // ── Close profile dropdown on outside click ────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    navigate('/login');
  };

  // ── Nav links (role-based) ─────────────────────────────────────────
  const navLinks = [
    // ...(userInfo?.role === 'teacher'
    //   ? [{ to: '/teacher-dashboard', label: 'Dashboard' }]
    //   : []),
    { to: '/courses', label: 'Courses' },
    { to: '/library', label: 'Library' },
    { to: '/blogs',   label: 'Blog'    },
    { to: '/about',   label: 'About Us'},
    // ...(userInfo?.role === 'student'
    //   ? [{ to: '/my-learning', label: 'My Learning' }]
    //   : []),
  ];

  const desktopLinkClass = ({ isActive }) =>
    isActive
      ? 'text-gray-900 dark:text-white font-semibold border-b-2 border-gray-800 dark:border-white pb-0.5 text-[15px]'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-[15px] transition-colors pb-0.5';

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg'
      : 'block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors';

  // ──────────────────────────────────────────────────────────────────
  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20 relative">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/log1.png" alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode
                ? <FaSun className="w-5 h-5 text-yellow-400" />
                : <FaMoon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              }
            </button>

            {/* Profile avatar — all screen sizes, between dark mode and burger */}
            {token ? (
              <div className="relative" ref={profileRef}>
                {isLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  <button onClick={() => setProfileOpen(!profileOpen)}>
                    <img
                      src={getImageUrl(userInfo?.profile_url)}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-blue-400 transition"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                    />
                  </button>
                )}

                {/* Profile dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {userInfo?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">{userInfo?.email}</p>
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <FaUserCircle className="w-4 h-4" /> Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
              >
                <CiLogin size={20} /> Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                : <FaBars className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              }
            </button>

          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-1 bg-white dark:bg-gray-950">

          {/* Nav links only */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={mobileLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Guest login link — only when no token */}
          {!token && (
            <div className="pt-2 mt-1 border-t border-gray-100 dark:border-gray-800">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <CiLogin size={18} /> Login
              </Link>
            </div>
          )}

        </div>
      )}
    </nav>
  );
};

export default NavbarHaveAcc;