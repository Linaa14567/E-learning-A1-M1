import { useState, useEffect, useRef } from "react"
import PopularCourses from "./course/Courses"
import TrendingBooks from "./book/TrendingBooks"
import LatestBlog from "./blog/LatesBlog"
import LatestCourses from "./course/LatestCourse"

function useDark() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark"))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return dark
}

// ══════════════════════════════════════════════════════
// ANIMATION STYLES
// ══════════════════════════════════════════════════════
const globalStyles = `
  @keyframes floatY {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes floatX {
    0%,100% { transform: translateX(0px); }
    50%     { transform: translateX(8px); }
  }
  @keyframes pulse-dot {
    0%,100% { transform: scale(1); opacity: 1; }
    50%     { transform: scale(1.7); opacity: 0.5; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.93) translateY(14px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInFromRight {
    from { opacity:0; transform:translateX(80px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideInFromLeft {
    from { opacity:0; transform:translateX(-80px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .h-anim-0 { animation: fadeUp    0.7s 0.00s cubic-bezier(0.22,1,0.36,1) both; }
  .h-anim-1 { animation: fadeUp    0.7s 0.10s cubic-bezier(0.22,1,0.36,1) both; }
  .h-anim-2 { animation: fadeUp    0.7s 0.20s cubic-bezier(0.22,1,0.36,1) both; }
  .h-anim-3 { animation: fadeUp    0.7s 0.30s cubic-bezier(0.22,1,0.36,1) both; }
  .h-anim-4 { animation: fadeScale 0.8s 0.42s cubic-bezier(0.22,1,0.36,1) both; }

  .slide-right { animation: slideInFromRight 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both; }
  .slide-left  { animation: slideInFromLeft  0.4s cubic-bezier(0.25,0.46,0.45,0.94) both; }

  .sr           { opacity: 0; }
  .sr.in-up     { animation: fadeUp    0.65s cubic-bezier(0.22,1,0.36,1) both; }
  .sr.in-scale  { animation: fadeScale 0.60s cubic-bezier(0.22,1,0.36,1) both; }
  .sr.in-left   { animation: fadeLeft  0.60s cubic-bezier(0.22,1,0.36,1) both; }
  .sr.in-right  { animation: fadeRight 0.60s cubic-bezier(0.22,1,0.36,1) both; }
  .sr.in-fade   { animation: fadeIn    0.70s cubic-bezier(0.22,1,0.36,1) both; }

  .card-lift { transition: transform 0.28s cubic-bezier(.34,1.2,.64,1), box-shadow 0.28s ease; }
  .card-lift:hover { transform: translateY(-7px); }

  .img-zoom { overflow: hidden; }
  .img-zoom img { transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
  .img-zoom:hover img { transform: scale(1.06); }

  .btn-press { transition: transform 0.15s ease, opacity 0.15s ease; }
  .btn-press:hover  { opacity: 0.88; transform: translateY(-1px); }
  .btn-press:active { transform: scale(0.97); }

  .why-item { transition: transform 0.28s cubic-bezier(.34,1.2,.64,1); }
  .why-item:hover { transform: translateY(-6px); }

  .role-icon { transition: transform 0.3s cubic-bezier(.34,1.5,.64,1); }
  .role-card:hover .role-icon { transform: scale(1.18) rotate(-4deg); }
`

function useReveal(dir = "up", delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => el.classList.add(`in-${dir}`), delay * 1000)
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [dir, delay])
  return ref
}

function D({ w, h, bg, style, type = "float", delay = 0 }) {
  const anim = {
    float:  `floatY ${3.5+delay}s ${delay*0.4}s ease-in-out infinite`,
    floatX: `floatX ${4+delay}s ${delay*0.4}s ease-in-out infinite`,
    pulse:  `pulse-dot ${1.8+delay*0.3}s ${delay*0.4}s ease-in-out infinite`,
    spin:   `spin-slow ${9+delay*2}s ${delay*0.4}s linear infinite`,
  }
  return <span style={{ position:"absolute", width:w, height:h, borderRadius:type==="spin"?"3px":"50%", background:bg, animation:anim[type]||anim.float, pointerEvents:"none", ...style }} />
}

function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="#F59E0B"><path d="M6.5 0l1.545 4.753H13L9.228 7.697l1.545 4.753L6.5 9.506l-4.273 2.944L3.772 7.697 0 4.753h4.955L6.5 0z"/></svg>
}

// ══════════════════════════════════════════════════════
// CARDS — use Tailwind dark: variant (works with .dark on <html>)
// ══════════════════════════════════════════════════════
function BookCard({ image, category, title, description, author, delay=0 }) {
  const [bk, setBk] = useState(false)
  const ref = useReveal("scale", delay)
  return (
    <div ref={ref} className="sr card-lift flex flex-row gap-3 rounded-2xl p-3 cursor-pointer w-full transition-colors duration-300
      bg-white dark:bg-[#1e2235]
      border border-gray-100 dark:border-[#2a2f45]
      shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="img-zoom flex-shrink-0 w-28 sm:w-36 h-[160px] sm:h-[200px] rounded-xl overflow-hidden shadow-md">
        <img src={image} alt={title} className="w-full h-full object-cover"/>
      </div>
      <div className="flex flex-col flex-1 gap-1.5 relative overflow-hidden py-1">
        <span className="inline-block w-fit text-xs font-bold rounded-full px-3 py-1 bg-purple-100 dark:bg-[#2e1f5e] text-purple-700 dark:text-purple-300">{category}</span>
        <h2 className="font-extrabold text-sm sm:text-[15px] leading-snug m-0 line-clamp-2 text-gray-900 dark:text-slate-100">{title}</h2>
        {author && <p className="text-[11px] m-0 text-gray-400 dark:text-slate-500">by {author}</p>}
        <p className="text-sm leading-relaxed m-0 line-clamp-3 text-gray-500 dark:text-slate-400">{description}</p>
        <button onClick={e=>{e.preventDefault();e.stopPropagation();setBk(b=>!b)}} className="absolute bottom-0 right-0 bg-transparent border-none cursor-pointer p-1">
          <svg className={`w-[18px] h-[18px] transition-all duration-200 ${bk?"fill-[#1e1b4b] stroke-[#1e1b4b]":"fill-none stroke-gray-400"}`} strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function CourseCard({ course, delay=0 }) {
  const [bk, setBk] = useState(false)
  const ref = useReveal("scale", delay)
  return (
    <div ref={ref} className="sr card-lift rounded-[20px] overflow-hidden cursor-pointer flex flex-col transition-colors duration-300
      bg-white dark:bg-[#1e2235]
      border border-[#f0f0f0] dark:border-[#2a2f45]
      shadow-[0_2px_16px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
      <div className="img-zoom relative w-full h-[160px] sm:h-[190px] overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-[#2a2f45]">
        <img src={course.img} alt={course.title} className="w-full h-full object-cover block" onError={e=>{e.target.style.display="none"}}/>
        <span className="absolute top-3 left-3 bg-[#2F327D] text-white text-xs font-bold rounded-full px-3 py-1">{course.tag}</span>
      </div>
      <div className="p-3 sm:p-[18px] flex flex-col flex-1">
        <h3 className="font-bold text-sm sm:text-base text-center mb-2 leading-snug text-gray-900 dark:text-slate-100">{course.title}</h3>
        <p className="text-sm text-center leading-relaxed mb-4 flex-1 line-clamp-2 text-gray-400 dark:text-slate-500">{course.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-black text-green-500 text-sm">${course.price}</span>
          <div className="flex items-center gap-1.5">
            <StarIcon/>
            <span className="font-bold text-xs text-gray-400 dark:text-slate-500">{course.rating}</span>
            <button onClick={e=>{e.stopPropagation();setBk(b=>!b)}} className="bg-transparent border-none cursor-pointer p-0 ml-1">
              <svg width="15" height="19" viewBox="0 0 16 20" className={`block transition-all duration-200 ${bk?"fill-[#2F327D] stroke-[#2F327D]":"fill-none stroke-gray-400"}`} strokeWidth="1.5" strokeLinejoin="round"><path d="M1 1h14v18l-7-4-7 4V1z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogCard({ title, cardTitle, desc, author, authorImg, img, delay=0 }) {
  const [bk, setBk] = useState(false)
  const ref = useReveal("scale", delay)
  return (
    <div ref={ref} className="sr card-lift rounded-[20px] overflow-hidden cursor-pointer flex flex-col transition-colors duration-300
      bg-white dark:bg-[#1e2235]
      border border-[#f0f0f0] dark:border-[#2a2f45]
      shadow-[0_2px_16px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
      <div className="img-zoom relative w-full h-[160px] sm:h-[190px] overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-[#2a2f45]">
        <img src={img} alt={cardTitle} className="w-full h-full object-cover block" onError={e=>{e.target.style.display="none"}}/>
        <span className="absolute top-3 left-3 bg-[#2F327D] text-white text-xs font-bold rounded-full px-3 py-1">{title}</span>
      </div>
      <div className="p-3 sm:p-[18px] flex flex-col flex-1">
        <h3 className="font-bold text-sm sm:text-base text-center mb-2 leading-snug text-gray-900 dark:text-slate-100">{cardTitle}</h3>
        <p className="text-sm text-center leading-relaxed mb-4 flex-1 line-clamp-2 text-gray-400 dark:text-slate-500">{desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500">
              <img src={authorImg} alt={author} className="w-full h-full object-cover object-top block"
                onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:800">${author[0]}</div>`}}/>
            </div>
            <span className="font-bold text-xs text-gray-400 dark:text-slate-500">{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <StarIcon/>
            <span className="font-bold text-xs text-gray-400 dark:text-slate-500">4.8</span>
            <button onClick={e=>{e.preventDefault();e.stopPropagation();setBk(b=>!b)}} className="bg-transparent border-none cursor-pointer p-0 ml-1">
              <svg width="15" height="19" viewBox="0 0 16 20" className={`block transition-all duration-200 ${bk?"fill-[#2F327D] stroke-[#2F327D]":"fill-none stroke-gray-400"}`} strokeWidth="1.5" strokeLinejoin="round"><path d="M1 1h14v18l-7-4-7 4V1z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════
// const COURSES = [
//   { id:1, tag:"Programming", title:"Variables & Data",        desc:"Learn how programs store information.",   price:29, rating:4.6, img:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80" },
//   { id:2, tag:"Programming", title:"Control Flow Basics",     desc:"Use if-else and loops in programs.",      price:29, rating:4.8, img:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80" },
//   { id:3, tag:"Programming", title:"Functions for Beginners", desc:"Create reusable blocks of code easily.",  price:29, rating:4.7, img:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80" },
//   { id:4, tag:"Mindset",     title:"Programming Mindset",     desc:"Think like a developer step by step.",    price:29, rating:4.5, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
//   { id:5, tag:"Beginner",    title:"Hello World Coding",      desc:"Start writing your first program today.", price:29, rating:4.6, img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80" },
//   { id:6, tag:"Programming", title:"Loops Made Easy",         desc:"Repeat tasks using simple loops.",        price:29, rating:4.7, img:"https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80" },
//   { id:7, tag:"Programming", title:"Lists & Arrays Intro",    desc:"Store multiple values in programs.",      price:29, rating:4.6, img:"https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80" },
//   { id:8, tag:"Beginner",    title:"Coding From Scratch",     desc:"Start programming with zero experience.", price:29, rating:4.9, img:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" },
// ]
const BOOKS = [
  { id:1, cat:"Programming",   title:"C/C++ Programming",        author:"Kernighan & Ritchie", desc:"The definitive guide to C programming language.",  img:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80" },
  { id:2, cat:"Best Practice", title:"Clean Code",               author:"Robert C. Martin",   desc:"A handbook of agile software craftsmanship.",       img:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
  { id:3, cat:"JavaScript",    title:"You Don't Know JS",        author:"Kyle Simpson",       desc:"Deep dive into the core mechanisms of JavaScript.", img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80" },
  { id:4, cat:"Design",        title:"Don't Make Me Think",      author:"Steve Krug",         desc:"A common sense approach to web usability.",         img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80" },
  { id:5, cat:"Career",        title:"The Pragmatic Programmer", author:"Hunt & Thomas",      desc:"From journeyman to master — timeless dev advice.",  img:"https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80" },
  { id:6, cat:"Data Science",  title:"Python for Data Analysis", author:"Wes McKinney",       desc:"Data wrangling with Pandas, NumPy and Jupyter.",    img:"https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80" },
]
const BLOGS = [
  { id:1, title:"UX/UI",        cardTitle:"Why Good Design Matters",                 desc:"Intuitive design equals better user experience",     author:"Sarika",   authorImg:"/sarika.jpg",   img:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80" },
  { id:2, title:"Programming",  cardTitle:"How to Think Like a Developer",           desc:"Problem solving mindset for beginners",              author:"Davin",    authorImg:"/davin.jpg",    img:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80" },
  { id:3, title:"Data Science", cardTitle:"Python vs R: Which Should You Learn?",    desc:"Compare the two most popular data languages",        author:"Seavleng", authorImg:"/heroleng.png", img:"https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80" },
  { id:4, title:"Web Dev",      cardTitle:"CSS Tips Every Frontend Dev Should Know", desc:"Write cleaner, faster styles",                       author:"Lina",     authorImg:"/herona.jpg",   img:"https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80" },
  { id:5, title:"Career",       cardTitle:"Getting Your First Tech Job in Cambodia", desc:"Practical steps to land your first developer role", author:"Sengchay", authorImg:"/herochay.jpg", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id:6, title:"AI & ML",      cardTitle:"Machine Learning Explained Simply",       desc:"No math degree needed",                              author:"Reaksa",   authorImg:"/Reaksa.png",   img:"https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&q=80" },
]
const TESTIMONIALS = [
  { name:"Lina",     review:"I learned web development and got my first developer job in just 6 months. The quality of instruction on KhDemy is outstanding.", avatar:"/herona.jpg"   },
  { name:"Sengchay", review:"As a graphic designer, I needed to learn new digital skills. KhDemy made it easy to study at my own pace without pressure.",      avatar:"/herochay.jpg" },
  { name:"Seavleng", review:"The instructors explain everything clearly in Khmer. This is exactly what Cambodia's tech community needed.",                     avatar:"/heroleng.png" },
  { name:"Davin",    review:"The courses are well structured and easy to follow along. I completed the full web dev track and landed a freelance client.",      avatar:"/davin.jpg"    },
  { name:"Sarika",   review:"I completed 3 courses and now I can build my own apps! The project-based approach really helped me apply what I learned.",         avatar:"/sarika.jpg"   },
  { name:"Saren",    review:"I love the interactive lessons and the supportive community. Every question I asked was answered within hours.",                   avatar:"/saren.png"    },
  { name:"Reaksa",   review:"Best learning platform in Cambodia. Highly recommended for anyone who wants to grow their tech career.",                           avatar:"/Reaksa.png"   },
]

// ══════════════════════════════════════════════════════
// TESTIMONIALS
// ══════════════════════════════════════════════════════
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState("right")
  const [animKey, setAnimKey] = useState(0)
  const titleRef = useReveal("up", 0)
  const total = TESTIMONIALS.length
  const goTo = (i, dir) => { setDirection(dir); setAnimKey(k=>k+1); setCurrent(i) }
  const prev = () => goTo(current===0?total-1:current-1,"left")
  const next = () => goTo(current===total-1?0:current+1,"right")
  useEffect(()=>{
    const t = setInterval(()=>{ setDirection("right"); setAnimKey(k=>k+1); setCurrent(c=>c===total-1?0:c+1) },3500)
    return ()=>clearInterval(t)
  },[total])
  const person = TESTIMONIALS[current]
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 transition-colors duration-300 bg-white dark:bg-[#0f1117]">
      <h2 ref={titleRef} className="sr text-center font-black mb-12 text-[clamp(1.4rem,4vw,2.6rem)] tracking-tight text-gray-900 dark:text-slate-100">
        What do students say about{" "}
        <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">Khdemy</span>?
      </h2>
      <div className="flex items-center gap-2 sm:gap-6 max-w-[860px] mx-auto">
        <button onClick={prev} className="btn-press flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#2F327D] border-none flex items-center justify-center cursor-pointer shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex-1 overflow-hidden">
          <div key={animKey} className={`flex flex-col sm:flex-row rounded-3xl overflow-hidden transition-colors duration-300
            ${direction==="right"?"slide-right":"slide-left"}
            border border-gray-100 dark:border-[#2a2f45]
            shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]`}>
            <div className="sm:flex-shrink-0 sm:w-[220px] flex flex-row sm:flex-col items-center justify-start sm:justify-center px-5 py-5 sm:py-10 gap-4 sm:border-r border-b sm:border-b-0 transition-colors duration-300
              bg-[#F8F9FB] dark:bg-[#1a1f2e] border-gray-100 dark:border-[#2a2f45]">
              <div className="img-zoom w-16 h-16 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 shadow-xl flex-shrink-0 border-gray-200 dark:border-[#2a2f45]">
                <img src={person.avatar} alt={person.name} className="w-full h-full object-cover object-top"
                  onError={e=>{e.target.style.display="none";e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:28px">👤</div>`}}/>
              </div>
              <div>
                <p className="font-extrabold text-base sm:text-lg m-0 text-gray-900 dark:text-slate-100">{person.name}</p>
                <p className="font-medium text-sm mt-0.5 m-0 text-gray-400 dark:text-slate-500">KhDemy Student</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_,s)=><svg key={s} width="14" height="14" viewBox="0 0 20 20" fill="#FFC107"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-6 sm:py-10 relative transition-colors duration-300 bg-white dark:bg-[#1e2235]">
              <span className="absolute top-2 sm:top-4 left-5 sm:left-8 text-[48px] sm:text-[72px] leading-none font-serif select-none text-gray-100 dark:text-[#2a2f45]">"</span>
              <p className="text-base sm:text-[18px] leading-loose italic relative z-10 m-0 text-gray-600 dark:text-slate-400">{person.review}</p>
              <span className="absolute bottom-1 sm:bottom-3 right-5 sm:right-8 text-[48px] sm:text-[72px] leading-none font-serif select-none text-gray-100 dark:text-[#2a2f45]">"</span>
            </div>
          </div>
        </div>
        <button onClick={next} className="btn-press flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#2F327D] border-none flex items-center justify-center cursor-pointer shadow-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_,i)=>(
          <button key={i} onClick={()=>goTo(i,i>current?"right":"left")}
            className={`h-2.5 rounded-full border-none p-0 cursor-pointer transition-all duration-300
              ${i===current ? "w-6 bg-[#2F327D] dark:bg-indigo-400" : "w-2.5 bg-gray-200 dark:bg-[#2a2f45]"}`}/>
        ))}
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════
export default function Home() {
  // Reads class="dark" on <html> — set by your Navbar toggle
  const dark = useDark()

  const heroDots = [
    { w:10,h:10,bg:"#EC4899",style:{top:"6%",left:"3%"},type:"pulse",delay:0 },
    { w:7, h:7, bg:"#F59E0B",style:{top:"12%",left:"6%"},type:"float",delay:0.5 },
    { w:12,h:12,bg:"#3B82F6",style:{top:"4%",left:"10%"},type:"float",delay:1 },
    { w:6, h:6, bg:"#7C3AED",style:{top:"18%",left:"2%"},type:"pulse",delay:0.3 },
    { w:9, h:9, bg:"#10B981",style:{top:"22%",left:"8%"},type:"floatX",delay:0.8 },
    { w:11,h:11,bg:"#F59E0B",style:{top:"5%",right:"4%"},type:"float",delay:0.2 },
    { w:7, h:7, bg:"#EC4899",style:{top:"10%",right:"9%"},type:"pulse",delay:1.1 },
    { w:13,h:13,bg:"#3B82F6",style:{top:"3%",right:"14%"},type:"float",delay:0.6 },
    { w:6, h:6, bg:"#10B981",style:{top:"20%",right:"3%"},type:"floatX",delay:0.9 },
    { w:8, h:8, bg:"#7C3AED",style:{top:"16%",right:"11%"},type:"pulse",delay:0.4 },
    { w:14,h:14,bg:"#EC4899",style:{top:"52%",left:"1.5%"},type:"float",delay:1.3 },
    { w:8, h:8, bg:"#3B82F6",style:{top:"44%",left:"4%"},type:"pulse",delay:0.7 },
    { w:6, h:6, bg:"#F59E0B",style:{top:"60%",left:"2.5%"},type:"floatX",delay:1.5 },
    { w:10,h:10,bg:"#7C3AED",style:{top:"48%",right:"2%"},type:"float",delay:0.3 },
    { w:7, h:7, bg:"#EC4899",style:{top:"58%",right:"5%"},type:"pulse",delay:1.2 },
    { w:12,h:12,bg:"#10B981",style:{top:"40%",right:"3%"},type:"floatX",delay:0.8 },
    { w:18,h:18,bg:"#F59E0B",style:{bottom:"8%",left:"14%"},type:"spin",delay:0 },
    { w:8, h:8, bg:"#3B82F6",style:{bottom:"14%",left:"10%"},type:"pulse",delay:0.6 },
    { w:16,h:16,bg:"#7C3AED",style:{bottom:"8%",right:"16%"},type:"spin",delay:0.5 },
    { w:9, h:9, bg:"#10B981",style:{bottom:"14%",right:"12%"},type:"float",delay:1.0 },
  ]
  const videoDots = [
    { w:10,h:10,bg:"#EC4899",s:{top:"2%",left:"5%"},type:"pulse" },
    { w:7, h:7, bg:"#3B82F6",s:{top:"1%",left:"18%"},type:"float" },
    { w:12,h:12,bg:"#F59E0B",s:{top:"3%",left:"32%"},type:"spin" },
    { w:10,h:10,bg:"#7C3AED",s:{top:"1%",right:"12%"},type:"pulse" },
    { w:9, h:9, bg:"#F59E0B",s:{top:"18%",left:"1%"},type:"floatX" },
    { w:11,h:11,bg:"#EC4899",s:{top:"50%",left:"0.5%"},type:"float" },
    { w:11,h:11,bg:"#F59E0B",s:{top:"28%",right:"2%"},type:"pulse" },
    { w:10,h:10,bg:"#7C3AED",s:{bottom:"2%",left:"8%"},type:"spin" },
    { w:9, h:9, bg:"#3B82F6",s:{bottom:"3%",right:"8%"},type:"float" },
  ]

  const rWhyTitle = useReveal("up",0)
  const rWhy      = [useReveal("up",0), useReveal("up",0.1), useReveal("up",0.2)]
  const rCoursesT = useReveal("up",0)
  const rBooksT   = useReveal("up",0)
  const rBlogsT   = useReveal("up",0)
  const rRolesT   = useReveal("up",0)
  const rRolesSub = useReveal("up",0.1)
  const rVImg1    = useReveal("left",0)
  const rVImg2    = useReveal("left",0.12)
  const rVText1   = useReveal("right",0.08)
  const rVText2   = useReveal("left",0.08)
  const rVImg3    = useReveal("right",0)
  const rVImg4    = useReveal("right",0.12)
  const rRoles    = [useReveal("scale",0),useReveal("scale",0.09),useReveal("scale",0.18),useReveal("scale",0.27)]

  const whyItems = [
    { src:"/Teacher.jpg", label:"Experienced teacher",  color:"text-amber-500", desc:"Learn from qualified professionals across Cambodia and beyond." },
    { src:"/davin2.png",  label:"Flexible Learning",    color:"text-pink-500",  desc:"Study at your own pace, anytime, anywhere on any device." },
    { src:"/QR.jpg",      label:"Easy Bakong Payments", color:"text-blue-500",  desc:"Pay securely with Cambodia's Bakong payment system." },
  ]
  const roleItems = [
    { icon:"🌐", role:"Public User", tagBg:"#3B82F6", desc:"Browse all available courses, read blog posts, and explore learning materials — no account needed.", perms:["Browse courses & books","Read blog articles","View instructor profiles","Register for an account"] },
    { icon:"🎓", role:"Student",     tagBg:"#10B981", desc:"Enroll in courses, watch video lessons, complete quizzes, track your progress, and earn your certificate.", perms:["Enroll & access courses","Watch HD video lessons","Take quizzes & assessments","Download certificate"] },
    { icon:"👩‍🏫",role:"Teacher",     tagBg:"#F59E0B", desc:"Create and publish courses, upload videos and materials, manage enrolled students and monitor progress.", perms:["Create & publish courses","Upload videos & PDFs","Manage students","View course analytics"] },
    { icon:"🛡️", role:"Admin",       tagBg:"#7C3AED", desc:"Oversee the entire platform — manage users, approve courses, monitor activity, and control settings.", perms:["Manage all users","Approve & remove courses","Access platform analytics","Control site settings"] },
  ]

  return (
    <main className="overflow-x-hidden min-h-screen transition-colors duration-300 bg-white dark:bg-[#0f1117]">
      <style>{globalStyles}</style>

      {/* ══ HERO ══ */}
      <section className="relative text-center px-4 sm:px-6 pt-2 sm:pt-4 pb-0 overflow-hidden transition-colors duration-300 bg-white dark:bg-[#0f1117]">
        {heroDots.map((d,i)=>(
          <D key={i} w={d.w} h={d.h} bg={d.bg}
             style={{...d.style, opacity: dark ? 0.5 : 1}}
             type={d.type} delay={d.delay}/>
        ))}
        <p className="h-anim-0 font-black text-pink-400 text-[clamp(1.8rem,4.5vw,3rem)] tracking-tight mb-1">KhDemy</p>
        <h1 className="h-anim-1 font-black text-[clamp(1.8rem,4.5vw,3rem)] leading-tight mb-3">
          <span className="text-amber-400">Online</span>
          <span className="text-blue-500 dark:text-indigo-400"> Anytime, Anywhere</span>
        </h1>
        <p className="h-anim-2 font-medium max-w-md mx-auto leading-relaxed text-base sm:text-lg mb-7 text-gray-500 dark:text-slate-400">
          Discover hundreds of courses taught by expert instructors. Start learning today and unlock your potential with Khdemy.
        </p>
        <div className="h-anim-3">
          <button className="btn-press bg-[#2F327D] text-white rounded-full font-extrabold px-10 py-3.5 text-base border-none cursor-pointer shadow-[0_8px_24px_rgba(47,50,125,0.4)]">
            Enroll now
          </button>
        </div>
        <div className="h-anim-4 flex justify-center items-end pt-6 sm:pt-8 flex-nowrap" style={{gap:"clamp(24px,5vw,80px)"}}>
          {[
            { src:"/herodin.jpg",  w:"clamp(80px,14vw,180px)", h:"clamp(110px,22vw,300px)", r:"70px", mt:0  },
            { src:"/heroleng.png", w:"clamp(68px,12vw,160px)", h:"clamp(95px,19vw,250px)",  r:"60px", mt:20 },
            { src:"/herona.jpg",   w:"clamp(68px,12vw,160px)", h:"clamp(95px,19vw,250px)",  r:"60px", mt:20 },
            { src:"/herochay.jpg", w:"clamp(80px,14vw,180px)", h:"clamp(110px,22vw,300px)", r:"70px", mt:0  },
          ].map((img,i)=>(
            <div key={i} className="img-zoom flex-shrink-0" style={{
              width:img.w, height:img.h, borderRadius:img.r, overflow:"hidden", marginTop:img.mt,
              boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.55)" : "0 16px 48px rgba(0,0,0,0.15)",
            }}>
              <img src={img.src} alt="" className="w-full h-full object-cover object-top" onError={e=>{e.target.parentNode.style.background="#e5e7eb"}}/>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY CHOOSE ══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 transition-colors duration-300 bg-[#FAFBFF] dark:bg-[#161a24]">
        <h2 ref={rWhyTitle} className="sr text-center font-black text-[clamp(1.3rem,3vw,2rem)] mb-12 text-[#1e1b4b] dark:text-indigo-300">
          Why should you choose KhDemy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto">
          {whyItems.map((item,i)=>(
            <div key={i} ref={rWhy[i]} className="sr why-item flex flex-col items-center text-center">
              <div className="img-zoom w-[170px] sm:w-[190px] h-[136px] sm:h-[152px] rounded-2xl overflow-hidden shadow-lg mb-5">
                <img src={item.src} alt={item.label} className="w-full h-full object-cover dark:brightness-[0.85]" onError={e=>{e.target.parentNode.style.background="#e5e7eb"}}/>
              </div>
              <p className={`font-black text-base sm:text-lg mb-2 ${item.color}`}>{item.label}</p>
              <p className="text-sm leading-relaxed m-0 text-gray-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ POPULAR COURSES ══ */}

      <LatestCourses/>

      {/* ══ TOP TRENDING BOOKS ══ */}

      <TrendingBooks/>

      {/* ══ LATEST BLOG POSTS ══ */}
      <LatestBlog/>

      {/* ══ VIDEO SECTIONS ══ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-300 bg-[#FAFBFF] dark:bg-[#161a24]">
        {videoDots.map((d,i)=><D key={i} w={d.w} h={d.h} bg={d.bg} style={{...d.s, opacity: dark?0.4:1}} type={d.type} delay={i*0.2}/>)}
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center mb-16 sm:mb-24">
            <div className="relative h-[220px] sm:h-[300px] mx-auto w-full max-w-[360px] lg:max-w-none">
              <div ref={rVImg1} className="sr absolute w-[200px] sm:w-[280px] h-[170px] sm:h-[240px] top-0 left-0 rounded-3xl overflow-hidden shadow-2xl img-zoom">
                <img src="/Lina1.jpg" alt="" className="w-full h-full object-cover dark:brightness-[0.8]" onError={e=>{e.target.parentNode.style.background="#e5e7eb"}}/>
              </div>
              <div ref={rVImg2} className="sr absolute w-[130px] sm:w-[190px] h-[130px] sm:h-[190px] bottom-0 left-[100px] sm:left-[160px] rounded-full overflow-hidden z-10 shadow-2xl img-zoom">
                <img src="/davin1.jpg" alt="" className="w-full h-full object-cover dark:brightness-[0.8]" onError={e=>{e.target.parentNode.style.background="#e5e7eb"}}/>
              </div>
            </div>
            <div ref={rVText1} className="sr text-center lg:text-left">
              <h2 className="font-black text-[clamp(1.4rem,3vw,2.2rem)] tracking-tight leading-tight mb-4 text-gray-900 dark:text-slate-100">Engaging Video Lessons</h2>
              <p className="leading-relaxed text-base sm:text-lg mb-7 text-gray-500 dark:text-slate-400">Connect with expert instructors through live sessions. Ask questions to support your learning journey.</p>
              <button className="btn-press bg-[#2F327D] text-white rounded-full font-bold px-9 py-3 text-sm border-none cursor-pointer">Enroll now</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
            <div ref={rVText2} className="sr text-center lg:text-left order-2 lg:order-1">
              <h2 className="font-black text-[clamp(1.4rem,3vw,2.2rem)] tracking-tight leading-tight mb-4 text-gray-900 dark:text-slate-100">Go Live and Learn</h2>
              <p className="leading-relaxed text-base sm:text-lg mb-7 text-gray-500 dark:text-slate-400">Access thousands of high-quality video lessons taught by top instructors.</p>
              <button className="btn-press bg-[#2F327D] text-white rounded-full font-bold px-9 py-3 text-sm border-none cursor-pointer">Enroll now</button>
            </div>
            <div className="relative h-[240px] sm:h-[360px] mx-auto w-full max-w-[360px] lg:max-w-none order-1 lg:order-2">
              <div ref={rVImg3} className="sr absolute w-[180px] sm:w-[270px] h-[160px] sm:h-[235px] bottom-4 left-20 rounded-[48px] overflow-hidden shadow-2xl img-zoom">
                <img src="/chay.jpg" alt="" className="w-full h-full object-cover dark:brightness-[0.8]" onError={e=>{e.target.parentNode.style.background="#e5e7eb"}}/>
              </div>
              <div ref={rVImg4} className="sr absolute w-[165px] sm:w-[250px] h-[155px] sm:h-[225px] top-2 right-0 rounded-[48px] overflow-hidden z-10 shadow-2xl img-zoom">
                <img src="/lengnew.png" alt="" className="w-full h-full object-cover dark:brightness-[0.8]" onError={e=>{e.target.src="/davin2.jpg"}}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ USER ROLES ══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 transition-colors duration-300 bg-[#FAFBFF] dark:bg-[#161a24]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 ref={rRolesT} className="sr font-black text-[clamp(1.4rem,3.5vw,2.3rem)] tracking-tight m-0 mb-4 text-gray-900 dark:text-slate-100">One Platform, Four Roles</h2>
            <p ref={rRolesSub} className="sr text-base sm:text-lg leading-relaxed m-0 max-w-2xl mx-auto text-gray-500 dark:text-slate-400">
              Whether you are exploring, learning, teaching, or managing — KhDemy has a dedicated experience built just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roleItems.map((item,i)=>(
              <div key={i} ref={rRoles[i]} className="sr role-card flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-default
                bg-white dark:bg-[#1e2235]
                border border-gray-100 dark:border-[#2a2f45]
                shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                <div className="role-icon w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{background:item.tagBg}}>{item.icon}</div>
                <span className="inline-block w-fit text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full text-white mb-3" style={{background:item.tagBg}}>{item.role}</span>
                <p className="text-sm leading-relaxed m-0 mb-5 flex-1 text-gray-500 dark:text-slate-400">{item.desc}</p>
                <div className="w-full h-px mb-5 bg-gray-100 dark:bg-[#2a2f45]"/>
                <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                  {item.perms.map((p,j)=>(
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{background:item.tagBg}}>
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="text-sm font-medium leading-tight text-gray-700 dark:text-slate-300">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <TestimonialsCarousel/>
    </main>
  )
}