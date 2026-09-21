<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
