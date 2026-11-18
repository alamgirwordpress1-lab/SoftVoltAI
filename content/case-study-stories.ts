import type { CaseStory } from "@/lib/cms/types";

type Draft = Omit<CaseStory, "review">;

/**
 * The story under each case study's banner: how the project was done, what
 * made it complex and how that was solved, and how it was completed.
 *
 * These are the starting drafts, written only from what each case study
 * already states (its summary, what shipped and its stack). Anything typed into
 * a case study's "Story" box in WordPress replaces the matching part here, so
 * edit them there. Keyed by the slug WordPress gives the case study.
 *
 * There are no client reviews in this file on purpose: a review is the
 * client's own words, published only from WordPress with their permission on
 * record.
 */
export const caseStudyStories: Record<string, Draft> = {
  "custom-wordpress-website-green-pathway-us-consultancy": {
    overview: [
      "Green Pathway guides three very different audiences — students, working professionals and organisations — through six services that run from immigration support to business consulting. The brief was a site where each of them finds their own path quickly and knows what happens next before booking a call.",
      "We mapped the six services against the three audiences first, then built a custom WordPress theme around that structure: a page for every pathway, audience sections that point to the right ones, and the same four-step process and consultation request on every page.",
    ],
    challenges: [
      {
        problem: "Six services and three audiences on one site can easily turn into a maze, with visitors landing on pages that were never meant for them.",
        solution: "Separate sections for students, professionals and organisations, each pointing only to the pathways that apply to them.",
      },
      {
        problem: "Visitors arrive with questions about the process, and most will not book a call until those are answered.",
        solution: "A four-step process and FAQs written into every page, so the answers come before the consultation request rather than after it.",
      },
      {
        problem: "A heavy page builder would have slowed every page of a site that is mostly read on phones.",
        solution: "A custom WordPress theme built for speed, with only the templates the site actually uses.",
      },
    ],
    outcome: ["The site launched with all six pathways, the audience sections and a consultation request on every page, and its content is managed in WordPress."],
  },

  "woocommerce-store-gfc-fans-bd-bangladesh": {
    overview: [
      "GFC Fans sells a wide range of fans in Bangladesh — ceiling, pedestal, bracket, exhaust, table and AC/DC models — through its own showrooms. The store had to show the whole range with prices in taka, and send shoppers who want to see a fan in person to the nearest showroom.",
      "We built it on WooCommerce with Elementor: a category for each kind of fan, quick view, compare and wishlist on every product, and a store finder that maps every GFC showroom, with content in Bangla and English.",
    ],
    challenges: [
      {
        problem: "Shoppers compare fans on size, power and price, and opening product pages one at a time is slow on a phone.",
        solution: "Quick view and compare on every product, so models can be weighed side by side without leaving the catalogue.",
      },
      {
        problem: "Many buyers still want to see a fan before they pay for it.",
        solution: "A store locator with a map of every GFC showroom.",
      },
      {
        problem: "The site had to read naturally in both Bangla and English and stay easy to update.",
        solution: "Bangla and English content laid out in Elementor, which can be edited without a developer.",
      },
    ],
    outcome: ["The store launched with the full fan catalogue, prices in taka, the showroom map and both languages."],
  },

  "headless-wordpress-nextjs-uk-aggregates-supplier": {
    overview: [
      "A UK aggregates supplier wanted a fast, modern front end without retraining the team that already updates the site in WordPress. The answer was to keep WordPress as the editor and move everything visitors see to Next.js.",
      "We built a WordPress child theme that exposes ACF fields, menus and a Supplies post type through the REST API, and a Next.js App Router front end, written in TypeScript and deployed on Vercel, that renders it.",
    ],
    challenges: [
      {
        problem: "The team already knew the WordPress admin, and a new CMS would have meant retraining and moving every piece of content.",
        solution: "WordPress stayed as the back end: supplies, menus and page fields are edited exactly where they were before, and the front end reads them through the REST API.",
      },
      {
        problem: "The supplies and the page content had to reach a separate Next.js app in a predictable shape.",
        solution: "A child theme that exposes ACF fields, menus and a dedicated Supplies post type through the REST API, typed on the Next.js side in TypeScript.",
      },
      {
        problem: "A headless contact form usually means the browser posting straight to WordPress, which exposes the back end.",
        solution: "Submissions go through a Next.js route handler that passes them on, so the browser never calls WordPress directly.",
      },
    ],
    outcome: ["The Next.js front end runs on Vercel, and the WordPress admin the client already knows is still where the content is edited."],
  },

  "woocommerce-store-maintenance-uk-pool-heating-retailer": {
    overview: [
      "A UK retailer of pool heat pumps needed a WooCommerce store for a large, technical product range — and someone to keep it healthy once it was live.",
      "We built the full store, from the catalogue and product templates to the checkout, with category and search paths designed for products that are compared on specification. After launch the work carried on as ongoing maintenance engineering instead of ending at handover.",
    ],
    challenges: [
      {
        problem: "Heat pumps are bought on specification, and a long, technical range is hard to browse.",
        solution: "Category and search paths built around how buyers narrow down a heat pump, with product templates that keep the technical details consistent.",
      },
      {
        problem: "A store is never finished at launch: WordPress, WooCommerce and their plugins keep changing underneath it.",
        solution: "Ongoing maintenance engineering after launch — updates, fixes and changes handled as a care plan, not a hand-off and goodbye.",
      },
    ],
    outcome: ["The store launched with its full catalogue and checkout and has been maintained since — the same care-plan pattern agencies now resell under their own brand."],
  },

  "woocommerce-store-uk-renewable-energy-company": {
    overview: [
      "A UK renewable energy company needed an e-commerce platform for its energy products and services, and someone to run the project as well as build it.",
      "We turned the requirements into a build plan, built the platform on WooCommerce and managed the project through to launch, briefing the client at each stage.",
    ],
    challenges: [
      {
        problem: "Energy products and services do not fit neatly into a standard shop, and the requirements started as a list of needs rather than a specification.",
        solution: "Scoping came first: the requirements were turned into a build plan before development started.",
      },
      {
        problem: "The client needed to stay informed without managing developers themselves.",
        solution: "The project was run end to end, with the client briefed at each stage instead of chasing progress.",
      },
    ],
    outcome: ["The WooCommerce platform was delivered and launched, managed from the first scoping session to go-live."],
  },

  "woocommerce-store-mobiledokan24-bangladesh": {
    overview: [
      "MobileDokan24 sells mobile devices in Bangladesh from a large catalogue that changes every day as models, prices and stock move.",
      "We built the store on WooCommerce with a product data structure the client's own team can manage daily, and category, filter and search paths for shoppers comparing models.",
    ],
    challenges: [
      {
        problem: "A device catalogue changes daily, and waiting for a developer for every price or stock change would slow the business down.",
        solution: "A product data structure the team manages themselves, so daily merchandising never waits for a developer.",
      },
      {
        problem: "Shoppers compare phones across brands and specifications, which is hard in a large catalogue.",
        solution: "Category, filter and search paths built for comparing models.",
      },
    ],
    outcome: ["The store is live, and its daily merchandising is handled by the client's own team."],
  },

  "full-stack-wordpress-patriot-insurance-us": {
    overview: [
      "A division of a US insurance group needed a site that explains personal, business and industry cover clearly and turns visitors into enquiries and quote requests.",
      "We built it full-stack on WordPress: a services architecture that separates the three kinds of cover, enquiry and quote-request flows, and a content structure the client's team can maintain.",
    ],
    challenges: [
      {
        problem: "Insurance products overlap, and visitors get lost when personal, business and industry cover are mixed together.",
        solution: "A services architecture that keeps the three apart, so each visitor reaches the cover that applies to them.",
      },
      {
        problem: "Enquiries and quote requests are the point of the site, and they need different information.",
        solution: "Separate enquiry and quote-request flows.",
      },
      {
        problem: "The client's team needed to update content without breaking page templates.",
        solution: "A content structure built so the team edits inside set templates.",
      },
    ],
    outcome: ["The site is live, with its content maintained by the client's own team."],
  },

  "wordpress-acf-law-firm-website-ronemus-vilensky-us": {
    overview: [
      "A New York law firm wanted its press coverage, case news and articles in one place, next to its practice areas and a way for prospective clients to ask for a consultation.",
      "We managed the build on WordPress and ACF: a news portal for press coverage and case updates, article publishing for the firm's own news and blog, and consultation enquiry flows.",
    ],
    challenges: [
      {
        problem: "Press coverage, case news and the firm's own articles are different kinds of content, and they were not in one place.",
        solution: "One news portal, with publishing set up for each kind of content and structured with ACF.",
      },
      {
        problem: "News only helps a law firm if readers can act on it.",
        solution: "Consultation enquiry flows alongside the news and the practice areas.",
      },
    ],
    outcome: ["The portal is live, with article publishing set up for the firm's own news and blog."],
  },

  "wordpress-education-website-yume-nihongo-bangladesh": {
    overview: [
      "Yume Nihongo is a Dhaka language school that prepares students to study in Japan. Prospective students and their parents needed to understand the courses, the admissions and the long document-to-visa process before getting in touch.",
      "We built the WordPress site around that journey: course and admissions pages, the document-to-visa process explained step by step, and enquiry paths for students and parents.",
    ],
    challenges: [
      {
        problem: "The document-to-visa process for Japan is long and confusing for first-time applicants.",
        solution: "The process laid out step by step, so applicants know what comes next and what they need for it.",
      },
      {
        problem: "Students and parents ask different questions before they enquire.",
        solution: "Separate enquiry paths for students and for parents.",
      },
    ],
    outcome: ["The site is live, with the courses, the admissions guidance and the visa steps in one place."],
  },

  "technical-seo-wordpress-site-uk-seo-agency": {
    overview: [
      "A UK SEO agency needed its own website to prove what it sells: an agency that sells rankings cannot have a slow, badly structured site.",
      "We built it on WordPress technical-SEO first — clean markup, a correct heading structure and planned internal linking — with speed treated as a requirement from the start, and service and location page templates the agency can extend itself.",
    ],
    challenges: [
      {
        problem: "SEO is often added with plugins after a site is built, which leaves the structural problems in place.",
        solution: "Technical SEO shaped the build from the start: markup, headings and internal links were planned before the pages were.",
      },
      {
        problem: "Speed is usually patched at the end with caching plugins.",
        solution: "Performance treated as a requirement during the build, not a plugin added at the end.",
      },
      {
        problem: "The agency needs new service and location pages without calling a developer each time.",
        solution: "Service and location page templates the agency can extend itself.",
      },
    ],
    outcome: ["The site is live, and the agency adds new service and location pages from the templates itself."],
  },

  "law-firm-website-chorne-law-new-york": {
    overview: [
      "Chorne Law is a Manhattan personal injury firm. People looking for an injury lawyer decide quickly, so the site had to show the firm's specialisms and results up front and make a free consultation easy to ask for.",
      "We built a practice-area page for each of the firm's injury specialisms, put verdicts and settlements near the top, and added a free consultation form with the office location map.",
    ],
    challenges: [
      {
        problem: "Injury clients choose a lawyer on trust, and a list of services alone does not build it.",
        solution: "Verdicts and settlements shown up front.",
      },
      {
        problem: "Each kind of injury case brings its own questions.",
        solution: "A practice-area page for each of the firm's specialisms.",
      },
      {
        problem: "A visitor who is ready to call should never have to look for the form.",
        solution: "A free consultation request on every page, with the office location map.",
      },
    ],
    outcome: ["The site is live, with the practice areas, the results and the consultation form in place."],
  },

  "agency-website-uk-experiential-marketing-agency": {
    overview: [
      "A UK experiential marketing agency, working from the UK and Dubai, needed a site as bold as its brand activations: one that shows its campaigns for major sports and retail brands and brings in new enquiries.",
      "We built a campaign showcase with a numbered project list, services, FAQ and latest-insights sections, a LinkedIn feed and lead capture in the footer, and an entry point to the agency's AI activation generator.",
    ],
    challenges: [
      {
        problem: "An experiential agency sells on the work itself, and a plain grid of logos would undersell it.",
        solution: "A campaign showcase with a numbered project list.",
      },
      {
        problem: "The site had to look bold without losing the information a buyer needs.",
        solution: "Services, FAQ and insights sections under the showcase.",
      },
      {
        problem: "Visitors who are not ready to brief still need a way to stay in touch.",
        solution: "A LinkedIn feed and lead capture in the footer of every page.",
      },
    ],
    outcome: ["The site is live, with the campaign showcase, the services and insights, and lead capture on every page."],
  },

  "manufacturer-website-uk-partitioning-company": {
    overview: [
      "A UK manufacturer of glazed and fire-rated partitions sells to people who specify buildings, and they need product detail and proof of past work before they specify anything.",
      "We built a specification-led site: the product range for glazed and fire-rated partitions and doors, a latest-projects gallery with performance figures, an ESG section and an entry point to an interactive design studio tour.",
    ],
    challenges: [
      {
        problem: "Specifiers need technical detail, and a brochure-style site would not give it to them.",
        solution: "A product range organised for specification, covering partitions and doors.",
      },
      {
        problem: "Buyers want to see installed projects and performance, not just products.",
        solution: "A latest-projects gallery alongside performance figures.",
      },
      {
        problem: "ESG questions are now part of most building projects.",
        solution: "A dedicated ESG section.",
      },
    ],
    outcome: ["The site is live, with the product range, the project gallery, the ESG section and the design studio tour."],
  },

  "woocommerce-store-the-artel-collection-us-jewellery": {
    overview: [
      "The Artel Collection is a US jewellery and collectibles brand selling enamel egg pendants, lockets, chains, earrings and gift collectibles. The store had to keep the products front and centre and support a members programme.",
      "We built it on WooCommerce: a category shop, trending tabs for new arrivals, featured and sale items, Pro Membership with wishlist, order tracking and an account area, and the shipping, returns and quality guarantee shown before checkout.",
    ],
    challenges: [
      {
        problem: "A catalogue of pendants, lockets, chains, earrings and collectibles can easily feel cluttered.",
        solution: "A clean, product-first category shop.",
      },
      {
        problem: "Returning customers need a reason to come back.",
        solution: "Trending tabs for new arrivals, featured and sale items, with Pro Membership and a wishlist.",
      },
      {
        problem: "Jewellery buyers hesitate at checkout over shipping and returns.",
        solution: "Free shipping, returns and the quality guarantee shown before checkout.",
      },
    ],
    outcome: ["The store is live, with the full catalogue, the members programme and the account area."],
  },

  "ecommerce-store-im-a-househead-us-apparel-brand": {
    overview: [
      "I'M A HOUSEHEAD is a US house music apparel brand built around one signature design on hoodies, tees and totes. The shop needed to feel like the culture it comes from and still make buying simple.",
      "We built it with React and Stripe: a collection page with hoodie, T-shirt and tote filters, product cards with colourway, size and fabric details, brand story sections, an email sign-up for new drops and secure checkout.",
    ],
    challenges: [
      {
        problem: "One design across many products can make a shop look repetitive.",
        solution: "Filters for hoodies, T-shirts and totes, with product cards that put colourway, size and fabric up front.",
      },
      {
        problem: "The brand sells the culture as much as the clothes.",
        solution: "Brand story sections about the design and the music, in a bold editorial layout.",
      },
      {
        problem: "Fans need to know when the next drop is coming.",
        solution: "An email sign-up for new drops.",
      },
    ],
    outcome: ["The shop is live, with secure online checkout through Stripe and the email sign-up for new drops."],
  },
};
