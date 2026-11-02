"use client"

import { useEffect } from "react"

import { agentTools, type AgentTool } from "@/lib/agent-tools"

// WebMCP is a W3C draft, so neither property is in the DOM typings yet.
interface ModelContext {
  registerTool(
    tool: AgentTool & { annotations: { readOnlyHint: boolean } },
    options: { signal: AbortSignal },
  ): Promise<void> | void
}

declare global {
  interface Document {
    modelContext?: ModelContext
  }
  interface Navigator {
    modelContext?: ModelContext
  }
}

export default function WebMcpTools() {
  useEffect(() => {
    // navigator.modelContext is the older draft's location, kept as a fallback.
    const modelContext = document.modelContext ?? navigator.modelContext
    if (!modelContext) return

    const controller = new AbortController()
    for (const tool of agentTools) {
      void modelContext.registerTool(
        { ...tool, annotations: { readOnlyHint: true } },
        { signal: controller.signal },
      )
    }
    return () => controller.abort()
  }, [])

  return null
}
