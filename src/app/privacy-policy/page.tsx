"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  Eye, 
  Lock, 
  Share2, 
  Key, 
  UserCheck, 
  Compass, 
  HelpCircle,
  ArrowUp,
  FileText,
  Clock,
  Briefcase,
  BookOpen,
  ArrowLeft,
  Users,
  Coins,
  Globe,
  Settings,
  ChevronRight,
  Database
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  tldr: string;
}

const SECTIONS: Section[] = [
  {
    id: "about-us",
    title: "1. About Us & This Policy",
    icon: <Shield className="h-4 w-4" />,
    tldr: "Prime Learning is operated by Miyo Global Private Limited. This Policy explains how we handle your data across our edtech platform."
  },
  {
    id: "applicability",
    title: "2. Who This Policy Applies To",
    icon: <Users className="h-4 w-4" />,
    tldr: "Applies to all registered learners, instructors (Learning Partners), content aggregators, guest mentors, university partners, and visitors."
  },
  {
    id: "collection",
    title: "3. Personal Data We Collect",
    icon: <Eye className="h-4 w-4" />,
    tldr: "We collect identity, registration, learning metrics, financial TDS data (for instructors), technical footprints, and audio-visual recordings."
  },
  {
    id: "usage",
    title: "4. How & Why We Use Your Data",
    icon: <BookOpen className="h-4 w-4" />,
    tldr: "Used for account management, course delivery, certificate issuance, learning analytics, revenue share, and statutory compliance. We never sell your data."
  },
  {
    id: "legal-basis",
    title: "5. Legal Basis for Processing",
    icon: <Briefcase className="h-4 w-4" />,
    tldr: "We rely on Consent, Contract Performance, Legal Obligations (like TDS/GST), and Legitimate Interests under the DPDPA, 2023."
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    icon: <Settings className="h-4 w-4" />,
    tldr: "We use essential, functional, analytical, and marketing cookies. You can manage functional and marketing cookie preferences in your browser."
  },
  {
    id: "sharing",
    title: "7. Sharing Your Personal Data",
    icon: <Share2 className="h-4 w-4" />,
    tldr: "Shared securely with instructors (for support), university partners, payment processors, cloud hosts, and tax authorities under strict confidentiality."
  },
  {
    id: "retention",
    title: "8. Data Retention",
    icon: <Database className="h-4 w-4" />,
    tldr: "Stored only as long as necessary. Learner progress is retained for the account duration plus 3 years; tax and transaction history is kept for 8 years."
  },
  {
    id: "rights",
    title: "9. Your Rights Under DPDPA",
    icon: <Key className="h-4 w-4" />,
    tldr: "You hold the right to Access, Correction, Erasure, Consent Withdrawal, Redressal, Nomination, Portability, and Object under Indian law."
  },
  {
    id: "security",
    title: "10. Data Security",
    icon: <Lock className="h-4 w-4" />,
    tldr: "Protected via TLS/SSL, hashing, role-based access, and regular vulnerability audits. We have a robust breach response plan aligned with MeitY."
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    icon: <UserCheck className="h-4 w-4" />,
    tldr: "Intended for adults (18+). We do not knowingly collect minor data without parent/guardian consent in compliance with DPDPA, 2023."
  },
  {
    id: "third-party",
    title: "12. Third-Party Links",
    icon: <Compass className="h-4 w-4" />,
    tldr: "We link to third-party portals (Zoom, Razorpay, etc.). Their data policies govern transactions on their platforms; please read them carefully."
  },
  {
    id: "cross-border",
    title: "13. Cross-Border Transfers",
    icon: <Globe className="h-4 w-4" />,
    tldr: "Primary processing occurs on secure servers in India. Any cross-border data transfer complies with DPDPA, 2023 government mandates."
  },
  {
    id: "changes",
    title: "14. Policy Changes",
    icon: <FileText className="h-4 w-4" />,
    tldr: "We may update this policy periodically. Material changes will be highlighted on the platform and sent via registered email."
  },
  {
    id: "grievance",
    title: "15. Grievance & Contacts",
    icon: <HelpCircle className="h-4 w-4" />,
    tldr: "Dedicated DPO based in Hyderabad. Grievance responses are acknowledged within 72 hours and substantively resolved within 30 days."
  }
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("about-us");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // accounting for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative min-h-screen pb-24 font-sans selection:bg-primary selection:text-background">
      {/* Premium Ambient Lighter Radial Gradients (Sophisticated Glassmorphism Effect) */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-primary/5 blur-[130px]" />
      <div className="pointer-events-none absolute top-[25%] right-12 h-[650px] w-[650px] rounded-full bg-blue-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[15%] left-12 h-[550px] w-[550px] rounded-full bg-primary/5 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Main Header (Hero Glassmorphic Deck) */}
        <header className="relative border-b border-border/40 pb-12 pt-6 md:pb-16 md:pt-10">
          <div className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 w-fit"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back to Home
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary tracking-wide">
                  <Shield className="h-3.5 w-3.5" /> DPDPA, 2023 & IT Act Compliance
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                  Privacy <span className="text-primary font-normal font-display">Policy</span>
                </h1>
              </div>

              {/* Document Metadata Details Card */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground bg-card/50 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-md shadow-black/10">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Version: <strong>1.0 (DPDPA Aligned)</strong></span>
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-4xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              This Privacy Policy is prepared in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, the <strong>Information Technology Act, 2000</strong>, and the <strong>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>. It governs the data processing practices of Miyo Global Private Limited (operating as Prime Learning).
            </p>
          </div>
        </header>

        {/* Corporate Statutory Deck Overview */}
        <section className="mt-8 rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-black/10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-primary mb-4">Statutory & Corporate Disclosures</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Data Controller</span>
              <span className="font-semibold text-foreground">Miyo Global Private Limited</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Corporate ID Number (CIN)</span>
              <span className="font-mono font-semibold text-foreground">U10202TS2026PTC212596</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">Permanent Account Number (PAN)</span>
              <span className="font-mono font-semibold text-foreground">AAUCM6364N</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">DPO Contact</span>
              <span className="font-semibold text-primary hover:underline">
                <a href="mailto:learning@primelearning.ae">learning@primelearning.ae</a>
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/30 text-xs text-muted-foreground leading-relaxed">
            <strong>Registered Office Address:</strong> K.Y.R. Heights, 1st Floor, Plot No. 4338A & 433/B, Vivekananda Nagar, Allapur, Hitech City Road, Kondapur, Serilingampally, Hyderabad – 500084, Telangana, India
          </div>
        </section>

        {/* Mobile dropdown navigation */}
        <div className="sticky top-[72px] z-30 my-8 block lg:hidden">
          <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-md p-3.5 shadow-lg shadow-black/10">
            <label htmlFor="mobile-sec-nav" className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Navigate Document
            </label>
            <select
              id="mobile-sec-nav"
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_3fr] xl:gap-16">
          
          {/* Sticky Sidebar Navigation (Desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Document Index
                </h3>
                <nav className="flex flex-col gap-1.5" aria-label="Privacy policy sections">
                  {SECTIONS.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                          isActive 
                            ? "bg-primary/10 text-primary font-semibold" 
                            : "text-muted-foreground hover:bg-card-light hover:text-foreground"
                        }`}
                      >
                        <span className={`transition-transform duration-200 ${isActive ? "scale-110 text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`}>
                          {sec.icon}
                        </span>
                        <span className="flex-1 truncate">{sec.title}</span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Need help sidebar card */}
              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-6 space-y-3 shadow-md">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Privacy Support
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our compliance officer is available to handle DSAR requests, withdrawals, or verification of credentials under DPDPA.
                </p>
                <a 
                  href="mailto:learning@primelearning.ae" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline hover:text-primary-bright"
                >
                  learning@primelearning.ae &rarr;
                </a>
              </div>
            </div>
          </aside>

          {/* Detailed Policy Document Text Columns */}
          <article className="space-y-16">
            
            {/* Section 1: About Us */}
            <section id="about-us" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">1. About Us & This Policy</h2>
              </div>

              {/* TL;DR Summary Card */}
              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[0].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Prime Learning is the education and training platform operated by <strong>Miyo Global Private Limited</strong> (&apos;we&apos;, &apos;us&apos;, &apos;our&apos;, &apos;Prime Learning&apos;), a company incorporated under the Companies Act, 2013 (CIN: U10202TS2026PTC212596), having its registered office at K.Y.R. Heights, 1st Floor, Plot No. 4338A & 433/B, Vivekananda Nagar, Allapur, Hitech City Road, Kondapur, Serilingampally, Hyderabad - 500084, Telangana, India.
                </p>
                <p>
                  This Privacy Policy (&apos;Policy&apos;) explains how Prime Learning collects, uses, stores, discloses, and protects personal data of all individuals who interact with our platform, website, mobile application, courses, and services (collectively, the &apos;Platform&apos;). It also explains your rights regarding your personal data and how to exercise them under the DPDPA, 2023.
                </p>
                <p>
                  By accessing or using the Prime Learning Platform, registering as a learner, Learning Partner, course provider, guest mentor, or institutional partner, or by otherwise providing your personal data to us, you acknowledge that you have read, understood, and agree to the terms of this Policy. If you do not agree with any part of this Policy, please do not access or use the Prime Learning Platform.
                </p>
              </div>
            </section>

            {/* Section 2: Who This Policy Applies To */}
            <section id="applicability" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">2. Who This Policy Applies To</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[1].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  This Policy applies to all individuals whose personal data we process:
                </p>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4 shadow-inner">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-6 py-4 text-left">User Category</th>
                        <th className="px-6 py-4 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Learners / Students</td>
                        <td className="px-6 py-4 text-muted-foreground">Individuals who register, enrol, access courses, or purchase content on the Platform.</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Learning Partners</td>
                        <td className="px-6 py-4 text-muted-foreground">Trainers and educators who deliver courses on the Platform, whether as individuals or through their companies.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Course Aggregators</td>
                        <td className="px-6 py-4 text-muted-foreground">Individuals or entities who list and host their existing courses on the Platform.</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Guest Mentors</td>
                        <td className="px-6 py-4 text-muted-foreground">Industry professionals who deliver pro bono guest lectures as part of courses.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Institutional Partners</td>
                        <td className="px-6 py-4 text-muted-foreground">Academic institutions and their representatives who partner with Prime Learning.</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Website Visitors</td>
                        <td className="px-6 py-4 text-muted-foreground">Any individual who visits our website or contacts us, even without registering.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Job Applicants</td>
                        <td className="px-6 py-4 text-muted-foreground">Individuals who apply for positions at Prime Learning / Miyo Global Private Limited.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3: What Personal Data We Collect */}
            <section id="collection" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">3. What Personal Data We Collect</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[2].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6">
                <p>
                  We collect personal data in the following categories, depending on the nature of your interaction with us:
                </p>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.1 Identity and Contact Data</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>Full name, date of birth, gender</li>
                      <li>Email address, mobile phone number, postal address</li>
                      <li>Profile photograph (where provided)</li>
                      <li>Professional designation, organisation, and biography (for Learning Partners and Guest Mentors)</li>
                      <li>PAN (Permanent Account Number) for tax and statutory compliance purposes</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.2 Account and Registration Data</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>Username, password (stored in encrypted form), and account preferences</li>
                      <li>Course enrolment history, certificates issued, and completion records</li>
                      <li>Assessment scores, progress data, and learning analytics</li>
                      <li>Communications with Prime Learning through the Platform</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.3 Payment and Financial Data</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>Transaction records, invoice history, and payment confirmations</li>
                      <li>For Learning Partners and Course Aggregators: bank account details, GST number, PAN number, and TDS information — collected solely for revenue share payments and statutory compliance</li>
                    </ul>
                    <div className="mt-2 text-xs border-t border-border/20 pt-2 text-primary font-medium">
                      ⚠️ We do NOT store credit/debit card numbers, CVV codes, or UPI PINs. All payment transactions are processed by PCI-DSS compliant third-party payment gateway partners operating under their own security standards.
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.4 Technical and Usage Data</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>IP address, browser type and version, operating system, device type and identifier</li>
                      <li>Pages visited, time spent on pages, click-stream data, and referral URLs</li>
                      <li>Session data, login timestamps, and Platform feature usage patterns</li>
                      <li>Error logs and crash reports (used solely for Platform diagnostics and improvement)</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.5 Communications Data</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>Email correspondence with Prime Learning and support ticket logs</li>
                      <li>Feedback, ratings, and reviews submitted on the Platform</li>
                      <li>Chat messages or Q&A interactions during live sessions</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.6 Audio-Visual Data (Guest Mentors)</h4>
                    <p className="text-xs text-muted-foreground">
                      Video and audio recordings of guest lecture sessions, collected with express prior written consent as documented in the Guest Mentor Engagement Letter. Used strictly for purposes stated therein.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.7 Data We Do NOT Collect</h4>
                    <p className="text-xs text-muted-foreground">
                      Prime Learning does not intentionally collect or process sensitive categories: caste, religion, political opinion, sexual orientation, biometric data, or health/medical data, unless specifically required by applicable law and with your express, informed consent.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary">3.8 Data Collected From Third Parties</h4>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li>Basic profile information (Google, LinkedIn) if you register or log in using third-party SSO integrations.</li>
                      <li>Publicly available professional info where you are featured as a Learning Partner or Guest Mentor.</li>
                      <li>Transaction status information from payment gateway partners.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: How and Why We Use Your Personal Data */}
            <section id="usage" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">4. How and Why We Use Your Personal Data</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[3].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We use personal data only for specific, defined purposes and not beyond what is described in this document.
                </p>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-4 py-3 text-left">Purpose</th>
                        <th className="px-4 py-3 text-left">Data Categories Used</th>
                        <th className="px-4 py-3 text-left">Applies To</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Account Management</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Identity, contact, account credentials</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">All registered users</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Course & Content Delivery</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Identity, enrolment, progress history</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Learners, Learning Partners</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Processing Payouts & Finance</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Payment, financial details, PAN/GST</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Learners, Learning Partners, Course Aggregators</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Certificate Issuance</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Identity, assessment grades, course logs</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Learners</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Promotions & Marketing</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Contact data, usage settings</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">All users (Opt-out active)</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Co-branded Programmes</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Identity, enrolment, completion results</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">University partners, enrolled students</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Hiring & Careers</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">CV, portfolio, qualifications, identity</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Job applicants</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center text-foreground font-semibold">
                  🛡️ WE DO NOT SELL YOUR PERSONAL DATA.
                  <p className="mt-2 text-sm text-muted-foreground font-normal">
                    Prime Learning does not sell, rent, trade, or commercially exploit your personal data to any third party for their advertising purposes. Your data is not our product.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Legal Basis for Processing */}
            <section id="legal-basis" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">5. Legal Basis for Processing</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[4].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Under the Digital Personal Data Protection Act, 2023, we rely on the following statutory lawful bases to process your personal data:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Consent
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Where you have given clear, informed, and specific consent — for example, for optional marketing, recording Guest Mentor sessions, or non-essential cookie tracking. Consent can be withdrawn easily.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Contract Performance
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Where processing is necessary to deliver our educational services — for example, completing enrolments, rendering video courses, and paying revenue shares to Learning Partners.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Legal Obligation
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Where processing is required to comply with applicable statutory law — for example, TDS deduction and filing, DPDPA disclosures, and responding to valid law enforcement warrants.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-2">
                    <h4 className="text-sm font-bold text-foreground text-primary flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Legitimate Interests
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      For our legitimate operational business security and service enhancement interests, provided they do not override your basic rights (e.g., detecting fraud, preventing DDoS, debugging software).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Cookies and Tracking Technologies */}
            <section id="cookies" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Settings className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">6. Cookies and Tracking Technologies</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[5].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We use cookies, web beacons, pixel tags, and similar tracking technologies on our website and Platform to enhance experience, understand site navigation, and personalize learning:
                </p>

                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-6 py-4 text-left">Cookie Type</th>
                        <th className="px-6 py-4 text-left">Purpose</th>
                        <th className="px-6 py-4 text-left">Opt-Out Available?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Essential Cookies</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Necessary for the Platform to function — login sessions, csrf tokens, secure authorization. Cannot be disabled.</td>
                        <td className="px-6 py-4 text-xs font-bold text-muted-foreground">No (Strictly necessary)</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Functional Cookies</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Remember UI preferences, selected playback speeds, theme parameters, and locale variables.</td>
                        <td className="px-6 py-4 text-xs text-primary font-semibold">Yes — via browser controls</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Analytics Cookies</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Help us audit Platform usage patterns (e.g. Google Analytics). Data is anonymized or aggregated.</td>
                        <td className="px-6 py-4 text-xs text-primary font-semibold">Yes — via browser controls</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Marketing Cookies</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Track campaigns to deliver relevant educational recommendations. Active only with your prior consent.</td>
                        <td className="px-6 py-4 text-xs text-primary font-semibold">Yes — opt out anytime</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Third-party pixels (such as Google Analytics or Facebook Pixel) operate under their own privacy standards. We strongly encourage checking their specific policies.
                </p>
              </div>
            </section>

            {/* Section 7: Sharing Your Personal Data */}
            <section id="sharing" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Share2 className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">7. Sharing Your Personal Data</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[6].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We share your personal data only where necessary and only with third parties bound by absolute confidentiality and data protection obligations:
                </p>

                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-4 py-3 text-left">Recipient</th>
                        <th className="px-4 py-3 text-left">What We Share</th>
                        <th className="px-4 py-3 text-left">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Learning Partners</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Learner name, email (with consent), progress indicators</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">To facilitate course running and direct tutor support</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">University Partners</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Enrolment indicators, completion results, grades</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">To administer academic co-branded certifications</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Payment Gateways</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Payer name, amount, basic transaction ID</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Secure transaction routing (Stripe, Razorpay, etc.)</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Cloud Hosting</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Fully encrypted database and content backups</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Infrastructure operations and platform delivery</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Video Systems</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Student name and email (Zoom, Google Meet)</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">To register and secure entry to live sessions</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Tax & Statutory</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">TDS withholdings, invoices, GST metrics</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Compliance reporting to the Government of India</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  * Where we engage third-party Data Processors, we ensure appropriate <strong>Data Processing Agreements (DPAs)</strong> are executed, binding them to process data strictly on our instructions under SOC2-aligned guidelines.
                </p>
              </div>
            </section>

            {/* Section 8: Data Retention */}
            <section id="retention" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Database className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">8. Data Retention</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[7].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We retain personal data only for as long as necessary to fulfill our service delivery or comply with statutory requirements:
                </p>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-6 py-4 text-left">Data Category</th>
                        <th className="px-6 py-4 text-left">Retention Period</th>
                        <th className="px-6 py-4 text-left">Statutory Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Learner Account & Progress</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Duration of active account + 3 years after deletion request</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">Contract performance, audit mitigation</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Certificates Issued</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">7 years after issuance</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">Verification integrity, record keeping</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Financial & Payment Transactions</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">8 years</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">Income Tax Act, 1961 | GST Act, 2017</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Learning Partner Contracts</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Duration of partnership + 8 years</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">Corporate compliance, TDS requirements</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Marketing & Newsletters</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">Until user opt-out or 3 years of complete inactivity</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">Consent basis</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 9: Your Rights Under the DPDPA and Applicable Law */}
            <section id="rights" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Key className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">9. Your Rights Under DPDPA and Applicable Law</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[8].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Under the <strong>Digital Personal Data Protection Act, 2023</strong> (DPDPA) and governing Indian legislation, you possess powerful data rights:
                </p>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-4 py-3 text-left">Statutory Right</th>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-left">Exercise Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Right to Access</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Receive a summary of personal data processed, specific categories, and external sharing entities.</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Written request to DPO</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Right to Correction</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Request update of outdated, incomplete, or inaccurate records on our Platform database.</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Written request or Settings</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Right to Erasure</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Request full erasure of records where consent is withdrawn or processing is unlawful.</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Written request to DPO</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Withdraw Consent</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Withdraw consent at any time (does not affect historical lawful processing).</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Email or profile dashboard</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-primary">Right to Redressal</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Submit grievances to our dedicated Grievance Officer. Escalate to DPBI if unresolved.</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Contact Grievance Officer</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-4 py-3 font-semibold text-primary">Right to Nominate</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">Nominate a legal representative to act on your behalf in case of death or incapacity.</td>
                        <td className="px-4 py-3 text-xs text-primary font-medium">Written request to DPO</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  <strong>How to exercise your rights:</strong> Submit a written request to our Grievance Officer (Section 15). We will acknowledge receipt within <strong>72 hours</strong> and respond substantively within <strong>30 days</strong>. Exercising your rights will not result in any penalty or adverse consequence.
                </p>
              </div>
            </section>

            {/* Section 10: Data Security */}
            <section id="security" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">10. Data Security</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[9].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We implement robust technical and organizational measures to defend your data against unauthorized access, theft, loss, or disclosure:
                </p>
                <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-3">
                  <h4 className="text-sm font-bold text-foreground">10.1 Security Measures We Implement</h4>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-2">
                    <li>Encryption of data in transit using industry-standard TLS 1.3 / SSL protocols.</li>
                    <li>Encryption of sensitive data at rest (passwords stored using one-way bcrypt hashing).</li>
                    <li>Role-based access controls (RBAC) limiting database access on a strict need-to-know basis.</li>
                    <li>Regular security assessments, firewall penetration testing, and platform audits.</li>
                    <li>Multi-factor authentication (MFA) required for all platform administrator control panels.</li>
                    <li>Secure cloud infrastructure with high-level physical and logical perimeter security.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border/20 bg-card/5 p-5 space-y-3">
                  <h4 className="text-sm font-bold text-foreground">10.2 Data Breach Response</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    In the event of a personal data breach likely to impact your rights or credentials, we will:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                    <li>Notify affected users promptly via registered email and platform banners (in accordance with DPDPA guidelines).</li>
                    <li>Report the incident to the Data Protection Board of India and regulatory authorities.</li>
                    <li>Activate standard containment, diagnostic, and remediation patches immediately.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 11: Children's Privacy */}
            <section id="children" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserCheck className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">11. Children's Privacy</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[10].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  The Prime Learning Platform is primarily designed for use by adults and working professionals. <strong>We do not knowingly collect, process, or store personal data of children under the age of eighteen (18) years</strong> without the verifiable prior consent of a parent or lawful guardian, as required under the Digital Personal Data Protection Act, 2023.
                </p>
                <p>
                  If you are a Minor, please do not create an account or provide personal data without your parent or guardian&apos;s knowledge and consent. If you suspect a minor has registered without consent, contact our Grievance Officer immediately; we will promptly purge the account data.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  * In cases where training is delivered to institutions , the partner institution is responsible for verifying parental consents before onboarding students.
                </p>
              </div>
            </section>

            {/* Section 12: Third-Party Links and Platforms */}
            <section id="third-party" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">12. Third-Party Links and Platforms</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[11].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  The Platform may link to external websites, apps, videoconferencing applications, and merchant checkout screens (e.g., Stripe, Zoom, Razorpay) not controlled by Prime Learning. This Privacy Policy does not apply to their data practices.
                </p>
                <p>
                  We recommend reading the privacy notices of any third-party link before providing credentials. We bear no liability or responsibility for data security on third-party domains.
                </p>
              </div>
            </section>

            {/* Section 13: Cross-Border Data Transfers */}
            <section id="cross-border" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">13. Cross-Border Data Transfers</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[12].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Prime Learning operates primarily within the Republic of India and processes user data on secure cloud instances localized in India. However, some of our third-party infrastructure processors (like analytics, CRM, or CDN layers) may route metadata internationally.
                </p>
                <p>
                  Where data is routed outside India, we guarantee that such transfers comply strictly with the DPDPA, 2023, including standard contract clauses and government blacklist filters. By using the platform, you acknowledge and agree to these secure international transfers.
                </p>
              </div>
            </section>

            {/* Section 14: Changes to this Privacy Policy */}
            <section id="changes" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">14. Changes to this Privacy Policy</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[13].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  We may revise this Privacy Policy periodically to match technological additions, legal evolutions, or platform updates. Any material changes will be announced by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting a clear, prominent update notification banner on the Platform.</li>
                  <li>Sending a direct newsletter notification to your registered email address.</li>
                  <li>Updating the revision timestamp at the top header of this page.</li>
                </ul>
                <p>
                  Your continued use of the platform after updates indicates consent to the revised practices. If you disagree, you may close your account and request erasure under DPDPA guidelines.
                </p>
              </div>
            </section>

            {/* Section 15: Grievance Officer and Contact Details */}
            <section id="grievance" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">15. Grievance Officer and Contact Details</h2>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Plain-English Summary (TL;DR)</span>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {SECTIONS[14].tldr}
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  In compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, and the <strong>Digital Personal Data Protection Act, 2023</strong>, we have designated a Grievance Officer to address questions, concerns, and complaints regarding your personal data:
                </p>

                {/* Grievance Card Table */}
                <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/10 mt-4 shadow-lg shadow-black/10">
                  <table className="min-w-full divide-y divide-border/40 text-sm">
                    <thead>
                      <tr className="bg-card/45 text-foreground font-semibold">
                        <th className="px-6 py-4 text-left w-1/3">Corporate Role</th>
                        <th className="px-6 py-4 text-left">Compliance Coordinates</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Grievance Officer</td>
                        <td className="px-6 py-4 text-foreground">Compliance Desk Officer, PAET Ltd Group</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Corporate Entity</td>
                        <td className="px-6 py-4 text-muted-foreground">Miyo Global Private Limited (Prime Learning)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Official Email</td>
                        <td className="px-6 py-4 text-primary font-semibold hover:underline">
                          <a href="mailto:learning@primelearning.ae">learning@primelearning.ae</a>
                        </td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Postal HQ Address</td>
                        <td className="px-6 py-4 text-muted-foreground leading-relaxed">
                          Prime Learning / Miyo Global Private Limited,<br />
                          K.Y.R. Heights, 1st Floor, Plot No. 4338A & 433/B, Vivekananda Nagar, Allapur,<br />
                          Hitech City Road, Kondapur, Serilingampally, Hyderabad – 500084, Telangana, India
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-primary">Acknowledge Window</td>
                        <td className="px-6 py-4 text-muted-foreground">Within seventy-two (72) hours of receipt</td>
                      </tr>
                      <tr className="bg-card/5">
                        <td className="px-6 py-4 font-semibold text-primary">Resolution Timeline</td>
                        <td className="px-6 py-4 text-muted-foreground">Within thirty (30) days of receipt of written grievance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-2xl border border-border/20 bg-card/5 p-5 space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-primary">Data Protection Board of India (DPBI)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If you are not satisfied with our response to your grievance, you have the right to escalate your complaint to the Data Protection Board of India, once it is constituted and operational under the DPDPA, 2023. Details will be made available on the MeitY website once the Board is operational.
                  </p>
                </div>
              </div>
            </section>

          </article>
        </div>

        {/* Footer End Signature */}
        <footer className="mt-20 pt-8 border-t border-border/30 text-center text-xs text-muted-foreground space-y-2">
          <p>© 2025 Prime Learning / Miyo Global Private Limited. All rights reserved.</p>
          <p className="text-muted-foreground/60 font-mono">
            CIN: U10202TS2026PTC212596 | Governed by the Digital Personal Data Protection Act, 2023 and the laws of India.
          </p>
        </footer>

      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-card/85 text-primary shadow-2xl backdrop-blur-md hover:bg-primary hover:text-background hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
