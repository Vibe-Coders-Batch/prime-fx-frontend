"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/ui/form-field";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";
import { useCompany, useUpdateCompany } from "@/features/companies/hooks/use-companies";
import { useAuthStore } from "@/lib/store/auth-store";

const companySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
});
type CompanyFormData = z.infer<typeof companySchema>;

export default function CorporateSettingsPage() {
    const { user } = useAuthStore();
    const { data: company, isLoading } = useCompany({
        enabled: true,
        id: user?.companyId ?? undefined,
    });
    const updateCompany = useUpdateCompany();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CompanyFormData>({ resolver: zodResolver(companySchema) });

    useEffect(() => {
        const companyData = company;
        if (companyData) {
            reset({
                name: (companyData as any).name || "",
                email: (companyData as any).email || "",
                phone: (companyData as any).phone || "",
                address: (companyData as any).address || "",
            });
        }
    }, [company, reset]);

    const onSubmit = (data: CompanyFormData) => {
        const companyId = user?.companyId ?? undefined;
        if (companyId) {
            updateCompany.mutate({ id: companyId, data });
        }
    };

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
                eyebrow="Company"
                title="Corporate settings"
                description="Manage your company account information and preferences."
            />

            <section aria-labelledby="company-heading" className="space-y-3">
                <SectionHeading
                    id="company-heading"
                    title="Company information"
                    description="Update your company details"
                />
                <Panel className="p-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            label="Company Name"
                            required
                            error={errors.name?.message}
                            description="Your company's official name"
                        >
                            <Input
                                id="name"
                                {...register("name")}
                                placeholder="Enter company name"
                            />
                        </FormField>
                        <FormField
                            label="Email"
                            error={errors.email?.message}
                            description="Company contact email address"
                        >
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="company@example.com"
                            />
                        </FormField>
                        <FormField label="Phone" description="Company contact phone number">
                            <Input
                                id="phone"
                                {...register("phone")}
                                placeholder="+1 234 567 8900"
                            />
                        </FormField>
                        <FormField label="Address" description="Company headquarters address">
                            <Input
                                id="address"
                                {...register("address")}
                                placeholder="Company address"
                            />
                        </FormField>
                        <Button type="submit" disabled={updateCompany.isPending}>
                            {updateCompany.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Panel>
            </section>
        </LearningSurface>
    );
}
