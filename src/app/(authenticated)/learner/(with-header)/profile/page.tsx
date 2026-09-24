"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/ui/form-field";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useProfileForm } from "@/features/profile/hooks/use-profile-form";

export default function ProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const {
        register,
        formState: { errors },
        onSubmit,
        isPending,
    } = useProfileForm(profile);

    if (isLoading) {
        return (
            <LearningSurface>
                <LearningPageHeader title="Loading..." />
                <Skeleton className="h-64 w-full rounded-lg" />
            </LearningSurface>
        );
    }

    return (
        <LearningSurface>
            <LearningPageHeader
                eyebrow="Account"
                title="Profile settings"
                description="Manage your account information and preferences."
            />

            <section aria-labelledby="personal-heading" className="space-y-3">
                <SectionHeading
                    id="personal-heading"
                    title="Personal information"
                    description="Update your personal details"
                />
                <Panel className="p-5">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile?.email || ""}
                                disabled
                                className="bg-[var(--ls-paper-quiet)]"
                            />
                            <p className="text-xs text-[var(--ls-ink-quiet)]">
                                Email cannot be changed
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="First Name" error={errors.firstName?.message}>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                    placeholder="Enter your first name"
                                />
                            </FormField>
                            <FormField label="Last Name" error={errors.lastName?.message}>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    placeholder="Enter your last name"
                                />
                            </FormField>
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Panel>
            </section>
        </LearningSurface>
    );
}
