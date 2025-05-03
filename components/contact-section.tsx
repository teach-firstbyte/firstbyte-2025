"use client"

import { motion } from "framer-motion"
import { ChevronRight, Users, GraduationCap, Lightbulb } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { Button } from "@/components/ui/button"
import { forwardRef } from "react"
import { AnimatedGlowButton } from "@/components/ui/animated-glow-button"

export const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="contact" className="py-20 px-4 md:px-6 lg:px-8 bg-[hsl(var(--gray-100))] bg-grid-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Whether you're a student, educator, volunteer, or supporter, there are many ways to get involved.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            className="bg-card rounded-lg p-8 shadow-sm border"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First name
                  </label>
                  <input
                    id="first-name"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                  placeholder="How can we help?"
                />
              </div>
              <AnimatedGlowButton as="button" type="submit" color="purple" className="w-full">
                Send Message
              </AnimatedGlowButton>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">Ways to Participate</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Become a Student</h4>
                  <p className="text-muted-foreground mb-2">
                    Join our programs and start your journey in computer science and STEM.
                  </p>
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    Apply Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Volunteer as a Mentor</h4>
                  <p className="text-muted-foreground mb-2">
                    Share your knowledge and experience with the next generation of tech leaders.
                  </p>
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    Become a Mentor <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Partner With Us</h4>
                  <p className="text-muted-foreground mb-2">
                    Collaborate with FirstByte to expand our impact and reach more students.
                  </p>
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    Explore Partnerships <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}) 