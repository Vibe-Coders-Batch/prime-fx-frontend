"use client";

import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { AnimatedLineChart } from "@/components/auth/auth-charts";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      // Success is handled in the hook's onSuccess callback
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    <AuthSplitLayout
      title="PRIME E-LEARNING & TRAINING"
      subtitle="Access the institutional ecosystem designed for the next generation of traders."
      image={<AnimatedLineChart />}
    >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground text-base">
              Enter your credentials to access the terminal.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="bg-background text-foreground border-input focus:ring-primary/20 focus:border-primary border-2"
                {...register("email")}
                disabled={login.isPending}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-background text-foreground border-input focus:ring-primary/20 focus:border-primary border-2"
                {...register("password")}
                disabled={login.isPending}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                tabIndex={3}
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#E3B558] hover:bg-[#d4a74d] text-black font-semibold h-11" 
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="space-y-4 text-center text-sm pt-4">
               <div>
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link href="/signup" className="text-[#E3B558] hover:underline font-semibold">
                      Apply for Access
                  </Link>
               </div>
               <div>
                  <span className="text-muted-foreground">New to PRIME E-LEARNING & TRAINING? </span>
                  <Link href="#" className="text-[#E3B558] hover:underline font-semibold">
                      Book a demo
                  </Link>
               </div>
            </div>
          </form>
        </div>
    </AuthSplitLayout>
  );
}
