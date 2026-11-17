import { Marked } from 'marked';
import { bundledLanguages, createHighlighter } from 'shiki';
import type { BundledLanguage, BundledTheme, Highlighter } from 'shiki';
import { presets } from './themes';

const themes = [...new Set(Object.values(presets).map((preset) => preset.codeTheme))];

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
	highlighter ??= createHighlighter({ themes, langs: [] });
	return highlighter;
}

function isBundled(lang: string): lang is BundledLanguage {
	return Object.hasOwn(bundledLanguages, lang);
}

// The info string can carry more than a language, like ```ts title="a.ts"
const languageOf = (info: string | undefined) => info?.trim().split(/\s+/)[0] ?? '';

function slugify(html: string): string {
	const slug = html
		.replace(/<[^>]*>/g, '')
		.replace(/&(?:amp|lt|gt|quot|#39);/g, ' ')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

	return slug || 'section';
}

export async function renderMarkdown(content: string, theme: BundledTheme = 'github-dark'): Promise<string> {
	const hl = await getHighlighter();
	const seen = new Map<string, number>();

	const md = new Marked({
		renderer: {
			code({ text, lang }) {
				const language = languageOf(lang);
				return hl.codeToHtml(text, { lang: isBundled(language) ? language : 'text', theme });
			},

			heading({ tokens, depth }) {
				const html = this.parser.parseInline(tokens);
				const slug = slugify(html);
				const count = seen.get(slug) ?? 0;
				seen.set(slug, count + 1);

				const id = count ? `${slug}-${count}` : slug;
				return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}">#</a>${html}</h${depth}>\n`;
			},

			blockquote({ tokens }) {
				return `<blockquote class="doc-callout">${this.parser.parse(tokens)}</blockquote>\n`;
			},
		},
	});

	const tokens = md.lexer(content);

	// Languages load on demand, so find the ones this page uses before rendering.
	const languages = new Set<BundledLanguage>();
	md.walkTokens(tokens, (token) => {
		if (token.type !== 'code') return;
		const language = languageOf(token.lang);
		if (isBundled(language)) languages.add(language);
	});
	await Promise.all([...languages].map((language) => hl.loadLanguage(language)));

	return md.parser(tokens);
}
