<?php
/**
 * Draft previews, without handing anyone a session.
 *
 * The obvious way to preview a draft in a headless setup is to let the front
 * end authenticate as an editor and query GraphQL. That means a shared secret
 * that can *write*, which is a poor trade for a preview button. This is a
 * read-only REST route instead: give it the secret and a post id, and it
 * returns that post — draft, pending or published — and nothing else.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
