"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Search, X, Linkedin, Instagram, ArrowUpRight } from "lucide-react"
import { LinktreeIcon } from "@/components/ui/icons"
import { HighlightGroup, HighlighterItem } from "@/hooks/use-mouse-position"
import { AnimatedGlowButton } from "@/components/ui/animated-glow-button"
import { useTooltip, BlurTooltip } from "@/components/ui/blur-tooltip"

// Define TypeScript interface for props
interface NavbarProps {
  activeSection: string;
}

// More robust scrollToSection function with direct approach
const scrollToSection = (id: string) => {
  // Close any mobile menu first
  const element = document.getElementById(id)
  if (element) {
    // Use a timeout to ensure the menu close animation completes
    setTimeout(() => {
      try {
        // For the home section, we want to scroll to the very top
        if (id === "home") {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        } else {
          // For other sections, use scrollIntoView
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      } catch (error) {
        // Ultimate fallback - direct jump
        window.location.hash = id
      }
    }, 10)
  }
}

export function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [openCommandMenu, setOpenCommandMenu] = useState(false)
  
  // Use our tooltip hook instead
  const {
    tooltipRect,
    tooltipContent,
    tooltipVisible,
    handleTooltipShow,
    handleTooltipHide
  } = useTooltip()

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
    { name: "Home", href: "/#home", section: "home" },
    { name: "About", href: "/#about", section: "about" },
    { name: "Programs", href: "/#programs", section: "programs" },
    { name: "Team", href: "/#team", section: "team" },
    // { name: "All Programs", href: "/programs", section: "programs" },
  ]

  // Animation variants
  const pillVariants = {
    initial: { 
      borderRadius: "9999px",
      background: "rgba(var(--background-rgb), 0.9)",
      width: "auto",
      x: 0,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    scrolled: { 
      borderRadius: "9999px",
      background: "rgba(var(--background-rgb), 0.95)",
      width: "auto",
      x: 0,
      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
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

  // Updated animation variants for the mobile menu
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
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none overflow-x-hidden w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-full">
        <div className="flex justify-between items-start py-6 md:py-10">
          {/* Pill navbar in top right */}
          <motion.div
            ref={navRef}
            className={`pointer-events-auto backdrop-blur-lg border border-border/60 shadow-sm overflow-hidden z-50 ml-auto flex max-w-[95%]`}
            initial="initial"
            animate={pastHero ? "scrolled" : "initial"}
            variants={pillVariants}
            style={{
              '--background-rgb': 'var(--background)',
            } as any}
          >
            {/* Logo container that grows/shrinks */}
            <AnimatePresence mode="wait">
              {pastHero && !isMenuOpen ? (
                <motion.div
                  key="logo-visible"
                  className="overflow-hidden flex items-center"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.19, 1, 0.22, 1] 
                  }}
                >
                  <Link 
                    href="/" 
                    className="flex items-center pl-4"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("home");
                    }}
                  >
                    <Image src="/FirstByteBitex4.png" alt="FirstByte Logo" width={24} height={24} className="w-6 h-6" />
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Main content container - stable size */}
            <motion.div 
              className="flex h-12 md:h-14 items-center justify-end px-3 md:px-4"
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
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.section);
                        }}
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
                  <div className="flex items-center overflow-hidden" style={{ transition: 'width 0.3s ease-in-out' }}>
                    <div className="flex items-cetner gap-1">
                      <div className="flex items-center gap-2">
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
                        style={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-3">
                  {/* Command Menu Button */}
                  <HighlighterItem>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
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

                  <HighlighterItem>
                    <AnimatedGlowButton 
                      color="green"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSf1BCJAfHPWxypcqdFvHBKm5jYJcnTFwrbj2l_RCfskubxOmA/viewform?usp=sharing"
                      className="py-1.5 px-3 text-sm"
                    >
                      Get Involved
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </AnimatedGlowButton>
                  </HighlighterItem>

                  {/* Theme Toggle */}
                  <HighlighterItem>
                    <ThemeToggle />
                  </HighlighterItem>
                </div>
              </HighlightGroup>

              <motion.button
                className="md:hidden flex z-50 pointer-events-auto relative"
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

      {/* Mobile menu - updated positioning and blur effect */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden pointer-events-auto fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-sm w-full z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            {/* Mobile menu header with logo - aligned with navbar */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-full">
              <div className="flex justify-between items-center py-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 pointer-events-auto"
                >
                  <Image 
                    src="/FirstByteBitex4.png" 
                    alt="FirstByte Logo" 
                    width={28} 
                    height={28} 
                    className="w-7 h-7"
                  />
                  <span className="font-semibold text-lg">FirstByte</span>
                </motion.div>
                {/* Empty div to maintain spacing, actual button is in the navbar */}
                <div className="w-12 h-12"></div>
              </div>
            </div>

            <nav className="flex flex-col gap-2 px-4 pt-0 mt-1 pb-4">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileMenuItemVariants}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 relative text-right ${
                      activeSection === link.section 
                        ? "text-primary" 
                        : "text-foreground/80 hover:text-primary"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.section);
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className="relative inline-block">
                      {link.name}
                      {activeSection === link.section && (
                        <motion.div 
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary" 
                          layoutId="mobileActiveSection"
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
              <motion.div 
                className="mt-3 flex items-center justify-between"
                variants={mobileMenuItemVariants}
              >
                {/* Search button moved to the left */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
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
                
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/teach_firstbyte"
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
                  <AnimatedGlowButton 
                    color="green"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSf1BCJAfHPWxypcqdFvHBKm5jYJcnTFwrbj2l_RCfskubxOmA/viewform?usp=sharing"
                    className="py-1 px-2 text-xs"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Involved
                    <ArrowUpRight className="h-3 w-3 ml-1 text-muted-foreground" />
                  </AnimatedGlowButton>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the tooltip using our new component */}
      {tooltipRect && (
        <BlurTooltip
          position={tooltipRect}
          content={tooltipContent}
          visible={tooltipVisible}
          id="navbar-tooltip"
        />
      )}
    </div>
  )
}