import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-primary-dark border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="space-y-3 sm:space-y-4 col-span-2 sm:col-span-2 md:col-span-1">
          <Link href="/" aria-label="PRIME E-Learning & Training - Home">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              PRIME{" "}
              <span className="text-primary-gold">E-LEARNING & TRAINING</span>
            </h2>
          </Link>
          <p className="text-white/60 text-xs sm:text-sm">
            Dubai&apos;s Premier Financial Trading Academy. Master the markets
            with institutional-grade education.
          </p>
          <address className="text-white/50 text-xs not-italic">
            <p>Dubai, United Arab Emirates</p>
            <p>
              <a
                href="mailto:info@paet.ltd"
                className="hover:text-primary-gold transition-colors"
              >
                info@paet.ltd
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Academy navigation">
          <h3 className="font-semibold text-white mb-4">Academy</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link
                href="#curriculum"
                className="hover:text-primary-gold transition-colors"
              >
                Curriculum
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="hover:text-primary-gold transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/learner/courses"
                className="hover:text-primary-gold transition-colors"
              >
                Browse Courses
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="hover:text-primary-gold transition-colors"
              >
                Join Academy
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Resources navigation">
          <h3 className="font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link
                href="#toolkits"
                className="hover:text-primary-gold transition-colors"
              >
                Trading Tools
              </Link>
            </li>
            <li>
              <Link
                href="#markets"
                className="hover:text-primary-gold transition-colors"
              >
                Live Ecosystem
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-primary-gold transition-colors"
              >
                Student Login
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal navigation">
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-primary-gold transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-primary-gold transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/risk-disclosure"
                className="hover:text-primary-gold transition-colors"
              >
                Risk Disclosure
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {currentYear} PRIME E-LEARNING & TRAINING. All rights reserved.
          </p>
          <nav aria-label="Social media links">
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="https://twitter.com/primetraining"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-primary-gold transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/prime-elearning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-primary-gold transition-colors"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/primeelearning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-primary-gold transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
