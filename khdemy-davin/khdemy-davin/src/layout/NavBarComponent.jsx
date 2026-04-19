import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { CiLogin } from 'react-icons/ci';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    return saved === 'dark';
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { to: '/courses',  label: 'Courses'  },
    { to: '/library',  label: 'Library'  },
    { to: '/blogs',    label: 'Blog'     },
    { to: '/about',    label: 'About Us' },
  ];

  const desktopLinkClass = ({ isActive }) =>
    isActive
      ? 'text-gray-900 dark:text-white font-semibold border-b-2 border-gray-800 dark:border-white pb-0.5 text-[15px]'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-[15px] transition-colors pb-0.5';

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg'
      : 'block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors';

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

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode
                ? <FaSun className="w-5 h-5 text-yellow-400" />
                : <FaMoon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              }
            </button>

            {/* Login button */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
            >
              <CiLogin size={20} /> Login
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <FaTimes className="w-5 h-5" />
                : <FaBars className="w-5 h-5" />
              }
            </button>

          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-1 bg-white dark:bg-gray-950">
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
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <CiLogin size={18} /> Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;