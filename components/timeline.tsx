"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Flag, LightbulbIcon, Presentation, Trophy } from "lucide-react"

export default function Timeline() {
  const timelineEvents = [
    {
      icon: <Flag className="h-6 w-6 text-primary" />,
      date: "April 15, 2025",
      title: "Registration Opens",
      description: "Sign up and start forming your teams.",
    },
    {
      icon: <LightbulbIcon className="h-6 w-6 text-primary" />,
      date: "April 22, 2025",
      title: "AI Building Guide Sessions",
      description: "Learn how to leverage AI tools in your development workflow.",
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      date: "May 1, 2025",
      title: "Hackathon Kickoff",
      description: "Official start of the coding period. Access to mentors and resources.",
    },
    {
      icon: <Presentation className="h-6 w-6 text-primary" />,
      date: "May 15, 2025",
      title: "Project Submissions Due",
      description: "Submit your projects for judging.",
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      date: "May 20, 2025",
      title: "Winners Announced",
      description: "Celebration and prizes for the top projects.",
    },
  ]

  return (
    <section id="timeline" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Timeline</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Mark your calendar with these important dates for the AI BUIDL Lab hackathon.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-primary/30 transform md:translate-x-[-0.5px] hidden md:block"></div>

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="md:w-1/2 flex justify-center md:justify-end md:pr-8">
                <Card className={`w-full md:max-w-sm border-none shadow-md ${index % 2 === 0 ? "md:ml-8" : "md:mr-8"}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-full bg-primary/10 mr-3">{event.icon}</div>
                      <span className="text-sm font-medium text-primary">{event.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-foreground/70">{event.description}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline dot */}
              <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary border-4 border-background absolute left-1/2 transform -translate-x-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

