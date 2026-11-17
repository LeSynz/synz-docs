import { describe, expect, test } from 'bun:test';
import { renderMarkdown } from '../src/renderer';

describe('headings', () => {
	test('render inline markdown', async () => {
		const html = await renderMarkdown('## Using `docs()`');

		expect(html).toContain('<code>docs()</code>');
		expect(html).not.toContain('`');
	});

	test('get a clean id', async () => {
		const html = await renderMarkdown('## Using `docs()`');

		expect(html).toContain('id="using-docs"');
	});

	test('repeated headings get unique ids', async () => {
		const html = await renderMarkdown('## Setup\n\n## Setup\n\n## Setup');

		expect(html).toContain('id="setup"');
		expect(html).toContain('id="setup-1"');
		expect(html).toContain('id="setup-2"');
	});

	test('ids start fresh for every page', async () => {
		await renderMarkdown('## Setup');

		expect(await renderMarkdown('## Setup')).toContain('id="setup"');
	});
});

describe('callouts', () => {
	test('render markdown inside the blockquote', async () => {
		const html = await renderMarkdown('> **Heads up**, see [the docs](https://example.com)');

		expect(html).toContain('<blockquote class="doc-callout">');
		expect(html).toContain('<strong>Heads up</strong>');
		expect(html).toContain('<a href="https://example.com">the docs</a>');
	});
});

describe('code blocks', () => {
	test('are highlighted', async () => {
		expect(await renderMarkdown('```typescript\nconst a = 1\n```')).toContain('class="shiki');
	});

	test('are highlighted for languages outside the usual few', async () => {
		const html = await renderMarkdown('```tsx\nconst a = <div />\n```');

		expect(html).toContain('class="shiki');
		expect(html).toContain('<span style=');
	});

	test('ignore extra words after the language', async () => {
		const html = await renderMarkdown('```typescript title="a.ts"\nconst a = 1\n```');

		expect(html).toContain('class="shiki');
	});

	test('with an unknown language still show the code, escaped', async () => {
		const html = await renderMarkdown('```notalanguage\n<script>alert(1)</script>\n```');

		expect(html).toContain('&#x3C;script>');
		expect(html).not.toContain('<script>');
	});

	test('without a language are plain text', async () => {
		const html = await renderMarkdown('```\n<b>hi</b>\n```');

		expect(html).toContain('&#x3C;b>hi');
		expect(html).not.toContain('<b>hi</b>');
	});

	test('use the theme they are given', async () => {
		expect(await renderMarkdown('```js\n1\n```', 'nord')).toContain('class="shiki nord"');
	});
});
