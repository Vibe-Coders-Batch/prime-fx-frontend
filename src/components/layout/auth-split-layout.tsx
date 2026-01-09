"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthSplitLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  image?: ReactNode;
}

export function AuthSplitLayout({ children, title, subtitle, image }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-[#0A1428] text-white overflow-hidden"
      >
        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 max-w-lg text-center space-y-8">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {title}
                </h1>
                <p className="text-lg text-gray-400 max-w-sm mx-auto">
                    {subtitle}
                </p>
            </motion.div>
          
            {image && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex justify-center"
                >
                    {image}
                </motion.div>
            )}
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col justify-center p-8 bg-[#F6F5F2] dark:bg-background sm:px-12 lg:px-24"
      >
        <div className="w-full max-w-md mx-auto space-y-8">
            <Link 
                href="/"
                className="inline-flex items-center text-sm text-[#4a4a4a] dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-gray-200 transition-colors mb-8 font-semibold"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
            </Link>

            {children}
        </div>
      </motion.div>
    </div>
  );
}
