"use client"

import { motion } from "framer-motion"

const VALUES = [
    {
        title: "Accessibility",
        description: "We design learning with no prerequisites—so anyone can begin anytime."
    },
    {
        title: "Empowerment",
        description: "We help learners build confidence, skills, and new professional pathways."
    },
    {
        title: "Inclusivity",
        description: "We welcome people from all social, educational, and cultural backgrounds."
    },
    {
        title: "Integrity",
        description: "We provide honest, practical knowledge without exaggerated promises."
    },
    {
        title: "Innovation",
        description: "We use technology to simplify learning and remove barriers, not complicate them."
    },
    {
        title: "Lifelong Learning",
        description: "We encourage continual personal and professional growth."
    }
]

export function About() {
  return (
    <section className="py-16 bg-background relative overflow-hidden" id="about">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* About Us Header & Content */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6"
                >
                    About PRIME E-LEARNING & TRAINING
                </motion.h2>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6 text-muted-foreground text-lg leading-relaxed"
                >
                    <p>
                        PRIME E-LEARNING & TRAINING is a next-generation, online-only EdTech platform built to democratize access to high-quality learning. We believe that education should not be restricted by formal qualifications, expensive institutions, or rigid systems. Our mission is to empower individuals from all backgrounds—including those who may have missed opportunities earlier in life—to build meaningful skills, explore new career paths, and transform their future.
                    </p>
                    <p>
                        Our platform offers practical, industry-aligned training modules that require no prior academic prerequisites. Whether you are starting a second career, upgrading your financial literacy, or seeking to understand modern digital industries, PRIME E-LEARNING & TRAINING makes learning accessible, flexible, and affordable. We are committed to enabling millions of learners worldwide with tools that strengthen confidence, capability, and career growth.
                    </p>
                </motion.div>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-24">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-colors duration-300"
                >
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        To make high-quality education accessible to everyone—regardless of background, academic history, or financial limitations—by providing practical, outcome-driven online learning that empowers real career transformation.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border/50 rounded-2xl p-8 hover:border-blue-500/50 transition-colors duration-300"
                >
                    <h3 className="text-2xl font-bold mb-4 text-foreground">Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        To become a global catalyst for second-career success by building an inclusive, technology-driven learning ecosystem that unlocks opportunities for millions of aspiring learners.
                    </p>
                </motion.div>
            </div>

            {/* Values */}
            <div>
                <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold text-center mb-12"
                >
                    Our Core Values
                </motion.h3>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {VALUES.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card hover:border-primary/20 transition-all duration-300"
                        >
                            <h4 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h4>
                            <p className="text-muted-foreground text-sm">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    </section>
  )
}
