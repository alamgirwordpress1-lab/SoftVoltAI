<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
