# synz-docs

A Bun-native [Hono](https://hono.dev?utm_source=chatgpt.com) middleware that generates a full documentation site from a folder of markdown files. No build step, no config files - just point it at a directory and go.

Live showcase available at [labs.synz.xyz/showcase/docs](https://labs.synz.xyz/showcase/docs?utm_source=chatgpt.com)

```typescript id="k3m8pv"
import { docs } from 'synz-docs'

app.route('/docs', docs({
    dir: './docs',
    title: 'My Project'
}))
```

---

# features

* Markdown rendered with syntax highlighting via [Shiki](https://shiki.style?utm_source=chatgpt.com)
* Sidebar navigation auto-generated from your folder structure
* Frontmatter support for titles, ordering, descriptions, and visibility
* Prev/next page navigation with section labels
* Anchor links on headings
* Built-in theme presets:

  * `default`
  * `catppuccin`
  * `nord`
  * `rose-pine`
  * `synz`
* Fully customisable theme system via CSS variables
* Configurable header subtitle or version badge
* Built-in favicon support
* Zero build step — reads files at startup

---

# install

```bash id="b7v2qn"
bun add synz-docs
```

---

# usage

```typescript id="u5n8rx"
import { Hono } from 'hono'
import { docs } from 'synz-docs'

const app = new Hono()

app.route('/docs', docs({
    dir: './docs',
    title: 'My Project',
    basePath: '/docs'
}))

export default app
```

---

# folder structure

Your `dir` folder maps directly to routes and sidebar sections:

```txt id="n4q1lk"
docs/
├── index.md              → /docs
├── getting-started.md    → /docs/getting-started
└── api/
    ├── overview.md       → /docs/api/overview
    └── endpoints.md      → /docs/api/endpoints
```

Folders become sidebar section headers. Files become pages.

---

# frontmatter

Each markdown file can include a frontmatter block at the top:

```markdown id="d9r5mw"
---
title: Getting Started
order: 1
description: How to get up and running
hidden: false
---

# Getting Started
...
```

| Field       | Type    | Description                                                                 |
| ----------- | ------- | --------------------------------------------------------------------------- |
| title       | string  | Page title shown in the sidebar and browser tab. Falls back to filename.    |
| order       | number  | Sort order within the section. Lower numbers appear first.                  |
| description | string  | Short description used for meta tags.                                       |
| hidden      | boolean | Hide this page from the sidebar while keeping it accessible via direct URL. |

---

# themes

Pick a built-in preset or build your own.

```typescript id="x2m7ke"
docs({
    dir: './docs',
    title: 'My Project',
    theme: {
        preset: 'catppuccin'
    }
})
```

Available presets:

```txt id="p8v4ru"
default
catppuccin
nord
rose-pine
synz
```

Override just the accent color:

```typescript id="z6w1ty"
theme: {
    preset: 'nord',
    accentColor: '#a3be8c'
}
```

Override CSS variables directly:

```typescript id="m3n9qx"
theme: {
    vars: {
        '--bg': '#0f0f0f',
        '--text': '#ffffff',
        '--font': '"IBM Plex Mono", monospace'
    }
}
```

Inject custom CSS:

```typescript id="f7q2ds"
theme: {
    customCss: `
        .header-logo {
            font-size: 1.25rem;
        }
    `
}
```

---

# favicon support

synz-docs can automatically serve and inject a favicon.

```typescript id="r4m8cz"
docs({
    dir: './docs',
    title: 'My Project',
    favicon: './docs/favicon.png'
})
```

Supported formats include:

```txt id="h5v9ke"
.png
.ico
.svg
.webp
```

The favicon is automatically exposed through the mounted docs route.

Example:

```txt id="w8n3pl"
/docs/favicon.png
```

---

# configuration

```typescript id="t6q4nv"
docs({
    dir: './docs',           // required — path to markdown files

    title: 'My Project',     // required — shown in header and page titles

    basePath: '/docs',       // optional — mounted route (default: '/docs')

    subtitle: 'API Docs',    // optional — text shown next to logo

    version: 'v1.0.0',       // optional — version badge shown instead of subtitle

    favicon: './docs/favicon.png', // optional — favicon asset path

    theme: {
        preset: 'default',        // optional — built-in theme preset

        accentColor: '#58a6ff',   // optional — overrides preset accent color

        logo: 'MY DOCS',          // optional — header logo text (default: title)

        vars: {                   // optional — CSS variable overrides
            '--bg': '#0f0f0f',
            '--font': '"IBM Plex Mono", monospace'
        },

        customCss: `              // optional — injected after base styles
            .header-logo {
                font-size: 1.25rem;
            }
        `
    }
})
```

---

# callouts

Blockquotes are rendered as styled callout blocks:

```markdown id="u8p1re"
> This is a callout. Use it for tips, warnings, or notes.
```

---

# changelog

## 0.4.0

* Added built-in favicon support
* Added automatic favicon asset serving
* Added support for `.png`, `.ico`, `.svg`, and `.webp` favicons

## 0.3.0

* Added `synz` theme preset matching the synz.xyz terminal aesthetic
* Added `subtitle` config option
* Added `version` config option

## 0.2.0

* Added built-in theme presets:

  * `default`
  * `catppuccin`
  * `nord`
  * `rose-pine`
* Prev/next navigation now shows section labels
* `accentColor` now overrides preset accent instead of replacing all theme vars

## 0.1.0

* Initial release

---

# license

MIT
