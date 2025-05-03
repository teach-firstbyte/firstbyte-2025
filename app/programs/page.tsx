"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, Search, X, Calendar, Users, Clock, MapPin, Laptop, Lightbulb, Code, Puzzle, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Program {
  id: string;
  title: string;
  icon: string;
  description: string;
  image: string;
  longDescription?: string;
  details?: {
    duration?: string;
    ageRange?: string;
    capacity?: string;
    location?: string;
    schedule?: string;
  };
  tags?: string[];
  category?: string;
}

// Program data expanded from the programs section
const programsData: Program[] = [
  {
    id: "cs-education",
    title: "CS Education",
    icon: "Laptop",
    description: "We lead various workshops with organizations like Camp Harbor View, teaching students computer science fundamentals like web development, Python, Scratch, and more!",
    image: "/programs/CHV.jpeg",
    longDescription: "Our comprehensive computer science education program introduces students to the fundamentals of computer science. Exploring programming and computational thinking through fun hands-on projects and interactive lessons. Our curriculum, spanning web development, robotics, and artificial intelligence is designed to be accessible to both beginners and those with prior experience.",
    details: {
      duration: "10 weeks",
      ageRange: "12-18 years",
      capacity: "25 students per class",
      location: "Partner schools and community centers",
      schedule: "Monthly"
    },
    tags: ["Programming", "Web Development", "Robotics"],
    category: "Core Program"
  },
  {
    id: "northeastern-workshops",
    title: "Northeastern Workshops",
    icon: "Code",
    description: "We run specialized workshops at Northeastern, for Northeastern students, covering essential developer skills such as React, Git, and command-line tools.",
    image: "/programs/GM.jpg",
    longDescription: "Our on-campus workshops, led by Northeastern students and taught to Northeastern students, provide in-depth lessons that build skills in software development through hands-on experience with industry-standard tools. Our experienced team seeks to share their knowledge and experience with with the greater Northeastern community through workshops like how to build your own full stack web app!",
    details: {
      duration: "Single-day to weekend workshops",
      ageRange: "17-23 years",
      capacity: "20 students per workshop",
      location: "On campus with online offerings available",
      schedule: "Monthly"
    },
    tags: ["Career Development", "React", "Git"],
    category: "Workshop"
  },
  {
    id: "hackathons",
    title: "Hackathons",
    icon: "Puzzle",
    description: "We help organize hackathons in collaboration with student organizations like HackBeanPot and ViTAL, creating opportunities for students to apply their skills to real-world challenges.",
    image: "/programs/VITAL.jpeg",
    longDescription: "In partnership with on-campus organizations like HackBeanPot and ViTAL, our team helps design and run immersive hackathon experiences that bring together students from all disciplines. We coordinate with partner organizations to host hackathon events from networking to technical workshops—most recently hosting a frontend development session for ViTAL using Vite, React, Supabase, and Node.js. Throughout each event, we provide hands-on mentorship, project-structure best practices, and peer learning opportunities, empowering participants to prototype innovative solutions to pressing real-world problems.",
    details: {
      duration: "Single-day to weekend workshops",
      ageRange: "All ages",
      capacity: "Unlimited",
      location: "Virtual and in-person community spaces",
      schedule: "Regular meetups and continuous online engagement"
    },
    tags: ["Networking", "Peer Learning", "Mentorship", "Collaboration"],
    category: "Community"
  },
  {
    id: "stem-education",
    title: "STEM Education",
    icon: "Lightbulb",
    description: "We partner with organizations like Saint Stephens Youth Program to deliver engaging STEM activities that make technical concepts accessible and fun for all students.",
    image: "/programs/SSYP.jpeg",
    longDescription: "Our STEM workshops offer immersive, hands-on experiences across science, technology, engineering, and mathematics. Each workshop focuses on a specific topic, from robotics and electronics to 3D modeling and environmental science. Students engage in collaborative projects that demonstrate real-world applications of STEM concepts, fostering curiosity and creativity while building technical skills.",
    details: {
      duration: "10 weeks",
      ageRange: "12-18 years",
      capacity: "15 students per class",
      location: "Partner schools and community centers",
      schedule: "Daily sessions during summer; weekend options during school year"
    },
    tags: ["Project-Based Learning", "Game Development", "Web Apps", "Mobile Apps"],
    category: "Core Program"
  },
  {
    id: "mentorship",
    title: "Mentorship",
    icon: "GraduationCap",
    description: "We provide resume review sessions and presentation practice to help students prepare for technical interviews and professional opportunities.",
    image: "/programs/CHV2.jpeg",
    longDescription: "Our mentorship program connects students with technology professionals who provide personalized guidance and career insights. Through regular one-on-one meetings and small group sessions, mentors help students explore tech pathways, develop professional skills, and navigate educational choices. This program bridges the gap between academic learning and industry realities, helping students build confidence and clarity about their future in technology.",
    details: {
      duration: "3-6 months per mentorship cycle",
      ageRange: "14-18 years",
      capacity: "Limited by mentor availability",
      location: "Virtual meetings with occasional in-person events",
      schedule: "Bi-weekly mentor sessions with monthly group events"
    },
    tags: ["Career Development", "Professional Skills", "Industry Insights", "Networking"],
    category: "Support"
  },
  {
    id: "engineering-team",
    title: "Engineering Team",
    icon: "Users",
    description: "Our student-led engineering team develops and maintains our website and other digital resources, providing hands-on experience in software development.",
    image: "/programs/ENGINEERING.png",
    longDescription: "Our innovation challenges bring students together to tackle real-world problems using technology and creative thinking. These competitive events combine technical skill application with design thinking methodologies. Working in teams, participants go through the entire process of identifying problems, ideating solutions, and building functional prototypes. These challenges culminate in presentations to panels of industry experts, with recognition for outstanding projects.",
    details: {
      duration: "1-day sprints to 6-week challenges",
      ageRange: "18-21 years",
      capacity: "Teams of 5-6 students",
      location: "Online and in-person collaboration",
      schedule: "Quarterly challenges with annual showcase"
    },
    tags: ["Problem Solving", "Teamwork", "Design Thinking", "Prototyping"],
    category: "Competition"
  }
];

// Get all unique categories and tags for filtering
const allCategories = ["All", ...new Set(programsData.map(program => program.category || "Uncategorized"))];
const allTags = [...new Set(programsData.flatMap(program => program.tags || []))].sort();

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(programsData)
  const [activeView, setActiveView] = useState<string>("grid")
  
  // Apply filters and search
  useEffect(() => {
    let results = programsData
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(program => 
        program.title.toLowerCase().includes(query) || 
        program.description.toLowerCase().includes(query) ||
        (program.longDescription && program.longDescription.toLowerCase().includes(query)) ||
        (program.tags && program.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }
    
    if (filterCategory !== "All") {
      results = results.filter(program => program.category === filterCategory)
    }
    
    if (filterTags.length > 0) {
      results = results.filter(program => {
        // Ensure program.tags exists and is an array before checking includes
        return Array.isArray(program.tags) && 
               program.tags.length > 0 && 
               filterTags.every(tag => program.tags!.includes(tag));
      })
    }
    
    setFilteredPrograms(results)
  }, [searchQuery, filterCategory, filterTags])
  
  const clearFilters = () => {
    setSearchQuery("")
    setFilterCategory("All")
    setFilterTags([])
  }
  
  const hasActiveFilters = searchQuery || filterCategory !== "All" || filterTags.length > 0

  const toggleTag = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/#programs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to homepage
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore our comprehensive range of programs designed to inspire, educate, and empower the next generation of technology creators and innovators.
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs"
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
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
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
        
        {/* Tags filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={filterTags.includes(tag) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                filterTags.includes(tag) 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-primary/10"
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {filterTags.includes(tag) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
        
        {/* Programs display */}
        {filteredPrograms.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'} found
              </p>
              
              <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="h-8">
                  <TabsTrigger value="grid" className="h-7 px-3">Grid</TabsTrigger>
                  <TabsTrigger value="list" className="h-7 px-3">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {activeView === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                  >
                    <Card className="h-full overflow-hidden flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={program.image} 
                          alt={program.title}
                          className="object-cover transition-transform hover:scale-105 absolute inset-0 w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4">
                          <Badge className="mb-2">{program.category}</Badge>
                          <h3 className="text-xl font-bold text-white">{program.title}</h3>
                        </div>
                      </div>
                      <CardContent className="flex-1 pt-6">
                        <p className="text-muted-foreground mb-4">{program.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {program.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(program.tags?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(program.tags?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                        {program.details && (
                          <div className="space-y-2 text-sm">
                            {program.details.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{program.details.duration}</span>
                              </div>
                            )}
                            {program.details.ageRange && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{program.details.ageRange}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t">
                        <Button variant="secondary" className="w-full" asChild>
                          <Link href={`#${program.id}`}>
                            Learn more
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                  >
                    <Card className="overflow-hidden">
                      <div className="md:flex">
                        <div className="relative w-full md:w-48 h-40 md:h-auto overflow-hidden">
                          <img 
                            src={program.image} 
                            alt={program.title}
                            className="object-cover absolute inset-0 w-full h-full"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <div>
                              <Badge className="mb-2">{program.category}</Badge>
                              <h3 className="text-xl font-bold">{program.title}</h3>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`#${program.id}`}>
                                  Learn more
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{program.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {program.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No programs match your search criteria.</p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
        
        {/* Detailed program sections (hidden initially, shown when clicking Learn More) */}
        <div className="mt-16 space-y-20">
          {programsData.map(program => (
            <div id={program.id} key={`detail-${program.id}`} className="scroll-mt-24">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="object-cover absolute inset-0 w-full h-full"
                  />
                </div>
                <div>
                  <Badge className="mb-2">{program.category}</Badge>
                  <h2 className="text-3xl font-bold mb-4">{program.title}</h2>
                  <p className="text-lg mb-6">{program.longDescription}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {program.details?.duration && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{program.details.duration}</p>
                        </div>
                      </div>
                    )}
                    
                    {program.details?.ageRange && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Age Range</p>
                          <p className="font-medium">{program.details.ageRange}</p>
                        </div>
                      </div>
                    )}
                    
                    {program.details?.capacity && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="font-medium">{program.details.capacity}</p>
                        </div>
                      </div>
                    )}
                    
                    {program.details?.location && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{program.details.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {program.details?.schedule && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Schedule</p>
                          <p className="font-medium">{program.details.schedule}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {program.tags?.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="lg" className="mb-2">Apply Now</Button>
                  <p className="text-xs text-muted-foreground">Applications open for upcoming sessions</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 