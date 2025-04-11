"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { CodeAnimation } from "@/components/code-animation"
import { forwardRef } from "react"

export const AboutSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="about" className="py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              {Array.from("FirstByte was founded with a simple mission: to make computer science and STEM education accessible to all students, regardless of their background.").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: index * 0.03,
                  }}
                  viewport={{ once: true }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Why We Started</h3>
            <p className="mb-4 text-muted-foreground">
              We recognized a gap in educational opportunities, particularly in underserved communities. Many students
              weren't getting exposure to computer science and STEM fields early enough to develop interest and
              confidence.
            </p>
            <p className="mb-6 text-muted-foreground">
              Our founders, a group of passionate educators and tech professionals, came together to create engaging,
              hands-on learning experiences that make these subjects approachable and exciting.
            </p>
            <StarBorder as="div" className="group">
              Our Team{" "}
              <ChevronRight className="ml-2 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" />
            </StarBorder>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <CodeAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  )
}) 