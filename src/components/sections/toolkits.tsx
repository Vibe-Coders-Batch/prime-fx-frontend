"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

import Image from "next/image"

function ToolkitItem({ title, headline, description, index, imageSrc, imageAlt }: { title: string, headline: string, description: string, index: number, imageSrc: string, imageAlt: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const isEven = index % 2 === 0

    return (
        <div ref={ref} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 py-12 ${isEven ? "" : "md:flex-row-reverse"}`}>
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-primary-gold mb-2">
                    <span className="text-sm font-bold tracking-widest uppercase">{title}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">{headline}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
                <Button variant="outline" className="border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-dark">
                    Learn More
                </Button>
            </div>
            <div className="flex-1 relative aspect-video bg-card/50 rounded-xl overflow-hidden border border-border group">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isEven ? "from-blue-900/10 to-background" : "from-emerald-900/10 to-background"} z-0`} />
                
                <motion.div 
                    style={{ y }}
                    className="absolute inset-0 w-full h-full p-8 flex items-center justify-center z-10"
                >
                     <div className="relative w-full h-full">
                        <Image 
                            src={imageSrc} 
                            alt={imageAlt} 
                            fill 
                            className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                     </div>
                </motion.div>
            </div>
        </div>
    )
}

export function Toolkits() {
  return (
    <section id="toolkits" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Professional Toolkits</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Equip yourself with the same tools used by institutional desks.
                </p>
            </div>

            <div className="space-y-24">
                <ToolkitItem 
                    index={0}
                    title="Risk Calculator"
                    headline="Never Over-Leverage Again."
                    description="Our dynamic position size calculator adjusts to live market volatility and your account balance instantly."
                    imageSrc="/illustrations/risk_calculator.svg"
                    imageAlt="Risk Calculator Illustration"
                />
                <ToolkitItem 
                    index={1}
                    title="Trade Journal"
                    headline="The Professional's Edge."
                    description="Track your psychological state, entry/exit logic, and performance metrics. The only way to improve is to measure."
                    imageSrc="/illustrations/analytics_setup.svg"
                    imageAlt="Trade Journal Illustration"
                />
            </div>
        </div>
    </section>
  )
}
