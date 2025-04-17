"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Puzzle, ChevronRight, Code, Laptop, GraduationCap, Lightbulb, Users } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { forwardRef, useState } from "react"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import Image from "next/image"
import Link from "next/link"

interface ProgramFeature {
  title: string;
  icon: React.FC<{ size?: number }>;
  description: string;
  image: string;
  link: string;
}

const programs: ProgramFeature[] = [
  {
    title: "CS Education",
    icon: Laptop,
    description: "We lead various workshops at Camp Harbor View, teaching students web development, Python, Scratch, and more!",
    image: "/programs/CHV.jpeg",
    link: "/programs/#cs-education"
  },
  {
    title: "Northeastern Workshops",
    icon: Code,
    description: "We run specialized workshops at Northeastern, for Northeastern students, covering essential developer skills including React, Git, and command-line tools.",
    image: "/programs/GM.jpg",
    link: "/programs/#stem-education"
  },
  {
    title: "Hackathons",
    icon: Puzzle,
    description: "We help organize hackathons in collaboration with HackBeanPot and ViTAL, creating opportunities for students to apply their skills to real-world challenges.",
    image: "/programs/VITAL.jpeg",
    link: "/programs/#hackathons"
  },
  {
    title: "STEM Education",
    icon: Lightbulb,
    description: "We partner with Saint Stephens Youth Program to deliver engaging STEM activities that make technical concepts accessible and fun for all students.",
    image: "/programs/SSYP.jpeg",
    link: "/programs/#stem-education"
  },
  {
    title: "Mentorship",
    icon: GraduationCap,
    description: "We provide resume review sessions and presentation practice to help students prepare for technical interviews and professional opportunities.",
    image: "/programs/CHV2.jpeg",
    link: "/programs/#mentorship"
  },
  {
    title: "Engineering Team",
    icon: Users,
    description: "Our student-led engineering team develops and maintains our website and other digital resources, providing hands-on experience in software development.",
    image: "/placeholder/workshop-6.jpg",
    link: "/programs/#engineering-team"
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

        <BentoGrid className="md:auto-rows-[16rem] grid-cols-1 md:grid-cols-4 gap-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            
            // Create more bento-box like layout
            let customClassName = "";
            let initialX = 0;
            let initialY = 0;
            
            // Determine animation direction based on position
            if (index === 0) {
              // First card is large feature card
              customClassName = "md:col-span-2 md:row-span-2";
              initialX = -100;
              initialY = -100;
            } else if (index === 1) {
              // Second card is a vertical rectangle
              customClassName = "md:col-span-1 md:row-span-1";
              initialX = 100;
              initialY = -100;
            } else if (index === 2) {
              // Third card is a vertical rectangle
              customClassName = "md:col-span-1 md:row-span-1";
              initialX = -100;
              initialY = 100;
            } else if (index === 3) {
              // Fourth card spans horizontally (bento style)
              customClassName = "md:col-span-2 md:row-span-2";
              initialX = 100;
              initialY = 100;
            } else if (index === 4) {
              // Fifth card is a square
              customClassName = "md:col-span-1 md:row-span-1";
              initialX = -100;
              initialY = -100;
            } else if (index === 5) {
              // Sixth card is a square
              customClassName = "md:col-span-1 md:row-span-1";
              initialX = 100;
              initialY = -100;
            }
            
            return (
              <BentoCard
                key={program.title}
                name={program.title}
                className={customClassName}
                Icon={Icon}
                description={program.description}
                href={program.link}
                cta="Learn more"
                initialX={initialX}
                initialY={initialY}
                background={
                  <div className="absolute inset-0 h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 z-10" />
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
          <StarBorder className="group" as={Link} href="/programs">
            Explore All Programs{" "}
            <ChevronRight className="ml-2 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" />
          </StarBorder>
        </motion.div>
      </div>
    </section>
  );
});

ProgramsSection.displayName = "ProgramsSection"; 