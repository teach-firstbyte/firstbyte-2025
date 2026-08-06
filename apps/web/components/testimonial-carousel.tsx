"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "High School Student",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "Before FirstByte, I had never written a line of code. Now I'm building my own apps and considering a career in software development. The mentors made complex concepts easy to understand and were always there to help when I got stuck.",
  },
  {
    id: 2,
    name: "Maya Patel",
    role: "Middle School Student",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The robotics workshop was amazing! I never thought I could build and program a robot, but the FirstByte team made it fun and accessible. Now I'm teaching my friends what I learned and we're working on projects together.",
  },
  {
    id: 3,
    name: "Jamal Williams",
    role: "College Freshman",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "I participated in FirstByte programs throughout high school, and it gave me a huge advantage when I started my computer science degree. The hands-on projects and real-world applications helped me understand not just how to code, but why we code.",
  },
  {
    id: 4,
    name: "Sofia Rodriguez",
    role: "High School Junior",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "As a girl interested in tech, I sometimes felt out of place, but FirstByte created an inclusive environment where everyone's ideas were valued. The mentors were diverse and inspiring, showing me that there's a place for everyone in the tech world.",
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <Card className="max-w-3xl mx-auto bg-muted/30">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Image
                    src={testimonials[current].image || "/placeholder.svg"}
                    alt={testimonials[current].name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                </div>
                <blockquote className="text-xl italic mb-6">"{testimonials[current].quote}"</blockquote>
                <div>
                  <div className="font-bold">{testimonials[current].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[current].role}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => {
              setAutoplay(false)
              setCurrent(index)
            }}
            className={`w-2 h-2 p-0 rounded-full ${current === index ? "bg-primary" : "bg-muted-foreground/30"}`}
          />
        ))}

        <Button variant="outline" size="icon" onClick={next} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

