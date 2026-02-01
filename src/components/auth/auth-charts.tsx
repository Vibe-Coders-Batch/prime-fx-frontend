"use client";
import { motion } from "framer-motion";
export const AnimatedLineChart = () => {
    return (<div className="relative w-72 h-40">
      
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0 opacity-10 border-l border-b border-white/20">
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
         <div className="border-t border-r border-white/20"/>
      </div>

      
      <div className="absolute bottom-0 left-8 flex items-end gap-3 h-full pb-px pl-px z-10">
         <motion.div initial={{ height: 0 }} animate={{ height: "40%" }} transition={{ duration: 0.8, delay: 0.2 }} className="w-4 bg-blue-600/80 rounded-t-sm backdrop-blur-sm"/>
         <motion.div initial={{ height: 0 }} animate={{ height: "65%" }} transition={{ duration: 0.8, delay: 0.4 }} className="w-4 bg-yellow-500/90 rounded-t-sm backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]"/>
      </div>

      
      <svg className="absolute inset-0 w-full h-full overflow-visible z-20">
        <motion.path d="M 20 130 C 50 130, 60 100, 90 110 C 120 120, 140 80, 170 90 C 200 100, 220 40, 260 50" fill="none" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }} style={{ filter: "drop-shadow(0px 0px 8px rgba(234,179,8,0.5))" }}/>
        
        <motion.circle cx="90" cy="110" r="3" fill="#EAB308" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.0 }}/>
        <motion.circle cx="170" cy="90" r="3" fill="#EAB308" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.25 }}/>
        <motion.circle cx="260" cy="50" r="4" fill="#EAB308" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}/>
      </svg>
    </div>);
};
export const AnimatedBarChart = () => {
    return (<div className="relative w-64 h-48 flex items-end justify-center gap-6 pb-8">
         
         <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"/>

         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "40%", opacity: 1 }} transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }} className="w-10 bg-gradient-to-t from-blue-700 to-blue-500 rounded-md shadow-lg border border-blue-400/20"/>
         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "70%", opacity: 1 }} transition={{ duration: 0.8, ease: "backOut", delay: 0.4 }} className="w-10 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-md shadow-xl shadow-yellow-500/10 border border-yellow-400/20 relative group">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded text-xs border shadow-sm">
                 +142%
             </div>
         </motion.div>
         
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 256 192">
            <motion.path d="M40 150 L100 110 L160 50 L200 40" fill="none" stroke="#E3B558" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.8 }}/>
         </svg>
      </div>);
};
