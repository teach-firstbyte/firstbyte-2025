"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface HighlighterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  highlightClass?: string
  highlightColor?: string
  highlightWidth?: string
  highlightHeight?: string
  highlightOffset?: string
  highlightBlur?: string
  highlightOpacity?: string
  highlightIndex?: string
}

export function Highlighter({
  children,
  className,
  highlightClass,
  highlightColor = "hsl(var(--primary))",
  highlightWidth = "100%",
  highlightHeight = "100%",
  highlightOffset = "0px",
  highlightBlur = "20px",
  highlightOpacity = "0.2",
  highlightIndex = "-1",
  ...props
}: HighlighterProps) {
  return (
    <div className={cn("group relative", className)} {...props}>
      <div
        className={cn("absolute transition-all duration-500 opacity-0 group-hover:opacity-100", highlightClass)}
        style={{
          background: highlightColor,
          width: highlightWidth,
          height: highlightHeight,
          top: highlightOffset,
          left: highlightOffset,
          filter: `blur(${highlightBlur})`,
          opacity: highlightOpacity,
          zIndex: highlightIndex,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export function HighlighterCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-background p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function HighlighterItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Highlighter className={cn("rounded-lg", className)} highlightClass="rounded-lg" {...props}>
      <HighlighterCard className="transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md">
        {children}
      </HighlighterCard>
    </Highlighter>
  )
}

