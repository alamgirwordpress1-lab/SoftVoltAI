/**
 * Which of our products a blog post or service page points to, by slug.
 *
 * Each product name is unique, so a link from a page on the same topic, with
 * the product's name as the link text, is the strongest signal we control for
 * ranking that name. Keep each list to the products that genuinely help a
 * reader of that page.
 */

/** Blog post slug → product slugs. */
export const postProducts: Record<string, string[]> = {
  "website-go-live-checklist": ["flylive"],
  "wordpress-form-submission-checklist": ["flylive"],
  "white-label-wordpress-development-agency-guide": ["nexwordx", "flylive"],
  "protect-website-from-hackers": ["softvoltai-bodyguard"],
  "wordpress-malware-removal-workflow": ["softvoltai-bodyguard"],
  "white-label-technical-seo-checklist": ["softvoltai-ai-seo-engine"],
  "white-label-seo-reporting": ["softvoltai-ai-seo-engine"],
  "white-label-seo-pricing": ["softvoltai-ai-seo-engine"],
  "nextjs-vs-wordpress-for-agency-client-sites": ["nexwordx"],
  "white-label-headless-wordpress-for-agencies": ["nexwordx"],
  "build-fast-landing-page-ai-headless-nextjs": ["nexwordx"],
  "figma-to-wordpress-for-agencies": ["nexwordx", "nexwordx-starter"],
  "ai-automation-for-agencies-services-to-resell": ["softvolt-ai-voice-agent"],
  "n8n-for-agencies-10-workflow-ideas": ["softvolt-ai-voice-agent"],
};

/** Service slug → product slugs. */
export const serviceProducts: Record<string, string[]> = {
  "white-label-wordpress-development": ["nexwordx", "flylive"],
  "headless-wordpress-development": ["nexwordx", "nexwordx-starter"],
  "landing-page-development": ["nexwordx"],
  "woocommerce-development": ["woocommerce-virtual-try-on"],
  "wordpress-security-malware-cleanup": ["softvoltai-bodyguard"],
  "website-maintenance": ["softvoltai-bodyguard", "flylive"],
  "website-rescue-and-fixes": ["flylive"],
  "website-migration": ["flylive"],
  "white-label-seo-services": ["softvoltai-ai-seo-engine"],
  "technical-seo-services": ["softvoltai-ai-seo-engine"],
  "local-seo-services": ["softvoltai-ai-seo-engine"],
  "ai-assistants-and-chat": ["softvolt-ai-voice-agent"],
  "ai-automation": ["softvolt-ai-voice-agent"],
};
