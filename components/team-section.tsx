"use client"

import React, { useState, forwardRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, ChevronDown, Linkedin, Twitter, Github, Clock, ChevronRight } from "lucide-react"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import teamData from "@/data/team.json"

interface TeamMember {
  name: string
  role: string
  image?: string
  bio?: string
  linkedin?: string
  twitter?: string
  github?: string
  years?: string[] // List of years with FirstByte (e.g. ["2022", "2023", "2024"])
  previousRoles?: string[] // Optional: previous roles they've held
}

interface PastBoard {
  year: string
  title: string
  members: TeamMember[]
}

interface TeamSectionProps {
  className?: string
}

// Get all team members from the JSON data
const allTeamMembers: TeamMember[] = teamData.allTeamMembers;

// Filter for current executive board (members with 2024 or 2025 in their years)
const currentExecutiveBoard = allTeamMembers.filter(member => 
  member.years?.includes("2025")
);

// Filter for founding members (members with 2022 in their years)
const foundingMembers = allTeamMembers.filter(member => 
  member.years?.includes("2022")
);

const pastBoards: PastBoard[] = [
  {
    year: "2022-2023",
    title: "Founding Team",
    members: foundingMembers
  }
];

// Portal component for tooltips
function TooltipPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  
  // Only render portal content after component is mounted
  // This avoids hydration issues with SSR
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return typeof window !== 'undefined' 
    ? createPortal(children, document.body)
    : null
}

// Define a tooltip position interface
interface TooltipPosition {
  x: number;
  y: number;
  width: number;
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Generate year badges for each year with FirstByte
  const renderYearBadges = () => {
    if (!member.years || member.years.length === 0) return null;
    
    // Sort years in descending order (newest first)
    const sortedYears = [...member.years].sort((a, b) => b.localeCompare(a));
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {sortedYears.map(year => (
          <div 
            key={year}
            className="inline-flex items-center justify-center h-5 px-2 text-xs font-semibold text-white bg-primary rounded-full"
          >
            {year}
          </div>
        ))}
      </div>
    );
  };
  
  // Navigate to profile when clicking on the avatar
  const navigateToProfile = () => {
    // Navigate to member's profile - assuming linkedin as default profile link
    if (member.linkedin) {
      window.open(member.linkedin, '_blank');
    } else if (member.github) {
      window.open(member.github, '_blank');
    } else if (member.twitter) {
      window.open(member.twitter, '_blank');
    }
  };
  
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
          <Avatar 
            className="h-full w-full rounded-none cursor-pointer"
            onClick={navigateToProfile}
          >
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
          {renderYearBadges()}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CardStack({ board, index }: { board: PastBoard; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [focusedMember, setFocusedMember] = useState<number | null>(null)
  const [hoveredMemberIndex, setHoveredMemberIndex] = useState<number | null>(null)
  const [tooltipRect, setTooltipRect] = useState<TooltipPosition | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Framer Motion values for tooltip animation
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };
  
  // Handle mouse enter on member card
  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    
    // Get position values for tooltip
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Set the hovered member index and tooltip position
    setHoveredMemberIndex(index);
    setTooltipRect({
      x: rect.left,
      y: rect.top, 
      width: rect.width
    });
  };
  
  // Format board members for AnimatedTooltip
  const tooltipMembers = board.members.map((member, idx) => ({
    id: idx,
    name: member.name,
    designation: member.role,
    image: member.image || ""
  }))
  
  // Navigate to profile when clicking on social media links
  const navigateToProfile = (member: TeamMember) => {
    if (member.linkedin) {
      window.open(member.linkedin, '_blank');
    } else if (member.github) {
      window.open(member.github, '_blank');
    } else if (member.twitter) {
      window.open(member.twitter, '_blank');
    }
  };

  // Smooth transition from avatar to profile
  const handleAvatarClick = (id: number) => {
    if (isTransitioning) return;
    
    // Mark as transitioning and immediately set both expanded and focused member
    setIsTransitioning(true);
    setHoveredMemberIndex(id);
    setIsExpanded(true);
    setFocusedMember(id);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setHoveredMemberIndex(null);
      setIsTransitioning(false);
    }, 300);
  };
  
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
          <AnimatePresence>
            {!isExpanded && (
              <>
                <motion.div 
                  key="bg-card-1"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-2 -right-2 w-full h-full bg-muted/30 rounded-lg rotate-2 shadow-sm"
                />
                <motion.div
                  key="bg-card-2"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-1 -left-2 w-full h-full bg-muted/50 rounded-lg -rotate-1 shadow-sm"
                />
              </>
            )}
          </AnimatePresence>
          
          {/* Main stack card */}
          <motion.div
            layout
            transition={{ 
              layout: { duration: 0.5, type: "spring" }
            }}
          >
            <Card 
              className={cn(
                "relative z-10 transition-shadow duration-300 shadow-md border-2 border-transparent hover:border-primary/20 cursor-pointer",
                isExpanded ? "w-full" : "aspect-square sm:aspect-auto"
              )}
              onClick={() => !isExpanded && setIsExpanded(true)}
            >
              <motion.div 
                layout
                transition={{ 
                  layout: { duration: 0.5, type: "spring" }
                }}
                className="p-6"
              >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isExpanded) {
                        // First hide the focused member if any
                        setFocusedMember(null);
                        // Then close the card after a short delay
                        setTimeout(() => {
                          setIsExpanded(false);
                        }, 200);
                      } else {
                        setIsExpanded(true);
                      }
                    }}
                    className="bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition-colors"
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isExpanded ? "rotate-180" : ""
                    )} />
                  </motion.button>
                </div>
                
                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="relative mb-4" 
                      style={{ zIndex: 40 }}
                    >
                      <AnimatedTooltip 
                        items={tooltipMembers} 
                        className="mx-auto" 
                        onItemClick={handleAvatarClick}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        opacity: { duration: 0.2 },
                        layout: { duration: 0.3, type: "spring", bounce: 0.1 }
                      }}
                      className="overflow-hidden"
                    >
                      {/* Focused member detail view */}
                      <AnimatePresence mode="wait">
                        {focusedMember !== null && (
                          <motion.div
                            key={`member-${focusedMember}`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ 
                              duration: 0.2,
                              ease: "easeOut"
                            }}
                            className="mb-6 border rounded-lg p-4 bg-muted/10"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusedMember(null);
                              }}
                              className="flex items-center text-sm text-primary mb-4 hover:underline"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                              Back to all members
                            </button>
                            
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                              <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="w-full md:w-1/3 max-w-[200px]"
                              >
                                <Avatar className="h-full w-full aspect-square">
                                  {board.members[focusedMember].image ? (
                                    <AvatarImage 
                                      src={board.members[focusedMember].image} 
                                      alt={board.members[focusedMember].name}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <AvatarFallback className="text-4xl">
                                      {board.members[focusedMember].name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              </motion.div>
                              
                              <motion.div 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1"
                              >
                                <h4 className="text-xl font-semibold">{board.members[focusedMember].name}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{board.members[focusedMember].role}</p>
                                
                                {board.members[focusedMember].bio && (
                                  <p className="text-sm mb-4">{board.members[focusedMember].bio}</p>
                                )}
                                
                                <div className="flex gap-2">
                                  {board.members[focusedMember].linkedin && (
                                    <Link href={board.members[focusedMember].linkedin!} target="_blank" rel="noopener noreferrer">
                                      <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary/10 text-primary p-2 rounded-full"
                                      >
                                        <Linkedin className="h-4 w-4" />
                                      </motion.div>
                                    </Link>
                                  )}
                                  {board.members[focusedMember].twitter && (
                                    <Link href={board.members[focusedMember].twitter!} target="_blank" rel="noopener noreferrer">
                                      <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary/10 text-primary p-2 rounded-full"
                                      >
                                        <Twitter className="h-4 w-4" />
                                      </motion.div>
                                    </Link>
                                  )}
                                  {board.members[focusedMember].github && (
                                    <Link href={board.members[focusedMember].github!} target="_blank" rel="noopener noreferrer">
                                      <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary/10 text-primary p-2 rounded-full"
                                      >
                                        <Github className="h-4 w-4" />
                                      </motion.div>
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Show all members with AnimatedTooltip hover effect */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-3">{board.members.length} Team Members</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {board.members.map((member, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: { 
                                  delay: i * 0.05,
                                  duration: 0.3
                                }
                              }}
                              whileHover={{ 
                                y: -4,
                                transition: { duration: 0.2 }
                              }}
                              className={cn(
                                "transition-opacity duration-200 relative",
                                focusedMember === i ? "opacity-70" : "opacity-100"
                              )}
                              onMouseEnter={(e) => handleMouseEnter(i, e)}
                              onMouseLeave={() => setHoveredMemberIndex(null)}
                            >
                              <Card 
                                className="overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 cursor-pointer transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFocusedMember(i);
                                }}
                              >
                                <div className="flex items-center p-3 gap-3 relative group">
                                  <Avatar 
                                    className="h-12 w-12 hover:scale-110 transition-transform duration-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFocusedMember(i);
                                    }}
                                  >
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
                                      <Link 
                                        href={member.linkedin} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="p-1 text-muted-foreground hover:text-primary">
                                          <Linkedin className="h-3 w-3" />
                                        </div>
                                      </Link>
                                    )}
                                    {member.github && (
                                      <Link 
                                        href={member.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="p-1 text-muted-foreground hover:text-primary">
                                          <Github className="h-3 w-3" />
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isExpanded && (
                  <div className="text-xs text-muted-foreground mt-4">
                    <span className="font-medium">{board.members.length} members</span> • Click to expand
                  </div>
                )}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Render tooltip through portal when hovering */}
      {hoveredMemberIndex !== null && tooltipRect && isExpanded && (
        <TooltipPortal>
          <div 
            className="fixed z-[9999] bg-popover rounded-md shadow-lg px-4 py-2 min-w-[140px] text-center transform -translate-x-1/2"
            style={{
              left: tooltipRect.x + (tooltipRect.width / 2), 
              top: tooltipRect.y - 70,
              pointerEvents: 'none'
            }}
          >
            <div className="absolute inset-x-10 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-primary to-transparent h-px" />
            <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-primary/70 to-transparent h-px" />
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-popover" />
            <div className="font-bold text-base text-popover-foreground">
              {board.members[hoveredMemberIndex]?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {board.members[hoveredMemberIndex]?.role}
            </div>
          </div>
        </TooltipPortal>
      )}
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

TeamSection.displayName = "TeamSection"; 