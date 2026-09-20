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
 */

if (!defined('SOFTVOLT_HEADLESS_VERSION')) {
    define('SOFTVOLT_HEADLESS_VERSION', '1.0.0');
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
        'revalidate_secret' => ['label' => 'Revalidate secret', 'type' => 'password', 'default' => '', 'help' => 'Must match REVALIDATE_SECRET in the Next.js environment. Publishing sends this so the front end knows the request is ours.'],

        // identity, shown in the header, the footer and the schema
        'brand_name'        => ['label' => 'Brand name', 'type' => 'text', 'default' => 'SoftVolt AI'],
        'tagline'           => ['label' => 'Tagline', 'type' => 'text', 'default' => 'The white-label production and growth team behind agencies.'],
        'description'       => ['label' => 'Meta description', 'type' => 'textarea', 'default' => '', 'help' => 'Under 160 characters. Used as the site-wide fallback description.'],
        'email'             => ['label' => 'Contact email', 'type' => 'text', 'default' => ''],
        'location'          => ['label' => 'Location', 'type' => 'text', 'default' => 'Dhaka, Bangladesh'],
        'time_zone'         => ['label' => 'IANA time zone', 'type' => 'text', 'default' => 'Asia/Dhaka'],
        'utc_offset'        => ['label' => 'UTC offset label', 'type' => 'text', 'default' => 'UTC+6'],
        'cal_url'           => ['label' => 'Booking link', 'type' => 'url', 'default' => '', 'help' => 'Cal.com or similar. Left empty, the front end asks for a slot in the brief instead.'],

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

        // the forms
        'cf7_brief_id'      => ['label' => 'Contact Form 7 — brief form ID', 'type' => 'text', 'default' => ''],
        'cf7_contact_id'    => ['label' => 'Contact Form 7 — message form ID', 'type' => 'text', 'default' => ''],
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

    // ------------------------------------------------- pages: the SEO opener
    acf_add_local_field_group(softvolt_field_group(
        'group_softvolt_page',
        'Page opener',
        'pageFields',
        ['Page'],
        [[['param' => 'post_type', 'operator' => '==', 'value' => 'page']]],
        [
            softvolt_field(['key' => 'field_sv_page_eyebrow', 'label' => 'Eyebrow', 'name' => 'eyebrow', 'type' => 'text', 'instructions' => 'The small line above the H1.']),
            softvolt_field(['key' => 'field_sv_page_lede', 'label' => 'Lede', 'name' => 'lede', 'type' => 'textarea', 'rows' => 3, 'instructions' => 'The paragraph under the H1.']),
            softvolt_field(['key' => 'field_sv_page_intro_title', 'label' => 'Intro heading', 'name' => 'intro_title', 'type' => 'text', 'instructions' => 'The band under the banner — leave empty and the band is skipped.']),
            softvolt_field(['key' => 'field_sv_page_intro_sub', 'label' => 'Intro sub-heading', 'name' => 'intro_subtitle', 'type' => 'textarea', 'rows' => 2]),
            softvolt_field(['key' => 'field_sv_page_intro_body', 'label' => 'Intro body', 'name' => 'intro_body', 'type' => 'textarea', 'rows' => 8, 'instructions' => 'One paragraph per line.']),
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
        'identity'  => ['Identity', 'Used in the header, the footer, the meta description and the schema.', ['brand_name', 'tagline', 'description', 'email', 'location', 'time_zone', 'utc_offset', 'cal_url', 'markets']],
        'cta'       => ['Calls to action', 'The buttons that repeat across the site.', ['cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href', 'header_cta_label', 'header_cta_href']],
        'footer'    => ['Footer', 'The closing band above the legal line.', ['footer_blurb', 'footer_note', 'social_links']],
        'forms'     => ['Forms', 'Contact Form 7 ids, so the front end can post to the right form.', ['cf7_brief_id', 'cf7_contact_id']],
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
            'cf7BriefId'   => ['type' => 'String'],
            'cf7ContactId' => ['type' => 'String'],
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
                'cf7BriefId'   => (string) softvolt_setting('cf7_brief_id'),
                'cf7ContactId' => (string) softvolt_setting('cf7_contact_id'),
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
    if (is_user_logged_in()) {
        return true; // an editor clicking "view" gets the preview flow, not a redirect
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
