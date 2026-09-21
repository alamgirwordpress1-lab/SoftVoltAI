<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
