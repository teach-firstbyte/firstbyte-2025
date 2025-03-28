"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Code, Laptop, GraduationCap, Lightbulb, Users } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { forwardRef, useState } from "react"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import Image from "next/image"

interface ProgramFeature {
  title: string;
  icon: React.FC<{ size?: number }>;
  description: string;
  image: string;
}

const programs: ProgramFeature[] = [
  {
    title: "CS Education",
    icon: Laptop,
    description: "We provide accessible computer science education to students of all backgrounds, focusing on practical skills and creative problem-solving.",
    image: "/placeholder/workshop-1.jpg"
  },
  {
    title: "STEM Workshops",
    icon: Lightbulb,
    description: "Our hands-on workshops introduce students to various STEM fields, making complex concepts approachable and engaging through interactive activities.",
    image: "/placeholder/workshop-2.jpg"
  },
  {
    title: "Community Building",
    icon: Users,
    description: "We foster a supportive community where students can collaborate, learn from each other, and grow their technical and soft skills.",
    image: "/placeholder/workshop-3.jpg"
  },
  {
    title: "Coding Camps",
    icon: Code,
    description: "Intensive, project-based learning experiences where students build real applications while learning fundamental programming concepts.",
    image: "/placeholder/workshop-4.jpg"
  },
  {
    title: "Mentorship",
    icon: GraduationCap,
    description: "We connect students with industry professionals who provide guidance, support, and real-world insights into tech careers.",
    image: "/placeholder/workshop-5.jpg"
  },
  {
    title: "Innovation Challenges",
    icon: Lightbulb,
    description: "Competitive events that challenge students to apply their skills to solve real-world problems through technology and teamwork.",
    image: "/placeholder/workshop-6.jpg"
  }
];

export const ProgramsSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="programs" className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our programs are designed to inspire curiosity, build confidence, and develop critical thinking skills
            through hands-on learning experiences.
          </p>
        </motion.div>

        <BentoGrid className="md:auto-rows-[16rem] grid-cols-1 md:grid-cols-3 gap-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            const span = index === 0 ? "md:col-span-2 md:row-span-2" : 
                         index === 1 ? "md:col-span-1 md:row-span-1" : 
                         index === 2 ? "md:col-span-1 md:row-span-1" : "";
            
            return (
              <BentoCard
                key={program.title}
                name={program.title}
                className={span}
                Icon={Icon}
                description={program.description}
                href="#"
                cta="Learn more"
                background={
                  <div className="absolute inset-0 h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10" />
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                }
              />
            );
          })}
        </BentoGrid>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <StarBorder className="group">
            Explore All Programs{" "}
            <ChevronRight className="ml-2 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" />
          </StarBorder>
        </motion.div>
      </div>
    </section>
  );
});

ProgramsSection.displayName = "ProgramsSection"; 