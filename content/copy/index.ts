import { aboutCopy } from "@/content/copy/about";
import { blogCopy } from "@/content/copy/blog";
import { caseStudiesCopy } from "@/content/copy/case-studies";
import { contactCopy } from "@/content/copy/contact";
import { forCopy } from "@/content/copy/for";
import { homeCopy } from "@/content/copy/home";
import { notFoundCopy } from "@/content/copy/not-found";
import { partnerProgrammeCopy } from "@/content/copy/partner-programme";
import { ratesCopy } from "@/content/copy/rates";
import { securityCopy } from "@/content/copy/security";
import { servicesCopy } from "@/content/copy/services";
import { thankYouCopy } from "@/content/copy/thank-you";

/**
 * Every designed page, in the order they appear in the menu, then the two
 * pages nobody navigates to — the thank-you pages and the 404. The WordPress
 * field groups are generated from this list, one per page.
 */
export const pageCopies = [
  homeCopy,
  servicesCopy,
  forCopy,
  caseStudiesCopy,
  ratesCopy,
  securityCopy,
  partnerProgrammeCopy,
  aboutCopy,
  contactCopy,
  blogCopy,
  thankYouCopy,
  notFoundCopy,
];

export {
  aboutCopy,
  blogCopy,
  caseStudiesCopy,
  contactCopy,
  forCopy,
  homeCopy,
  notFoundCopy,
  partnerProgrammeCopy,
  ratesCopy,
  securityCopy,
  servicesCopy,
  thankYouCopy,
};
