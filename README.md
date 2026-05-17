# synz-docs

A Bun-native Hono middleware that generates a full docs site from a folder of markdown files. No build step, no config files — just point it at a directory and go.

Live Showcase Available at [labs.synz.xyz/showcase/docs](https://labs.synz.xyz/showcase/docs)

```typescript
import { docs } from 'synz-docs'

app.route('/docs', docs({
    dir: './docs',
    title: 'My Project'
}))
```

---

## features

- Markdown rendered with syntax highlighting via [Shiki](https://shiki.style)
- Sidebar navigation auto-generated from your folder structure
- Frontmatter support for titles, ordering, and visibility
- Prev/next page navigation with section labels
- Anchor links on headings
- Built-in theme presets (`default`, `catppuccin`, `nord`, `rose-pine`, `synz`)
- Fully customisable theme via CSS variables
- Configurable header subtitle or version badge
- Zero build step — reads files at startup

---

## install

```bash
bun add synz-docs
```

---

## usage

```typescript
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

## folder structure

Your `dir` folder maps directly to routes and sidebar sections:

```
docs/
├── index.md              → /docs
├── getting-started.md    → /docs/getting-started
└── api/
    ├── overview.md       → /docs/api/overview
    └── endpoints.md      → /docs/api/endpoints
```

Folders become sidebar section headers. Files become pages.

---

## frontmatter

Each markdown file can include a frontmatter block at the top:

```markdown
---
title: Getting Started
order: 1
description: How to get up and running
hidden: false
---

# Getting Started
...
```

| Field | Type | Description |
|-------|------|-------------|
| title | string | Page title shown in sidebar and browser tab. Falls back to filename. |
| order | number | Sort order within the section. Lower numbers appear first. |
| description | string | Short description for meta tags. |
| hidden | boolean | Hide this page from the sidebar. Still accessible via direct URL. |

---

## themes

Pick a built-in preset or build your own.

```typescript
docs({
    dir: './docs',
    title: 'My Project',
    theme: {
        preset: 'catppuccin'  // 'default' | 'catppuccin' | 'nord' | 'rose-pine' | 'synz'
    }
})
```

Override just the accent on top of a preset:

```typescript
theme: {
    preset: 'nord',
    accentColor: '#a3be8c'
}
```

---

## configuration

```typescript
docs({
    dir: './docs',           // required — path to markdown files
    title: 'My Project',     // required — shown in header and page titles
    basePath: '/docs',       // optional — base route (default: '/docs')
    subtitle: 'API Docs',    // optional — text shown next to logo (default: 'docs')
    version: 'v1.0.0',       // optional — version badge shown instead of subtitle
    theme: {
        preset: 'default',        // optional — built-in theme preset
        accentColor: '#58a6ff',   // optional — overrides preset accent color
        logo: 'MY DOCS',          // optional — header logo text (default: title)
        vars: {                    // optional — CSS variable overrides
            '--bg': '#0f0f0f',
            '--font': '"IBM Plex Mono", monospace'
        },
        customCss: `               // optional — injected after base styles
            .header-logo { font-size: 1.25rem; }
        `
    }
})
```

---

## callouts

Blockquotes are rendered as styled callout blocks:

```markdown
> This is a callout. Use it for tips, warnings, or notes.
```

---

## changelog

### 0.3.0
- Added `synz` theme preset — matches the synz.xyz terminal aesthetic
- Added `subtitle` config option — custom text next to the logo
- Added `version` config option — shows a version badge instead of subtitle

### 0.2.0
- Added built-in theme presets: `default`, `catppuccin`, `nord`, `rose-pine`
- Prev/next navigation now shows section name when crossing into a new section
- `accentColor` now overrides preset accent rather than replacing all theme vars

### 0.1.0
- Initial release

---

## license

MIT