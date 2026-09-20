<?php
/**
 * The site-wide settings the header, the footer and the schema are built from,
 * on a screen registered with the core Settings API.
 *
 * Deliberately not an ACF options page: options pages are an ACF Pro feature,
 * and the Settings API is what WordPress already ships. One option row holds
 * the lot, which keeps the GraphQL side to a single read.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', static function (): void {
    add_menu_page(
        'Headless settings',
        'Headless',
        'manage_options',
        'softvolt-headless',
        'softvolt_render_settings_page',
        'dashicons-rest-api',
        58
    );
});

add_action('admin_init', static function (): void {
    register_setting('softvolt_headless_group', SOFTVOLT_SETTINGS_KEY, [
        'type'              => 'array',
        'sanitize_callback' => 'softvolt_sanitize_settings',
        'default'           => [],
        // the front end reads this through GraphQL, not through the REST options route
        'show_in_rest'      => false,
    ]);

    $sections = [
        'front_end' => ['Front end', 'Where the site actually lives, and the secret the two sides share.', ['site_url', 'revalidate_secret']],
        'identity'  => ['Identity', 'Used in the header, the footer, the meta description and the schema.', ['brand_name', 'tagline', 'description', 'email', 'location', 'time_zone', 'utc_offset', 'cal_url', 'markets']],
        'cta'       => ['Calls to action', 'The buttons that repeat across the site.', ['cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href', 'header_cta_label', 'header_cta_href']],
        'footer'    => ['Footer', 'The closing band above the legal line.', ['footer_blurb', 'footer_note', 'social_links']],
        'forms'     => ['Forms', 'Contact Form 7 ids, so the front end can post to the right form.', ['cf7_brief_id', 'cf7_contact_id']],
        'comparison' => ['Comparison table', 'The one outside figure the home page quotes, and where a reader can check it.', ['comparison_source_label', 'comparison_source_url']],
    ];

    $schema = softvolt_settings_schema();
    foreach ($sections as $id => [$title, $blurb, $keys]) {
        add_settings_section(
            "softvolt_section_$id",
            $title,
            static fn () => printf('<p class="description">%s</p>', esc_html($blurb)),
            'softvolt-headless'
        );
        foreach ($keys as $key) {
            $field = $schema[$key] ?? null;
            if (!$field) {
                continue;
            }
            add_settings_field(
                "softvolt_field_$key",
                esc_html($field['label']),
                'softvolt_render_settings_field',
                'softvolt-headless',
                "softvolt_section_$id",
                ['key' => $key, 'field' => $field, 'label_for' => "softvolt_field_$key"]
            );
        }
    }
});

function softvolt_render_settings_field(array $args): void
{
    $key     = $args['key'];
    $field   = $args['field'];
    $value   = (string) softvolt_setting($key);
    $name    = SOFTVOLT_SETTINGS_KEY . "[$key]";
    $id      = "softvolt_field_$key";
    $locked  = ($key === 'site_url' && defined('SOFTVOLT_FRONTEND_URL')) || ($key === 'revalidate_secret' && defined('SOFTVOLT_REVALIDATE_SECRET'));

    switch ($field['type']) {
        case 'textarea':
        case 'lines':
            printf(
                '<textarea id="%s" name="%s" rows="%d" class="large-text code">%s</textarea>',
                esc_attr($id),
                esc_attr($name),
                $field['type'] === 'lines' ? 5 : 3,
                esc_textarea($value)
            );
            break;
        case 'password':
            printf('<input type="password" id="%s" name="%s" value="%s" class="regular-text" autocomplete="new-password" %s />', esc_attr($id), esc_attr($name), esc_attr($value), $locked ? 'disabled' : '');
            break;
        default:
            printf('<input type="text" id="%s" name="%s" value="%s" class="regular-text" %s />', esc_attr($id), esc_attr($name), esc_attr($value), $locked ? 'disabled' : '');
    }

    if ($locked) {
        printf('<p class="description">%s</p>', esc_html__('Set in wp-config.php, so this screen cannot change it.', 'softvolt-headless'));
    } elseif (!empty($field['help'])) {
        printf('<p class="description">%s</p>', esc_html($field['help']));
    }
}

function softvolt_sanitize_settings($input): array
{
    $schema = softvolt_settings_schema();
    $clean  = [];
    foreach ($schema as $key => $field) {
        $value = is_array($input) && isset($input[$key]) ? (string) $input[$key] : '';
        $clean[$key] = match ($field['type']) {
            'url'      => esc_url_raw(trim($value)),
            'textarea',
            'lines'    => sanitize_textarea_field($value),
            default    => sanitize_text_field($value),
        };
    }
    return $clean;
}

function softvolt_render_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $front = softvolt_front_end_url();
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Headless settings', 'softvolt-headless'); ?></h1>
        <p class="description">
            <?php esc_html_e('This install has no front end of its own. Everything below is read by the Next.js site through GraphQL.', 'softvolt-headless'); ?>
            <?php if ($front) : ?>
                <br /><strong><?php esc_html_e('Front end:', 'softvolt-headless'); ?></strong>
                <a href="<?php echo esc_url($front); ?>" target="_blank" rel="noopener"><?php echo esc_html($front); ?></a>
                &nbsp;·&nbsp;
                <a href="<?php echo esc_url(home_url('/graphql')); ?>" target="_blank" rel="noopener"><?php esc_html_e('GraphQL endpoint', 'softvolt-headless'); ?></a>
            <?php endif; ?>
        </p>
        <form action="options.php" method="post">
            <?php
            settings_fields('softvolt_headless_group');
            do_settings_sections('softvolt-headless');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
