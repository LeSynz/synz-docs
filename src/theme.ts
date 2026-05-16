import type { NavItem, DocsConfig } from './types'

function renderNavItems(items: NavItem[], currentPath: string, depth = 0): string {
    return items.map(item => {
        if (item.children && item.children.length > 0) {
            return `
                <div class="nav-group" style="--depth: ${depth}">
                    <div class="nav-group-label">${item.label}</div>
                    <ul class="nav-group-items">
                        ${renderNavItems(item.children, currentPath, depth + 1)}
                    </ul>
                </div>`
        }

        const active = item.path === currentPath
        return `<li>
            <a href="${item.path}" class="nav-link ${active ? 'active' : ''}">${item.label}</a>
        </li>`
    }).join('')
}

export function renderPage(options: {
    content: string
    nav: NavItem[]
    title: string
    currentPath: string
    config: DocsConfig
}): string {
    const { content, nav, title, currentPath, config } = options
    const accent = config.theme?.accentColor || '#58a6ff'
    const logo = config.theme?.logo || config.title

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — ${config.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: ${accent};
            --accent-hover: color-mix(in srgb, ${accent} 80%, white);
            --accent-subtle: color-mix(in srgb, ${accent} 12%, transparent);
            --bg: #0d1117;
            --bg-secondary: #161b22;
            --bg-tertiary: #1c2128;
            --border: #30363d;
            --border-subtle: #21262d;
            --text: #e6edf3;
            --text-secondary: #8b949e;
            --text-tertiary: #6e7681;
            --code-bg: #161b22;
            --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: var(--font);
            min-height: 100vh;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        /* HEADER */
        header {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 50;
            height: 64px;
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            border-bottom: 1px solid var(--border-subtle);
            background: rgba(13, 17, 23, 0.95);
            backdrop-filter: blur(12px);
            gap: 1rem;
        }

        .header-logo {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text);
            text-decoration: none;
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .header-logo .logo-accent { color: var(--accent); }

        .header-divider {
            width: 1px;
            height: 20px;
            background: var(--border);
        }

        .header-title {
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 400;
        }

        /* LAYOUT */
        .layout {
            display: flex;
            padding-top: 64px;
            min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
            width: 272px;
            flex-shrink: 0;
            border-right: 1px solid var(--border-subtle);
            padding: 1.5rem 0;
            position: fixed;
            top: 64px;
            bottom: 0;
            overflow-y: auto;
            background: var(--bg);
        }

        .sidebar::-webkit-scrollbar { width: 3px; }
        .sidebar::-webkit-scrollbar-track { background: transparent; }
        .sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .nav-group {
            margin-bottom: 0.25rem;
            padding: 0 0.75rem;
        }

        .nav-group-label {
            font-size: 0.7rem;
            font-weight: 600;
            color: var(--text-tertiary);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.5rem 0.75rem 0.35rem;
            padding-left: calc(0.75rem + var(--depth, 0) * 0.75rem);
        }

        .nav-group-items { list-style: none; }

        .nav-link {
            display: block;
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-decoration: none;
            padding: 0.3rem 0.75rem;
            border-radius: 6px;
            transition: color 0.15s, background 0.15s;
            font-weight: 400;
        }

        .nav-link:hover {
            color: var(--text);
            background: var(--bg-tertiary);
        }

        .nav-link.active {
            color: var(--accent);
            background: var(--accent-subtle);
            font-weight: 500;
        }

        /* CONTENT */
        .content {
            flex: 1;
            margin-left: 272px;
            padding: 2.5rem 3rem 5rem;
            max-width: calc(272px + 780px);
            min-width: 0;
        }

        .doc-content {
            max-width: 720px;
        }

        /* MARKDOWN */
        .doc-content h1 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text);
            letter-spacing: -0.025em;
            line-height: 1.25;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border-subtle);
        }

        .doc-content h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text);
            letter-spacing: -0.015em;
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-subtle);
        }

        .doc-content h3 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text);
            margin-top: 1.75rem;
            margin-bottom: 0.5rem;
        }

        .heading-anchor {
            color: var(--text-tertiary);
            text-decoration: none;
            margin-right: 0.4rem;
            opacity: 0;
            transition: opacity 0.15s;
            font-weight: 400;
        }

        h1:hover .heading-anchor,
        h2:hover .heading-anchor,
        h3:hover .heading-anchor { opacity: 1; }

        .doc-content p {
            color: var(--text-secondary);
            line-height: 1.75;
            margin-bottom: 1rem;
            font-size: 0.9375rem;
        }

        .doc-content a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 500;
        }

        .doc-content a:hover { text-decoration: underline; }

        .doc-content ul, .doc-content ol {
            color: var(--text-secondary);
            font-size: 0.9375rem;
            line-height: 1.75;
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }

        .doc-content li { margin-bottom: 0.3rem; }

        .doc-content code {
            font-family: var(--font-mono);
            font-size: 0.8125rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 0.125rem 0.375rem;
            color: var(--text);
        }

        .doc-content pre {
            margin-bottom: 1.25rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
        }

        .doc-content pre code {
            background: none;
            border: none;
            padding: 0;
            border-radius: 0;
            font-size: 0.8125rem;
        }

        .doc-content .shiki {
            padding: 1.25rem 1.5rem;
            font-size: 0.8125rem;
            line-height: 1.7;
            overflow-x: auto;
            background: var(--bg-secondary) !important;
        }

        .doc-content blockquote.doc-callout {
            border-left: 3px solid var(--accent);
            background: var(--accent-subtle);
            padding: 0.875rem 1.125rem;
            margin-bottom: 1.25rem;
            border-radius: 0 6px 6px 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.7;
        }

        .doc-content table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
        }

        .doc-content th {
            text-align: left;
            color: var(--text-secondary);
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            padding: 0.625rem 1rem;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
        }

        .doc-content td {
            color: var(--text-secondary);
            padding: 0.625rem 1rem;
            border-bottom: 1px solid var(--border-subtle);
            vertical-align: top;
        }

        .doc-content tr:last-child td { border-bottom: none; }

        .doc-content hr {
            border: none;
            border-top: 1px solid var(--border-subtle);
            margin: 2rem 0;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .content { margin-left: 0; padding: 2rem 1.25rem; }
        }
    </style>
</head>
<body>
    <header>
        <a href="${config.basePath || '/docs'}" class="header-logo">
            <span class="logo-accent">${logo}</span>
        </a>
        <div class="header-divider"></div>
        <span class="header-title">docs</span>
    </header>

    <div class="layout">
        <aside class="sidebar">
            <nav>
                ${renderNavItems(nav, currentPath)}
            </nav>
        </aside>

        <main class="content">
            <div class="doc-content">
                ${content}
            </div>
        </main>
    </div>
</body>
</html>`
}