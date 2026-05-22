// Timeline / Journey Page

import React from "react";
import { Code, GraduationCap, Briefcase, Award, Star, Terminal, Rocket, Heart, BookOpen, Users, Globe, Zap } from "lucide-react";

// Define types for timeline entries
interface TimelineEntry {
  title: string;
  timeRange: string;
  description: string;
  techTags?: string[];
  icon?: React.ReactNode;
  isMindset?: boolean;
}

interface TimelinePhase {
  name: string;
  entries: TimelineEntry[];
}

// Icon mapping for different types of entries
const getEntryIcon = (title: string, isMindset?: boolean) => {
  if (isMindset) return <Zap className="w-5 h-5 text-accent-orange" />;
  
  const titleLower = title.toLowerCase();
  if (titleLower.includes("housing") || titleLower.includes("automation") || titleLower.includes("pipeline")) {
    return <Terminal className="w-5 h-5 text-accent-purple" />;
  }
  if (titleLower.includes("graduated") || titleLower.includes("bsc") || titleLower.includes("delft")) {
    return <GraduationCap className="w-5 h-5 text-accent-orange" />;
  }
  if (titleLower.includes("freelance") || titleLower.includes("tech lead") || titleLower.includes("builder")) {
    return <Briefcase className="w-5 h-5 text-accent-pink" />;
  }
  if (titleLower.includes("hackathon")) {
    return <Rocket className="w-5 h-5 text-accent-purple" />;
  }
  if (titleLower.includes("dofe") || titleLower.includes("duke") || titleLower.includes("jamboree") || titleLower.includes("scout")) {
    return <Award className="w-5 h-5 text-accent-orange" />;
  }
  if (titleLower.includes("oxfam") || titleLower.includes("volunteer")) {
    return <Heart className="w-5 h-5 text-accent-pink" />;
  }
  if (titleLower.includes("swift") || titleLower.includes("apple")) {
    return <BookOpen className="w-5 h-5 text-accent-purple" />;
  }
  if (titleLower.includes("startlab") || titleLower.includes("incubator")) {
    return <Star className="w-5 h-5 text-accent-orange" />;
  }
  if (titleLower.includes("maxxed") || titleLower.includes("personal site") || titleLower.includes("website")) {
    return <Globe className="w-5 h-5 text-accent-pink" />;
  }
  if (titleLower.includes("archive")) {
    return <Users className="w-5 h-5 text-accent-purple" />;
  }
  return <Code className="w-5 h-5 text-accent-orange" />;
};

// Timeline data - organized by phases
const timelineData: TimelinePhase[] = [
  {
    name: "THE FOUNDATION",
    entries: [
      {
        title: "Started coding at 14",
        timeRange: "2020",
        description: "Taught myself web development with a clear goal: if I'm going to start a company, I won't need to hire what I can build myself.",
        isMindset: true,
      },
      {
        title: "Duke of Edinburgh Bronze",
        timeRange: "2021-2022",
        description: "First DofE level completed. Multi-day expedition, fully self-sufficient.",
      },
      {
        title: "Oxfam Fair Trade Volunteer",
        timeRange: "2021",
        description: "Started at 15. Grew from shop assistant to running full shifts solo and managing social media.",
      },
      {
        title: "Duke of Edinburgh Silver",
        timeRange: "2022-2023",
        description: "Completed the second level of the award programme.",
      },
      {
        title: "Apple Swift Internship, Liverpool University",
        timeRange: "Summer 2023",
        description: "Summer programme learning iOS development with Swift and Apple's App Builder.",
        techTags: ["Swift", "iOS"],
      },
    ],
  },
  {
    name: "THE ACCELERATION",
    entries: [
      {
        title: "Graduated a year early via Examencommissie",
        timeRange: "2023-2024",
        description: "Discovered you could bypass the final year by sitting a full exam series. Sat them in parallel with 5th year and graduated in Economics & Mathematics.",
        isMindset: true,
      },
      {
        title: "Youngest ever at StartLab.Brussels",
        timeRange: "Jan-Jun 2025",
        description: "Accepted at 17 into Brussels' leading startup incubator (VUB & ULB backed). Ran 30+ qualitative interviews across hospitals, care homes and patient associations. Found a real niche. Had the discipline to walk away.",
        isMindset: true,
      },
      {
        title: "Freelance web development",
        timeRange: "Early 2025",
        description: "Built for clients on the side while running market research.",
      },
      {
        title: "Kent International Jamboree",
        timeRange: "Aug 2025",
        description: "Adult volunteer and patrol leader. Mentored scout groups, handled camp logistics, ran social media.",
      },
      {
        title: "Duke of Edinburgh Gold",
        timeRange: "2025",
        description: "Highest level of the award. All three levels complete.",
      },
    ],
  },
  {
    name: "THE BUILDER",
    entries: [
      {
        title: "BSc Computer Science & Engineering @ TU Delft",
        timeRange: "Sep 2025-present",
        description: "Next to all my projects I managed to maintain good grades, currently a GPA of 8.0.",
        isMindset: true,
      },
      {
        title: "maxxed-out.me",
        timeRange: "Late 2025",
        description: "Full-stack personal site with a self-built CMS, custom bucket storage and payment integrations.",
        techTags: ["Next.js", "PostgreSQL", "TypeScript"],
      },
      {
        title: "Housing pipeline automation",
        timeRange: "Late 2025",
        description: "Automated Facebook scraper feeding an AI evaluation pipeline that filters listings by suitability and sends results to WhatsApp. Separate analysis layer monitors which groups have the best conversion rate.",
        techTags: ["Python", "n8n", "Agentic AI"],
      },
      {
        title: "Tech Lead, BSO Digital Archive",
        timeRange: "Sep 2025-present",
        description: "Lead developer building the digital archive system for British Scouting Overseas. Coordinating requirements, researching tech stack, building solo.",
        isMindset: true,
      },
      {
        title: "Big Berlin Hackathon",
        timeRange: "2025/2026",
        description: "Built a real-time agentic fact-checking system with tool-calling and STT/TTS via LiveKit.",
        techTags: ["LiveKit", "Agentic AI", "TypeScript"],
      },
      {
        title: "ProcessX x AISO Hackathon",
        timeRange: "2025",
        description: "Finalist (4th place). Built an automated restaurant manager system under competition conditions.",
        techTags: ["Agentic AI", "TypeScript"],
      },
    ],
  },
  {
    name: "WHAT'S NEXT",
    entries: [
      {
        title: "Voice-first, agentic systems",
        timeRange: "",
        description: "Building the next generation of voice-first, agentic systems with vast, knowledge base & context aggregation.",
        isMindset: false,
      },
    ],
  },
];

// Phase divider component - pill-shaped label on the center line
function PhaseDivider({ name }: { name: string }) {
  return (
    <div className="relative flex justify-center py-12">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-orange/30 to-transparent" />
      </div>
      <span className="relative z-10 px-8 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-accent-purple to-accent-orange shadow-lg shadow-accent-orange/20 select-none border border-accent-orange/30">
        {name}
      </span>
    </div>
  );
}

// Timeline entry card component
function TimelineCard({
  entry,
  position,
}: {
  entry: TimelineEntry;
  position: "left" | "right";
}) {
  const isNextPhase = entry.title === "Voice-first, agentic systems";
  const icon = entry.icon || getEntryIcon(entry.title, entry.isMindset);

  // For "What's Next" section, use special styling matching ConnectSection
  if (isNextPhase) {
    return (
      <div className="relative w-full max-w-2xl mx-auto group">
        {/* Background Glow - matching ConnectSection */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-orange/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Connector line to center */}
        <div className="absolute top-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-accent-orange/40 to-transparent -translate-x-1/2" />
        
        <div className="relative bg-card border border-border-subtle p-8 rounded-2xl backdrop-blur-sm hover:border-accent-purple/30 transition-colors">
          {/* Header: Icon, Title and Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-xl font-bold text-text-primary">
                {entry.title}
              </h3>
            </div>
            {/* Pulsing In Progress Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-accent-orange bg-accent-orange/10 border border-accent-orange/20">
              In Progress
            </span>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            {entry.description}
          </p>
        </div>
      </div>
    );
  }

  // Regular timeline card (left or right positioned)
  return (
    <div className={`relative w-full md:w-1/2 ${position === "left" ? "md:pr-12" : "md:pl-12"}`}>
      {/* Connector line from card to center */}
      <div className="absolute top-10 hidden md:block">
        {/* Horizontal line from card to center */}
        <div className={`h-0.5 bg-gradient-to-r from-transparent via-accent-orange/40 to-transparent ${position === "left" ? "right-0" : "left-0"} w-16`} />
      </div>

      <div className="relative group">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-orange/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative bg-card border border-border-subtle p-6 rounded-xl backdrop-blur-sm hover:border-accent-purple/30 transition-colors">
          {/* Header: Icon, Title and Time Range */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-lg font-bold text-text-primary">
                {entry.title}
              </h3>
            </div>
            {/* Time range badge */}
            {entry.timeRange && (
              <span className="px-3 py-1 rounded-full text-xs font-medium text-accent-orange bg-accent-orange/10 border border-accent-orange/20">
                {entry.timeRange}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            {entry.description}
          </p>

          {/* Tech Tags - only if present */}
          {entry.techTags && entry.techTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.techTags.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-md bg-white/5 text-accent-pink border border-accent-pink/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main timeline component
function Timeline() {
  return (
    <div className="relative bg-main py-20 md:py-24 min-h-screen">
      <div className="container mx-auto px-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink">Journey</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From self-taught coder to builder. The timeline of my growth as a developer, founder, and problem-solver.
          </p>
        </div>

        {/* Timeline content wrapper */}
        <div className="relative h-full">
          {/* Central timeline line - hidden on mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-orange/30 via-accent-purple/20 to-accent-pink/30 hidden md:block -translate-x-1/2" />

          {/* Timeline content */}
          <div className="relative space-y-12">
            {timelineData.map((phase, phaseIndex) => (
              <React.Fragment key={phase.name}>
                {/* Phase divider */}
                <PhaseDivider name={phase.name} />

                {/* Phase entries */}
                <div className="space-y-8">
                  {phase.entries.map((entry, entryIndex) => {
                    const isNextPhase = phase.name === "WHAT'S NEXT";

                    if (isNextPhase) {
                      return (
                        <div key={entry.title} className="flex justify-center">
                          <TimelineCard entry={entry} position="left" />
                        </div>
                      );
                    }

                    // Alternate left/right for other phases
                    const position = entryIndex % 2 === 0 ? "left" : "right";

                    return (
                      <div key={entry.title} className="flex">
                        {position === "left" && (
                          <div className="hidden md:block md:w-1/2" />
                        )}
                        <TimelineCard entry={entry} position={position} />
                        {position === "right" && (
                          <div className="hidden md:block md:w-1/2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-32" />
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return <Timeline />;
}
