"use client"

import { useState, useRef, useEffect } from "react"

// Tooltip position interface
interface TooltipPosition {
  x: number;
  y: number;
  width?: number;
}

interface BlurTooltipProps {
  position: TooltipPosition;
  content: string | React.ReactNode;
  visible: boolean;
  icon?: React.ReactNode;
  id?: string;
}

export function BlurTooltip({ position, content, visible, icon, id = "tooltip" }: BlurTooltipProps) {
  return (
    <div 
      className="pointer-events-none fixed left-0 top-0 z-[9999]" 
      id="STALKER" 
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div 
        id="STALKER_INNER"
        className="flex items-center space-x-[3px] rounded-xl border border-border/20 bg-background/80 p-2 px-3 backdrop-blur-md"
        style={{ 
          filter: visible ? "blur(0px)" : "blur(16px)",
          opacity: visible ? 1 : 0,
          transitionProperty: "filter, opacity",
          transitionDuration: visible ? "0.3s" : "0.8s",
          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
          transform: "translate(-50%, 0)"
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
  );
}

// Hook for managing tooltip state
export function useTooltip() {
  const [tooltipRect, setTooltipRect] = useState<TooltipPosition | null>(null)
  const [tooltipContent, setTooltipContent] = useState<string>("")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null)

  const handleTooltipShow = (content: string, event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipRect({
      x: event.clientX,
      y: event.clientY + 30
    })
    setTooltipContent(content)
    setTooltipVisible(true)
    
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current)
      tooltipTimer.current = null
    }
  }

  const handleTooltipHide = () => {
    setTooltipVisible(false)
    
    tooltipTimer.current = setTimeout(() => {
      if (!tooltipVisible) {
        setTooltipRect(null)
      }
      tooltipTimer.current = null
    }, 1200)
  }

  // Handle mouse movement to update tooltip position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltipVisible && tooltipRect) {
        setTooltipRect({
          x: e.clientX,
          y: e.clientY + 15
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

  useEffect(() => {
    return () => {
      if (tooltipTimer.current) {
        clearTimeout(tooltipTimer.current)
      }
    }
  }, [])

  return {
    tooltipRect,
    tooltipContent,
    tooltipVisible,
    handleTooltipShow,
    handleTooltipHide
  }
} 