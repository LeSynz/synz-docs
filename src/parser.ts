import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { NavItem, ParsedDoc } from './types'

function fileToLabel(filename: string): string {
    return filename
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

function fileToRoute(filePath: string, docsDir: string): string {
    return '/' + path.relative(docsDir, filePath)
        .replace(/\\/g, '/')
        .replace(/\.md$/, '')
        .replace(/\/index$/, '')
        || '/'
}

export function parseDoc(filePath: string, docsDir: string): ParsedDoc {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    return {
        meta: {
            title: data.title,
            description: data.description,
            order: data.order,
            hidden: data.hidden ?? false
        },
        content,
        filePath,
        routePath: fileToRoute(filePath, docsDir)
    }
}

export function buildNavTree(docsDir: string, basePath: string, currentDir = docsDir): NavItem[] {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    const items: NavItem[] = []

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)

        if (entry.isDirectory()) {
            const children = buildNavTree(docsDir, basePath, fullPath)
            if (children.length === 0) continue

            items.push({
                label: fileToLabel(entry.name),
                path: '',
                children,
                order: Infinity
            })
            continue
        }

        if (!entry.name.endsWith('.md')) continue

        const doc = parseDoc(fullPath, docsDir)
        if (doc.meta.hidden) continue

        const routePath = basePath.replace(/\/$/, '') + doc.routePath

        items.push({
            label: doc.meta.title || fileToLabel(entry.name),
            path: routePath,
            order: doc.meta.order ?? Infinity
        })
    }

    return items.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
}

export function collectDocs(docsDir: string, currentDir = docsDir): ParsedDoc[] {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    const docs: ParsedDoc[] = []

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)

        if (entry.isDirectory()) {
            docs.push(...collectDocs(docsDir, fullPath))
            continue
        }

        if (!entry.name.endsWith('.md')) continue
        docs.push(parseDoc(fullPath, docsDir))
    }

    return docs
}