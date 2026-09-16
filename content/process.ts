import type { ProcessStep } from "@/lib/cms/types";

// TODO(owner): the turnaround lines are commitments. Confirm each one before launch.
export const process: ProcessStep[] = [
  {
    id: "brief",
    name: "Send the brief",
    turnaround: "Reply within 1 business day",
    summary: "Figma, URL, client notes, SEO or ads requirements — whatever you have. A mutual NDA is available before you share client details.",
    artefact: "brief",
  },
  {
    id: "scope",
    name: "Scope & quote",
    turnaround: "Within 2 business days",
    summary: "A written scope with deliverables, timeline and a fixed price. Nothing starts until you approve it.",
    artefact: "scope",
  },
  {
    id: "production",
    name: "Production",
    turnaround: "Timeline fixed in the scope",
    summary: "Work happens on a staging URL under your brand, with a named producer in a shared Slack Connect or WhatsApp channel.",
    artefact: "staging",
  },
  {
    id: "qa",
    name: "QA & review",
    turnaround: "Published checklist, every build",
    summary: "Cross-browser, real-device, accessibility and Core Web Vitals checks against the same checklist you can read on this site.",
    artefact: "qa",
  },
  {
    id: "delivery",
    name: "Agency delivery",
    turnaround: "Handover doc with every launch",
    summary: "You present the work to your client. We hand over documentation, credentials are transferred, and our name appears nowhere.",
    artefact: "handover",
  },
];
