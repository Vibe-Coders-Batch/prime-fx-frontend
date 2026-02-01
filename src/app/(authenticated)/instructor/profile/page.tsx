"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useProfileForm } from "@/features/profile/hooks/use-profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
export default function InstructorProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const { register, formState: { errors }, onSubmit, isPending, } = useProfileForm(profile);
    if (isLoading) {
        return (<PageLayout header="Loading...">
        <Skeleton className="h-64 w-full"/>
      </PageLayout>);
    }
    return (<PageLayout header="Settings" subtitle="Profile" description="Manage your profile information and account settings.">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your instructor profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-muted"/>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="First Name" error={errors.firstName?.message}>
                <Input id="firstName" {...register("firstName")} placeholder="Enter your first name" disabled={isPending}/>
              </FormField>
              <FormField label="Last Name" error={errors.lastName?.message}>
                <Input id="lastName" {...register("lastName")} placeholder="Enter your last name" disabled={isPending}/>
              </FormField>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={profile?.role || ""} disabled className="bg-muted"/>
              <p className="text-xs text-muted-foreground">
                Role cannot be changed
              </p>
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageLayout>);
}
