import type { ServiceDetail } from "@/lib/cms/types";

export const automateDetails: Record<string, ServiceDetail> = {
  "ai-automation": {
    title: "AI automation for agencies and their clients",
    intro:
      "The manual hours inside an account — qualifying leads, drafting reports, summarising calls, triaging support — turned into workflows built on the Claude and OpenAI APIs. Scoped around one measurable task at a time, with a human in the loop where the output goes to a customer.",
    deliverables: [
      "Workflow map: where the hours go today and what is safe to automate",
      "One or more automations built on the Claude or OpenAI API with your data sources",
      "Guardrails: approval steps, logging, fallbacks and a kill switch",
      "Prompt and evaluation set kept in version control",
      "Cost model and monthly usage reporting",
      "Documentation your account team can read",
    ],
    signals: [
      "Your team spends hours a week on repeatable writing, sorting or summarising",
      "A client wants 'AI' and nobody has defined what it should actually do",
      "Reporting or lead handling is late because a person is the bottleneck",
    ],
    stack: ["Claude API", "OpenAI API", "n8n", "Node.js", "PostgreSQL", "Vector search"],
    seo: "White-label AI automation for agencies: lead qualification, reporting, content pipelines and support triage on the Claude and OpenAI APIs, with guardrails.",
    agencyTypes: ["full-service-agencies", "digital-marketing-agencies", "google-ads-agencies"],
  },
  "workflow-automation": {
    title: "Workflow automation",
    intro:
      "CRMs, forms, ad platforms, spreadsheets and site data connected so nobody copies anything by hand. Built in n8n or Make when a visual tool fits, in code when it does not, and always with error handling so a silent failure never costs a lead.",
    deliverables: [
      "Process audit: every hand-off, every re-key, every 'someone checks it on Fridays'",
      "Automations in n8n, Make or custom code, with retries and alerts",
      "CRM, form, ads and analytics integrations",
      "Data validation and deduplication rules",
      "Monitoring dashboard and monthly run report",
      "Runbook for the day something upstream changes",
    ],
    signals: [
      "Leads arrive in three inboxes and a spreadsheet",
      "Client onboarding takes a week of copy and paste",
      "Reports are assembled by hand every month",
    ],
    stack: ["n8n", "Make", "Node.js", "Webhooks", "HubSpot / Pipedrive", "Google Sheets"],
    seo: "White-label workflow automation for agencies: CRM, forms, ads and site data connected with n8n, Make or custom code, with monitoring and alerts.",
    agencyTypes: ["full-service-agencies", "google-ads-agencies", "digital-marketing-agencies"],
  },
  "ai-assistants-and-chat": {
    title: "AI assistants and on-site chat",
    intro:
      "Assistants grounded in a client's own content — product data, policies, help articles — that answer accurately, cite their source and hand off to a person when they should. Built to be measured: deflection, satisfaction and the questions nobody had written down yet.",
    deliverables: [
      "Knowledge base ingestion and retrieval over the client's own content",
      "Assistant with citations, tone rules and refusal behaviour",
      "Hand-off to email, WhatsApp or live chat with full context",
      "Embeddable widget or integration into an existing chat tool",
      "Evaluation set and monthly quality review",
      "Analytics on questions, gaps and outcomes",
    ],
    signals: [
      "Support handles the same twenty questions all day",
      "A client wants a chatbot that does not make things up",
      "Sales needs pre-qualification outside office hours",
    ],
    stack: ["Claude API", "OpenAI API", "Vector search", "Next.js", "PostgreSQL"],
    seo: "White-label AI assistants and on-site chat for agency clients: grounded in their content, with citations, hand-off to humans and measurable outcomes.",
    agencyTypes: ["full-service-agencies", "digital-marketing-agencies"],
  },
  "internal-tools": {
    title: "Internal tools",
    intro:
      "The small application that replaces the spreadsheet a client's team is quietly running the business on: a quoting tool, a job board, a stock tracker, an approvals flow. Scoped tightly, built in weeks, and handed over with the boring parts — auth, backups, exports — already done.",
    deliverables: [
      "Half-day scoping workshop and a written spec with screens",
      "Next.js application on PostgreSQL with roles and audit trail",
      "Imports from the existing spreadsheet, with validation",
      "Exports, notifications and integrations with the tools already in use",
      "Hosting, backups and monitoring",
      "Training notes and a maintenance plan",
    ],
    signals: [
      "'It is all in Sarah's spreadsheet' is a sentence you have heard on a client call",
      "A process has outgrown forms and email",
      "Off-the-shelf software almost fits but never quite",
    ],
    stack: ["Next.js", "PostgreSQL", "Drizzle", "TypeScript", "Resend", "Vercel"],
    seo: "White-label internal tools for agency clients: small Next.js applications on PostgreSQL that replace spreadsheets, with auth, exports and integrations.",
    agencyTypes: ["full-service-agencies", "digital-marketing-agencies"],
  },
};
