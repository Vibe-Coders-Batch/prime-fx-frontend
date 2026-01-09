"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const TIERS = [
    {
        name: "Foundations",
        price: "Tier 1",
        description: "For Beginners & Students. Master market literacy, risk management, and trading psychology.",
        features: ["Market Structure Basics", "Risk Management 101", "Platform Mastery", "Daily Market Briefs"]
    },
    {
        name: "Intermediate",
        price: "Tier 2",
        description: "For Aspirants. Deep dive into volatility cycles, Gold & Macro playbooks, and correlation mapping.",
        features: ["Smart Money Concepts", "Psychology Mastery", "Live Trading Sessions", "Private Discord Access", "1-on-1 Mentorship Call"],
        featured: true
    },
    {
        name: "Pro Labs",
        price: "Tier 3",
        description: "For Professionals. System design, Monte Carlo simulations, and algorithmic edge development.",
        features: ["Proprietary Algorithms", "Funded Account Fast-Track", "Institutional Data Feed", "Lifetime Updates", "In-Person Dubai Seminar"]
    }
]

function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

    function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const xPct = (clientX - left) / width - 0.5
        const yPct = (clientY - top) / height - 0.5
        x.set(xPct)
        y.set(yPct)
        
        // Spotlight logic
        ref.current.style.setProperty("--mouse-x", `${clientX - left}px`)
        ref.current.style.setProperty("--mouse-y", `${clientY - top}px`)
    }

    function onMouseLeave() {
        x.set(0)
        y.set(0)
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"])

    const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ transform, transformStyle: "preserve-3d" }}
            className={`group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-primary-gold/50 ${className}`}
        >
            {/* Spotlight Glow */}
            <div 
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(224, 180, 88, 0.1), transparent 40%)`
                }}
            />
            
            {/* Content */}
            <div style={{ transform: "translateZ(20px)" }} className="h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    )
}

export function Curriculum() {
  return (
    <section id="curriculum" className="py-20 px-6 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Choose Your Path to Mastery.</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    From novice to institutional trader. Select the tier that matches your ambition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TIERS.map((tier, i) => (
                    <TiltCard key={i} className={`min-h-[500px] flex flex-col ${tier.featured ? "border-primary-gold/30 bg-primary-gold/5" : "bg-card/50 border-border"}`}>
                        <div className="flex flex-col h-full">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                                <div className="text-3xl font-bold text-primary-gold">{tier.price}</div>
                                <p className="mt-4 text-base text-muted-foreground leading-relaxed">{tier.description}</p>
                            </div>
                            
                            <ul className="space-y-4 mb-8 flex-grow">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="w-5 h-5 text-primary-gold shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button className={`w-full mt-auto ${tier.featured ? "bg-primary-gold text-primary-dark hover:bg-white hover:text-primary-dark" : "bg-secondary text-secondary-foreground hover:bg-primary-gold hover:text-primary-dark"}`}>
                                Enroll Now
                            </Button>
                        </div>
                    </TiltCard>
                ))}
            </div>
        </div>
    </section>
  )
}
