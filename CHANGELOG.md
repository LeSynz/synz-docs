# Changelog

## 0.5.0

- Requires Bun 1.4 or later
- Fixed code blocks in languages outside the built-in list, or with extra words after the language, rendering as unescaped HTML
- Fixed inline markdown in headings (code, emphasis, links) showing as raw text, and made heading ids unique within a page
- Fixed markdown inside callouts showing as raw text
- Fixed the favicon link being `undefined/favicon.png` when `basePath` wasn't set
- Fixed the home page not being highlighted in the sidebar and linking to itself as the next page. It now lives at the base path, so `/docs/index` no longer resolves
- Fixed the previous and next links showing on the 404 page
- `description` frontmatter now sets the page's meta description
- Page titles, labels and config text are escaped
- The header and code blocks now follow the selected theme
- Added a menu for small screens, where the sidebar used to disappear
- `customCss` now comes after the theme styles instead of before the synz extras
- Docs are read once at startup instead of twice
- CSS moved out of the TypeScript into `src/styles`

## 0.4.0

- Favicon support: the file is served under the docs route and linked in the page head
- Supports `.png`, `.ico`, `.svg` and `.webp`

## 0.3.0

- Added the `synz` theme preset
- Added the `subtitle` and `version` options

## 0.2.0

- Added the `catppuccin`, `nord` and `rose-pine` presets
- Prev/next links now show the section name
- `accentColor` now overrides the preset's accent and leaves the rest of the theme alone

## 0.1.0

- First release
