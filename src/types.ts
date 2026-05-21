export interface DocsConfig {
    /** Directory containing markdown files */
    dir: string
    /** Site title shown in the header */
    title: string
    /** Base path the middleware is mounted on (default: '/docs') */
    basePath?: string
    /** Subtitle shown next to the logo in the header (default: 'docs') */
    subtitle?: string
    /** Version badge shown instead of subtitle (e.g. 'v1.0.0') */
    version?: string
    /** Theme overrides */
    theme?: ThemeConfig
    /** Path to favicon asset (png, ico, svg, etc.) */
    favicon?: string
}

export type ThemePreset = 'default' | 'catppuccin' | 'nord' | 'rose-pine' | 'synz'

export interface ThemeConfig {
    /** Built-in theme preset (default: 'default') */
    preset?: ThemePreset
    /** Primary accent color — overrides preset accent */
    accentColor?: string
    /** Site logo text (default: same as title) */
    logo?: string
    /** Raw CSS variable overrides injected into :root */
    vars?: Record<string, string>
    /** Arbitrary CSS injected after base styles */
    customCss?: string
}

export interface NavItem {
    /** Display label in sidebar */
    label: string
    /** Route path relative to basePath */
    path: string
    /** Nested items for directory groups */
    children?: NavItem[]
    /** Sort order from frontmatter */
    order?: number
    /** Parent section label for prev/next navigation */
    parentLabel?: string
}

export interface ParsedDoc {
    /** Frontmatter data */
    meta: DocMeta
    /** Raw markdown content (frontmatter stripped) */
    content: string
    /** File path relative to docs dir */
    filePath: string
    /** Route path */
    routePath: string
}

export interface DocMeta {
    /** Page title (falls back to filename) */
    title?: string
    /** Short description shown in meta tags */
    description?: string
    /** Sort order in sidebar */
    order?: number
    /** Hide from sidebar */
    hidden?: boolean
}