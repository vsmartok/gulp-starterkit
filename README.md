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
