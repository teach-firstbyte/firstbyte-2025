"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { StarBorder } from "@/components/ui/star-border"
import { CodeAnimation } from "@/components/code-animation"
import { forwardRef } from "react"

export const AboutSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section ref={ref} id="about" className="py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Simple Line Grid Background */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: `
              repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(180, 180, 180, 0.2) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(180, 180, 180, 0.2) 40px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
          }}
        />
        
        {/* Animated Green Lines */}
        <div className="absolute inset-0 w-full h-full" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}>
          {/* First Line - Horizontal */}
          <div 
            className="absolute h-[1px] bg-green-400 opacity-70"
            style={{
              width: '280px',
              left: 'calc(120px - 1px)',
              bottom: 'calc(200px - 1px)',
              boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
              animation: 'traceGridLine1 8s infinite',
              transformOrigin: 'left center'
            }}
          />
          
          {/* Second Line - Horizontal */}
          <div 
            className="absolute h-[1px] bg-green-400 opacity-70"
            style={{
              width: '320px',
              right: 'calc(160px - 1px)',
              bottom: 'calc(280px - 1px)',
              boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
              animation: 'traceGridLine2 9s infinite',
              animationDelay: '2s',
              transformOrigin: 'left center'
            }}
          />
          
          {/* Third Line - Vertical */}
          <div 
            className="absolute w-[1px] bg-green-400 opacity-70"
            style={{
              height: '320px',
              right: 'calc(240px - 1px)',
              bottom: 'calc(40px - 1px)',
              boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
              animation: 'traceGridLine3 10s infinite',
              animationDelay: '1s',
              transformOrigin: 'bottom center'
            }}
          />
          
          {/* Fourth Line - Horizontal shorter */}
          <div 
            className="absolute h-[1px] bg-green-400 opacity-70"
            style={{
              width: '200px',
              left: 'calc(40px - 1px)',
              bottom: 'calc(120px - 1px)',
              boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
              animation: 'traceGridLine1 7s infinite',
              animationDelay: '3s',
              transformOrigin: 'left center'
            }}
          />
          
          {/* Fifth Line - Vertical */}
          <div 
            className="absolute w-[1px] bg-green-400 opacity-70"
            style={{
              height: '240px',
              left: 'calc(200px - 1px)',
              bottom: 'calc(80px - 1px)',
              boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
              animation: 'traceGridLine3 9s infinite',
              animationDelay: '2.5s',
              transformOrigin: 'bottom center'
            }}
          />
          
          {/* Sixth Line - L shape */}
          <div className="absolute" style={{ left: 'calc(280px - 1px)', bottom: 'calc(240px - 1px)' }}>
            {/* Horizontal part of L */}
            <div 
              className="absolute h-[1px] bg-green-400 opacity-70"
              style={{
                width: '160px',
                boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
                animation: 'traceGridLineHorizontal 8s infinite',
                animationDelay: '4s',
                transformOrigin: 'left center'
              }}
            />
            {/* Vertical part of L */}
            <div 
              className="absolute w-[1px] bg-green-400 opacity-70"
              style={{
                height: '160px',
                left: 'calc(160px - 1px)',
                boxShadow: '0 0 6px 1px rgba(74, 222, 128, 0.7)',
                animation: 'traceGridLineVertical 8s infinite',
                animationDelay: '6.5s',
                transformOrigin: 'top center'
              }}
            />
          </div>
          
          <style jsx>{`
            @keyframes traceGridLine1 {
              0% {
                transform: scaleX(0);
                opacity: 0;
              }
              5% {
                opacity: 0.7;
              }
              20% {
                transform: scaleX(1);
              }
              30%, 100% {
                transform: translateX(120%) scaleX(0);
                opacity: 0;
              }
            }
            
            @keyframes traceGridLine2 {
              0% {
                transform: scaleX(0);
                opacity: 0;
              }
              5% {
                opacity: 0.7;
              }
              25% {
                transform: scaleX(1);
              }
              40%, 100% {
                transform: translateX(100%) scaleX(0);
                opacity: 0;
              }
            }
            
            @keyframes traceGridLine3 {
              0% {
                transform: scaleY(0);
                opacity: 0;
              }
              5% {
                opacity: 0.7;
              }
              25% {
                transform: scaleY(1);
              }
              40%, 100% {
                transform: translateY(-100%) scaleY(0);
                opacity: 0;
              }
            }
            
            @keyframes traceGridLineHorizontal {
              0% {
                transform: scaleX(0);
                opacity: 0;
              }
              10% {
                opacity: 0.7;
                transform: scaleX(1);
              }
              25%, 100% {
                opacity: 0;
              }
            }
            
            @keyframes traceGridLineVertical {
              0% {
                transform: scaleY(0);
                opacity: 0;
              }
              5% {
                opacity: 0.7;
              }
              25% {
                transform: scaleY(1);
              }
              40%, 100% {
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>

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
            FirstByte was founded with a simple mission: to make computer science and STEM education accessible to all
            students, regardless of their background.
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
            <p className="mb-6 text-muted-foreground relative z-10">
              Our founders, a group of passionate educators and tech professionals, came together to create engaging,
              hands-on learning experiences that make these subjects approachable and exciting.
            </p>
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