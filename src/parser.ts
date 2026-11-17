import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { NavItem, ParsedDoc } from './types';

type NavGroup = NavItem & { children: NavItem[] };

function fileToLabel(filename: string): string {
	return filename
		.replace(/\.md$/, '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileToRoute(filePath: string, docsDir: string): string {
	const route = path
		.relative(docsDir, filePath)
		.replace(/\\/g, '/')
		.replace(/\.md$/, '')
		.replace(/(^|\/)index$/, '');

	return '/' + route;
}

/** The URL a route is served at, given where the middleware is mounted. */
export function routeToUrl(basePath: string, routePath: string): string {
	const base = basePath.replace(/\/$/, '');
	return (routePath === '/' ? base : base + routePath) || '/';
}

export function parseDoc(filePath: string, docsDir: string): ParsedDoc {
	const raw = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(raw);

	return {
		meta: {
			title: data.title,
			description: data.description,
			order: data.order,
			hidden: data.hidden ?? false,
		},
		content,
		filePath,
		routePath: fileToRoute(filePath, docsDir),
	};
}

export function collectDocs(docsDir: string, currentDir = docsDir): ParsedDoc[] {
	const docs: ParsedDoc[] = [];

	for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
		const fullPath = path.join(currentDir, entry.name);

		if (entry.isDirectory()) {
			docs.push(...collectDocs(docsDir, fullPath));
		} else if (entry.name.endsWith('.md')) {
			docs.push(parseDoc(fullPath, docsDir));
		}
	}

	return docs;
}

const rank = (item: NavItem) => item.order ?? Number.MAX_VALUE;

function sortNav(items: NavItem[]) {
	items.sort((a, b) => rank(a) - rank(b) || a.label.localeCompare(b.label));
	for (const item of items) {
		if (item.children) sortNav(item.children);
	}
}

export function buildNavTree(docs: ParsedDoc[], docsDir: string, basePath: string): NavItem[] {
	const root: NavItem[] = [];
	const groups = new Map<string, NavGroup>();

	for (const doc of docs) {
		if (doc.meta.hidden) continue;

		let siblings = root;
		let folderPath = '';

		for (const folder of path.relative(docsDir, path.dirname(doc.filePath)).split(path.sep)) {
			if (!folder) continue;

			folderPath = path.join(folderPath, folder);
			let group = groups.get(folderPath);
			if (!group) {
				group = { label: fileToLabel(folder), path: '', children: [] };
				groups.set(folderPath, group);
				siblings.push(group);
			}
			siblings = group.children;
		}

		siblings.push({
			label: doc.meta.title || fileToLabel(path.basename(doc.filePath)),
			path: routeToUrl(basePath, doc.routePath),
			order: doc.meta.order,
		});
	}

	sortNav(root);
	return root;
}
