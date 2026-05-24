"use client"

import type { ReactNode } from "react"

export function SkillCardSkeleton() {
  return (
    <div className="group relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-white/20 animate-pulse">
      <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
      <div className="flex-1">
        <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-20" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-zinc-900 border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-zinc-700 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-700 rounded" />
          <div className="h-4 bg-zinc-700 rounded" />
          <div className="h-4 bg-zinc-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  )
}

interface SectionSkeletonProps {
  children?: ReactNode
}

export function SectionSkeleton({ children }: SectionSkeletonProps) {
  return (
    <section className="space-y-8 animate-fade-in">
      {children}
    </section>
  )
}

export function SkillsSectionSkeleton() {
  return (
    <SectionSkeleton>
      <div className="space-y-12 relative">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="h-8 bg-zinc-300 dark:bg-zinc-700 rounded w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-96 mx-auto animate-pulse" />
        </div>

        {/* Skills Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((section) => (
            <div key={section} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-48 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkillCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionSkeleton>
  )
}
