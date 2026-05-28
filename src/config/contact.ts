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
    contactName: "Vijay Sarathi",
    phone: "+91 95505 33955",
    phoneHref: "tel:+919550533955",
  },
  {
    division: "Prime Learning — Staffing",
    email: "staffing@primelearning.ae",
    contactName: "Biswajit Sircar",
    phone: "+91 80953 82382",
    phoneHref: "tel:+918095382382",
  },
];

export const SUPPORT_PHONE = COMMUNICATION_CONTACTS[0].phone;
export const SUPPORT_PHONE_HREF = COMMUNICATION_CONTACTS[0].phoneHref;
export const STAFFING_PHONE = COMMUNICATION_CONTACTS[1].phone;
export const STAFFING_PHONE_HREF = COMMUNICATION_CONTACTS[1].phoneHref;
