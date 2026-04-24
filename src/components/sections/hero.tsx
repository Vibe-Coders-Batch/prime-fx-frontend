"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export function Hero() {
    const headlineWords = "Unlock Skills That Drive Your Future".split(" ");
    return (<section className="relative h-[100dvh] min-h-[560px] overflow-hidden bg-background" aria-label="Hero section - Prime Learning">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" aria-hidden="true"/>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center grayscale" role="img" aria-label="Online learning background"/>
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" aria-hidden="true"/>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16 sm:pt-20">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-primary-gold">
          PRIME LEARNING
        </motion.p>

        <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter text-center flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 max-w-6xl">
          {headlineWords.map((word, i) => (<motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{
                delay: 0.15 + i * 0.06,
                duration: 0.6,
                ease: "easeOut",
            }}>
              {["Skills", "Future"].includes(word) ? (<span className="text-primary-gold">{word}</span>) : (word)}
            </motion.span>))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl text-center leading-relaxed">
          Learn Smarter. Grow Faster. Lead With Purpose.
        </motion.p>

        <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0" aria-label="Hero actions">
          <Link href="/learner/courses" aria-label="Explore courses" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary-gold text-primary-dark hover:bg-white text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6 font-bold">
              Explore Courses
            </Button>
          </Link>
          <Link href="#categories" aria-label="Explore categories" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white hover:text-primary-dark text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-4 sm:py-6">
              Explore Categories
            </Button>
          </Link>
        </motion.nav>
      </div>
    </section>);
}
