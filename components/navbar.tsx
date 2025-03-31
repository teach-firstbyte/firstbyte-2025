"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { StarBorder } from "@/components/ui/star-border"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Search, X, ChevronUp, Linkedin, Instagram } from "lucide-react"
import { LinktreeIcon } from "@/components/ui/icons"
import { HighlightGroup, HighlighterItem } from "@/hooks/use-mouse-position"
import { createPortal } from "react-dom"

// Define TypeScript interface for props
interface NavbarProps {
  activeSection: string;
}

// Tooltip position interface
interface TooltipPosition {
  x: number;
  y: number;
  width?: number;
}

// Portal component for tooltips
function TooltipPortal({ children }: { children: React.ReactNode }) {
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
interface BlurTooltipProps {
  position: TooltipPosition;
  content: string | React.ReactNode;
  visible: boolean;
  icon?: React.ReactNode;
  id?: string;
}

function BlurTooltip({ position, content, visible, icon, id = "tooltip" }: BlurTooltipProps) {
  return (
    <TooltipPortal>
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

export function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [openCommandMenu, setOpenCommandMenu] = useState(false)
  const [tooltipRect, setTooltipRect] = useState<TooltipPosition | null>(null)
  const [tooltipContent, setTooltipContent] = useState<string>("")
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null)

  // Handle tooltip display
  const handleTooltipShow = (content: string, event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipRect({
      x: event.clientX,
      y: event.clientY + 30 // Position below cursor
    })
    setTooltipContent(content)
    setTooltipVisible(true)
    
    // Clear any existing timer
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current)
      tooltipTimer.current = null
    }
  }

  const handleTooltipHide = () => {
    setTooltipVisible(false)
    
    // Clean up tooltip after animation (longer timeout for slower fade-out)
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

  useEffect(() => {
    return () => {
      // Clean up any timers on unmount
      if (tooltipTimer.current) {
        clearTimeout(tooltipTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Assuming the hero section is approximately 100vh tall
      if (window.scrollY > window.innerHeight * 0.7) {
        setPastHero(true)
      } else {
        setPastHero(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle CMD+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommandMenu(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const navLinks = [
    { name: "Home", href: "#home", section: "home" },
    { name: "About", href: "#about", section: "about" },
    { name: "Programs", href: "#programs", section: "programs" },
    { name: "Team", href: "#team", section: "team" },
  ]

  // Animation variants
  const pillVariants = {
    initial: { 
      borderRadius: "9999px",
      background: "rgba(var(--background-rgb), 0.75)",
      width: "auto",
      x: 0,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
    },
    scrolled: { 
      borderRadius: "9999px",
      background: "rgba(var(--background-rgb), 0.85)",
      width: "auto",
      x: 0,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  }

  const logoVariants = {
    initial: {
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    scrolled: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  }

  const linkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" } 
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeIn" } 
    }
  }

  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const mobileMenuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-start py-6 md:py-10">
          {/* Logo in top left - only visible when scrolled past hero */}
          <AnimatePresence>
            {pastHero && (
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link href="/" className="text-xl font-bold flex items-center gap-2">
                  <img src="/FirstByteBitex4.png" alt="FirstByte Logo" className="w-6 h-6" />
                  FirstByte
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo placeholder to maintain layout when not visible */}
          {!pastHero && (
            <div className="opacity-0 invisible pointer-events-none">
              <span className="text-xl font-bold flex items-center gap-2">
                <img src="/FirstByteBitex4.png" alt="FirstByte Logo" className="w-6 h-6" />
                FirstByte
              </span>
            </div>
          )}

          {/* Pill navbar in top right */}
          <motion.div
            ref={navRef}
            className={`pointer-events-auto backdrop-blur-lg border border-border/40 shadow-sm overflow-hidden z-10`}
            initial="initial"
            animate={pastHero ? "scrolled" : "initial"}
            variants={pillVariants}
            layout
            layoutRoot
            style={{
              '--background-rgb': 'var(--background)',
            } as any}
          >
            <motion.div 
              className="flex h-12 md:h-14 items-center justify-end px-3 md:px-4"
              layout
            >
              <HighlightGroup className="hidden md:flex items-center gap-2">
                {navLinks.map((link, index) => (
                  <HighlighterItem key={link.name} className="group">
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={linkVariants}
                    >
                      <Link
                        href={link.href}
                        className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative ${
                          activeSection === link.section 
                            ? "text-primary" 
                            : "text-foreground/80 hover:text-primary"
                        }`}
                      >
                        {link.name}
                        {activeSection === link.section && (
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" 
                            layoutId="activeSection"
                            style={{ width: '100%' }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  </HighlighterItem>
                ))}
                
                <div className="flex items-center gap-2 px-1">
                  <div className="flex items-center overflow-hidden" style={{ width: menuOpen ? '140px' : '0px', transition: 'width 0.3s ease-in-out' }}>
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
                        <ThemeToggle />
                      </div>
                      <a
                        href="https://www.instagram.com/teach_firstbyte"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/80 hover:text-primary transition-colors"
                        style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                        onMouseEnter={(e) => handleTooltipShow("Instagram", e)}
                        onMouseLeave={handleTooltipHide}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Instagram className="h-5 w-5" />
                        </motion.div>
                      </a>
                      <a
                        href="https://www.linkedin.com/company/firstbyte"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/80 hover:text-primary transition-colors"
                        style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                        onMouseEnter={(e) => handleTooltipShow("LinkedIn", e)}
                        onMouseLeave={handleTooltipHide}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Linkedin className="h-5 w-5" />
                        </motion.div>
                      </a>
                      <a
                        href="https://linktr.ee/firstbyte"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/80 hover:text-primary transition-colors"
                        style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                        onMouseEnter={(e) => handleTooltipShow("Linktree", e)}
                        onMouseLeave={handleTooltipHide}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <LinktreeIcon className="h-5 w-5" />
                        </motion.div>
                      </a>
                    </div>
                  </div>
                  
                  <HighlighterItem>
                    <motion.div
                      className="cursor-pointer text-foreground/80 hover:text-primary transition-colors"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <motion.div
                        animate={{ 
                          rotate: menuOpen ? 270 : 0,
                          transition: {
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                          }
                        }}
                      >
                        <ChevronUp className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </HighlighterItem>
                </div>

                <div className="ml-3 flex items-center gap-3">
                  {/* Command Menu Button */}
                  <HighlighterItem>
                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={linkVariants}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border/50 rounded-md"
                      onClick={() => {
                        // This will trigger the actual command menu through the global keyboard shortcut
                        const event = new KeyboardEvent('keydown', {
                          key: 'k',
                          metaKey: true,
                          bubbles: true
                        });
                        document.dispatchEvent(event);
                      }}
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Search</span>
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </motion.button>
                  </HighlighterItem>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StarBorder className="text-sm">Get Involved</StarBorder>
                  </motion.div>
                </div>
              </HighlightGroup>

              <motion.button
                className="md:hidden flex"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden pointer-events-auto overflow-hidden bg-background/95 backdrop-blur-lg border-b"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <nav className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileMenuItemVariants}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 relative ${
                      activeSection === link.section 
                        ? "text-primary" 
                        : "text-foreground/80 hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    {activeSection === link.section && (
                      <motion.div 
                        className="absolute bottom-0 left-0 w-12 h-[2px] bg-primary" 
                        layoutId="mobileActiveSection"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                className="mt-3 flex items-center justify-between"
                variants={mobileMenuItemVariants}
              >
                <div className="flex items-center gap-2">
                  <img src="/FirstByteBitex4.png" alt="FirstByte Logo" className="w-6 h-6" />
                  
                  {/* Mobile Search Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setIsMenuOpen(false)
                      const event = new KeyboardEvent('keydown', {
                        key: 'k',
                        metaKey: true,
                        bubbles: true
                      });
                      document.dispatchEvent(event);
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <a
                    href="https://www.instagram.com/firstbytedotorg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors"
                    onMouseEnter={(e) => handleTooltipShow("Instagram", e)}
                    onMouseLeave={handleTooltipHide}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Instagram className="h-4 w-4" />
                    </motion.div>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/firstbyte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors"
                    onMouseEnter={(e) => handleTooltipShow("LinkedIn", e)}
                    onMouseLeave={handleTooltipHide}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Linkedin className="h-4 w-4" />
                    </motion.div>
                  </a>
                  <a
                    href="https://linktr.ee/firstbyte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors"
                    onMouseEnter={(e) => handleTooltipShow("Linktree", e)}
                    onMouseLeave={handleTooltipHide}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LinktreeIcon className="h-4 w-4" />
                    </motion.div>
                  </a>
                  <Button 
                    onClick={() => setIsMenuOpen(false)}
                    className="transition-all duration-300 ml-2"
                    size="sm"
                  >
                    Get Involved
                  </Button>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the tooltip */}
      {tooltipRect && (
        <BlurTooltip
          position={tooltipRect}
          content={tooltipContent}
          visible={tooltipVisible}
          id="social-tooltip"
        />
      )}
    </div>
  )
}

