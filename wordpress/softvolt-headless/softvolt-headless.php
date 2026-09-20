<?php
/**
 * Plugin Name:       SoftVolt Headless
 * Plugin URI:        https://github.com/alamgirwordpress1-lab/SoftVoltAI
 * Description:       Everything this WordPress install needs to be a headless back end for the SoftVolt AI Next.js front end: content types, ACF field groups, a settings screen for the header and footer, the GraphQL surface for all of it, on-publish revalidation, and a front end that points visitors at the real site.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            SoftVolt AI
 * License:           GPL-2.0-or-later
 * Text Domain:       softvolt-headless
 *
 * The front end lives at NEXT_PUBLIC_SITE_URL and reads this install through
 * WPGraphQL. Nothing here renders HTML for visitors — see inc/headless.php.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('SOFTVOLT_HEADLESS_VERSION', '1.0.0');
define('SOFTVOLT_HEADLESS_FILE', __FILE__);
define('SOFTVOLT_HEADLESS_DIR', plugin_dir_path(__FILE__));

/** One option row holds every setting; the settings screen writes it, GraphQL reads it. */
define('SOFTVOLT_SETTINGS_KEY', 'softvolt_headless');

require_once SOFTVOLT_HEADLESS_DIR . 'inc/helpers.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/post-types.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/fields.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/settings.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/graphql.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/preview.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/revalidate.php';
require_once SOFTVOLT_HEADLESS_DIR . 'inc/headless.php';

/**
 * Permalinks are rewritten when the content types appear or disappear — without
 * this a freshly activated install 404s its own REST and preview URLs.
 */
register_activation_hook(__FILE__, static function (): void {
    softvolt_register_post_types();
    softvolt_register_taxonomies();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, static function (): void {
    flush_rewrite_rules();
});

/** The admin notice that says what is missing, rather than failing quietly. */
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
        '<div class="notice notice-error"><p><strong>SoftVolt Headless:</strong> %s</p></div>',
        esc_html(sprintf(
            /* translators: %s: comma separated plugin names */
            __('these plugins have to be active for the front end to have anything to read: %s.', 'softvolt-headless'),
            implode(', ', $missing)
        ))
    );
});
