export type CommunicationContact = {
  division: string;
  email: string;
  contactName: string;
  phone: string;
  phoneHref: string;
};

/** Primary communication channels shown across the marketing site. */
export const COMMUNICATION_CONTACTS: CommunicationContact[] = [
  {
    division: "Prime Learning",
    email: "learning@primelearning.ae",
    contactName: "Vijay Saradhi",
    phone: "+91 95505 33955",
    phoneHref: "tel:+919550533955",
  },
];

export const SUPPORT_PHONE = COMMUNICATION_CONTACTS[0].phone;
export const SUPPORT_PHONE_HREF = COMMUNICATION_CONTACTS[0].phoneHref;
