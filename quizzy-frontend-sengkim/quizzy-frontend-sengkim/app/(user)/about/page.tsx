"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Award, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Users, title: "Public Speaking" },
  { icon: Award, title: "Career-Oriented" },
  { icon: BookOpen, title: "Creative Thinking" },
];

const teachers = [
  { name: "Mr. Kit Dara", src: "/Kit Dara.jpg" },
  { name: "Mrs. Mom Reksmey", src: "/Reaksmey.png" },
  { name: "Mr. Chan Chhaya", src: "/Chan Chhaya.jpg" },
];

const team = [
  { name: "Taing Sengkim", role: "Group Member", src: "/sengkim.png" },
  { name: "Soeurt Bomnorng", role: "Group Member", src: "/bomnorng.jpg" },
  { name: "Lut Lina", role: "Group Member", src: "/Lina.PNG" },
  { name: "Chit Chimy", role: "Group Member", src: "/Chimy.jpg" },
];

const socialLinks = [
  { label: "f", bg: "bg-blue-700" },
  { label: "📷", bg: "bg-pink-600" },
  { label: "t", bg: "bg-sky-500" },
  { label: "▶", bg: "bg-red-600" },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 15 }
  },
};

// ─── Reusable: Avatar with animation ─────────────────────────────────────────
function Avatar({ src, alt, size = 140 }: { src: string; alt: string; size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, rotate: 2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative rounded-full overflow-hidden border-4 border-orange-300 bg-orange-50 mx-auto shadow-md"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </motion.div>
  );
}

// ─── Reusable: Social Buttons with animation ─────────────────────────────────
function SocialButtons() {
  return (
    <motion.div 
      className="flex gap-3 mt-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {socialLinks.map((s, i) => (
        <motion.a
          key={i}
          href="#"
          whileHover={{ scale: 1.2, rotate: 8 }}
          whileTap={{ scale: 0.9 }}
          className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center text-white text-sm font-bold transition-all`}
        >
          {s.label}
        </motion.a>
      ))}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟢</span>
            <span className="font-extrabold text-orange-500 text-xl tracking-wider">QUIZZY</span>
          </div>

          <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <li><Link href="#" className="hover:text-orange-500 transition">Category</Link></li>
            <li><Link href="#" className="hover:text-orange-500 transition">Question</Link></li>
            <li><Link href="#" className="text-orange-500 font-semibold">About</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            <span className="text-xl">☀️</span>
            <Link
              href="#"
              className="hidden sm:block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all active:scale-95"
            >
              Sign In
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t px-6 py-6 space-y-4"
            >
              {["Category", "Question", "About"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-orange-500 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link
                href="#"
                className="block w-full text-center bg-orange-500 text-white font-semibold py-3 rounded-xl mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-12 pb-10 bg-gradient-to-br from-orange-50 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            className="order-2 lg:order-1 space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Up Your Skills<br />
              To Advance With<br />
              <span className="text-orange-500">Your Quizzy</span>
            </h1>

            <p className="text-gray-600 text-lg max-w-md">
              Learn UI-UX Design skills with weekend UX. The latest online learning system and material that help your knowledge growing.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-2xl text-sm transition"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-2xl text-sm transition"
              >
                Get Free Trial
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((f, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  <f.icon size={18} className="text-orange-500" />
                  {f.title}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual with Floating Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="order-1 lg:order-2 relative flex justify-center items-center min-h-[380px]"
          >
            <div className="relative w-72 sm:w-80 lg:w-96 aspect-square">
              {/* Animated Rings */}
              {[240, 290, 350].map((size, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.18 - i * 0.03 }}
                  transition={{ duration: 1.2, delay: i * 0.2 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400 pointer-events-none"
                  style={{ width: size, height: size }}
                />
              ))}

              {/* Main Student Circle */}
              <div className="relative w-full h-full rounded-full bg-orange-500 overflow-hidden shadow-2xl ring-8 ring-orange-100">
                <Image 
                  src="/Student.png" 
                  alt="Happy Student" 
                  fill 
                  className="object-cover" 
                  priority 
                />
              </div>

              {/* Floating Stat Cards */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-6 left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-20"
              >
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">▶</div>
                <div>
                  <p className="font-bold text-xl leading-none">2K+</p>
                  <p className="text-xs text-gray-500">Video Courses</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-12 -right-2 bg-white rounded-2xl shadow-xl p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📚</div>
                  <div>
                    <p className="font-bold text-xl leading-none">5K+</p>
                    <p className="text-xs text-gray-500">Online Courses</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-4 right-6 bg-white rounded-2xl shadow-xl p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">≡</div>
                  <div>
                    <p className="font-bold text-xl leading-none">250+</p>
                    <p className="text-xs text-gray-500">Tutors</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image src="/team.png" alt="Students" fill className="object-cover" />
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Our quiz platform was created to provide a stable, secure, and easy-to-use digital environment for users who want to showcase content, create masterpieces, and connect with their communities through quizzy.
          </motion.p>
        </div>
      </section>

      {/* ABOUT QUIZZY BANNER */}
      <section className="bg-orange-500 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6"
          >
            About Quizzy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed opacity-95"
          >
            At Quizzy, we believe that every student has the ability to create their own future. This platform is designed to nurture, inspire, and motivate you to become skilled and creative individuals in the digital age. We provide students with expert lessons, a collaborative environment, and learning opportunities that will help them succeed in their careers and real lives.
          </motion.p>
        </div>
      </section>

      {/* MEET OUR BEST TEACHER */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Best Teacher</h2>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {teachers.map((t, i) => (
              <motion.div key={i} variants={cardVariant} className="flex flex-col items-center text-center">
                <Avatar src={t.src} alt={t.name} size={140} />
                <h3 className="mt-5 font-semibold text-gray-800">{t.name}</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[180px]">If you want the best, you&apos;ve gotta put up with an oven.</p>
                <SocialButtons />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MEET OUR TEAM */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="hidden sm:block absolute right-[-120px] top-20 w-96 h-96 rounded-full border border-yellow-300 opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-12"
          >
            {team.map((member, i) => (
              <motion.div key={i} variants={cardVariant} className="flex flex-col items-center text-center">
                <Avatar src={member.src} alt={member.name} size={130} />
                <h3 className="mt-5 font-semibold text-gray-800">{member.name}</h3>
                <p className="text-xs text-gray-400">{member.role}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[180px]">If you want the best, you&apos;ve gotta put up with an oven.</p>
                <SocialButtons />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOOTER (kept clean with small hover improvements) */}
      <footer className="bg-orange-500 text-white pt-12 pb-8">
        {/* Your existing footer code remains the same */}
        {/* ... (copy your original footer here) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Grid, Sponsor, Social, Bottom bar - unchanged */}
          {/* Paste your original footer content here */}
        </div>
      </footer>
    </div>
  );
}