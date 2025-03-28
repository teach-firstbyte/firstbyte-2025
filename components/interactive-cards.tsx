"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, BookOpen, Users, Laptop } from "lucide-react"

const cards = [
  {
    id: 1,
    title: "Project-Based Learning",
    icon: Code,
    description:
      "Students learn by building real projects, from simple games to complex applications, applying concepts as they learn them.",
    color: "bg-blue-500/10 text-blue-500",
    details:
      "Our project-based approach ensures that students don't just memorize concepts, but truly understand how to apply them. Each project is carefully designed to introduce new concepts while reinforcing previous learning. Students leave with a portfolio of work they can proudly share.",
  },
  {
    id: 2,
    title: "Peer Collaboration",
    icon: Users,
    description:
      "We emphasize teamwork and collaboration, mirroring real-world development environments where communication is key.",
    color: "bg-green-500/10 text-green-500",
    details:
      "In the tech industry, collaboration is essential. Our programs teach students how to work effectively in teams, communicate technical concepts, give and receive feedback, and contribute to shared projects. These soft skills are just as important as technical knowledge.",
  },
  {
    id: 3,
    title: "Adaptive Curriculum",
    icon: BookOpen,
    description:
      "Our curriculum adapts to each student's pace and learning style, providing additional challenges or support as needed.",
    color: "bg-purple-500/10 text-purple-500",
    details:
      "We recognize that every student learns differently. Our adaptive approach uses technology and attentive mentorship to identify when a student needs more challenge or additional support. This personalized approach ensures that no student is left behind or held back.",
  },
  {
    id: 4,
    title: "Real-World Applications",
    icon: Laptop,
    description:
      "We connect abstract concepts to real-world applications, showing students how their skills can solve actual problems.",
    color: "bg-orange-500/10 text-orange-500",
    details:
      "Students are most engaged when they understand why what they're learning matters. We regularly bring in industry professionals to discuss how concepts are applied in their work, and design projects around real-world problems that students care about solving.",
  },
]

export function InteractiveCards() {
  const [activeCard, setActiveCard] = useState(null)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: card.id * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 h-full ${activeCard === card.id ? "shadow-lg" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground mb-4">{card.description}</p>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeCard === card.id ? "auto" : 0,
                      opacity: activeCard === card.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm border-t pt-4 mt-2">{card.details}</p>
                  </motion.div>

                  <p className="text-sm text-primary mt-2">
                    {activeCard === card.id ? "Click to collapse" : "Click to learn more"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

