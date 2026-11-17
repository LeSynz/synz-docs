# synz-docs

Hono middleware for Bun that serves a documentation site from a folder of
markdown files. There's no build step and no config file: point it at a
directory and mount it.

There's a live demo at [labs.synz.xyz/showcase/docs](https://labs.synz.xyz/showcase/docs).

```typescript
import { Hono } from 'hono';
import { docs } from 'synz-docs';

const app = new Hono();

app.route('/docs', docs({
	dir: './docs',
	title: 'My Project',
}));

export default app;
```

## What you get

- Syntax highlighting with [Shiki](https://shiki.style)
- A sidebar built from your folder structure
- Frontmatter for titles, ordering and hiding pages
- Previous and next links at the bottom of each page
- Anchor links on headings
- Five themes, plus CSS variables and custom CSS for your own
- A header subtitle or version badge, and a favicon

Files are read once, when `docs()` is called, so restart the server after adding
or renaming a page.

## Install

```bash
bun add hono synz-docs
```

It needs Bun, since it serves the favicon with `hono/bun` and the package
ships TypeScript source.

## Folder structure

Your docs folder decides the routes and the sidebar:

```
docs/
  index.md              /docs
  getting-started.md    /docs/getting-started
  api/
    overview.md         /docs/api/overview
    endpoints.md        /docs/api/endpoints
```

Folders turn into sidebar sections and files into pages.

## Frontmatter

```markdown
---
title: Getting started
order: 1
hidden: false
---
```

| Field | Type | |
| --- | --- | --- |
| `title` | string | Page title, in the sidebar and the browser tab. Defaults to the file name. |
| `order` | number | Position within its section, lowest first. Pages without one go last. |
| `description` | string | A short summary, used for the page's meta description tag. |
| `hidden` | boolean | Leave the page out of the sidebar. It's still reachable by URL. |

## Themes

```typescript
docs({
	dir: './docs',
	title: 'My Project',
	theme: { preset: 'catppuccin' },
});
```

The presets are `default`, `catppuccin`, `nord`, `rose-pine` and `synz`.

`accentColor` replaces just the accent color of the preset:

```typescript
theme: {
	preset: 'nord',
	accentColor: '#a3be8c',
}
```

`vars` overrides CSS variables, and `customCss` is added after the base styles:

```typescript
theme: {
	vars: {
		'--bg': '#0f0f0f',
		'--font': '"IBM Plex Mono", monospace',
	},
	customCss: `
		.header-logo { font-size: 1.25rem; }
	`,
}
```

## Options

```typescript
docs({
	dir: './docs', // required, folder of markdown files
	title: 'My Project', // required, header and page titles
	basePath: '/docs', // where it's mounted, default '/docs'
	subtitle: 'API Docs', // next to the logo, default 'docs'
	version: 'v1.0.0', // badge shown instead of the subtitle
	favicon: './docs/favicon.png', // png, ico, svg or webp
	theme: {
		preset: 'default',
		accentColor: '#58a6ff',
		logo: 'MY DOCS', // header text, defaults to the title
		vars: {},
		customCss: '',
	},
});
```

`basePath` should match the path you mount the middleware on. The favicon is
served at `<basePath>/favicon.<ext>`, and its path is read from where you run
the server.

## Callouts

A blockquote is rendered as a callout:

```markdown
> Use these for tips, warnings and notes.
```

## Development

```bash
bun install
bun run dev        # serves example/docs at http://localhost:3000
bun run typecheck
bun test
```

## License

MIT. See [CHANGELOG.md](CHANGELOG.md) for what changed in each version.
