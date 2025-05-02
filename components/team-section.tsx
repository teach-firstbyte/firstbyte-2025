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
  active: boolean
  name: string
  role: string
  image?: string | null
  circularImage?: string | null
  bio?: string | null
  linkedin?: string | null
  twitter?: string | null
  github?: string | null
  years?: string[] // List of years with FirstByte (e.g. ["2022", "2023", "2024"])
  previousRoles?: { role: string; year: string }[] // Previous roles with years
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
// Get team photos if available
const teamPhotos = teamData.teamPhotos || [];

// Helper function to get the correct role for a specific year
const getRoleForYear = (member: TeamMember, year: string): string => {
  // If we're looking for the current year (2025) role
  if (year === "2025") {
    return member.role;
  }
  
  // If we're looking for a historical role
  const historicalRole = member.previousRoles?.find(role => role.year === year);
  return historicalRole ? historicalRole.role : member.role;
};

// Filter for current executive board (members with 2025 in their years)
const currentExecutiveBoard = allTeamMembers.filter(member => 
  member.active === true
).map(member => ({
  ...member,
  role: getRoleForYear(member, "2025") // Ensure we display the 2025 role
}));

// Filter for founding members (members with 2022 in their years)
const foundingMembers = allTeamMembers.filter(member => 
  member.years?.includes("2022")
).map(member => {
  // For past boards, show the member with their role from that year
  return {
    ...member,
    role: getRoleForYear(member, "2022") // Use the 2022 role specifically
  };
});

// Helper function to create a past board with members showing their roles from that specific year
const createPastBoard = (year: string, title: string, orderArray: string[]): PastBoard => {
  // Get all members who were active in that year and are in the order array
  const membersFromYear = allTeamMembers
    .filter(member => 
      member.years?.includes(year) && 
      orderArray.includes(member.name)
    )
    .map(member => ({
      ...member,
      role: getRoleForYear(member, year)
    }));
  
  return {
    year: `${year}-${Number(year) + 1}`, // Format as academic year
    title: title,
    members: membersFromYear
  };
};

// Define specific order for founding team
const foundingTeamOrder = ["Andy Ge", "Win Tongtawee", "Caleb Lee", "Landyn Sparacino", "Jennifer Esfahany", "Srikar Ananthoju"];
const TeamOrder2024_2025 = ["Landyn Sparacino", "Caleb Lee", "Win Tongtawee", "Cynthia Chen", "Shreyashi Kalakuntla", "Inesh Parikh", "Ireh Hong", "Shreesh Dassarkar", "Anna Higgins", "Alastaire Balin"];

// Create past board entries with custom ordering for founding team
const pastBoards: PastBoard[] = [
  {
    ...createPastBoard("2024", "2024-2025 Leadership", TeamOrder2024_2025),
    members: createPastBoard("2024", "2024-2025 Leadership", TeamOrder2024_2025).members.sort((a, b) => {
      const indexA = TeamOrder2024_2025.indexOf(a.name);
      const indexB = TeamOrder2024_2025.indexOf(b.name);
      return indexA - indexB;
    })
  },
  {
    ...createPastBoard("2022", "Founding Team", foundingTeamOrder),
    members: createPastBoard("2022", "Founding Team", foundingTeamOrder).members.sort((a, b) => {
      const indexA = foundingTeamOrder.indexOf(a.name);
      const indexB = foundingTeamOrder.indexOf(b.name);
      return indexA - indexB;
    })
  }
  // Add more past boards as needed
  // createPastBoard("2023", "2023 Leadership"),
  // createPastBoard("2024", "2024 Leadership"),
]

// Tooltip position interface
interface TooltipPosition {
  x: number;
  y: number;
  width?: number;
}

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

// Reusable BlurTooltip component
interface BlurTooltipProps {
  position: TooltipPosition;
  content: string | React.ReactNode;
  visible: boolean;
  icon?: React.ReactNode;
  id?: string;
}

function BlurTooltip({ position, content, visible, icon, id = "tooltip" }: BlurTooltipProps) {
  return (
    <TooltipPortal>
      <div 
        className="pointer-events-none fixed left-0 top-0 z-[9999]" 
        id="STALKER" 
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div 
          id="STALKER_INNER"
          className="flex items-center space-x-[3px] rounded-xl border border-light/20 bg-dark0/80 p-2 px-3 backdrop-blur-md"
          style={{ 
            filter: visible ? "blur(0px)" : "blur(16px)",
            opacity: visible ? 1 : 0,
            transitionDuration: "1.2s",
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            marginLeft: "-112px" 
          }}
        >
          <span className="text-xs text-white/50">
            {content}
          </span>
          {icon || (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-auto w-4 text-white/50">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          )}
        </div>
      </div>
    </TooltipPortal>
  );
}

// Reusable original style tooltip
interface ClassicTooltipProps {
  position: TooltipPosition;
  title: string;
  subtitle?: string;
  visible: boolean;
  id?: string;
}

function ClassicTooltip({ position, title, subtitle, visible, id = "tooltip" }: ClassicTooltipProps & { socialUrl?: string | null }) {
  return (
    <TooltipPortal>
      <div 
        className="pointer-events-none fixed left-0 top-0 z-[9999]" 
        id={`STALKER-${id}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div 
          className="bg-popover rounded-md shadow-lg px-4 py-2 min-w-[140px] text-center transform -translate-x-1/2"
          style={{ 
            filter: visible ? "blur(0px)" : "blur(16px)",
            opacity: visible ? 1 : 0,
            transitionDuration: "1.2s",
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)"
          }}
        >
          <div className="absolute inset-x-10 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-primary to-transparent h-px" />
          <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-primary/70 to-transparent h-px" />
          <div className="font-bold text-base text-popover-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </TooltipPortal>
  );
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showRoleHistory, setShowRoleHistory] = useState(false)
  
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

  // Create role history display
  const renderRoleHistory = () => {
    if (!member.previousRoles || member.previousRoles.length === 0) return null;
    
    // Sort roles by year (oldest first)
    const sortedRoles = [...member.previousRoles].sort((a, b) => 
      a.year.localeCompare(b.year)
    );
    
    // Group consecutive years with the same role
    const consolidatedRoles: {startYear: string; endYear: string; role: string}[] = [];
    let currentGroup: {startYear: string; endYear: string; role: string} | null = null;
    
    sortedRoles.forEach((roleObj, index) => {
      // If this is a new role or first item
      if (!currentGroup || currentGroup.role !== roleObj.role) {
        // Add previous group if exists
        if (currentGroup) {
          consolidatedRoles.push(currentGroup);
        }
        
        // Start new group
        currentGroup = {
          startYear: roleObj.year,
          endYear: roleObj.year,
          role: roleObj.role
        };
      } else {
        // Continue current group
        currentGroup.endYear = roleObj.year;
      }
      
      // If this is the last item, add the current group
      if (index === sortedRoles.length - 1 && currentGroup) {
        consolidatedRoles.push(currentGroup);
      }
    });
    
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showRoleHistory ? 1 : 0,
          height: showRoleHistory ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-3 pt-3 border-t border-border">
          <h4 className="text-xs font-medium mb-1 text-muted-foreground">Previous Roles:</h4>
          <ul className="space-y-1">
            {consolidatedRoles.map((roleGroup, idx) => (
              <li key={idx} className="text-xs flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/70 mr-1.5" />
                <span>{roleGroup.role}</span>
                <span className="ml-1 text-muted-foreground">
                  {roleGroup.startYear === roleGroup.endYear 
                    ? `(${roleGroup.startYear})` 
                    : `(${roleGroup.startYear} - ${roleGroup.endYear})`
                  }
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
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
  
  // Determine if the member has role history
  const hasRoleHistory = member.previousRoles && member.previousRoles.length > 0;
  
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
          <div className="flex items-start justify-between">
            <div className="min-h-[40px] flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">{member.role}</p>
            </div>
            {hasRoleHistory && (
              <button 
                onClick={() => setShowRoleHistory(!showRoleHistory)}
                className="text-xs text-primary flex items-center ml-2 hover:underline"
              >
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform", 
                  showRoleHistory ? "rotate-180" : ""
                )} />
              </button>
            )}
          </div>
          {renderYearBadges()}
          {renderRoleHistory()}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Get team photo for a specific year if available
const getTeamPhotoForYear = (year: string): { image: string, description: string } | null => {
  const photo = teamPhotos.find(p => p.year === year);
  return photo || null;
};

function CardStack({ board, index }: { board: PastBoard; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [focusedMember, setFocusedMember] = useState<number | null>(null)
  const [hoveredMemberIndex, setHoveredMemberIndex] = useState<number | null>(null)
  const [tooltipRect, setTooltipRect] = useState<TooltipPosition | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Social media hover states - change to store just the URL
  const [hoveredSocialUrl, setHoveredSocialUrl] = useState<string | null>(null)
  
  // Visibility states for animations
  const [memberTooltipVisible, setMemberTooltipVisible] = useState(false)
  
  // Refs to track tooltip cleanup timers
  const memberTooltipTimer = React.useRef<NodeJS.Timeout | null>(null)
  
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
  
  // Handle mouse enter on member card
  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    
    // Clear any pending timeout for member tooltip cleanup
    if (memberTooltipTimer.current) {
      clearTimeout(memberTooltipTimer.current);
      memberTooltipTimer.current = null;
    }
    
    // Set position directly from cursor position
    setTooltipRect({
      x: event.clientX,
      y: event.clientY
    });
    
    // Reset any social URL
    setHoveredSocialUrl(null);
    
    // Set the hovered member index and make tooltip visible
    setHoveredMemberIndex(index);
    setMemberTooltipVisible(true);
  };
  
  // Handle mouse leave from member card
  const handleMouseLeave = () => {
    // Reset any social URL
    setHoveredSocialUrl(null);
    setMemberTooltipVisible(false);
    
    // Schedule cleanup after animation completes
    memberTooltipTimer.current = setTimeout(() => {
      if (!memberTooltipVisible) {
        setHoveredMemberIndex(null);
      }
      memberTooltipTimer.current = null;
    }, 1200); // Match exit animation duration
  };
  
  // Handle social icon hover
  const handleSocialHover = (
    type: 'linkedin' | 'github' | 'twitter',
    url: string, 
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Set the social URL to show
    setHoveredSocialUrl(url);
    
    // Prevent parent tooltip from showing
    event.stopPropagation();
  };
  
  // Handle mouse leave from social icon
  const handleSocialLeave = () => {
    setHoveredSocialUrl(null);
  };
  
  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (memberTooltipTimer.current) {
        clearTimeout(memberTooltipTimer.current);
      }
    };
  }, []);
  
  // Format board members for AnimatedTooltip
  const tooltipMembers = board.members.map((member, idx) => ({
    id: idx,
    name: member.name,
    designation: member.role,
    image: member.circularImage || member.image || "/placeholder.svg"
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
  
  // Handle mouse move to update tooltip position
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hoveredMemberIndex === null) return;
    
    setTooltipRect({
      x: event.clientX,
      y: event.clientY
    });
  };
  
  // New helper function to display role history for focused member
  const renderFocusedMemberRoleHistory = (member: TeamMember) => {
    if (!member.previousRoles || member.previousRoles.length === 0) return null;
    
    // IMPORTANT: When showing the member details, we need the original complete member data
    // Find the original member data from allTeamMembers to ensure we show accurate roles
    const originalMember = allTeamMembers.find(m => m.name === member.name) || member;
    
    // Create a comprehensive role history by year
    // First, gather all years the member has been active
    const activeYears = originalMember.years || [];
    
    // Get the current board year to highlight
    const boardYear = board.year.split('-')[0];
    
    // Check if this member is active in the current year (2025)
    const isActiveCurrently = activeYears.includes("2025");
    const mostRecentYear = activeYears.length > 0 ? [...activeYears].sort((a, b) => b.localeCompare(a))[0] : "";
    
    // Make sure we get the correct roles for the display
    const boardYearRole = getRoleForYear(originalMember, boardYear);
    const currentRole = originalMember.role; // Always use the full role for current year
    
    // Manually create the timeline for better control
    const roleTimeline: {year: string; role: string; isCurrent: boolean; isHighlighted: boolean; isLastRole: boolean}[] = [];
    
    // Add previous roles from the member's history
    if (originalMember.previousRoles) {
      // Sort to ensure chronological order
      const sortedPreviousRoles = [...originalMember.previousRoles].sort((a, b) => 
        a.year.localeCompare(b.year)
      );
      
      // Create a timeline entry for each previous role
      sortedPreviousRoles.forEach(prevRole => {
        // Check if this is their last/final role (most recent year if not active in 2025)
        const isLastRole = !isActiveCurrently && prevRole.year === mostRecentYear;
        
        roleTimeline.push({
          year: prevRole.year,
          role: prevRole.role,
          isCurrent: false, // Never mark past roles as "current"
          isHighlighted: prevRole.year === boardYear,
          isLastRole: isLastRole // Flag for final role
        });
      });
    }
    
    // Add the current role specifically only if the member is active in 2025
    if (isActiveCurrently && mostRecentYear === "2025") {
      roleTimeline.push({
        year: "2025",
        role: currentRole,
        isCurrent: true,
        isHighlighted: boardYear === "2025",
        isLastRole: false // Not needed since isCurrent already marks this
      });
    }
    
    // Sort the complete timeline chronologically
    const sortedTimeline = roleTimeline.sort((a, b) => a.year.localeCompare(b.year));
    
    // Now group consecutive years with the same role for display
    const consolidatedRoles: {startYear: string; endYear: string; role: string; isCurrent: boolean; isHighlighted: boolean; isLastRole: boolean}[] = [];
    let currentGroup: {startYear: string; endYear: string; role: string; isCurrent: boolean; isHighlighted: boolean; isLastRole: boolean} | null = null;
    
    sortedTimeline.forEach((item, index) => {
      // Start a new group if: 
      // - this is the first item
      // - the role is different from the current group
      // - this item needs special styling (highlighted, current, or last role)
      const isSpecialItem = item.isHighlighted || item.isCurrent || item.isLastRole;
      
      if (!currentGroup || currentGroup.role !== item.role || isSpecialItem) {
        // Add previous group if exists
        if (currentGroup) {
          consolidatedRoles.push(currentGroup);
        }
        
        // Start new group
        currentGroup = {
          startYear: item.year,
          endYear: item.year,
          role: item.role,
          isCurrent: item.isCurrent,
          isHighlighted: item.isHighlighted,
          isLastRole: item.isLastRole
        };
      } else {
        // Continue current group for non-special items with same role
        currentGroup.endYear = item.year;
      }
      
      // If this is the last item, add the current group
      if (index === sortedTimeline.length - 1 && currentGroup) {
        consolidatedRoles.push(currentGroup);
      }
    });
    
    return (
      <div className="mt-4 pt-3 border-t border-border/30">
        <h4 className="text-sm font-medium mb-2 text-foreground flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
          Role Progression:
        </h4>
        <div className="relative pl-6 pt-1">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gradient-to-b from-muted-foreground/30 to-primary" />
          
          {/* Display consolidated roles in chronological order */}
          {consolidatedRoles.map((item, idx) => (
            <div key={idx} className="mb-3 relative">
              <div className={cn(
                "absolute left-[-18px] top-0.5 h-3 w-3 rounded-full ring-2 ring-background",
                item.isHighlighted ? "bg-primary" : // Highlighted year gets primary/green color
                item.isCurrent || item.isLastRole ? "bg-foreground" : // Current role or last role gets black dot
                "bg-muted-foreground" // Past role gets gray dot
              )} />
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm",
                  item.isHighlighted ? "font-semibold text-primary" : // Highlighted year gets primary color
                  (item.isCurrent || item.isLastRole) ? "font-semibold" : "" // Current or last role gets bold
                )}>
                  {item.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.startYear === item.endYear 
                    ? item.startYear // Single year
                    : `${item.startYear} - ${item.endYear}` // Year range
                  }
                  {item.isHighlighted && ' • Currently viewing'}
                  {item.isCurrent && ' • Current'}
                  {item.isLastRole && ' • Final role'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Get team photo if available for this board's year
  const boardYear = board.year.split('-')[0];
  const teamPhoto = getTeamPhotoForYear(boardYear);
  
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
          <ChevronDown className={cn(
            "h-5 w-5 transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )} />
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
                      {/* Team photo if available */}
                      {teamPhoto && focusedMember === null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6"
                        >
                          <div className="relative aspect-video overflow-hidden rounded-lg border mb-2">
                            <img 
                              src={teamPhoto.image} 
                              alt={teamPhoto.description}
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm text-center text-muted-foreground">
                            {teamPhoto.description}
                          </p>
                        </motion.div>
                      )}
                      
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
                                      src={board.members[focusedMember].circularImage || board.members[focusedMember].image} 
                                      alt={board.members[focusedMember].name}
                                      className="object-cover object-center"
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
                                
                                {/* Find the original member data to get the full, accurate bio */}
                                {(() => {
                                  const originalMember = allTeamMembers.find(m => 
                                    m.name === board.members[focusedMember].name
                                  );
                                  return originalMember?.bio ? (
                                    <p className="text-sm mb-4">{originalMember.bio}</p>
                                  ) : board.members[focusedMember].bio ? (
                                    <p className="text-sm mb-4">{board.members[focusedMember].bio}</p>
                                  ) : null;
                                })()}
                                
                                {renderFocusedMemberRoleHistory(board.members[focusedMember])}
                                
                                <div className="flex gap-2 mt-3">
                                  {board.members[focusedMember].linkedin && (
                                    <Link 
                                      href={board.members[focusedMember].linkedin!} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseEnter={(e) => handleSocialHover('linkedin', board.members[focusedMember].linkedin!, e)}
                                      onMouseLeave={handleSocialLeave}
                                    >
                                      <div className="p-1 text-muted-foreground hover:text-primary">
                                        <Linkedin className="h-3 w-3" />
                                      </div>
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
                                    <Link 
                                      href={board.members[focusedMember].github!} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseEnter={(e) => handleSocialHover('github', board.members[focusedMember].github!, e)}
                                      onMouseLeave={handleSocialLeave}
                                    >
                                      <div className="p-1 text-muted-foreground hover:text-primary">
                                        <Github className="h-3 w-3" />
                                      </div>
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
                              onMouseLeave={handleMouseLeave}
                              onMouseMove={handleMouseMove}
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
                                      <AvatarImage src={member.circularImage || member.image} alt={member.name} className="object-cover object-center" />
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
                                        onMouseEnter={(e) => handleSocialHover('linkedin', member.linkedin!, e)}
                                        onMouseLeave={handleSocialLeave}
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
                                        onMouseEnter={(e) => handleSocialHover('github', member.github!, e)}
                                        onMouseLeave={handleSocialLeave}
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
      
      {/* Member tooltip using ClassicTooltip */}
      {hoveredMemberIndex !== null && tooltipRect && isExpanded && (
        <div>
          <ClassicTooltip
            position={tooltipRect}
            title={board.members[hoveredMemberIndex]?.name}
            subtitle={hoveredSocialUrl || board.members[hoveredMemberIndex]?.role}
            visible={memberTooltipVisible}
            id={`member-${hoveredMemberIndex}`}
          />
        </div>
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
            <div className="text-sm text-muted-foreground">2025-2026</div>
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
        {/* <motion.div 
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
        </motion.div> */}
      </div>
    </section>
  )
})

TeamSection.displayName = "TeamSection"; 