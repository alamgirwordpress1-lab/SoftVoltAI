<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
            softvolt_field(['key' => 'field_sv_page_heading', 'label' => 'Heading (H1)', 'name' => 'heading', 'type' => 'textarea', 'rows' => 3, 'instructions' => 'The headline on the banner. Leave it empty and the page title is used. On the home page each line is set on its own line of the headline.']),
            softvolt_field(['key' => 'field_sv_page_lede', 'label' => 'Lede', 'name' => 'lede', 'type' => 'textarea', 'rows' => 3, 'instructions' => 'The paragraph under the H1.']),
            softvolt_field(['key' => 'field_sv_page_intro_eyebrow', 'label' => 'Intro eyebrow', 'name' => 'intro_eyebrow', 'type' => 'text', 'instructions' => 'The small line above the intro heading, e.g. "What we cover".']),
            softvolt_field(['key' => 'field_sv_page_intro_title', 'label' => 'Intro heading', 'name' => 'intro_title', 'type' => 'text', 'instructions' => 'The band under the banner — leave empty and the band is skipped.']),
            softvolt_field(['key' => 'field_sv_page_intro_sub', 'label' => 'Intro sub-heading', 'name' => 'intro_subtitle', 'type' => 'textarea', 'rows' => 2]),
            softvolt_field(['key' => 'field_sv_page_intro_body', 'label' => 'Intro body', 'name' => 'intro_body', 'type' => 'textarea', 'rows' => 8, 'instructions' => 'One paragraph per line.']),
            softvolt_field(['key' => 'field_sv_page_highlights', 'label' => 'Banner facts', 'name' => 'highlights', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'Up to three, one per line, as "Label | Value". These are the cards on the banner, so each one has to be true. Left empty, the page counts them from its own content.']),
            softvolt_field(['key' => 'field_sv_page_points', 'label' => 'Intro points', 'name' => 'intro_points', 'type' => 'textarea', 'rows' => 5, 'instructions' => 'Up to four, one per line, as "Heading | Text". They sit under the intro copy.']),
            softvolt_field(['key' => 'field_sv_page_jump', 'label' => 'On this page', 'name' => 'jump_links', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'One per line, as "Label | #anchor". These are the links that jump into the sections below.']),
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

    /*
     * The lists that belong to one page and to no other.
     *
     * ACF without the repeater add-on has no repeating rows, so each list is a
     * textarea written as "Heading | Body", one item per line — the same shape
     * the rest of this install uses for lists. The location rule is resolved
     * from the page's slug at registration, so nothing here holds a post ID.
     */
    $page_rule = static function (string $slug): array {
        $page = get_page_by_path($slug);
        return $page ? [[['param' => 'page', 'operator' => '==', 'value' => (string) $page->ID]]] : [];
    };

    $page_list = static function (string $slug, string $group_key, string $title, string $graphql_name, string $field_key, string $name, string $label, string $help) use ($page_rule): void {
        $location = $page_rule($slug);
        if (!$location) {
            return; // the page has not been created yet: nothing to attach to
        }
        acf_add_local_field_group(softvolt_field_group(
            $group_key,
            $title,
            $graphql_name,
            ['Page'],
            $location,
            [
                softvolt_field(['key' => $field_key, 'label' => $label, 'name' => $name, 'type' => 'textarea', 'rows' => 12, 'instructions' => $help]),
            ]
        ));
    };

    $lines_help = 'One per line, written as "Heading | Body".';
    $page_list('security', 'group_softvolt_page_security', 'Security practices', 'securityFields', 'field_sv_page_practices', 'practices', 'Practices', $lines_help . ' Each one is a public commitment about client data.');
    $page_list('partner-programme', 'group_softvolt_page_partner', 'Partner steps', 'partnerFields', 'field_sv_page_steps', 'steps', 'How it works', $lines_help);
    $page_list('about', 'group_softvolt_page_about', 'About values', 'aboutFields', 'field_sv_page_values', 'values', 'What we hold to', $lines_help);
});
