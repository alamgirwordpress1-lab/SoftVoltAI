<?php
/**
 * Our Products: the plugins and themes in the site's "Our Products" menu, on
 * /products and on each product's own page.
 *
 * A product is its title (the name), its Featured image (the icon), a Product
 * group (WordPress plugins, WordPress themes…) and one field group laid out
 * the way its page reads — a tab per section, generated like the page copy
 * from the front-end repo (content/copy/product.ts → product-copy-data.php),
 * so the fields here and the fields the site reads can never drift.
 *
 * The first time an editor opens wp-admin after this ships, the Voice Agent
 * is added as the first product, with every field filled in, together with
 * the two product groups and the page that holds the /products words.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** The product fields, decoded once per request. */
function softvolt_product_copy(): array
{
    static $template = null;
    if ($template === null) {
        $decoded  = defined('SOFTVOLT_PRODUCT_COPY') ? json_decode((string) SOFTVOLT_PRODUCT_COPY, true) : null;
        $template = is_array($decoded) ? $decoded : [];
    }
    return $template;
}

add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }
    $template = softvolt_product_copy();
    if (!$template) {
        return;
    }

    $fields = [];
    $number = 0;
    foreach ($template['sections'] as $section) {
        $number++;
        $prefix = 'field_svp_' . $section['key'];

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
            'key'          => $prefix,
            'label'        => (string) $section['title'],
            // prefixed like the page groups: ACF finds a top-level field by name alone in some lookups
            'name'         => 'svp_' . $section['key'],
            'type'         => 'group',
            'instructions' => (string) ($section['help'] ?? ''),
            'layout'       => 'block',
            'sub_fields'   => $sub,
        ];
    }

    acf_add_local_field_group([
        'key'                   => 'group_svp_product',
        'title'                 => 'Product — everything on its page',
        'fields'                => $fields,
        'location'              => [[['param' => 'post_type', 'operator' => '==', 'value' => 'sv_product']]],
        'menu_order'            => 0,
        'position'              => 'acf_after_title',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen'        => ['the_content', 'excerpt', 'discussion', 'comments', 'format', 'categories', 'tags', 'send-trackbacks'],
        'active'                => true,
        // read all at once through productCopy below, like the page groups
        'show_in_rest'          => 0,
        'show_in_graphql'       => 0,
    ]);
});

/** Everything written on one product, as JSON: section => field => value, list rows as "list_1"… */
function softvolt_product_copy_values(int $post_id): array
{
    $out = [];
    if (!function_exists('get_field')) {
        return $out;
    }
    foreach (softvolt_product_copy()['sections'] ?? [] as $section) {
        $value                         = get_field('svp_' . $section['key'], $post_id);
        $out[(string) $section['key']] = is_array($value) ? $value : new stdClass();
    }
    return $out;
}

add_action('graphql_register_types', static function (): void {
    register_graphql_field('SvProduct', 'productCopy', [
        'type'        => 'String',
        'description' => __('Everything on a product\'s page, as JSON: section => field => value.', 'softvolt-headless'),
        'resolve'     => static fn ($post): string => (string) wp_json_encode(softvolt_product_copy_values((int) $post->databaseId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);
});

/** A note at the top of the edit screen, so nobody goes looking for a content editor. */
add_action('edit_form_after_title', static function (WP_Post $post): void {
    if ($post->post_type !== 'sv_product') {
        return;
    }
    echo '<div class="notice notice-info inline" style="margin:12px 0 0"><p>'
        . esc_html__('The title is the product\'s name. Its icon is the Icon box (a square picture, 256 px or larger), and Product groups puts it under WordPress plugins or WordPress themes. Everything on its page is in the tabs below, in the order the page reads; an empty field hides that part of the page. Publish, and the product appears in the Our Products menu, on /products and at /products/its-slug. The order in the menu is the Order box (lowest first).', 'softvolt-headless')
        . '</p></div>';
});

/** Renaming or adding a group changes the menu on every page. */
foreach (['created_product_group', 'edited_product_group', 'delete_product_group'] as $softvolt_product_group_hook) {
    add_action($softvolt_product_group_hook, static function (): void {
        softvolt_revalidate(['/', '/products'], ['wp:all', 'wp:sv_product']);
    });
}

/**
 * Seeds the Voice Agent, the two groups and the /products page, once. The
 * option is set even when products already exist, so a product deleted on
 * purpose never comes back.
 */
add_action('admin_init', static function (): void {
    if (get_option('softvolt_products_seeded') || !current_user_can('edit_others_posts') || !function_exists('update_field') || !defined('SOFTVOLT_PRODUCT_SEED')) {
        return;
    }
    update_option('softvolt_products_seeded', SOFTVOLT_HEADLESS_VERSION, false);

    $seed = json_decode((string) SOFTVOLT_PRODUCT_SEED, true);
    if (!is_array($seed)) {
        return;
    }

    $term_ids = [];
    foreach ((array) ($seed['groups'] ?? []) as $group) {
        $found = term_exists((string) $group['slug'], 'product_group');
        if (!$found) {
            $found = wp_insert_term((string) $group['name'], 'product_group', ['slug' => (string) $group['slug'], 'description' => (string) $group['description']]);
        }
        if (!is_wp_error($found)) {
            $term_ids[(string) $group['slug']] = (int) (is_array($found) ? $found['term_id'] : $found);
        }
    }

    // the page that holds the /products words (its field group attaches by slug)
    if (!get_page_by_path('products')) {
        wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Our Products', 'post_name' => 'products']);
    }

    $existing = get_posts(['post_type' => 'sv_product', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids']);
    if ($existing) {
        return;
    }
    foreach ((array) ($seed['products'] ?? []) as $product) {
        $post_id = wp_insert_post([
            'post_type'   => 'sv_product',
            'post_status' => 'publish',
            'post_title'  => (string) $product['title'],
            'post_name'   => (string) $product['slug'],
            'menu_order'  => (int) ($product['order'] ?? 0),
        ]);
        if (!$post_id || is_wp_error($post_id)) {
            continue;
        }
        $group = (string) ($product['group'] ?? '');
        if (isset($term_ids[$group])) {
            wp_set_object_terms((int) $post_id, [$term_ids[$group]], 'product_group');
        }
        foreach ((array) $product['values'] as $section => $values) {
            if ($section === 'guide') {
                continue; // its screenshots are copied in by the guide seeder below
            }
            update_field('field_svp_' . $section, $values, (int) $post_id);
        }
    }
});

/** A picture copied in from an address earlier, found by that address — so a retry never duplicates it. */
function softvolt_sideloaded_image(string $url, int $post_id, string $title): int
{
    $existing = get_posts([
        'post_type'   => 'attachment',
        'post_status' => 'inherit',
        'meta_key'    => '_source_url', // phpcs:ignore WordPress.DB.SlowDBQuery -- once, on seeding
        'meta_value'  => $url,          // phpcs:ignore WordPress.DB.SlowDBQuery
        'fields'      => 'ids',
        'numberposts' => 1,
    ]);
    if ($existing) {
        return (int) $existing[0];
    }
    $id = media_sideload_image($url, $post_id, $title, 'id');
    return is_wp_error($id) ? 0 : (int) $id;
}

/**
 * Fills a seeded product's empty setup guide once its screenshots are on the
 * live site: each picture is copied into the media library, then the rows are
 * saved. Until every picture has arrived it tries again on a later admin
 * visit, at most every ten minutes; after that, never again. A guide an
 * editor has already written is left alone.
 */
add_action('admin_init', static function (): void {
    if (get_option('softvolt_products_guides_seeded') || get_transient('softvolt_products_guides_wait') || !current_user_can('upload_files') || !function_exists('update_field') || !defined('SOFTVOLT_PRODUCT_SEED')) {
        return;
    }
    set_transient('softvolt_products_guides_wait', 1, 10 * MINUTE_IN_SECONDS);
    $seed = json_decode((string) SOFTVOLT_PRODUCT_SEED, true);
    if (!is_array($seed)) {
        return;
    }
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $done = true;
    foreach ((array) ($seed['products'] ?? []) as $product) {
        $guide = $product['values']['guide'] ?? null;
        $post  = get_page_by_path((string) $product['slug'], OBJECT, 'sv_product');
        if (!is_array($guide) || !$post) {
            continue;
        }
        $current = get_field('svp_guide', $post->ID);
        if (is_array($current) && !empty($current['steps_1']['title'])) {
            continue;
        }
        foreach ($guide as $key => $row) {
            if (!is_array($row) || empty($row['image'])) {
                continue;
            }
            $id = softvolt_sideloaded_image((string) $row['image'], (int) $post->ID, (string) ($row['title'] ?? ''));
            if (!$id) {
                $done = false;
                continue 2; // this product waits for the next try
            }
            $guide[$key]['image'] = $id;
        }
        update_field('field_svp_guide', $guide, (int) $post->ID);
        softvolt_revalidate(softvolt_paths_for_post((int) $post->ID), softvolt_tags_for_post((int) $post->ID));
    }
    if ($done) {
        update_option('softvolt_products_guides_seeded', SOFTVOLT_HEADLESS_VERSION, false);
    }
});
