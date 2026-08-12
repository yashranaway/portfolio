"use client"

import { useEffect } from "react"

// Injects a copy button into every code block after mount.
//
// Done imperatively rather than as an MDX component override because
// rehype-pretty-code emits its own <figure>/<pre> structure; wrapping it in a
// custom component would mean re-implementing that markup and losing the Shiki
// output. Attaching to the rendered DOM keeps the highlighting untouched.
export default function CodeCopyButtons() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>("article pre")

    const cleanups: Array<() => void> = []

    blocks.forEach((pre) => {
      if (pre.dataset.copyAttached) return
      pre.dataset.copyAttached = "true"
      pre.style.position = "relative"

      const btn = document.createElement("button")
      btn.type = "button"
      btn.textContent = "copy"
      btn.setAttribute("aria-label", "Copy code to clipboard")
      btn.className =
        "absolute right-2 top-2 rounded border border-zinc-300 dark:border-zinc-600 " +
        "bg-white/80 dark:bg-zinc-900/80 px-2 py-1 font-mono text-[10px] " +
        "text-zinc-600 dark:text-zinc-400 opacity-0 transition-opacity " +
        "hover:text-zinc-900 dark:hover:text-white focus:opacity-100"

      const show = () => (btn.style.opacity = "1")
      const hide = () => (btn.style.opacity = "0")
      pre.addEventListener("mouseenter", show)
      pre.addEventListener("mouseleave", hide)

      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? ""
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = "copied"
        } catch {
          btn.textContent = "failed"
        }
        setTimeout(() => (btn.textContent = "copy"), 1500)
      }
      btn.addEventListener("click", onClick)
      pre.appendChild(btn)

      cleanups.push(() => {
        pre.removeEventListener("mouseenter", show)
        pre.removeEventListener("mouseleave", hide)
        btn.removeEventListener("click", onClick)
        btn.remove()
        delete pre.dataset.copyAttached
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return null
}
