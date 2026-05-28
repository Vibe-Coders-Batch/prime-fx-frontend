import { COMMUNICATION_CONTACTS } from "@/config/contact";

type CommunicationContactsProps = {
  className?: string;
  /** Eyebrow label above the contact blocks */
  heading?: string;
  variant?: "landing" | "legacy";
};

export function CommunicationContacts({
  className = "",
  heading = "Contact us",
  variant = "landing",
}: CommunicationContactsProps) {
  const isLegacy = variant === "legacy";

  return (
    <div className={className}>
      {heading ? (
        <p
          className={
            isLegacy
              ? "text-xs font-medium uppercase tracking-[0.2em] text-primary-gold"
              : "text-xs font-medium uppercase tracking-[0.2em]"
          }
          style={isLegacy ? undefined : { color: "var(--gold-bright)" }}
        >
          {heading}
        </p>
      ) : null}
      <ul className={heading ? "mt-5 space-y-6" : "space-y-6"}>
        {COMMUNICATION_CONTACTS.map((channel) => (
          <li key={channel.division}>
            <p
              className={`text-base font-medium sm:text-lg ${
                isLegacy ? "text-white/90" : ""
              }`}
              style={isLegacy ? undefined : { color: "var(--text-primary)" }}
            >
              {channel.division}
            </p>
            <a
              href={`mailto:${channel.email}`}
              className={`mt-1 block text-base transition-colors sm:text-lg ${
                isLegacy
                  ? "text-white/60 hover:text-primary-gold"
                  : "hover:text-[var(--gold-bright)]"
              }`}
              style={isLegacy ? undefined : { color: "var(--text-secondary)" }}
            >
              {channel.email}
            </a>
            <p
              className={`mt-2 text-base sm:text-lg ${isLegacy ? "text-white/60" : ""}`}
              style={isLegacy ? undefined : { color: "var(--text-secondary)" }}
            >
              {channel.contactName}
            </p>
            <a
              href={channel.phoneHref}
              className={`mt-0.5 block text-base transition-colors sm:text-lg ${
                isLegacy
                  ? "text-white/60 hover:text-primary-gold"
                  : "hover:text-[var(--gold-bright)]"
              }`}
              style={isLegacy ? undefined : { color: "var(--text-secondary)" }}
            >
              {channel.phone}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
