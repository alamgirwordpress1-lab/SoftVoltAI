<?php
/**
 * The content the front end reads. Pages and posts stay as WordPress ships
 * them; everything else on the site is one of these.
 *
 * Every type is registered with `show_in_graphql` (WPGraphQL) and
 * `show_in_rest` (the block editor, previews and the seeding script).
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
