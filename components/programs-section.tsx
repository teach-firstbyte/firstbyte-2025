"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Code, Laptop, GraduationCap, Lightbulb, Users } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { forwardRef, useState } from "react"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { ImageCarousel } from "@/components/ui/image-carousel"
// import { Slideshow } from "@/components/ui/slideshow" // Import the Slideshow component
import Image from "next/image"
import Link from "next/link"

interface ProgramFeature {
  title: string;
  icon: React.FC<{ size?: number }>;
  description: string;
  images: string[];
}

const programs: ProgramFeature[] = [
  {
    title: "CS Education",
    icon: Laptop,
    description: "We provide accessible computer science education to students of all backgrounds, focusing on practical skills and creative problem-solving.",
    images: [
      "/cs-team/CS-workshop-1.jpeg",
      "/cs-team/CS-workshop-2.jpeg",
      "/cs-team/CS-workshop-3.jpeg",
      "/cs-team/CS-workshop-4.jpeg"
    ]
  },
  {
    title: "Professional Development",
    icon: Code,
    description: "Intensive, project-based learning experiences where students build real applications while learning fundamental programming concepts.",
    images: ["/professional-development"]
  },
  {
    title: "STEM Education",
    icon: Lightbulb,
    description: "Our hands-on workshops introduce students to various STEM fields, making complex concepts approachable and engaging through interactive activities.",
    images: [
      "/stem-team/STEM-workshop-1.jpeg", 
      "/stem-team/STEM-workshop-2.jpeg", 
      "/stem-team/STEM-workshop-3.jpeg", 
      "/stem-team/STEM-workshop-4.jpeg"]
  },
  {
    title: "Community Building",
    icon: Users,
    description: "We foster a supportive community where students can collaborate, learn from each other, and grow their technical and soft skills.",
    images: ["/gm-pictures"]
  }
];

export const ProgramsSection = forwardRef<HTMLElement>((props, ref) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Function to determine which component to render based on program title
  const renderBackgroundComponent = (program: ProgramFeature, isHovered: boolean) => {
    // Use ImageCarousel for CS Education and STEM Education
    if ((program.title === "CS Education" || program.title === "STEM Education") && isHovered) {
      return (
        <ImageCarousel
          images={program.images}
          className="absolute inset-0 h-full w-full"
          isHovered={isHovered}
        />
      );
    }
    
    // Use SOME OTHER COMPONENT for Professional Development and Community Building
    else if ((program.title === "Professional Development" || program.title === "Community Building") && isHovered) {
      return (
        <Image
          src={"/professional-development/github.png"}
          alt={"REPLACE THIS"}
          fill
        />
      );
    }
    
    // Default to static image
    else {
      return (
        <Image
          src={program.images[0]}
          alt={program.title}
          fill
          className="object-cover object-center"
        />
      );
    }
  };

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Programs</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer a variety of programs designed to introduce students to computer science and STEM fields.
          </p>
        </div>

        <BentoGrid className="md:auto-rows-[16rem] grid-cols-1 md:grid-cols-4 gap-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            
            let customClassName = "";
            if (index === 0) customClassName = "md:col-span-2 md:row-span-2";
            else if (index === 1) customClassName = "md:col-span-2 md:row-span-1";
            else if (index === 2) customClassName = "md:col-span-2 md:row-span-2";
            else if (index === 3) customClassName = "md:col-span-2 md:row-span-1";
            
            const isHovered = hoveredCard === program.title;
            
            return (
              <BentoCard
                key={program.title}
                name={program.title}
                className={customClassName}
                Icon={Icon}
                description={program.description}
                href="#"
                cta="Learn more"
                onMouseEnter={() => setHoveredCard(program.title)}
                onMouseLeave={() => setHoveredCard(null)}
                background={
                  <div className="absolute inset-0 h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10" />
                    {renderBackgroundComponent(program, isHovered)}
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