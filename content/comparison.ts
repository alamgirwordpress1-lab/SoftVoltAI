import type { ComparisonRow } from "@/lib/cms/types";

/** The only figure in the table, with its public source. */
export const comparisonSource = {
  label: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook: Web Developers",
  href: "https://www.bls.gov/ooh/computer-and-information-technology/web-developers.htm",
};

// TODO(owner): every SoftVolt AI cell is a public commitment — confirm each one before launch.
export const comparison: ComparisonRow[] = [
  {
    dimension: "What it really costs",
    inHouse: "Salary plus benefits, payroll taxes, equipment and your management time. US median pay for a web developer is $92,650 a year before any of that.*",
    freelancer: "An hourly or project rate that varies widely — plus the hours you spend managing and checking the work.",
    us: "A fixed price against a written scope, or a monthly block of hours. You pay for what ships.",
  },
  {
    dimension: "Time to start",
    inHouse: "Weeks to months to advertise, interview and onboard.",
    freelancer: "Whenever someone good happens to be free.",
    us: "A written scope and fixed price within two business days.",
  },
  {
    dimension: "Who manages the work",
    inHouse: "You do.",
    freelancer: "You do.",
    us: "A named producer in your shared Slack or WhatsApp channel.",
  },
  {
    dimension: "Holidays and sick days",
    inHouse: "Delivery pauses.",
    freelancer: "You find a replacement mid-project.",
    us: "Team cover, with the same producer on the thread.",
  },
  {
    dimension: "Quality control",
    inHouse: "One person checking their own work.",
    freelancer: "Depends entirely on the individual.",
    us: "The same published QA checklist on every build.",
  },
  {
    dimension: "Range of skills",
    inHouse: "Whatever one hire knows.",
    freelancer: "One specialism at a time.",
    us: "WordPress to Next.js, AI automation, SEO and paid media — one contract.",
  },
  {
    dimension: "Scaling up",
    inHouse: "Hire again, and wait again.",
    freelancer: "Find, brief and coordinate more freelancers.",
    us: "Add hours to the retainer or scope another project.",
  },
  {
    dimension: "If it doesn't work out",
    inHouse: "Notice periods, redundancy and a new search.",
    freelancer: "Lost time and a scramble to recover files and logins.",
    us: "Work ends at handover, with documentation and credentials returned.",
  },
  {
    dimension: "White label & confidentiality",
    inHouse: "Internal, so it does not apply.",
    freelancer: "Sometimes — and your client's site may end up in their portfolio.",
    us: "Always: mutual NDA, no contact with your client, no credit anywhere.",
  },
];
