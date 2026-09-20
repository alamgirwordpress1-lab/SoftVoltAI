<?php
/**
 * The GraphQL surface the front end reads.
 *
 * WPGraphQL already exposes posts, pages, the content types in post-types.php,
 * their ACF fields and the nav menus. What it does not know about is the
 * settings screen — so `siteSettings` is registered here, shaped the way the
 * front end's own types are shaped rather than as a bag of strings.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('graphql_register_types', static function (): void {
    register_graphql_object_type('SoftVoltLink', [
        'description' => __('A label and where it points.', 'softvolt-headless'),
        'fields'      => [
            'label' => ['type' => 'String'],
            'href'  => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('SoftVoltSettings', [
        'description' => __('Site-wide settings from the Headless screen: the header, the footer and the identity.', 'softvolt-headless'),
        'fields'      => [
            'brandName'    => ['type' => 'String'],
            'tagline'      => ['type' => 'String'],
            'description'  => ['type' => 'String'],
            'email'        => ['type' => 'String'],
            'location'     => ['type' => 'String'],
            'timeZone'     => ['type' => 'String'],
            'utcOffset'    => ['type' => 'String'],
            'calUrl'       => ['type' => 'String'],
            'siteUrl'      => ['type' => 'String'],
            'markets'      => ['type' => ['list_of' => 'String']],
            'footerBlurb'  => ['type' => 'String'],
            'footerNote'   => ['type' => 'String'],
            'socialLinks'  => ['type' => ['list_of' => 'SoftVoltLink']],
            'ctaPrimary'   => ['type' => 'SoftVoltLink'],
            'ctaSecondary' => ['type' => 'SoftVoltLink'],
            'headerCta'    => ['type' => 'SoftVoltLink'],
            'cf7BriefId'   => ['type' => 'String'],
            'cf7ContactId' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'siteSettings', [
        'type'        => 'SoftVoltSettings',
        'description' => __('Everything on the Headless settings screen.', 'softvolt-headless'),
        'resolve'     => static function (): array {
            $social = [];
            foreach (softvolt_lines((string) softvolt_setting('social_links')) as $line) {
                $parts = array_map('trim', explode('|', $line, 2));
                if (count($parts) === 2 && $parts[0] !== '' && $parts[1] !== '') {
                    $social[] = ['label' => $parts[0], 'href' => $parts[1]];
                }
            }

            return [
                'brandName'    => (string) softvolt_setting('brand_name'),
                'tagline'      => (string) softvolt_setting('tagline'),
                'description'  => (string) softvolt_setting('description'),
                'email'        => (string) softvolt_setting('email'),
                'location'     => (string) softvolt_setting('location'),
                'timeZone'     => (string) softvolt_setting('time_zone'),
                'utcOffset'    => (string) softvolt_setting('utc_offset'),
                'calUrl'       => (string) softvolt_setting('cal_url'),
                'siteUrl'      => softvolt_front_end_url(),
                'markets'      => softvolt_lines((string) softvolt_setting('markets')),
                'footerBlurb'  => (string) softvolt_setting('footer_blurb'),
                'footerNote'   => (string) softvolt_setting('footer_note'),
                'socialLinks'  => $social,
                'ctaPrimary'   => ['label' => (string) softvolt_setting('cta_primary_label'), 'href' => (string) softvolt_setting('cta_primary_href')],
                'ctaSecondary' => ['label' => (string) softvolt_setting('cta_secondary_label'), 'href' => (string) softvolt_setting('cta_secondary_href')],
                'headerCta'    => ['label' => (string) softvolt_setting('header_cta_label'), 'href' => (string) softvolt_setting('header_cta_href')],
                'cf7BriefId'   => (string) softvolt_setting('cf7_brief_id'),
                'cf7ContactId' => (string) softvolt_setting('cf7_contact_id'),
            ];
        },
    ]);

    /**
     * `menuOrder` is how an editor sequences these lists, and the front end
     * needs it to render them in that order. WPGraphQL exposes it on pages but
     * not on every content type, so it is added to each of ours.
     */
    foreach (softvolt_post_type_schema() as $type) {
        $graphql_type = ucfirst($type['gql'][0]);
        register_graphql_field($graphql_type, 'orderIndex', [
            'type'        => 'Int',
            'description' => __('The editor-defined order (menu_order). Lower comes first.', 'softvolt-headless'),
            'resolve'     => static fn ($post) => (int) get_post_field('menu_order', $post->databaseId ?? $post->ID ?? 0),
        ]);
    }
});
