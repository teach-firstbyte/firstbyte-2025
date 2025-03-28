"use client"

import { useState, forwardRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, ChevronDown, Linkedin, Twitter, Github, Clock, ChevronRight } from "lucide-react"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

interface TeamMember {
  name: string
  role: string
  image?: string
  bio?: string
  linkedin?: string
  twitter?: string
  github?: string
}

interface PastBoard {
  year: string
  title: string
  members: TeamMember[]
}

interface TeamSectionProps {
  className?: string
}

// Placeholder data - replace with actual team data
const currentExecutiveBoard: TeamMember[] = [
  {
    name: "Jane Smith",
    role: "President",
    image: "/team/jane-smith.jpg",
    linkedin: "https://linkedin.com/in/jane-smith",
    twitter: "https://twitter.com/janesmith",
  },
  {
    name: "John Doe",
    role: "Vice President",
    image: "/team/john-doe.jpg",
    linkedin: "https://linkedin.com/in/john-doe",
    github: "https://github.com/johndoe",
  },
  {
    name: "Emily Johnson",
    role: "Treasurer",
    image: "/team/emily-johnson.jpg",
    linkedin: "https://linkedin.com/in/emily-johnson",
  },
  {
    name: "Michael Brown",
    role: "Secretary",
    image: "/team/michael-brown.jpg",
    linkedin: "https://linkedin.com/in/michael-brown",
    github: "https://github.com/michaelbrown",
  },
  {
    name: "Tyler Wilson",
    role: "Technical Director",
    image: "/team/tyler-wilson.jpg",
    linkedin: "https://linkedin.com/in/tyler-wilson",
    github: "https://github.com/tylerwilson",
  },
  {
    name: "Olivia Martinez",
    role: "Creative Director",
    image: "/team/olivia-martinez.jpg",
    linkedin: "https://linkedin.com/in/olivia-martinez",
    twitter: "https://twitter.com/oliviamartinez",
  },
  {
    name: "Daniel Kim",
    role: "Outreach Coordinator",
    image: "/team/daniel-kim.jpg",
    linkedin: "https://linkedin.com/in/daniel-kim",
  },
  {
    name: "Sophie Chen",
    role: "Events Manager",
    image: "/team/sophie-chen.jpg",
    linkedin: "https://linkedin.com/in/sophie-chen",
    twitter: "https://twitter.com/sophiechen",
  },
  {
    name: "Marcus Johnson",
    role: "Curriculum Lead",
    image: "/team/marcus-johnson.jpg",
    linkedin: "https://linkedin.com/in/marcus-johnson",
    github: "https://github.com/marcusjohnson",
  },
  {
    name: "Priya Patel",
    role: "Partnerships Director",
    image: "/team/priya-patel.jpg",
    linkedin: "https://linkedin.com/in/priya-patel",
  },
  {
    name: "Jason Rodriguez",
    role: "Technology Lead",
    image: "/team/jason-rodriguez.jpg",
    linkedin: "https://linkedin.com/in/jason-rodriguez",
    github: "https://github.com/jasonrodriguez",
  },
  {
    name: "Leila Nguyen",
    role: "Community Manager",
    image: "/team/leila-nguyen.jpg",
    linkedin: "https://linkedin.com/in/leila-nguyen",
    twitter: "https://twitter.com/leilanguyen",
  },
]

const pastBoards: PastBoard[] = [
  {
    year: "2023",
    title: "Founding Executive Board",
    members: [
      {
        name: "Sarah Wilson",
        role: "Founding President",
        image: "/team/sarah-wilson.jpg",
        linkedin: "https://linkedin.com/in/sarah-wilson",
        twitter: "https://twitter.com/sarahwilson",
      },
      {
        name: "David Lee",
        role: "Founding Vice President",
        image: "/team/david-lee.jpg",
        linkedin: "https://linkedin.com/in/david-lee",
        github: "https://github.com/davidlee",
      },
      {
        name: "Alex Taylor",
        role: "Founding Treasurer",
        image: "/team/alex-taylor.jpg",
        linkedin: "https://linkedin.com/in/alex-taylor",
      },
      {
        name: "Rachel Chen",
        role: "Founding Secretary",
        image: "/team/rachel-chen.jpg",
        linkedin: "https://linkedin.com/in/rachel-chen",
        github: "https://github.com/rachelchen",
      },
      {
        name: "James Park",
        role: "Founding Technical Director",
        image: "/team/james-park.jpg",
        linkedin: "https://linkedin.com/in/james-park",
        github: "https://github.com/jamespark",
      },
      {
        name: "Zoe Adams",
        role: "Founding Outreach Coordinator",
        image: "/team/zoe-adams.jpg",
        linkedin: "https://linkedin.com/in/zoe-adams",
        twitter: "https://twitter.com/zoeadams",
      },
    ]
  }
]

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg border-2 border-transparent group-hover:border-primary/20">
        <div className="aspect-square overflow-hidden relative">
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 transition-opacity duration-300",
              isHovered ? "opacity-100" : ""
            )}
          />
          <Avatar className="h-full w-full rounded-none">
            {member.image ? (
              <AvatarImage src={member.image} alt={member.name} className="object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <AvatarFallback className="h-full w-full rounded-none text-5xl">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300",
            isHovered ? "translate-y-0" : "translate-y-full opacity-0"
          )}>
            <div className="flex gap-2 justify-center">
              {member.linkedin && (
                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/90 text-primary p-2 rounded-full"
                  >
                    <Linkedin className="h-4 w-4" />
                  </motion.div>
                </Link>
              )}
              {member.twitter && (
                <Link href={member.twitter} target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/90 text-primary p-2 rounded-full"
                  >
                    <Twitter className="h-4 w-4" />
                  </motion.div>
                </Link>
              )}
              {member.github && (
                <Link href={member.github} target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/90 text-primary p-2 rounded-full"
                  >
                    <Github className="h-4 w-4" />
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-semibold">{member.name}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-1 pb-4">
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CardStack({ board, index }: { board: PastBoard; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Format board members for AnimatedTooltip
  const tooltipMembers = board.members.map((member, idx) => ({
    id: idx,
    name: member.name,
    designation: member.role,
    image: member.image || ""
  }))
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative"
    >
      <div 
        className={cn(
          "relative transition-all duration-500 ease-out",
          isExpanded ? "mb-8" : "mb-0"
        )}
      >
        {/* Year Badge */}
        <div className="absolute -left-4 -top-4 z-30 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-md">
          {board.year}
        </div>
        
        {/* Card Stack */}
        <div className="relative">
          {/* Stacked background cards for visual effect */}
          {!isExpanded && (
            <>
              <div className="absolute -bottom-2 -right-2 w-full h-full bg-muted/30 rounded-lg rotate-2 shadow-sm"></div>
              <div className="absolute -bottom-1 -left-2 w-full h-full bg-muted/50 rounded-lg -rotate-1 shadow-sm"></div>
            </>
          )}
          
          {/* Main stack card */}
          <Card 
            className={cn(
              "relative z-10 transition-all duration-300 shadow-md border-2 border-transparent hover:border-primary/20",
              isExpanded ? "w-full" : "aspect-square sm:aspect-auto"
            )}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{board.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{board.year}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition-colors"
                >
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isExpanded ? "rotate-180" : ""
                  )} />
                </motion.button>
              </div>
              
              {!isExpanded && (
                <div className="relative mb-4" style={{ zIndex: 40 }}>
                  <AnimatedTooltip items={tooltipMembers} className="mx-auto" />
                </div>
              )}
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {board.members.map((member, i) => (
                        <Card key={i} className="overflow-hidden shadow-sm">
                          <div className="flex items-center p-3 gap-3">
                            <Avatar className="h-12 w-12">
                              {member.image ? (
                                <AvatarImage src={member.image} alt={member.name} />
                              ) : (
                                <AvatarFallback>
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{member.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                            </div>
                            <div className="flex gap-1">
                              {member.linkedin && (
                                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                  <div className="p-1 text-muted-foreground hover:text-primary">
                                    <Linkedin className="h-3 w-3" />
                                  </div>
                                </Link>
                              )}
                              {member.github && (
                                <Link href={member.github} target="_blank" rel="noopener noreferrer">
                                  <div className="p-1 text-muted-foreground hover:text-primary">
                                    <Github className="h-3 w-3" />
                                  </div>
                                </Link>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!isExpanded && (
                <div className="text-xs text-muted-foreground mt-4">
                  <span className="font-medium">{board.members.length} members</span> • Click to expand
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export const TeamSection = forwardRef<HTMLElement, TeamSectionProps>(({ className }, ref) => {
  const [visibleCount, setVisibleCount] = useState(8)
  
  const handleShowMore = () => {
    setVisibleCount(currentExecutiveBoard.length)
  }
  
  const handleShowLess = () => {
    setVisibleCount(8)
  }

  const currentVisible = currentExecutiveBoard.slice(0, visibleCount)

  return (
    <section ref={ref} id="team" className={cn("bg-background text-foreground py-12 sm:py-24 md:py-32 overflow-hidden", className)}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center sm:gap-8 mb-12"
        >
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">Our Team</h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Meet the talented individuals behind FirstByte who make our mission of coding education possible.
          </p>
        </motion.div>

        {/* Current Executive Board */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-end mb-8"
          >
            <h3 className="text-2xl font-semibold">Current Executive Board</h3>
            <div className="text-sm text-muted-foreground">2024-2025</div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {currentVisible.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
          
          {currentExecutiveBoard.length > visibleCount ? (
            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-all"
                onClick={handleShowMore}
              >
                <span>Show All</span>
                <ChevronDown className="h-4 w-4" />
              </motion.button>
            </div>
          ) : currentExecutiveBoard.length > 8 && visibleCount > 8 ? (
            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-all"
                onClick={handleShowLess}
              >
                <span>Show Less</span>
                <ChevronDown className="h-4 w-4 rotate-180" />
              </motion.button>
            </div>
          ) : null}
        </div>

        {/* Past Boards */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-8"
          >
            <div className="h-px flex-grow bg-border"></div>
            <h3 className="text-xl font-semibold px-4">Previous Leadership</h3>
            <div className="h-px flex-grow bg-border"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastBoards.map((board, index) => (
              <CardStack key={board.year} board={board} index={index} />
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-20"
        >
          <Link href="/team">
            <Button size="lg" className="group relative overflow-hidden shadow-md">
              <span className="relative z-10 flex items-center gap-2">
                See Full Team Directory
                <ArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}) 