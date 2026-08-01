export interface TechItem {
  name: string
  iconUrl: string
}

export type ProjectSize = "large" | "medium" | "small"

export interface Project {
  title: string
  description: string
  size: ProjectSize
  repo?: string
  live?: string
  stack: TechItem[]
}

// Project tech stack icons (uses skillicons.dev, same as the Skills section)
export const tech = {
  ts:        { name: "TypeScript", iconUrl: "https://skillicons.dev/icons?i=ts" },
  js:        { name: "JavaScript", iconUrl: "https://skillicons.dev/icons?i=js" },
  py:        { name: "Python", iconUrl: "https://skillicons.dev/icons?i=python" },
  rust:      { name: "Rust", iconUrl: "https://skillicons.dev/icons?i=rust" },
  c:         { name: "C", iconUrl: "https://skillicons.dev/icons?i=c" },
  nextjs:    { name: "Next.js", iconUrl: "https://skillicons.dev/icons?i=nextjs" },
  react:     { name: "React", iconUrl: "https://skillicons.dev/icons?i=react" },
  node:      { name: "Node.js", iconUrl: "https://skillicons.dev/icons?i=nodejs" },
  supabase:  { name: "Supabase", iconUrl: "https://skillicons.dev/icons?i=supabase" },
  postgres:  { name: "PostgreSQL", iconUrl: "https://skillicons.dev/icons?i=postgresql" },
  opencv:    { name: "OpenCV", iconUrl: "https://skillicons.dev/icons?i=opencv" },
  tensorflow:{ name: "TensorFlow", iconUrl: "https://skillicons.dev/icons?i=tensorflow" },
  arduino:   { name: "Arduino / Embedded", iconUrl: "https://skillicons.dev/icons?i=arduino" },
  swift:     { name: "Swift", iconUrl: "https://skillicons.dev/icons?i=swift" },
  docker:    { name: "Docker", iconUrl: "https://skillicons.dev/icons?i=docker" },
} satisfies Record<string, TechItem>

export const projects: Project[] = [
  {
    title: "Headless",
    description: "Persistent browser control for AI agents — semantic role-based actions instead of Playwright scripts or screen coordinates. WKWebView on macOS, sandboxed Chromium on Linux, with built-in recording and diagnostics.",
    size: "large",
    repo: "https://github.com/SarthakWade/headless",
    live: "https://headless-web-pi.vercel.app/",
    stack: [tech.ts, tech.node, tech.swift, tech.docker],
  },
  {
    title: "NetPulse Monitor",
    description: "Decentralized uptime monitor. Independent validators verify checks and are paid via micropayments.",
    size: "large",
    repo: "https://github.com/yashranaway/netpulse",
    stack: [tech.ts, tech.nextjs],
  },
  {
    title: "Code-Sync Review MCP",
    description: "MCP worker for TS/JS code analysis. Plugs into AI assistants for review, static checks, and automated patches.",
    size: "medium",
    repo: "https://github.com/yashranaway/CodeSyncReview_MCP",
    stack: [tech.ts, tech.node],
  },
  {
    title: "VM Rentals",
    description: "Marketplace to spin up, manage, and bill virtual machines.",
    size: "medium",
    repo: "https://github.com/yashranaway/vmrentals",
    stack: [tech.ts, tech.nextjs],
  },
  {
    title: "Virtual Mouse Gesture Control",
    description: "Hand-gesture OS control for volume, media, and system actions via real-time hand tracking.",
    size: "medium",
    repo: "https://github.com/yashranaway/virtual-mouse-gesture-control",
    stack: [tech.py, tech.opencv],
  },
  {
    title: "Fleet Maintenance AI",
    description: "Predictive maintenance dashboard for industrial vehicle fleets.",
    size: "medium",
    repo: "https://github.com/yashranaway/industrial-fleet-maintenance-ai",
    stack: [tech.js, tech.nextjs],
  },
  {
    title: "BharatAI",
    description: "Agent platform tuned for Indian-language workflows.",
    size: "medium",
    repo: "https://github.com/yashranaway/bharatai",
    stack: [tech.py],
  },
  {
    title: "Secure Tracker",
    description: "Microcontroller-based asset tracker with GPS, NB-IoT comms, and secure charging.",
    size: "medium",
    repo: "https://github.com/yashranaway/-Secure-Tracker-Project",
    stack: [tech.c, tech.arduino],
  },
  {
    title: "Supabase + Dodo Payments Starter",
    description: "SaaS starter with Supabase auth and Dodo Payments subscription billing.",
    size: "medium",
    repo: "https://github.com/yashranaway/supabase-dodopayments-starter",
    stack: [tech.ts, tech.nextjs, tech.supabase],
  },
  {
    title: "Discord Bot Management",
    description: "Scalable Discord bots with moderation, custom commands, and analytics. Discord.py and PostgreSQL, 10k+ users.",
    size: "small",
    stack: [tech.py, tech.postgres],
  },
  {
    title: "Defect Detection",
    description: "Computer-vision defect detection for production-line QA.",
    size: "small",
    repo: "https://github.com/yashranaway/defect-detection",
    stack: [tech.py, tech.tensorflow],
  },
  {
    title: "Specs Try-On",
    description: "AR eyeglasses try-on. See frames on your face via webcam.",
    size: "small",
    repo: "https://github.com/yashranaway/specs_try_on",
    stack: [tech.ts, tech.react],
  },
  {
    title: "Discord Tip Bot",
    description: "Crypto tip bot for Discord. On-chain micro-transfers, built in Rust.",
    size: "small",
    repo: "https://github.com/yashranaway/discord-tip-bot",
    stack: [tech.rust],
  },
  {
    title: "YODHA",
    description: "Image-recognition model for low-light scenes. Boosts clarity in poor lighting.",
    size: "small",
    stack: [tech.py],
  },
]
