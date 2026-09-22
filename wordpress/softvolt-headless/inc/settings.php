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

/** The media library picker, for the two logo fields on this screen. */
add_action('admin_enqueue_scripts', static function (string $hook): void {
    if ($hook !== 'toplevel_page_softvolt-headless') {
        return;
    }
    wp_enqueue_media();
    wp_add_inline_script(
        'jquery-core',
        <<<'JS'
jQuery(function ($) {
    $('.softvolt-media').each(function () {
        var box = $(this);
        var input = box.find('input[type=hidden]');
        var preview = box.find('.softvolt-media-preview');
        var clear = box.find('.softvolt-media-clear');
        var frame;
        box.on('click', '.softvolt-media-pick', function (e) {
            e.preventDefault();
            frame = frame || wp.media({ title: 'Choose image', button: { text: 'Use this image' }, multiple: false });
            frame.off('select').on('select', function () {
                var item = frame.state().get('selection').first().toJSON();
                var url = (item.sizes && item.sizes.medium ? item.sizes.medium.url : item.url);
                input.val(item.id);
                preview.html('<img src="' + url + '" alt="" style="max-width:220px;height:auto;background:#1b211d;padding:8px;border-radius:6px" />');
                clear.prop('hidden', false);
            });
            frame.open();
        });
        box.on('click', '.softvolt-media-clear', function (e) {
            e.preventDefault();
            input.val('');
            preview.empty();
            clear.prop('hidden', true);
        });
    });
});
JS
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
        'identity'  => ['Brand identity', 'The name and the details the whole site is built from: the header, the footer, Google and the schema all read these.', ['brand_name', 'tagline', 'description', 'email', 'location', 'time_zone', 'utc_offset', 'markets']],
        'header'    => [
            'Header — the bar at the top of every page',
            'The menu itself (Services, Agency Solutions, Case Studies, About) is built at Appearance → Menus, in the "Header navigation" location. The logo, the button on the right and the two lines inside the Services menu are here.',
            ['logo', 'logo_dark', 'header_cta_label', 'header_cta_href', 'mega_resources_note', 'mega_footer_note'],
        ],
        'cta'       => ['Buttons that repeat across the site', 'The two buttons the banner, every closing band and the footer all use.', ['cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href', 'cal_url']],
        'footer'    => [
            'Footer — the dark band at the bottom of every page',
            'Its link columns are built at Appearance → Menus, in the "Footer navigation" location: a top-level item is a column and the items under it are its links. The small row beside the copyright is the "Legal links" menu. The logo is the one set under Header above.',
            ['footer_blurb', 'footer_note', 'social_links'],
        ],
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
        case 'media':
            $src = $value ? wp_get_attachment_image_url((int) $value, 'medium') : '';
            printf(
                '<div class="softvolt-media" data-field="%1$s">'
                    . '<input type="hidden" id="%1$s" name="%2$s" value="%3$s" />'
                    . '<p class="softvolt-media-preview">%4$s</p>'
                    . '<button type="button" class="button softvolt-media-pick">%5$s</button> '
                    . '<button type="button" class="button-link softvolt-media-clear"%6$s>%7$s</button>'
                . '</div>',
                esc_attr($id),
                esc_attr($name),
                esc_attr($value),
                $src ? sprintf('<img src="%s" alt="" style="max-width:220px;height:auto;background:#1b211d;padding:8px;border-radius:6px" />', esc_url($src)) : '',
                esc_html__('Choose image', 'softvolt-headless'),
                $value ? '' : ' hidden',
                esc_html__('Remove', 'softvolt-headless')
            );
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
            'media'    => $value === '' ? '' : (string) absint($value),
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
        <div class="card" style="max-width:820px;padding:4px 20px 16px">
            <h2><?php esc_html_e('Where everything on the site is edited', 'softvolt-headless'); ?></h2>
            <table class="widefat striped" style="margin-bottom:8px">
                <tbody>
                <?php
                $map = [
                    ['The words on a page', 'Pages → open the page. Each band of the page is a tab down the left, in the order a visitor reads them.', admin_url('edit.php?post_type=page')],
                    ['The header menu', 'Appearance → Menus → the menu in the "Header navigation" location.', admin_url('nav-menus.php')],
                    ['The footer columns', 'Appearance → Menus → "Footer navigation". A top-level item is a column; the items under it are its links.', admin_url('nav-menus.php')],
                    ['The small legal row', 'Appearance → Menus → "Legal links".', admin_url('nav-menus.php')],
                    ['The logo, the header button, the footer blurb', 'This screen, under Header and Footer below.', ''],
                    ['Services, agency types, case studies, plans, FAQs, commitments, protection clauses, process steps, the stack, the comparison table, the clocks, the team, the clients', 'Each has its own menu on the left. A card on a page is one of those items.', ''],
                    ['Every picture', 'Whichever item owns it: the featured image on a case study, on a client or on a post, and the photo on a team member — all chosen from the Media library.', admin_url('upload.php')],
                    ['The blog', 'Posts, as usual.', admin_url('edit.php')],
                ];
                foreach ($map as [$what, $where, $link]) :
                    ?>
                    <tr>
                        <td style="width:26%"><strong><?php echo esc_html($what); ?></strong></td>
                        <td>
                            <?php echo esc_html($where); ?>
                            <?php if ($link) : ?>
                                <a href="<?php echo esc_url($link); ?>">&nbsp;<?php esc_html_e('Open', 'softvolt-headless'); ?> &rarr;</a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
            <p class="description">
                <?php esc_html_e('A change is live within about a minute of pressing Update — the front end is told which page to rebuild.', 'softvolt-headless'); ?>
            </p>
        </div>

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
