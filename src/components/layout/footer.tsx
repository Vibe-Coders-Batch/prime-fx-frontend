import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-primary-dark border-t border-white/10 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">PRIME <span className="text-primary-gold">E-LEARNING & TRAINING</span></h3>
                    <p className="text-white/60 text-sm">
                        Dubai&apos;s Premier Financial Trading Academy.
                        Master the markets with institutional-grade education.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-white mb-4">Academy</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-primary-gold">Curriculum</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Mentorship</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Live Trading</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-primary-gold">Market Analysis</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Risk Calculator</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Trade Journal</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-primary-gold">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-primary-gold">Risk Disclosure</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-sm">
                © {new Date().getFullYear()} PRIME E-LEARNING & TRAINING. All rights reserved.
            </div>
        </footer>
    )
}
