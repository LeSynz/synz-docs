import { describe, expect, test } from 'bun:test';
import { Hono } from 'hono';
import path from 'node:path';
import { docs } from '../src';
import type { DocsConfig } from '../src';

const dir = path.join(import.meta.dir, 'fixtures/docs');

function request(url: string, config: Partial<DocsConfig> = {}) {
	const app = new Hono();
	app.route('/docs', docs({ dir, title: 'Test', basePath: '/docs', ...config }));
	return app.request(url);
}

const html = async (url: string, config: Partial<DocsConfig> = {}) => (await request(url, config)).text();

describe('routing', () => {
	test('serves the index page at the base path', async () => {
		const res = await request('/docs');

		expect(res.status).toBe(200);
		expect(await res.text()).toContain('<title>Home | Test</title>');
	});

	test('serves nested pages', async () => {
		expect((await request('/docs/api/overview')).status).toBe(200);
		expect((await request('/docs/api')).status).toBe(200);
	});

	test('ignores a trailing slash', async () => {
		expect((await request('/docs/guide/')).status).toBe(200);
	});

	test('uses the file name when a page has no title', async () => {
		expect(await html('/docs/api/overview')).toContain('<title>overview | Test</title>');
	});

	test('returns 404 for unknown pages', async () => {
		const res = await request('/docs/nope');

		expect(res.status).toBe(404);
		expect(await res.text()).toContain('Page not found');
	});

	test('hidden pages load but stay out of the sidebar', async () => {
		expect((await request('/docs/secret')).status).toBe(200);
		expect(await html('/docs')).not.toContain('href="/docs/secret"');
	});
});

describe('navigation', () => {
	test('marks the current page in the sidebar', async () => {
		expect(await html('/docs/guide')).toMatch(/class="nav-link active">Guide</);
	});

	test('marks the home page too', async () => {
		expect(await html('/docs')).toMatch(/href="\/docs" class="nav-link active">Home</);
	});

	test('links to the previous and next page', async () => {
		const page = await html('/docs/guide');

		expect(page).toMatch(/doc-nav-prev[\s\S]*?Home/);
		expect(page).toMatch(/doc-nav-next[\s\S]*?Endpoints/);
	});

	test('the home page has no previous page and never links to itself', async () => {
		const page = await html('/docs');

		expect(page).not.toContain('class="doc-nav-btn doc-nav-prev');
		expect(page).toContain('href="/docs/guide" class="doc-nav-btn doc-nav-next"');
	});

	test('the 404 page has no previous or next links', async () => {
		const page = await html('/docs/nope');

		expect(page).not.toContain('class="doc-nav-btn');
	});

	test('includes a menu for small screens', async () => {
		expect(await html('/docs')).toContain('<details class="mobile-nav">');
	});
});

describe('rendering', () => {
	test('highlights code blocks', async () => {
		expect(await html('/docs')).toContain('class="shiki');
	});

	test('adds a meta description from the frontmatter', async () => {
		expect(await html('/docs/guide')).toContain('<meta name="description" content="A short guide">');
		expect(await html('/docs')).not.toContain('name="description"');
	});

	test('escapes the site title', async () => {
		const page = await html('/docs', { title: '<b>Site</b>' });

		expect(page).toContain('&lt;b&gt;Site&lt;/b&gt;');
		expect(page).not.toContain('<b>Site</b>');
	});
});

describe('favicon', () => {
	const favicon = path.relative(process.cwd(), path.join(import.meta.dir, 'fixtures/favicon.svg'));

	test('is linked under the base path', async () => {
		expect(await html('/docs', { favicon })).toContain('<link rel="icon" href="/docs/favicon.svg">');
	});

	test('works without an explicit base path', async () => {
		const app = new Hono();
		app.route('/docs', docs({ dir, title: 'Test', favicon }));

		const page = await (await app.request('/docs')).text();

		expect(page).toContain('<link rel="icon" href="/docs/favicon.svg">');
		expect(page).not.toContain('undefined');
	});

	test('is served', async () => {
		expect((await request('/docs/favicon.svg', { favicon })).status).toBe(200);
	});
});

describe('theme', () => {
	test('applies a preset', async () => {
		expect(await html('/docs', { theme: { preset: 'nord' } })).toContain('--bg: #2e3440');
	});

	test('accentColor overrides the preset accent only', async () => {
		const page = await html('/docs', { theme: { preset: 'nord', accentColor: '#ff0000' } });

		expect(page).toContain('--accent: #ff0000');
		expect(page).toContain('--bg: #2e3440');
	});

	test('code blocks follow the preset', async () => {
		expect(await html('/docs', { theme: { preset: 'nord' } })).toContain('class="shiki nord"');
	});

	test('the header follows the theme background', async () => {
		expect(await html('/docs', { theme: { preset: 'nord' } })).not.toContain('rgba(13, 17, 23');
	});

	test('custom CSS comes after the preset styles', async () => {
		const page = await html('/docs', { theme: { preset: 'synz', customCss: '.mine { color: red; }' } });

		expect(page.indexOf('.mine')).toBeGreaterThan(page.indexOf('.scanlines'));
	});

	test('the synz grid sits behind the page content', async () => {
		const page = await html('/docs', { theme: { preset: 'synz' } });

		expect(page).toMatch(/\.grid-bg \{[^}]*z-index: -1/);
	});

	test('a version replaces the subtitle', async () => {
		const page = await html('/docs', { version: 'v1.2.3', subtitle: 'ignored' });

		expect(page).toContain('<span class="header-version">v1.2.3</span>');
		expect(page).not.toContain('ignored');
	});

	test('the subtitle defaults to "docs"', async () => {
		expect(await html('/docs')).toContain('<span class="header-title">docs</span>');
	});
});
