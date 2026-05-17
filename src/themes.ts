import type { ThemePreset } from './types'

export interface ThemeVars {
    accent: string
    bg: string
    bgSecondary: string
    bgTertiary: string
    border: string
    borderSubtle: string
    text: string
    textSecondary: string
    textTertiary: string
}

export const presets: Record<ThemePreset, ThemeVars> = {
    default: {
        accent: '#58a6ff',
        bg: '#0d1117',
        bgSecondary: '#161b22',
        bgTertiary: '#1c2128',
        border: '#30363d',
        borderSubtle: '#21262d',
        text: '#e6edf3',
        textSecondary: '#8b949e',
        textTertiary: '#6e7681'
    },
    catppuccin: {
        accent: '#cba6f7',
        bg: '#1e1e2e',
        bgSecondary: '#181825',
        bgTertiary: '#313244',
        border: '#45475a',
        borderSubtle: '#313244',
        text: '#cdd6f4',
        textSecondary: '#a6adc8',
        textTertiary: '#6c7086'
    },
    nord: {
        accent: '#88c0d0',
        bg: '#2e3440',
        bgSecondary: '#3b4252',
        bgTertiary: '#434c5e',
        border: '#4c566a',
        borderSubtle: '#434c5e',
        text: '#eceff4',
        textSecondary: '#d8dee9',
        textTertiary: '#4c566a'
    },
    'rose-pine': {
        accent: '#c4a7e7',
        bg: '#191724',
        bgSecondary: '#1f1d2e',
        bgTertiary: '#26233a',
        border: '#403d52',
        borderSubtle: '#26233a',
        text: '#e0def4',
        textSecondary: '#908caa',
        textTertiary: '#6e6a86'
    }
}