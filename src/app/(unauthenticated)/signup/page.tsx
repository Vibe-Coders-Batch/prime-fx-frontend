"use client";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
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
        .email("Please provide a valid email address")
        .transform((e) => e.toLowerCase().trim()),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
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
    const { register, handleSubmit, formState: { errors }, } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });
    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);
    function handleFormSubmit(data: SignupFormData) {
        const [firstName, ...lastNameParts] = data.fullName.split(" ");
        const lastName = lastNameParts.join(" ");
        registerUser.mutateAsync({
            email: data.email,
            password: data.password,
            firstName,
            lastName,
        }).then(() => {
            toast.success("Account created! Please check your email to verify your account.");
        }).catch((error: unknown) => {
            const errorMessage = error instanceof Error
                ? error.message
                : "Registration failed. Please try again.";
            toast.error(errorMessage);
        });
    }
    return (<AuthSplitLayout title="Prime Learning" subtitle="Create your account and start learning today." image={<AnimatedBarChart />}>
      <div className="space-y-5 sm:space-y-6">
        <header className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Join Prime Learning in minutes.
          </p>
        </header>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-5" aria-label="Registration form">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">
              Email Address
            </Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-11 sm:h-12 bg-background text-foreground border-border focus:ring-primary/20 focus:border-primary" {...register("email")} disabled={registerUser.isPending} aria-describedby={errors.email ? "email-error" : undefined}/>
            {errors.email && (<p id="email-error" className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>)}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium text-sm">
              Password
            </Label>
            <PasswordInput id="password" autoComplete="new-password" placeholder="••••••••" className="h-11 sm:h-12 bg-background text-foreground border-border focus:ring-primary/20 focus:border-primary" {...register("password")} disabled={registerUser.isPending} aria-describedby={errors.password ? "password-error" : "password-hint"}/>
            {errors.password ? (<p id="password-error" className="text-xs text-destructive" role="alert">
                {errors.password.message}
              </p>) : (<p id="password-hint" className="text-xs text-muted-foreground">
                Must include uppercase, lowercase, number, and special character
                (@$!%*?&)
              </p>)}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="fullName" className="text-foreground font-medium text-sm">
              Full Name
            </Label>
            <Input id="fullName" type="text" autoComplete="name" placeholder="John Doe" className="h-11 sm:h-12 bg-background text-foreground border-border focus:ring-primary/20 focus:border-primary" {...register("fullName")} disabled={registerUser.isPending} aria-describedby={errors.fullName ? "fullname-error" : undefined}/>
            {errors.fullName && (<p id="fullname-error" className="text-xs text-destructive" role="alert">
                {errors.fullName.message}
              </p>)}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 sm:h-12" disabled={registerUser.isPending}>
            {registerUser.isPending ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm pt-2 sm:pt-4">
            <span className="text-muted-foreground">Already a member? </span>
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </AuthSplitLayout>);
}
