---
title: Introduction
order: 1
---

# synz-docs

This site is served by synz-docs itself. Every page is a markdown file in
`example/docs`, and the sidebar is built from that folder.

> Files are read when the server starts, so restart it after you edit one.

## What it does

- Turns a folder of markdown files into a documentation site
- Highlights code with Shiki
- Builds the sidebar and the previous/next links for you
- Ships a few themes you can switch between with one option

```typescript
import { Hono } from 'hono';
import { docs } from 'synz-docs';

const app = new Hono();

app.route('/docs', docs({ dir: './docs', title: 'My Project' }));

export default app;
```
