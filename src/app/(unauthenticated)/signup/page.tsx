"use client";

import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/features/auth/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { AnimatedBarChart } from "@/components/auth/auth-charts";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: SignupFormData) => {
    const [firstName, ...lastNameParts] = data.fullName.split(" ");
    const lastName = lastNameParts.join(" ");
    
    try {
      await registerUser.mutateAsync({
        email: data.email,
        password: data.password,
        firstName,
        lastName,
      });
      toast.success("Account created! Please check your email to verify your account.");
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <AuthSplitLayout
      title="Join the Elite"
      subtitle="Start your journey to financial mastery. Institutional tools, real-time data, and expert mentorship."
      image={<AnimatedBarChart />}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="text-muted-foreground">
            Begin your application for PRIME E-LEARNING & TRAINING.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 font-normal">Email Address</Label>
            <Input
              id="email"
              type="email"
              className="bg-background text-foreground border-input dark:bg-card dark:text-card-foreground focus:ring-primary/20"
              {...register("email")}
              disabled={registerUser.isPending}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80 font-normal">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-background text-foreground border-input dark:bg-card dark:text-card-foreground focus:ring-primary/20"
              {...register("password")}
              disabled={registerUser.isPending}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
            {!errors.password && (
              <p className="text-xs text-muted-foreground">
                Must include uppercase, lowercase, number, and special character (@$!%*?&)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground/80 font-normal">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              className="bg-background text-foreground border-input dark:bg-card dark:text-card-foreground focus:ring-primary/20"
              {...register("fullName")}
              disabled={registerUser.isPending}
            />
             {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#E3B558] hover:bg-[#d4a74d] text-black font-semibold h-11" 
            disabled={registerUser.isPending}
          >
            {registerUser.isPending ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">Already a member? </span>
              <Link href="/login" className="text-[#E3B558] hover:underline font-medium">
                Sign In
              </Link>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  );
}
