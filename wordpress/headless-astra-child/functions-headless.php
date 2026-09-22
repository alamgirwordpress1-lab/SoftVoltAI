<?php
/**
 * SoftVolt AI — headless back end.
 *
 * Everything below turns this install into the content source for the Next.js
 * front end: the content types, their ACF fields, the settings screen the
 * header and footer are built from, the GraphQL those are exposed through,
 * draft previews, on-publish revalidation, and a front end that sends visitors
 * to the real site.
 *
 * It lives in the child theme because that is where this install keeps its
 * code. Worth knowing: content types defined in a theme disappear if the theme
 * is ever switched — if that day comes, move this block into a plugin as-is,
 * it has no theme dependencies.
 *
 * Generated from wordpress/softvolt-headless/ in the front-end repo. Edit it
 * there, not here, or the next build will overwrite your change.
 *
 * Careful with the live file: it opens with the Astra child theme's own header
 * and its parent-stylesheet enqueue, which this build does not contain. Update
 * the install by applying the difference to what is already in the theme
 * editor, not by pasting this file over it, or the child theme loses its CSS.
 */

if (!defined('SOFTVOLT_HEADLESS_VERSION')) {
    define('SOFTVOLT_HEADLESS_VERSION', '1.2.0');
}

if (!defined('SOFTVOLT_SETTINGS_KEY')) {
    /** One option row holds every setting; the settings screen writes it, GraphQL reads it. */
    define('SOFTVOLT_SETTINGS_KEY', 'softvolt_headless');
}

/** Permalinks have to be rewritten once, after the content types first appear. */
add_action('init', static function (): void {
    if (get_option('softvolt_rewrites_flushed') === SOFTVOLT_HEADLESS_VERSION) {
        return;
    }
    flush_rewrite_rules(false);
    update_option('softvolt_rewrites_flushed', SOFTVOLT_HEADLESS_VERSION, false);
}, 100);

/** Says what is missing rather than failing quietly. */
add_action('admin_notices', static function (): void {
    if (!current_user_can('activate_plugins')) {
        return;
    }
    $missing = [];
    if (!class_exists('WPGraphQL')) {
        $missing[] = 'WPGraphQL';
    }
    if (!function_exists('acf_add_local_field_group')) {
        $missing[] = 'Advanced Custom Fields';
    }
    if (!$missing) {
        return;
    }
    printf(
        '<div class="notice notice-error"><p><strong>SoftVolt headless:</strong> these plugins have to be active for the front end to have anything to read: %s.</p></div>',
        esc_html(implode(', ', $missing))
    );
});

/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Small shared pieces. Kept in one file so the content-type and field
 * definitions below read as data rather than as boilerplate.
 */

/** Every setting on the settings screen, with its default. */
function softvolt_settings_schema(): array
{
    return [
        // the front end
        'site_url'          => ['label' => 'Front-end URL', 'type' => 'url', 'default' => '', 'help' => 'Where visitors actually go, e.g. https://softvoltai.com. Used for the front-end redirect, previews and revalidation.'],
        'revalidate_secret' => ['label' => 'Revalidate secret', 'type' => 'password', 'default' => '', 'help' => 'Must match WP_PREVIEW_SECRET in the Next.js environment (Vercel → Settings → Environment Variables). Publishing and previews send it so the front end knows the request is ours.'],

        // identity, shown in the header, the footer and the schema
        'brand_name'        => ['label' => 'Brand name', 'type' => 'text', 'default' => 'SoftVolt AI'],
        'tagline'           => ['label' => 'Tagline', 'type' => 'text', 'default' => 'The white-label production and growth team behind agencies.'],
        'description'       => ['label' => 'Meta description', 'type' => 'textarea', 'default' => '', 'help' => 'Under 160 characters. Used as the site-wide fallback description.'],
        'email'             => ['label' => 'Contact email', 'type' => 'text', 'default' => ''],
        'location'          => ['label' => 'Location', 'type' => 'text', 'default' => 'Dhaka, Bangladesh'],
        'time_zone'         => ['label' => 'IANA time zone', 'type' => 'text', 'default' => 'Asia/Dhaka'],
        'utc_offset'        => ['label' => 'UTC offset label', 'type' => 'text', 'default' => 'UTC+6'],
        'cal_url'           => ['label' => 'Booking link', 'type' => 'url', 'default' => '', 'help' => 'Cal.com or similar. Left empty, the front end asks for a slot in the brief instead.'],

        // the header: the logo, the button on the right, and the two lines inside the Services menu
        'logo'              => ['label' => 'Logo', 'type' => 'media', 'default' => '', 'help' => 'Optional. A PNG or SVG used in the header and the footer instead of the built-in mark. Leave it empty to keep the built-in one.'],
        'logo_dark'         => ['label' => 'Logo for dark backgrounds', 'type' => 'media', 'default' => '', 'help' => 'Optional. Used in the footer and in dark mode, where the logo above would be hard to read. Falls back to the logo above.'],
        'mega_resources_note' => ['label' => 'Services menu — line under "Resources"', 'type' => 'text', 'default' => 'Proof, pricing and where to start.'],
        'mega_footer_note'  => ['label' => 'Services menu — line in the dark bar', 'type' => 'text', 'default' => 'Not sure which service fits? Send the brief — the scope tells you.'],

        // the two calls to action, used in the header, the hero and every band
        'cta_primary_label' => ['label' => 'Primary CTA label', 'type' => 'text', 'default' => 'Send us a brief'],
        'cta_primary_href'  => ['label' => 'Primary CTA link', 'type' => 'text', 'default' => '/contact'],
        'cta_secondary_label' => ['label' => 'Secondary CTA label', 'type' => 'text', 'default' => 'Book a 20-min scoping call'],
        'cta_secondary_href'  => ['label' => 'Secondary CTA link', 'type' => 'text', 'default' => '/contact#call'],
        'header_cta_label'  => ['label' => 'Header button label', 'type' => 'text', 'default' => 'Book a call'],
        'header_cta_href'   => ['label' => 'Header button link', 'type' => 'text', 'default' => '/contact#call'],

        // the footer
        'footer_blurb'      => ['label' => 'Footer blurb', 'type' => 'textarea', 'default' => ''],
        'footer_note'       => ['label' => 'Footer legal note', 'type' => 'textarea', 'default' => ''],
        'markets'           => ['label' => 'Markets served', 'type' => 'lines', 'default' => "United Kingdom\nUnited States\nCanada\nAustralia\nEuropean Union", 'help' => 'One per line. Drives the globe arcs and the schema areaServed.'],
        'social_links'      => ['label' => 'Social links', 'type' => 'lines', 'default' => '', 'help' => 'One per line, as "Label | https://…".'],

        // the one figure quoted in the comparison table, and where it came from
        'comparison_source_label' => ['label' => 'Comparison source', 'type' => 'text', 'default' => '', 'help' => 'The publication the figure in the table is quoted from. It is printed under the table, so it has to be checkable.'],
        'comparison_source_url'   => ['label' => 'Comparison source link', 'type' => 'url', 'default' => ''],

        // the forms
        'cf7_brief_id'      => ['label' => 'Contact Form 7 — brief form ID', 'type' => 'text', 'default' => ''],
        'cf7_contact_id'    => ['label' => 'Contact Form 7 — message form ID', 'type' => 'text', 'default' => ''],
    ];
}

/**
 * A media setting as the front end wants it: the file, its alt text and its
 * size. Empty when nothing is chosen, so the built-in artwork stays.
 */
function softvolt_setting_image(string $key): ?array
{
    $id = (int) softvolt_setting($key);
    if (!$id) {
        return null;
    }
    $src = wp_get_attachment_image_url($id, 'full');
    if (!$src) {
        return null;
    }
    $meta = wp_get_attachment_metadata($id);
    return [
        'src'    => $src,
        'alt'    => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
        'width'  => (int) ($meta['width'] ?? 0),
        'height' => (int) ($meta['height'] ?? 0),
    ];
}

/** One setting, with the default when it has never been saved. */
function softvolt_setting(string $key, mixed $fallback = null): mixed
{
    $all    = get_option(SOFTVOLT_SETTINGS_KEY, []);
    $schema = softvolt_settings_schema();
    if (is_array($all) && array_key_exists($key, $all) && $all[$key] !== '') {
        return $all[$key];
    }
    if ($fallback !== null) {
        return $fallback;
    }
    return $schema[$key]['default'] ?? '';
}

/**
 * The front end's origin, without a trailing slash. A constant in wp-config
 * wins over the settings screen, so staging can point somewhere else without
 * an editor having to change anything.
 */
function softvolt_front_end_url(): string
{
    $url = defined('SOFTVOLT_FRONTEND_URL') ? (string) SOFTVOLT_FRONTEND_URL : (string) softvolt_setting('site_url');
    return untrailingslashit(trim($url));
}

function softvolt_revalidate_secret(): string
{
    return defined('SOFTVOLT_REVALIDATE_SECRET') ? (string) SOFTVOLT_REVALIDATE_SECRET : (string) softvolt_setting('revalidate_secret');
}

/**
 * A textarea holds a list: one item per line. Free ACF has no repeater, and a
 * line per item is what an editor would type anyway.
 */
function softvolt_lines(?string $value): array
{
    if (!$value) {
        return [];
    }
    $lines = preg_split('/\r\n|\r|\n/', $value) ?: [];
    return array_values(array_filter(array_map('trim', $lines), static fn ($line) => $line !== ''));
}

/** Field defaults, so each field definition only carries what makes it different. */
function softvolt_field(array $field): array
{
    return array_merge([
        'show_in_graphql' => true,
        'required'        => 0,
        'wrapper'         => ['width' => '', 'class' => '', 'id' => ''],
    ], $field);
}

/** A field group that WPGraphQL for ACF will expose on the given types. */
function softvolt_field_group(string $key, string $title, string $graphql_name, array $graphql_types, array $location, array $fields): array
{
    return [
        'key'                   => $key,
        'title'                 => $title,
        'fields'                => $fields,
        'location'              => $location,
        'menu_order'            => 0,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'active'                => true,
        'show_in_rest'          => 1,
        'show_in_graphql'       => 1,
        'graphql_field_name'    => $graphql_name,
        'map_graphql_types_from_location_rules' => 0,
        'graphql_types'         => $graphql_types,
    ];
}

/* ==========================================================================
   Post types
   ========================================================================== */

/**
 * The content the front end reads. Pages and posts stay as WordPress ships
 * them; everything else on the site is one of these.
 *
 * Every type is registered with `show_in_graphql` (WPGraphQL) and
 * `show_in_rest` (the block editor, previews and the seeding script).
 */

/** The types, as data: slug => [singular, plural, graphql single, graphql plural, icon, supports, taxonomies] */
function softvolt_post_type_schema(): array
{
    return [
        'service' => [
            'singular'  => 'Service',
            'plural'    => 'Services',
            'gql'       => ['service', 'services'],
            'icon'      => 'dashicons-screenoptions',
            'supports'  => ['title', 'editor', 'excerpt', 'revisions', 'page-attributes'],
            'taxonomies' => ['pillar'],
        ],
        'agency_type' => [
            'singular'  => 'Agency type',
            'plural'    => 'Agency types',
            'gql'       => ['agencyType', 'agencyTypes'],
            'icon'      => 'dashicons-groups',
            'supports'  => ['title', 'editor', 'excerpt', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'case_study' => [
            'singular'  => 'Case study',
            'plural'    => 'Case studies',
            'gql'       => ['caseStudy', 'caseStudies'],
            'icon'      => 'dashicons-portfolio',
            'supports'  => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
            'taxonomies' => ['work_category', 'region'],
        ],
        'process_step' => [
            'singular'  => 'Process step',
            'plural'    => 'Process steps',
            'gql'       => ['processStep', 'processSteps'],
            'icon'      => 'dashicons-list-view',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'plan' => [
            'singular'  => 'Plan',
            'plural'    => 'Plans',
            'gql'       => ['plan', 'plans'],
            'icon'      => 'dashicons-tickets-alt',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'faq' => [
            'singular'  => 'FAQ',
            'plural'    => 'FAQs',
            'gql'       => ['faq', 'faqs'],
            'icon'      => 'dashicons-editor-help',
            'supports'  => ['title', 'editor', 'revisions', 'page-attributes'],
            'taxonomies' => ['faq_group'],
        ],
        'promise' => [
            'singular'  => 'Commitment',
            'plural'    => 'Commitments',
            'gql'       => ['promise', 'promises'],
            'icon'      => 'dashicons-yes-alt',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'clause' => [
            'singular'  => 'Protection clause',
            'plural'    => 'Protection clauses',
            'gql'       => ['clause', 'clauses'],
            'icon'      => 'dashicons-shield',
            'supports'  => ['title', 'editor', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'team_member' => [
            'singular'  => 'Team member',
            'plural'    => 'Team',
            'gql'       => ['teamMember', 'teamMembers'],
            'icon'      => 'dashicons-businessperson',
            'supports'  => ['title', 'editor', 'thumbnail', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'testimonial' => [
            'singular'  => 'Testimonial',
            'plural'    => 'Testimonials',
            'gql'       => ['testimonial', 'testimonials'],
            'icon'      => 'dashicons-format-quote',
            'supports'  => ['title', 'editor', 'revisions'],
            'taxonomies' => [],
        ],
        'client' => [
            'singular'  => 'Client',
            'plural'    => 'Clients',
            'gql'       => ['client', 'clients'],
            'icon'      => 'dashicons-building',
            'supports'  => ['title', 'thumbnail', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'stack_item' => [
            'singular'  => 'Stack item',
            'plural'    => 'Stack',
            'gql'       => ['stackItem', 'stackItems'],
            'icon'      => 'dashicons-editor-code',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'comparison_row' => [
            'singular'  => 'Comparison row',
            'plural'    => 'Comparison',
            'gql'       => ['comparisonRow', 'comparisonRows'],
            'icon'      => 'dashicons-editor-table',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
        'clock' => [
            'singular'  => 'Clock',
            'plural'    => 'Clocks',
            'gql'       => ['clock', 'clocks'],
            'icon'      => 'dashicons-clock',
            'supports'  => ['title', 'revisions', 'page-attributes'],
            'taxonomies' => [],
        ],
    ];
}

function softvolt_taxonomy_schema(): array
{
    return [
        'pillar' => [
            'singular' => 'Pillar',
            'plural'   => 'Pillars',
            'gql'      => ['pillar', 'pillars'],
            'types'    => ['service'],
            'hierarchical' => true,
        ],
        'work_category' => [
            'singular' => 'Build type',
            'plural'   => 'Build types',
            'gql'      => ['workCategory', 'workCategories'],
            'types'    => ['case_study'],
            'hierarchical' => true,
        ],
        'region' => [
            'singular' => 'Market',
            'plural'   => 'Markets',
            'gql'      => ['region', 'regions'],
            'types'    => ['case_study'],
            'hierarchical' => true,
        ],
        'faq_group' => [
            'singular' => 'FAQ group',
            'plural'   => 'FAQ groups',
            'gql'      => ['faqGroup', 'faqGroups'],
            'types'    => ['faq'],
            'hierarchical' => true,
        ],
    ];
}

function softvolt_register_post_types(): void
{
    foreach (softvolt_post_type_schema() as $slug => $type) {
        register_post_type($slug, [
            'labels' => [
                'name'          => $type['plural'],
                'singular_name' => $type['singular'],
                'add_new_item'  => sprintf('Add %s', strtolower($type['singular'])),
                'edit_item'     => sprintf('Edit %s', strtolower($type['singular'])),
                'search_items'  => sprintf('Search %s', strtolower($type['plural'])),
                'not_found'     => sprintf('No %s yet', strtolower($type['plural'])),
                'menu_name'     => $type['plural'],
            ],
            'public'              => true,
            // the front end is Next.js: these exist to be queried, not browsed
            'publicly_queryable'  => true,
            'exclude_from_search' => true,
            'has_archive'         => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'show_in_rest'        => true,
            'show_in_graphql'     => true,
            'graphql_single_name' => $type['gql'][0],
            'graphql_plural_name' => $type['gql'][1],
            'menu_icon'           => $type['icon'],
            'supports'            => $type['supports'],
            'taxonomies'          => $type['taxonomies'],
            'rewrite'             => ['slug' => str_replace('_', '-', $slug), 'with_front' => false],
            'capability_type'     => 'post',
            'hierarchical'        => false,
        ]);
    }
}
add_action('init', 'softvolt_register_post_types', 5);

function softvolt_register_taxonomies(): void
{
    foreach (softvolt_taxonomy_schema() as $slug => $tax) {
        register_taxonomy($slug, $tax['types'], [
            'labels' => [
                'name'          => $tax['plural'],
                'singular_name' => $tax['singular'],
                'menu_name'     => $tax['plural'],
            ],
            'public'              => true,
            'publicly_queryable'  => false,
            'hierarchical'        => $tax['hierarchical'],
            'show_ui'             => true,
            'show_admin_column'   => true,
            'show_in_rest'        => true,
            'show_in_graphql'     => true,
            'graphql_single_name' => $tax['gql'][0],
            'graphql_plural_name' => $tax['gql'][1],
            'rewrite'             => ['slug' => str_replace('_', '-', $slug), 'with_front' => false],
        ]);
    }
}
add_action('init', 'softvolt_register_taxonomies', 5);

/** The two menus the front end reads, by location. */
add_action('after_setup_theme', static function (): void {
    register_nav_menus([
        'header' => 'Header navigation',
        'footer' => 'Footer navigation',
        'legal'  => 'Legal links (footer, bottom row)',
    ]);
});

/** Editors order these by hand far more often than by date. */
add_filter('pre_get_posts', static function ($query) {
    if (is_admin() && $query->is_main_query()) {
        $type = $query->get('post_type');
        if (is_string($type) && isset(softvolt_post_type_schema()[$type])) {
            $query->set('orderby', 'menu_order title');
            $query->set('order', 'ASC');
        }
    }
    return $query;
});

/* ==========================================================================
   Page copy data
   ========================================================================== */

/**
 * GENERATED by wordpress/build-page-copy.mjs from content/copy/*.ts — do not edit
 * here. Change the page definition in the front-end repo and run the build.
 */

if (!defined('SOFTVOLT_PAGE_COPY')) {
    define('SOFTVOLT_PAGE_COPY', <<<'JSON'
[
{"slug":"home","id":"home","title":"Home","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for the home page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. On the home page it is used exactly as written.","value":"SoftVolt AI — White-label production for agencies"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"White-label production and growth for agencies: WordPress, WooCommerce, headless Next.js, SEO and paid media, built under your brand from Dhaka.","rows":3}]},{"key":"banner","title":"Banner","help":"The first screen. The two buttons come from Headless settings → Calls to action, and the ticks under them are the Commitments. The websites orbiting the globe are the Clients, and the pins on it are set in the design.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"White-label production & growth partner"},{"key":"headline","kind":"lines","label":"Headline","help":"One line per row. The last row is set in green.","value":["You win the client.","We deliver the work.","Your brand gets the credit."]},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"WordPress, WooCommerce, Shopify and Webflow builds, Next.js apps on Payload, Sanity or PostgreSQL, AI automation, SEO and paid media — delivered under your brand by a senior team in Dhaka, working UK and US hours.","rows":3},{"key":"legend_hq","kind":"text","label":"Globe key — the green dot","help":"","value":"Dhaka HQ"},{"key":"legend_markets","kind":"text","label":"Globe key — the filled pins","help":"","value":"Markets we serve"},{"key":"legend_eu","kind":"text","label":"Globe key — the empty rings","help":"","value":"EU member states"},{"key":"legend_drag","kind":"text","label":"Hint under the globe","help":"Shown on wide screens only.","value":"Drag to rotate · any direction"}]},{"key":"demo","title":"White-label demo","help":"The interactive demo: a visitor types their agency's name and the finished client site credits them. The dark layer the lens reveals — staging address, code, commits, QA counts — is drawn in the design, not written here.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"White-label, demonstrated"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Your brand on the front. Our work underneath."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Type your agency's name. The finished site credits you; move over it and the lens shows the staging server, the commits and the QA your client never sees.","rows":3},{"key":"sample_name","kind":"text","label":"Agency name the demo starts with","help":"What the name box says before a visitor types their own.","value":"Northwind Digital"},{"key":"note","kind":"text","label":"Note under the name box","help":"","value":"Nothing you type is stored."},{"key":"field_label","kind":"text","label":"Label above the name box","help":"","value":"Your agency name — try it"},{"key":"colour_label","kind":"text","label":"Label above the colour dots","help":"","value":"Brand colour"},{"key":"client_name","kind":"text","label":"Example site — the client's name","help":"The pretend client whose finished website the demo shows.","value":"Harbour Dental"},{"key":"client_url","kind":"text","label":"Example site — web address","help":"","value":"harbour-dental.co.uk"},{"key":"client_menu","kind":"lines","label":"Example site — menu","help":"One item per row.","value":["Treatments","Team","Fees"]},{"key":"client_button","kind":"text","label":"Example site — button in the menu","help":"","value":"Book online"},{"key":"client_heading","kind":"text","label":"Example site — headline","help":"","value":"Gentle dentistry, five minutes from the harbour."},{"key":"client_lede","kind":"para","label":"Example site — paragraph","help":"","value":"Same-week appointments for new patients. Emergency slots held every morning.","rows":3},{"key":"client_cta","kind":"text","label":"Example site — button under the headline","help":"","value":"Book a check-up"},{"key":"client_cards","kind":"lines","label":"Example site — the three cards","help":"One card per row.","value":["Check-ups","Whitening","Emergency"]},{"key":"credit","kind":"text","label":"Credit line on the example site","help":"The visitor's agency name is written after it.","value":"Website by"},{"key":"engine_note","kind":"text","label":"Label on the dark layer under the lens","help":"","value":"client never sees this"}]},{"key":"services","title":"Services","help":"The four pillar cards come from Services and Pillars in the menu on the left; everything else in this band is here.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Services"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Build, automate, grow, support — one partner, one contract."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Most white-label shops sell hours of development. Agencies also need the automation, the SEO implementation, the ad execution and the maintenance that keep a client. We cover all four.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"Explore every service","url":"/services"}},{"key":"includes","kind":"items","label":"What every build ships with","help":"The list under the Build card's illustration.","value":[{"label":"Staging","text":"A password-protected link on your domain, from day one"},{"label":"QA","text":"A checklist signed off before anything reaches your client"},{"label":"Handover","text":"A document your client can read, and the repo if you want it"}],"item":"Line","slots":4,"sub":[{"key":"label","label":"Label","kind":"text"},{"key":"text","label":"Text","kind":"text"}]},{"key":"card_pill","kind":"text","label":"Dark card — small label","help":"","value":"Not sure where it fits?"},{"key":"card_heading","kind":"text","label":"Dark card — heading","help":"","value":"Send the brief. The scope tells you which service — and what it costs."},{"key":"card_steps","kind":"items","label":"Dark card — steps","help":"","value":[{"title":"A named producer replies","when":"Within 1 business day"},{"title":"Scope, line by line, priced","when":"Within 2 business days"},{"title":"Work starts on your approval","when":"Fixed price, your brand"}],"item":"Step","slots":4,"sub":[{"key":"title","label":"What happens","kind":"text"},{"key":"when","label":"When","kind":"text"}]},{"key":"card_button","kind":"link","label":"Dark card — button","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"card_note","kind":"text","label":"Dark card — note","help":"","value":"Client names can wait until the NDA is signed."}]},{"key":"stack","title":"Stack & proof","help":"The tools listed underneath are edited under Stack in the menu on the left. The numbers in the card are measured in the visitor's own browser.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Stack & proof"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"We sell headless WordPress and Next.js. This site is one."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Most white-label shops sell headless builds from an Elementor page. This site is a Next.js App Router build with server components, self-hosted fonts and no tracking cookies — measured below in your browser, right now, not in a lab screenshot.","rows":3},{"key":"vitals_heading","kind":"text","label":"Measurement card — heading","help":"","value":"This page, in your browser"},{"key":"vitals_points","kind":"lines","label":"Measurement card — ticks under the numbers","help":"One tick per row.","value":["Rendered on the server, hydrated only where something moves","Dashes mean your browser does not expose that metric — we do not guess"]}]},{"key":"protection","title":"Agency protection","help":"The clauses themselves are edited under Protection clauses in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Agency protection"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Your client stays yours. In writing."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Most white-label sites mention an NDA once. These are the terms we work under on every project — the full text goes into your contract.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"Not shown on the Security page, which is where it points.","value":{"text":"How credentials and client data are handled","url":"/security"}},{"key":"artefact","kind":"text","label":"Label on the document card","help":"The card is an illustration of the signed agreement; only this line is written.","value":"Agency protection agreement · schedule A"}]},{"key":"hours","title":"Working hours","help":"The cities in the table are edited under Clocks in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Follow the sun"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Brief us at 5pm London. Review it at 9am."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Dhaka is UTC+6 with no daylight saving, and we cover 09:00–23:00 local. Here is what that overlap looks like against your working day — including where it is thin.","rows":3},{"key":"city_label","kind":"text","label":"Table — first column","help":"","value":"City · local time"},{"key":"overlap_label","kind":"text","label":"Table — last column","help":"","value":"Overlap"},{"key":"footnote","kind":"para","label":"Note under the table","help":"","value":"Volt = your 09:00–18:00 that falls inside our coverage. Computed from your browser's clock, daylight saving included.","rows":2}]},{"key":"comparison","title":"Comparison table","help":"The rows of the table are edited under Comparison in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"The comparison"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"In-house hire vs. freelancer vs."},{"key":"heading_accent","kind":"text","label":"Words after the heading, in green","help":"","value":"a white-label partner."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Every agency hits the same build-or-buy decision once client demand stops arriving on a predictable schedule. Here is how the three options compare on the things that decide your margin.","rows":3},{"key":"col_dimension","kind":"text","label":"Table — first column","help":"","value":"Dimension"},{"key":"col_in_house","kind":"text","label":"Table — second column","help":"","value":"In-house hire"},{"key":"col_freelancer","kind":"text","label":"Table — third column","help":"","value":"Freelancer"},{"key":"footnote","kind":"para","label":"Note under the table","help":"The source's name and link are added after this, from Headless settings → Comparison table.","value":"* Median annual pay for web developers in the US, May 2025, excluding benefits, taxes and equipment. Source:","rows":2},{"key":"closing","kind":"para","label":"Closing card — text","help":"","value":"If hiring is what is capping your agency's growth, this table usually settles it. Start with one brief and judge the delivery, not the pitch.","rows":3},{"key":"closing_button","kind":"link","label":"Closing card — button","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"closing_link","kind":"link","label":"Closing card — second button","help":"","value":{"text":"See how it runs","url":"/about#how-it-works"}}]},{"key":"process","title":"How it works","help":"The steps themselves are edited under Process steps in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How it works"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Five steps. Each one leaves a document you can forward to your client."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"No black box. Every stage produces something written — a scope, a staging link, a checklist, a handover — so you always know where the work is without asking.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"What happens after the first brief","url":"/partner-programme"}},{"key":"artefacts","kind":"items","label":"Document cards","help":"The card that slides in beside each step, in the same order as the steps. What is written inside each card is part of the illustration.","value":[{"title":"Brief received","meta":"northwind-digital · 17:04 London"},{"title":"Scope & quote","meta":"v1 · within 2 business days"},{"title":"Production","meta":"staging.northwind-digital.co.uk"},{"title":"QA checklist","meta":"42 checks · published"},{"title":"Handover","meta":"northwind-digital · launch day"}],"item":"Card","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"meta","label":"Line on the right","kind":"text"}]}]},{"key":"rates","title":"Plans","help":"The plans themselves — names, prices, what is included — are edited under Plans in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"Not shown on the Rates page, where the banner introduces the plans.","value":"Rates"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Simple monthly plans built for how agencies actually work."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and change plans as that number changes.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"How pricing works","url":"/rates"}},{"key":"button","kind":"link","label":"Button on every plan","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"price_note","kind":"text","label":"Under a price","help":"","value":"Billed monthly · no long-term contract"},{"key":"no_price","kind":"text","label":"Instead of a price, when a plan has none","help":"","value":"Let's talk"},{"key":"no_price_note","kind":"text","label":"Under \"Let's talk\"","help":"","value":"Scoped and quoted around your volume"},{"key":"note","kind":"para","label":"Note under the plans","help":"","value":"Billed monthly — move up or down a plan as your client workload changes. Prefer to talk first? The scoping call is 20 minutes and free.","rows":3}]},{"key":"agencies","title":"Who we help","help":"The agency types themselves are edited under Agency types in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Who we help"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Built for agencies that have already sold the work."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"You own the client, the strategy and the invoice. We take the part that is blocking your calendar.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"How we work with each agency type","url":"/for"}}]},{"key":"work","title":"Builds","help":"The builds themselves are edited under Case studies in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Work"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Builds you can open, not logos you have to trust."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Delivered by our founder as developer and team lead at a UK agency. Partner work is only ever shown here with written permission — and with your name on it, not ours.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"Type - (a dash) as the link text to show no link.","value":{"text":"See all case studies","url":"/case-studies"}}]},{"key":"team","title":"The team","help":"The people themselves are edited under Team in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Who does the work"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"A named person, not a pool."},{"key":"link","kind":"link","label":"Text link","help":"Type - (a dash) as the link text to show no link.","value":{"text":"More about the team","url":"/about"}}]},{"key":"faq","title":"Questions","help":"The questions themselves are edited under FAQs in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"FAQ"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"The questions agencies ask before the first brief."},{"key":"card_title","kind":"text","label":"Side card — title","help":"","value":"Still unanswered?"},{"key":"card_text","kind":"para","label":"Side card — text","help":"{email} becomes the contact email from Headless settings.","value":"A 20-minute scoping call costs nothing and usually answers it. Or email [{email}](mailto:{email}).","rows":3},{"key":"card_button","kind":"link","label":"Side card — button","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"card_link","kind":"link","label":"Side card — text link","help":"","value":{"text":"Book a call","url":"/contact#call"}}]},{"key":"brief","title":"Brief form","help":"The last band of the page, beside the four-step brief form.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Send us a brief"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Four short steps. A scope and a fixed price within two business days."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Client names can wait until the NDA is signed. Tell us what exists, what is needed and when — a named producer replies within one business day.","rows":3},{"key":"call_label","kind":"text","label":"\"Prefer to talk\" — label","help":"","value":"Prefer to talk?"},{"key":"call_link","kind":"text","label":"\"Prefer to talk\" — link text","help":"Shown when a booking link is set in Headless settings.","value":"Book a 20-minute scoping call ↗"},{"key":"call_text","kind":"para","label":"\"Prefer to talk\" — text without a booking link","help":"","value":"A 20-minute scoping call — ask for a slot in the brief and we will send times in your time zone.","rows":2},{"key":"email_label","kind":"text","label":"Email — label","help":"","value":"Email"},{"key":"hours_label","kind":"text","label":"Hours — label","help":"","value":"Hours"},{"key":"hours_text","kind":"text","label":"Hours — text","help":"{location} and {offset} come from Headless settings.","value":"{location} · {offset} · UK and US overlap, daily"},{"key":"later_label","kind":"text","label":"Links for later — label","help":"","value":"Not ready to brief?"},{"key":"later_links","kind":"items","label":"Links for later","help":"","value":[{"text":"See what we have built","url":"/case-studies"},{"text":"How pricing works","url":"/rates"},{"text":"Partner programme","url":"/partner-programme"},{"text":"Just a question? Contact us","url":"/contact"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"brief_form","title":"Brief form — the questions","help":"Every word inside the four-step form. The chips a visitor picks from — the kinds of work, the platforms and the budgets — are fixed, because the form checks the answer against that list before it sends. Where the brief is delivered is set under Headless settings → Forms.","fields":[{"key":"steps","kind":"items","label":"Step titles","help":"The four steps, in order. The form needs all four, so leaving one empty only puts its original title back.","value":[{"title":"What kind of work"},{"title":"What exists already"},{"title":"Timing and budget"},{"title":"Where to send the scope"}],"item":"Step","slots":4,"sub":[{"key":"title","label":"Title","kind":"text"}]},{"key":"step_counter","kind":"text","label":"Counter beside the title","help":"{step} and {total} are filled in as the visitor moves through.","value":"Step {step} of {total}"},{"key":"work_label","kind":"text","label":"Step 1 — kind of work","help":"","value":"Kind of work"},{"key":"platform_label","kind":"text","label":"Step 1 — platforms","help":"The buttons under it are fixed: each one is something we build, and the form checks the answer against that list.","value":"Platform — pick any that apply"},{"key":"figma_label","kind":"text","label":"Step 2 — Figma","help":"","value":"Figma URL (optional)"},{"key":"figma_placeholder","kind":"text","label":"Step 2 — Figma, grey example text","help":"","value":"https://www.figma.com/…"},{"key":"live_label","kind":"text","label":"Step 2 — live site","help":"","value":"Live or staging URL (optional)"},{"key":"live_placeholder","kind":"text","label":"Step 2 — live site, grey example text","help":"","value":"https://"},{"key":"brief_label","kind":"text","label":"Step 2 — the brief","help":"","value":"The brief, in your words"},{"key":"brief_placeholder","kind":"para","label":"Step 2 — the brief, grey example text","help":"","value":"What the client needs, what exists today, what 'done' looks like. Client names can wait until the NDA.","rows":2},{"key":"deadline_label","kind":"text","label":"Step 3 — deadline","help":"","value":"Deadline (a date, or \"flexible\")"},{"key":"deadline_placeholder","kind":"text","label":"Step 3 — deadline, grey example text","help":"","value":"e.g. client launch 24 October, or flexible"},{"key":"budget_label","kind":"text","label":"Step 3 — budget","help":"The amounts under it are fixed: the form checks the answer against that list.","value":"Budget range"},{"key":"name_label","kind":"text","label":"Step 4 — name","help":"","value":"Your name"},{"key":"agency_label","kind":"text","label":"Step 4 — agency","help":"","value":"Agency"},{"key":"email_label","kind":"text","label":"Step 4 — email","help":"","value":"Work email"},{"key":"nda_label","kind":"text","label":"Step 4 — NDA tick box","help":"","value":"Send me your mutual NDA before I share client details"},{"key":"consent_label","kind":"para","label":"Step 4 — permission tick box","help":"","value":"You may use these details to reply about this brief. Nothing else, no newsletter","rows":2},{"key":"privacy_link","kind":"text","label":"Step 4 — the privacy policy link","help":"Written after the line above, and links to the privacy policy page.","value":"privacy policy"},{"key":"back","kind":"text","label":"Button — back","help":"","value":"Back"},{"key":"next","kind":"text","label":"Button — continue","help":"","value":"Continue"},{"key":"submit","kind":"text","label":"Button — send","help":"","value":"Send the brief"},{"key":"sending","kind":"text","label":"Button — while it sends","help":"","value":"Sending…"},{"key":"reply_note","kind":"text","label":"Note beside the buttons","help":"","value":"Reply within 1 business day"},{"key":"sent_eyebrow","kind":"text","label":"Once it has sent — small line","help":"","value":"Brief received"},{"key":"sent_heading","kind":"text","label":"Once it has sent — heading","help":"","value":"Thank you. You will hear from a named producer within one business day."},{"key":"sent_lede","kind":"para","label":"Once it has sent — paragraph","help":"","value":"The scope and fixed price follow within two business days. If you asked for the NDA first, it arrives before any client detail is discussed.","rows":3},{"key":"sent_call","kind":"text","label":"Once it has sent — booking link","help":"","value":"Want to talk it through sooner? Book the 20-minute scoping call ↗"}]}]},
{"slug":"services","id":"services","title":"Services","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Services — build, automate, grow, support"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Every white-label service for agencies: WordPress, WooCommerce, headless Next.js, Shopify, Webflow, AI automation, SEO, ads and maintenance.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Services"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Four pillars. One partner. Your brand on everything."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"Every service is delivered under your agency's name with a written scope, a named producer and a fixed price. Pick the one that matches the brief, or send the brief and let the scope tell you.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is the number of services in each pillar.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"What we cover"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"{count} services, one white-label contract."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"One partner for the build, the automation, the traffic and the upkeep — under your agency's name, start to finish.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Agencies come to us with one of four problems: a build they cannot staff, a manual process eating the team's week, traffic that has stalled, or a live site nobody is looking after. Each pillar below answers one of those. Inside them sit the specifics — WordPress and WooCommerce, headless front ends on Next.js with Payload or Sanity, Shopify and Webflow, AI automation and internal tools, technical and local SEO, Google and Meta ads, maintenance, migration and rescue."},{"text":"Every service is scoped in writing before anything starts, carries a fixed price and a named producer, and ships under your brand. Your client never sees us, and your team keeps the relationship, the strategy and the invoice."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"Written scope first","text":"Line-by-line, priced, agreed before a single commit."},{"title":"One producer","text":"A named person answers on your hours, not a ticket queue."},{"title":"Your brand throughout","text":"Staging URLs, documents and handover all carry your name."},{"title":"Defects on us","text":"Anything that breaks against the agreed scope is fixed at our cost."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Leave these empty and the page links to each pillar below. {count} in the heading becomes the number of services.","value":[],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]},{"key":"detail_top","title":"Every service page — top of the page","help":"The same words on every service page. The headline, the paragraph under it and the lists come from each service under Services. In these fields {service} is the service's name, {pillar} its pillar, {deliverables} how many deliverables it lists and {tools} its tooling.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"{pillar} · white-label"},{"key":"fact_tools","kind":"text","label":"Fact card — tooling label","help":"","value":"Tooling"},{"key":"fact_best_for","kind":"text","label":"Fact card — best-for label","help":"","value":"Best for"},{"key":"intro_eyebrow","kind":"text","label":"Intro — small line above the heading","help":"","value":"At a glance"},{"key":"intro_heading","kind":"text","label":"Intro — heading","help":"","value":"{service}, run the way agencies need it run."},{"key":"intro_p1","kind":"para","label":"Intro — first paragraph","help":"","value":"Send the brief and a named producer turns it into a written scope: {deliverables} deliverables, each priced, with the assumptions and the tools listed — {tools}. Nothing is built until you have agreed that document, and the price on it is the price you pay.","rows":4},{"key":"intro_p2","kind":"para","label":"Intro — second paragraph","help":"{often_for} becomes \"It is the brief we see most often from …\" when the service has agency types, and nothing when it has none.","value":"{often_for}Everything ships under your agency's name — the staging link, the commits, the checklist and the handover — and your client never learns we were involved.","rows":4},{"key":"point_pillar","kind":"text","label":"Key point — pillar label","help":"","value":"Pillar"},{"key":"point_tools","kind":"text","label":"Key point — tooling label","help":"","value":"Tooling"},{"key":"point_often","kind":"text","label":"Key point — agencies label","help":"","value":"Most often for"},{"key":"jump_ships","kind":"text","label":"\"On this page\" — what ships","help":"","value":"What ships"},{"key":"jump_signals","kind":"text","label":"\"On this page\" — when to send it","help":"","value":"When to send it"},{"key":"jump_who","kind":"text","label":"\"On this page\" — who it is for","help":"","value":"Who it is for"},{"key":"jump_related","kind":"text","label":"\"On this page\" — related","help":"","value":"Related services"}]},{"key":"detail_sections","title":"Every service page — sections below","help":"The bands under the intro, the same on every service page. {pillar} is the service's pillar.","fields":[{"key":"ships_eyebrow","kind":"text","label":"What ships — small line","help":"","value":"What ships"},{"key":"ships_heading","kind":"text","label":"What ships — heading","help":"","value":"What you get, written into the scope."},{"key":"ships_text","kind":"para","label":"What ships — paragraph","help":"","value":"Every item here appears in the scope document with a price against it. Nothing starts until you approve it.","rows":3},{"key":"signals_eyebrow","kind":"text","label":"When to send it — small line","help":"","value":"When to send this brief"},{"key":"signals_heading","kind":"text","label":"When to send it — heading","help":"","value":"You will recognise the moment."},{"key":"runs_eyebrow","kind":"text","label":"How it runs — small line","help":"","value":"How it runs"},{"key":"tools_eyebrow","kind":"text","label":"Tooling — small line","help":"","value":"Tooling"},{"key":"who_eyebrow","kind":"text","label":"Built for — small line","help":"","value":"Built for"},{"key":"who_heading","kind":"text","label":"Built for — heading","help":"","value":"Agencies that send this brief most often."},{"key":"who_link","kind":"text","label":"Built for — link on each card","help":"","value":"How we work with you →"},{"key":"related_eyebrow","kind":"text","label":"Related — small line","help":"","value":"Also in {pillar}"},{"key":"related_heading","kind":"text","label":"Related — heading","help":"","value":"Related services."}]},{"key":"detail_cta","title":"Every service page — closing call to action","help":"The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Send the brief —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"get a fixed price within two business days."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Tell us what the {service} project needs and when. Client names can wait until the NDA is signed; a named producer replies within one business day.","rows":3}]}]},
{"slug":"for","id":"for","title":"Agency Solutions","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"For agencies — who we work with"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"White-label production for digital marketing, SEO, PPC, branding, web design and full-service agencies: how each engagement runs and what fits.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Who we help"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Built for agencies that have already sold the work."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"You own the client, the strategy and the invoice. We take the part that is blocking your calendar. Pick the kind of agency you are and see how the engagement runs.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is the kinds of agency we serve and our no-contact commitment.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How this works"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Your agency stays the agency."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"We are the production team behind the name on the invoice — never a second supplier your client has to meet.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Most of the agencies we work with are three to thirty people. They have won a website, a migration, a store, an automation or a retainer, and the work is bigger than the calendar. Rather than hiring for a spike, they hand the production to us and keep everything the client sees: the strategy, the presentation, the relationship and the margin."},{"text":"The {count} kinds of agency below each get their own page, because the brief that arrives from an SEO agency is nothing like the one that arrives from a branding studio. Pick the closest one and you will see the services that fit it, how a typical engagement runs, and what we need from you at each step."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"You own the client","text":"We never contact them, and never appear in a meeting unless you ask."},{"title":"Under your brand","text":"Staging links, documents and handover carry your agency's name."},{"title":"Fixed price per brief","text":"Scoped and agreed in writing before the work starts."},{"title":"No retainer to start","text":"The first project is a project. A plan only follows if it suits you."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"Kinds of agency","url":"#agency-types"},{"text":"Send a brief","url":"/contact"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"types","title":"Kinds of agency","help":"The cards themselves are edited under Agency types in the menu on the left. {count} in the intro becomes the number of agency types.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Who we work with"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Pick the kind of agency you are."},{"key":"card_link","kind":"text","label":"Link at the bottom of each card","help":"","value":"How we work with you →"}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]},{"key":"detail_top","title":"Every agency page — top of the page","help":"The same words on every agency page. The paragraph under the headline and the lists come from each agency type under Agency types. In these fields {agency} is the kind of agency (\"SEO agencies\"), {problem} its problem line, and {scope_time} how fast a scope comes back.","fields":[{"key":"seo_title","kind":"text","label":"Page title in Google","help":"\"· SoftVolt AI\" is added after it. The description comes from each agency type's SEO description.","value":"White-label for {agency}"},{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Who we help"},{"key":"heading","kind":"text","label":"Headline","help":"","value":"For {agency}"},{"key":"fact_services","kind":"text","label":"Fact card — services label","help":"","value":"Services that fit"},{"key":"fact_commitment","kind":"text","label":"Fact card — commitment label","help":"","value":"Commitment"},{"key":"intro_eyebrow","kind":"text","label":"Intro — small line above the heading","help":"","value":"At a glance"},{"key":"intro_heading","kind":"text","label":"Intro — heading","help":"","value":"What {agency} hand over."},{"key":"intro_p1","kind":"para","label":"Intro — first paragraph","help":"","value":"{problem} That is the part we take. The brief comes to a named producer, goes back to you as a written scope with a fixed price {scope_time}, and the build runs under your agency's name from the staging link to the handover.","rows":4},{"key":"intro_p2","kind":"para","label":"Intro — second paragraph","help":"{top_services} becomes the first four services linked to the agency type; {commitment} becomes the no-contact commitment in full.","value":"The services that fit this kind of agency most often are {top_services} — but the list below is the full set, and a brief can mix them. {commitment}","rows":4},{"key":"point_problem","kind":"text","label":"Key point — problem label","help":"","value":"The blocker"},{"key":"point_relief","kind":"text","label":"Key point — change label","help":"","value":"What changes"},{"key":"jump_problem","kind":"text","label":"\"On this page\" — the problem","help":"","value":"The problem"},{"key":"jump_workflow","kind":"text","label":"\"On this page\" — how it runs","help":"","value":"How it runs"},{"key":"jump_services","kind":"text","label":"\"On this page\" — services","help":"","value":"Services that fit"},{"key":"jump_promises","kind":"text","label":"\"On this page\" — commitments","help":"","value":"What you get in writing"}]},{"key":"detail_sections","title":"Every agency page — sections below","help":"The bands under the intro, the same on every agency page.","fields":[{"key":"problem_eyebrow","kind":"text","label":"The problem — small line","help":"","value":"The problem"},{"key":"relief_eyebrow","kind":"text","label":"What changes — small line","help":"","value":"What changes"},{"key":"workflow_eyebrow","kind":"text","label":"How it runs — small line","help":"","value":"How the engagement runs"},{"key":"workflow_heading","kind":"text","label":"How it runs — heading","help":"{Count} becomes the number of steps the agency type lists, as a word.","value":"{Count} steps, each one written down."},{"key":"services_eyebrow","kind":"text","label":"Services — small line","help":"","value":"Services that fit"},{"key":"services_heading","kind":"text","label":"Services — heading","help":"","value":"What {agency} usually send us."},{"key":"promises_eyebrow","kind":"text","label":"Commitments — small line","help":"","value":"On every project"},{"key":"promises_heading","kind":"text","label":"Commitments — heading","help":"","value":"The commitments."}]},{"key":"detail_cta","title":"Every agency page — closing call to action","help":"The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]}]},
{"slug":"case-studies","id":"case_studies","title":"Case Studies","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Case studies — builds you can open"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Eight live builds you can open: headless WordPress on Next.js, WooCommerce stores and technical-SEO sites, read by type, market and stack.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Case studies"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Builds you can open, not logos you have to trust."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"White-label means partner work is never shown without written permission — and when it is, it carries your name. What we can show are builds our founder delivered as developer, project manager and team lead at a UK agency.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is how many builds, where they were delivered and the tools used most.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How to read these"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Eight builds, four ways in."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"Every one is live, public and linked — open them before you read a word we wrote.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Most agency portfolios are a wall of logos. This page is the opposite: {count} finished websites, each with the brief it answered, the stack it was built on and a link to the running site. They were delivered for clients in {regions} — WooCommerce stores, headless WordPress front ends on Next.js, and corporate sites where the forms have to work every day."},{"text":"Read them the way that matches your brief. Start with the spotlight, browse by the kind of work, check the market and the stack, or filter the full set at the bottom. Whichever way you come in, the facts are the same ones — nothing on this page is an outcome we cannot show you."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"Delivered, not pitched","text":"Each build shipped and is still live. The links go to the real site, not a screenshot."},{"title":"Named honestly","text":"These are our founder's builds at a UK agency, said plainly on every card."},{"title":"Your name on the next one","text":"Partner work only appears with written permission — and under your agency's brand."},{"title":"Same team, same hours","text":"The people who built these are the ones who take your brief, on UK and US hours."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"Spotlight","url":"#spotlight"},{"text":"By what we built","url":"#by-type"},{"text":"By market and stack","url":"#by-market"},{"text":"Every build","url":"#work"},{"text":"How we publish","url":"#format"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"spotlight","title":"Spotlight","help":"The first case study in the Case studies list is the one shown here.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Spotlight"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Start with the one that shows the most."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"One build in full: what the brief needed, what was actually made, and the link to open it yourself.","rows":3},{"key":"link","kind":"text","label":"Link to the full case study","help":"","value":"Read the case study"}]},{"key":"by_type","title":"By what we built","help":"Which builds fall into which group is decided by each build’s category, under Case studies in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"By what we built"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Four kinds of brief, eight finished builds."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"The same four kinds of work an agency sends us today. Each group lists the builds it covers, so you can go straight to the one closest to your client's brief.","rows":3},{"key":"notes","kind":"items","label":"What each kind of build means","help":"The name has to match a Build type used on the case studies, or the note has nowhere to go.","value":[{"name":"Headless & Next.js","note":"WordPress stays the editor the client already knows; the front end is a Next.js app on its own deploy."},{"name":"E-commerce","note":"WooCommerce stores — catalogue, checkout, payment, and the maintenance that follows the launch."},{"name":"Corporate","note":"Sites where the pages have to be exact, the forms have to work and nothing may break on a Friday."},{"name":"Agency & SEO","note":"Builds where the technical SEO shaped the structure instead of being a plugin added at the end."}],"item":"Kind","slots":6,"sub":[{"key":"name","label":"Name, exactly as it appears on the cards","kind":"text"},{"key":"note","label":"What it means","kind":"para"}]}]},{"key":"by_market","title":"By market and stack","help":"The markets and the tools are read from the builds themselves, under Case studies in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"By market and by stack"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Where each build was for, and what it was made with."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Two more ways to read the same eight builds: the market the client sells in, and the tools the work actually used.","rows":3},{"key":"markets_heading","kind":"text","label":"Left column — heading","help":"","value":"The markets"},{"key":"markets","kind":"items","label":"What each market means","help":"The name has to match a Market used on the case studies.","value":[{"name":"United Kingdom","note":"Dhaka is UTC+6. A brief sent at 5pm London is picked up the next morning, with the reply waiting when you open."},{"name":"United States","note":"The Dhaka day ends as the US east coast starts, so overnight progress is the normal rhythm rather than the exception."},{"name":"Bangladesh","note":"Where the team sits. These are builds we can walk through end to end, from the first wireframe to the live site."}],"item":"Market","slots":5,"sub":[{"key":"name","label":"Name, exactly as it appears on the cards","kind":"text"},{"key":"note","label":"What it means","kind":"para"}]},{"key":"stack_heading","kind":"text","label":"Right column — heading","help":"","value":"The stack, counted"},{"key":"stack_lede","kind":"para","label":"Right column — paragraph","help":"","value":"Every tool named in a case study, with the number of builds it appears in. The ones we offer as a service link through to it.","rows":3},{"key":"stack_note","kind":"para","label":"Right column — note under the tools","help":"","value":"Nothing here is a logo wall: every count comes from a build listed on this page, and every tool is one the team uses in production.","rows":3}]},{"key":"work","title":"Builds","help":"The builds themselves are edited under Case studies in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Every build"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"All eight, filtered the way you work."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"The full set, in one grid. Filter by the kind of build, open the live site from the card, or read the case study behind it.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"Type - (a dash) as the link text to show no link.","value":{"text":"-","url":"/case-studies"}}]},{"key":"format","title":"How we publish","help":"A written band: nothing in it is read from a list.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"The format"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Anonymised at the partner's request. Verified outcomes only."},{"key":"paragraph","kind":"para","label":"Paragraph","help":"","value":"As partner projects launch, their case studies appear here in a fixed shape: the kind of agency and where it is, the brief as it arrived, the stack, what shipped, and the outcome we can prove — a Lighthouse score before and after, a checkout error rate, a migration with no lost URLs.","rows":4},{"key":"closing","kind":"para","label":"Closing line","help":"Set in darker type under the paragraph.","value":"Never a business metric we cannot see, never a client name without the agency's written permission, and never a logo we have not earned.","rows":3}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]},{"key":"detail_top","title":"Every case study page — top of the page","help":"The same words on every case study page. The title, the summary and the lists come from each case study under Case studies. In these fields {title}, {category}, {client}, {region}, {role} and {stack} come from the case study, and {delivered} is how many things it lists as shipped.","fields":[{"key":"seo_title","kind":"text","label":"Page title in Google","help":"\"· SoftVolt AI\" is added after it.","value":"{title} — case study"},{"key":"fact_client","kind":"text","label":"Fact card — client label","help":"","value":"Client"},{"key":"fact_region","kind":"text","label":"Fact card — region label","help":"","value":"Region"},{"key":"fact_stack","kind":"text","label":"Fact card — stack label","help":"","value":"Stack"},{"key":"live_button","kind":"text","label":"Button to the live site","help":"Shown only when the case study has a live URL.","value":"Open the live site ↗"},{"key":"intro_eyebrow","kind":"text","label":"Intro — small line above the heading","help":"","value":"At a glance"},{"key":"intro_heading","kind":"text","label":"Intro — heading","help":"","value":"{category} for a {client}."},{"key":"intro_p1","kind":"para","label":"Intro — first paragraph","help":"","value":"This one is on the site because it can be checked. It was delivered for a {client} in {region}, our founder's part in it was {role}, and everything claimed below is either visible in the running site or in the code behind it.","rows":4},{"key":"intro_p2","kind":"para","label":"Intro — second paragraph","help":"{live_note} becomes \", and the site is still live — open it and check the claims against the real thing.\" when there is a live URL, and a full stop when there is not.","value":"{delivered} things shipped in this build, listed in full below. It was made with {stack} for a client in {region}{live_note}","rows":4},{"key":"point_client","kind":"text","label":"Key point — client label","help":"","value":"Client"},{"key":"point_market","kind":"text","label":"Key point — market label","help":"","value":"Market"},{"key":"point_role","kind":"text","label":"Key point — role label","help":"","value":"Our role"},{"key":"point_stack","kind":"text","label":"Key point — stack label","help":"","value":"Built with"},{"key":"jump_delivered","kind":"text","label":"\"On this page\" — what shipped","help":"","value":"What shipped"},{"key":"jump_partner","kind":"text","label":"\"On this page\" — as a partner brief","help":"","value":"As a partner brief"},{"key":"jump_related","kind":"text","label":"\"On this page\" — related","help":"","value":"Related builds"}]},{"key":"detail_sections","title":"Every case study page — sections below","help":"The bands under the intro, the same on every case study page.","fields":[{"key":"delivered_eyebrow","kind":"text","label":"What shipped — small line","help":"","value":"What shipped"},{"key":"delivered_heading","kind":"text","label":"What shipped — heading","help":"","value":"The work, in plain terms."},{"key":"label_client","kind":"text","label":"What shipped — client label","help":"","value":"Client"},{"key":"label_role","kind":"text","label":"What shipped — role label","help":"","value":"Role"},{"key":"label_stack","kind":"text","label":"What shipped — stack label","help":"","value":"Stack"},{"key":"delivered_note","kind":"para","label":"What shipped — note under the list","help":"","value":"No traffic, revenue or ranking figures are published here. We only publish numbers we can show you — a Lighthouse run, a Search Console export, an error rate — and for this project we do not hold them.","rows":3},{"key":"partner_eyebrow","kind":"text","label":"As a partner brief — small line","help":"","value":"If this were your brief"},{"key":"partner_heading","kind":"text","label":"As a partner brief — heading","help":"","value":"The same build, delivered under your brand."},{"key":"partner_lede","kind":"para","label":"As a partner brief — paragraph","help":"","value":"As a white-label project this runs through the same five steps, with your agency on the staging URL, the commits and the handover — and our name nowhere.","rows":3},{"key":"related_eyebrow","kind":"text","label":"Related — small line","help":"","value":"More work"},{"key":"related_heading","kind":"text","label":"Related — heading","help":"","value":"Related builds."}]},{"key":"detail_cta","title":"Every case study page — closing call to action","help":"The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Send the brief —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"get a fixed price within two business days."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]}]},
{"slug":"rates","id":"rates","title":"Rates","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Rates — simple monthly plans for agencies"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"White-label pricing for agencies: monthly plans sized by how many client projects you run, with anything outside a plan scoped and quoted first.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Rates"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Simple monthly plans, priced up front."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and move up or down as that number changes.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is the number of plans and how fast a scope comes back.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How pricing works"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Priced by workload, not by hours."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"A plan covers the projects you run in parallel; anything bigger is scoped and quoted before it starts.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Hourly billing punishes the agency for asking questions and rewards the supplier for being slow. We do the opposite. Pick the monthly plan that matches how many client projects you have open at once, and the production capacity comes with it — builds, fixes, automation, SEO implementation and the maintenance that keeps a site alive."},{"text":"Work that sits outside a plan — a migration, a store from scratch, a rescue — gets its own written scope with a fixed price, sent {scope_time} of the brief. No plan is required to send that first brief, and moving between tiers takes a message, not a renegotiation."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"No lock-in","text":"Monthly, cancel or change tier as your pipeline changes."},{"title":"Fixed-price projects","text":"Every scope is agreed in writing before work begins."},{"title":"Your margin is yours","text":"What you charge your client is never our business."},{"title":"Nothing hidden","text":"Third-party costs are passed through at cost, listed by name."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page). {scope_time} in a paragraph becomes the scope turnaround from Process steps.","value":[{"text":"The plans","url":"#rates"},{"text":"Pricing questions","url":"#faq"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"plans","title":"Plans","help":"The plans themselves — names, prices, what is included — are edited under Plans in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"Not shown on the Rates page, where the banner introduces the plans.","value":"Rates"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Simple monthly plans built for how agencies actually work."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and change plans as that number changes.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"How pricing works","url":"/rates"}},{"key":"button","kind":"link","label":"Button on every plan","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"price_note","kind":"text","label":"Under a price","help":"","value":"Billed monthly · no long-term contract"},{"key":"no_price","kind":"text","label":"Instead of a price, when a plan has none","help":"","value":"Let's talk"},{"key":"no_price_note","kind":"text","label":"Under \"Let's talk\"","help":"","value":"Scoped and quoted around your volume"},{"key":"note","kind":"para","label":"Note under the plans","help":"","value":"Billed monthly — move up or down a plan as your client workload changes. Prefer to talk first? The scoping call is 20 minutes and free.","rows":3}]},{"key":"faq","title":"Questions","help":"The questions themselves are edited under FAQs in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"FAQ"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"The questions agencies ask before the first brief."},{"key":"card_title","kind":"text","label":"Side card — title","help":"","value":"Still unanswered?"},{"key":"card_text","kind":"para","label":"Side card — text","help":"{email} becomes the contact email from Headless settings.","value":"A 20-minute scoping call costs nothing and usually answers it. Or email [{email}](mailto:{email}).","rows":3},{"key":"card_button","kind":"link","label":"Side card — button","help":"","value":{"text":"Send us a brief","url":"/contact"}},{"key":"card_link","kind":"link","label":"Side card — text link","help":"","value":{"text":"Book a call","url":"/contact#call"}}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]}]},
{"slug":"security","id":"security","title":"Security & confidentiality","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Security & client confidentiality"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"How agency and client data is handled: mutual NDA, shared-vault credentials, least-privilege access, and access revoked and confirmed at handover.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Security & confidentiality"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Your client's data, treated like it is yours. Because it is."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"Agencies hand us logins, client names and campaign data. This page says exactly what happens to them — and what goes into the contract so you do not have to take our word for it.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Up to three short facts shown as cards on the right, on large screens.","value":[{"label":"Before the brief","value":"Mutual NDA"},{"label":"Credentials","value":"In a shared vault only"},{"label":"At handover","value":"Access revoked and confirmed"}],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"What this page is"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"The rules we work to, written down."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"Everything below is either already in the contract or can be, before a single credential changes hands.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Handing production to another company means handing over logins, client names, analytics and sometimes payment data. That is a real risk, and “trust us” is not an answer to it. So this page lists what actually happens: where credentials live, who can see them, what we keep after a project ends, and what we sign before it begins."},{"text":"None of it is aspirational. If a practice is on this page, it is how the work runs today — and the clauses that back it are in the agency protection terms you sign once, not buried in a policy nobody reads."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"Mutual NDA first","text":"Signed before client names or systems are discussed."},{"title":"Vault, never email","text":"Credentials live in a shared vault with access we can revoke."},{"title":"Least access","text":"The role we need, on the systems we need, for as long as the work runs."},{"title":"Clean exit","text":"Access revoked and confirmed in writing at handover."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"Our practices","url":"#practices"},{"text":"Contract terms","url":"#protection"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"practices","title":"Practices","help":"A written band: the practices are the rows below, not a list from the menu.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Practices"},{"key":"heading","kind":"text","label":"Heading","help":"{Count} becomes the number of practices below, as a word.","value":"{Count} things that are true on every project."},{"key":"list","kind":"items","label":"The practices","help":"Each one is a public commitment about client data — only what is true on every project.","value":[{"title":"Mutual NDA before the brief","text":"Our template or yours, signed before a client's name is shared. Available on request from the contact form."},{"title":"Credentials in a shared vault only","text":"1Password or Bitwarden shared vaults. Never in email, chat or documents. You can rotate or revoke at any time."},{"title":"Least-privilege access","text":"A scoped WordPress role, Shopify staff permissions or GA4 property access rather than owner logins. Admin only when the work needs it, and only for as long as it needs it."},{"title":"Revoked and confirmed at handover","text":"Our access is removed when the work is delivered, and we confirm the removal in writing with the handover document."},{"title":"Encrypted devices, 2FA everywhere","text":"Every workstation is disk-encrypted; every account we hold has two-factor authentication turned on."},{"title":"Lawful transfers for EU and UK data","text":"Bangladesh is not on the EU adequacy list. We work under Standard Contractual Clauses, the UK IDTA or Addendum, and an Article 28 data processing agreement."},{"title":"Named sub-processors","text":"Hosting, email and tooling providers that could touch client data are listed in the DPA. No surprises."},{"title":"Staging that stays private","text":"Staging sites are password-protected, set to noindex, and removed within 14 days of launch unless you ask otherwise."}],"item":"Practice","slots":10,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]}]},{"key":"protection","title":"Agency protection","help":"The clauses themselves are edited under Protection clauses in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Agency protection"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Your client stays yours. In writing."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Most white-label sites mention an NDA once. These are the terms we work under on every project — the full text goes into your contract.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"Not shown on the Security page, which is where it points.","value":{"text":"How credentials and client data are handled","url":"/security"}},{"key":"artefact","kind":"text","label":"Label on the document card","help":"The card is an illustration of the signed agreement; only this line is written.","value":"Agency protection agreement · schedule A"}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Want the NDA before you say anything else? Ask for it in the brief."},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":""},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"It arrives before any client detail is discussed.","rows":3}]}]},
{"slug":"partner-programme","id":"partner_programme","title":"Partner programme","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Partner programme — become an agency partner"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Partner with SoftVolt AI: one fixed-price project first, then a retainer if the briefs keep coming. NDA and protection terms signed once.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Become a partner"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Partnership starts with one project, not a pitch deck."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"We do not ask agencies to commit before they have seen the work. The first brief is a fixed-price project; everything after it gets easier.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the cards show the first three steps from \"How it starts\".","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]},{"key":"button","kind":"link","label":"Button","help":"","value":{"text":"Send the first brief","url":"/contact"}},{"key":"button_secondary","kind":"link","label":"Second button","help":"","value":{"text":"See how pricing works","url":"/rates"}}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"What a partnership is"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"A supplier you can put in front of nobody."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"No exclusivity, no minimum spend, no logo on your work — the partnership is simply that the next brief is easier than the last.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Most white-label arrangements start with a contract nobody has earned yet. Ours starts with a project. You send one brief, we scope it in writing, build it under your brand and hand it over with the documents your client can read. If that goes well, the second brief skips the introductions — we already know your stack, your conventions and how you like a handover written."},{"text":"Partners get the same production team, the same fixed prices and the same hours as anyone else. What changes is the paperwork: one NDA and one master agreement cover everything that follows, so each new project is a scope and a start date rather than a negotiation."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"One agreement","text":"Signed once, covering every project that follows it."},{"title":"Your brand only","text":"We are never named to your client, in writing or in a call."},{"title":"No exclusivity","text":"Keep your other suppliers. We are not asking for the lot."},{"title":"Leave any time","text":"Plans are monthly; projects end when the handover is signed."}],"item":"Point","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"How it starts","url":"#steps"},{"text":"Ways to work","url":"#models"},{"text":"The terms","url":"#terms"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"steps","title":"How it starts","help":"A written band: the steps are the rows below, not a list from the menu.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How it starts"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"From first brief to standing retainer."},{"key":"list","kind":"items","label":"The steps","help":"","value":[{"title":"Start with one brief","text":"No onboarding fee, no minimum. Send a real project and judge the scope, the communication and the delivery on that."},{"title":"Sign the paperwork once","text":"Mutual NDA, agency protection terms and, for EU/UK data, the DPA — signed once, covering every project after."},{"title":"Move to a retainer if it is recurring","text":"When the briefs keep coming, a monthly block of hours with a named producer costs less and schedules faster than project by project."},{"title":"Resell what we maintain","text":"Care plans, hosting management and reporting are built to be resold under your brand at your margin."}],"item":"Step","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]}]},{"key":"models","title":"Ways to work","help":"The plans themselves are edited under Plans in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Ways to work"},{"key":"heading","kind":"text","label":"Heading","help":"{Count} becomes the number of plans, as a word.","value":"{Count} engagement models."}]},{"key":"terms","title":"The terms","help":"The terms themselves are edited under Commitments in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Signed once"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"What every partner gets in writing."}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Send the first brief. Judge us on that."},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":""},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Scope and fixed price within two business days. The NDA, if you want it first, arrives before anything else.","rows":3}]}]},
{"slug":"about","id":"about","title":"About","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"About — the team behind the agencies"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"The Dhaka team behind agencies in the UK and US: senior WordPress, Next.js and SEO production, founded by a nine-year agency developer.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"About SoftVolt AI"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"The digital team behind agencies."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"SoftVolt AI exists so agencies can sell websites, apps, automation, SEO and paid media without building a bigger team. We are based in Dhaka, work UK and US hours, and never appear in front of your client.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is where we are based, our hours and who founded the company.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Our story"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Built from nine years inside agencies."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"The people who take your brief are the ones who build it — senior WordPress, Next.js and SEO hands, on your working day.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"SoftVolt AI grew out of nine years of doing this work from the inside — building WordPress and WooCommerce sites for clients in the UK and Bangladesh, and most recently leading the WordPress team at a UK agency."},{"text":"The pattern never changed. The agency won the client, then the build waited on developers who were already fully booked. Deadlines slipped, margins shrank, and the client relationship took the hit."},{"text":"SoftVolt AI is the team that fixes that: senior production capacity that works under your brand, overlaps with your working day, and writes every step down."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[],"item":"Point","slots":3,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"The team","url":"#founder"},{"text":"Our rules","url":"#why"},{"text":"How we work","url":"#how-it-works"},{"text":"Our hours","url":"#hours"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"team","title":"The team","help":"The people themselves are edited under Team in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Who does the work"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"A named person, not a pool."},{"key":"link","kind":"link","label":"Text link","help":"Type - (a dash) as the link text to show no link.","value":{"text":"More about the team","url":"/about"}}]},{"key":"values","title":"Our rules","help":"A written band: the rules are the rows below, not a list from the menu.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Why SoftVolt AI"},{"key":"heading","kind":"text","label":"Heading","help":"{Count} becomes the number of rules below, as a word.","value":"{Count} rules we keep on every project."},{"key":"list","kind":"items","label":"The rules","help":"","value":[{"title":"Invisible by design","text":"Your brand on the staging URL, the commits, the reports and the handover. Ours nowhere. That is the product."},{"title":"Written, not remembered","text":"Scope, price, checklist, handover — if it matters, it is a document you can forward to the client."},{"title":"Senior hands","text":"The people who scope the work are the people who build it. No hand-off to a junior pool after the sales call."},{"title":"Honest numbers","text":"We publish measurements we can prove and nothing we cannot. No invented client counts, no guaranteed rankings."}],"item":"Rule","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]}]},{"key":"process","title":"How it works","help":"The steps themselves are edited under Process steps in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"How it works"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Five steps. Each one leaves a document you can forward to your client."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"No black box. Every stage produces something written — a scope, a staging link, a checklist, a handover — so you always know where the work is without asking.","rows":3},{"key":"link","kind":"link","label":"Text link","help":"","value":{"text":"What happens after the first brief","url":"/partner-programme"}},{"key":"artefacts","kind":"items","label":"Document cards","help":"The card that slides in beside each step, in the same order as the steps. What is written inside each card is part of the illustration.","value":[{"title":"Brief received","meta":"northwind-digital · 17:04 London"},{"title":"Scope & quote","meta":"v1 · within 2 business days"},{"title":"Production","meta":"staging.northwind-digital.co.uk"},{"title":"QA checklist","meta":"42 checks · published"},{"title":"Handover","meta":"northwind-digital · launch day"}],"item":"Card","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"meta","label":"Line on the right","kind":"text"}]}]},{"key":"hours","title":"Working hours","help":"The cities in the table are edited under Clocks in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Follow the sun"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Brief us at 5pm London. Review it at 9am."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Dhaka is UTC+6 with no daylight saving, and we cover 09:00–23:00 local. Here is what that overlap looks like against your working day — including where it is thin.","rows":3},{"key":"city_label","kind":"text","label":"Table — first column","help":"","value":"City · local time"},{"key":"overlap_label","kind":"text","label":"Table — last column","help":"","value":"Overlap"},{"key":"footnote","kind":"para","label":"Note under the table","help":"","value":"Volt = your 09:00–18:00 that falls inside our coverage. Computed from your browser's clock, daylight saving included.","rows":2}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Let's build your next client project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand."},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.","rows":3}]}]},
{"slug":"contact","id":"contact","title":"Contact","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Contact — ask us anything"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Ask SoftVolt AI a question, flag an issue on live work or introduce your agency. A named producer replies within one business day.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Contact"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"Ask us anything. A person answers, not a queue."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"A question about how we work, an issue on something live, an introduction, or a project that is still an idea — it all comes to the same inbox, and a named producer replies within one business day.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Leave these empty and the page shows its own live figures, counted from the content. Today that is how fast we reply, how fast a scope comes back, and the NDA.","value":[],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Before you write"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"No form maze, no sales sequence."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"One short form, read by the person who would do the work — and if it turns into a project, the scope and the price follow in writing.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"Use this page for anything that is not a project brief yet: how we price, whether we cover a platform, what happens to credentials, a problem on work already running, or simply an introduction so the name is familiar when you do have something to send."},{"text":"If what you have is a project, the four-step brief form on the [homepage](/#brief) asks the questions we would otherwise have to ask you: the platform, the deadline and the budget. {brief_step}: {brief_time}. The scope follows {scope_time} — line by line, priced, and nothing starts until you approve it."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[{"title":"NDA first","text":"Mutual, signed before client details change hands."},{"title":"Already working with us?","text":"Say so in the message — it goes straight to your producer."},{"title":"One reply, not a thread","text":"Every open question comes back in a single message."},{"title":"Fixed price","text":"The scope carries the number. Changes are priced, not assumed."},{"title":"Prefer to talk?","text":"A 20-minute scoping call is free and booked in your time zone."}],"item":"Point","slots":7,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page). In the paragraphs, {brief_step}, {brief_time} and {scope_time} become the first two Process steps.","value":[{"text":"Send a message","url":"#message"},{"text":"Book a call","url":"#call"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"message","title":"Message form","help":"The band beside the contact form.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Write to us"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"One form. One person. One reply."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"","value":"A question, an issue on live work, an introduction or an idea — the same producer answers all four.","rows":2},{"key":"call_label","kind":"text","label":"\"Prefer to talk\" — label","help":"","value":"Prefer to talk?"},{"key":"call_link","kind":"text","label":"\"Prefer to talk\" — link text","help":"Shown when a booking link is set in Headless settings.","value":"Book a 20-minute scoping call ↗"},{"key":"call_text","kind":"para","label":"\"Prefer to talk\" — text without a booking link","help":"","value":"A 20-minute scoping call is free — ask for a slot in your message and we will send times in your time zone.","rows":2},{"key":"email_label","kind":"text","label":"Email — label","help":"","value":"Email"},{"key":"hours_label","kind":"text","label":"Hours — label","help":"","value":"Hours"},{"key":"hours_text","kind":"text","label":"Hours — text","help":"{location} and {offset} come from Headless settings.","value":"{location} · {offset} · UK and US overlap, daily"},{"key":"nda_label","kind":"text","label":"NDA — label","help":"","value":"NDA first?"},{"key":"nda_text","kind":"para","label":"NDA — text","help":"","value":"Tick the box in the form. The mutual NDA arrives before any client detail is discussed.","rows":2},{"key":"brief_label","kind":"text","label":"Project brief — label","help":"","value":"Ready to brief a project?"},{"key":"brief_link","kind":"link","label":"Project brief — link","help":"","value":{"text":"The four-step brief form","url":"/#brief"}},{"key":"brief_text","kind":"text","label":"Project brief — text after the link","help":"","value":"asks for the platform, the deadline and the budget in one pass."},{"key":"next_label","kind":"text","label":"What happens next — label","help":"","value":"What happens next"},{"key":"next_text","kind":"para","label":"What happens next — text","help":"","value":"Reply within 1 business day → scope and fixed price within 2 → work starts on your written approval.","rows":2}]},{"key":"form","title":"Message form — the questions","help":"Every word inside the form. The choices in the two drop-downs are fixed, because the form checks the answer against that list before it sends. Where a message is delivered is set under Headless settings → Forms.","fields":[{"key":"title","kind":"text","label":"Form title","help":"","value":"Send a message"},{"key":"reply_note","kind":"text","label":"Note beside the title","help":"","value":"Reply within 1 business day"},{"key":"name_label","kind":"text","label":"Name — label","help":"","value":"Your name"},{"key":"name_placeholder","kind":"text","label":"Name — grey example text","help":"","value":"Alex Roe"},{"key":"email_label","kind":"text","label":"Email — label","help":"","value":"Email"},{"key":"email_placeholder","kind":"text","label":"Email — grey example text","help":"","value":"alex@agency.com"},{"key":"company_label","kind":"text","label":"Agency — label","help":"","value":"Agency or company"},{"key":"company_placeholder","kind":"text","label":"Agency — grey example text","help":"","value":"Northwind Digital"},{"key":"phone_label","kind":"text","label":"Phone — label","help":"","value":"Phone (optional)"},{"key":"phone_placeholder","kind":"text","label":"Phone — grey example text","help":"","value":"+44 7700 900123"},{"key":"topic_label","kind":"text","label":"Topic — label","help":"","value":"What is it about?"},{"key":"topic_placeholder","kind":"text","label":"Topic — first line of the list","help":"The choices under it are fixed: the form checks the answer against that list.","value":"Pick one"},{"key":"budget_label","kind":"text","label":"Budget — label","help":"","value":"Budget (optional)"},{"key":"budget_empty","kind":"text","label":"Budget — first line of the list","help":"","value":"Prefer not to say"},{"key":"message_label","kind":"text","label":"Message — label","help":"","value":"Message"},{"key":"message_placeholder","kind":"para","label":"Message — grey example text","help":"","value":"What exists today, what the client needs, and when it has to be live. Client names can wait until the NDA is signed.","rows":2},{"key":"nda_label","kind":"text","label":"NDA tick box","help":"","value":"Send me the mutual NDA first — before any client detail is discussed."},{"key":"submit","kind":"text","label":"Button","help":"","value":"Send message"},{"key":"sending","kind":"text","label":"Button — while it sends","help":"","value":"Sending…"},{"key":"consent","kind":"para","label":"Line under the button","help":"","value":"We reply from a person, never a sales sequence. Your details are used to answer you and nothing else","rows":2},{"key":"privacy_link","kind":"text","label":"The privacy policy link","help":"Written after the line above, and links to the privacy policy page.","value":"privacy policy"},{"key":"required_note","kind":"text","label":"Mark on a question that must be answered","help":"Shown in green beside the label. Type a dash to hide it.","value":"*"}]}]},
{"slug":"blog","id":"blog","title":"Blog","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Blog"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Notes on white-label delivery: how agency work is scoped, built, automated and reported on. Written by the people who do the work, published from our own CMS.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page — the first thing a visitor reads.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Blog"},{"key":"heading","kind":"text","label":"Headline","help":"The page's one big heading.","value":"What we learn on agency work, written down."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"Scoping, build notes, automation patterns and the reporting agencies actually forward to their clients. Every post is written by whoever did the work.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the headline","help":"Up to three short facts shown as cards on the right. {count} becomes the number of published posts.","value":[{"label":"Written by","value":"The delivery team"},{"label":"Published from","value":"Our own CMS"},{"label":"Posts","value":"{count}"}],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"intro","title":"Intro","help":"The band straight under the banner: what this page covers, in a few sentences.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"What you will find here"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Method, not marketing."},{"key":"subheading","kind":"para","label":"Line under the heading","help":"One sentence, set larger than the paragraphs.","value":"The same notes we send partners when they ask how something was done.","rows":2},{"key":"paragraphs","kind":"items","label":"Paragraphs","help":"Write [link text](/page) to turn words into a link.","value":[{"text":"This is the working half of the site. The service pages say what we deliver; these posts say how a particular job went — the constraint that shaped it, the approach we took, and what we would do differently next time."},{"text":"Everything here is published from the same WordPress install that runs the rest of the site, so an editor can post without a developer and the page you are reading updates within seconds."}],"item":"Paragraph","slots":4,"sub":[{"key":"text","label":"Paragraph","kind":"para"}]},{"key":"points","kind":"items","label":"Key points","help":"Short definitions under the paragraphs. Up to four read best.","value":[],"item":"Point","slots":3,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]},{"key":"links","kind":"items","label":"\"On this page\" links","help":"Buttons that jump to a section below (#section) or to another page (/page).","value":[{"text":"All services","url":"/services"},{"text":"Case studies","url":"/case-studies"},{"text":"Talk to us","url":"/contact"}],"item":"Link","slots":6,"sub":[{"key":"text","label":"Link text","kind":"text"},{"key":"url","label":"Goes to","kind":"text"}]}]},{"key":"posts","title":"The posts","help":"The newest post is shown on its own at the top; the rest follow as cards, with a button per topic above them. The posts themselves are written under Posts in the menu on the left.","fields":[{"key":"featured_eyebrow","kind":"text","label":"Small line above the newest post","help":"","value":"Latest post"},{"key":"heading","kind":"text","label":"Heading above the other posts","help":"Shown once there is a second post.","value":"More from the blog"},{"key":"filter_all","kind":"text","label":"First filter button","help":"The rest of the buttons are the categories the posts are filed under.","value":"All topics"},{"key":"read_more","kind":"text","label":"Link on each post card","help":"","value":"Read the post"},{"key":"empty_heading","kind":"text","label":"Heading when nothing is published","help":"","value":"Nothing published yet"},{"key":"empty_text","kind":"para","label":"Text when nothing is published","help":"","value":"The first posts are being written. In the meantime the case studies carry the same detail — what was built, on what stack, and what it changed.","rows":3},{"key":"empty_button","kind":"link","label":"Button when nothing is published","help":"","value":{"text":"Read the case studies","url":"/case-studies"}},{"key":"empty_button_secondary","kind":"link","label":"Second button when nothing is published","help":"","value":{"text":"Ask us something","url":"/contact"}}]},{"key":"cta","title":"Closing call to action","help":"The dark band above the footer. Its two buttons come from Headless settings → Calls to action.","fields":[{"key":"pill","kind":"text","label":"Small label","help":"","value":"Next step"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Want this written about your project —"},{"key":"accent","kind":"text","label":"Words after the heading, in green","help":"Type - (a dash) to show none.","value":"under your brand?"},{"key":"lede","kind":"para","label":"Paragraph","help":"","value":"Everything here was built for an agency first. Send the brief and get a written scope with a fixed price within two business days.","rows":3}]},{"key":"post_banner","title":"Every post page — banner","help":"The same banner at the top of every post. The post's own title, picture and words are under it, written under Posts in the menu on the left.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"From the blog"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Notes from the people doing the work."},{"key":"lede","kind":"para","label":"Paragraph under the heading","help":"","value":"Scoping decisions, build notes and the reporting agencies forward to their clients — written up as the job finishes.","rows":3},{"key":"facts","kind":"items","label":"Fact cards beside the heading","help":"Up to three short facts shown as cards on the right, on large screens — the same as every other page's banner. They are the same on every post.","value":[{"label":"Written by","value":"The delivery team"},{"label":"Published from","value":"Our own CMS"},{"label":"Read next","value":"Case studies"}],"item":"Fact","slots":3,"sub":[{"key":"label","label":"Small label","kind":"text"},{"key":"value","label":"Fact","kind":"text"}]}]},{"key":"post","title":"Every post page — around the post","help":"Everything on a post page except the post and the comments: the strip above the words, the cards down the right (search, categories, tags, recent posts) and the two links to the posts either side. The categories and tags are whatever the posts are filed under.","fields":[{"key":"published_label","kind":"text","label":"\"Published\" label","help":"","value":"Published"},{"key":"author_label","kind":"text","label":"\"Written by\" label","help":"","value":"Written by"},{"key":"filed_label","kind":"text","label":"\"Filed under\" label","help":"","value":"Filed under"},{"key":"reading_time","kind":"text","label":"Reading time","help":"{minutes} is counted from the post itself.","value":"{minutes} min read"},{"key":"updated_label","kind":"text","label":"\"Updated\" label","help":"Shown only when a post was changed after it was published.","value":"Updated"},{"key":"card_title","kind":"text","label":"Strip above the post — title","help":"Read by screen readers; the labels below are what a visitor sees.","value":"This post"},{"key":"search_heading","kind":"text","label":"Sidebar — heading above the search box","help":"","value":"Search"},{"key":"search_placeholder","kind":"text","label":"Sidebar — grey text inside the search box","help":"","value":"Search the site"},{"key":"categories_heading","kind":"text","label":"Sidebar — heading above the categories","help":"","value":"Categories"},{"key":"tags_heading","kind":"text","label":"Sidebar — heading above the tags","help":"","value":"Tags"},{"key":"recent_heading","kind":"text","label":"Sidebar — heading above the other posts","help":"","value":"Recent posts"},{"key":"cta_heading","kind":"text","label":"Sidebar — heading on the last card","help":"","value":"Send us a brief"},{"key":"cta_text","kind":"para","label":"Sidebar — text on the last card","help":"","value":"Got a job like the one in this post? Tell us what you are building and we will scope it.","rows":3},{"key":"prev_label","kind":"text","label":"Link to the post before","help":"","value":"Previous post"},{"key":"next_label","kind":"text","label":"Link to the post after","help":"","value":"Next post"},{"key":"all_posts","kind":"text","label":"Link shown when a post has no neighbours","help":"","value":"All posts"}]},{"key":"post_comments","title":"Every post page — comments","help":"The comments under a post. They are moderated under Comments in the menu on the left — nothing appears on the site until it is approved there.","fields":[{"key":"heading","kind":"text","label":"Heading above the comments","help":"","value":"Comments"},{"key":"count_one","kind":"text","label":"Count — one comment","help":"{count} becomes the number.","value":"{count} comment"},{"key":"count_many","kind":"text","label":"Count — more than one","help":"","value":"{count} comments"},{"key":"empty","kind":"para","label":"Text when nobody has commented yet","help":"","value":"No comments yet. Yours would be the first.","rows":3},{"key":"form_heading","kind":"text","label":"Heading above the form","help":"","value":"Leave a comment"},{"key":"form_lede","kind":"para","label":"Line under that heading","help":"","value":"Your email is not published. Comments are read before they appear, so give it a few hours.","rows":2},{"key":"name_label","kind":"text","label":"Name — label","help":"","value":"Your name"},{"key":"email_label","kind":"text","label":"Email — label","help":"","value":"Email"},{"key":"email_note","kind":"text","label":"Email — note under the field","help":"","value":"Not published."},{"key":"comment_label","kind":"text","label":"Comment — label","help":"","value":"Comment"},{"key":"comment_placeholder","kind":"para","label":"Comment — grey example text","help":"","value":"Something you would want to read yourself.","rows":2},{"key":"submit","kind":"text","label":"Button","help":"","value":"Post comment"},{"key":"sending","kind":"text","label":"Button — while it sends","help":"","value":"Posting…"},{"key":"held","kind":"para","label":"Once it has sent, and is waiting for approval","help":"","value":"Thank you — your comment is with us and will appear once it has been read.","rows":3},{"key":"published","kind":"para","label":"Once it has sent, and is already published","help":"","value":"Thank you — your comment is up.","rows":3},{"key":"error","kind":"text","label":"When it could not be sent","help":"","value":"We could not save that just now. Please try again in a moment."},{"key":"closed","kind":"text","label":"When comments are closed on a post","help":"","value":"Comments are closed on this post."},{"key":"reply","kind":"text","label":"Link under each comment","help":"","value":"Reply"},{"key":"replying_to","kind":"text","label":"Note above the form while replying","help":"{name} is whoever wrote the comment.","value":"Replying to {name}"},{"key":"cancel_reply","kind":"text","label":"Link that cancels a reply","help":"","value":"Cancel"}]}]},
{"slug":"thank-you","id":"thank_you","title":"Thank you","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Thank you"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"Your message reached a person at SoftVolt AI. A named producer replies within one business day.","rows":3}]},{"key":"message","title":"After the message form","help":"Shown at /thank-you, after someone sends the short message form on the contact page.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Message sent"},{"key":"heading","kind":"text","label":"Headline","help":"","value":"Thank you — it is with a person, not a queue."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"A named producer replies within one business day. If it is urgent, email us and say so in the subject line.","rows":3},{"key":"steps","kind":"items","label":"What happens next","help":"","value":[{"title":"Read by a person","text":"Your message goes to the producer who covers your hours, not to a shared queue or a sales sequence."},{"title":"A reply within one business day","text":"With an answer, or with the one question we need answered before we can give you one."},{"title":"The NDA first, if you asked","text":"If you ticked the NDA box, it arrives before any client detail is discussed."}],"item":"Step","slots":5,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]}]},{"key":"brief","title":"After the brief form","help":"Shown at /thank-you/brief, after someone sends the four-step brief.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"Brief received"},{"key":"heading","kind":"text","label":"Headline","help":"","value":"Thank you. A named producer replies within one business day."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"The written scope and fixed price follow within two business days. If you asked for the NDA first, it arrives before any client detail is discussed.","rows":3},{"key":"steps","kind":"items","label":"What happens next","help":"","value":[{"title":"Within one business day","text":"A named producer confirms the brief and asks anything the scope depends on."},{"title":"Within two business days","text":"A written scope with a fixed price, the timeline and what we need from you."},{"title":"When you approve it","text":"Work starts once the scope is agreed in writing — under your agency's name from the first staging link."}],"item":"Step","slots":5,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Text","kind":"para"}]}]},{"key":"next","title":"While you wait","help":"The same on both thank-you pages.","fields":[{"key":"steps_eyebrow","kind":"text","label":"Steps — small line above them","help":"","value":"What happens next"},{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"While you wait"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"See the work in the meantime."},{"key":"links","kind":"items","label":"Links","help":"","value":[{"title":"Case studies","text":"Live builds you can open, each with the brief it answered.","url":"/case-studies"},{"title":"How we work","text":"Five steps from brief to handover, each one written down.","url":"/about#how-it-works"},{"title":"Security & confidentiality","text":"How your clients' access, code and data are protected.","url":"/security"}],"item":"Link","slots":5,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Line under it","kind":"para"},{"key":"url","label":"Goes to (a path such as /services)","kind":"text"}]},{"key":"call","kind":"text","label":"Booking link text","help":"Shown only while a booking link is set on the site.","value":"Want to talk it through sooner? Book the 20-minute scoping call ↗"},{"key":"button","kind":"link","label":"Button","help":"","value":{"text":"Back to the homepage","url":"/"}}]}]},
{"slug":"not-found","id":"not_found","title":"Page not found","sections":[{"key":"seo","title":"Google & sharing","help":"What search results and link previews show for this page. Nothing here appears on the page itself.","fields":[{"key":"title","kind":"text","label":"Page title in Google","help":"The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it.","value":"Page not found"},{"key":"description","kind":"para","label":"Description in Google","help":"The two lines under the title in search results and link previews. Keep it under 160 characters.","value":"The page you were looking for is not here. Start from the services, the case studies or the contact page.","rows":3}]},{"key":"banner","title":"Banner","help":"The top of the page every broken or old link lands on.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the headline","help":"","value":"404 — page not found"},{"key":"heading","kind":"text","label":"Headline","help":"","value":"This page is not here."},{"key":"lede","kind":"para","label":"Paragraph under the headline","help":"","value":"The link may be old, or the page has not shipped yet. Everything we do is one click away from here — or ask us, and a person answers within one business day.","rows":3},{"key":"button","kind":"link","label":"Main button","help":"","value":{"text":"Back to the homepage","url":"/"}},{"key":"button_secondary","kind":"link","label":"Second button","help":"","value":{"text":"Send us a message","url":"/contact"}}]},{"key":"links","title":"Where to go next","help":"Cards under the banner. Leave a row's title empty to drop that card.","fields":[{"key":"eyebrow","kind":"text","label":"Small line above the heading","help":"","value":"Popular pages"},{"key":"heading","kind":"text","label":"Heading","help":"","value":"Most people are looking for one of these."},{"key":"items","kind":"items","label":"Links","help":"","value":[{"title":"Services","text":"Build, automate, grow and support — every white-label service in one place.","url":"/services"},{"title":"Case studies","text":"Live builds you can open, not logos you have to trust.","url":"/case-studies"},{"title":"Rates","text":"Monthly plans and a fixed price for every brief.","url":"/rates"},{"title":"Contact","text":"Send a brief or a question and a named producer replies.","url":"/contact"}],"item":"Link","slots":6,"sub":[{"key":"title","label":"Title","kind":"text"},{"key":"text","label":"Line under it","kind":"para"},{"key":"url","label":"Goes to (a path such as /services)","kind":"text"}]}]}]}
]
JSON);
}

/* ==========================================================================
   Page copy
   ========================================================================== */

/**
 * Every word on the designed pages, editable page by page.
 *
 * Each designed page (Home, Services, About…) gets one field group, laid out
 * the way the page reads: a tab per section down the left, and in each tab
 * one field per piece of text, already filled with what the site says today.
 * An editor changes the words and saves; the front end picks them up.
 *
 * The field list is not written here by hand. It is generated from the page
 * definitions in the front-end repo (content/copy/*.ts) into page-copy-data.php,
 * so the fields WordPress shows and the fields the site reads can never drift.
 *
 * ACF without its paid add-on has no repeating rows, so a list — steps, cards,
 * facts — is a fixed set of numbered rows. An empty row is not shown.
 */

/** The page definitions, decoded once per request. */
function softvolt_page_copy(): array
{
    static $pages = null;
    if ($pages === null) {
        $decoded = defined('SOFTVOLT_PAGE_COPY') ? json_decode((string) SOFTVOLT_PAGE_COPY, true) : null;
        $pages   = is_array($decoded) ? $decoded : [];
    }
    return $pages;
}

/** Slug => post ID for every designed page that exists. */
function softvolt_page_copy_ids(): array
{
    static $ids = null;
    if ($ids === null) {
        $ids = [];
        foreach (softvolt_page_copy() as $page) {
            $post = get_page_by_path((string) $page['slug']);
            if ($post) {
                $ids[(string) $page['slug']] = (int) $post->ID;
            }
        }
    }
    return $ids;
}

/** One field of a section, as ACF wants it. */
function softvolt_page_copy_field(string $prefix, array $field): array
{
    $key  = $prefix . '_' . $field['key'];
    $base = [
        'key'                => $key,
        'label'              => (string) $field['label'],
        'name'               => (string) $field['key'],
        'instructions'       => (string) ($field['help'] ?? ''),
    ];

    switch ($field['kind']) {
        case 'text':
            return $base + ['type' => 'text', 'default_value' => (string) $field['value'], 'placeholder' => (string) $field['value']];

        case 'para':
            return $base + [
                'type'          => 'textarea',
                'rows'          => (int) ($field['rows'] ?? 3),
                'new_lines'     => '',
                'default_value' => (string) $field['value'],
                'placeholder'   => (string) $field['value'],
            ];

        case 'lines':
            $value = implode("\n", (array) $field['value']);
            return array_merge($base, [
                'type'          => 'textarea',
                'rows'          => max(3, count((array) $field['value'])),
                'new_lines'     => '',
                'instructions'  => trim('One per line. ' . (string) ($field['help'] ?? '')),
                'default_value' => $value,
                'placeholder'   => $value,
            ]);

        case 'link':
            return $base + [
                'type'       => 'group',
                'layout'     => 'table',
                'sub_fields' => [
                    [
                        'key' => $key . '__text', 'label' => 'Text', 'name' => 'text', 'type' => 'text',
                        'default_value' => (string) $field['value']['text'], 'placeholder' => (string) $field['value']['text'],
                    ],
                    [
                        'key' => $key . '__url', 'label' => 'Goes to', 'name' => 'url', 'type' => 'text',
                        'instructions' => 'A page on this site (/contact), a section (#faq) or a full address.',
                        'default_value' => (string) $field['value']['url'], 'placeholder' => (string) $field['value']['url'],
                    ],
                ],
            ];
    }

    return $base + ['type' => 'text'];
}

/**
 * A list, as numbered rows: "Step 1", "Step 2"… The first row carries the
 * list's name and its instructions, so the editor knows which list the rows
 * belong to without a separate heading field (a message field inside a group
 * breaks ACF's REST validation for the whole group).
 */
function softvolt_page_copy_items(string $prefix, array $field): array
{
    $out    = [];
    $values = array_values((array) $field['value']);
    $help   = trim((string) ($field['help'] ?? '') . ' Leave a row empty to hide it; empty every row to go back to the original list.');

    for ($i = 1; $i <= (int) $field['slots']; $i++) {
        $row  = $values[$i - 1] ?? [];
        $name = $field['key'] . '_' . $i;
        $sub  = [];
        foreach ($field['sub'] as $part) {
            $value = (string) ($row[$part['key']] ?? '');
            $sub[] = [
                // generated keys use a double underscore, which no field name can contain
                'key'                => $prefix . '__' . $name . '__' . $part['key'],
                'label'              => (string) $part['label'],
                'name'               => (string) $part['key'],
                'type'               => $part['kind'] === 'para' ? 'textarea' : 'text',
                'rows'               => 2,
                'new_lines'          => '',
                'default_value'      => $value,
                'placeholder'        => $value,
            ];
        }
        $out[] = [
            'key'                => $prefix . '__' . $name,
            'label'              => $i === 1 ? $field['label'] . ' — ' . $field['item'] . ' 1' : $field['item'] . ' ' . $i,
            'name'               => $name,
            'type'               => 'group',
            'instructions'       => $i === 1 ? $help : '',
            'layout'             => 'table',
            'sub_fields'         => $sub,
        ];
    }
    return $out;
}

add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    $ids = softvolt_page_copy_ids();
    foreach (softvolt_page_copy() as $page) {
        $slug = (string) $page['slug'];
        if (!isset($ids[$slug])) {
            continue; // the page does not exist yet: nothing to attach the fields to
        }

        $fields = [];
        $number = 0;
        foreach ($page['sections'] as $section) {
            $number++;
            $prefix = 'field_svc_' . $page['id'] . '_' . $section['key'];

            $fields[] = [
                'key'       => $prefix . '__tab',
                'label'     => $number . ' · ' . $section['title'],
                'name'      => '',
                'type'      => 'tab',
                'placement' => 'left',
                'endpoint'  => 0,
            ];

            $sub = [];
            foreach ($section['fields'] as $field) {
                if ($field['kind'] === 'items') {
                    array_push($sub, ...softvolt_page_copy_items($prefix, $field));
                } else {
                    $sub[] = softvolt_page_copy_field($prefix, $field);
                }
            }

            $fields[] = [
                'key'                => $prefix,
                'label'              => (string) $section['title'],
                // ACF finds a top-level field by name alone in some lookups, so
                // "services" here could be taken for the Agency type relationship of
                // the same name; the prefix keeps every name on the site unique
                'name'               => 'sv_' . $section['key'],
                'type'               => 'group',
                'instructions'       => (string) ($section['help'] ?? ''),
                'layout'             => 'block',
                'sub_fields'         => $sub,
            ];
        }

        acf_add_local_field_group([
            'key'                   => 'group_svc_' . $page['id'],
            'title'                 => $page['title'] . ' — words on this page',
            'fields'                => $fields,
            'location'              => [[['param' => 'page', 'operator' => '==', 'value' => (string) $ids[$slug]]]],
            'menu_order'            => 0,
            'position'              => 'acf_after_title',
            'style'                 => 'default',
            'label_placement'       => 'top',
            'instruction_placement' => 'label',
            // the page is built from these fields, so the empty content editor only confuses
            'hide_on_screen'        => ['the_content', 'excerpt', 'discussion', 'comments', 'format', 'featured_image', 'categories', 'tags', 'send-trackbacks'],
            'active'                => true,
            // Seven hundred fields as GraphQL types (and as REST schema) made every
            // request build a far bigger schema. The front end reads them all at
            // once through pageCopy below, so the groups stay out of both.
            'show_in_rest'          => 0,
            'show_in_graphql'       => 0,
        ]);
    }
});

/**
 * Everything an editor wrote on one designed page, as JSON keyed exactly like
 * the page definition: section => field => value, a link as {text, url}, and
 * list rows as "steps_1", "steps_2"… A field never saved comes back as its
 * starting value, and the front end fills anything empty from its own copy.
 */
function softvolt_page_copy_values(int $post_id): ?array
{
    $slug = array_search($post_id, softvolt_page_copy_ids(), true);
    if ($slug === false || !function_exists('get_field')) {
        return null;
    }
    foreach (softvolt_page_copy() as $page) {
        if ((string) $page['slug'] !== $slug) {
            continue;
        }
        $out = [];
        foreach ($page['sections'] as $section) {
            $value                           = get_field('sv_' . $section['key'], $post_id);
            $out[(string) $section['key']] = is_array($value) ? $value : new stdClass();
        }
        return $out;
    }
    return null;
}

add_action('graphql_register_types', static function (): void {
    register_graphql_field('Page', 'pageCopy', [
        'type'        => 'String',
        'description' => __('The words on a designed page, as JSON: section => field => value. Null on any other page.', 'softvolt-headless'),
        'resolve'     => static function ($page): ?string {
            $values = softvolt_page_copy_values((int) $page->databaseId);
            return $values === null ? null : (string) wp_json_encode($values, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        },
    ]);
});

/**
 * The designed pages are edited through their fields alone, so they open in
 * the classic screen — title on top, the section tabs straight under it —
 * rather than an empty block canvas with the fields pushed to the bottom.
 */
add_filter('use_block_editor_for_post', static function ($use, $post) {
    if ($post instanceof WP_Post && $post->post_type === 'page' && in_array((int) $post->ID, softvolt_page_copy_ids(), true)) {
        return false;
    }
    return $use;
}, 10, 2);

/** A short note at the top of those pages, so nobody goes looking for the missing editor. */
add_action('edit_form_after_title', static function (WP_Post $post): void {
    if ($post->post_type !== 'page' || !in_array((int) $post->ID, softvolt_page_copy_ids(), true)) {
        return;
    }
    echo '<div class="notice notice-info inline" style="margin:12px 0 0"><p>'
        . esc_html__('This page is designed in code; its words are below, one tab per section, in the order they appear on the page. Change a field and press Update — the site follows within seconds. An empty field shows the original text; type a single dash (-) where a field says it can be hidden.', 'softvolt-headless')
        . '</p></div>';
});

/* ==========================================================================
   Fields
   ========================================================================== */

/**
 * ACF field groups, registered in PHP rather than saved in the database.
 *
 * Two reasons: the field definitions belong in version control next to the
 * front-end types that consume them, and a new environment then has the right
 * fields the moment the plugin is activated — nothing to export or import.
 *
 * Lists are textareas, one item per line: the free ACF has no repeater, and
 * a line per item is what an editor would type anyway. `softvolt_lines()`
 * turns them back into arrays for the front end.
 */

add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    $where = static fn (string $type): array => [[['param' => 'post_type', 'operator' => '==', 'value' => $type]]];

    // ---------------------------------------------------------------- service
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_service',
        'Service',
        'serviceFields',
        ['Service'],
        $where('service'),
        [
            softvolt_field(['key' => 'field_sv_service_h1', 'label' => 'Page heading (H1)', 'name' => 'heading', 'type' => 'text', 'instructions' => 'The commercial phrase, e.g. "White-label WordPress development". The post title stays the short name used in lists.', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_service_summary', 'label' => 'Summary', 'name' => 'summary', 'type' => 'textarea', 'rows' => 2, 'instructions' => 'One line, shown on service cards.', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_service_intro', 'label' => 'Intro', 'name' => 'intro', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'Two or three sentences: what it is, who sends this brief, what they get.', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_service_deliverables', 'label' => 'Deliverables', 'name' => 'deliverables', 'type' => 'textarea', 'rows' => 8, 'instructions' => 'One per line. Concrete and checkable — each one appears in the scope with a price against it.']),
            softvolt_field(['key' => 'field_sv_service_signals', 'label' => 'When to send this brief', 'name' => 'signals', 'type' => 'textarea', 'rows' => 6, 'instructions' => 'One per line.']),
            softvolt_field(['key' => 'field_sv_service_stack', 'label' => 'Tooling', 'name' => 'stack', 'type' => 'textarea', 'rows' => 5, 'instructions' => 'One per line.']),
            softvolt_field(['key' => 'field_sv_service_seo', 'label' => 'SEO description', 'name' => 'seo_description', 'type' => 'textarea', 'rows' => 3, 'maxlength' => 160, 'instructions' => 'Under 160 characters, or search results will cut it off.']),
            softvolt_field(['key' => 'field_sv_service_agencies', 'label' => 'Agency types', 'name' => 'agency_types', 'type' => 'relationship', 'post_type' => ['agency_type'], 'filters' => ['search'], 'return_format' => 'id', 'instructions' => 'The agencies that send this brief most often, most relevant first.']),
        ]
    ));

    // ------------------------------------------------------------ agency type
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_agency_type',
        'Agency type',
        'agencyTypeFields',
        ['AgencyType'],
        $where('agency_type'),
        [
            softvolt_field(['key' => 'field_sv_agency_problem', 'label' => 'The problem', 'name' => 'problem', 'type' => 'textarea', 'rows' => 2, 'required' => 1, 'instructions' => 'What is blocking this kind of agency, in one line.']),
            softvolt_field(['key' => 'field_sv_agency_relief', 'label' => 'What changes', 'name' => 'relief', 'type' => 'textarea', 'rows' => 2, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_agency_intro', 'label' => 'Intro', 'name' => 'intro', 'type' => 'textarea', 'rows' => 4, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_agency_workflow', 'label' => 'How the engagement runs', 'name' => 'workflow', 'type' => 'textarea', 'rows' => 6, 'instructions' => 'One step per line.']),
            softvolt_field(['key' => 'field_sv_agency_services', 'label' => 'Services that fit', 'name' => 'services', 'type' => 'relationship', 'post_type' => ['service'], 'filters' => ['search'], 'return_format' => 'id', 'instructions' => 'In order of relevance.']),
            softvolt_field(['key' => 'field_sv_agency_seo', 'label' => 'SEO description', 'name' => 'seo_description', 'type' => 'textarea', 'rows' => 3, 'maxlength' => 160]),
        ]
    ));

    // ------------------------------------------------------------- case study
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_case_study',
        'Case study',
        'caseStudyFields',
        ['CaseStudy'],
        $where('case_study'),
        [
            softvolt_field(['key' => 'field_sv_case_client', 'label' => 'Client', 'name' => 'client', 'type' => 'text', 'required' => 1, 'instructions' => 'What the client is, not who: "UK aggregates supplier".']),
            softvolt_field(['key' => 'field_sv_case_role', 'label' => 'Our role', 'name' => 'role', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_case_summary', 'label' => 'Summary', 'name' => 'summary', 'type' => 'textarea', 'rows' => 4, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_case_delivered', 'label' => 'What shipped', 'name' => 'delivered', 'type' => 'textarea', 'rows' => 8, 'instructions' => 'One per line. Facts only — no metric we cannot show.']),
            softvolt_field(['key' => 'field_sv_case_stack', 'label' => 'Stack', 'name' => 'stack', 'type' => 'textarea', 'rows' => 5, 'instructions' => 'One per line.']),
            softvolt_field(['key' => 'field_sv_case_url', 'label' => 'Live URL', 'name' => 'live_url', 'type' => 'url']),
        ]
    ));

    // ----------------------------------------------------------- process step
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_process_step',
        'Process step',
        'processStepFields',
        ['ProcessStep'],
        $where('process_step'),
        [
            softvolt_field(['key' => 'field_sv_step_id', 'label' => 'Key', 'name' => 'step_key', 'type' => 'text', 'required' => 1, 'instructions' => 'Stable id the front end matches on: brief, scope, production, qa, delivery.']),
            softvolt_field(['key' => 'field_sv_step_turnaround', 'label' => 'Turnaround', 'name' => 'turnaround', 'type' => 'text', 'required' => 1, 'instructions' => 'A published commitment. Only what we will honour.']),
            softvolt_field(['key' => 'field_sv_step_summary', 'label' => 'Summary', 'name' => 'summary', 'type' => 'textarea', 'rows' => 3, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_step_artefact', 'label' => 'Artefact', 'name' => 'artefact', 'type' => 'text', 'instructions' => 'Which document this step leaves behind: brief, scope, staging, qa, handover.']),
        ]
    ));

    // ------------------------------------------------------------------- plan
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_plan',
        'Plan',
        'planFields',
        ['Plan'],
        $where('plan'),
        [
            softvolt_field(['key' => 'field_sv_plan_id', 'label' => 'Key', 'name' => 'plan_key', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_plan_best_for', 'label' => 'Best for', 'name' => 'best_for', 'type' => 'textarea', 'rows' => 2, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_plan_includes', 'label' => 'Includes', 'name' => 'includes', 'type' => 'textarea', 'rows' => 6, 'instructions' => 'One per line.']),
            softvolt_field(['key' => 'field_sv_plan_price', 'label' => 'Price from', 'name' => 'price_from', 'type' => 'text', 'instructions' => 'Leave empty for a quote-only tier — the front end then shows "Let us talk".']),
            softvolt_field(['key' => 'field_sv_plan_period', 'label' => 'Period', 'name' => 'period', 'type' => 'text', 'instructions' => 'e.g. /month']),
            softvolt_field(['key' => 'field_sv_plan_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text', 'instructions' => 'Optional, and only something we can stand behind.']),
        ]
    ));

    // -------------------------------------------------------------------- faq
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_faq',
        'Answer',
        'faqFields',
        ['Faq'],
        $where('faq'),
        [
            softvolt_field(['key' => 'field_sv_faq_answer', 'label' => 'Answer', 'name' => 'answer', 'type' => 'textarea', 'rows' => 6, 'required' => 1, 'instructions' => 'The question is the post title.']),
        ]
    ));

    // --------------------------------------------------------------- promises
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_promise',
        'Commitment',
        'promiseFields',
        ['Promise'],
        $where('promise'),
        [
            softvolt_field(['key' => 'field_sv_promise_id', 'label' => 'Key', 'name' => 'promise_key', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_promise_detail', 'label' => 'Detail', 'name' => 'detail', 'type' => 'textarea', 'rows' => 3, 'required' => 1, 'instructions' => 'The label is the post title.']),
        ]
    ));

    // ---------------------------------------------------------------- clauses
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_clause',
        'Protection clause',
        'clauseFields',
        ['Clause'],
        $where('clause'),
        [
            softvolt_field(['key' => 'field_sv_clause_body', 'label' => 'Clause', 'name' => 'body', 'type' => 'textarea', 'rows' => 4, 'required' => 1, 'instructions' => 'The heading is the post title. This is contract language — keep it exact.']),
        ]
    ));

    // ------------------------------------------------------------------- team
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_team',
        'Team member',
        'teamFields',
        ['TeamMember'],
        $where('team_member'),
        [
            softvolt_field(['key' => 'field_sv_team_role', 'label' => 'Role', 'name' => 'role', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_team_headline', 'label' => 'Headline', 'name' => 'headline', 'type' => 'text', 'instructions' => 'One bold line: what this person owns.']),
            softvolt_field(['key' => 'field_sv_team_bio', 'label' => 'Bio', 'name' => 'bio', 'type' => 'textarea', 'rows' => 5]),
            softvolt_field(['key' => 'field_sv_team_quote', 'label' => 'Quote', 'name' => 'quote', 'type' => 'textarea', 'rows' => 3, 'instructions' => 'Their own words. Never write this for them.']),
            softvolt_field(['key' => 'field_sv_team_facts', 'label' => 'Facts', 'name' => 'facts', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'One per line, shown as tags under the bio.']),
            softvolt_field(['key' => 'field_sv_team_linkedin', 'label' => 'LinkedIn', 'name' => 'linkedin', 'type' => 'url']),
        ]
    ));

    // ------------------------------------------------------------ testimonial
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_testimonial',
        'Testimonial',
        'testimonialFields',
        ['Testimonial'],
        $where('testimonial'),
        [
            softvolt_field(['key' => 'field_sv_quote_text', 'label' => 'Quote', 'name' => 'quote', 'type' => 'textarea', 'rows' => 4, 'required' => 1, 'instructions' => 'Exactly as the partner wrote it. Never edited for us.']),
            softvolt_field(['key' => 'field_sv_quote_name', 'label' => 'Name', 'name' => 'person_name', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_quote_role', 'label' => 'Role', 'name' => 'person_role', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_quote_agency', 'label' => 'Agency', 'name' => 'agency', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_quote_country', 'label' => 'Country', 'name' => 'country', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_quote_work', 'label' => 'What we delivered', 'name' => 'work', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_quote_consent', 'label' => 'Permission on record', 'name' => 'consent', 'type' => 'text', 'instructions' => 'When and how they agreed to appear, e.g. "Email, 2026-09-20". No permission, no publication.']),
        ]
    ));

    // ----------------------------------------------------------------- client
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_client',
        'Client',
        'clientFields',
        ['Client'],
        $where('client'),
        [
            softvolt_field(['key' => 'field_sv_client_country', 'label' => 'Country code', 'name' => 'country', 'type' => 'text', 'required' => 1, 'instructions' => 'Short: UK, US, BD.']),
            softvolt_field(['key' => 'field_sv_client_work', 'label' => 'What was delivered', 'name' => 'work', 'type' => 'text', 'required' => 1]),
            softvolt_field(['key' => 'field_sv_client_url', 'label' => 'Website', 'name' => 'url', 'type' => 'url']),
            softvolt_field(['key' => 'field_sv_client_featured', 'label' => 'Show on the globe', 'name' => 'featured', 'type' => 'true_false', 'ui' => 1, 'instructions' => 'Featured clients orbit the hero globe as round badges.']),
            softvolt_field(['key' => 'field_sv_client_logo_fill', 'label' => 'Logo fills the badge', 'name' => 'logo_fill', 'type' => 'true_false', 'ui' => 1, 'instructions' => 'On for a full-bleed coloured tile; off for a mark on white.']),
        ]
    ));

    // ------------------------------------- pages an editor adds in WordPress
    /*
     * The designed pages (Home, Services, About…) have a field group each, in
     * page-copy.php. Every other page — a policy, a landing page — is written
     * in the editor and gets just a banner and an optional intro band.
     */
    $editor_pages = [['param' => 'post_type', 'operator' => '==', 'value' => 'page']];
    foreach (softvolt_page_copy_ids() as $designed) {
        $editor_pages[] = ['param' => 'page', 'operator' => '!=', 'value' => (string) $designed];
    }
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_page',
        'Banner and intro',
        'pageFields',
        ['Page'],
        [$editor_pages],
        [
            softvolt_field(['key' => 'field_sv_page_eyebrow', 'label' => 'Small line above the headline', 'name' => 'eyebrow', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_page_heading', 'label' => 'Headline', 'name' => 'heading', 'type' => 'text', 'instructions' => 'Leave empty to use the page title.']),
            softvolt_field(['key' => 'field_sv_page_lede', 'label' => 'Paragraph under the headline', 'name' => 'lede', 'type' => 'textarea', 'rows' => 3, 'new_lines' => '']),
            softvolt_field(['key' => 'field_sv_page_intro_eyebrow', 'label' => 'Intro — small line above the heading', 'name' => 'intro_eyebrow', 'type' => 'text']),
            softvolt_field(['key' => 'field_sv_page_intro_title', 'label' => 'Intro — heading', 'name' => 'intro_title', 'type' => 'text', 'instructions' => 'The band under the banner. Leave it empty and the page has no intro band.']),
            softvolt_field(['key' => 'field_sv_page_intro_sub', 'label' => 'Intro — line under the heading', 'name' => 'intro_subtitle', 'type' => 'textarea', 'rows' => 2, 'new_lines' => '']),
            softvolt_field(['key' => 'field_sv_page_intro_body', 'label' => 'Intro — paragraphs', 'name' => 'intro_body', 'type' => 'textarea', 'rows' => 6, 'new_lines' => '', 'instructions' => 'One paragraph per line.']),
        ]
    ));

    // ------------------------------------------------------------------ stack
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_stack',
        'Stack item',
        'stackFields',
        ['StackItem'],
        $where('stack_item'),
        [
            softvolt_field(['key' => 'field_sv_stack_group', 'label' => 'Group', 'name' => 'group', 'type' => 'text', 'required' => 1, 'instructions' => 'The column it sits under, e.g. "Front end". Items with the same group are shown together, in this order.']),
        ]
    ));

    // ------------------------------------------------------------- comparison
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_comparison',
        'Comparison row',
        'comparisonFields',
        ['ComparisonRow'],
        $where('comparison_row'),
        [
            softvolt_field(['key' => 'field_sv_cmp_inhouse', 'label' => 'In-house hire', 'name' => 'in_house', 'type' => 'textarea', 'rows' => 3, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_cmp_freelancer', 'label' => 'Freelancer', 'name' => 'freelancer', 'type' => 'textarea', 'rows' => 3, 'required' => 1]),
            softvolt_field(['key' => 'field_sv_cmp_us', 'label' => 'Us', 'name' => 'us', 'type' => 'textarea', 'rows' => 3, 'required' => 1, 'instructions' => 'Every line in this column is a public commitment. Only write what we will honour.']),
        ]
    ));

    // ----------------------------------------------------------------- clocks
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_clock',
        'Clock',
        'clockFields',
        ['Clock'],
        $where('clock'),
        [
            softvolt_field(['key' => 'field_sv_clock_tz', 'label' => 'IANA time zone', 'name' => 'time_zone', 'type' => 'text', 'required' => 1, 'instructions' => 'e.g. Europe/London. The front end reads the live time from this.']),
            softvolt_field(['key' => 'field_sv_clock_short', 'label' => 'Short code', 'name' => 'short', 'type' => 'text', 'required' => 1, 'instructions' => 'Three letters, e.g. LON. The city name is the post title.']),
        ]
    ));
});

/* ==========================================================================
   Settings
   ========================================================================== */

/**
 * The site-wide settings the header, the footer and the schema are built from,
 * on a screen registered with the core Settings API.
 *
 * Deliberately not an ACF options page: options pages are an ACF Pro feature,
 * and the Settings API is what WordPress already ships. One option row holds
 * the lot, which keeps the GraphQL side to a single read.
 */

add_action('admin_menu', static function (): void {
    add_menu_page(
        'Headless settings',
        'Headless',
        'manage_options',
        'softvolt-headless',
        'softvolt_render_settings_page',
        'dashicons-rest-api',
        58
    );
});

/** The media library picker, for the two logo fields on this screen. */
add_action('admin_enqueue_scripts', static function (string $hook): void {
    if ($hook !== 'toplevel_page_softvolt-headless') {
        return;
    }
    wp_enqueue_media();
    wp_add_inline_script(
        'jquery-core',
        <<<'JS'
jQuery(function ($) {
    $('.softvolt-media').each(function () {
        var box = $(this);
        var input = box.find('input[type=hidden]');
        var preview = box.find('.softvolt-media-preview');
        var clear = box.find('.softvolt-media-clear');
        var frame;
        box.on('click', '.softvolt-media-pick', function (e) {
            e.preventDefault();
            frame = frame || wp.media({ title: 'Choose image', button: { text: 'Use this image' }, multiple: false });
            frame.off('select').on('select', function () {
                var item = frame.state().get('selection').first().toJSON();
                var url = (item.sizes && item.sizes.medium ? item.sizes.medium.url : item.url);
                input.val(item.id);
                preview.html('<img src="' + url + '" alt="" style="max-width:220px;height:auto;background:#1b211d;padding:8px;border-radius:6px" />');
                clear.prop('hidden', false);
            });
            frame.open();
        });
        box.on('click', '.softvolt-media-clear', function (e) {
            e.preventDefault();
            input.val('');
            preview.empty();
            clear.prop('hidden', true);
        });
    });
});
JS
    );
});

add_action('admin_init', static function (): void {
    register_setting('softvolt_headless_group', SOFTVOLT_SETTINGS_KEY, [
        'type'              => 'array',
        'sanitize_callback' => 'softvolt_sanitize_settings',
        'default'           => [],
        // the front end reads this through GraphQL, not through the REST options route
        'show_in_rest'      => false,
    ]);

    $sections = [
        'front_end' => ['Front end', 'Where the site actually lives, and the secret the two sides share.', ['site_url', 'revalidate_secret']],
        'identity'  => ['Brand identity', 'The name and the details the whole site is built from: the header, the footer, Google and the schema all read these.', ['brand_name', 'tagline', 'description', 'email', 'location', 'time_zone', 'utc_offset', 'markets']],
        'header'    => [
            'Header — the bar at the top of every page',
            'The menu itself (Services, Agency Solutions, Case Studies, About) is built at Appearance → Menus, in the "Header navigation" location. The logo, the button on the right and the two lines inside the Services menu are here.',
            ['logo', 'logo_dark', 'header_cta_label', 'header_cta_href', 'mega_resources_note', 'mega_footer_note'],
        ],
        'cta'       => ['Buttons that repeat across the site', 'The two buttons the banner, every closing band and the footer all use.', ['cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href', 'cal_url']],
        'footer'    => [
            'Footer — the dark band at the bottom of every page',
            'Its link columns are built at Appearance → Menus, in the "Footer navigation" location: a top-level item is a column and the items under it are its links. The small row beside the copyright is the "Legal links" menu. The logo is the one set under Header above.',
            ['footer_blurb', 'footer_note', 'social_links'],
        ],
        'forms'     => ['Forms', 'Contact Form 7 ids, so the front end can post to the right form.', ['cf7_brief_id', 'cf7_contact_id']],
        'comparison' => ['Comparison table', 'The one outside figure the home page quotes, and where a reader can check it.', ['comparison_source_label', 'comparison_source_url']],
    ];

    $schema = softvolt_settings_schema();
    foreach ($sections as $id => [$title, $blurb, $keys]) {
        add_settings_section(
            "softvolt_section_$id",
            $title,
            static fn () => printf('<p class="description">%s</p>', esc_html($blurb)),
            'softvolt-headless'
        );
        foreach ($keys as $key) {
            $field = $schema[$key] ?? null;
            if (!$field) {
                continue;
            }
            add_settings_field(
                "softvolt_field_$key",
                esc_html($field['label']),
                'softvolt_render_settings_field',
                'softvolt-headless',
                "softvolt_section_$id",
                ['key' => $key, 'field' => $field, 'label_for' => "softvolt_field_$key"]
            );
        }
    }
});

function softvolt_render_settings_field(array $args): void
{
    $key     = $args['key'];
    $field   = $args['field'];
    $value   = (string) softvolt_setting($key);
    $name    = SOFTVOLT_SETTINGS_KEY . "[$key]";
    $id      = "softvolt_field_$key";
    $locked  = ($key === 'site_url' && defined('SOFTVOLT_FRONTEND_URL')) || ($key === 'revalidate_secret' && defined('SOFTVOLT_REVALIDATE_SECRET'));

    switch ($field['type']) {
        case 'textarea':
        case 'lines':
            printf(
                '<textarea id="%s" name="%s" rows="%d" class="large-text code">%s</textarea>',
                esc_attr($id),
                esc_attr($name),
                $field['type'] === 'lines' ? 5 : 3,
                esc_textarea($value)
            );
            break;
        case 'password':
            printf('<input type="password" id="%s" name="%s" value="%s" class="regular-text" autocomplete="new-password" %s />', esc_attr($id), esc_attr($name), esc_attr($value), $locked ? 'disabled' : '');
            break;
        case 'media':
            $src = $value ? wp_get_attachment_image_url((int) $value, 'medium') : '';
            printf(
                '<div class="softvolt-media" data-field="%1$s">'
                    . '<input type="hidden" id="%1$s" name="%2$s" value="%3$s" />'
                    . '<p class="softvolt-media-preview">%4$s</p>'
                    . '<button type="button" class="button softvolt-media-pick">%5$s</button> '
                    . '<button type="button" class="button-link softvolt-media-clear"%6$s>%7$s</button>'
                . '</div>',
                esc_attr($id),
                esc_attr($name),
                esc_attr($value),
                $src ? sprintf('<img src="%s" alt="" style="max-width:220px;height:auto;background:#1b211d;padding:8px;border-radius:6px" />', esc_url($src)) : '',
                esc_html__('Choose image', 'softvolt-headless'),
                $value ? '' : ' hidden',
                esc_html__('Remove', 'softvolt-headless')
            );
            break;
        default:
            printf('<input type="text" id="%s" name="%s" value="%s" class="regular-text" %s />', esc_attr($id), esc_attr($name), esc_attr($value), $locked ? 'disabled' : '');
    }

    if ($locked) {
        printf('<p class="description">%s</p>', esc_html__('Set in wp-config.php, so this screen cannot change it.', 'softvolt-headless'));
    } elseif (!empty($field['help'])) {
        printf('<p class="description">%s</p>', esc_html($field['help']));
    }
}

function softvolt_sanitize_settings($input): array
{
    $schema = softvolt_settings_schema();
    $clean  = [];
    foreach ($schema as $key => $field) {
        $value = is_array($input) && isset($input[$key]) ? (string) $input[$key] : '';
        $clean[$key] = match ($field['type']) {
            'url'      => esc_url_raw(trim($value)),
            'media'    => $value === '' ? '' : (string) absint($value),
            'textarea',
            'lines'    => sanitize_textarea_field($value),
            default    => sanitize_text_field($value),
        };
    }
    return $clean;
}

function softvolt_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $front = softvolt_front_end_url();
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Headless settings', 'softvolt-headless'); ?></h1>
        <p class="description">
            <?php esc_html_e('This install has no front end of its own. Everything below is read by the Next.js site through GraphQL.', 'softvolt-headless'); ?>
            <?php if ($front) : ?>
                <br /><strong><?php esc_html_e('Front end:', 'softvolt-headless'); ?></strong>
                <a href="<?php echo esc_url($front); ?>" target="_blank" rel="noopener"><?php echo esc_html($front); ?></a>
                &nbsp;·&nbsp;
                <a href="<?php echo esc_url(home_url('/graphql')); ?>" target="_blank" rel="noopener"><?php esc_html_e('GraphQL endpoint', 'softvolt-headless'); ?></a>
            <?php endif; ?>
        </p>
        <div class="card" style="max-width:820px;padding:4px 20px 16px">
            <h2><?php esc_html_e('Where everything on the site is edited', 'softvolt-headless'); ?></h2>
            <table class="widefat striped" style="margin-bottom:8px">
                <tbody>
                <?php
                $map = [
                    ['The words on a page', 'Pages → open the page. Each band of the page is a tab down the left, in the order a visitor reads them.', admin_url('edit.php?post_type=page')],
                    ['The header menu', 'Appearance → Menus → the menu in the "Header navigation" location.', admin_url('nav-menus.php')],
                    ['The footer columns', 'Appearance → Menus → "Footer navigation". A top-level item is a column; the items under it are its links.', admin_url('nav-menus.php')],
                    ['The small legal row', 'Appearance → Menus → "Legal links".', admin_url('nav-menus.php')],
                    ['The logo, the header button, the footer blurb', 'This screen, under Header and Footer below.', ''],
                    ['Services, agency types, case studies, plans, FAQs, commitments, protection clauses, process steps, the stack, the comparison table, the clocks, the team, the clients', 'Each has its own menu on the left. A card on a page is one of those items.', ''],
                    ['Every picture', 'Whichever item owns it: the featured image on a case study, on a client or on a post, and the photo on a team member — all chosen from the Media library.', admin_url('upload.php')],
                    ['The blog', 'Posts, as usual.', admin_url('edit.php')],
                ];
                foreach ($map as [$what, $where, $link]) :
                    ?>
                    <tr>
                        <td style="width:26%"><strong><?php echo esc_html($what); ?></strong></td>
                        <td>
                            <?php echo esc_html($where); ?>
                            <?php if ($link) : ?>
                                <a href="<?php echo esc_url($link); ?>">&nbsp;<?php esc_html_e('Open', 'softvolt-headless'); ?> &rarr;</a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <p class="description">
                <?php esc_html_e('A change is live within about a minute of pressing Update — the front end is told which page to rebuild.', 'softvolt-headless'); ?>
            </p>
        </div>

        <form action="options.php" method="post">
            <?php
            settings_fields('softvolt_headless_group');
            do_settings_sections('softvolt-headless');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/* ==========================================================================
   Graphql
   ========================================================================== */

/**
 * The GraphQL surface the front end reads.
 *
 * WPGraphQL already exposes posts, pages, the content types in post-types.php,
 * their ACF fields and the nav menus. What it does not know about is the
 * settings screen — so `siteSettings` is registered here, shaped the way the
 * front end's own types are shaped rather than as a bag of strings.
 */

add_action('graphql_register_types', static function (): void {
    register_graphql_object_type('SoftVoltLink', [
        'description' => __('A label and where it points.', 'softvolt-headless'),
        'fields'      => [
            'label' => ['type' => 'String'],
            'href'  => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SoftVoltImage', [
        'description' => __('A picture chosen in the media library.', 'softvolt-headless'),
        'fields'      => [
            'src'    => ['type' => 'String'],
            'alt'    => ['type' => 'String'],
            'width'  => ['type' => 'Int'],
            'height' => ['type' => 'Int'],
        ],
    ]);

    register_graphql_object_type('SoftVoltSettings', [
        'description' => __('Site-wide settings from the Headless screen: the header, the footer and the identity.', 'softvolt-headless'),
        'fields'      => [
            'brandName'    => ['type' => 'String'],
            'tagline'      => ['type' => 'String'],
            'description'  => ['type' => 'String'],
            'email'        => ['type' => 'String'],
            'location'     => ['type' => 'String'],
            'timeZone'     => ['type' => 'String'],
            'utcOffset'    => ['type' => 'String'],
            'calUrl'       => ['type' => 'String'],
            'siteUrl'      => ['type' => 'String'],
            'markets'      => ['type' => ['list_of' => 'String']],
            'footerBlurb'  => ['type' => 'String'],
            'footerNote'   => ['type' => 'String'],
            'socialLinks'  => ['type' => ['list_of' => 'SoftVoltLink']],
            'ctaPrimary'   => ['type' => 'SoftVoltLink'],
            'ctaSecondary' => ['type' => 'SoftVoltLink'],
            'headerCta'    => ['type' => 'SoftVoltLink'],
            'logo'         => ['type' => 'SoftVoltImage'],
            'logoDark'     => ['type' => 'SoftVoltImage'],
            'megaResourcesNote' => ['type' => 'String'],
            'megaFooterNote'    => ['type' => 'String'],
            'cf7BriefId'   => ['type' => 'String'],
            'cf7ContactId' => ['type' => 'String'],
            'comparisonSource' => ['type' => 'SoftVoltLink'],
        ],
    ]);

    register_graphql_field('RootQuery', 'siteSettings', [
        'type'        => 'SoftVoltSettings',
        'description' => __('Everything on the Headless settings screen.', 'softvolt-headless'),
        'resolve'     => static function (): array {
            $social = [];
            foreach (softvolt_lines((string) softvolt_setting('social_links')) as $line) {
                $parts = array_map('trim', explode('|', $line, 2));
                if (count($parts) === 2 && $parts[0] !== '' && $parts[1] !== '') {
                    $social[] = ['label' => $parts[0], 'href' => $parts[1]];
                }
            }

            return [
                'brandName'    => (string) softvolt_setting('brand_name'),
                'tagline'      => (string) softvolt_setting('tagline'),
                'description'  => (string) softvolt_setting('description'),
                'email'        => (string) softvolt_setting('email'),
                'location'     => (string) softvolt_setting('location'),
                'timeZone'     => (string) softvolt_setting('time_zone'),
                'utcOffset'    => (string) softvolt_setting('utc_offset'),
                'calUrl'       => (string) softvolt_setting('cal_url'),
                'siteUrl'      => softvolt_front_end_url(),
                'markets'      => softvolt_lines((string) softvolt_setting('markets')),
                'footerBlurb'  => (string) softvolt_setting('footer_blurb'),
                'footerNote'   => (string) softvolt_setting('footer_note'),
                'socialLinks'  => $social,
                'ctaPrimary'   => ['label' => (string) softvolt_setting('cta_primary_label'), 'href' => (string) softvolt_setting('cta_primary_href')],
                'ctaSecondary' => ['label' => (string) softvolt_setting('cta_secondary_label'), 'href' => (string) softvolt_setting('cta_secondary_href')],
                'headerCta'    => ['label' => (string) softvolt_setting('header_cta_label'), 'href' => (string) softvolt_setting('header_cta_href')],
                'logo'         => softvolt_setting_image('logo'),
                'logoDark'     => softvolt_setting_image('logo_dark'),
                'megaResourcesNote' => (string) softvolt_setting('mega_resources_note'),
                'megaFooterNote'    => (string) softvolt_setting('mega_footer_note'),
                'cf7BriefId'   => (string) softvolt_setting('cf7_brief_id'),
                'cf7ContactId' => (string) softvolt_setting('cf7_contact_id'),
                'comparisonSource' => ['label' => (string) softvolt_setting('comparison_source_label'), 'href' => (string) softvolt_setting('comparison_source_url')],
            ];
        },
    ]);

    /**
     * `menuOrder` is how an editor sequences these lists, and the front end
     * needs it to render them in that order. WPGraphQL exposes it on pages but
     * not on every content type, so it is added to each of ours.
     */
    foreach (softvolt_post_type_schema() as $type) {
        $graphql_type = ucfirst($type['gql'][0]);
        register_graphql_field($graphql_type, 'orderIndex', [
            'type'        => 'Int',
            'description' => __('The editor-defined order (menu_order). Lower comes first.', 'softvolt-headless'),
            'resolve'     => static fn ($post) => (int) get_post_field('menu_order', $post->databaseId ?? $post->ID ?? 0),
        ]);
    }
});

/* ==========================================================================
   Preview
   ========================================================================== */

/**
 * Draft previews, without handing anyone a session.
 *
 * The obvious way to preview a draft in a headless setup is to let the front
 * end authenticate as an editor and query GraphQL. That means a shared secret
 * that can *write*, which is a poor trade for a preview button. This is a
 * read-only REST route instead: give it the secret and a post id, and it
 * returns that post — draft, pending or published — and nothing else.
 */

add_action('rest_api_init', static function (): void {
    register_rest_route('softvolt/v1', '/preview', [
        'methods'             => 'GET',
        'permission_callback' => static function (WP_REST_Request $request) {
            $secret = softvolt_revalidate_secret();
            if (!$secret) {
                return new WP_Error('softvolt_no_secret', 'Previews are not configured on this install.', ['status' => 503]);
            }
            $sent = (string) ($request->get_header('x-softvolt-secret') ?? '');
            return hash_equals($secret, $sent) ? true : new WP_Error('softvolt_forbidden', 'Bad secret.', ['status' => 403]);
        },
        'args' => [
            'id' => ['type' => 'integer', 'required' => true],
        ],
        'callback' => static function (WP_REST_Request $request) {
            $post = get_post((int) $request->get_param('id'));
            if (!$post) {
                return new WP_Error('softvolt_not_found', 'No such post.', ['status' => 404]);
            }

            // the newest autosave is what the editor is actually looking at
            $preview = wp_get_post_autosave($post->ID);
            $source  = $preview instanceof WP_Post ? $preview : $post;

            $fields = function_exists('get_fields') ? (get_fields($post->ID) ?: []) : [];
            // lists are stored a line at a time; hand the front end the array
            foreach ($fields as $key => $value) {
                if (is_string($value) && str_contains($value, "\n")) {
                    $fields[$key . 'Lines'] = softvolt_lines($value);
                }
            }

            return [
                'id'       => $post->ID,
                'type'     => $post->post_type,
                'status'   => $post->post_status,
                'slug'     => $post->post_name,
                'title'    => $source->post_title,
                'content'  => apply_filters('the_content', $source->post_content),
                'excerpt'  => $source->post_excerpt,
                'modified' => $source->post_modified_gmt,
                'featuredImage' => get_the_post_thumbnail_url($post->ID, 'full') ?: null,
                'fields'   => $fields,
                'terms'    => array_values(array_map(
                    static fn ($term) => ['taxonomy' => $term->taxonomy, 'slug' => $term->slug, 'name' => $term->name],
                    wp_get_post_terms($post->ID, get_object_taxonomies($post->post_type)) ?: []
                )),
            ];
        },
    ]);
});

/* ==========================================================================
   Media
   ========================================================================== */

/**
 * Pulling an image into the media library by URL.
 *
 * The migration has to move the screenshots and logos that were shipping with
 * the front end into WordPress. A browser cannot upload them — it would have
 * to fetch them cross-origin first — so WordPress fetches them itself, which
 * is one request instead of two and no CORS to arrange.
 *
 * Editors never see this: it is a one-off for the migration, and it only
 * answers to someone who can already upload files.
 */

add_action('rest_api_init', static function (): void {
    register_rest_route('softvolt/v1', '/sideload', [
        'methods'             => 'POST',
        'permission_callback' => static fn () => current_user_can('upload_files'),
        'args'                => [
            'url'   => ['type' => 'string', 'required' => true],
            'title' => ['type' => 'string', 'required' => false],
        ],
        'callback' => static function (WP_REST_Request $request) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $url = esc_url_raw((string) $request->get_param('url'));
            if (!$url || !wp_http_validate_url($url)) {
                return new WP_Error('softvolt_bad_url', 'That is not a URL this install will fetch.', ['status' => 400]);
            }

            // the same file twice is the same attachment: re-running the seed is safe
            $name     = sanitize_file_name(basename(wp_parse_url($url, PHP_URL_PATH) ?: 'image'));
            $existing = get_posts([
                'post_type'      => 'attachment',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'meta_query'     => [['key' => '_softvolt_source_url', 'value' => $url]],
            ]);
            if ($existing) {
                return ['id' => (int) $existing[0], 'reused' => true, 'url' => wp_get_attachment_url((int) $existing[0])];
            }

            $tmp = download_url($url, 30);
            if (is_wp_error($tmp)) {
                return new WP_Error('softvolt_download_failed', $tmp->get_error_message(), ['status' => 502]);
            }

            $id = media_handle_sideload(['name' => $name, 'tmp_name' => $tmp], 0, (string) ($request->get_param('title') ?: ''));
            if (is_wp_error($id)) {
                @unlink($tmp);
                return new WP_Error('softvolt_sideload_failed', $id->get_error_message(), ['status' => 500]);
            }

            update_post_meta((int) $id, '_softvolt_source_url', $url);
            return ['id' => (int) $id, 'reused' => false, 'url' => wp_get_attachment_url((int) $id)];
        },
    ]);
});

/* ==========================================================================
   Revalidate
   ========================================================================== */

/**
 * Publishing here has to change the site there.
 *
 * The front end serves static HTML from a CDN, so nothing it has already built
 * changes on its own. On every save, delete or menu change this posts the
 * affected paths to the front end's /api/revalidate, which rebuilds exactly
 * those pages — seconds, not a deploy.
 *
 * The request carries the shared secret; without it the front end ignores us.
 */

/** Which front-end paths one post affects. Listing them beats rebuilding the site. */
function softvolt_paths_for_post(int $post_id): array
{
    $post = get_post($post_id);
    if (!$post) {
        return [];
    }
    $slug  = $post->post_name;
    $paths = ['/'];

    switch ($post->post_type) {
        case 'page':
            $paths[] = $slug === 'home' ? '/' : "/$slug";
            break;
        case 'post':
            $paths[] = '/blog';
            $paths[] = "/blog/$slug";
            break;
        case 'service':
            $paths[] = '/services';
            $paths[] = "/services/$slug";
            break;
        case 'agency_type':
            $paths[] = '/for';
            $paths[] = "/for/$slug";
            break;
        case 'case_study':
            $paths[] = '/case-studies';
            $paths[] = "/case-studies/$slug";
            break;
        case 'plan':
            $paths[] = '/rates';
            break;
        case 'faq':
            $paths[] = '/rates';
            break;
        case 'clause':
            $paths[] = '/security';
            break;
        case 'team_member':
            $paths[] = '/about';
            break;
        case 'process_step':
        case 'promise':
            $paths[] = '/about';
            $paths[] = '/partner-programme';
            break;
        case 'client':
        case 'testimonial':
            $paths[] = '/case-studies';
            break;
        case 'stack_item':
        case 'comparison_row':
        case 'clock':
            break; // the home page only, which is already in the list
    }

    return array_values(array_unique($paths));
}

/** Tags let the front end drop a whole collection in one go. */
function softvolt_tags_for_post(int $post_id): array
{
    $post = get_post($post_id);
    if (!$post) {
        return ['wp:all'];
    }
    return ['wp:all', 'wp:' . $post->post_type, 'wp:' . $post->post_type . ':' . $post->post_name];
}

function softvolt_revalidate(array $paths, array $tags): void
{
    $front  = softvolt_front_end_url();
    $secret = softvolt_revalidate_secret();
    if (!$front || !$secret) {
        return; // not wired up yet: publishing still works, the front end just waits for its next build
    }

    $response = wp_remote_post($front . '/api/revalidate', [
        'timeout'  => 8,
        // the editor should not wait for the CDN; failures are logged, not shown
        'blocking' => false,
        'headers'  => [
            'Content-Type'      => 'application/json',
            'X-Softvolt-Secret' => $secret,
        ],
        'body'     => wp_json_encode(['paths' => array_values($paths), 'tags' => array_values($tags)]),
    ]);

    if (is_wp_error($response)) {
        error_log('[softvolt] revalidate failed: ' . $response->get_error_message());
    }
}

/** Saves, including the transition out of draft and back into it. */
add_action('transition_post_status', static function (string $new, string $old, WP_Post $post): void {
    if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
        return;
    }
    if ($new === 'auto-draft' || ($new === 'draft' && $old === 'auto-draft')) {
        return;
    }
    softvolt_revalidate(softvolt_paths_for_post($post->ID), softvolt_tags_for_post($post->ID));
}, 10, 3);

/** Deletions and trashing, where the page has to stop existing. */
add_action('before_delete_post', static function (int $post_id): void {
    softvolt_revalidate(softvolt_paths_for_post($post_id), softvolt_tags_for_post($post_id));
});

/** The settings screen feeds the header, the footer and every page's schema. */
add_action('update_option_' . SOFTVOLT_SETTINGS_KEY, static function (): void {
    softvolt_revalidate(['/'], ['wp:all', 'wp:settings']);
});

/** Menus are the header and the footer: a change touches every page. */
add_action('wp_update_nav_menu', static function (): void {
    softvolt_revalidate(['/'], ['wp:all', 'wp:menus']);
});

/**
 * A button for the times a page looks stale and nobody can say why — it asks
 * the front end to rebuild everything rather than one path.
 */
add_action('admin_bar_menu', static function (WP_Admin_Bar $bar): void {
    if (!current_user_can('edit_posts') || !softvolt_front_end_url()) {
        return;
    }
    $bar->add_node([
        'id'    => 'softvolt-revalidate',
        'title' => 'Rebuild front end',
        'href'  => wp_nonce_url(admin_url('admin-post.php?action=softvolt_revalidate_all'), 'softvolt_revalidate_all'),
        'meta'  => ['title' => 'Ask the Next.js site to rebuild every page from this content'],
    ]);
}, 90);

add_action('admin_post_softvolt_revalidate_all', static function (): void {
    if (!current_user_can('edit_posts') || !check_admin_referer('softvolt_revalidate_all')) {
        wp_die('Not allowed', 403);
    }
    softvolt_revalidate(['/'], ['wp:all']);
    wp_safe_redirect(wp_get_referer() ?: admin_url());
    exit;
});

/* ==========================================================================
   Comments
   ========================================================================== */

/**
 * Comments, written on the front end and moderated here.
 *
 * WordPress will not let a stranger post to its own /wp/v2/comments route, and
 * opening that route would hand every bot on the internet a clean API. So the
 * front end posts to one route of our own instead: it checks the obvious
 * things, then hands the comment to wp_handle_comment_submission(), which is
 * the same function the classic comment form uses — so the Discussion settings,
 * the moderation queue, the duplicate check and the flood check all still
 * apply, and a comment appears on the site only once it is approved.
 *
 * The front end reads approved comments through WPGraphQL, so a comment that
 * is approved (or deleted) has to tell the front end to rebuild that post.
 */

add_action('rest_api_init', static function (): void {
    register_rest_route('softvolt/v1', '/comment', [
        'methods'             => 'POST',
        // anyone reading the blog can write one; what it does with it is checked below
        'permission_callback' => '__return_true',
        'callback'            => 'softvolt_submit_comment',
        'args'                => [
            'post'    => ['type' => 'integer', 'required' => true],
            'name'    => ['type' => 'string', 'required' => true],
            'email'   => ['type' => 'string', 'required' => true],
            'content' => ['type' => 'string', 'required' => true],
            'parent'  => ['type' => 'integer', 'required' => false],
            'website' => ['type' => 'string', 'required' => false],
        ],
    ]);
});

/**
 * @return WP_REST_Response|WP_Error
 */
function softvolt_submit_comment(WP_REST_Request $request)
{
    // the honeypot: a field no person sees. Filled in means a bot, so the answer
    // is a polite yes and nothing is saved — it learns nothing either way.
    if (trim((string) $request->get_param('website')) !== '') {
        return rest_ensure_response(['ok' => true, 'approved' => false]);
    }

    $post_id = (int) $request->get_param('post');
    $post    = get_post($post_id);
    if (!$post || $post->post_type !== 'post' || $post->post_status !== 'publish') {
        return new WP_Error('softvolt_no_post', __('That post does not exist.', 'softvolt-headless'), ['status' => 404]);
    }
    if (!comments_open($post_id)) {
        return new WP_Error('softvolt_closed', __('Comments are closed on this post.', 'softvolt-headless'), ['status' => 403]);
    }

    $name    = sanitize_text_field((string) $request->get_param('name'));
    $email   = sanitize_email((string) $request->get_param('email'));
    $content = trim((string) $request->get_param('content'));

    if (mb_strlen($name) < 2 || mb_strlen($name) > 80) {
        return new WP_Error('softvolt_name', __('Please give a name we can put on the comment.', 'softvolt-headless'), ['status' => 422]);
    }
    if (!is_email($email)) {
        return new WP_Error('softvolt_email', __('Please give an email address that works.', 'softvolt-headless'), ['status' => 422]);
    }
    if (mb_strlen($content) < 2 || mb_strlen($content) > 4000) {
        return new WP_Error('softvolt_content', __('A comment has to be between 2 and 4000 characters.', 'softvolt-headless'), ['status' => 422]);
    }

    $comment = wp_handle_comment_submission([
        'comment_post_ID' => $post_id,
        'author'          => $name,
        'email'           => $email,
        'comment'         => $content,
        'comment_parent'  => (int) $request->get_param('parent'),
    ]);

    if (is_wp_error($comment)) {
        $status = (int) ($comment->get_error_data() ?: 400);
        return new WP_Error('softvolt_rejected', $comment->get_error_message(), ['status' => $status >= 400 && $status < 600 ? $status : 400]);
    }

    return rest_ensure_response([
        'ok'       => true,
        'approved' => (string) $comment->comment_approved === '1',
    ]);
}

/** Which front-end paths one comment affects: the post it was written on. */
function softvolt_revalidate_comment(int $comment_id): void
{
    $comment = get_comment($comment_id);
    if (!$comment) {
        return;
    }
    $post = get_post((int) $comment->comment_post_ID);
    if (!$post || $post->post_type !== 'post') {
        return;
    }
    softvolt_revalidate(["/blog/{$post->post_name}"], ['wp:post', "wp:post:{$post->post_name}"]);
}

/** A comment that arrives already approved shows straight away. */
add_action('comment_post', static function (int $comment_id, $approved): void {
    if ($approved === 1 || $approved === '1') {
        softvolt_revalidate_comment($comment_id);
    }
}, 10, 2);

/** Approving, unapproving, spamming or trashing one in the moderation queue. */
add_action('transition_comment_status', static function ($new, $old, $comment): void {
    if ($new !== $old) {
        softvolt_revalidate_comment((int) $comment->comment_ID);
    }
}, 10, 3);

add_action('deleted_comment', static function (int $comment_id, $comment): void {
    $post = $comment ? get_post((int) $comment->comment_post_ID) : null;
    if ($post && $post->post_type === 'post') {
        softvolt_revalidate(["/blog/{$post->post_name}"], ['wp:post', "wp:post:{$post->post_name}"]);
    }
}, 10, 2);

/* ==========================================================================
   Headless
   ========================================================================== */

/**
 * This install has no front end.
 *
 * Two things follow from that. A visitor who lands on the CMS domain should be
 * taken to the real site rather than shown a half-styled theme, and a crawler
 * should never index this domain at all — the same content on two hosts is the
 * duplicate-content problem headless setups walk into most often.
 *
 * Editing, the REST API, GraphQL, previews, cron and the admin all keep
 * working; only the public-facing theme is closed.
 */

/** Requests that must never be redirected, whatever the URL looks like. */
function softvolt_is_system_request(): bool
{
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return true;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return true;
    }
    if (defined('GRAPHQL_HTTP_REQUEST') && GRAPHQL_HTTP_REQUEST) {
        return true;
    }
    // Editors are sent on too: Preview already opens the front end's preview
    // route and every View link points at the real site, so all this domain
    // could show them is the bare parent theme. WordPress's own ?preview=true
    // and the Customizer still render here.
    if (is_user_logged_in() && (is_preview() || is_customize_preview())) {
        return true;
    }
    // WordPress checks a theme or plugin edit by loading the site with these two
    // keys and reading what comes back. A redirect looks like a fatal error to
    // it, and the edit is thrown away — so the scrape request sees the theme.
    if (isset($_GET["wp_scrape_key"]) || isset($_GET["wp_scrape_nonce"])) {
        return true;
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
    foreach (['/wp-admin', '/wp-login.php', '/wp-json', '/graphql', '/wp-cron.php', '/wp-content/', '/wp-includes/', '/xmlrpc.php', '/robots.txt', '/favicon.ico', '/.well-known/'] as $path) {
        if (str_starts_with($uri, $path)) {
            return true;
        }
    }
    return false;
}

/** Anyone else goes to the site this content is actually published on. */
add_action('template_redirect', static function (): void {
    if (softvolt_is_system_request()) {
        return;
    }
    $front = softvolt_front_end_url();
    if (!$front) {
        return; // not configured yet — better a plain theme than a redirect to nowhere
    }

    $target = $front;
    if (is_singular()) {
        $post = get_queried_object();
        if ($post instanceof WP_Post) {
            $map = [
                'post'        => '/blog/',
                'page'        => '/',
                'service'     => '/services/',
                'agency_type' => '/for/',
                'case_study'  => '/case-studies/',
            ];
            if (isset($map[$post->post_type])) {
                $target = $front . $map[$post->post_type] . $post->post_name;
            }
        }
    }

    wp_redirect($target, 301);
    exit;
}, 1);

/** Belt as well as braces: the header a crawler reads before any HTML. */
add_action('send_headers', static function (): void {
    if (is_admin()) {
        return;
    }
    header('X-Robots-Tag: noindex, nofollow', true);
});

add_filter('robots_txt', static function (string $output): string {
    return "User-agent: *\nDisallow: /\n";
}, 99);

/** No feeds, no oEmbed, no emoji script: none of it has a reader here. */
add_action('init', static function (): void {
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
});

/** XML-RPC is a login surface with nothing behind it on a headless install. */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * The editor's "View"/"Preview" buttons should open the front end's preview
 * route, not this domain. The route swaps in draft mode and renders the draft
 * through GraphQL.
 */
function softvolt_preview_url(WP_Post $post): string
{
    $front = softvolt_front_end_url();
    if (!$front) {
        return get_permalink($post);
    }
    return add_query_arg(
        [
            'secret' => softvolt_revalidate_secret(),
            'type'   => $post->post_type,
            'id'     => $post->ID,
            'slug'   => $post->post_name,
        ],
        $front . '/api/preview'
    );
}

add_filter('preview_post_link', static function ($link, $post) {
    return $post instanceof WP_Post ? softvolt_preview_url($post) : $link;
}, 10, 2);

add_filter('post_link', 'softvolt_public_permalink', 10, 2);
add_filter('page_link', 'softvolt_public_permalink', 10, 2);
add_filter('post_type_link', 'softvolt_public_permalink', 10, 2);

/** Permalinks shown in the admin point at the real site, so a copied link works. */
function softvolt_public_permalink($link, $post)
{
    $front = softvolt_front_end_url();
    // page_link hands over an id where the other two hand over the post
    $post = is_numeric($post) ? get_post((int) $post) : $post;
    if (!$front || !($post instanceof WP_Post) || $post->post_status !== 'publish') {
        return $link;
    }
    $map = [
        'post'        => '/blog/',
        'page'        => '/',
        'service'     => '/services/',
        'agency_type' => '/for/',
        'case_study'  => '/case-studies/',
    ];
    if (!isset($map[$post->post_type])) {
        return $link;
    }
    return $front . $map[$post->post_type] . $post->post_name;
}

/** A reminder on every admin screen of what this install is and is not. */
add_action('admin_notices', static function (): void {
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'dashboard') {
        return;
    }
    $front = softvolt_front_end_url();
    printf(
        '<div class="notice notice-info"><p><strong>%s</strong> %s %s</p></div>',
        esc_html__('Headless install.', 'softvolt-headless'),
        esc_html__('This WordPress has no public pages of its own — it feeds the Next.js site. Search engines are blocked here on purpose; the Yoast warning about it can be ignored.', 'softvolt-headless'),
        $front
            ? sprintf('<a href="%s" target="_blank" rel="noopener">%s</a>', esc_url($front), esc_html__('Open the site', 'softvolt-headless'))
            : sprintf('<a href="%s">%s</a>', esc_url(admin_url('admin.php?page=softvolt-headless')), esc_html__('Set the front-end URL', 'softvolt-headless'))
    );
});
