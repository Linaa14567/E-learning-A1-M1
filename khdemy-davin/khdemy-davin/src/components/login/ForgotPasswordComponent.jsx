import { useState } from "react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
});

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
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

export default function ForgotPasswordComponent({ onBack, onGoLogin }) {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(form);
    if (!result.success) {
      setErrors(toFieldErrors(result.error.issues));
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  const inputCls = (hasError) => [
    "w-full bg-[#dbeafe] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1a2a50]",
    "outline-none transition-all duration-200 border-2",
    "placeholder:text-[#93afd4]",
    "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
    hasError ? "border-red-400 bg-red-50" : "border-transparent",
  ].join(" ");

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1fr] bg-gray-900 auth-font-body">
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
            Reset <span className="text-[#e5383b]">Password</span>
          </h2>
          <p className="text-white/50 text-sm text-center mb-8">
            We'll send a reset link to your email
          </p>
        </div>

        <div className="bg-white flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 auth-panel-fade">
          <button onClick={() => onBack?.()}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1a2a50] hover:bg-gray-100 transition-all duration-200 mb-10 self-start">
            <ArrowLeft />
          </button>

          <div className="max-w-md w-full mx-auto">
            <h1 className="text-center text-2xl font-extrabold text-blue-700 mb-1 tracking-tight auth-font-title">
              FORGOT PASSWORD
            </h1>
            <p className="text-center text-sm text-gray-400 mb-8">
              Enter your account email to receive reset instructions
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93afd4]">
                    <MailIcon />
                  </span>
                  <input
                    className={inputCls(errors.email)}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500 pl-1">{errors.email}</p>}
              </div>

              <button type="submit"
                disabled={status === "loading" || status === "success"}
                className={[
                  "w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white",
                  "transition-all duration-200 border-none cursor-pointer mt-2",
                  "disabled:opacity-75 disabled:cursor-not-allowed",
                  "hover:-translate-y-px active:translate-y-0",
                  status === "success"
                    ? "bg-green-600 shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
                    : "bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-800",
                ].join(" ")}
              >
                {status === "idle" && "Send Reset Link"}
                {status === "loading" && "Sending..."}
                {status === "success" && "✓ Link Sent"}
              </button>
            </form>

            {status === "success" && (
              <p className="mt-4 text-center text-sm text-gray-500">
                If this email exists, a reset link has been sent.
              </p>
            )}

            <p className="mt-8 text-center text-sm text-gray-400">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => onGoLogin?.()}
                className="text-blue-700 font-bold underline underline-offset-2 hover:text-blue-900 transition-colors bg-none border-none cursor-pointer p-0"
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}