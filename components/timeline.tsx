"use client"

import { motion } from "framer-motion"

const timelineItems = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "FirstByte was founded by a group of tech professionals and educators committed to making CS education accessible to all students.",
  },
  {
    year: "2019",
    title: "First Workshop",
    description:
      "We held our first coding workshop with 25 students from underserved communities, teaching the basics of web development.",
  },
  {
    year: "2020",
    title: "Going Virtual",
    description:
      "In response to the pandemic, we transitioned to virtual learning, reaching students across the country for the first time.",
  },
  {
    year: "2021",
    title: "Curriculum Expansion",
    description:
      "We expanded our curriculum to include AI, machine learning, and robotics, providing more advanced options for returning students.",
  },
  {
    year: "2022",
    title: "Corporate Partnerships",
    description:
      "We formed partnerships with major tech companies to provide mentorship, internships, and funding for our programs.",
  },
  {
    year: "2023",
    title: "National Recognition",
    description:
      "FirstByte received national recognition for our impact on increasing diversity in computer science education.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    description:
      "We launched our first international programs, bringing FirstByte's curriculum to students in underserved communities worldwide.",
  },
]

export function Timeline() {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted-foreground/20" />

      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={item.year}
            className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"} md:justify-between`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />

            {/* Content for left side (even index) */}
            <div className={`w-5/12 md:w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "hidden md:block"}`}>
              {index % 2 === 0 && (
                <>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </>
              )}
              {index % 2 === 0 && <div className="mt-2 text-sm font-semibold text-primary">{item.year}</div>}
            </div>

            {/* Content for right side (odd index) */}
            <div className={`w-5/12 md:w-5/12 ${index % 2 === 1 ? "pl-8 text-left" : "hidden md:block"}`}>
              {index % 2 === 1 && <div className="mb-2 text-sm font-semibold text-primary">{item.year}</div>}
              {index % 2 === 1 && (
                <>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </>
              )}
            </div>

            {/* Mobile view (single column) */}
            <div className={`md:hidden w-5/6 ${index % 2 === 0 ? "hidden" : "pl-8"}`}>
              {index % 2 === 1 && (
                <>
                  <div className="mb-2 text-sm font-semibold text-primary">{item.year}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

