"use client"

import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, Code } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { Highlighter } from "@/components/ui/highlighter"
import { Particles } from "@/hooks/use-mouse-position"
import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// Dynamically import ThreeModel with ssr disabled
const ThreeModel = dynamic(() => import('@/components/three-model').then(mod => mod.ThreeModel), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="p-6 text-center bg-background/80 rounded-lg">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">FirstByte</h3>
        <p className="text-sm text-muted-foreground">Loading model...</p>
      </div>
    </div>
  )
})

// Custom GreenLamp component
const GreenLampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-visible w-full",
        className
      )}
    >
      {/* Background lamp effect (lower z-index) */}
      <div className="absolute -translate-y-[-5rem] -translate-x-16 inset-0 flex w-full items-center justify-center isolate z-0">
        {isDarkMode ? (
          <>
            <motion.div
              initial={{ opacity: 0.3, width: "5rem" }}
              whileInView={{ opacity: 0.6, width: "26rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-[30rem] overflow-visible w-[26rem] bg-gradient-conic from-green-800 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0.3, width: "5rem" }}
              whileInView={{ opacity: 0.6, width: "26rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-[30rem] w-[26rem] bg-gradient-conic from-transparent via-transparent to-green-800 text-white [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            </motion.div>
            <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl"></div>
            <div className="absolute top-1/2 z-0 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
            <div className="absolute inset-auto z-0 h-36 w-[28rem] -translate-y-[15rem] rounded-full bg-green-600 opacity-30 blur-3xl"></div>
            <motion.div
              initial={{ width: "5rem" }}
              whileInView={{ width: "26rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-auto z-0 h-28 w-64 -translate-y-[15rem] rounded-full bg-green-700 opacity-30 blur-2xl"
            ></motion.div>
            <motion.div
              initial={{ width: "6rem" }}
              whileInView={{ width: "26rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-auto z-0 h-0.5 w-[26rem] -translate-y-[15rem] bg-green-400 opacity-70"
            >
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0.3, width: "5rem" }}
            whileInView={{ opacity: 0.8, width: "26rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-auto h-0.5 w-[26rem] -translate-y-[15rem] bg-green-800"
          />
        )}
      </div>

      {/* Content (higher z-index) */}
      <div className="relative z-50 w-full">
        {children}
      </div>
    </div>
  );
};

interface HeroSectionProps {
  mousePosition: { x: number; y: number } | null;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ mousePosition }, ref) => {
    // Client-side only rendering for the interactive parts
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    return (
      <section ref={ref} id="home" className="min-h-[100vh] w-full relative pt-36 md:pt-44 pb-32">
        {/* Background particles - only render on client */}
        {isClient && (
          <Particles
            className="absolute inset-0 z-0"
            quantity={120}
            color={mousePosition ? "#0a8a3a" : "#1a8a3a"}
            staticity={30}
          />
        )}

        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full items-center mt-16 md:mt-20">
            {/* Left side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="z-20 relative"
            >
              <div className="max-w-2xl">
                <GreenLampContainer className="mb-0">
                  <div className="text-left">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                      FirstByte
                    </h1>
                    <p className="text-xl md:text-2xl my-6 text-muted-foreground leading-relaxed">
                      Empowering the next generation through CS & STEM education
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <StarBorder className="group text-sm">
                        Join Us{" "}
                        <ChevronRight className="ml-2 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" />
                      </StarBorder>
                      <StarBorder as="div" className="border border-primary/20 bg-background hover:bg-muted/50 text-sm">
                        Learn More
                      </StarBorder>
                    </div>
                  </div>
                </GreenLampContainer>
              </div>
            </motion.div>

            {/* Right side - 3D Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[350px] md:h-[450px] lg:h-[500px] z-30 relative mt-6 lg:mt-8"
            >
              <div className="h-full w-full overflow-hidden bg-transparent">
                <div className="w-full h-full relative z-30">
                  {isClient && <ThreeModel />}
                </div>
                
                {/* Fallback content */}
                {!isClient && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 text-center bg-background/80 rounded-lg">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">FirstByte</h3>
                      <p className="text-sm text-muted-foreground">Empowering the next generation</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
            <ChevronDown className="mx-auto h-6 w-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>
    )
  }
) 