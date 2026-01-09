"use client"



const STATS = [
    { label: "Learners", value: "10,000+" },
    { label: "Live Sessions", value: "500+" },
    { label: "Curriculum", value: "Institutional Grade" },
]

const PARTNERS = ["Bloomberg", "TradingView", "MetaTrader 5", "FTMO"]

export function TrustStats() {
  return (
    <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                
                {/* Stats */}
                <div className="flex gap-8 md:gap-12">
                    {STATS.map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Divider (Mobile hidden) */}
                <div className="hidden md:block w-px h-12 bg-border" />

                {/* Partners */}
                <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {PARTNERS.map((partner, i) => (
                        <span key={i} className="text-xl font-bold text-foreground/80">{partner}</span>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}
