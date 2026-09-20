/**
 * The GraphQL this site sends. Kept together so the shape of every read is
 * visible in one place, and so the field names can be checked against
 * wordpress/softvolt-headless/inc/fields.php without hunting through files.
 *
 * `orderIndex` is the editor's own ordering (menu_order); everything that can
 * be sequenced by hand is sorted by it.
 */

const SEO = `
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    schema { raw }
  }
`;

export const SITE_SETTINGS = /* GraphQL */ `
  query SiteSettings {
    siteSettings {
      brandName
      tagline
      description
      email
      location
      timeZone
      utcOffset
      calUrl
      siteUrl
      markets
      footerBlurb
      footerNote
      socialLinks { label href }
      ctaPrimary { label href }
      ctaSecondary { label href }
      headerCta { label href }
      cf7BriefId
      cf7ContactId
      comparisonSource { label href }
    }
  }
`;

export const MENUS = /* GraphQL */ `
  query Menus {
    menus {
      nodes {
        locations
        menuItems(first: 100, where: { parentDatabaseId: 0 }) {
          nodes {
            id
            label
            uri
            url
            target
            description
            childItems(first: 50) {
              nodes { id label uri url target description }
            }
          }
        }
      }
    }
  }
`;

export const SERVICES = /* GraphQL */ `
  query Services {
    services(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        title
        orderIndex
        pillars { nodes { slug name description } }
        serviceFields {
          heading
          summary
          intro
          deliverables
          signals
          stack
          seoDescription
          agencyTypes { nodes { ... on AgencyType { slug } } }
        }
      }
    }
  }
`;

export const AGENCY_TYPES = /* GraphQL */ `
  query AgencyTypes {
    agencyTypes(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        title
        orderIndex
        agencyTypeFields {
          problem
          relief
          intro
          workflow
          seoDescription
          services { nodes { ... on Service { slug } } }
        }
      }
    }
  }
`;

export const CASE_STUDIES = /* GraphQL */ `
  query CaseStudies {
    caseStudies(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        title
        orderIndex
        featuredImage { node { sourceUrl altText } }
        workCategories { nodes { name } }
        regions { nodes { name } }
        caseStudyFields { client role summary delivered stack liveUrl }
      }
    }
  }
`;

export const SIMPLE_COLLECTIONS = /* GraphQL */ `
  query SimpleCollections {
    processSteps(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex processStepFields { stepKey turnaround summary artefact } }
    }
    plans(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex planFields { planKey bestFor includes priceFrom period badge } }
    }
    faqs(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex faqGroups { nodes { slug } } faqFields { answer } }
    }
    promises(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex promiseFields { promiseKey detail } }
    }
    clauses(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex clauseFields { body } }
    }
    teamMembers(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        title
        orderIndex
        featuredImage { node { sourceUrl } }
        teamFields { role headline bio quote facts linkedin }
      }
    }
    testimonials(first: 50, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex testimonialFields { quote personName personRole agency country work consent } }
    }
    clients(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        slug
        title
        orderIndex
        featuredImage { node { sourceUrl } }
        clientFields { country work url featured logoFill }
      }
    }
    stackItems(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex stackFields { group } }
    }
    comparisonRows(first: 30, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex comparisonFields { inHouse freelancer us } }
    }
    clocks(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { slug title orderIndex clockFields { timeZone short } }
    }
  }
`;

export const PAGE_BY_URI = /* GraphQL */ `
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      databaseId
      slug
      title
      content
      modifiedGmt
      featuredImage { node { sourceUrl altText } }
      pageFields { eyebrow heading lede highlights introEyebrow introTitle introSubtitle introBody introPoints jumpLinks sections }
      securityFields { practices }
      partnerFields { steps }
      aboutFields { values }
      ${SEO}
    }
  }
`;

export const POSTS = /* GraphQL */ `
  query Posts($first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        slug
        title
        excerpt
        dateGmt
        modifiedGmt
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
        author { node { name } }
      }
    }
  }
`;

export const POST_BY_SLUG = /* GraphQL */ `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      content
      excerpt
      dateGmt
      modifiedGmt
      featuredImage { node { sourceUrl altText } }
      categories { nodes { name slug } }
      author { node { name } }
      ${SEO}
    }
  }
`;

/** Slugs and last-modified dates, for the sitemap and for static generation. */
export const ALL_SLUGS = /* GraphQL */ `
  query AllSlugs {
    services(first: 200) { nodes { slug modifiedGmt } }
    agencyTypes(first: 200) { nodes { slug modifiedGmt } }
    caseStudies(first: 200) { nodes { slug modifiedGmt } }
    posts(first: 500, where: { status: PUBLISH }) { nodes { slug modifiedGmt } }
    pages(first: 200, where: { status: PUBLISH }) { nodes { uri modifiedGmt } }
  }
`;
