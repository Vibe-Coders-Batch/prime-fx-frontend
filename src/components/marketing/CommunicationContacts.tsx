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
  const isSingle = COMMUNICATION_CONTACTS.length <= 1;

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
      <ul
        className={
          isSingle
            ? heading
              ? "mt-5 space-y-4"
              : "space-y-4"
            : heading
              ? "mt-5 grid grid-cols-1 gap-6 min-[520px]:grid-cols-2"
              : "grid grid-cols-1 gap-6 min-[520px]:grid-cols-2"
        }
      >
        {COMMUNICATION_CONTACTS.map((channel) => (
          <li
            key={channel.division}
            className={isLegacy ? "border-l border-white/10 pl-4" : "border-l border-[var(--fog)]/60 pl-4"}
          >
            <p
              className={`text-sm font-semibold tracking-tight sm:text-base ${
                isLegacy ? "text-white/90" : ""
              }`}
              style={isLegacy ? undefined : { color: "var(--text-primary)" }}
            >
              {channel.division}
            </p>
            <a
              href={`mailto:${channel.email}`}
              className={`mt-2 block max-w-full break-words text-sm leading-snug transition-colors sm:text-base ${
                isLegacy
                  ? "text-white/60 hover:text-primary-gold"
                  : "hover:text-[var(--gold-bright)]"
              }`}
              style={isLegacy ? undefined : { color: "var(--text-secondary)" }}
            >
              {channel.email}
            </a>
            <p
              className={`mt-3 text-sm ${isLegacy ? "text-white/60" : ""}`}
              style={isLegacy ? undefined : { color: "var(--text-secondary)" }}
            >
              {channel.contactName}
            </p>
            <a
              href={channel.phoneHref}
              className={`mt-1 block max-w-full break-words text-sm leading-snug transition-colors sm:text-base ${
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
