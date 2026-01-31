"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface AuthFormProps {
    type: "login" | "signup";
}
export function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [focusedField, setFocusedField] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        name: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/demo");
        }, 1500);
    };
    return (<form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="space-y-4">
        
        <div className="relative group">
          <input type="email" id="email" required value={formData.email} onChange={handleChange} className={cn("peer w-full px-4 py-3 bg-background/50 border-2 rounded-lg outline-none transition-all duration-300", focusedField === "email" ? "border-primary-gold" : "border-white/10 group-hover:border-white/20")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}/>
          <label htmlFor="email" className={cn("absolute left-4 transition-all duration-300 pointer-events-none text-muted-foreground", focusedField === "email" || formData.email
            ? "-top-2.5 bg-background px-2 text-xs text-primary-gold"
            : "top-3.5 text-sm")}>
            Email Address
          </label>
        </div>

        
        <div className="relative group">
          <input type="password" id="password" required value={formData.password} onChange={handleChange} className={cn("peer w-full px-4 py-3 bg-background/50 border-2 rounded-lg outline-none transition-all duration-300", focusedField === "password" ? "border-primary-gold" : "border-white/10 group-hover:border-white/20")} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}/>
          <label htmlFor="password" className={cn("absolute left-4 transition-all duration-300 pointer-events-none text-muted-foreground", focusedField === "password" || formData.password
            ? "-top-2.5 bg-background px-2 text-xs text-primary-gold"
            : "top-3.5 text-sm")}>
            Password
          </label>
        </div>

        {type === "signup" && (<div className="relative group">
            <input type="text" id="name" required value={formData.name} onChange={handleChange} className={cn("peer w-full px-4 py-3 bg-background/50 border-2 rounded-lg outline-none transition-all duration-300", focusedField === "name" ? "border-primary-gold" : "border-white/10 group-hover:border-white/20")} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}/>
            <label htmlFor="name" className={cn("absolute left-4 transition-all duration-300 pointer-events-none text-muted-foreground", focusedField === "name" || formData.name
                ? "-top-2.5 bg-background px-2 text-xs text-primary-gold"
                : "top-3.5 text-sm")}>
                Full Name
            </label>
            </div>)}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary-gold text-primary-dark font-bold hover:bg-white transition-all duration-300 relative overflow-hidden group">
        {isLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : (<span className="relative z-10">{type === "login" ? "Sign In" : "Create Account"}</span>)}
        
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"/>
      </Button>
    </form>);
}
