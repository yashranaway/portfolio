"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Sun, Moon, Heart, Download, X } from "lucide-react"
import { useState, useEffect } from "react"


import ClickSpark from "@/components/ClickSpark"
import TimeCounter from "@/components/TimeCounter"
import CodeHover from "@/components/CodeHover"
import LinkPreview from "@/components/LinkPreview"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { RandomMatrix } from "@/components/ui/matrix"
import { getCalApi } from "@calcom/embed-react"
import dynamic from "next/dynamic"

const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((mod) => mod.ActivityCalendar),
  { ssr: false }
)
import githubAvatar from "@/assets/githubphotu.jpg"
import linkedinAvatar from "@/assets/linkedinphotu.jpg"
import batcatAvatar from "@/assets/batcat.jpg"


// Clean Skill Card Component with modern skill-icons
function SkillCard({ skill, specialized = false }) {
  return (
    <ClickSpark
      sparkColor={skill.color}
      sparkSize={8}
      sparkRadius={12}
      sparkCount={6}
      duration={400}
      easing="ease-out"
      extraScale={1.0}
    >
      <div
        className={`group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black overflow-hidden shadow-sm hover:shadow-md ${specialized ? 'md:col-span-1' : ''
          }`}
        role="button"
        tabIndex={0}
        aria-label={`${skill.name} technology`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
          }
        }}
      >
        {/* Skill Icon using skill-icons */}
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 group-hover:scale-110">
          <img
            src={skill.iconUrl}
            alt={`${skill.name} icon`}
            className="w-full h-full object-contain transition-all duration-300 group-hover:drop-shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Skill Name */}
        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white transition-colors duration-300 flex-1">
        {skill.name}
      </span>

        {/* Enhanced Glare effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200/30 dark:via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </div>
      </div>
    </ClickSpark>
  )
}

// Organized skills data
const skillsData = {
  languages: [
    { name: "C", iconUrl: "https://skillicons.dev/icons?i=c", color: "#A8B9CC" },
    { name: "C++", iconUrl: "https://skillicons.dev/icons?i=cpp", color: "#00599C" },
    { name: "Java", iconUrl: "https://skillicons.dev/icons?i=java", color: "#ED8B00" },
    { name: "Python", iconUrl: "https://skillicons.dev/icons?i=python", color: "#3776AB" },
    { name: "JavaScript", iconUrl: "https://skillicons.dev/icons?i=js", color: "#F7DF1E" },
    { name: "TypeScript", iconUrl: "https://skillicons.dev/icons?i=ts", color: "#3178C6" },
    { name: "Rust", iconUrl: "https://skillicons.dev/icons?i=rust", color: "#CE422B" },
    { name: "Go", iconUrl: "https://skillicons.dev/icons?i=go", color: "#00ADD8" },
    { name: "Ruby", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg", color: "#CC342D" },
  ],
  frontend: [
    { name: "HTML5", iconUrl: "https://skillicons.dev/icons?i=html", color: "#E34F26" },
    { name: "CSS3", iconUrl: "https://skillicons.dev/icons?i=css", color: "#1572B6" },
    { name: "Bootstrap", iconUrl: "https://skillicons.dev/icons?i=bootstrap", color: "#7952B3" },
    { name: "React", iconUrl: "https://skillicons.dev/icons?i=react", color: "#61DAFB" },
    { name: "Tailwind CSS", iconUrl: "https://skillicons.dev/icons?i=tailwind", color: "#38B2AC" },
    { name: "Next.js", iconUrl: "https://skillicons.dev/icons?i=nextjs", color: "#000000" },
  ],
  backend: [
    { name: "Node.js", iconUrl: "https://skillicons.dev/icons?i=nodejs", color: "#339933" },
    { name: "Express.js", iconUrl: "https://skillicons.dev/icons?i=express", color: "#68CC00" },
    { name: "MongoDB", iconUrl: "https://skillicons.dev/icons?i=mongodb", color: "#47A248" },
    { name: "MySQL", iconUrl: "https://skillicons.dev/icons?i=mysql", color: "#4479A1" },
    { name: "PostgreSQL", iconUrl: "https://skillicons.dev/icons?i=postgresql", color: "#336791" },
    { name: "Prisma", iconUrl: "https://skillicons.dev/icons?i=prisma", color: "#0C344B" },
  ],
  tools: [
    { name: "Linux", iconUrl: "https://skillicons.dev/icons?i=linux", color: "#FCC624" },
    { name: "Git", iconUrl: "https://skillicons.dev/icons?i=git", color: "#F05032" },
    { name: "VS Code", iconUrl: "https://skillicons.dev/icons?i=vscode", color: "#007ACC" },
    { name: "Docker", iconUrl: "https://skillicons.dev/icons?i=docker", color: "#2496ED" },
    { name: "Firebase", iconUrl: "https://skillicons.dev/icons?i=firebase", color: "#FFCA28" },
    { name: "AWS", iconUrl: "https://skillicons.dev/icons?i=aws", color: "#FF9900" },
    { name: "Vercel", iconUrl: "https://skillicons.dev/icons?i=vercel", color: "#000000" },
    { name: "Apple", iconUrl: "https://skillicons.dev/icons?i=apple", color: "#A2AAAD" },
  ],
  ai: [
    { name: "TensorFlow", iconUrl: "https://skillicons.dev/icons?i=tensorflow", color: "#FF6F00" },
    { name: "PyTorch", iconUrl: "https://skillicons.dev/icons?i=pytorch", color: "#EE4C2C" },
    { name: "OpenCV", iconUrl: "https://skillicons.dev/icons?i=opencv", color: "#5C3EE8" },
    { name: "scikit-learn", iconUrl: "https://skillicons.dev/icons?i=sklearn", color: "#F7931E" },
    { name: "Transformers", iconUrl: "/icons/huggingface.png", color: "#FFCC4D" },
  ],
  hardware: [
    { name: "Arduino", iconUrl: "https://skillicons.dev/icons?i=arduino", color: "#00979D" },
    { name: "IoT Programming", iconUrl: "https://skillicons.dev/icons?i=raspberrypi", color: "#A22846" },
  ],
  other: [
    { name: "Discord Bot Dev", iconUrl: "https://skillicons.dev/icons?i=discord", color: "#5865F2" },
    { name: "Discord.js", iconUrl: "https://skillicons.dev/icons?i=discordjs", color: "#5865F2" },
    { name: "Discord.py", iconUrl: "/icons/discordpy.png", color: "#3776AB" },
  ]
}

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showResume, setShowResume] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [contributions, setContributions] = useState([])
  const [totalContributions, setTotalContributions] = useState(0)
  const [contributionsLoading, setContributionsLoading] = useState(true)
  const [visitorCount, setVisitorCount] = useState(null)

  // Fetch and increment visitor count
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/aditya-garud-portfolio/visits/up')
      .then(r => r.json())
      .then(data => { if (data.count) setVisitorCount(data.count) })
      .catch(() => {})
  }, [])

  // Fetch GitHub contributions from public API
  useEffect(() => {
    async function fetchContributions() {
      try {
        setContributionsLoading(true)
        const res = await fetch('https://github-contributions-api.deno.dev/yashranaway.json')
        const data = await res.json()

        if (data?.contributions && Array.isArray(data.contributions)) {
          const levelMap = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }
          const mapped = data.contributions.flat()
            .filter(item => item && item.date && 'contributionCount' in item && 'contributionLevel' in item)
            .map(item => ({
              date: item.date,
              count: Number(item.contributionCount || 0),
              level: (levelMap[item.contributionLevel] || 0),
            }))

          // Filter to last year
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
          const filtered = mapped.filter(item => new Date(item.date) >= oneYearAgo)

          setTotalContributions(mapped.reduce((sum, item) => sum + item.count, 0))
          setContributions(filtered)
        }
      } catch (e) {
        // silently fail
      } finally {
        setContributionsLoading(false)
      }
    }
    fetchContributions()
  }, [])

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cal.com floating button
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "secret" })
      cal("floatingButton", {
        calLink: "aditya-garud/secret",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        buttonText: "Call",
      })
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" })
    })()
  }, [])

  // Handle theme switch with smooth lazy animation
  const handleThemeToggle = () => {
    setIsTransitioning(true)
    // Add a small delay for the lazy animation effect
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 100)
  }

  // Global click handler for letter animations
  const triggerRandomLetterEffect = () => {
    const letters = document.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    // Pick random letter
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    

    const effects = [
      // Colors
      'color-red', 'color-blue', 'color-green', 'color-purple', 'color-orange',
      'color-pink', 'color-yellow', 'color-cyan', 'color-lime', 'color-indigo',
      'color-teal', 'color-rose', 'color-amber', 'color-emerald', 'color-violet',
      
      // Scales
      'scale-tiny', 'scale-small', 'scale-big', 'scale-huge', 'scale-crazy',
      
      // Rotations
      'rotate-left', 'rotate-right', 'rotate-crazy', 'rotate-flip', 'rotate-spin',
      
      // Basic animations
      'shake', 'bounce', 'wobble', 'flip', 'pulse-big', 'pulse-crazy',
      
      // Glow effects
      'glow', 'glow-intense', 'glow-rainbow', 'neon-glow',
      
      // Rainbow and gradients
      'rainbow', 'rainbow-fast', 'fire-gradient', 'ocean-gradient', 'sunset-gradient',
      
      // Crazy animations
      'matrix-rain', 'glitch', 'elastic', 'jello', 'rubber', 'swing',
      'tada', 'heartbeat', 'flash', 'zoom-in', 'zoom-out', 'roll-in',
      'roll-out', 'fade-in-down', 'fade-in-up', 'slide-in', 'typewriter',
      'lightning', 'earthquake', 'tornado', 'explode', 'implode',
      
      // 3D effects
      'flip-x', 'flip-y', 'flip-z', 'rotate-3d', 'cube-flip', 'card-flip',
      
      // Particle effects
      'sparkle', 'confetti', 'fireworks', 'snow', 'rain',
      
      // Distortion effects
      'stretch-x', 'stretch-y', 'skew-left', 'skew-right', 'wave', 'ripple'
    ];
    
    // Pick random effect
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    // Apply effect
    randomLetter.classList.add('letter-active', randomEffect);
    
    // Remove effect after 2-3 seconds
    const duration = 2000 + Math.random() * 1000;
    setTimeout(() => {
      randomLetter.classList.remove('letter-active', randomEffect);
    }, duration);
  };

  useEffect(() => {
    // Global click listener - ANY click triggers letter animation
    const handleGlobalClick = (e) => {
      // Ignore clicks on elements marked to skip letter effects
      const target = e.target;
      if (target && target.closest && target.closest('[data-no-letter]')) return;
      triggerRandomLetterEffect();
    };

    // Add click listener to document
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [])

  // Scroll progress bar logic
  useEffect(() => {
    const calcProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
      setScrollProgress(pct)
    }
    calcProgress()
    window.addEventListener('scroll', calcProgress, { passive: true })
    window.addEventListener('resize', calcProgress)
    return () => {
      window.removeEventListener('scroll', calcProgress)
      window.removeEventListener('resize', calcProgress)
    }
  }, [])





  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={8}
      sparkRadius={15}
      sparkCount={6}
      duration={400}
      easing="ease-out"
      extraScale={1.0}
    >
      <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white relative transition-colors duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isTransitioning ? 'transition-all' : ''
      }`}>
        {/* Interactive Ripple Grid Background */}
        <BackgroundRippleEffect rows={20} cols={40} cellSize={50} />
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6 flex justify-center items-center animate-fade-in relative z-50">
        <Button
          variant="ghost"
          size="icon"
          data-no-letter
          onClick={handleThemeToggle}
          disabled={isTransitioning}
          className={`relative rounded-full w-10 h-10 sm:w-12 sm:h-12 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
            isTransitioning ? 'opacity-70 cursor-wait' : ''
          }`}
          aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
        >
          {/* Sun Icon - shows in dark mode to switch to light */}
          <Sun 
            className={`absolute h-5 w-5 sm:h-6 sm:w-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              theme === "dark" 
                ? 'rotate-0 scale-100 opacity-100' 
                : 'rotate-[360deg] scale-0 opacity-0'
            }`}
            style={{
              filter: theme === "dark" ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' : 'none',
              transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1), filter 700ms ease-in-out'
            }}
          />
          {/* Moon Icon - shows in light mode to switch to dark */}
          <Moon 
            className={`absolute h-5 w-5 sm:h-6 sm:w-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              theme === "dark" 
                ? 'rotate-[-360deg] scale-0 opacity-0' 
                : 'rotate-0 scale-100 opacity-100'
            }`}
            style={{
              filter: theme === "dark" ? 'none' : 'drop-shadow(0 0 4px rgba(147, 197, 253, 0.5))',
              transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1), filter 700ms ease-in-out'
            }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 max-w-7xl relative z-50" role="main">
        {/* Hero Section */}
        <section className="space-y-4 sm:space-y-6 animate-fade-in-up flex flex-col items-center" aria-labelledby="hero-heading" itemScope itemType="https://schema.org/Person">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8 w-full max-w-5xl">
            <div className="flex-1 space-y-4 sm:space-y-6 w-full">
              <ClickSpark
                sparkColor="#ffffff"
                sparkSize={12}
                sparkRadius={20}
                sparkCount={8}
                duration={600}
                easing="ease-out"
                extraScale={1.2}
              >
                <h1
                  id="hero-heading"
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight cursor-pointer relative text-zinc-900 dark:text-white"
                >
                  Hi, I&apos;m{" "}
                  <span className="interactive-name" itemProp="name">
                    <span className="letter letter-a" data-letter="A">A</span>
                    <span className="letter letter-d1" data-letter="d">d</span>
                    <span className="letter letter-i" data-letter="i">i</span>
                    <span className="letter letter-t" data-letter="t">t</span>
                    <span className="letter letter-y" data-letter="y">y</span>
                    <span className="letter letter-a2" data-letter="a">a</span>
                  </span>.
                </h1>
              </ClickSpark>
              
              <div className="space-y-4 sm:space-y-6 max-w-3xl">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 -mt-2">
                  been here for <TimeCounter startDate={new Date("2005-01-03")} /> years
                </p>
          
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-base sm:text-lg md:text-xl font-medium text-zinc-900 dark:text-white">about;</h2>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    i like technology and Machine Learning, cool stuff
                  </p>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Studying at{" "}
                    <a
                      href="https://www.vupune.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-900 dark:text-white font-medium hover:underline break-words"
                      itemProp="alumniOf"
                    >
                      Vishwakarma University
                    </a>
                  </p>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    I live in Pune, Maharashtra. You can keep up with me on{" "}
                    <LinkPreview
                      title="LinkedIn • Aditya Garud"
                      subtitle="Full Stack Developer & ML Engineer"
                      href="https://www.linkedin.com/in/aditya-garud-8b633a303"
                      avatar={linkedinAvatar}
                      position="bottom"
                    >
                      <a
                        href="https://www.linkedin.com/in/aditya-garud-8b633a303"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-900 dark:text-white font-medium hover:underline"
                      >
                        LinkedIn
                      </a>
                    </LinkPreview>
                    {", "}
                    <LinkPreview
                      title="X • yashranaway"
                      subtitle="Follow me on X"
                      href="https://x.com/yashranaway"
                      avatar={batcatAvatar}
                      position="bottom"
                    >
                      <a
                        href="https://x.com/yashranaway"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-900 dark:text-white font-medium hover:underline"
                      >
                        <span className="font-bold tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>𝕏</span>
                      </a>
                    </LinkPreview>
                    {" or "}
                    <LinkPreview
                      title="GitHub • yashranaway"
                      subtitle="Open-source projects and profile"
                      href="https://github.com/yashranaway"
                      avatar={githubAvatar}
                      position="bottom"
                    >
                      <a
                        href="https://github.com/yashranaway"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-900 dark:text-white font-medium hover:underline"
                      >
                        GitHub
                      </a>
                    </LinkPreview>.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Matrix Component - aligned with top of heading */}
            <div className="hidden lg:flex items-start justify-center self-start flex-shrink-0">
              <RandomMatrix
                rows={20}
                cols={20}
                fps={15}
                size={8}
                gap={3}
                patternChangeInterval={4000}
                palette={mounted && theme === "dark" ? {
                  on: "#ffffff",
                  off: "#000000",
                } : {
                  on: "#000000",
                  off: "#ffffff",
                }}
                ariaLabel="Random matrix patterns"
                className="rounded-lg border-2 border-zinc-600 dark:border-zinc-500 shadow-xl p-3 lg:p-4 bg-white dark:bg-black"
              />
            </div>
          </div>
        </section>


        {/* GitHub Activity */}
        <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {contributionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            </div>
          ) : contributions.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 w-fit mx-auto max-w-full overflow-x-auto">
              <ActivityCalendar
                data={contributions}
                blockSize={14}
                blockMargin={5}
                blockRadius={3}
                fontSize={13}
                colorScheme={mounted && theme === 'dark' ? 'dark' : 'light'}
                maxLevel={4}
                hideTotalCount={false}
                hideColorLegend={false}
                hideMonthLabels={false}
                theme={{
                  dark: [
                    'rgb(22, 27, 34)',
                    'rgb(14, 68, 41)',
                    'rgb(0, 109, 50)',
                    'rgb(38, 166, 65)',
                    'rgb(57, 211, 83)',
                  ],
                  light: [
                    'rgb(235, 237, 240)',
                    'rgb(155, 233, 168)',
                    'rgb(64, 196, 99)',
                    'rgb(48, 161, 78)',
                    'rgb(33, 110, 57)',
                  ],
                }}
                labels={{
                  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                  totalCount: '{{count}} contributions in the last year',
                }}
                style={{
                  color: mounted && theme === 'dark' ? 'rgb(139, 148, 158)' : 'rgb(100, 100, 100)',
                }}
              />
            </div>
          ) : null}
        </section>

        {/* Technical Skills Section */}
        <section className="space-y-8 sm:space-y-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center text-zinc-900 dark:text-white">
            Technical Arsenal
         </h2>
          
          {/* Programming Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr items-stretch">
            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">Programming Languages</h3>
                <div className="flex flex-wrap gap-2 items-start w-full">
                  {skillsData.languages.map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    if (skill.name === 'C') {
                      return (
                        <CodeHover key={skill.name} lang="c">
                          {chip}
                        </CodeHover>
                      )
                    }
                    const map = {
                      'C++': 'cpp',
                      'Java': 'java',
                      'Python': 'python',
                      'JavaScript': 'javascript',
                      'TypeScript': 'typescript',
                      'Rust': 'rust',
                      'Go': 'go',
                      'Ruby': 'ruby',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>
                        {chip}
                      </div>
                    )
                  })}
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">Frontend Development</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {skillsData.frontend.map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    const map = {
                      'HTML5': 'html',
                      'CSS3': 'css',
                      'Bootstrap': 'bootstrap',
                      'React': 'react',
                      'Tailwind CSS': 'tailwind',
                      'Next.js': 'nextjs',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>{chip}</div>
                    )
                  })}
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">Backend & Databases</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {skillsData.backend.map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    const map = {
                      'Node.js': 'node',
                      'Express.js': 'express',
                      'MongoDB': 'mongodb',
                      'MySQL': 'mysql',
                      'PostgreSQL': 'postgresql',
                      'Prisma': 'prisma',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>{chip}</div>
                    )
                  })}
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">AI & Machine Learning</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {skillsData.ai.map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    const map = {
                      'TensorFlow': 'tensorflow',
                      'PyTorch': 'pytorch',
                      'OpenCV': 'opencv',
                      'scikit-learn': 'sklearn',
                      'Transformers': 'transformers',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>{chip}</div>
                    )
                  })}
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">DevOps & Tools</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {skillsData.tools.map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    const map = {
                      'Linux': 'linux',
                      'Git': 'git',
                      'VS Code': 'vscode',
                      'Docker': 'docker',
                      'Firebase': 'firebase',
                      'AWS': 'aws',
                      'Vercel': 'vercel',
                      'Apple': 'apple',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>{chip}</div>
                    )
                  })}
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 h-full flex flex-col gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white">Specialized Skills</h3>
                <div className="flex flex-wrap gap-2 items-start">
                  {[...skillsData.hardware, ...skillsData.other].map((skill) => {
                    const chip = (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                        <img src={skill.iconSrc || skill.iconUrl} alt="" aria-hidden className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" />
                        <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">{skill.name}</span>
                      </div>
                    )
                    const map = {
                      'Arduino': 'arduino',
                      'IoT Programming': 'iot',
                      'Discord Bot Dev': 'discord',
                      'Discord.js': 'discordjs',
                      'Discord.py': 'discordpy',
                    }
                    const langKey = map[skill.name]
                    if (langKey) {
                      return (
                        <CodeHover key={skill.name} lang={langKey}>
                          {chip}
                        </CodeHover>
                      )
                    }
                    return (
                      <div key={skill.name}>{chip}</div>
                    )
                  })}
                </div>
            </div>

          </div>
        </section>
        {/* Projects Section */}
        <section className="space-y-8 sm:space-y-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-center font-medium text-zinc-900 dark:text-white">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-auto">
            {[
                {
                  title: "NetPulse Monitor",
                  description: "A distributed uptime monitoring system leveraging blockchain and decentralized validators for reliable, tamper-proof website monitoring. Uses cryptographically verified independent validators incentivized through micropayments, eliminating single-provider dependency.",
                  size: "large"
                },
                {
                  title: "Code-Sync Review MCP",
                  description: "A Model Context Protocol (MCP) worker providing comprehensive TypeScript/JavaScript code analysis. Integrates with AI assistants and development tools for intelligent code review, static analysis, and automated patch generation.",
                  size: "medium"
                },
                {
                  title: "Automated Chapter Segmentation for Live News Streams",
                  description: "Developed an AI-powered system to automatically segment YouTube live news streams into chapters by detecting topic shifts, context changes, and advertisement breaks in real-time. Implemented real-time transcription using Whisper-based models, combined with NLP for topic segmentation, enabling precise start and end timestamps for improved content navigation, highlight extraction, and personalized content delivery.",
                  size: "large"
                },
                {
                  title: "Discord Bot Management and Development",
                  description: "Architected and deployed scalable Discord bots with advanced features including automated moderation, custom commands, database integration, and real-time analytics. Built using Discord.py with PostgreSQL backend, serving 10,000+ users across multiple servers.",
                  size: "medium"
                },
                {
                  title: "Automated Traffic Management System",
                  description: "ATMS (Automated Traffic Management System) is an intelligent, AI-powered traffic control platform designed to optimize vehicle flow at busy intersections. Built with real-time computer vision and dynamic signal control logic.",
                  size: "medium"
                },
                {
                  title: "Virtual Mouse Gesture Control",
                  description: "Hand gesture recognition system for controlling OS functions, including volume and media playback. Built using computer vision and machine learning to enable touchless interaction with system controls through real-time hand tracking and gesture classification.",
                  size: "medium"
                },
                {
                  title: "YODHA",
                  description: "Developing an image recognition model to identify images in low-light conditions for improved clarity.",
                  size: "small"
                },
                {
                  title: "Stock Management Using LSTM",
                  description: "Built an LSTM model to predict stock prices and manage stock levels based on historical data.",
                  size: "small"
                },
                {
                  title: "Sidemen Among Us Stats Website",
                  description: "Web-based statistics tracker for Sidemen's 'Among Us' gameplay, providing comprehensive analytics and performance metrics for one of YouTube's most popular gaming series.",
                  size: "small"
                },
              ].map((project, index) => (
              <div 
                key={project.title}
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`relative p-4 sm:p-6 rounded-xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
                  project.size === 'large' ? 'md:col-span-2 lg:col-span-2' : 
                  project.size === 'medium' ? 'md:col-span-2 lg:col-span-1' : 
                  ''
                } ${
                  hoveredProject !== null && hoveredProject !== index ? 'blur-sm scale-[0.98] opacity-60' : 'shadow-lg'
                }`}
              >
                <div className="flex flex-col h-full gap-2 sm:gap-3">
                  <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-8 sm:space-y-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-zinc-900 dark:text-white">
            Get in touch
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Based in Pune, Maharashtra. You can reach me at{" "}
              <a
                href="mailto:garudaditya079@gmail.com"
                className="text-zinc-900 dark:text-white relative inline-block group break-all sm:break-normal"
              >
                <span>garudaditya079@gmail.com</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
              </a>
            </p>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
              <LinkPreview
                title="LinkedIn • Aditya Garud"
                subtitle="Full Stack Developer & ML Engineer"
                href="https://www.linkedin.com/in/aditya-garud-8b633a303"
                avatar={linkedinAvatar}
                position="bottom"
              >
                <a
                  href="https://www.linkedin.com/in/aditya-garud-8b633a303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-white relative inline-block group"
                aria-label="Connect with me on LinkedIn"
              >
                  <span>LinkedIn</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                </a>
              </LinkPreview>
              
              <LinkPreview
                title="X • yashranaway"
                subtitle="Follow me on X"
                href="https://x.com/yashranaway"
                avatar={batcatAvatar}
                position="bottom"
              >
                <a
                  href="https://x.com/yashranaway"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-white relative inline-block group"
                  aria-label="Follow me on X"
                >
                  <span className="font-bold tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>𝕏</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                </a>
              </LinkPreview>
              
              <LinkPreview
                title="GitHub • yashranaway"
                subtitle="Open-source projects and profile"
                href="https://github.com/yashranaway"
                avatar={githubAvatar}
                position="bottom"
              >
                <a
                  href="https://github.com/yashranaway"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-white relative inline-block group"
                aria-label="View my GitHub profile"
              >
                  <span>GitHub</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                </a>
              </LinkPreview>
              
              <a
                href="https://coff.ee/yashranaway"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-white relative inline-block group"
                aria-label="Buy me a coffee"
              >
                <span>Buy me a coffee</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
              </a>

              {/* Inline Resume trigger */}
              <button
                type="button"
                onClick={() => setShowResume(true)}
                className="text-zinc-900 dark:text-white relative inline-block group"
                data-no-letter
                aria-label="View Resume"
              >
                <span>Resume</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
              </button>
            </div>
          </div>
        </section>

        {/* Visitor Counter */}
        <section className="flex justify-center pt-2 pb-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40">
            <span className="text-zinc-400 dark:text-zinc-500 text-lg">#</span>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 tracking-wide">
              visitor no.
              <span className="font-bold text-zinc-900 dark:text-white ml-1.5 tabular-nums">
                {(visitorCount || 0).toLocaleString()}
              </span>
            </p>
          </div>
        </section>

        {/* Credit Section */}
        <section className="text-center py-6 sm:py-8 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 flex flex-wrap items-center justify-center gap-2 px-4">
            <Heart className="w-4 h-4 text-red-400" />
            Design inspired by{" "}
            <a
              href="https://x.com/maddiesimens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 dark:text-zinc-300 relative inline-block group"
              aria-label="Maddie Simens on Twitter"
            >
              <span>Maddie Simens</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-400 dark:bg-zinc-500 group-hover:w-full transition-all duration-300 ease-out"></span>
            </a>
          </p>
        </section>

      </main>

      {/* Resume Modal */}
      {showResume && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 sm:p-4" role="dialog" aria-modal="true">
          <div className="w-[min(98vw,1000px)] h-[min(95vh,900px)] max-h-[95vh] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
              <h3 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-white truncate flex-1 mr-2">Resume — Aditya Garud</h3>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <a href="/AdityaGarudResume.pdf" download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs sm:text-sm" data-no-letter>
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button onClick={() => setShowResume(false)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Close resume" data-no-letter>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-auto">
              <iframe src="/AdityaGarudResume.pdf#view=FitH" className="w-full h-full min-h-[400px] sm:min-h-[500px]" title="Resume PDF" />
            </div>
          </div>
        </div>
      )}
      {/* Bottom scroll progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-transparent z-50" aria-hidden="true">
        <div
          className="h-full bg-zinc-900 dark:bg-white transition-[width] duration-150 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
    </ClickSpark>
  )
}