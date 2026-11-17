import { expect, test } from 'bun:test';
import path from 'node:path';
import { buildNavTree, collectDocs, parseDoc, routeToUrl } from '../src/parser';

const dir = path.join(import.meta.dir, 'fixtures/docs');
const nav = () => buildNavTree(collectDocs(dir), dir, '/docs');

test('reads frontmatter and strips it from the content', () => {
	const doc = parseDoc(path.join(dir, 'guide.md'), dir);

	expect(doc.meta).toMatchObject({ title: 'Guide', order: 2, description: 'A short guide', hidden: false });
	expect(doc.content).not.toContain('order: 2');
	expect(doc.content).toContain('# Guide');
});

test('hidden defaults to false', () => {
	expect(parseDoc(path.join(dir, 'api/overview.md'), dir).meta.hidden).toBe(false);
	expect(parseDoc(path.join(dir, 'secret.md'), dir).meta.hidden).toBe(true);
});

test('routes follow the folder structure', () => {
	expect(parseDoc(path.join(dir, 'guide.md'), dir).routePath).toBe('/guide');
	expect(parseDoc(path.join(dir, 'api/overview.md'), dir).routePath).toBe('/api/overview');
});

test('index files take the route of their folder', () => {
	expect(parseDoc(path.join(dir, 'index.md'), dir).routePath).toBe('/');
	expect(parseDoc(path.join(dir, 'api/index.md'), dir).routePath).toBe('/api');
});

test('collects every markdown file, hidden ones included', () => {
	const routes = collectDocs(dir)
		.map((doc) => doc.routePath)
		.sort();

	expect(routes).toEqual(['/', '/api', '/api/endpoints', '/api/overview', '/guide', '/secret']);
});

test('builds URLs from the base path', () => {
	expect(routeToUrl('/docs', '/')).toBe('/docs');
	expect(routeToUrl('/docs/', '/guide')).toBe('/docs/guide');
	expect(routeToUrl('/', '/')).toBe('/');
	expect(routeToUrl('/', '/guide')).toBe('/guide');
});

test('the nav leaves out hidden pages', () => {
	const labels = nav().map((item) => item.label);

	expect(labels).not.toContain('Secret');
});

test('the nav sorts by order, with unordered items last', () => {
	const labels = nav().map((item) => item.label);

	expect(labels).toEqual(['Home', 'Guide', 'Api']);
});

test('the home page links to the base path', () => {
	const home = nav().find((item) => item.label === 'Home');

	expect(home?.path).toBe('/docs');
});

test('folders become groups named after the folder', () => {
	const group = nav().find((item) => item.label === 'Api');

	expect(group?.children?.map((child) => child.path)).toEqual([
		'/docs/api/endpoints',
		'/docs/api',
		'/docs/api/overview',
	]);
});
