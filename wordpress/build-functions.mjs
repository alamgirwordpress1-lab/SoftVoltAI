import fs from "node:fs";
import path from "node:path";

/**
 * The child theme's functions.php cannot `require` files that are not in the
 * theme, and the theme editor can only edit files that already exist — so the
 * headless back end ships as one appendable file built from the same sources.
 */
const root = path.join(import.meta.dirname, "softvolt-headless");
const order = ["inc/helpers.php", "inc/post-types.php", "inc/fields.php", "inc/settings.php", "inc/graphql.php", "inc/preview.php", "inc/revalidate.php", "inc/headless.php"];

const strip = (src) =>
  src
    .replace(/^<\?php\s*/, "")
    .replace(/^declare\(strict_types=1\);\s*/m, "")
    .replace(/if \(!defined\('ABSPATH'\)\) \{\s*\n\s*exit;\s*\n\}\s*/m, "")
    .trim();

const banner = (title) => `\n/* ${"=".repeat(74)}\n   ${title}\n   ${"=".repeat(74)} */\n\n`;

const head = `<?php
/**
 * SoftVolt AI — headless back end.
 *
 * Everything below turns this install into the content source for the Next.js
 * front end: the content types, their ACF fields, the settings screen the
 * header and footer are built from, the GraphQL those are exposed through,
 * draft previews, on-publish revalidation, and a front end that sends visitors
 * to the real site.
 *
 * It lives in the child theme because that is where this install keeps its
 * code. Worth knowing: content types defined in a theme disappear if the theme
 * is ever switched — if that day comes, move this block into a plugin as-is,
 * it has no theme dependencies.
 *
 * Generated from wordpress/softvolt-headless/ in the front-end repo. Edit it
 * there, not here, or the next build will overwrite your change.
 */

if (!defined('SOFTVOLT_HEADLESS_VERSION')) {
    define('SOFTVOLT_HEADLESS_VERSION', '1.0.0');
}

if (!defined('SOFTVOLT_SETTINGS_KEY')) {
    /** One option row holds every setting; the settings screen writes it, GraphQL reads it. */
    define('SOFTVOLT_SETTINGS_KEY', 'softvolt_headless');
}

/** Permalinks have to be rewritten once, after the content types first appear. */
add_action('init', static function (): void {
    if (get_option('softvolt_rewrites_flushed') === SOFTVOLT_HEADLESS_VERSION) {
        return;
    }
    flush_rewrite_rules(false);
    update_option('softvolt_rewrites_flushed', SOFTVOLT_HEADLESS_VERSION, false);
}, 100);

/** Says what is missing rather than failing quietly. */
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
        '<div class="notice notice-error"><p><strong>SoftVolt headless:</strong> these plugins have to be active for the front end to have anything to read: %s.</p></div>',
        esc_html(implode(', ', $missing))
    );
});
`;

let out = head;
for (const file of order) {
  const title = path.basename(file, ".php").replace(/-/g, " ");
  out += banner(title.charAt(0).toUpperCase() + title.slice(1));
  out += strip(fs.readFileSync(path.join(root, file), "utf8")) + "\n";
}

const target = path.join(import.meta.dirname, "headless-astra-child", "functions-headless.php");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out);
console.log(`${target}\n${out.length} chars, ${out.split("\n").length} lines`);
