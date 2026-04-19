// import { useState } from "react";
// import { z } from "zod";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useLoginMutation } from "../../features/auth/authApi";
// import { setCredentials } from "../../features/auth/authSlice";

// const loginSchema = z.object({
//   password: z.string().min(1, "Password is required"),
// });

// const EyeOpen = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//     <circle cx="12" cy="12" r="3"/>
//   </svg>
// );

// const EyeOff = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
//     <line x1="1" y1="1" x2="23" y2="23"/>
//   </svg>
// );

// const MailIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="2"/>
//     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
//   </svg>
// );

// const LockIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
//     <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//   </svg>
// );

// const FacebookIcon = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2">
//     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//   </svg>
// );

// const GoogleIcon = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24">
//     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//   </svg>
// );

// const toFieldErrors = (issues) => {
//   const out = {};
//   issues.forEach((issue) => {
//     const key = issue.path?.[0];
//     if (key && !out[key]) out[key] = issue.message;
//   });
//   return out;
// };

// export default function LoginComponent({ onGoRegister, onForgotPassword }) {
//   const [form, setForm]                 = useState({ email: "", password: "" });
//   const [errors, setErrors]             = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [remember, setRemember]         = useState(false);
//   const [apiError, setApiError]         = useState("");
//   const [success, setSuccess]           = useState(false);

//   const dispatch   = useDispatch();
//   const navigate   = useNavigate();
//   const [login, { isLoading }] = useLoginMutation();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//     if (apiError)     setApiError("");
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const result = loginSchema.safeParse(form);
//   if (!result.success) {
//     setErrors(toFieldErrors(result.error.issues));
//     return;
//   }

//   try {
//     const res = await login({
//       identifier: form.email,
//       password: form.password,
//     }).unwrap();

//     dispatch(setCredentials(res));

//     setSuccess(true);

//     setTimeout(() => {
//       navigate('/');
//     }, 1000);

//   } catch (err) {
//     setApiError(err?.data?.message || "Invalid credentials");
//   }
// };

//   const inputCls = (hasError) => [
//     "w-full bg-[#dbeafe] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1a2a50]",
//     "outline-none transition-all duration-200 border-2",
//     "placeholder:text-[#93afd4]",
//     "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
//     hasError ? "border-red-400 bg-red-50" : "border-transparent",
//   ].join(" ");

//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] bg-gray-900 auth-font-body">

//       {/* ── LEFT PANEL ── */}
//       <div className="hidden lg:flex flex-col items-center justify-center relative bg-[#1a2a50] overflow-hidden px-10">
//         <div className="absolute w-[450px] h-[450px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//           style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

//         <div className="relative z-10 w-150 rounded-6xl overflow-hidden auth-float flex items-center justify-center mb-8"
//           style={{ background: "rgba(255,255,255,0.08)" }}>
//           <img
//             src="https://cdn.prod.website-files.com/6443d6d96a788f6942166567/647011e6041bb767ea7934ed_mobiledevelopment-1.png"
//             alt="Mobile development illustration"
//             className="max-w-full max-h-full object-contain"
//             loading="lazy"
//           />
//           <div className="absolute bottom-6 inset-x-10 bg-black/60 backdrop-blur-sm rounded-full py-1.5 flex items-center justify-center shadow-lg border border-white/10">
//             <span className="text-white tracking-[0.4rem] text-xs font-semibold uppercase auth-font-title">
//               KH<span className="text-[#e5383b]">DEMY</span>
//             </span>
//           </div>
//         </div>

//         <h2 className="text-white text-2xl font-bold mb-2 text-center auth-font-title">
//           Welcome <span className="text-[#e5383b]">KH</span>
//           <span className="text-[#e5383b]">demy</span>
//         </h2>
//         <p className="text-white/50 text-sm text-center mb-8">
//           Just a couple of clicks and we start
//         </p>
//       </div>

//       {/* ── RIGHT PANEL ── */}
//       <div className="bg-white flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 auth-panel-fade">
//         <div className="max-w-md w-full mx-auto">

//           <h1 className="text-center text-2xl font-extrabold text-blue-700 mb-1 tracking-tight auth-font-title">
//             LOGIN
//           </h1>
//           <p className="text-center text-sm text-gray-400 mb-8">
//             Welcome back! Let's get you signed in
//           </p>

//           <form onSubmit={handleSubmit} noValidate className="space-y-4">

//             {/* Email */}
//             <div>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93afd4]">
//                   <MailIcon />
//                 </span>
//                 <input
//                   className={inputCls(errors.email)}
//                   id="email" name="email" type="email"
//                   placeholder="Email"
//                   value={form.email} onChange={handleChange}
//                   autoComplete="email"
//                 />
//               </div>
//               {errors.email && <p className="mt-1 text-xs text-red-500 pl-1">{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <div className="relative flex items-center">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93afd4]">
//                   <LockIcon />
//                 </span>
//                 <input
//                   className={`${inputCls(errors.password)} pr-11`}
//                   id="password" name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={form.password} onChange={handleChange}
//                   autoComplete="current-password"
//                 />
//                 <button type="button"
//                   onClick={() => setShowPassword((v) => !v)}
//                   className="absolute right-3.5 text-[#93afd4] hover:text-blue-600 transition-colors duration-200"
//                   aria-label={showPassword ? "Hide password" : "Show password"}>
//                   {showPassword ? <EyeOff /> : <EyeOpen />}
//                 </button>
//               </div>
//               {errors.password && <p className="mt-1 text-xs text-red-500 pl-1">{errors.password}</p>}
//             </div>

//             {/* Remember me + Forgot */}
//             <div className="flex items-center justify-between pt-1">
//               <label className="flex items-center gap-2 cursor-pointer select-none">
//                 <input
//                   type="checkbox"
//                   checked={remember}
//                   onChange={(e) => setRemember(e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
//                 />
//                 <span className="text-sm text-gray-500">Remember Me</span>
//               </label>
//               <button
//                 type="button"
//                 onClick={() => onForgotPassword?.()}
//                 className="text-sm text-blue-600 font-semibold hover:underline bg-none border-none cursor-pointer p-0"
//               >
//                 Forgot Password ?
//               </button>
//             </div>

//             {/* API error */}
//             {apiError && <p className="text-red-500 text-sm pl-1">{apiError}</p>}

//             {/* Success message */}
//             {success && (
//               <p className="text-green-600 text-sm pl-1">Login successful! Redirecting...</p>
//             )}

//             {/* Submit */}
//             <button type="submit"
//               disabled={isLoading || success}
//               className={[
//                 "w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white",
//                 "transition-all duration-200 border-none cursor-pointer mt-2",
//                 "disabled:opacity-75 disabled:cursor-not-allowed",
//                 "hover:-translate-y-px active:translate-y-0",
//                 success
//                   ? "bg-green-600 shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
//                   : "bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-800",
//               ].join(" ")}
//             >
//               {isLoading ? "Signing in..." : success ? "✓ Signed In!" : "Login Now"}
//             </button>

//           </form>

//           {/* Social login */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-400 mb-4">
//               Other <span className="font-bold text-blue-700">Login</span> with
//             </p>
//             <div className="flex items-center justify-center gap-5">
//               <button className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100
//                                  flex items-center justify-center
//                                  hover:bg-blue-50 hover:border-blue-100
//                                  transition-all duration-200 hover:scale-105 active:scale-95">
//                 <FacebookIcon />
//               </button>
//               <button className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100
//                                  flex items-center justify-center
//                                  hover:bg-red-50 hover:border-red-100
//                                  transition-all duration-200 hover:scale-105 active:scale-95">
//                 <GoogleIcon />
//               </button>
//             </div>
//           </div>

//           {/* Sign up link */}
//           <p className="mt-8 text-center text-sm text-gray-400">
//             Don't have an account?{" "}
//             <button type="button"
//               onClick={() => onGoRegister?.()}
//               className="text-blue-700 font-bold underline underline-offset-2 hover:text-blue-900 transition-colors bg-none border-none cursor-pointer p-0">
//               Sign up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { setCredentials, setUser } from "../../features/auth/authSlice";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const toFieldErrors = (issues) => {
  const out = {};
  issues.forEach((issue) => {
    const key = issue.path?.[0];
    if (key && !out[key]) out[key] = issue.message;
  });
  return out;
};

export default function LoginComponent({ onGoRegister, onForgotPassword }) {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [apiError, setApiError]         = useState("");
  const [success, setSuccess]           = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError)     setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    try {
      // 1. Login → get token
      const res = await login({
        identifier: form.email,
        password:   form.password,
      }).unwrap();

      dispatch(setCredentials(res));

      // 2. Fetch user profile with the new token
      const meRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        { headers: { Authorization: `Bearer ${res.access_token}` } }
      );
      if (meRes.ok) {
        const meData = await meRes.json();
        dispatch(setUser(meData));
      }

      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setApiError(err?.data?.message || err?.data?.detail || "Invalid credentials");
    }
  };

  const inputCls = (hasError) => [
    "w-full bg-[#dbeafe] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1a2a50]",
    "outline-none transition-all duration-200 border-2",
    "placeholder:text-[#93afd4]",
    "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
    hasError ? "border-red-400 bg-red-50" : "border-transparent",
  ].join(" ");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] bg-gray-900 auth-font-body">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col items-center justify-center relative bg-[#1a2a50] overflow-hidden px-10">
        <div className="absolute w-[450px] h-[450px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-150 rounded-6xl overflow-hidden auth-float flex items-center justify-center mb-8"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <img
            src="https://cdn.prod.website-files.com/6443d6d96a788f6942166567/647011e6041bb767ea7934ed_mobiledevelopment-1.png"
            alt="Mobile development illustration"
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
          <div className="absolute bottom-6 inset-x-10 bg-black/60 backdrop-blur-sm rounded-full py-1.5 flex items-center justify-center shadow-lg border border-white/10">
            <span className="text-white tracking-[0.4rem] text-xs font-semibold uppercase auth-font-title">
              KH<span className="text-[#e5383b]">DEMY</span>
            </span>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2 text-center auth-font-title">
          Welcome <span className="text-[#e5383b]">KH</span>
          <span className="text-[#e5383b]">demy</span>
        </h2>
        <p className="text-white/50 text-sm text-center mb-8">
          Just a couple of clicks and we start
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="bg-white flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 auth-panel-fade">
        <div className="max-w-md w-full mx-auto">

          <h1 className="text-center text-2xl font-extrabold text-blue-700 mb-1 tracking-tight auth-font-title">
            LOGIN
          </h1>
          <p className="text-center text-sm text-gray-400 mb-8">
            Welcome back! Let's get you signed in
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93afd4]">
                  <MailIcon />
                </span>
                <input
                  className={inputCls(errors.email)}
                  id="email" name="email" type="email"
                  placeholder="Email"
                  value={form.email} onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93afd4]">
                  <LockIcon />
                </span>
                <input
                  className={`${inputCls(errors.password)} pr-11`}
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-[#93afd4] hover:text-blue-600 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 pl-1">{errors.password}</p>}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-500">Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => onForgotPassword?.()}
                className="text-sm text-blue-600 font-semibold hover:underline bg-none border-none cursor-pointer p-0"
              >
                Forgot Password ?
              </button>
            </div>

            {/* API error */}
            {apiError && <p className="text-red-500 text-sm pl-1">{apiError}</p>}

            {/* Success message */}
            {success && (
              <p className="text-green-600 text-sm pl-1">Login successful! Redirecting...</p>
            )}

            {/* Submit */}
            <button type="submit"
              disabled={isLoading || success}
              className={[
                "w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white",
                "transition-all duration-200 border-none cursor-pointer mt-2",
                "disabled:opacity-75 disabled:cursor-not-allowed",
                "hover:-translate-y-px active:translate-y-0",
                success
                  ? "bg-green-600 shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
                  : "bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-800",
              ].join(" ")}
            >
              {isLoading ? "Signing in..." : success ? "✓ Signed In!" : "Login Now"}
            </button>

          </form>

          {/* Social login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-4">
              Other <span className="font-bold text-blue-700">Login</span> with
            </p>
            <div className="flex items-center justify-center gap-5">
              <button className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100
                                 flex items-center justify-center
                                 hover:bg-blue-50 hover:border-blue-100
                                 transition-all duration-200 hover:scale-105 active:scale-95">
                <FacebookIcon />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100
                                 flex items-center justify-center
                                 hover:bg-red-50 hover:border-red-100
                                 transition-all duration-200 hover:scale-105 active:scale-95">
                <GoogleIcon />
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button type="button"
              onClick={() => onGoRegister?.()}
              className="text-blue-700 font-bold underline underline-offset-2 hover:text-blue-900 transition-colors bg-none border-none cursor-pointer p-0">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}