/**
 * Portfolios — the website designs a visitor can open live, try on desktop,
 * tablet and phone, and ask us to build for them.
 *
 * To add a design:
 *  1. Put the finished, self-contained template in /public/portfolio/<category>/<slug>/index.html
 *     (its CSS, JS and images next to it, linked with relative paths), with
 *     <meta name="robots" content="noindex"> so the demo is not indexed as a page of its own.
 *     Link to it as …/index.html: a bare folder URL is not served by Next.js.
 *  2. Put its preview next to it as preview.webp (1200×750, the top of the page at
 *     1440×900; headless Edge --screenshot makes it). Without `image`, the card shows
 *     the live page scaled down instead.
 *  3. Add an entry below. Categories show in the order of `portfolioCategories`;
 *     an empty one is hidden.
 *
 * The businesses in these designs are made up; the designs are concepts, not client work.
 */
export interface PortfolioDesign {
  slug: string;
  name: string;
  /** One of portfolioCategories. */
  category: string;
  /** One line on the card: who it is for and what it shows off. */
  summary: string;
  /** The live demo, e.g. /portfolio/agency/studio-north/index.html — or a full https:// URL. */
  demo: string;
  /** Preview picture (16:10). Without it, the card shows the live page, scaled down. */
  image?: string;
  /** A few words on what is inside: features, layout, style. */
  tags: string[];
}

export const portfolioCategories = [
  "Hospitality",
  "Hotels & restaurants",
  "E-commerce",
  "Construction",
  "Real estate",
  "Fitness",
  "Cleaning",
  "Accountancy",
  "Legal",
  "Marketing",
  "Non-profit",
  "Agency & studio",
  "Business & services",
  "SaaS & apps",
  "Personal & creative",
];

const p = (category: string, slug: string) => ({
  demo: `/portfolio/${category}/${slug}/index.html`,
  image: `/portfolio/${category}/${slug}/preview.webp`,
});

export const portfolioDesigns: PortfolioDesign[] = [
  {
    slug: "larkspur-house",
    name: "Larkspur House",
    category: "Hotels & restaurants",
    summary:
      "A boutique townhouse hotel: arched gallery hero, rooms and offers, and a booking bar that stays in reach.",
    ...p("hospitality", "larkspur-house"),
    tags: ["Hotel", "Room booking", "Classic serif"],
  },
  {
    slug: "flint-and-fennel",
    name: "Flint & Fennel",
    category: "Hotels & restaurants",
    summary:
      "A candlelit restaurant site: menus, table reservations, private dining and gift vouchers.",
    ...p("hospitality", "flint-and-fennel"),
    tags: ["Restaurant", "Reservations", "Dark theme"],
  },
  {
    slug: "tern-and-tiller",
    name: "The Tern & Tiller",
    category: "Hotels & restaurants",
    summary:
      "A harbourside inn with rooms: date and guest search, a swipeable photo stack and today's tide times.",
    ...p("hospitality", "tern-and-tiller"),
    tags: ["Inn", "Room search", "Card stack"],
  },
  {
    slug: "brackenmere-spa",
    name: "Brackenmere Spa & Retreat",
    category: "Hotels & restaurants",
    summary:
      "A lakeside spa and retreat: full-bleed scenery, treatments, spa breaks and booking a day.",
    ...p("hospitality", "brackenmere-spa"),
    tags: ["Spa", "Full-bleed hero", "Booking"],
  },
  {
    slug: "copper-owl-club",
    name: "The Copper Owl Club",
    category: "Hotels & restaurants",
    summary:
      "A cocktail bar behind an unmarked door: a glowing neon sign, the drinks list and booth bookings.",
    ...p("hospitality", "copper-owl-club"),
    tags: ["Bar", "Neon sign", "Bookings"],
  },
  {
    slug: "proof-and-peel",
    name: "Proof & Peel",
    category: "Hotels & restaurants",
    summary:
      "A bakery and brunch spot: order ahead for collection, today's bakes and two shops with opening times.",
    ...p("hospitality", "proof-and-peel"),
    tags: ["Bakery", "Order ahead", "Bold type"],
  },
  {
    slug: "teme-and-oak",
    name: "Teme & Oak",
    category: "E-commerce",
    summary:
      'A made-to-order furniture shop with a "Will it fit?" room planner, product filters and a basket drawer.',
    ...p("ecommerce", "teme-and-oak"),
    tags: ["Online shop", "Room planner", "Basket"],
  },
  {
    slug: "studio-north",
    name: "Studio North",
    category: "Agency & studio",
    summary:
      "A motion-led landing page for a creative or marketing agency: animated hero, scroll reveals and a services marquee.",
    ...p("agency", "studio-north"),
    tags: ["Scroll animation", "Marquee", "Dark mode"],
  },
  {
    slug: "halftone-and-co",
    name: "Halftone & Co.",
    category: "Agency & studio",
    summary:
      "A brand identity studio: a filterable work grid, a services accordion and a six-question brand health check.",
    ...p("agency", "halftone-and-co"),
    tags: ["Branding studio", "Brand quiz", "Editorial serif"],
  },
  {
    slug: "northlight-films",
    name: "Northlight Films",
    category: "Agency & studio",
    summary:
      "A video production company: a cinematic hero, a showreel player and an instant budget estimator.",
    ...p("agency", "northlight-films"),
    tags: ["Video production", "Budget estimator", "Showreel"],
  },
  {
    slug: "pixel-and-pine",
    name: "Pixel & Pine",
    category: "Agency & studio",
    summary:
      "A product and UX design studio: an animated app mock-up, a before-and-after slider and case study tabs.",
    ...p("agency", "pixel-and-pine"),
    tags: ["UX studio", "Before and after", "Bento grid"],
  },
  {
    slug: "tidewater-pr",
    name: "Tidewater PR",
    category: "Agency & studio",
    summary:
      'A PR agency styled like a newspaper: a coverage ticker, a 24-hour crisis line and an "Is it news?" checker.',
    ...p("agency", "tidewater-pr"),
    tags: ["PR agency", "News ticker", "Story checker"],
  },
  {
    slug: "kiln-collective",
    name: "Kiln Collective",
    category: "Agency & studio",
    summary:
      "A photography studio: a filterable gallery with a lightbox, service rates and a studio hire calendar.",
    ...p("agency", "kiln-collective"),
    tags: ["Photography", "Lightbox gallery", "Booking calendar"],
  },
  {
    slug: "brightledger",
    name: "Brightledger",
    category: "Accountancy",
    summary: "Online accountants for sole traders and limited companies.",
    ...p("accountancy", "brightledger"),
    tags: ["Online accountants", "Package picker", "Clean UI"],
  },
  {
    slug: "kirkstall-and-co",
    name: "Kirkstall & Co.",
    category: "Accountancy",
    summary: "Accountants in Leeds since 1968.",
    ...p("accountancy", "kirkstall-and-co"),
    tags: ["Chartered firm", "Sectors", "Classic serif"],
  },
  {
    slug: "clearday-tax",
    name: "Clearday Tax",
    category: "Accountancy",
    summary: "Self Assessment accountants in Bristol and online.",
    ...p("accountancy", "clearday-tax"),
    tags: ["Tax estimator", "Deadlines", "Pricing"],
  },
  {
    slug: "stackwell",
    name: "Stackwell",
    category: "Accountancy",
    summary: "Accountants for startups and scale-ups in Shoreditch, London.",
    ...p("accountancy", "stackwell"),
    tags: ["Startups", "R&D tax relief", "Bold type"],
  },
  {
    slug: "holborn-and-vane",
    name: "Holborn & Vane",
    category: "Accountancy",
    summary: "Tax and wealth advisory, Mayfair.",
    ...p("accountancy", "holborn-and-vane"),
    tags: ["Private client", "Wealth", "Luxury feel"],
  },
  {
    slug: "fennick",
    name: "Fennick",
    category: "Accountancy",
    summary:
      "Accountants for contractors, freelancers and sole traders, Liverpool.",
    ...p("accountancy", "fennick"),
    tags: ["Contractors", "Take-home calculator", "Pricing"],
  },
  {
    slug: "brickfield-build",
    name: "Brickfield Build",
    category: "Construction",
    summary: "House extensions & loft conversions in Wimbledon, SW19.",
    ...p("construction", "brickfield-build"),
    tags: ["Extensions", "Cost guide", "Plan view"],
  },
  {
    slug: "ravensgate",
    name: "Ravensgate Construction",
    category: "Construction",
    summary: "Commercial Main Contractor, Birmingham.",
    ...p("construction", "ravensgate"),
    tags: ["Main contractor", "Sectors", "Projects"],
  },
  {
    slug: "flintrock-civils",
    name: "Flintrock Civils",
    category: "Construction",
    summary: "Groundworks & Civil Engineering Contractor, Leeds.",
    ...p("construction", "flintrock-civils"),
    tags: ["Groundworks", "Civils", "Safety"],
  },
  {
    slug: "tile-and-gable",
    name: "Tile & Gable Roofing",
    category: "Construction",
    summary: "Roofers in Bristol, Slate, Tile & Flat Roofs.",
    ...p("construction", "tile-and-gable"),
    tags: ["Roofing", "Surveys", "Guarantees"],
  },
  {
    slug: "pinecroft-homes",
    name: "Pinecroft Timber Homes",
    category: "Construction",
    summary: "Timber-frame self-build homes, Inverness & the Highlands.",
    ...p("construction", "pinecroft-homes"),
    tags: ["Self-build", "Energy", "Gallery"],
  },
  {
    slug: "northpoint-interiors",
    name: "Northpoint Interiors",
    category: "Construction",
    summary: "Office Fit-Out & Refurbishment, Manchester.",
    ...p("construction", "northpoint-interiors"),
    tags: ["Office fit-out", "Process", "Cost guide"],
  },
  {
    slug: "fernly",
    name: "Fernly",
    category: "E-commerce",
    summary: "Throws, Linen Bedding & Cosy Home Comforts, Made in Yorkshire.",
    ...p("ecommerce", "fernly"),
    tags: ["Home comforts", "Basket", "Warm tones"],
  },
  {
    slug: "calder-skin",
    name: "Calder Skin",
    category: "E-commerce",
    summary:
      "Small-Batch Skincare Made in Bath: Serums, Moisturisers & Gift Sets.",
    ...p("ecommerce", "calder-skin"),
    tags: ["Skincare", "Gift sets", "Soft palette"],
  },
  {
    slug: "glow-and-grain",
    name: "Glow & Grain",
    category: "E-commerce",
    summary: "Designer Lighting & Home Decor, Hand-finished in Bristol.",
    ...p("ecommerce", "glow-and-grain"),
    tags: ["Lighting", "Lookbook", "Shop"],
  },
  {
    slug: "ashby-and-co",
    name: "Ashby & Co.",
    category: "E-commerce",
    summary: "Luxury Gifts & Hampers, Hand-Wrapped in Marylebone, London.",
    ...p("ecommerce", "ashby-and-co"),
    tags: ["Gifts", "Hampers", "Luxury feel"],
  },
  {
    slug: "steel-and-supper",
    name: "Steel & Supper",
    category: "E-commerce",
    summary: "Sheffield Cutlery, Bone China & Kitchenware.",
    ...p("ecommerce", "steel-and-supper"),
    tags: ["Kitchenware", "Collections", "Journal"],
  },
  {
    slug: "brume",
    name: "Brume",
    category: "E-commerce",
    summary:
      "Modern Winterwear Made in Britain: Wool Coats, Knitwear & Accessories.",
    ...p("ecommerce", "brume"),
    tags: ["Fashion", "Winterwear", "Editorial"],
  },
  {
    slug: "calloway-hospital",
    name: "Calloway Hospital",
    category: "Hospitality",
    summary: "Private hospital in Marylebone, London.",
    ...p("healthcare", "calloway-hospital"),
    tags: ["Private hospital", "Referrals", "Booking"],
  },
  {
    slug: "little-oaks",
    name: "Little Oaks Children's Hospital",
    category: "Hospitality",
    summary: "Independent children's hospital in Manchester.",
    ...p("healthcare", "little-oaks"),
    tags: ["Children's hospital", "Your visit", "Friendly"],
  },
  {
    slug: "brightview-eye",
    name: "Brightview Eye Hospital",
    category: "Hospitality",
    summary: "Cataract, laser and lens surgery in Birmingham.",
    ...p("healthcare", "brightview-eye"),
    tags: ["Eye surgery", "Laser check", "Prices"],
  },
  {
    slug: "marlbank-orthopaedic",
    name: "Marlbank Orthopaedic",
    category: "Hospitality",
    summary: "Private orthopaedic hospital in Leeds.",
    ...p("healthcare", "marlbank-orthopaedic"),
    tags: ["Orthopaedics", "Sports injuries", "Consultants"],
  },
  {
    slug: "rosewood-womens",
    name: "Rosewood Women's Hospital",
    category: "Hospitality",
    summary: "Private maternity, scans and gynaecology in Edinburgh.",
    ...p("healthcare", "rosewood-womens"),
    tags: ["Maternity", "Scans", "Week by week"],
  },
  {
    slug: "kestrel-heart",
    name: "Kestrel Heart Hospital",
    category: "Hospitality",
    summary: "Private cardiac care in Cardiff.",
    ...p("healthcare", "kestrel-heart"),
    tags: ["Cardiac care", "Patient portal", "Bilingual"],
  },
  {
    slug: "mercer-lowe",
    name: "Mercer Lowe Solicitors",
    category: "Legal",
    summary: "Family, Property, Wills & Employment Lawyers in Leeds.",
    ...p("legal", "mercer-lowe"),
    tags: ["Solicitors", "Family law", "Monochrome"],
  },
  {
    slug: "wexley-hart",
    name: "Wexley Hart Solicitors",
    category: "Legal",
    summary: "Private client and family solicitors, Chancery Lane.",
    ...p("legal", "wexley-hart"),
    tags: ["Private client", "Inheritance tax", "Fees"],
  },
  {
    slug: "barrow-and-hale",
    name: "Barrow & Hale",
    category: "Legal",
    summary: "Manchester & Chester Law Firm.",
    ...p("legal", "barrow-and-hale"),
    tags: ["Law firm", "Our people", "Insights"],
  },
  {
    slug: "fenwick-shaw",
    name: "Fenwick Shaw Solicitors",
    category: "Legal",
    summary: "Employment and Business Law, Birmingham.",
    ...p("legal", "fenwick-shaw"),
    tags: ["Employment law", "Results", "Fees"],
  },
  {
    slug: "sterling-vance",
    name: "Sterling Vance",
    category: "Legal",
    summary:
      "Commercial Litigation & Arbitration Solicitors, Fleet Street, London.",
    ...p("legal", "sterling-vance"),
    tags: ["Litigation", "Cases", "Dark theme"],
  },
  {
    slug: "ridley-marsh",
    name: "Ridley Marsh Solicitors",
    category: "Legal",
    summary: "Construction and Property Lawyers in Bristol.",
    ...p("legal", "ridley-marsh"),
    tags: ["Property law", "Construction", "Our people"],
  },
  {
    slug: "murmur-social",
    name: "Murmur Social",
    category: "Marketing",
    summary: "Social media marketing agency in Manchester.",
    ...p("marketing", "murmur-social"),
    tags: ["Social agency", "Work", "Playful"],
  },
  {
    slug: "bidwell",
    name: "Bidwell",
    category: "Marketing",
    summary: "PPC & Paid Media Agency in London.",
    ...p("marketing", "bidwell"),
    tags: ["PPC agency", "ROI calculator", "Dark"],
  },
  {
    slug: "quay-and-kite",
    name: "Quay & Kite",
    category: "Marketing",
    summary: "Brand and creative studio in Bristol.",
    ...p("marketing", "quay-and-kite"),
    tags: ["Brand studio", "Journal", "Editorial"],
  },
  {
    slug: "findwell",
    name: "Findwell",
    category: "Marketing",
    summary: "SEO and Content Marketing Agency in Leeds.",
    ...p("marketing", "findwell"),
    tags: ["SEO agency", "Results", "Pricing"],
  },
  {
    slug: "frameyard",
    name: "Frameyard",
    category: "Marketing",
    summary: "Video marketing agency in Glasgow.",
    ...p("marketing", "frameyard"),
    tags: ["Video agency", "Showreel", "Cinematic"],
  },
  {
    slug: "orbit-growth",
    name: "Orbit Growth",
    category: "Marketing",
    summary:
      "Growth marketing agency for ecommerce and DTC brands, Birmingham.",
    ...p("marketing", "orbit-growth"),
    tags: ["Growth agency", "DTC brands", "Work"],
  },
  {
    slug: "common-table",
    name: "Common Table Food Network",
    category: "Non-profit",
    summary: "Food banks, pantries and advice in Leeds.",
    ...p("non-profit", "common-table"),
    tags: ["Food bank", "Volunteer", "Donate"],
  },
  {
    slug: "new-leash-rescue",
    name: "New Leash Animal Rescue",
    category: "Non-profit",
    summary: "Dog and cat rehoming near Lewes, East Sussex.",
    ...p("non-profit", "new-leash-rescue"),
    tags: ["Animal rescue", "Adopt", "Foster"],
  },
  {
    slug: "bluewater-sea-trust",
    name: "Bluewater Sea Trust",
    category: "Non-profit",
    summary: "Marine conservation charity in Falmouth, Cornwall.",
    ...p("non-profit", "bluewater-sea-trust"),
    tags: ["Marine charity", "Beach cleans", "Schools"],
  },
  {
    slug: "clearway-youth",
    name: "Clearway Youth",
    category: "Non-profit",
    summary: "Youth mentoring in east London.",
    ...p("non-profit", "clearway-youth"),
    tags: ["Youth mentoring", "Stories", "Impact"],
  },
  {
    slug: "kindred-support",
    name: "Kindred",
    category: "Non-profit",
    summary: "Mental health support in Greater Manchester.",
    ...p("non-profit", "kindred-support"),
    tags: ["Mental health", "Find a group", "Calm"],
  },
  {
    slug: "golden-hour",
    name: "Golden Hour Befriending",
    category: "Non-profit",
    summary: "Befriending for older people in Edinburgh and the Lothians.",
    ...p("non-profit", "golden-hour"),
    tags: ["Befriending", "Volunteer", "Warm"],
  },
  {
    slug: "hollybrook-home-cleaning-cheltenham",
    name: "Hollybrook Home Cleaning",
    category: "Cleaning",
    summary: "Weekly and fortnightly house cleaning in Cheltenham.",
    demo: "/portfolio/cleaning/hollybrook-home-cleaning-cheltenham/index.html",
    image:
      "/portfolio/cleaning/hollybrook-home-cleaning-cheltenham/preview.webp",
    tags: ["House cleaning", "Postcode checker", "Instant quote"],
  },
  {
    slug: "glassline-window-cleaning-bristol",
    name: "Glassline Window Cleaning",
    category: "Cleaning",
    summary: "Pure-water window cleaning in north and central Bristol.",
    demo: "/portfolio/cleaning/glassline-window-cleaning-bristol/index.html",
    image: "/portfolio/cleaning/glassline-window-cleaning-bristol/preview.webp",
    tags: ["Window cleaning", "Round-day calendar", "Glass header"],
  },
  {
    slug: "movewell-end-of-tenancy-leeds",
    name: "Movewell",
    category: "Cleaning",
    summary:
      "End of tenancy cleaning in Leeds, fixed prices and a 72-hour re-clean guarantee.",
    demo: "/portfolio/cleaning/movewell-end-of-tenancy-leeds/index.html",
    image: "/portfolio/cleaning/movewell-end-of-tenancy-leeds/preview.webp",
    tags: ["End of tenancy", "Fixed prices", "Checklist progress"],
  },
  {
    slug: "nightwell-commercial-cleaning-london",
    name: "Nightwell Commercial Cleaning",
    category: "Cleaning",
    summary: "Office, retail, healthcare and school cleaning in London.",
    demo: "/portfolio/cleaning/nightwell-commercial-cleaning-london/index.html",
    image:
      "/portfolio/cleaning/nightwell-commercial-cleaning-london/preview.webp",
    tags: ["Commercial cleaning", "Sector switcher", "24/7 helpdesk"],
  },
  {
    slug: "moss-and-meadow-eco-cleaning-brighton",
    name: "Moss & Meadow",
    category: "Cleaning",
    summary:
      "Eco-friendly home cleaning and holiday-let changeovers in Brighton & Hove.",
    demo: "/portfolio/cleaning/moss-and-meadow-eco-cleaning-brighton/index.html",
    image:
      "/portfolio/cleaning/moss-and-meadow-eco-cleaning-brighton/preview.webp",
    tags: ["Eco cleaning", "Live counter", "Holiday lets"],
  },
  {
    slug: "loom-and-lather-carpet-care-edinburgh",
    name: "Loom & Lather Carpet Care",
    category: "Cleaning",
    summary: "Carpet, rug and upholstery cleaning in Edinburgh.",
    demo: "/portfolio/cleaning/loom-and-lather-carpet-care-edinburgh/index.html",
    image:
      "/portfolio/cleaning/loom-and-lather-carpet-care-edinburgh/preview.webp",
    tags: ["Carpet care", "Area marquee", "Badge logo"],
  },
  {
    slug: "forgeline-strength-sheffield",
    name: "Forgeline Strength Club",
    category: "Fitness",
    summary: "24/7 powerlifting and strongman gym, Kelham Island, Sheffield.",
    demo: "/portfolio/fitness/forgeline-strength-sheffield/index.html",
    image: "/portfolio/fitness/forgeline-strength-sheffield/preview.webp",
    tags: ["Gym", "Live occupancy", "Bold dark"],
  },
  {
    slug: "solace-reformer-pilates-bristol",
    name: "Solace Reformer Studio",
    category: "Fitness",
    summary: "Reformer Pilates classes in Clifton, Bristol.",
    demo: "/portfolio/fitness/solace-reformer-pilates-bristol/index.html",
    image: "/portfolio/fitness/solace-reformer-pilates-bristol/preview.webp",
    tags: ["Pilates studio", "Side rail nav", "Class booking"],
  },
  {
    slug: "kinetic-boxing-shoreditch",
    name: "Kinetic Boxing & HIIT",
    category: "Fitness",
    summary: "Boxing and HIIT classes in Shoreditch, London.",
    demo: "/portfolio/fitness/kinetic-boxing-shoreditch/index.html",
    image: "/portfolio/fitness/kinetic-boxing-shoreditch/preview.webp",
    tags: ["Boxing & HIIT", "Class countdown", "Neon"],
  },
  {
    slug: "ridgeline-coaching-keswick",
    name: "Ridgeline Coaching",
    category: "Fitness",
    summary: "Trail and fell running coaching in Keswick, Lake District.",
    demo: "/portfolio/fitness/ridgeline-coaching-keswick/index.html",
    image: "/portfolio/fitness/ridgeline-coaching-keswick/preview.webp",
    tags: ["Running coach", "Newspaper masthead", "Contour map"],
  },
  {
    slug: "hearth-heat-and-ice-harrogate",
    name: "Hearth Heat & Ice",
    category: "Fitness",
    summary: "Sauna, cold plunge and contrast therapy in Harrogate.",
    demo: "/portfolio/fitness/hearth-heat-and-ice-harrogate/index.html",
    image: "/portfolio/fitness/hearth-heat-and-ice-harrogate/preview.webp",
    tags: ["Sauna & plunge", "Full-screen menu", "Breathing pacer"],
  },
  {
    slug: "redbrick-gyms-manchester",
    name: "Redbrick Gyms",
    category: "Fitness",
    summary:
      "No-contract gyms in Ancoats, Chorlton, Salford Quays and Didsbury.",
    demo: "/portfolio/fitness/redbrick-gyms-manchester/index.html",
    image: "/portfolio/fitness/redbrick-gyms-manchester/preview.webp",
    tags: ["Gym chain", "Mega menu", "Location switcher"],
  },
  {
    slug: "belgrave-and-lyle-chelsea-london",
    name: "Belgrave & Lyle",
    category: "Real estate",
    summary:
      "Prime homes for sale in Chelsea, South Kensington, Belgravia and Notting Hill.",
    demo: "/portfolio/real-estate/belgrave-and-lyle-chelsea-london/index.html",
    image:
      "/portfolio/real-estate/belgrave-and-lyle-chelsea-london/preview.webp",
    tags: ["Prime sales", "Saved homes", "Wax-seal footer"],
  },
  {
    slug: "latchkey-lettings-manchester",
    name: "Latchkey Lettings",
    category: "Real estate",
    summary:
      "Letting agents and property management in Manchester and Salford.",
    demo: "/portfolio/real-estate/latchkey-lettings-manchester/index.html",
    image: "/portfolio/real-estate/latchkey-lettings-manchester/preview.webp",
    tags: ["Lettings", "Folder-tab nav", "Signature footer"],
  },
  {
    slug: "weavers-wharf-new-homes-nottingham",
    name: "Weavers Wharf",
    category: "Real estate",
    summary: "Canal-side new homes by the Lace Market, Nottingham.",
    demo: "/portfolio/real-estate/weavers-wharf-new-homes-nottingham/index.html",
    image:
      "/portfolio/real-estate/weavers-wharf-new-homes-nottingham/preview.webp",
    tags: ["New homes", "Floor-plan menu", "Blueprint style"],
  },
  {
    slug: "thornbury-hale-country-homes-cotswolds",
    name: "Thornbury Hale",
    category: "Real estate",
    summary: "Country homes, farms and land for sale across the Cotswolds.",
    demo: "/portfolio/real-estate/thornbury-hale-country-homes-cotswolds/index.html",
    image:
      "/portfolio/real-estate/thornbury-hale-country-homes-cotswolds/preview.webp",
    tags: ["Country homes", "Weathervane header", "Estate gate menu"],
  },
  {
    slug: "porchlight-fixed-fee-estate-agents-birmingham",
    name: "Porchlight",
    category: "Real estate",
    summary: "Fixed-fee estate agents in Birmingham, \u00a31,499 inc VAT.",
    demo: "/portfolio/real-estate/porchlight-fixed-fee-estate-agents-birmingham/index.html",
    image:
      "/portfolio/real-estate/porchlight-fixed-fee-estate-agents-birmingham/preview.webp",
    tags: ["Fixed-fee agent", "Command search", "Sold board"],
  },
  {
    slug: "byres-and-kerr-glasgow-west-end",
    name: "Byres & Kerr",
    category: "Real estate",
    summary:
      "Solicitor-led estate agents for Glasgow's West End and Southside.",
    demo: "/portfolio/real-estate/byres-and-kerr-glasgow-west-end/index.html",
    image:
      "/portfolio/real-estate/byres-and-kerr-glasgow-west-end/preview.webp",
    tags: ["Estate agent", "Buzzer-panel menu", "Tenement style"],
  },
];

/** Which design categories each service page leads with; any service not named gets a mix of every category. */
const SERVICE_CATEGORIES: Record<string, string[]> = {
  "woocommerce-development": ["E-commerce"],
  "shopify-development": ["E-commerce"],
  "landing-page-development": [
    "Marketing",
    "Hotels & restaurants",
    "E-commerce",
  ],
  "conversion-rate-optimisation": ["E-commerce", "Marketing"],
  "meta-ads-management": ["Fitness", "E-commerce", "Hotels & restaurants"],
  "white-label-google-ads-management": ["Real estate", "Cleaning", "Legal"],
  "white-label-digital-marketing": ["Marketing", "E-commerce"],
  "white-label-seo-services": ["Real estate", "Legal", "Accountancy"],
  "technical-seo-services": ["Hospitality", "Legal", "E-commerce"],
  "local-seo-services": ["Cleaning", "Construction", "Fitness"],
  "elementor-development": [
    "Marketing",
    "Hotels & restaurants",
    "Construction",
  ],
  "webflow-development": ["Agency & studio", "Marketing"],
  "white-label-web-design": [
    "Agency & studio",
    "Hotels & restaurants",
    "Legal",
  ],
  "website-maintenance": ["Hospitality", "Non-profit", "Accountancy"],
  "ai-assistants-and-chat": ["Hospitality", "Hotels & restaurants", "Legal"],
};

/**
 * The designs shown on a service page: first from the categories that fit the
 * service, then one from each other category in turn, so every page shows a spread.
 * The starting point moves with the slug, so neighbouring services do not repeat.
 */
export function designsForService(slug: string, count = 6): PortfolioDesign[] {
  const offset = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  // each category's designs, rotated by the slug so neighbouring services start on different ones
  const queues = new Map(
    portfolioCategories.map((c) => {
      const list = portfolioDesigns.filter((d) => d.category === c);
      return [c, list.map((_, i) => list[(i + offset) % list.length])] as const;
    }),
  );
  const picked: PortfolioDesign[] = [];
  const take = (c: string) => {
    const d = queues.get(c)?.shift();
    if (d) picked.push(d);
  };
  const preferred = SERVICE_CATEGORIES[slug] ?? [];
  // up to two from each category that fits the service
  for (let round = 0; round < 2; round++)
    for (const c of preferred) if (picked.length < count) take(c);
  // then one from each other category in turn
  const rest = portfolioCategories.filter(
    (c) => !preferred.includes(c) && queues.get(c)?.length,
  );
  for (
    let i = 0;
    picked.length < count && rest.some((c) => queues.get(c)?.length);
    i++
  )
    take(rest[(offset + i) % rest.length]);
  return picked;
}
