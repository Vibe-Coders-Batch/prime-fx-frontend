"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, X, GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar-provider";
import { useAuthStore } from "@/lib/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
interface SidebarItem {
    label: string;
    href: string;
    icon?: ReactNode;
    badge?: string | number;
}
interface ModernSidebarProps {
    items: SidebarItem[];
    className?: string;
}
export function ModernSidebar({ items, className }: ModernSidebarProps) {
    const pathname = usePathname();
    const { collapsed, toggleCollapsed } = useSidebar();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();
    const sidebarVariants = {
        expanded: { width: "256px" },
        collapsed: { width: "80px" },
    };
    const handleLogout = () => {
        logout();
        queryClient.clear();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };
    const SidebarContent = () => (<div className="flex flex-col h-full">
      
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-center h-10">
          <AnimatePresence mode="wait">
            {collapsed ? (<motion.div key="collapsed-logo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Link href="/" className="flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary"/>
                </Link>
              </motion.div>) : (<motion.div key="expanded-logo" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary"/>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    PRIME <span className="text-primary">LEARNING</span>
                  </span>
                </Link>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </div>

      
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/");
            return (<motion.div key={item.href} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <Link href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200", isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
              {item.icon && (<motion.span className="shrink-0 w-5 h-5" animate={{ scale: isActive ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                  {item.icon}
                </motion.span>)}
              <AnimatePresence>
                {!collapsed && (<motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="flex-1 whitespace-nowrap">
                    {item.label}
                  </motion.span>)}
              </AnimatePresence>
              {item.badge && !collapsed && (<span className={cn("px-2 py-0.5 text-xs rounded-full", isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground")}>
                  {item.badge}
                </span>)}
              </Link>
            </motion.div>);
        })}
      </nav>

      
      <div className="p-3 sm:p-4 border-t border-border space-y-2">
        
        <div className={cn("flex items-center gap-3 px-4 py-2", collapsed ? "justify-center" : "")}>
           <ModeToggle />
           {!collapsed && <span className="text-sm font-medium text-muted-foreground">Theme</span>}
        </div>

        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button onClick={handleLogout} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full group", "text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20")}>
            <motion.span className="shrink-0 w-5 h-5 group-hover:rotate-180 transition-transform duration-300">
             <LogOut className="w-5 h-5"/>
            </motion.span>
            <AnimatePresence>
              {!collapsed && (<motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="flex-1 whitespace-nowrap text-left">
                  Sign Out
                </motion.span>)}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

    </div>);
    return (<>
      
      <Button variant="ghost" size="icon" className="fixed top-16 left-3 sm:top-20 sm:left-4 z-50 lg:hidden h-10 w-10 bg-background/95 backdrop-blur-sm border border-border shadow-lg hover:bg-background rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
      </Button>

      
      <AnimatePresence>
        {mobileOpen && (<>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)}/>
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed left-0 top-0 h-screen w-72 sm:w-80 border-r border-border bg-card shadow-2xl z-50 lg:hidden">
              <div className="flex flex-col h-full">
                <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                      <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-primary"/>
                      <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        PRIME <span className="text-primary">LEARNING</span>
                      </span>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
                      <X className="h-5 w-5"/>
                    </Button>
                  </div>
                </div>
                <nav className="flex-1 p-4 sm:p-6 space-y-2 overflow-y-auto">
                  {items.map((item) => {
                const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/");
                return (<Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200", isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
                        {item.icon && (<span className="shrink-0 w-5 h-5">
                            {item.icon}
                          </span>)}
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (<span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full", isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground")}>
                            {item.badge}
                          </span>)}
                      </Link>);
            })}
                </nav>
                
                
                <div className="p-4 sm:p-6 border-t border-border">
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <span className="shrink-0 w-5 h-5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" x2="9" y1="12" y2="12"/>
                      </svg>
                    </span>
                    <span className="flex-1 text-left">Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>)}
      </AnimatePresence>

      
      <motion.aside variants={sidebarVariants} animate={collapsed ? "collapsed" : "expanded"} transition={{ duration: 0.3, ease: "easeInOut" }} className={cn("hidden lg:block fixed left-0 top-0 h-screen border-r border-border bg-card z-40", className)}>
        <Button variant="ghost" size="icon" className="absolute -right-3 top-24 h-6 w-6 rounded-full border border-border bg-background shadow-md" onClick={toggleCollapsed}>
          {collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
        </Button>
        <SidebarContent />
      </motion.aside>
    </>);
}
