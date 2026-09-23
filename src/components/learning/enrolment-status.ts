import type { StatusTone } from "./status-pill";

type EnrolmentLike = {
    status?: string | null;
    accessType?: "FULL" | "SECTION";
};

export interface EnrolmentStatusPresentation {
    label: string;
    tone: StatusTone;
}

/**
 * Presentation only. A section purchase is surfaced ahead of the enrolment
 * status, except when access has been revoked. No status is added, removed or
 * remapped.
 */
export function presentEnrolmentStatus(enrolment: EnrolmentLike): EnrolmentStatusPresentation {
    // A revoked enrolment reports as revoked even when it was a section
    // purchase: the access is gone either way, and that is what the learner
    // needs to know first.
    if (enrolment.status !== "REVOKED" && enrolment.accessType === "SECTION") {
        return { label: "Section access", tone: "warn" };
    }
    switch (enrolment.status) {
        case "ACTIVE":
            return { label: "In progress", tone: "accent" };
        case "COMPLETED":
            return { label: "Completed", tone: "ok" };
        case "REVOKED":
            return { label: "Revoked", tone: "risk" };
        default:
            return { label: "Unknown", tone: "neutral" };
    }
}

/**
 * Operations view of the same statuses. Deliberately ignores `accessType`:
 * the staff tables have always shown the raw enrolment status, and anything
 * outside ACTIVE/COMPLETED has always been surfaced as a problem state.
 */
export function presentEnrolmentStatusOnly(status?: string | null): EnrolmentStatusPresentation {
    switch (status) {
        case "ACTIVE":
            return { label: "Active", tone: "accent" };
        case "COMPLETED":
            return { label: "Completed", tone: "ok" };
        default:
            return { label: status ? status.charAt(0) + status.slice(1).toLowerCase() : "Unknown", tone: "risk" };
    }
}
