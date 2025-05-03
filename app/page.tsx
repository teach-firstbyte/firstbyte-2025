"use client"

import { useRef, useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { TeamSection } from "@/components/team-section"
import useMousePosition from "@/hooks/use-mouse-position"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProgramsSection } from "@/components/programs-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const mousePosition = useMousePosition()

  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const programsRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      if (heroRef.current && heroRef.current instanceof HTMLElement && 
          scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection("home")
      } else if (aboutRef.current && aboutRef.current instanceof HTMLElement && 
                scrollPosition < aboutRef.current.offsetTop + aboutRef.current.offsetHeight) {
        setActiveSection("about")
      } else if (programsRef.current && programsRef.current instanceof HTMLElement && 
                scrollPosition < programsRef.current.offsetTop + programsRef.current.offsetHeight) {
        setActiveSection("programs")
      } else if (teamRef.current && teamRef.current instanceof HTMLElement && 
                scrollPosition < teamRef.current.offsetTop + teamRef.current.offsetHeight) {
        setActiveSection("team")
      } else if (contactRef.current) {
        setActiveSection("contact")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar activeSection={activeSection} />
      
      <HeroSection 
        ref={heroRef} 
        mousePosition={mousePosition} 
      />
      
      <AboutSection 
        ref={aboutRef} 
      />
      
      <ProgramsSection 
        ref={programsRef} 
      />
      
      <TeamSection 
        ref={teamRef} 
      />
      
      <ContactSection 
        ref={contactRef} 
      />
      
      <Footer />
    </main>
  )
}

