// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function ProtectedRoute({ allowedRoles = [] }) {
//   const { access_token, user } = useSelector(state => state.auth);

//   if (!access_token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// }

// components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}