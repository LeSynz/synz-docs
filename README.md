# synz-docs

A Bun-native Hono middleware that generates a full docs site from a folder of markdown files. No build step, no config files — just point it at a directory and go.

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
- Prev/next page navigation
- Anchor links on headings
- Fully customisable theme via CSS variables
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

## configuration

```typescript
docs({
    dir: './docs',           // required — path to markdown files
    title: 'My Project',     // required — shown in header and page titles
    basePath: '/docs',       // optional — base route (default: '/docs')
    theme: {
        accentColor: '#58a6ff',   // optional — primary accent color
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

## license

MIT