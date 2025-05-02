"use client"

import { motion } from "framer-motion"
import { BlurTooltip, useTooltip } from "@/components/ui/blur-tooltip"
import Link from "next/link"

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

export function Footer() {
  const { tooltipRect, tooltipContent, tooltipVisible, handleTooltipShow, handleTooltipHide } = useTooltip()

  return (
    <footer className="py-12 px-4 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">

            <Link href="/" className="text-xl font-bold flex items-center gap-2 mb-4">
              <img src="/FirstByteBitex4.png" alt="FirstByte Logo" className="w-8 h-8" />
              <h3 className="font-bold text-xl">FirstByte</h3>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering the next generation through accessible, engaging, and effective computer science and STEM
              education.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.instagram.com/teach_firstbyte" 
                target="_blank" 
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={(e) => handleTooltipShow("Instagram", e)}
                onMouseLeave={handleTooltipHide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/company/firstbyte" 
                target="_blank" 
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={(e) => handleTooltipShow("LinkedIn", e)}
                onMouseLeave={handleTooltipHide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <motion.li
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/#about" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                >
                  About Us
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/#programs" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('programs');
                  }}
                >
                  Our Programs
                </a>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/#team" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('team');
                  }}
                >
                  Our Team
                </a>
              </motion.li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <motion.li
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mt-0.5 text-muted-foreground"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a 
                  href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=info@firstbyte.org" 
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-muted-foreground">teachfirstbyte@gmail.com</span>
                </a>
              </motion.li>
              <motion.li
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mt-0.5 text-muted-foreground"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <a 
                  href="https://www.google.com/maps/dir//Northeastern+University,+360+Huntington+Ave,+Boston,+MA+02115/" 
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors flex flex-col"
                >
                  <p className="text-muted-foreground">Northeastern University</p>
                  <p className="text-muted-foreground">360 Huntington Ave, Boston, MA 02115</p>
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FirstByte. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
          </div>
        </div>
      </div>

      {/* Render the tooltip */}
      {tooltipRect && (
        <BlurTooltip
          position={tooltipRect}
          content={tooltipContent}
          visible={tooltipVisible}
          id="social-tooltip"
        />
      )}
    </footer>
  )
} 