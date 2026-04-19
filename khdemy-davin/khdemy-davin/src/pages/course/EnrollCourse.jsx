import { useEffect, useState } from "react";
import { z } from "https://esm.sh/zod@3.22.4";
import QRCard from "./QR";

// ── Zod schema ──────────────────────────────────────────────────────────────
const enrollmentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .regex(/^[+\d\s\-().]+$/, "Invalid phone number format"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select a gender"),
  course: z.string().min(1, "Please select a course"),
  address: z.string().min(5, "Please enter your full home address"),
});

const COURSES = [
  { id: 0, title: "Web Development" },
  { id: 1, title: "Mobile Development" },
  { id: 2, title: "Data Science" },
  { id: 3, title: "UI/UX Design" },
  { id: 4, title: "Cybersecurity" },
];

const buildQrLink = (form, selectedCourse) => {
  const params = new URLSearchParams({
    courseId: String(selectedCourse?.id ?? 0),
    email: form.email,
    fullName: form.fullName,
  });
  return `https://khdemy.com/enroll/confirm?${params.toString()}`;
};

// ── Reusable field components ────────────────────────────────────────────────
function FieldWrapper({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

function InputField({ label, error, ...props }) {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        {...props}
        className={`
          rounded-xl px-4 py-3.5 text-sm outline-none transition-all
          bg-slate-100 dark:bg-slate-700/60
          text-slate-800 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          border border-transparent dark:border-slate-600/50
          ${error
            ? "ring-2 ring-red-400"
            : "focus:ring-2 focus:ring-blue-600/40 dark:focus:ring-blue-400/40"
          }
        `}
      />
    </FieldWrapper>
  );
}

function SelectField({ label, error, options, placeholder, ...props }) {
  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative">
        <select
          {...props}
          className={`
            w-full appearance-none rounded-xl px-4 py-3.5 text-sm outline-none transition-all cursor-pointer pr-10
            bg-slate-100 dark:bg-slate-700/60
            border border-transparent dark:border-slate-600/50
            ${props.value === ""
              ? "text-slate-400 dark:text-slate-500"
              : "text-slate-800 dark:text-slate-100"
            }
            ${error
              ? "ring-2 ring-red-400"
              : "focus:ring-2 focus:ring-blue-600/40 dark:focus:ring-blue-400/40"
            }
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </FieldWrapper>
  );
}

// ── QR Confirmation Modal ────────────────────────────────────────────────────
function PayloadModal({ qrLink, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 relative flex flex-col items-center gap-6 text-center
        bg-white dark:bg-slate-800
        border border-slate-100 dark:border-slate-700">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Step label */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-900/60 dark:text-blue-400/80">
            Step 2
          </p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Scan to Confirm</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We saved your enrollment details. Scan the QR code to review and finalize your spot in the course.
          </p>
        </div>

        <QRCard
          qrValue={qrLink}
          title="You're almost in"
          description="Open this link to finalize your enrollment."
          helperText="Use your camera or the KHdemy app to scan."
        />

        <button
          type="button"
          className="text-sm font-semibold text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
          onClick={onClose}
        >
          Back to form
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function EnrollCourse() {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    dob: "", gender: "", course: "", address: "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrLink, setQrLink] = useState("");
  const [dark, setDark] = useState(false);

  // Auto-detect system dark mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = enrollmentSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    const selectedCourse = COURSES.find((c) => String(c.id) === form.course);
    setQrLink(buildQrLink(form, selectedCourse));
    setShowConfirmation(true);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen transition-colors duration-300
        bg-white dark:bg-slate-900
        px-6 py-10 sm:px-10 sm:py-12">

        <div className="max-w-5xl mx-auto space-y-8">

          <header className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              Student Enrollment
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Complete the form below to begin your journey with KHdemy.
            </p>
          </header>

          {/* ── Form section ── */}
          <section className="space-y-6">

            {/* Section title */}
            <div className="flex items-center gap-2.5 font-bold text-xl
              text-blue-900 dark:text-blue-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Personal Information
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                <InputField label="Full Name" name="fullName" type="text"
                  placeholder="John Doe" value={form.fullName}
                  onChange={handleChange} error={errors.fullName} />

                <InputField label="Email Address" name="email" type="email"
                  placeholder="john@example.com" value={form.email}
                  onChange={handleChange} error={errors.email} />

                <InputField label="Phone Number" name="phone" type="tel"
                  placeholder="+1 (555) 000-0000" value={form.phone}
                  onChange={handleChange} error={errors.phone} />

                <InputField label="Date of Birth" name="dob" type="date"
                  value={form.dob} onChange={handleChange} error={errors.dob} />

                <SelectField label="Gender" name="gender" value={form.gender}
                  onChange={handleChange} error={errors.gender}
                  placeholder="Select Gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                    { value: "prefer_not", label: "Prefer not to say" },
                  ]}
                />

                <SelectField label="Interested Course" name="course" value={form.course}
                  onChange={handleChange} error={errors.course}
                  placeholder="Select a Course"
                  options={COURSES.map((c) => ({ value: String(c.id), label: c.title }))}
                />

                {/* Address — full width */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Full Home Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Education St, Knowledge City"
                    rows={4}
                    className={`
                      rounded-xl px-4 py-3.5 text-sm outline-none resize-none transition-all
                      bg-slate-100 dark:bg-slate-700/60
                      text-slate-800 dark:text-slate-100
                      placeholder-slate-400 dark:placeholder-slate-500
                      border border-transparent dark:border-slate-600/50
                      ${errors.address
                        ? "ring-2 ring-red-400"
                        : "focus:ring-2 focus:ring-blue-600/40 dark:focus:ring-blue-400/40"
                      }
                    `}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{errors.address}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="text-white font-bold px-8 py-4 rounded-full flex items-center gap-3 transition-all active:scale-95
                    bg-blue-900 hover:bg-blue-800
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    shadow-lg shadow-blue-900/20 dark:shadow-blue-600/20"
                >
                  Enroll Now
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Modal */}
      {showConfirmation && (
        <PayloadModal
          qrLink={qrLink}
          onClose={() => { setShowConfirmation(false); setQrLink(""); }}
        />
      )}
    </div>
  );
}
