"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlayCircle, Users, MessageSquare } from "lucide-react"

export function LiveEcosystem() {
  const [viewers, setViewers] = useState(1200)

  useEffect(() => {
    const sequence = [1200, 1220,1309,1374, 1400, 1200]
    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % sequence.length
      setViewers(sequence[index])
    }, 1500) // Change every 1.5s to complete cycle roughly in 5-6s

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="markets" className="py-16 px-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
            
            {/* Text Content */}
            <div className="flex-1 space-y-8 z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    Interactive <span className="text-primary">Live Learning.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Join daily live sessions with expert mentors. Take real-time mock tests to gauge your market readiness before risking capital.
                </p>
                
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-full bg-primary/10 text-primary"><PlayCircle className="w-5 h-5" /></div>
                        <span>Daily Market Analysis Streams</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-full bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
                        <span>Live Q&A with Mentors</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-full bg-primary/10 text-primary"><MessageSquare className="w-5 h-5" /></div>
                        <span>Community Trade Ideas</span>
                    </li>
                </ul>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                    Join Next Session
                </Button>
            </div>

            {/* Graphic (Flat Cream Card) */}
            <div className="flex-1 relative w-full aspect-square md:aspect-video">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="relative w-full h-full bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                    {/* Live UI Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                            <span className="text-xs font-bold text-destructive uppercase tracking-wider">Live</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">{viewers.toLocaleString()} Viewers</div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 bg-muted rounded-lg mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                             {[40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                                 <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                                    className="w-4 bg-primary rounded-t-sm opacity-80"
                                 />
                             ))}
                        </div>
                    </div>

                    {/* Chat/User Area */}
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-2 w-1/3 bg-muted rounded-full" />
                            <div className="h-2 w-3/4 bg-muted-foreground/50 rounded-full" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
  )
}
