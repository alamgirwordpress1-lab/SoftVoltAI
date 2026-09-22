<?php
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

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

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
