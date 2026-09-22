<?php
/**
 * Small shared pieces. Kept in one file so the content-type and field
 * definitions below read as data rather than as boilerplate.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** Every setting on the settings screen, with its default. */
function softvolt_settings_schema(): array
{
    return [
        // the front end
        'site_url'          => ['label' => 'Front-end URL', 'type' => 'url', 'default' => '', 'help' => 'Where visitors actually go, e.g. https://softvoltai.com. Used for the front-end redirect, previews and revalidation.'],
        'revalidate_secret' => ['label' => 'Revalidate secret', 'type' => 'password', 'default' => '', 'help' => 'Must match WP_PREVIEW_SECRET in the Next.js environment (Vercel → Settings → Environment Variables). Publishing and previews send it so the front end knows the request is ours.'],

        // identity, shown in the header, the footer and the schema
        'brand_name'        => ['label' => 'Brand name', 'type' => 'text', 'default' => 'SoftVolt AI'],
        'tagline'           => ['label' => 'Tagline', 'type' => 'text', 'default' => 'The white-label production and growth team behind agencies.'],
        'description'       => ['label' => 'Meta description', 'type' => 'textarea', 'default' => '', 'help' => 'Under 160 characters. Used as the site-wide fallback description.'],
        'email'             => ['label' => 'Contact email', 'type' => 'text', 'default' => ''],
        'location'          => ['label' => 'Location', 'type' => 'text', 'default' => 'Dhaka, Bangladesh'],
        'time_zone'         => ['label' => 'IANA time zone', 'type' => 'text', 'default' => 'Asia/Dhaka'],
        'utc_offset'        => ['label' => 'UTC offset label', 'type' => 'text', 'default' => 'UTC+6'],
        'cal_url'           => ['label' => 'Booking link', 'type' => 'url', 'default' => '', 'help' => 'Cal.com or similar. Left empty, the front end asks for a slot in the brief instead.'],

        // the header: the logo, the button on the right, and the two lines inside the Services menu
        'logo'              => ['label' => 'Logo', 'type' => 'media', 'default' => '', 'help' => 'Optional. A PNG or SVG used in the header and the footer instead of the built-in mark. Leave it empty to keep the built-in one.'],
        'logo_dark'         => ['label' => 'Logo for dark backgrounds', 'type' => 'media', 'default' => '', 'help' => 'Optional. Used in the footer and in dark mode, where the logo above would be hard to read. Falls back to the logo above.'],
        'mega_resources_note' => ['label' => 'Services menu — line under "Resources"', 'type' => 'text', 'default' => 'Proof, pricing and where to start.'],
        'mega_footer_note'  => ['label' => 'Services menu — line in the dark bar', 'type' => 'text', 'default' => 'Not sure which service fits? Send the brief — the scope tells you.'],

        // the two calls to action, used in the header, the hero and every band
        'cta_primary_label' => ['label' => 'Primary CTA label', 'type' => 'text', 'default' => 'Send us a brief'],
        'cta_primary_href'  => ['label' => 'Primary CTA link', 'type' => 'text', 'default' => '/contact'],
        'cta_secondary_label' => ['label' => 'Secondary CTA label', 'type' => 'text', 'default' => 'Book a 20-min scoping call'],
        'cta_secondary_href'  => ['label' => 'Secondary CTA link', 'type' => 'text', 'default' => '/contact#call'],
        'header_cta_label'  => ['label' => 'Header button label', 'type' => 'text', 'default' => 'Book a call'],
        'header_cta_href'   => ['label' => 'Header button link', 'type' => 'text', 'default' => '/contact#call'],

        // the footer
        'footer_blurb'      => ['label' => 'Footer blurb', 'type' => 'textarea', 'default' => ''],
        'footer_note'       => ['label' => 'Footer legal note', 'type' => 'textarea', 'default' => ''],
        'markets'           => ['label' => 'Markets served', 'type' => 'lines', 'default' => "United Kingdom\nUnited States\nCanada\nAustralia\nEuropean Union", 'help' => 'One per line. Drives the globe arcs and the schema areaServed.'],
        'social_links'      => ['label' => 'Social links', 'type' => 'lines', 'default' => '', 'help' => 'One per line, as "Label | https://…".'],

        // the one figure quoted in the comparison table, and where it came from
        'comparison_source_label' => ['label' => 'Comparison source', 'type' => 'text', 'default' => '', 'help' => 'The publication the figure in the table is quoted from. It is printed under the table, so it has to be checkable.'],
        'comparison_source_url'   => ['label' => 'Comparison source link', 'type' => 'url', 'default' => ''],

        // the cookie banner, which lives on the front end, not on this install
        'cookie_script'     => [
            'label' => 'Cookie banner script',
            'type'  => 'url',
            'default' => '',
            'help'  => 'The address of the consent banner script, e.g. https://cdn-cookieyes.com/client_data/<key>/script.js from a connected CookieYes account. The front end loads it on every page. Leave it empty for no banner. The CookieYes plugin on this install only shows its banner on WordPress pages, which visitors never see.',
        ],

        // the forms
        'cf7_brief_id'      => ['label' => 'Contact Form 7 — brief form ID', 'type' => 'text', 'default' => ''],
        'cf7_contact_id'    => ['label' => 'Contact Form 7 — message form ID', 'type' => 'text', 'default' => ''],
    ];
}

/**
 * A media setting as the front end wants it: the file, its alt text and its
 * size. Empty when nothing is chosen, so the built-in artwork stays.
 */
function softvolt_setting_image(string $key): ?array
{
    $id = (int) softvolt_setting($key);
    if (!$id) {
        return null;
    }
    $src = wp_get_attachment_image_url($id, 'full');
    if (!$src) {
        return null;
    }
    $meta = wp_get_attachment_metadata($id);
    return [
        'src'    => $src,
        'alt'    => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
        'width'  => (int) ($meta['width'] ?? 0),
        'height' => (int) ($meta['height'] ?? 0),
    ];
}

/**
 * Contact Form 7's reCAPTCHA site key, or an empty string when reCAPTCHA is not
 * set up. The secret stays here; the site key is meant to be public, and the
 * front end cannot ask Google for a token without it.
 */
function softvolt_recaptcha_site_key(): string
{
    if (!class_exists('WPCF7')) {
        return '';
    }
    $keys = WPCF7::get_option('recaptcha');
    if (!is_array($keys) || !$keys) {
        return '';
    }
    $sitekey = (string) array_key_first($keys);
    return $sitekey;
}

/** One setting, with the default when it has never been saved. */
function softvolt_setting(string $key, mixed $fallback = null): mixed
{
    $all    = get_option(SOFTVOLT_SETTINGS_KEY, []);
    $schema = softvolt_settings_schema();
    if (is_array($all) && array_key_exists($key, $all) && $all[$key] !== '') {
        return $all[$key];
    }
    if ($fallback !== null) {
        return $fallback;
    }
    return $schema[$key]['default'] ?? '';
}

/**
 * The front end's origin, without a trailing slash. A constant in wp-config
 * wins over the settings screen, so staging can point somewhere else without
 * an editor having to change anything.
 */
function softvolt_front_end_url(): string
{
    $url = defined('SOFTVOLT_FRONTEND_URL') ? (string) SOFTVOLT_FRONTEND_URL : (string) softvolt_setting('site_url');
    return untrailingslashit(trim($url));
}

function softvolt_revalidate_secret(): string
{
    return defined('SOFTVOLT_REVALIDATE_SECRET') ? (string) SOFTVOLT_REVALIDATE_SECRET : (string) softvolt_setting('revalidate_secret');
}

/**
 * A textarea holds a list: one item per line. Free ACF has no repeater, and a
 * line per item is what an editor would type anyway.
 */
function softvolt_lines(?string $value): array
{
    if (!$value) {
        return [];
    }
    $lines = preg_split('/\r\n|\r|\n/', $value) ?: [];
    return array_values(array_filter(array_map('trim', $lines), static fn ($line) => $line !== ''));
}

/** Field defaults, so each field definition only carries what makes it different. */
function softvolt_field(array $field): array
{
    return array_merge([
        'show_in_graphql' => true,
        'required'        => 0,
        'wrapper'         => ['width' => '', 'class' => '', 'id' => ''],
    ], $field);
}

/** A field group that WPGraphQL for ACF will expose on the given types. */
function softvolt_field_group(string $key, string $title, string $graphql_name, array $graphql_types, array $location, array $fields): array
{
    return [
        'key'                   => $key,
        'title'                 => $title,
        'fields'                => $fields,
        'location'              => $location,
        'menu_order'            => 0,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'active'                => true,
        'show_in_rest'          => 1,
        'show_in_graphql'       => 1,
        'graphql_field_name'    => $graphql_name,
        'map_graphql_types_from_location_rules' => 0,
        'graphql_types'         => $graphql_types,
    ];
}
