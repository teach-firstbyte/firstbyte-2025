"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

// Tooltip position interface
export interface TooltipPosition {
  x: number;
  y: number;
  width?: number;
}

// Portal component for tooltips
export function TooltipPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  if (!mounted) return null
  
  return typeof window !== 'undefined' 
    ? createPortal(children, document.body)
    : null
}

// BlurTooltip component
export interface BlurTooltipProps {
  position: TooltipPosition;
  content: string | React.ReactNode;
  visible: boolean;
  icon?: React.ReactNode;
  id?: string;
}

export function BlurTooltip({ position, content, visible, icon, id = "tooltip" }: BlurTooltipProps) {
  return (
    <TooltipPortal>
      <div 
        className="pointer-events-none fixed left-0 top-0 z-[9999]" 
        id={`STALKER-${id}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div 
          id="STALKER_INNER"
          className="flex items-center space-x-[3px] rounded-xl border border-border/20 bg-background/80 p-2 px-3 backdrop-blur-md"
          style={{ 
            filter: visible ? "blur(0px)" : "blur(16px)",
            opacity: visible ? 1 : 0,
            transitionProperty: "filter, opacity",
            transitionDuration: visible ? "0.3s" : "0.8s", // Moderate blur-in, slow blur-out
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            transform: "translate(-50%, 0)" // Center horizontally, don't offset vertically
          }}
        >
          <span className="text-xs text-foreground/50">
            {content}
          </span>
          {icon || (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-auto w-4 text-foreground/50">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          )}
        </div>
      </div>
    </TooltipPortal>
  );
}

// Hook for handling tooltip state
export function useTooltip() {
  const [tooltipRect, setTooltipRect] = useState<TooltipPosition | null>(null)
  const [tooltipContent, setTooltipContent] = useState<string>("")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipTimer = useState<NodeJS.Timeout | null>(null)[0]

  // Handle tooltip display
  const handleTooltipShow = (content: string, event: React.MouseEvent<HTMLElement>) => {
    setTooltipRect({
      x: event.clientX,
      y: event.clientY + 30 // Position below cursor
    })
    setTooltipContent(content)
    setTooltipVisible(true)
    
    // Clear any existing timer
    if (tooltipTimer) {
      clearTimeout(tooltipTimer)
    }
  }

  const handleTooltipHide = () => {
    setTooltipVisible(false)
    
    // Clean up tooltip after animation (longer timeout for slower fade-out)
    setTimeout(() => {
      if (!tooltipVisible) {
        setTooltipRect(null)
      }
    }, 1200)
  }

  // Handle mouse movement to update tooltip position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltipVisible && tooltipRect) {
        setTooltipRect({
          x: e.clientX,
          y: e.clientY + 15 // Position below cursor
        })
      }
    }

    if (tooltipVisible) {
      document.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [tooltipVisible, tooltipRect])

  return {
    tooltipRect,
    tooltipContent,
    tooltipVisible,
    handleTooltipShow,
    handleTooltipHide
  }
} 