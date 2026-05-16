import { marked } from 'marked'
import { createHighlighter } from 'shiki'

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

async function getHighlighter() {
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-dark'],
            langs: [
                'typescript', 'javascript', 'json', 'bash',
                'html', 'css', 'markdown', 'sql', 'python',
                'yaml', 'toml', 'rust', 'go'
            ]
        })
    }
    return highlighter
}

export async function renderMarkdown(content: string): Promise<string> {
    const hl = await getHighlighter()

    const renderer = new marked.Renderer()

    renderer.code = ({ text, lang }) => {
        const language = lang || 'text'
        try {
            return hl.codeToHtml(text, {
                lang: language,
                theme: 'github-dark'
            })
        } catch {
            return `<pre><code>${text}</code></pre>`
        }
    }

    renderer.heading = ({ text, depth }) => {
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return `<h${depth} id="${id}">
            <a class="heading-anchor" href="#${id}">#</a>
            ${text}
        </h${depth}>`
    }

    renderer.blockquote = ({ text }) => {
        return `<blockquote class="doc-callout">${text}</blockquote>`
    }

    marked.use({ renderer })

    return await marked(content)
}