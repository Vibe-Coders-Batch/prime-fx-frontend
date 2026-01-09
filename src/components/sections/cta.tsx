"use client"

import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-8 tracking-tight">
                Ready to Institutionalize Your Trading?
            </h2>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-8 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                Join PRIME E-LEARNING & TRAINING Now
            </Button>
        </div>
    </section>
  )
}
