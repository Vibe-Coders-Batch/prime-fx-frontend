export type CommunicationContact = {
  division: string;
  email: string;
  contactName: string;
};

/** Primary communication channels shown across the marketing site. */
export const COMMUNICATION_CONTACTS: CommunicationContact[] = [
  {
    division: "Prime Learning",
    email: "learning@primelearning.ae",
    contactName: "Vijaya Saradhi",
  },
  {
    division: "Staff Augmentation & Hiring",
    email: "staffing@primelearning.ae",
    contactName: "Vijaya Saradhi",
  },
];
