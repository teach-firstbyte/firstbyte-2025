"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { StarBorder } from "@/components/ui/star-border"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { HighlightGroup, HighlighterItem } from "@/hooks/use-mouse-position"

// Define TypeScript interface for props
interface NavbarProps {
  activeSection: string;
}

export function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

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

  const navLinks = [
    { name: "Home", href: "#home", section: "home" },
    { name: "About", href: "#about", section: "about" },
    { name: "Programs", href: "#programs", section: "programs" },
    { name: "Team", href: "#team", section: "team" },
    { name: "Contact", href: "#contact", section: "contact" },
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
                <div className="ml-3 flex items-center gap-3">
                  <ThemeToggle />
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
                  <ThemeToggle />
                </div>
                <Button 
                  onClick={() => setIsMenuOpen(false)}
                  className="transition-all duration-300"
                  size="sm"
                >
                  Get Involved
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

