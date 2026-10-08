# Gulp Starterkit

A starterkit for building HTML, CSS, and JavaScript templates for landing pages, multi-page websites, and subsequent CMS or framework integration.

Uses Gulp, Nunjucks, Dart Sass, esbuild, Sharp, and SVGO.

## Getting started

Tested with Node.js 26 and npm 11. Run commands from the project root.

Install dependencies from the lockfile:

```bash
npm ci
```

Start development:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

The output directory is `build`. Each full build clears this directory before generating files.

## Commands

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Alias for `npm run dev`                           |
| `npm run dev`   | Development build, BrowserSync, and file watchers |
| `npm run build` | Optimized production build                        |

BrowserSync uses port `3000`. Stop the previous development process before starting another instance.

## Project structure

```text
gulp/
  tasks/              Build tasks
  paths.js            Source and output paths
  config.js           Development and production modes

src/
  html/               Nunjucks pages, layouts, components, and JSON data
  css/                SCSS, Sass, and CSS
  js/                 JavaScript entry points and imported modules
  img/                Template images
  video/              Template videos
  fonts/              Font sources
  icons/              Monochrome SVG icons for the sprite
  uploads/
    images/           Content images
    videos/           Content videos
  public/             Files copied directly to the output root

build/                Generated output
```

`.gitkeep` files preserve empty source directories in Git. They are excluded from the build output.

## HTML

Nunjucks pages are compiled to readable HTML in both modes. Their directory structure is preserved:

```text
src/html/index.njk      → build/index.html
src/html/blog/index.njk → build/blog/index.html
```

Directories beginning with `_` contain templates and data that are not compiled as standalone pages:

- `_layouts`: shared page layouts;
- `_parts`: reusable sections;
- `_macros`: reusable Nunjucks macros;
- `_data`: JSON data.

Each JSON filename becomes a template variable. For example, `_data/site.json` is available as `site`.

Use `build.isProd` to select production assets. Undefined template values cause an error, and HTML autoescaping is enabled.

## Styles

SCSS and Sass are compiled with Dart Sass. CSS is processed through PostCSS and Autoprefixer.

Files beginning with `_` and files inside `src/css/vendors` are excluded from standalone compilation. Import or load them from your stylesheet entry points.

Output goes to `build/assets/css`, preserving relative paths.

Browser targets are configured in `.browserslistrc`, currently using `defaults`.

## Base styles and themes

The starterkit includes a minimal reset, base typography, light and dark themes, a page layout, a container, and optional content styles.

### Configuration

Default values are defined in `src/css/abstracts/_variables.scss`. They use `!default` and can be configured at the beginning of `src/css/styles.scss`, before other module imports:

```scss
@use "abstracts/variables" with (
  $font-family-base: (
    Arial,
    sans-serif,
  ),
  $font-size-base: 1rem,
  $h1-font-size: 2.5rem,
  $container-max-width: 80rem,
  $container-padding-x: 1.5rem,
  $enable-dark-mode: false
);
```

The initial heading scale applies globally. Component classes can override heading sizes to match the design. Responsive adjustments are added per project.

### Themes

Theme colors are exposed as CSS custom properties by `src/css/base/_root.scss`.

| HTML setting              | Behavior                               |
| ------------------------- | -------------------------------------- |
| No `data-theme` attribute | Follow the operating system preference |
| `data-theme="light"`      | Use the light theme                    |
| `data-theme="dark"`       | Use the dark theme                     |

Set the attribute on `<html>`:

```html
<html lang="en" data-theme="light"></html>
```

With `$enable-dark-mode: false`, dark theme rules are excluded from the compiled CSS.

A JavaScript theme switcher and persistence of the user's choice are not included.

### Page layout and container

The shared layout uses `.page` on `<body>` and `.page__main` on `<main>`. The main area grows to keep the footer at the viewport bottom on short pages. On longer pages, the footer follows the content.

`.container` centers content and sets its maximum width and horizontal padding. The configured maximum width includes padding.

For full-width section backgrounds, place containers inside individual sections.

### Content styles

Add `.content` to a text block to enable spacing between direct children, additional spacing before headings, list indentation, blockquote borders, and full-width tables with horizontal separators.

These styles do not apply outside `.content`. Table overflow handling is left to the project.

To exclude the component styles, remove this import from `src/css/styles.scss`:

```scss
@use "components/content";
```

## Buttons

Import `components/buttons` in `src/css/styles.scss` to include the button component. Remove the import if the project does not use it.

Use `.button` on native buttons and navigation links:

```html
<button class="button" type="button">Save changes</button>
<a class="button" href="/blog/">Open blog</a>
```

Defaults are configured through `$button-*` Sass variables. The component exposes local `--button-*` CSS custom properties for project-specific variants.

Declare modifiers after the base component:

```scss
.button--secondary {
  --button-color: #222;
  --button-bg: #edf2f7;
  --button-hover-bg: #dce5ef;
  --button-active-bg: #cbd8e6;
  --button-border-color: #b8c5d3;
}
```

Optional `--button-hover-color`, `--button-active-color`, `--button-hover-border-color`, and `--button-active-border-color` override the corresponding state colors. Otherwise, those states use the base text and border colors.

The component includes hover, active, visible focus, and native disabled states. Hover styling applies to devices that support hovering.

Use the `disabled` attribute on `<button>`. Links do not support native disabled behavior; CSS alone cannot prevent navigation.

### Icons

Use `.button__icon` on an SVG inside the button. Text and icons are aligned with a configurable gap.

Add `.button--icon` for a square icon-only button and provide an accessible name:

```html
<button class="button button--icon" type="button" aria-label="Add item">
  <svg class="button__icon" aria-hidden="true">
    <use href="/assets/icons/sprite.svg#plus"></use>
  </svg>
</button>
```

The referenced icon must exist in the sprite. Decorative icons use `aria-hidden="true"` and should inherit the button color through `currentColor`.

Examples of buttons, states, and inline icons are available on `/playground.html`.

## Form fields

Import `components/form` in `src/css/styles.scss` to include the component. Remove the import if the project does not use it.

Use `.form-field` as a wrapper, `.form-field__label` for the label, `.form-field__control` for a text input, textarea, or native select, and `.form-field__hint` for supporting text.

```html
<div class="form-field">
  <label class="form-field__label" for="contact-email">Email</label>
  <input
    class="form-field__control"
    id="contact-email"
    name="email"
    type="email"
    autocomplete="email"
    aria-describedby="contact-email-hint"
  />
  <p class="form-field__hint" id="contact-email-hint">
    We will use this address to reply.
  </p>
</div>
```

Configure defaults through `$form-field-*` Sass variables. Local `--form-field-*` CSS custom properties on `.form-field` allow individual fields to override dimensions and spacing. Colors follow the light and dark theme settings.

The component includes visible focus, native disabled styling, and an error border when `aria-invalid="true"` is present. Read-only inputs retain their regular appearance and allow text selection and copying.

For errors, add `.form-field__hint--error` to the message and connect it to the control through `aria-describedby`. Set `aria-invalid="true"` on the control. Validation logic must manage these attributes; the component provides styles only.

Selects retain their native arrow and behavior. Textareas can be resized vertically. Spacing between fields belongs to the project’s form layout.

Examples are available on `/playground.html`.

## Checkboxes and radio buttons

Import `components/form-check` in `src/css/styles.scss` to include the component. Remove the import if the project does not use it.

Use a wrapping label with `.form-check`, a native checkbox or radio with `.form-check__control`, and an adjacent `.form-check__label` for the text:

```html
<label class="form-check">
  <input
    class="form-check__control"
    type="checkbox"
    name="newsletter"
    value="yes"
  />
  <span class="form-check__label">Subscribe to the newsletter</span>
</label>
```

The entire label is clickable. Long text wraps beside the control.

Configure size, gap, and disabled label opacity through `$form-check-*` Sass variables or local `--form-check-*` CSS custom properties. The accent color follows the light and dark theme settings. Focus uses the shared form field focus ring color.

Controls retain their native appearance and keyboard behavior. Use `checked` for an initially selected control and `disabled` to make it unavailable.

Radio buttons in the same group must share a `name`. Use `fieldset` and `legend` to give related controls a group label. Group layout and validation messages belong to the project.

Examples are available on `/playground.html`.

## Playground

Open `/playground.html` to inspect headings, text, lists, tables, forms, media, and native disclosure elements.

The page is intended for manual checks of styles, keyboard focus, themes, and responsive behavior. It can be removed when starting a project.

## JavaScript

Every `.js` file directly inside `src/js` is a separate entry point. There are no required entry filenames.

Place shared modules in subdirectories and import them from entry points:

```text
src/js/app.js
src/js/catalog.js
src/js/modules/menu.js
```

esbuild bundles each entry into a browser script in `build/assets/js`. Browser targets are derived from `.browserslistrc`; API polyfills are not added automatically.

## Development and production

| Output                  | Development                | Production                   |
| ----------------------- | -------------------------- | ---------------------------- |
| HTML                    | Readable                   | Readable                     |
| CSS                     | Readable, with source maps | Readable and `.min.css`      |
| JavaScript              | Readable, with source maps | Readable and `.min.js`       |
| JPEG and PNG            | Original plus WebP         | Optimized original plus WebP |
| SVG images              | Copied                     | Optimized                    |
| Fonts                   | WOFF2                      | WOFF2                        |
| SVG icons               | Symbol sprite              | Symbol sprite                |
| Videos and public files | Copied                     | Copied                       |

Production builds do not generate CSS or JavaScript source maps.

## Images and videos

| Source               | Output                 |
| -------------------- | ---------------------- |
| `src/img`            | `build/assets/img`     |
| `src/video`          | `build/assets/video`   |
| `src/uploads/images` | `build/uploads/images` |
| `src/uploads/videos` | `build/uploads/videos` |

Image dimensions are preserved.

JPEG and PNG receive additional WebP copies in both modes. PNG-to-WebP conversion uses lossless compression.

In production, JPEG, PNG, and SVG originals are optimized. A processed original replaces its source copy only when its file size is smaller. JPEG optimization uses lossy compression.

GIF, existing WebP, and AVIF files are copied unchanged. Videos are copied without conversion.

Conflicting WebP output names cause an error. For example, `photo.jpg` and `photo.png` both produce `photo.webp`.

## Fonts

Fonts are written to `build/assets/fonts`, preserving subdirectories.

TTF, OTF, and WOFF sources are converted to WOFF2. Existing WOFF2 files are copied unchanged and take precedence over other sources with the same output name.

If multiple sources produce the same output without a ready WOFF2 file, the task reports a conflict.

Define `@font-face` manually in SCSS. A reusable `font-face` mixin and commented examples are provided. For variable fonts, specify the supported weight range explicitly.

## SVG icons

Monochrome icons from `src/icons` are combined into:

```text
build/assets/icons/sprite.svg
```

Symbol IDs follow relative filenames:

```text
home.svg       → home
menu/arrow.svg → menu--arrow
```

Use the sprite in HTML:

```html
<svg width="24" height="24" aria-hidden="true" style="color: tomato">
  <use href="/assets/icons/sprite.svg#home"></use>
</svg>
```

Paint colors are prepared for `currentColor`; `viewBox` and `none` values are preserved. Multi-color SVG images belong in `src/img`.

No new sprite is generated when there are no source icons.

## Public files and favicons

Files in `src/public` are copied unchanged to the root of `build`, preserving subdirectories:

```text
src/public/favicon.ico      → build/favicon.ico
src/public/docs/sample.pdf  → build/docs/sample.pdf
```

Provide ready-made favicon files and enable the corresponding examples in the base HTML layout. Favicon generation is not included.

Keep public output paths distinct from generated pages and assets.

## Watchers and errors

Source changes trigger the corresponding task. CSS changes refresh styles; other tasks reload the page after successful processing.

Development errors are printed in the terminal, and watchers continue running. Production errors fail the build.

Deleted or renamed source files may leave old output files during development. Restart development or run a production build to clear them.

Preserve the source directory structure when starting development. If a watched directory is created after startup, restart the development process.

The sample templates use URLs relative to the website root. Adjust them when deploying under a subdirectory.
