---
title: Options
order: 1
---

# Options

| Option | Type | Notes |
| --- | --- | --- |
| `dir` | string | Folder of markdown files. Required. |
| `title` | string | Shown in the header and the page title. Required. |
| `basePath` | string | Where the middleware is mounted. Defaults to `/docs`. |
| `subtitle` | string | Text next to the logo. Defaults to `docs`. |
| `version` | string | A version badge, shown instead of the subtitle. |
| `favicon` | string | Path to an image file. |
| `theme` | object | See below. |

## Theme

```typescript
docs({
	dir: './docs',
	title: 'My Project',
	theme: {
		preset: 'nord',
		accentColor: '#a3be8c',
	},
});
```

The presets are `default`, `catppuccin`, `nord`, `rose-pine` and `synz`.
`accentColor` only replaces the accent, and `vars` and `customCss` let you go
further.
