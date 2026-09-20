<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
