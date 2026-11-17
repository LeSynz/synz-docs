import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import path from 'node:path';

import { buildNavTree, collectDocs, routeToUrl } from './parser';
import { renderMarkdown } from './renderer';
import { renderPage } from './theme';
import { presets } from './themes';

import type { DocsConfig, ParsedDoc } from './types';

export function docs(config: DocsConfig) {
	const app = new Hono();

	const basePath = config.basePath || '/docs';
	const docsDir = path.resolve(config.dir);

	const allDocs = collectDocs(docsDir);
	const nav = buildNavTree(allDocs, docsDir, basePath);
	const codeTheme = presets[config.theme?.preset ?? 'default'].codeTheme;

	let pageConfig: DocsConfig = { ...config, basePath };

	if (config.favicon) {
		const publicFaviconPath = `/favicon${path.extname(config.favicon)}`;

		app.use(publicFaviconPath, serveStatic({ path: config.favicon }));

		pageConfig = { ...pageConfig, favicon: routeToUrl(basePath, publicFaviconPath) };
	}

	const routeMap = new Map<string, ParsedDoc>();

	for (const doc of allDocs) {
		routeMap.set(routeToUrl(basePath, doc.routePath), doc);
	}

	app.get('/*', async (c) => {
		const currentPath = new URL(c.req.url).pathname.replace(/\/$/, '') || '/';
		const doc = routeMap.get(currentPath);

		if (!doc) {
			return c.html(
				renderPage({
					content: '<h1>404</h1><p>Page not found.</p>',
					nav,
					title: '404',
					currentPath,
					config: pageConfig,
				}),
				404,
			);
		}

		const html = await renderMarkdown(doc.content, codeTheme);

		return c.html(
			renderPage({
				content: html,
				nav,
				title: doc.meta.title || path.basename(doc.filePath, '.md'),
				description: doc.meta.description,
				currentPath,
				config: pageConfig,
			}),
		);
	});

	return app;
}

export type { DocsConfig, NavItem, ParsedDoc, DocMeta } from './types';
