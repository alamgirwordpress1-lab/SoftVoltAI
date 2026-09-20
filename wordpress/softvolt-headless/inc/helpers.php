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
        'revalidate_secret' => ['label' => 'Revalidate secret', 'type' => 'password', 'default' => '', 'help' => 'Must match REVALIDATE_SECRET in the Next.js environment. Publishing sends this so the front end knows the request is ours.'],

        // identity, shown in the header, the footer and the schema
        'brand_name'        => ['label' => 'Brand name', 'type' => 'text', 'default' => 'SoftVolt AI'],
        'tagline'           => ['label' => 'Tagline', 'type' => 'text', 'default' => 'The white-label production and growth team behind agencies.'],
        'description'       => ['label' => 'Meta description', 'type' => 'textarea', 'default' => '', 'help' => 'Under 160 characters. Used as the site-wide fallback description.'],
        'email'             => ['label' => 'Contact email', 'type' => 'text', 'default' => ''],
        'location'          => ['label' => 'Location', 'type' => 'text', 'default' => 'Dhaka, Bangladesh'],
        'time_zone'         => ['label' => 'IANA time zone', 'type' => 'text', 'default' => 'Asia/Dhaka'],
        'utc_offset'        => ['label' => 'UTC offset label', 'type' => 'text', 'default' => 'UTC+6'],
        'cal_url'           => ['label' => 'Booking link', 'type' => 'url', 'default' => '', 'help' => 'Cal.com or similar. Left empty, the front end asks for a slot in the brief instead.'],

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

        // the forms
        'cf7_brief_id'      => ['label' => 'Contact Form 7 — brief form ID', 'type' => 'text', 'default' => ''],
        'cf7_contact_id'    => ['label' => 'Contact Form 7 — message form ID', 'type' => 'text', 'default' => ''],
    ];
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
