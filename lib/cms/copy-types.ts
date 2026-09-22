/**
 * The shapes the section components accept. A page passes the matching
 * section of its copy (see content/copy), already merged with WordPress.
 */

export interface LinkCopy {
  text: string;
  url: string;
}

export interface HeadingCopy {
  eyebrow: string;
  heading: string;
}

export interface HeadingLedeCopy extends HeadingCopy {
  lede: string;
}

/** A text link beside a heading; an editor hides it by typing a dash. */
export interface LinkedHeadingCopy extends HeadingLedeCopy {
  link: LinkCopy;
}

/** The example client website the white-label demo shows, all of it written on the home page. */
export interface DemoSiteCopy {
  client_name: string;
  client_url: string;
  client_menu: string[];
  client_button: string;
  client_heading: string;
  client_lede: string;
  client_cta: string;
  client_cards: string[];
  credit: string;
  engine_note: string;
}

/** The white-label demo band: its heading, the name box, and the example site. */
export interface DemoCopy extends HeadingLedeCopy, DemoSiteCopy {
  sample_name: string;
  note: string;
  field_label: string;
  colour_label: string;
}

/** Every word inside the short message form on the contact page. */
export interface MessageFormCopy {
  title: string;
  reply_note: string;
  name_label: string;
  name_placeholder: string;
  email_label: string;
  email_placeholder: string;
  company_label: string;
  company_placeholder: string;
  phone_label: string;
  phone_placeholder: string;
  topic_label: string;
  topic_placeholder: string;
  budget_label: string;
  budget_empty: string;
  message_label: string;
  message_placeholder: string;
  nda_label: string;
  submit: string;
  sending: string;
  consent: string;
  privacy_link: string;
  required_note: string;
}

/** Every word inside the four-step brief form. */
export interface BriefFormCopy {
  steps: { title: string }[];
  step_counter: string;
  work_label: string;
  platform_label: string;
  figma_label: string;
  figma_placeholder: string;
  live_label: string;
  live_placeholder: string;
  brief_label: string;
  brief_placeholder: string;
  deadline_label: string;
  deadline_placeholder: string;
  budget_label: string;
  name_label: string;
  agency_label: string;
  email_label: string;
  nda_label: string;
  consent_label: string;
  privacy_link: string;
  back: string;
  next: string;
  submit: string;
  sending: string;
  reply_note: string;
  sent_eyebrow: string;
  sent_heading: string;
  sent_lede: string;
  sent_call: string;
}
