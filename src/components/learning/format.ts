/**
 * Render an enum value as sentence case for display. The underlying value is
 * never changed, only its label: PENDING_REVIEW -> "Pending review".
 */
export function sentenceCaseEnum(value: string): string {
    const spaced = value.replace(/_/g, " ").toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
