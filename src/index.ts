import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import path from 'node:path'

import { buildNavTree, collectDocs } from './parser'
import { renderMarkdown } from './renderer'
import { renderPage } from './theme'

import type { DocsConfig, ParsedDoc } from './types'

export function docs(config: DocsConfig) {
    const app = new Hono()

    const basePath = config.basePath || '/docs'
    const docsDir = path.resolve(config.dir)

    const allDocs = collectDocs(docsDir)
    const nav = buildNavTree(docsDir, basePath)

    let pageConfig: DocsConfig = { ...config }

    if (config.favicon) {
        const ext = path.extname(config.favicon)

        const publicFaviconPath = `/favicon${ext}`

        app.use(`${publicFaviconPath}`, serveStatic({
            path: config.favicon
        }))

        pageConfig = {
            ...config,
            favicon: publicFaviconPath
        }
    }

    const routeMap = new Map<string, ParsedDoc>()

    for (const doc of allDocs) {
        const routePath = basePath.replace(/\/$/, '') + doc.routePath

        routeMap.set(routePath, doc)

        if (routePath.endsWith('/index')) {
            routeMap.set(
                routePath.replace(/\/index$/, '') || basePath,
                doc
            )
        }
    }

    app.get('/*', async (c) => {
        let currentPath =
            new URL(c.req.url).pathname.replace(/\/$/, '') || basePath

        if (currentPath === basePath.replace(/\/$/, '')) {
            currentPath = basePath.replace(/\/$/, '')
        }

        const doc = routeMap.get(currentPath)

        if (!doc) {
            return c.html(
                renderPage({
                    content: `<h1>404</h1><p>Page not found.</p>`,
                    nav,
                    title: '404',
                    currentPath,
                    config: pageConfig
                }),
                404
            )
        }

        const html = await renderMarkdown(doc.content)

        const title =
            doc.meta.title || path.basename(doc.filePath, '.md')

        return c.html(
            renderPage({
                content: html,
                nav,
                title,
                currentPath,
                config: pageConfig
            })
        )
    })

    return app
}

export type {
    DocsConfig,
    NavItem,
    ParsedDoc,
    DocMeta
} from './types'