---
title: Getting started
order: 2
---

# Getting started

Install it next to Hono:

```bash
bun add hono synz-docs
```

Put some markdown in a folder, then mount the middleware. The folder decides
the routes:

```
docs/
  index.md            /docs
  getting-started.md  /docs/getting-started
  reference/
    config.md         /docs/reference/config
```

Folders become sidebar sections, and files become pages. A page's title and
position come from its frontmatter:

```markdown
---
title: Getting started
order: 2
---
```

Pages without an `order` go after the ones that have one.
