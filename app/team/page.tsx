"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TeamMember {
  name: string
  role: string
  image?: string
  bio?: string
  linkedin?: string
  twitter?: string
  github?: string
  year?: string
  board?: string
}

const allTeamMembers: TeamMember[] = [
  // Current Executive Board - 2024
  {
    name: "Jane Smith",
    role: "President",
    image: "/team/jane-smith.jpg",
    bio: "Jane is passionate about making coding education accessible to all. She has been with FirstByte since its founding.",
    linkedin: "https://linkedin.com/in/jane-smith",
    twitter: "https://twitter.com/janesmith",
    year: "2024",
    board: "Executive"
  },
  {
    name: "John Doe",
    role: "Vice President",
    image: "/team/john-doe.jpg",
    bio: "John oversees curriculum development and volunteer coordination at FirstByte.",
    linkedin: "https://linkedin.com/in/john-doe",
    github: "https://github.com/johndoe",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Emily Johnson",
    role: "Treasurer",
    image: "/team/emily-johnson.jpg",
    bio: "Emily manages FirstByte's finances and helps secure funding for our programs.",
    linkedin: "https://linkedin.com/in/emily-johnson",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Michael Brown",
    role: "Secretary",
    image: "/team/michael-brown.jpg",
    bio: "Michael handles administrative tasks and ensures smooth operations for all FirstByte programs.",
    linkedin: "https://linkedin.com/in/michael-brown",
    github: "https://github.com/michaelbrown",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Tyler Wilson",
    role: "Technical Director",
    image: "/team/tyler-wilson.jpg",
    bio: "Tyler manages our technical infrastructure and develops tools for our coding workshops.",
    linkedin: "https://linkedin.com/in/tyler-wilson",
    github: "https://github.com/tylerwilson",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Olivia Martinez",
    role: "Creative Director",
    image: "/team/olivia-martinez.jpg",
    bio: "Olivia designs educational materials and leads our branding efforts.",
    linkedin: "https://linkedin.com/in/olivia-martinez",
    twitter: "https://twitter.com/oliviamartinez",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Daniel Kim",
    role: "Outreach Coordinator",
    image: "/team/daniel-kim.jpg",
    bio: "Daniel builds relationships with schools and community organizations to expand FirstByte's reach.",
    linkedin: "https://linkedin.com/in/daniel-kim",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Sophie Chen",
    role: "Events Manager",
    image: "/team/sophie-chen.jpg",
    bio: "Sophie organizes workshops, hackathons, and other events to bring coding education to more students.",
    linkedin: "https://linkedin.com/in/sophie-chen",
    twitter: "https://twitter.com/sophiechen",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Marcus Johnson",
    role: "Curriculum Lead",
    image: "/team/marcus-johnson.jpg",
    bio: "Marcus develops coding curricula tailored to different age groups and skill levels.",
    linkedin: "https://linkedin.com/in/marcus-johnson",
    github: "https://github.com/marcusjohnson",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Priya Patel",
    role: "Partnerships Director",
    image: "/team/priya-patel.jpg",
    bio: "Priya establishes partnerships with tech companies and educational institutions to support our mission.",
    linkedin: "https://linkedin.com/in/priya-patel",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Jason Rodriguez",
    role: "Technology Lead",
    image: "/team/jason-rodriguez.jpg",
    bio: "Jason oversees our technology stack and ensures our teaching tools are effective and reliable.",
    linkedin: "https://linkedin.com/in/jason-rodriguez",
    github: "https://github.com/jasonrodriguez",
    year: "2024",
    board: "Executive"
  },
  {
    name: "Leila Nguyen",
    role: "Community Manager",
    image: "/team/leila-nguyen.jpg",
    bio: "Leila builds and nurtures our community of students, volunteers, and supporters.",
    linkedin: "https://linkedin.com/in/leila-nguyen",
    twitter: "https://twitter.com/leilanguyen",
    year: "2024",
    board: "Executive"
  },
  
  // Founding Executive Board - 2023
  {
    name: "Sarah Wilson",
    role: "Founding President",
    image: "/team/sarah-wilson.jpg",
    bio: "Sarah founded FirstByte with a vision to make coding accessible to all young learners.",
    linkedin: "https://linkedin.com/in/sarah-wilson",
    twitter: "https://twitter.com/sarahwilson",
    year: "2023",
    board: "Founding Executive"
  },
  {
    name: "David Lee",
    role: "Founding Vice President",
    image: "/team/david-lee.jpg",
    bio: "David helped establish FirstByte's core programs and operational structure.",
    linkedin: "https://linkedin.com/in/david-lee",
    github: "https://github.com/davidlee",
    year: "2023",
    board: "Founding Executive"
  },
  {
    name: "Alex Taylor",
    role: "Founding Treasurer",
    image: "/team/alex-taylor.jpg",
    bio: "Alex set up FirstByte's financial systems and secured our initial funding.",
    linkedin: "https://linkedin.com/in/alex-taylor",
    year: "2023",
    board: "Founding Executive"
  },
  {
    name: "Rachel Chen",
    role: "Founding Secretary",
    image: "/team/rachel-chen.jpg",
    bio: "Rachel established FirstByte's administrative processes and documentation systems.",
    linkedin: "https://linkedin.com/in/rachel-chen",
    github: "https://github.com/rachelchen",
    year: "2023",
    board: "Founding Executive"
  },
  {
    name: "James Park",
    role: "Founding Technical Director",
    image: "/team/james-park.jpg",
    bio: "James created FirstByte's initial technical curriculum and teaching methodology.",
    linkedin: "https://linkedin.com/in/james-park",
    github: "https://github.com/jamespark",
    year: "2023",
    board: "Founding Executive"
  },
  {
    name: "Zoe Adams",
    role: "Founding Outreach Coordinator",
    image: "/team/zoe-adams.jpg",
    bio: "Zoe built the first partnerships with schools and community organizations.",
    linkedin: "https://linkedin.com/in/zoe-adams",
    twitter: "https://twitter.com/zoeadams",
    year: "2023",
    board: "Founding Executive"
  },
  
  // Add volunteers, advisors, and other team members as needed
]

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [filterBoard, setFilterBoard] = useState<string>("all")
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(allTeamMembers)
  
  // Get unique years and boards for filter options
  const years = ["all", ...new Set(allTeamMembers.map(member => member.year).filter(Boolean) as string[])]
  const boards = ["all", ...new Set(allTeamMembers.map(member => member.board).filter(Boolean) as string[])]
  
  // Apply filters and search
  useEffect(() => {
    let results = allTeamMembers
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(member => 
        member.name.toLowerCase().includes(query) || 
        member.role.toLowerCase().includes(query) ||
        (member.bio && member.bio.toLowerCase().includes(query))
      )
    }
    
    if (filterYear !== "all") {
      results = results.filter(member => member.year === filterYear)
    }
    
    if (filterBoard !== "all") {
      results = results.filter(member => member.board === filterBoard)
    }
    
    setFilteredMembers(results)
  }, [searchQuery, filterYear, filterBoard])
  
  const clearFilters = () => {
    setSearchQuery("")
    setFilterYear("all")
    setFilterBoard("all")
  }
  
  const hasActiveFilters = searchQuery || filterYear !== "all" || filterBoard !== "all"

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/#team" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">Team Directory</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Meet all the talented individuals who contribute to FirstByte's mission of bringing coding education to young learners everywhere.
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or bio"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 sm:w-auto">
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterBoard} onValueChange={setFilterBoard}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map(board => (
                  <SelectItem key={board} value={board}>
                    {board === "all" ? "All Boards" : board}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
          </p>
          
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {/* Team members grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.19, 1, 0.22, 1]
                }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex p-6 gap-4">
                      <Avatar className="h-16 w-16 rounded-full border-2 border-primary/10">
                        {member.image ? (
                          <AvatarImage src={member.image} alt={member.name} />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-muted-foreground">{member.role}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {member.year && (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                              {member.year}
                            </span>
                          )}
                          {member.board && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-1 text-xs font-medium">
                              {member.board}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="flex-1 pb-6">
                      {member.bio && (
                        <p className="text-sm text-muted-foreground">{member.bio}</p>
                      )}
                      
                      <div className="flex mt-4 gap-2">
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {member.twitter && (
                          <a 
                            href={member.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {member.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No team members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 