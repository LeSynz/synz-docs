import baseCss from './styles/base.css' with { type: 'text' };
import synzCss from './styles/synz.css' with { type: 'text' };
import { escapeHtml } from './escape';
import { presets } from './themes';
import type { DocsConfig, NavItem } from './types';

function flattenNav(items: NavItem[], parentLabel = ''): NavItem[] {
	return items.flatMap((item) =>
		item.children ? flattenNav(item.children, item.label) : [{ ...item, parentLabel }],
	);
}

function renderNavItems(items: NavItem[], currentPath: string, depth = 0): string {
	return items
		.map((item) => {
			if (item.children?.length) {
				return `<li class="nav-group" style="--depth: ${depth}">
					<div class="nav-group-label">${escapeHtml(item.label)}</div>
					<ul class="nav-group-items">${renderNavItems(item.children, currentPath, depth + 1)}</ul>
				</li>`;
			}

			const active = item.path === currentPath ? ' active' : '';
			return `<li><a href="${escapeHtml(item.path)}" class="nav-link${active}">${escapeHtml(item.label)}</a></li>`;
		})
		.join('');
}

function pageLink(item: NavItem | undefined, direction: 'prev' | 'next'): string {
	if (!item) return '<div></div>';

	const section = item.parentLabel ? `${escapeHtml(item.parentLabel)} - ` : '';
	return `<a href="${escapeHtml(item.path)}" class="doc-nav-btn doc-nav-${direction}">
		<span class="doc-nav-label">${direction === 'prev' ? 'Previous' : 'Next'}</span>
		<span class="doc-nav-title">${section}${escapeHtml(item.label)}</span>
	</a>`;
}

export function renderPage(options: {
	content: string;
	nav: NavItem[];
	title: string;
	description?: string;
	currentPath: string;
	config: DocsConfig;
}): string {
	const { content, nav, title, description, currentPath, config } = options;

	const presetName = config.theme?.preset || 'default';
	const preset = presets[presetName];
	const accent = config.theme?.accentColor || preset.accent;
	const isSynz = presetName === 'synz';

	const siteTitle = escapeHtml(config.title);
	const logo = escapeHtml(config.theme?.logo || config.title);
	const basePath = config.basePath || '/docs';

	const headerRight = config.version
		? `<span class="header-version">${escapeHtml(config.version)}</span>`
		: `<div class="header-divider"></div><span class="header-title">${escapeHtml(config.subtitle || 'docs')}</span>`;

	const faviconTag = config.favicon
		? `<link rel="icon" href="${escapeHtml(config.favicon)}">`
		: '';

	const descriptionTag = description
		? `<meta name="description" content="${escapeHtml(description)}">`
		: '';

	const fonts = isSynz
		? 'family=Share+Tech+Mono&family=Syne:wght@400;700;800'
		: 'family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500';

	const fontVars = isSynz
		? `--font: 'Share Tech Mono', monospace;
			--font-mono: 'Share Tech Mono', monospace;
			--font-display: 'Syne', sans-serif;`
		: `--font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
			--font-mono: 'JetBrains Mono', 'Fira Code', monospace;`;

	const customVars = Object.entries(config.theme?.vars ?? {})
		.map(([name, value]) => `${name}: ${value};`)
		.join('\n');

	const flat = flattenNav(nav).filter((item) => item.path);
	const index = flat.findIndex((item) => item.path === currentPath);
	const prev = index > 0 ? flat[index - 1] : undefined;
	const next = index >= 0 ? flat[index + 1] : undefined;

	const navHtml = `<ul class="nav-root">${renderNavItems(nav, currentPath)}</ul>`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${escapeHtml(title)} | ${siteTitle}</title>
	${descriptionTag}
	${faviconTag}
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
	<style>
		:root {
			--accent: ${accent};
			--accent-hover: color-mix(in srgb, ${accent} 80%, white);
			--accent-subtle: color-mix(in srgb, ${accent} 12%, transparent);
			--bg: ${preset.bg};
			--bg-secondary: ${preset.bgSecondary};
			--bg-tertiary: ${preset.bgTertiary};
			--border: ${preset.border};
			--border-subtle: ${preset.borderSubtle};
			--text: ${preset.text};
			--text-secondary: ${preset.textSecondary};
			--text-tertiary: ${preset.textTertiary};
			${fontVars}
			${customVars}
		}
${baseCss}
${isSynz ? synzCss : ''}
${config.theme?.customCss ?? ''}
	</style>
</head>
<body>
	${isSynz ? '<div class="scanlines"></div><div class="grid-bg"></div>' : ''}
	<header>
		<a href="${escapeHtml(basePath)}" class="header-logo">
			<span class="logo-accent">${logo}</span>
		</a>
		${headerRight}
	</header>

	<div class="layout">
		<aside class="sidebar">
			<nav>${navHtml}</nav>
		</aside>

		<main class="content">
			<details class="mobile-nav">
				<summary>Menu</summary>
				<nav>${navHtml}</nav>
			</details>
			<div class="doc-content">
				${content}
			</div>
			<div class="doc-nav-footer">
				${pageLink(prev, 'prev')}
				${pageLink(next, 'next')}
			</div>
		</main>
	</div>
</body>
</html>`;
}
