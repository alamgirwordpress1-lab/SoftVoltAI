import type { ProductDetail } from "@/lib/cms/types";

/**
 * Each product's own page, keyed by product slug. The page follows the order a
 * buyer asks their questions in: what it is and what it costs (banner and price
 * card), why this one, how it works, what help comes with it, then the detail
 * in four tabs — features, Free against Pro, the technical facts, questions.
 *
 * Every claim here must be true of the plugin as it ships. Pro is described as
 * what is planned, never as something you can buy today.
 */
export const productDetails: Record<string, ProductDetail> = {
  "softvolt-ai-voice-agent": {
    title: "SoftVolt AI Voice Agent for WordPress",
    intro:
      "Put an AI sales agent on your WordPress site. Visitors talk or type; it answers from your own facts, recommends the right service or product, books it, and sends you the lead by email, Telegram or n8n.",
    seo: "A free WordPress plugin that puts an AI voice and chat sales agent on your site: answers from your facts, books services, WooCommerce cards, lead alerts.",
    actions: [
      { label: "Get early access", href: "/contact", kind: "primary" },
      { label: "Try the live demo", href: "#demo", kind: "demo" },
      { label: "How it works", href: "#how-it-works", kind: "secondary" },
      { label: "Free and Pro", href: "#compare", kind: "secondary" },
    ],
    plans: [
      {
        name: "Free plugin",
        price: "$0",
        period: "forever",
        note: "The whole plugin, with no locked features.",
        points: [
          "Voice and text chat on your site",
          "Bookings, hand-offs and a Leads inbox",
          "Email, Telegram and n8n alerts",
          "WooCommerce product cards",
          "Free or paid AI models",
        ],
        action: { label: "Get early access", href: "/contact", kind: "primary" },
      },
      {
        name: "Pro add-on",
        price: "Coming soon",
        note: "A separate add-on for more channels, natural voices and payments.",
        points: ["Natural voices", "WhatsApp, Messenger and Instagram", "Calendar booking and payments", "White label and agency mode"],
        action: { label: "Tell me when it is ready", href: "/contact", kind: "secondary" },
      },
    ],
    why: {
      heading: "Why choose SoftVolt AI Voice Agent?",
      paragraphs: [
        "Most chat plugins answer questions. This one sells. It asks one question at a time, recommends the services or products that fit, collects the details you choose in the order you choose, confirms them and books the job — then hands you a lead you can act on.",
        "It only uses what you give it: your services, prices, questions and pages. So it never makes up a price or a promise. When a visitor would rather speak to a person, it hands them over as a hot lead, with a note of what they wanted and what it already explained.",
        "Visitors can simply talk to it. Speech runs in the visitor's own browser, so voice costs you nothing extra. Start on a free AI model, and move to a paid one when the leads justify it.",
      ],
      points: [
        { title: "It sells, not just answers", text: "One question at a time, a recommendation that fits, then the booking." },
        { title: "It never invents", text: "Only your services, prices, questions and pages." },
        { title: "It knows when to hand over", text: "A person gets the visitor, with a note of what they wanted." },
        { title: "Voice at no extra cost", text: "Speech runs in the visitor's browser, not on a paid service." },
      ],
    },
    steps: [
      { title: "Install and open Voice Agent", text: "Activate the plugin. The dashboard shows the setup steps, what is left to do, and a health check." },
      {
        title: "Connect an AI model",
        text: "Choose a free model (OpenRouter, Groq or Gemini) or paste a key for DeepSeek, OpenAI or Claude, then press Test connection. On WordPress 7, you can use the AI you already connected under Settings → Connectors.",
      },
      { title: "Teach it your business", text: "Pick your kind of site and press Learn from my site. Check the services, prices and questions it found, add anything missing, and save." },
      { title: "Place the button", text: "The floating button is on by default — drag it into place in the live preview. Or use the header menu, the block, the widget or the shortcode." },
      { title: "Get the leads", text: "Visitors talk or type. Bookings and hand-offs are saved under Voice Agent → Leads and sent to you by email, Telegram or n8n." },
    ],
    help: [
      {
        title: "Step-by-step guides in the plugin",
        text: "Every AI provider comes with instructions for getting a key and a Test connection button, and the dashboard's health check points to anything that needs fixing.",
      },
      {
        title: "A ready-made n8n workflow",
        text: "Import it to send leads on to Google Sheets, a CRM or WhatsApp. A guide to hosting n8n for free (Northflank with Supabase) comes with it.",
      },
      {
        title: "Help from the team that built it",
        text: "Stuck, or want it set up for you? We build WordPress sites for agencies every day, and we answer our own messages.",
        action: { label: "Ask us", href: "/contact" },
      },
    ],
    features: [
      { title: "Voice and text chat", text: "Visitors talk or type. The agent listens, answers and reads its reply aloud, using the speech features built into the visitor's browser." },
      { title: "Answers from your facts", text: "It uses only the services, prices, questions and pages you add, so it never makes up a price or a promise." },
      { title: "Books services and appointments", text: "It collects the details you choose, in your order, confirms them and saves the booking. For a local service, a phone number is enough." },
      { title: "Hands off to a person", text: "When a visitor asks for a person, stays unsure or asks something it cannot answer, it saves a hot lead with a summary for you." },
      { title: "WooCommerce product cards", text: "In a shop it searches your live products and shows them as cards with the price, stock and an Add to cart button." },
      { title: "Learn from my site", text: "It reads your About, Services, FAQ and Contact pages, your shop and your booking plugin, and fills in the agent's knowledge for you to check." },
      { title: "Searches your pages", text: "During a chat it can look through your published pages, so answers about opening hours or delivery match what your site says." },
      { title: "Fits any kind of site", text: "Presets for services and agencies, local appointments, online shops and information sites change its questions, labels and greeting to suit." },
      { title: "Free and paid AI models", text: "OpenRouter, Groq and Gemini free tiers; DeepSeek, OpenAI and Claude; or any OpenAI-compatible service, including a model you run yourself." },
      { title: "WordPress AI connection", text: "On WordPress 7.0 or later it can use the AI provider you connected under Settings → Connectors, with no second key to paste." },
      { title: "31 languages", text: "Choose the language it listens and speaks in, from English and Bengali to Arabic, Spanish, Hindi and Japanese." },
      { title: "A Leads inbox", text: "Every booking and hand-off is saved in WordPress with its conversation. Set a status, add notes, export to CSV." },
      { title: "Email, Telegram and n8n alerts", text: "Get each lead by email (replies go to the visitor), by Telegram through your own bot, or as JSON to n8n, Make or Zapier." },
      { title: "Place it anywhere", text: "A floating button you drag into place, a header menu button, a block, a widget, a menu item, a shortcode or any link to #svava-open." },
      { title: "A dashboard that shows what matters", text: "Whether the agent is live, new leads, messages per day, the latest leads, and a Talk to your agent button to try it yourself." },
      { title: "Private by design", text: "API keys are stored encrypted and never reach the browser. Only administrators can see, edit or export leads." },
      { title: "Protects your AI credit", text: "A limit per visitor and a daily message cap, both yours to set, keep your AI bill predictable." },
      { title: "Works with your setup", text: "Caching plugins, page builders, block and classic themes. If a security plugin blocks the REST API, it switches to admin-ajax on its own." },
    ],
    compare: [
      { label: "Chat and voice agent on your site", free: true, pro: true },
      { label: "Free and paid AI models, or your WordPress AI connection", free: true, pro: true },
      { label: "Bookings, hand-offs and the Leads inbox", free: true, pro: true },
      { label: "Email, Telegram and n8n alerts", free: true, pro: true },
      { label: "WooCommerce product search with cards", free: true, pro: true },
      { label: "Learn from your pages, drag-and-drop settings", free: true, pro: true },
      { label: "Natural voices", free: false, pro: true },
      { label: "WhatsApp, Messenger and Instagram", free: false, pro: true },
      { label: "Calendar booking and reminders", free: false, pro: true },
      { label: "Payments in the chat", free: false, pro: true },
      { label: "Live inbox and analytics", free: false, pro: true },
      { label: "White label and agency mode", free: false, pro: true },
      { label: "AI included, no key needed", free: false, pro: true },
    ],
    pro: {
      heading: "What Pro will add",
      text: "Pro is a separate add-on we are building now. Everything in the free plugin stays free and keeps working without it.",
      features: [
        { title: "Natural voices", text: "Human-sounding voices and sharper speech recognition, Bengali included, in every browser." },
        { title: "WhatsApp, Messenger and Instagram", text: "The same agent answers customers in the apps they already use, with the same knowledge and bookings." },
        { title: "Real calendar booking", text: "Books real free slots from Google Calendar and sends reminders by SMS or WhatsApp." },
        { title: "Payments in the chat", text: "Deposits and payment links with bKash, SSLCommerz, Stripe or PayPal, and order status for WooCommerce." },
        { title: "Live inbox", text: "Watch conversations as they happen and take over from the agent whenever you want." },
        { title: "Analytics", text: "Chats, bookings and sales over time, and the questions your agent could not answer yet." },
        { title: "Learns from documents", text: "PDFs, price lists and your whole site, read again every day so answers stay current." },
        { title: "CRM connections", text: "Leads go straight to HubSpot, Zoho or Google Sheets, without setting up n8n." },
        { title: "White label and agency mode", text: "Your own brand on the agent, and many client sites managed from one place." },
        { title: "AI included", text: "A monthly plan with the AI built in, so there is no API key to set up." },
      ],
    },
    info: [
      { label: "Version", value: "1.0.0" },
      { label: "Price", value: "Free. A Pro add-on is coming." },
      { label: "Where to get it", value: "WordPress.org listing coming soon. Until then, ask us for early access." },
      { label: "Requires WordPress", value: "6.3 or later" },
      { label: "Tested up to", value: "WordPress 7.1" },
      { label: "Requires PHP", value: "7.4 or later" },
      { label: "Licence", value: "GPLv2 or later" },
      { label: "Voice", value: "Chrome, Edge and Safari on computers and phones, over HTTPS. Every other browser gets the text chat." },
      { label: "Voice languages", value: "31 languages, 39 regional options. Which ones work depends on the visitor's browser." },
      { label: "AI providers", value: "OpenRouter, Groq, Google Gemini, DeepSeek, OpenAI, Anthropic Claude, any OpenAI-compatible service, or the WordPress AI Client" },
      { label: "Alerts", value: "Email, Telegram, and a webhook for n8n, Make or Zapier" },
      { label: "Placement", value: "Floating button, header menu, block, widget, menu item, shortcode [softvolt_voice_agent]" },
      { label: "Works with", value: "WooCommerce, block and classic themes, Elementor and other page builders, caching plugins" },
      { label: "Your data", value: "Leads stay in your own WordPress database. API keys are stored encrypted." },
    ],
    faqs: [
      {
        q: "Is the plugin free?",
        a: "Yes. The plugin is free and complete. You pay nothing unless you choose a paid AI provider, and then you pay that provider directly for what you use.",
      },
      {
        q: "When can I download it?",
        a: "We are preparing it for the WordPress.org plugin directory. Until it is listed there, ask for early access and we will send it to you.",
      },
      {
        q: "How does it know what my site sells?",
        a: "Choose your kind of site (a shop, a local service, an agency, a blog) and press Learn from my site. It reads your pages and your shop and proposes what the agent should know; you check it, change anything, and save. With WooCommerce it searches your live products during the chat, so new products and prices are used straight away.",
      },
      {
        q: "Does it take payments?",
        a: "Not in the free plugin. In a shop it adds products to the cart and customers pay at your own checkout; for a service it saves a booking request and alerts you. Payments in the chat are planned for Pro.",
      },
      {
        q: "Which AI model should I choose?",
        a: "To try it, start with a free one: Groq is very fast, which suits voice. For a business site, a low-cost paid model such as DeepSeek gives the most reliable bookings. You can switch at any time.",
      },
      {
        q: "Can it use the AI I connected in WordPress?",
        a: "Yes, on WordPress 7.0 or later. Connect a provider under Settings → Connectors, then choose WordPress AI connection in the plugin. WordPress keeps the key; the plugin never sees it.",
      },
      {
        q: "Does voice cost anything?",
        a: "No. Speech is handled by the visitor's browser, not by a paid speech service. Only the text of the conversation goes to your AI provider.",
      },
      {
        q: "Which browsers support voice?",
        a: "Chrome, Edge and Safari, on computers and phones. Your site must use HTTPS for the microphone. In other browsers the text chat works as normal.",
      },
      {
        q: "Where are leads stored?",
        a: "In your own WordPress database, under Voice Agent → Leads, with the conversation that led to them. You can set a status, add notes and export them as CSV.",
      },
      {
        q: "Does it work with Elementor and other page builders?",
        a: "Yes. Add the shortcode [softvolt_voice_agent] with the builder's shortcode element, or give any button the CSS class svava-open.",
      },
      {
        q: "Does it work with caching plugins?",
        a: "Yes. The chat needs no nonce, so cached pages keep working. And if a security plugin turns off the REST API for visitors, the agent switches to admin-ajax on its own.",
      },
      {
        q: "Is there a Pro version?",
        a: "Pro is being built as a separate add-on: WhatsApp and Messenger, natural voices, calendar booking, payments in the chat and tools for agencies. Everything in the free plugin stays free and keeps working without it.",
      },
    ],
  },
};
