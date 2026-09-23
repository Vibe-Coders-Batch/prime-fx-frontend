"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
    SectionHeading,
} from "@/components/learning/learning-surface";

export default function AdminSettingsPage() {
    const [platformName, setPlatformName] = useState("PrimeFX");
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowRegistrations, setAllowRegistrations] = useState(true);

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    return (
        <LearningSurface>
            <LearningPageHeader
                title="Platform settings"
                description="Configure platform-wide settings and integrations."
            />

            <div className="space-y-6">
                <section aria-labelledby="general-heading" className="space-y-3">
                    <SectionHeading
                        id="general-heading"
                        title="General settings"
                        description="Basic configuration for the platform."
                    />
                    <Panel className="divide-y divide-[var(--ls-divider)]">
                        <div className="space-y-2 p-5">
                            <Label htmlFor="platformName">Platform Name</Label>
                            <Input
                                id="platformName"
                                value={platformName}
                                onChange={(e) => setPlatformName(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-4 p-5">
                            <div className="space-y-0.5">
                                <Label htmlFor="registrations">Allow New Registrations</Label>
                                <p className="text-sm text-[var(--ls-ink-quiet)]">
                                    Enable or disable new user signups.
                                </p>
                            </div>
                            <Switch
                                id="registrations"
                                checked={allowRegistrations}
                                onCheckedChange={setAllowRegistrations}
                            />
                        </div>
                    </Panel>
                </section>

                <section aria-labelledby="maintenance-heading" className="space-y-3">
                    <SectionHeading
                        id="maintenance-heading"
                        title="System maintenance"
                        description="Manage system availability and maintenance mode."
                    />
                    <Panel>
                        <div className="flex items-center justify-between gap-4 p-5">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance">Maintenance Mode</Label>
                                <p className="text-sm text-[var(--ls-ink-quiet)]">
                                    Disable access for non-admin users.
                                </p>
                            </div>
                            <Switch
                                id="maintenance"
                                checked={maintenanceMode}
                                onCheckedChange={setMaintenanceMode}
                            />
                        </div>
                    </Panel>
                </section>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </LearningSurface>
    );
}
